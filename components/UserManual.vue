<template>
  <Dialog :open="open" @update:open="toggleOpen">
    <DialogContent class="rounded-lg max-w-[90vw] sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>用户手册</DialogTitle>
      </DialogHeader>
      <ScrollArea class="max-h-[80vh]">
        <div class="prose">
          <h4 class="text-orange-500">
            适用场景
          </h4>
          <ul>
            <li>
              需要某一时间段的场地，不需要是特定教室（支持楼层优先级排序、ABCD栋优先级排序）
            </li>
            <li>一次预约多间教室</li>
          </ul>
          <h4 class="text-orange-500">
            使用指南
          </h4>
          <h5>
            智能筛选
          </h5>
          <p>
            智能筛选会在选择教室时，根据当前时间和预约时间，自动将空闲教室排序，选择合适的教室。
          </p>
          <p>
            若楼层优先<b>高于</b>建筑优先，则会先按照楼层排序（越低越优先），再在楼层内按照建筑优先级排序。
            在这种情况下，假设建筑优先级为 B，C，A，D，那么 B319 > C307 > A303 > B521 > C507
          </p>
          <p>
            若楼层优先<b>低于</b>建筑优先，则会先按照建筑优先级排序，再在建筑内按照楼层优先级排序。
            在这种情况下，假设楼层优先级为 B，C，A，D，那么 B309 > B521 > C307 > C507 > A303
          </p>
          <p>
            建筑之间的优先级可以在页面上设置，越靠<b>左</b>优先级越高。
          </p>
          <h5>
            预约
          </h5>
          <p>
            点击+按钮，添加预约。
            点击已有的预约，修改或删除预约。
          </p>
          <h4 class="text-orange-500">
            隐私政策
          </h4>
          <p>
            由于浏览器跨域资源请求限制，无法直接从从浏览器发送希悦登录请求，需经由服务器转发，在此期间我们
            <b class="text-orange-500">
              不收集用户信息
            </b>
            ，感谢你的理解。
          </p>
          <p>除登录请求外，其余请求，如获取教室列表、创建预约等均由在浏览器端发出（即服务器不可见）。</p>
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

defineProps<{
  open: boolean;
  toggleOpen: (value?: boolean | undefined) => boolean;
}>();
</script>
