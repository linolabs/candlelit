import { toast } from 'vue-sonner';
import { useUserStore } from '#imports';
import { Seiue } from '~/lib/seiue';
import { Booker } from '~/lib/booker';
import type { TNewOrderInput, TOrderStoreItem, TSendOrderResultHistory, TSortOptions, TVenueList } from '~/types';

export const useBookerStore = defineStore('booker', () => {
  const userStore = useUserStore();
  const orderList = ref<(TOrderStoreItem)[]>([]);
  const venueList = ref<TVenueList>();
  const sendOrderResultHistory = ref<TSendOrderResultHistory>([]);
  const orderIndexer = ref(0);
  const isFetchingVenueList = ref(false);
  const lastCapacity = ref(15);
  const lastDescription = ref<string>('');
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
    lastCapacity.value = order.capacity;
    lastDescription.value = order.description;
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

  async function fetchVenueList(silent: boolean = true) {
    if (!userStore.loggedIn)
      return;
    isFetchingVenueList.value = true;
    if (!silent)
      toast.info('获取场地列表中...');
    const seiue = new Seiue({
      accessToken: userStore.accessToken as string,
      activeReflectionId: userStore.activeReflectionId as number,
    });
    try {
      venueList.value = Booker.sortVenues(await seiue.getVenueList(), sortOptions.value);
    } catch (e) {
      console.error(e);
      toast.error('获取场地列表失败，请刷新重试或联系开发者');
    }
    isFetchingVenueList.value = false;
  }

  function clearVenueList() {
    venueList.value = undefined;
  }

  function clearSendOrderResultHistory() {
    sendOrderResultHistory.value = [];
  }

  async function sendOrder() {
    if (!userStore.loggedIn
      || !userStore.accessToken
      || !userStore.activeReflectionId
      || !(await Seiue.checkTokenStatus(userStore.accessToken))
      || orderList.value.length === 0
    )
      return;
    const seiue = new Seiue({
      accessToken: userStore.accessToken,
      activeReflectionId: userStore.activeReflectionId,
    });
    const booker = new Booker(seiue);
    const result = await booker.sendOrder(orderList.value);
    sendOrderResultHistory.value.push({
      createdAt: nowInTimeString(),
      result,
    });
    return result;
  }

  watch(sortOptions, () => {
    if (venueList.value)
      venueList.value = Booker.sortVenues(venueList.value, sortOptions.value);
  }, { deep: true });

  return {
    orderList,
    venueList,
    lastCapacity,
    lastDescription,
    sortOptions,
    isFetchingVenueList,
    sendOrderResultHistory,
    getOrder,
    removeOrder,
    addOrder,
    sendOrder,
    clearOrderList,
    updateOrder,
    fetchVenueList,
    clearVenueList,
    clearSendOrderResultHistory,
  };
}, {
  persist: {
    storage: persistedState.localStorage,
  },
});
