<template>
  <Popover :open="isTimeQuickSelectOpen">
    <PopoverTrigger>
      <slot />
    </PopoverTrigger>
    <PopoverContent class="grid grid-cols-2 gap-1 w-56">
      <template v-for="(item, index) in timeRangeMap" :key="index">
        <Button variant="outline" class="px-2 py-1 text-sm" type="button" @click.prevent="handleClick(item.timeRange)">
          {{ item.label }}
        </Button>
      </template>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { isTimeQuickSelectOpen } from '~/composables/dialog';

const emit = defineEmits(['update:time']);
const textMap: Record<number, string> = {
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
};
const timeRangeMap = Array.from({ length: 10 }, (_, i) => i + 1).map((i) => {
  // every two number is one day and every day has two time ranges
  // 10 numbers = 5 days * 2 time ranges = 10 time ranges (monday to friday)
  return {
    label: `下周${textMap[Math.round(i / 2)]}${i % 2 ? '中午' : '下午'}`,
    timeRange: getTimeRangeNextWeek(Math.round(i / 2), i % 2 ? 'noon' : 'afternoon'),
  };
});

function handleClick(timeRange: { start: string; end: string }) {
  emit('update:time', timeRange);
  isTimeQuickSelectOpen.value = false;
}
</script>
