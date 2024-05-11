<template>
  <div class="flex flex-col items-center justify-center bg-white mt-4 mb-4 text-xl w-full">
    <div class="flex items-center text-2xl mb-4">
      <span class="mr-4">
        预约结果图
      </span>
      <span>
        {{ createdAt }}
      </span>
    </div>
    <template v-for="(order, index) in orders" :key="index">
      <div class="flex items-center justify-between m-0 h-8">
        <span
          class="border-l border-r border-black h-8 w-[144] flex items-center justify-center border-b"
          :class="{ 'border-t': index === 0 }"
        >
          {{ order.startTime }}
          -
          {{ order.endTime }}
        </span>
        <span
          class="border-r border-black h-full w-16 flex items-center justify-center border-b"
          :class="{ 'border-t': index === 0 }"
        >
          {{ order.venueName }}
        </span>
        <span
          class="border-r border-black h-full w-72 flex items-center justify-center border-b"
          :class="{ 'border-t': index === 0 }"
        >
          {{ order.description }}
        </span>
        <span
          class="border-r border-black h-full w-24 flex items-center justify-center border-b"
          :class="{ 'border-t': index === 0 }"
        >
          {{ order.capacity }} 人
        </span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { TImageExportProps } from '~/types';

defineProps<TImageExportProps>();
</script>
