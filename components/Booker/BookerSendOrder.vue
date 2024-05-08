<template>
  <Button
    class="w-full flex items-center justify-center gap-x-4 font-bold text-lg py-4" :disabled="isSendButtonDisabled"
    @click="handleClick"
  >
    <Icon v-if="isSending" icon="ph-spinner" class="h-5 w-5 animate-spin" />
    发送预约
  </Button>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import { useSendOrderResultDialog } from '~/composables/dialog';

const bookerStore = useBookerStore();
const userStore = useUserStore();

const isSending = ref(false);
const isSendButtonDisabled = computed(() =>
  bookerStore.orderList.length === 0
  || isSending.value
  || !userStore.loggedIn,
);

async function handleClick() {
  isSending.value = true;
  const result = await bookerStore.sendOrder();
  if (result) {
    useSendOrderResultDialog(result);
    isSending.value = false;
    const failedOrders = result.flatMap((resultItem) => {
      return resultItem.success ? [] : [resultItem.order];
    }).filter(Boolean);
    // keep failed orders in the order list and remove other orders
    bookerStore.orderList = bookerStore.orderList.filter((order) => {
      const { orderIndexer: _, ...orderWithoutIndexer } = order;
      return failedOrders.includes(orderWithoutIndexer);
    });
  } else {
    isSending.value = false;
    toast.error('发送失败');
  }
}
</script>
