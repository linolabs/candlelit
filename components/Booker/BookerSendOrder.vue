<template>
  <Button
    class="w-full flex items-center justify-center gap-x-4 font-bold text-lg py-4" :disabled="isSendButtonDisabled"
    @click="handleClick"
  >
    <Icon v-if="isSending" icon="ph-spinner" class="h-5 w-5 animate-spin" />
    发送预约
  </Button>
  <Dialog v-if="sendResult" v-model:open="isOpen">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>发送预约结果</DialogTitle>
      </DialogHeader>
      <h5>
        本次共发送
        <span class="font-bold">{{ sendResult.length }}</span>
        个预约，其中成功
        <span class="font-bold text-green-500">{{ sendResult.filter(result => result.success).length }}</span>
        个，失败
        <span class="font-bold text-red-500">{{ sendResult.filter(result => !result.success).length }}</span>
        个。
      </h5>
      <div v-if="sendResult.filter(result => !result.success).length" class="space-y-1">
        <h5 class="font-bold text-base">
          失败的预约
        </h5>
        <div class="border border-primary rounded-md py-2 grid grid-cols-1 gap-y-2 justify-items-center justift-center">
          <template v-for="(result, index) in sendResult" :key="index">
            <BookerOrderCard v-if="!result.success" :order="result.order" :no-edit="true" />
          </template>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { TSendOrderResult } from '~/types';

const bookerStore = useBookerStore();
const userStore = useUserStore();

const [isOpen, toggleOpen] = useToggle();
const isSending = ref(false);
const isSendButtonDisabled = computed(() =>
  bookerStore.orderList.length === 0
  || isSending.value
  || !userStore.loggedIn,
);

const sendResult = ref<TSendOrderResult>();

async function handleClick() {
  isSending.value = true;
  sendResult.value = await bookerStore.sendOrder();
  if (sendResult.value) {
    toggleOpen();
    isSending.value = false;
    const failedOrders = sendResult.value.flatMap((resultItem) => {
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
