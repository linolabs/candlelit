<template>
  <div class="flex flex-col justify-center min-h-screen items-center py-4 font-sans">
    <Hero class="my-10" />
    <div class="w-[80vw] max-w-[600px] space-y-8 flex-1 mb-4">
      <SeiueStatus />
      <Booker />
    </div>
    <Login />
    <Footer />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Candlelit',
  meta: [
    {
      name: 'description',
      content: 'Refined venue booking experience for Shenzhen Middle School.',
    },
  ],
  bodyAttrs: {
    class: '',
  },
});
</script>
