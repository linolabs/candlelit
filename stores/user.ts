import { toast } from 'vue-sonner';
import { persistedState, useBookerStore } from '#imports';

export const useUserStore = defineStore('user', () => {
  const loggedIn = ref(false);
  const accessToken = ref<string>();
  const activeReflectionId = ref<number>();
  const bookerStore = useBookerStore();

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
    bookerStore.clearVenueList();
    toast.success('退出登录成功');
  }

  return {
    loggedIn,
    accessToken,
    activeReflectionId,
    login,
    logout,
  };
}, {
  persist: {
    storage: persistedState.localStorage,
  },
});
