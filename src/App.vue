<script setup lang="ts">
import type { Menu } from './components/dropdown/types';
import { ref } from 'vue';
import { Dropdown } from './components/dropdown';
const list = ref<Menu[]>([
  {
    id: 1,
    title: 'About Cursor',
  },
  {
    id: 2,
    title: 'Check for Updates',
    needsFurtherAction: true,
  },
  {
    id: 3,
    title: 'Preferences',
    children: [
      {
        id: 31,
        title: 'Profiles',
      },
      {
        id: 32,
        title: 'Cursor Settings',
      },
      {
        id: 33,
        title: 'VS Code Settings',
      },
      {
        id: 34,
        title: 'Extensions',
      },
      {
        id: 35,
        title: 'Theme',
        children: [
          {
            id: 351,
            title: 'Color Theme',
          },
          {
            id: 352,
            title: 'File Icon Theme',
          },
          {
            id: 353,
            title: 'Product Icon Theme',
          },
        ]
      },
    ]
  },
  {
    id: 5,
    title: 'Show All',
    disabled: true,
  },
  {
    id: 6,
    title: 'Hide Others',
    shortcut: '⌥⌘H',
  },
  {
    id: 4,
    title: 'Quit Cursor',
    shortcut: '⌘Q',
  },
]);
</script>


<template>
  <div class="app">
    <div class="btn-container">
      <Dropdown :menu="list" trigger="hover">
        <template #default="{ open }">
          <button class="btn" :class="{ 'active': open }">Cursor</button>
        </template>
      </Dropdown>
    </div>
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  height: 100dvh;
  background: #000;
}

.btn-container {
  padding: 50px;
  display: flex;
  justify-content: center;
}

.btn {
  padding: 5px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #fff;
  font-weight: bold;
  background-color: transparent;
  border: none;
  outline: none;

  &.active {
    background-color: #262626;
    filter: brightness(0.9);
  }

  &:hover {
    background-color: #262626;
    filter: brightness(0.9);
  }
}
</style>

