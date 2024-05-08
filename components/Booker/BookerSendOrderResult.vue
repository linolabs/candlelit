<template>
  <Dialog v-if="sendOrderResult" v-model:open="isSendOrderResultOpen" class="z-200">
    <DialogContent class="sm:max-w-[425px] max-w-[90vw] rounded-lg">
      <DialogHeader>
        <DialogTitle>发送预约结果</DialogTitle>
      </DialogHeader>
      <h5>
        本次共发送
        <span class="font-bold">{{ sendOrderResult.length }}</span>
        个预约，其中成功
        <span class="font-bold text-green-500">{{ sendOrderResult.filter(result => result.success).length }}</span>
        个，失败
        <span class="font-bold text-red-500">{{ sendOrderResult.filter(result => !result.success).length }}</span>
        个。
      </h5>
      <div v-if="sendOrderResult.filter(result => result.success).length" class="space-y-1 mb-4">
        <h5 class="font-bold text-base">
          成功的预约
        </h5>
        <div class="border border-primary rounded-md py-2 grid grid-cols-1 gap-y-2 justify-items-center justift-center px-2">
          <template v-for="(result, index) in sendOrderResult" :key="index">
            <BookerOrderCard v-if="result.success" :order="result.order" :no-edit="true" />
          </template>
        </div>
      </div>
      <div v-if="sendOrderResult.filter(result => !result.success).length" class="space-y-1">
        <h5 class="font-bold text-base">
          失败的预约
        </h5>
        <div class="border border-primary rounded-md py-2 grid grid-cols-1 gap-y-2 justify-items-center justift-center px-2">
          <template v-for="(result, index) in sendOrderResult" :key="index">
            <BookerOrderCard v-if="!result.success" :order="result.order" :no-edit="true" />
          </template>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { isSendOrderResultOpen, sendOrderResult } from '~/composables/dialog';
</script>
