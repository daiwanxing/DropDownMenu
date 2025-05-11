import type { Ref } from 'vue';

export interface Menu {
  id: number;
  parentId?: number;
  title: string;
  children?: Menu[];
  /**
   * @description 快捷键
   */
  shortcut?: string;
  /**
   * @description 是否禁用
   */
  disabled?: boolean;
  /**
   * @description 是否需要进一步操作
   */
  needsFurtherAction?: boolean;
}

export type MenuContext = {
  activePath: Ref<Set<number>>;
  onEnter: (id: number) => void;
  onLeave: (id: number) => void;
  onCloseAll: () => void;
  onEnterMenuPanel: () => void;
  onLeaveMenuPanel: () => void;
  onClickMenuItem: (key: number, node: Menu) => void;
};
