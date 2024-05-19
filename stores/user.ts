import { toast } from 'vue-sonner';
import { persistedState, useBookerStore } from '#imports';
import { Seiue } from '~/lib/seiue';

export const useUserStore = defineStore('user', () => {
  const loggedIn = ref(false);
  const accessToken = ref<string>();
  const activeReflectionId = ref<number>();
  const bookerStore = useBookerStore();
  const cookies = ref<Record<string, string>>();

  async function login(credentials: { schoolId: string; password: string }) {
    const res = await $fetch('/api/login', {
      method: 'POST',
      body: credentials,
    });
    if (!res.success) {
      toast.error(res.message);
    } else {
      loggedIn.value = true;
      accessToken.value = res.accessToken;
      activeReflectionId.value = res.activeReflectionId;
      cookies.value = res.cookies;
      toast.success(res.message);
    }
    return res.success;
  }

  function logout(noToast?: boolean) {
    loggedIn.value = false;
    accessToken.value = undefined;
    activeReflectionId.value = undefined;
    cookies.value = undefined;
    bookerStore.clearOrderList();
    bookerStore.clearVenueList();
    if (!noToast)
      toast.success('退出登录成功');
  }

  async function checkLogin() {
    if (loggedIn.value && accessToken.value) {
      const isTokenValid = await Seiue.checkTokenStatus(accessToken.value);
      if (!isTokenValid) {
        const res = await $fetch('/api/token', {
          method: 'POST',
          body: { cookies: cookies.value ?? {} },
        });
        if (res.success) {
          accessToken.value = res.accessToken;
          return true; // refresh token success
        } else {
          logout(true);
          toast.warning('登录过期，请重新登录');
          return false; // refresh token failed
        }
      }
      return true; // token is valid
    }
    return false; // not logged in
  }

  return {
    checkLogin,
    loggedIn,
    accessToken,
    activeReflectionId,
    login,
    logout,
    cookies,
  };
}, {
  persist: {
    storage: persistedState.localStorage,
  },
});
