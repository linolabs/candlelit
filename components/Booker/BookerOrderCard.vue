<template>
  <div
    :class="cn('rounded border border-primary px-1 sm:px-4 py-2 space-y-1 w-full sm:max-w-[80%]', !noEdit && 'cursor-pointer ')"
    @click="handleClick"
  >
    <div class="flex justify-start items-center gap-x-2 mx-auto text-wrap break-all">
      <span>{{ startTimeLabel }}</span>
      <Icon icon="ph:arrow-circle-right-duotone" class="min-w-5 min-h-5 sm:mx-2" />
      <span>{{ endTimeLabel }}</span>
    </div>
    <div class="flex gap-x-2">
      <span class="px-1 rounded bg-primary text-secondary flex items-center gap-x-1">
        <Icon icon="ph:house-line-duotone" class="w-4 h-4" />
        {{ order.venue.name }}
      </span>
      <span class="px-1 rounded bg-secondary text-primary flex items-center gap-x-1">
        <Icon icon="ph:users-duotone" class="w-4 h-4" />
        {{ order.capacity }}
      </span>
      <span class="px-1 rounded bg-secondary truncate text-primary max-w-sm flex items-center gap-x-1">
        <Icon icon="ph:quotes-duotone" class="min-h-4 min-w-4 max-w-4 max-h-4" />
        <span class="truncate w-auto">{{ order.description }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDateFormat } from '@vueuse/core';
import { cn } from '@/lib/ui-utils';
import type { TNewOrder, TOrderStoreItem } from '~/types';

const props = defineProps<{
  order: TOrderStoreItem;
  noEdit?: false;
} | {
  order: TNewOrder;
  noEdit: true;
}>();

function handleClick() {
  if (!props.noEdit)
    useOrderEditDialog(props.order.orderIndexer);
}

const startTimeLabel = useDateFormat(new Date(props.order.timeRanges.startAt), 'YYYY/MM/DD HH:mm');
const endTimeLabel = useDateFormat(new Date(props.order.timeRanges.endAt), 'YYYY/MM/DD HH:mm');
</script>
