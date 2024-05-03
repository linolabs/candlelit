<template>
  <div class="flex flex-col justify-center items-center gap-y-20">
    <Hero />
    <div class="w-[80vw] max-w-[600px] space-y-8">
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
    class: 'min-h-screen w-full grid grid-cols-1 content-center',
  },
});
</script>
