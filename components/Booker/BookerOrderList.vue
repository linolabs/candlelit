<template>
  <div class="space-y-1 w-full h-auto">
    <h5 class="text-lg font-bold">
      预约列表
    </h5>
    <div class="rounded border border-primary shadow w-full px-4 py-4 grid grid-cols-1 justify-items-center gap-y-4">
      <Button
        class="border border-primary shadow-md w-10 h-10 sm:w-12 sm:h-12 p-2"
        variant="outline"
        @click="handleClick"
      >
        <Icon icon="ph:first-aid-duotone" class="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
      </Button>
      <div v-if="!bookerStore.orderList.length" class="grid grid-cols-1 justify-items-center justify-center grid grid-cols-1 gap-y-2">
        <Icon icon="ph:empty-duotone" class="w-10 h-10" />
        <span>暂无预约</span>
      </div>
      <template v-for="order in bookerStore.orderList" v-else :key="order.orderIndexer">
        <BookerOrderCard :order="order" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import { toast } from 'vue-sonner';
import { useOrderEditDialog } from '@/composables/dialog';

const bookerStore = useBookerStore();
const userStore = useUserStore();
function handleClick() {
  if (!userStore.loggedIn) {
    toast.error('请先登录');
    return;
  }
  if (bookerStore.isFetchingVenueList) {
    toast.error('正在加载场地列表，请稍等几秒');
    return;
  }
  useOrderEditDialog();
}
</script>
