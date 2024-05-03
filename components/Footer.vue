<template>
  <section class="w-full flex justify-center items-center space-x-4 absolute bottom-2 left-1/2 -translate-x-1/2">
    <span>
      <NuxtLink to="https://github.com/linolabs/candlelit">
        <Icon icon="ph:github-logo-duotone" class="h-5 w-5" />
      </NuxtLink>
    </span>
    <Separator orientation="vertical" />
    <span>A linolabs project.</span>
    <Separator orientation="vertical" />
    <Button variant="link" class="p-0 text-base" @click="toggleUserManualOpen">
      用户手册
    </Button>
    <UserManual :open="isUserManualOpen" :toggle-open="toggleUserManualOpen" />
  </section>
</template>

<script setup lang="ts">
import { Separator } from '@/components/ui/separator';

const [isUserManualOpen, toggleUserManualOpen] = useToggle(false);
</script>
