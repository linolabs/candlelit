import { toast } from 'vue-sonner';
import { Seiue } from '~/lib/seiue';
import type { TVenueList } from '~/types';
import { persistedState } from '#imports';

export const useStore = defineStore('store', () => {
  const loggedIn = ref(false);
  const accessToken = ref<string>();
  const activeReflectionId = ref<number>();
  const venueList = ref<TVenueList>();

  async function login(credentials: { schoolId: string; password: string }) {
    const res = await $fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (!res.success) {
      toast.error(res.message);
    } else {
      loggedIn.value = true;
      accessToken.value = res.accessToken;
      activeReflectionId.value = res.activeReflectionId;
      toast.success(res.message);
    }
    return res.success;
  }

  function logout() {
    loggedIn.value = false;
    accessToken.value = undefined;
    activeReflectionId.value = undefined;
    venueList.value = undefined;
    toast.success('退出登录成功');
  }

  async function fetchVenueList() {
    if (!loggedIn.value)
      return;
    const seiue = new Seiue(accessToken.value as string, activeReflectionId.value as number);
    venueList.value = await seiue.getVenueList();
  }

  return {
    loggedIn,
    accessToken,
    activeReflectionId,
    login,
    logout,
    fetchVenueList,
  };
}, {
  persist: {
    storage: persistedState.localStorage,
  },
});
