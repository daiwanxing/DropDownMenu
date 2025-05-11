import type { Menu } from '../types';

const findParentIds = (tree: Menu[], targetId: number) => {
  const result: number[] = [];

  const find = (items: Menu[], targetId: number, parentIds: number[] = []) => {
    for (const item of items) {
      // 如果找到目标节点，将当前路径添加到结果中
      if (item.id === targetId) {
        result.push(...parentIds);
        return true;
      }

      // 如果有子节点，递归查找
      if (item.children) {
        if (find(item.children, targetId, [...parentIds, item.id])) {
          return true;
        }
      }
    }
    return false;
  };

  find(tree, targetId);
  return result;
};

const flatTree = (tree: Menu[]) => {
  const result: Menu[] = [];

  const flat = (tree: Menu[]) => {
    tree.forEach((subTree) => {
      const { children, ...rest } = subTree;
      result.push(rest);
      if (children) flat(children);
    });
  };

  flat(tree);
  return result;
};

const findChildrenIds = (tree: Menu[], targetId: number) => {
  let target: Menu | null = null;

  const find = (list: Menu[]) => {
    list.forEach((item) => {
      if (item.id === targetId) {
        target = item;
      } else if (item.children) {
        find(item.children);
      }
    });
  };

  find(tree);

  // @ts-ignore
  const children = target?.children;
  return children ? flatTree(children).map((d) => d.id) : [];
};

export { findParentIds, flatTree, findChildrenIds };
