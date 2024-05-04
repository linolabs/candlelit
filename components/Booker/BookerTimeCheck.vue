<template>
  <div class="col-span-1 row-start-2 flex justify-center items-center gap-x-2">
    <Alert :class="cn('', timeCheckResult.className)">
      <Icon :icon="timeCheckResult.icon" class="w-5 h-5" />
      <AlertTitle>
        <span class="font-bold text-base">时间检查</span>
      </AlertTitle>
      <AlertDescription>
        {{ timeCheckResult.message }}
      </AlertDescription>
    </Alert>
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/ui-utils';

const props = defineProps<{
  startTime: { label: string; time: Date | null };
  endTime: { label: string; time: Date | null };
}>();

const timeCheck = computed(() => {
  if (props.startTime.time && props.endTime.time)
    return props.startTime.time < props.endTime.time;
  return null;
});

const timeCheckResult = computed<{ icon: string; message: string; className: string }>(() => {
  if (timeCheck.value === null)
    return { icon: 'ph:circle-duotone', message: '请选择时间', className: '' };
  return timeCheck.value
    ? { icon: 'ph:check-circle-duotone', message: 'Congrats! 时间合法', className: 'text-green-600 border-green-600 [&>svg]:text-green-600' }
    : { icon: 'ph:x-circle-duotone', message: 'Uh oh. 时间不合法', className: 'text-red-600 border-red-600 [&>svg]:text-red-600' };
});
</script>
