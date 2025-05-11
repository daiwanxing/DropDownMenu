<script setup lang="ts">
import SubMenu from './dropdown-menu/DropdownMenu.vue';
import { onBeforeUnmount, provide, ref, useTemplateRef } from 'vue';
import { findChildrenIds, findParentIds } from '../utils/tree';
import { LEAVE_DELAY, PROVIDE_KEY } from '../utils/constant';
import { useTriggerListener } from '../hooks/useTriggerListener';
import type { Menu as MenuType } from '../types';
import type { Placement } from '@floating-ui/vue';
import type { ShallowRef } from 'vue';

const props = withDefaults(defineProps<{
  menu: MenuType[];
  trigger?: 'click' | 'hover';
  placement?: Placement;
}>(), {
  trigger: 'click',
  placement: 'bottom-start',
});

const emit = defineEmits<{
  (e: 'click', key: number, node: MenuType): void
}>();


const open = defineModel<boolean>('open', {
  default: false,
});

const menuContainerRef = useTemplateRef('menuContainerRef');
const triggerRef = useTemplateRef('triggerRef');

useTriggerListener(props.trigger, triggerRef as ShallowRef<HTMLElement>, menuContainerRef as ShallowRef<HTMLElement>, open);

const activePath = ref(new Set<number>());
const treeItems = props.menu;

let isEnter = false;
let leaveTimer: number | null = null;

provide(PROVIDE_KEY, {
  activePath,
  onEnter(id: number) {
    activePath.value.clear();
    const path = findParentIds(treeItems, id);
    [...path, id].forEach(item => activePath.value.add(item));
  },
  onLeave(id: number) {
    const ids = findChildrenIds(treeItems, id);
    [...ids, id].forEach(item => activePath.value.delete(item));
  },
  onEnterMenuPanel() {
    isEnter = true;
  },
  onLeaveMenuPanel() {
    isEnter = false;
    if (leaveTimer) window.clearTimeout(leaveTimer);
    leaveTimer = window.setTimeout(() => {
      if (!isEnter) {
        activePath.value.clear();
      }
    }, LEAVE_DELAY);
  },
  onClickMenuItem(key: number, node: MenuType) {
    emit('click', key, node);
  },
  onCloseAll() {
    open.value = false;
    activePath.value.clear();
  }
});

onBeforeUnmount(() => {
  if (leaveTimer) window.clearTimeout(leaveTimer);
})
</script>

<template>
  <div class="dropdown">
    <div class="dropdown-trigger" ref="triggerRef">
      <slot :open="open" />
    </div>
    <Transition name="menu" appear>
      <div class="menu-container" v-if="open" ref="menuContainerRef">
        <SubMenu :menus="treeItems" />
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.menu-container {
  position: absolute;
  transform: translateY(10px);
}

.menu-enter-active,
.menu-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>