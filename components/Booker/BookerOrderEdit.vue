<template>
  <UseTemplate>
    <form class="space-y-4" @submit="onSubmit">
      <div class="grid grid-cols-1 gap-2">
        <BookerTimeQuickSelect @update:time="onEmit">
          <Button variant="outline" class="px-2 py-1 text-sm" type="button" @click.prevent="useTimeQuickSelect">
            快捷选择
          </Button>
        </BookerTimeQuickSelect>
        <BookerTimeCheck :start-time="startTime" :end-time="endTime" />
      </div>
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
          <FormLabel class="flex items-center gap-x-2">
            <span>场地用途</span>
            <Button
              v-if="bookerStore.lastDescription"
              type="button"
              class="text-xs sm:text-sm py-0 px-2"
              variant="outline"
              @click.prevent="() => setValues({ description: bookerStore.lastDescription }, false)"
            >
              填入上次内容
            </Button>
          </FormLabel>
          <FormControl>
            <Textarea id="description" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <div class="flex gap-x-2 mt-4">
        <Button type="submit" class="font-bold text-base w-full" :disabled="isLoading">
          <Icon v-if="isLoading" icon="ph:spinner" class="w-5 h-5 animate-spin mr-2" />
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
import { bus, isOrderEditDialogOpen } from '@/composables/dialog';
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
import { nowInTimeString } from '~/utils/shared';

const schema = toTypedSchema(z.object({
  startTime: z.string(),
  endTime: z.string(),
  capacity: z.number(),
  description: z.string(),
}));

const bookerStore = useBookerStore();

const today = nowInTimeString();

const startTime = ref<string>(today);
const endTime = ref<string>(today);
const isLoading = ref(false);

const { handleSubmit, setValues } = useForm({
  validationSchema: schema,
  initialValues: {
    startTime: nowInTimeString(),
    endTime: nowInTimeString(),
    capacity: 10,
    description: '',
  },
});

const isAddingNewOrder = ref(false);
const editingOrderIndexer = ref<number | undefined>();

bus.on((indexer) => {
  editingOrderIndexer.value = indexer;
  isAddingNewOrder.value = indexer === undefined;
  if (indexer === undefined) {
    setValues({
      startTime: nowInTimeString(),
      endTime: nowInTimeString(),
      capacity: bookerStore.lastCapacity,
      description: '',
    }, false);
    startTime.value = nowInTimeString();
    endTime.value = nowInTimeString();
  } else {
    const order = bookerStore.getOrder(indexer);
    if (order) {
      setValues({
        capacity: order.capacity,
        description: order.description,
        startTime: parseSeiueDateString(order.startTime),
        endTime: parseSeiueDateString(order.endTime),
      }, false);
      startTime.value = parseSeiueDateString(order.startTime);
      endTime.value = parseSeiueDateString(order.endTime);
    }
  }
});

function onEmit(val: { start: string; end: string }) {
  startTime.value = val.start;
  endTime.value = val.end;
  setValues({
    startTime: val.start,
    endTime: val.end,
  });
}

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  const startTime = parseDateTime(values.startTime);
  const endTime = parseDateTime(values.endTime);
  startTime.set({ second: 0 });
  endTime.set({ second: 0 });
  const orderInput = {
    capacity: values.capacity,
    description: values.description,
    startTime: toSeiueString(startTime),
    endTime: toSeiueString(endTime),
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
