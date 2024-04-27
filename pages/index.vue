<template>
  <div>
    <button @click="toggleLoginOpen()">
      Open Login
    </button>
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
    class: 'min-h-screen',
  },
});

const [isLoginOpen, toggleLoginOpen] = useToggle(false);
const store = useStore();
</script>
