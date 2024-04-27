<template>
  <Dialog :open="open" @update:open="toggleOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>用户手册</DialogTitle>
      </DialogHeader>
      <div class="prose">
        <h4 class="text-orange-500">
          适用场景
        </h4>
        <ul>
          <li>
            需要某一时间段的场地，不需要是特定教室（支持楼层优先级排序、ABCD栋优先级排序）
          </li>
          <li>需要重复预约某一固定时间段</li>
          <li>一次预约多间教室</li>
        </ul>
        <h4 class="text-orange-500">
          使用指南
        </h4>
        <ol>
          <li>登录希悦。</li>
          <li>创建预约。</li>
        </ol>
        <h4 class="text-orange-500">
          隐私政策
        </h4>
        <p>
          由于浏览器跨域资源请求限制，无法直接从从浏览器发送希悦登录请求，需经由服务器转发，在此期间我们
          <b class="text-orange-500">
            不收集用户信息。
          </b>
        </p>
        <p>除登录请求外，其余请求，如获取教室列表、创建预约等均由在浏览器端发出（即服务器不可见）。</p>
      </div>
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

defineProps<{
  open: boolean;
  toggleOpen: (value?: boolean | undefined) => boolean;
}>();
</script>
