<template>
  <Dialog v-model:open="isLoginDialogOpen">
    <DialogContent class="max-w-[80vw] rounded-lg sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>登录希悦</DialogTitle>
      </DialogHeader>
      <Alert class="text-orange-500 border-orange-400 [&>svg]:text-orange-500">
        <Icon icon="ph:circle-wavy-warning-duotone" class="w-5 h-5" />
        <AlertTitle>
          <span class="font-bold text-base">注意</span>
        </AlertTitle>
        <AlertDescription>
          由于浏览器跨域请求限制，登录请求将由服务器转发，我们承诺不会记录您的密码。
          使用本服务即代表您同意上述隐私政策。您可以查看源代码，了解更多细节。
        </AlertDescription>
      </Alert>
      <form class="grid grid-cols-1 gap-4" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="schoolId">
          <FormItem>
            <FormLabel>校卡号</FormLabel>
            <FormControl>
              <div class="relative w-full items-center">
                <Input type="text" placeholder="2022XXXXXXXXX" v-bind="componentField" class="pl-10" />
                <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                  <Icon icon="ph:identification-card-duotone" class="w-5 h-5" />
                </span>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>密码</FormLabel>
            <FormControl>
              <div class="relative w-full items-center">
                <Input type="password" placeholder="superpassword" v-bind="componentField" class="pl-10" />
                <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                  <Icon icon="ph:password-duotone" class="w-5 h-5" />
                </span>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <Button type="submit" class="font-bold text-base w-full mt-2" :disabled="isLoading">
          <Icon v-if="isLoading" icon="ph:spinner" class="w-5 h-5 mr-2 animate-spin" />
          登录
        </Button>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { isLoginDialogOpen } from '~/composables/dialog';

const formSchema = toTypedSchema(z.object({
  schoolId: z.string().min(1, '校卡号不能为空'),
  password: z.string().min(1, '密码不能为空'),
}));

const form = useForm({
  validationSchema: formSchema,
});

const bookerStore = useBookerStore();
const userStore = useUserStore();

const isLoading = ref(false);
const loginSuccess = ref(false);

const onSubmit = form.handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    loginSuccess.value = await userStore.login(values);
    isLoading.value = false;
  } catch {
    isLoading.value = false;
    toast.error('登录失败，可能是使用人数太多，请等等吧');
  }
  // if (loginSuccess.value) {
  //   isLoginDialogOpen.value = false;
  //   await bookerStore.fetchVenueList();
  // }

  // temporary try catch
  try {
    if (loginSuccess.value) {
      isLoginDialogOpen.value = false;
      await bookerStore.fetchVenueList();
    }
  } catch (e) {
    console.log('error', e);
  }
});
</script>
