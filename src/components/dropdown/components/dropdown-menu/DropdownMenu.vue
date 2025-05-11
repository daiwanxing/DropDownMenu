<script setup lang="ts">
import { inject } from 'vue';
import MenuItem from '../dropdown-menu-item/DropdownMenuItem.vue';
import { PROVIDE_KEY } from '../../utils/constant';
import type { Menu, MenuContext } from '../../types';

defineProps<{
  menus: Menu[]
}>();

defineOptions({
  name: 'SubMenu'
});

const boardcast = inject<MenuContext>(PROVIDE_KEY);

const handleMouseLeave = () => {
  boardcast?.onLeaveMenuPanel();
}

const handleMouseEnter = () => {
  boardcast?.onEnterMenuPanel();
}
</script>

<template>
  <div class="sub-menu">
    <MenuItem 
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      v-for="menu in menus"
      :key="menu.id"
      :item="menu"
    />
  </div>
</template>

<style scoped>
.sub-menu {
  padding: 5px 3px;
  min-width: 250px;
  background-color: #9b9c9d;
  backdrop-filter: blur(12px);
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}
</style>