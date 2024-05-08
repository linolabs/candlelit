<template>
  <UseTemplate v-slot="{ createdAt, result }">
    <div class="border border-primary rounded-md px-2 py-2 grid grid-cols-1 gap-y-2 justify-items-center justift-center">
      <h5> {{ df.format(parseDateTime(createdAt).toDate('Asia/shanghai')) }} </h5>
      <div class="flex items-center gap-x-4">
        <div class="flex items-center gap-x-1">
          <Icon icon="ph-check-circle-duotone" class="h-5 w-5 text-green-500" />
          <span class="font-bold text-sm text-green-600">成功</span>
          <span class="font-bold text-sm text-green-600">{{ result.filter(result => result.success).length }}</span>
        </div>
        <div class="flex items-center gap-x-1">
          <Icon icon="ph-x-circle-duotone" class="h-5 w-5 text-red-500" />
          <span class="font-bold text-sm text-red-600">失败</span>
          <span class="font-bold text-sm text-red-600">{{ result.filter(result => !result.success).length }}</span>
        </div>
      </div>
    </div>
  </UseTemplate>
  <Dialog>
    <DialogTrigger>
      <Button class="w-full flex items-center justify-center gap-x-4 text-base" variant="secondary">
        查看发送历史
      </Button>
    </DialogTrigger>
    <DialogContent class="max-w-[90vw] rounded-lg sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>发送预约历史</DialogTitle>
      </DialogHeader>
      <div v-if="bookerStore.sendOrderResultHistory.length" class="grid grid-cols-1 gap-y-2">
        <template v-for="(item, index) in bookerStore.sendOrderResultHistory" :key="index">
          <ResultCard v-bind="item" @click="handleClick(item.result)" />
        </template>
      </div>
      <div v-else class="text-center mt-4 mb-2">
        <p class="text-sm text-gray-500">
          暂无发送历史
        </p>
      </div>
      <DialogFooter>
        <Button class="text-md w-full" @click="bookerStore.clearSendOrderResultHistory">
          清空发送历史
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import { DateFormatter, parseDateTime } from '@internationalized/date';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { TSendOrderResult, TSendOrderResultHistoryItem } from '~/types';

const bookerStore = useBookerStore();
const [UseTemplate, ResultCard] = createReusableTemplate<TSendOrderResultHistoryItem>();
const df = new DateFormatter('zh-CN', { dateStyle: 'medium', timeStyle: 'short' });
function handleClick(data: TSendOrderResult) {
  useSendOrderResultDialog(data);
}
</script>
