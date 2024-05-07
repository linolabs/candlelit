<template>
  <div :class="cn('flex items-center content-center rounded-md border px-4 py-2', timeCheckResult.className)">
    <Icon :icon="timeCheckResult.icon" class="w-5 h-5 mr-2" />
    <div class="flex justify-between items-center grow">
      <span class="font-bold text-sm">{{ timeCheckResult.message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isEqualDay, parseDateTime } from '@internationalized/date';
import { cn } from '@/lib/ui-utils';

const props = defineProps<{
  startTime: string | null;
  endTime: string | null;
}>();

const timeCheck = computed(() => {
  if (!props.startTime || !props.endTime)
    return null;
  const start = parseDateTime(props.startTime);
  const end = parseDateTime(props.endTime);
  // is in 12:00-14:00 or 16:30-18:30
  const isInTimeRange = (start.hour * 60 + start.minute >= 12 * 60 && start.hour * 60 + start.minute <= 14 * 60) || ((start.hour * 60 + start.minute >= 16 * 60 + 30) && (start.hour * 60 + start.minute <= 18 * 60 + 30));
  // we require: 1. end later than start; 2. on same day; 3. less than 120 minutes 4. in time range
  return end.compare(start) > 0
    && isEqualDay(start, end)
    && end.hour * 60 + end.minute - start.hour * 60 - start.minute <= 120
    && isInTimeRange;
});

const timeCheckResult = computed<{ icon: string; message: string; className: string }>(() => {
  if (timeCheck.value === null)
    return { icon: 'ph:circle-duotone', message: '请选择时间', className: '' };
  return timeCheck.value
    ? { icon: 'ph:check-circle-duotone', message: 'Congrats! 时间合法', className: 'text-green-600 border-green-600 [&>svg]:text-green-600' }
    : { icon: 'ph:x-circle-duotone', message: 'Uh oh. 时间不合法', className: 'text-red-600 border-red-600 [&>svg]:text-red-600' };
});
</script>
