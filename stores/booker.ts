import { useUserStore } from '#imports';
import { Seiue } from '~/lib/seiue';
import { Booker } from '~/lib/booker';
import type { TNewOrderInput, TOrderStoreItem, TSortOptions, TVenueList } from '~/types';

export const useBookerStore = defineStore('booker', () => {
  const userStore = useUserStore();
  const orderList = ref<(TOrderStoreItem)[]>([]);
  const venueList = ref<TVenueList>();
  const orderIndexer = ref(0);
  const sortOptions = ref<TSortOptions>({
    firstSortBy: 'floor',
    buildingOrder: ['B', 'C', 'A', 'D'],
  });

  async function addOrder(order: TNewOrderInput) {
    if (!venueList.value)
      return;
    orderList.value.push({
      orderIndexer: ++orderIndexer.value,
      ...(await Booker.generateOrder(order, venueList.value)),
    });
  }

  function getOrder(indexer: number | undefined) {
    if (indexer === undefined)
      return;
    const order = orderList.value.find(order => order.orderIndexer === indexer);
    if (!order)
      return;
    return {
      capacity: order.capacity,
      description: order.description,
      startTime: order.timeRanges.startAt,
      endTime: order.timeRanges.endAt,
    };
  }

  function removeOrder(indexer: number) {
    // first remove preallocated times from the venue
    const order = orderList.value.find(order => order.orderIndexer === indexer);
    if (!order)
      return;
    const venue = venueList.value?.find(venue => venue.id === order.venue.id);
    if (!venue)
      return;
    venue.preallocatedTimes = (venue.preallocatedTimes ?? [])
      .filter(timeRange =>
        timeRange.startAt !== order.timeRanges.startAt
        && timeRange.endAt !== order.timeRanges.endAt,
      );
    // then remove the order from the order list
    orderList.value = orderList.value.filter(order => order.orderIndexer !== indexer);
  }

  function clearOrderList() {
    orderList.value = [];
  }

  async function updateOrder(indexer: number, order: TNewOrderInput) {
    removeOrder(indexer);
    await addOrder(order);
  }

  async function fetchVenueList() {
    if (!userStore.loggedIn)
      return;
    const seiue = new Seiue(userStore.accessToken as string, userStore.activeReflectionId as number);
    venueList.value = Booker.sortVenues(await seiue.getVenueList(), sortOptions.value);
  }

  function clearVenueList() {
    venueList.value = undefined;
  }

  async function sendOrder() {
    if (!userStore.loggedIn
      || !userStore.accessToken
      || !userStore.activeReflectionId
      || !(await Seiue.checkTokenStatus(userStore.accessToken))
      || orderList.value.length === 0
    )
      return;
    const seiue = new Seiue(userStore.accessToken, userStore.activeReflectionId);
    const booker = new Booker(seiue);
    return await booker.sendOrder(orderList.value);
  }

  watch(sortOptions, () => {
    if (venueList.value)
      venueList.value = Booker.sortVenues(venueList.value, sortOptions.value);
  }, { deep: true });

  return {
    orderList,
    venueList,
    sortOptions,
    getOrder,
    removeOrder,
    addOrder,
    sendOrder,
    clearOrderList,
    updateOrder,
    fetchVenueList,
    clearVenueList,
  };
}, {
  persist: {
    storage: persistedState.localStorage,
  },
});
