<script setup lang="ts">
import type { Menu } from '../../types';
import ArrowRightIcon from '../../../icons/ArrowRightIcon.vue';
import SubMenu from '../dropdown-menu/DropdownMenu.vue';
import { computed, inject, onBeforeUnmount } from 'vue';
import type { MenuContext } from '../../types';
import { HOVER_DELAY, PROVIDE_KEY } from '../../utils/constant';

const props = defineProps<{
  item: Menu;
}>();

const boardcast = inject<MenuContext>(PROVIDE_KEY);

const handleMouseEnter = () => {
  if (props.item.disabled) return;
  boardcast?.onEnter(props.item.id);
}

let timeoutTimer: number | null = null;
const handleMouseLeave = () => {
  if (props.item.disabled) return;

  if (timeoutTimer) clearTimeout(timeoutTimer);

  timeoutTimer = window.setTimeout(() => {
    const id = props.item.id;
    if (!activePath?.value?.has(id)) {
      boardcast?.onLeave(id);
    }
  }, HOVER_DELAY);
}

const activePath = boardcast?.activePath;

const isSubMenuVisible = computed(() => {
  const { children, id } = props.item;
  return activePath?.value?.has(id) && children;
})

const handleClickMenuItem = () => {
  if (props.item.disabled) return;
  if (props.item?.children) return;

  boardcast?.onClickMenuItem(props.item.id, props.item);
  boardcast?.onCloseAll();
} 

onBeforeUnmount(() => {
  if (timeoutTimer) clearTimeout(timeoutTimer);
})
</script>

<template>
  <div class="menu-item" :data-m-disabled="item.disabled" @click="handleClickMenuItem">
    <div class="menu-item-title" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      
      <div class="menu-item-title-text-container">
        <span class="menu-item-title-text">{{ item.title }}</span>
        <template v-if="item.needsFurtherAction">
          <span class="menu-item-title-text-further-action">...</span>
        </template>
      </div>

      
      <template v-if="item.shortcut">
        <span class="menu-item-title-shortcut">{{ item.shortcut }}</span>
      </template>

      <template v-if="item.children">
        <ArrowRightIcon class="menu-item-icon" style="width: 15px; height: 15px;" />
      </template>

    </div>
    <Transition name="submenu" mode="out-in">
      <template v-if="isSubMenuVisible && item.children">
        <SubMenu :menus="item.children" style="position: absolute; left: 105%;top: 0;" />
      </template>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.menu-item {
  position: relative;
  padding: 0;
  margin: 0;
  transition: background-color 0.2s ease;
  border-radius: 10px;
  user-select: none;

  &[data-m-disabled] {
    opacity: 0.5;
  }

  .menu-item-title {
    --text-color: #191a1b;
    --shortcut-color: #797b7f;

    display: flex;
    justify-content: space-between;
    display: flex;
    align-items: center;
    color: var(--text-color);
    line-height: 1.5;
    padding: 3px 5px 3px 10px;
    font-size: 13px;
    border-radius: 4px;
    margin: 1px 0;
    cursor: default;

    &-text-container {
      display: flex;
      align-items: center;
    }

    &-text {
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &-shortcut {
      letter-spacing: 2px;
      font-size: 12px;
      color: var(--shortcut-color);
    }
  }

  &:not([data-m-disabled]) .menu-item-title {
    cursor: pointer;

    &:hover {
      --text-color: #ffffff;
      --shortcut-color: #ffffff;
      background: linear-gradient(to top, #316acb, #326cce);
    }
  }
}

.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.2s ease;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.submenu-enter-to,
.submenu-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>