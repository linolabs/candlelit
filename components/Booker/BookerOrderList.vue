<template>
  <div class="space-y-2 w-full h-auto">
    <h5 class="text-lg font-bold">
      预约列表
    </h5>
    <div class="rounded border border-primary shadow w-full px-2 py-4 grid grid-cols-1 justify-items-center gap-y-4">
      <Button
        class="border border-primary shadow-md w-10 h-10 sm:w-12 sm:h-12 p-2"
        variant="outline"
        @click="async() => await useOrderEditDialog()"
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
import { useOrderEditDialog } from '@/composables/dialog';

const bookerStore = useBookerStore();
</script>
