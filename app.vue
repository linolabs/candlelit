<template>
  <div>
    <Toaster rich-colors position="top-center" />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner';

onMounted(async () => {
  const bookerStore = useBookerStore();
  await bookerStore.fetchVenueList();
});
</script>
