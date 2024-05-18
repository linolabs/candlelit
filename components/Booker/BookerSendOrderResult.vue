<template>
  <Dialog v-if="sendOrderResult" v-model:open="isSendOrderResultOpen" class="z-200">
    <DialogContent class="sm:max-w-[425px] max-w-[90vw] rounded-lg">
      <DialogHeader>
        <DialogTitle>发送预约结果</DialogTitle>
      </DialogHeader>
      <h5 class="mb-2">
        本次共发送
        <span class="font-bold">{{ sendOrderResult.length }}</span>
        个预约，其中成功
        <span class="font-bold text-green-500">{{ sendOrderResult.filter(result => result.success).length }}</span>
        个，失败
        <span class="font-bold text-red-500">{{ sendOrderResult.filter(result => !result.success).length }}</span>
        个。
      </h5>
      <div class="mb-2">
        <Button type="button" class="w-full text-sm flex items-center" :disabled="isExporting || isWechat" @click="exportToImage">
          <Icon v-if="isExporting" icon="ph:spinner" class="w-4 h-4 animate-spin mr-2" />
          {{ isWechat ? '微信不支持导出图片，请截图' : '导出结果图（只含成功预约）' }}
        </Button>
      </div>
      <div v-if="sendOrderResult.filter(result => result.success).length" class="space-y-1 mb-4">
        <h5 class="font-bold text-base">
          成功的预约
        </h5>
        <ScrollArea class="max-h-72 border border-primary rounded-md">
          <div class="py-2 grid grid-cols-1 gap-y-2 justify-items-center justift-center px-2">
            <template v-for="(result, index) in sendOrderResult" :key="index">
              <BookerOrderCard v-if="result.success" :order="result.order" :no-edit="true" />
            </template>
          </div>
        </ScrollArea>
      </div>
      <div v-if="sendOrderResult.filter(result => !result.success).length" class="space-y-1">
        <h5 class="font-bold text-base">
          失败的预约
        </h5>
        <ScrollArea class="max-h-72 border border-primary rounded-md">
          <div class="py-2 grid grid-cols-1 gap-y-2 justify-items-center justift-center px-2">
            <template v-for="(result, index) in sendOrderResult" :key="index">
              <BookerOrderCard v-if="!result.success" :order="result.order" :no-edit="true" />
            </template>
          </div>
        </ScrollArea>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

import { isSendOrderResultOpen, sendOrderResult } from '~/composables/dialog';
import { saveFile, toDateTimeString } from '~/utils/shared';

const isExporting = ref(false);
const isWechat = computed(() => /MicroMessenger/i.test(window.navigator.userAgent));

async function exportToImage() {
  if (!sendOrderResult.value)
    return;

  const successOrdersResult = sendOrderResult.value.filter(result => result.success);
  const exportInput = {
    createdAt: nowInTimeString(),
    orders: successOrdersResult.map(result => ({
      startTime: toDateTimeString(result.order.timeRanges.startAt),
      endTime: toDateTimeString(result.order.timeRanges.endAt),
      venueName: result.order.venue.name,
      description: result.order.description,
      capacity: result.order.capacity,
    })),
  };
  isExporting.value = true;
  try {
    const response = await $fetch.raw<Blob>('/api/image', {
      method: 'POST',
      headers: {
        'Accept': 'image/png',
        'Content-Type': 'application/json',
      },
      responseType: 'blob',
      body: exportInput,
      onRequestError: () => { toast.error('未知错误'); },
    });
    if (!response._data)
      throw new Error('No data');
    const filename = response.headers.get('Content-Disposition')?.split('filename=')[1].slice(1, -1) ?? 'order-export.png';
    await saveFile(response._data, filename);
    toast.success('保存成功');
  } catch {
    toast.error('发生错误，保存失败');
  }
  isExporting.value = false;
}
</script>
