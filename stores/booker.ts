import { useUserStore } from '#imports';
import { Seiue } from '~/lib/seiue';
import { Booker } from '~/lib/booker';
import type { TNewOrder, TNewOrderInput, TOrderStoreItem, TVenueList } from '~/types';

export const useBookerStore = defineStore('booker', () => {
  const userStore = useUserStore();
  const orderList = ref<(TOrderStoreItem)[]>([]);
  const venueList = ref<TVenueList>();
  const orderIndexer = ref(0);

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
    venueList.value = await seiue.getVenueList();
  }

  function clearVenueList() {
    venueList.value = undefined;
  }

  return {
    orderList,
    getOrder,
    removeOrder,
    addOrder,
    clearOrderList,
    updateOrder,
    venueList,
    fetchVenueList,
    clearVenueList,
  };
}, {
  persist: {
    storage: persistedState.localStorage,
  },
});
