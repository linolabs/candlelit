<template>
  <UseTemplate>
    <form class="space-y-4" @submit="onSubmit">
      <FormField name="startTime">
        <FormItem>
          <FormLabel>开始时间</FormLabel>
          <FormControl>
            <BookerDateTimePicker v-model:time="startTime" @update:time="(val) => setValues({ startTime: val })" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField name="endTime">
        <FormItem>
          <FormLabel>结束时间</FormLabel>
          <FormControl>
            <BookerDateTimePicker v-model:time="endTime" @update:time="(val) => setValues({ endTime: val })" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="capacity">
        <FormItem>
          <FormLabel>使用人数</FormLabel>
          <FormControl>
            <Input id="capacity" type="number" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="description">
        <FormItem>
          <FormLabel>场地用途</FormLabel>
          <FormControl>
            <Textarea id="description" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <div class="flex gap-x-2 mt-4">
        <Button type="submit" class="font-bold text-base w-full space-x-2" :disabled="isLoading">
          <Icon v-if="isLoading" icon="ph:spinner" class="w-5 h-5 animate-spin" />
          保存
        </Button>
        <Button
          v-if="!isAddingNewOrder"
          variant="destructive"
          type="button"
          class="font-bold text-base w-full"
          @click.prevent="() => removeOrder()"
        >
          删除
        </Button>
      </div>
    </form>
  </UseTemplate>

  <Dialog v-model:open="isOrderEditDialogOpen">
    <DialogContent class="max-w-[90vw] sm:max-w-[500px] rounded-lg">
      <DialogHeader>
        <DialogTitle>
          {{ isAddingNewOrder ? '添加新的预约' : '编辑预约' }}
        </DialogTitle>
      </DialogHeader>
      <NewOrderInput />
    </DialogContent>
  </Dialog>

  <!-- <Drawer v-else v-model:open="isOrderEditDialogOpen">
    <DrawerContent>
      <DrawerHeader class="text-left">
        <DrawerTitle>添加新的预约</DrawerTitle>
      </DrawerHeader>
      <NewOrderInput />
    </DrawerContent>
  </Drawer> -->
</template>

<script lang="ts" setup>
import { createReusableTemplate } from '@vueuse/core';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { toast } from 'vue-sonner';
import { parseDateTime } from '@internationalized/date';
import { editingOrderIndexer, isOrderEditDialogOpen } from '@/composables/dialog';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerTitle,
// } from '@/components/ui/drawer';
import { formatDateTimeString } from '~/utils/shared';

const schema = toTypedSchema(z.object({
  startTime: z.string(),
  endTime: z.string(),
  capacity: z.number(),
  description: z.string(),
}));

const bookerStore = useBookerStore();

const startTime = ref<string>(transformDateToString(new Date()));
const endTime = ref<string>(transformDateToString(new Date()));
const isLoading = ref(false);

const { handleSubmit, setValues } = useForm({
  validationSchema: schema,
  initialValues: {
    startTime: transformDateToString(new Date()),
    endTime: transformDateToString(new Date()),
    capacity: 10,
    description: '',
  },
});

const isAddingNewOrder = computed(() => editingOrderIndexer.value === undefined);

watch(editingOrderIndexer, (newVal) => {
  if (newVal === undefined) {
    setValues({
      startTime: transformDateToString(new Date()),
      endTime: transformDateToString(new Date()),
      capacity: 10,
      description: '',
    });
  } else {
    const order = bookerStore.getOrder(newVal);
    if (order) {
      setValues({
        capacity: order.capacity,
        description: order.description,
        startTime: parseSeiueDateString(order.startTime),
        endTime: parseSeiueDateString(order.endTime),
      });
      startTime.value = parseSeiueDateString(order.startTime);
      endTime.value = parseSeiueDateString(order.endTime);
    }
  }
});

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  const orderInput = {
    capacity: values.capacity,
    description: values.description,
    startTime: formatDateTimeString(parseDateTime(values.startTime).toDate('Etc/GMT')),
    endTime: formatDateTimeString(parseDateTime(values.endTime).toDate('Etc/GMT')),
  };
  try {
    if (editingOrderIndexer.value !== undefined)
      await bookerStore.updateOrder(editingOrderIndexer.value, orderInput);
    else
      await bookerStore.addOrder(orderInput);
    isLoading.value = false;
    isOrderEditDialogOpen.value = false;
  } catch (error) {
    isLoading.value = false;
    if (error instanceof Error)
      toast.error(error.message);
  }
});

function removeOrder() {
  if (editingOrderIndexer.value !== undefined)
    bookerStore.removeOrder(editingOrderIndexer.value);
  isOrderEditDialogOpen.value = false;
}

const [UseTemplate, NewOrderInput] = createReusableTemplate();
// const isDesktop = useMediaQuery('(min-width: 768px)');
</script>
