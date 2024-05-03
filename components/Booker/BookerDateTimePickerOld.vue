<!-- legacy code, deprecated due to poor performance(caused by too many dom elements) -->
<!-- vue-virtual-scroll not working, maybe do some digging later -->

<template>
  <div class="flex space-x-2">
    <UseTemplate v-slot="{ availableOptions, onSelect, selected }">
      <Command>
        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="option of availableOptions"
              :key="option"
              :value="option"
              :class="cn('cursor-pointer transition-all',
                         option === selected
                           && 'hover:!bg-primary hover:!text-secondary bg-primary text-secondary')"
              @select="onSelect(option)"
            >
              {{ option.toString().padStart(2, '0') }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </UseTemplate>

    <Popover>
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          :class="cn(
            'w-60 justify-start text-left font-normal',
            !selectedDate && 'text-muted-foreground',
          )"
        >
          <Icon icon="ph:calendar-dots-duotone" class="h-5 w-5 mr-4" :ssr="true" />
          {{ selectedDateTimeString ?? "选择一个时间点" }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0 grid grid-cols-3 auto-cols-min">
        <Calendar v-model="selectedDate" class="col-span-2 z-30" locale="zh-CN" />
        <div class="grid grid-cols-2 col-auto">
          <TimePicker class="col-span-1" :available-options="hours" :on-select="onSelectHour" :selected="selectedHour" />
          <TimePicker class="col-span-1" :available-options="minutes" :on-select="onSelectMinute" :selected="selectedMinute" />
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
} from '@internationalized/date';

import { createReusableTemplate } from '@vueuse/core';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/ui-utils';

const selectedDate = ref<DateValue>();
const df = new DateFormatter('zh-CN', {
  dateStyle: 'long',
});

const [UseTemplate, TimePicker] = createReusableTemplate<{
  availableOptions: number[];
  onSelect: (option: number) => void;
  selected: number | undefined;
}>();
const hours = Array.from({ length: 24 }, (_, i) => Number.parseInt(i.toString().padStart(2, '0')));
const minutes = Array.from({ length: 60 }, (_, i) => Number.parseInt(i.toString().padStart(2, '0')));
const selectedHour = ref<number>();
const selectedMinute = ref<number>();
function onSelectHour(hour: number) {
  selectedHour.value = hour;
}
function onSelectMinute(minute: number) {
  selectedMinute.value = minute;
}

const model = defineModel<Date>('time', { required: true });

const selectedDateTimeString = computed(() => {
  if (!selectedDate.value)
    return;
  const date = selectedDate.value.toDate(getLocalTimeZone());

  const time = selectedHour.value !== undefined && selectedMinute.value !== undefined
    ? `${selectedHour.value.toString().padStart(2, '0')}:${selectedMinute.value.toString().padStart(2, '0')}`
    : '';
  return `${df.format(date)} ${time}`.trim();
});

const dateTime = computed(() => {
  if (!selectedDate.value)
    return;
  const date = selectedDate.value.toDate(getLocalTimeZone());
  date.setHours(selectedHour.value ?? 0, selectedMinute.value ?? 0);
  return date;
});

watch(dateTime, (newVal) => {
  if (newVal)
    model.value = newVal;
});
</script>
