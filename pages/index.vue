<template>
  <div class="flex flex-col justify-center items-center gap-y-20">
    <Hero />
    <BookVenue />
    <Login :open="isLoginOpen" :toggle-open="toggleLoginOpen" @login-success="store.fetchVenueList" />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useToggle } from '@vueuse/core';
import { useStore } from '~/stores';

useHead({
  title: 'Candlelit',
  meta: [
    {
      name: 'description',
      content: 'Refined venue booking experience for Shenzhen Middle School.',
    },
  ],
  bodyAttrs: {
    class: 'min-h-screen w-full grid grid-cols-1 content-center',
  },
});

const [isLoginOpen, toggleLoginOpen] = useToggle(false);
const store = useStore();
</script>
