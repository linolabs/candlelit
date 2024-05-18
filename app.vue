<template>
  <div>
    <Toaster rich-colors position="top-center" />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner';
import { Toaster } from '@/components/ui/sonner';

onMounted(async () => {
  const userStore = useUserStore();
  const check = await userStore.checkLogin();
  if (!check)
    return;

  const bookerStore = useBookerStore();
  await bookerStore.fetchVenueList();
});
</script>
