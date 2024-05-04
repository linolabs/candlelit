<template>
  <div class="space-y-1">
    <h5 class="font-bold text-lg">
      智能筛选
    </h5>
    <div class="grid grid-cols-1 items-center border border-primary rounded-md">
      <div class="border-b border-primary px-2 py-2 flex items-center justify-between">
        <span class="mr-2">
          楼层优先
          <span class="font-bold mx-1">
            {{ sortOptions.firstSortBy === 'floor' ? '高于' : '低于' }}
          </span>
          建筑优先
        </span>
        <Button variant="outline" class="mr-2" @click="toggleFirstSortBy">
          <Icon icon="ph:arrows-clockwise-duotone" class="h-5 w-5 mr-2" />
          <span>更换</span>
        </Button>
      </div>
      <div class="px-2 py-2 flex items-center justify-between">
        <span>建筑排序</span>
        <div class="flex items-center space-x-2">
          <TransitionGroup name="list">
            <template v-for="(building, index) in sortOptions.buildingOrder" :key="sortOptions.buildingOrder[index]">
              <div class="grid grid-cols-1 justify-items-center gap-y-1">
                <span class="flex items-center justify-center font-bold shadow w-8 h-8 rounded-sm border border-primary">
                  {{ building }}
                </span>
                <div class="rounded-md flex">
                  <Button variant="outline" class="rounded-r-none p-1 h-6 w-6" :disabled="index === 0" @click="moveBuilding(index, -1)">
                    <Icon icon="ph:caret-left-duotone" class="h-5 w-5" />
                  </Button>
                  <Button variant="outline" class="rounded-l-none p-1 h-6 w-6" :disabled="index === 3" @click="moveBuilding(index, 1)">
                    <Icon icon="ph:caret-right-duotone" class="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </template>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const bookerStore = useBookerStore();
const { sortOptions } = storeToRefs(bookerStore);

function toggleFirstSortBy() {
  sortOptions.value = {
    ...sortOptions.value,
    firstSortBy: sortOptions.value.firstSortBy === 'floor' ? 'building' : 'floor',
  };
}

function moveBuilding(index: number, delta: 1 | -1) {
  const newOrder = [...sortOptions.value.buildingOrder];
  const building = newOrder[index];
  newOrder[index] = newOrder[index + delta];
  newOrder[index + delta] = building;
  sortOptions.value = { ...sortOptions.value, buildingOrder: newOrder };
}
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.35s cubic-bezier(0.55, 0, 0.1, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
