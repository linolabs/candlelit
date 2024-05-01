<template>
  <div class="grid grid-cols-1 gap-y-2 max-w-2xl ">
    <div class="col-span-1 flex gap-x-4 justify-center items-center">
      <BookDateTimePicker v-model:time="startTime" />
      <Icon class="h-5 w-5 text-muted-foreground" icon="ph:arrow-circle-right-duotone" />
      <BookDateTimePicker v-model:time="endTime" />
    </div>
    <BookChecks :start-time="startTime" :end-time="endTime" />
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

const startTime = ref<{ label: string; time: Date | null }>({ label: '', time: null });
const endTime = ref<{ label: string; time: Date | null }>({ label: '', time: null });
</script>
