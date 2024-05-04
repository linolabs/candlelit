<template>
  <div class="flex space-x-2">
    <Popover>
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          :class="cn(
            'w-60 justify-start text-left font-normal',
            !selectedDate && 'text-muted-foreground',
          )"
        >
          <Icon icon="ph:calendar-dots-duotone" class="h-5 w-5 mr-4" />
          {{ selectedDateTimeString ?? "选择一个时间点" }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0 grid grid-cols-1 auto-cols-min">
        <Calendar
          v-model="selectedDate"
          :min-value="todayInCalendarDateTime()"
          class="col-span-1 z-30"
          locale="zh-CN"
        />
        <div class="mb-2 row-start-2 grid grid-cols-2 col-span-1 px-2 justify-center justify-items-center">
          <div class="w-auto">
            <Label for="selectedHour">小时</Label>
            <Input
              id="selectedHour"
              v-model="selectedHour"
              class="max-w-24"
              type="number"
            />
          </div>
          <div class="w-auto">
            <Label for="selectedMinute">分钟</Label>
            <Input
              id="selectedMinute"
              v-model="selectedMinute"
              class="max-w-24"
              type="number"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import type {
  CalendarDate,
} from '@internationalized/date';
import {
  DateFormatter,
  parseDateTime,
  toCalendarDate,
} from '@internationalized/date';

import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/ui-utils';
import { Input } from '@/components/ui/input';

import { todayInCalendarDateTime } from '~/utils/shared';

const model = defineModel<string>('time', { required: true });

const df = new DateFormatter('zh-CN', {
  dateStyle: 'long',
});

const selectedDate = computed<CalendarDate>(
  {
    get: () => {
      return toCalendarDate(parseDateTime(model.value));
    },
    set(value) {
      const modelDate = parseDateTime(model.value);
      model.value = modelDate.set({ year: value.year, month: value.month, day: value.day }).toString();
    },
  },
);

const selectedHour = computed<number>(
  {
    get() {
      return parseDateTime(model.value).hour;
    },
    set(value) {
      const modelDate = parseDateTime(model.value);
      model.value = modelDate.set({ hour: value }).toString();
    },
  },
);

const selectedMinute = computed<number>(
  {
    get() {
      return parseDateTime(model.value).minute;
    },
    set(value) {
      const modelDate = parseDateTime(model.value);
      model.value = modelDate.set({ minute: value }).toString();
    },
  },
);

const selectedDateTimeString = computed<string>(() => {
  const date = df.format(parseDateTime(model.value).toDate('Asia/Shanghai'));
  const hour = selectedHour.value.toString().padStart(2, '0');
  const minute = selectedMinute.value.toString().padStart(2, '0');
  return `${date} ${hour}:${minute}`;
});
</script>
