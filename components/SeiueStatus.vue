<template>
  <div :class="cn('flex items-center content-center rounded-md border px-4 py-2', loginCheckResult.className)">
    <Icon :icon="loginCheckResult.icon" class="w-5 h-5 mr-2" />
    <div class="flex justify-between items-center grow">
      <span class="font-bold text-base">{{ loginCheckResult.message }}</span>
      <Button v-if="!loginCheckResult.loggedIn" variant="outline" class="text-sm px-4 py-0 text-primary" @click="useLoginDialog()">
        去登录
      </Button>
      <Button v-else variant="outline" class="text-sm px-4 py-0 text-primary" @click="userStore.logout()">
        退出登录
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLoginDialog } from '~/composables/dialog';
import { cn } from '@/lib/ui-utils';

const userStore = useUserStore();

const loginCheckResult = computed<{ loggedIn: boolean; icon: string;message: string;className: string }>(() => {
  if (userStore.loggedIn)
    return { loggedIn: true, icon: 'ph:check-circle-duotone', message: '希悦已登录', className: 'text-green-600 border-green-600 [&>svg]:text-green-600' };
  return { loggedIn: false, icon: 'ph:x-circle-duotone', message: '希悦未登录', className: 'text-red-500 border-red-500 [&>svg]:text-red-500' };
});
</script>
