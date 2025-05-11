import { computed, onBeforeUnmount, shallowRef, unref, watch, watchEffect, type Ref } from 'vue';
import type { ShallowRef } from 'vue';
import { useThrottleFn } from '@vueuse/core';

const useDropdownClick = (
  enable: Ref<boolean>,
  options: {
    triggerRef: ShallowRef<HTMLElement>;
    menuContainerRef: ShallowRef<HTMLElement>;
    open: Ref<boolean>;
  },
) => {
  if (!options.triggerRef || !options.menuContainerRef) {
    console.warn('Missing required refs for dropdown click handler');
    return;
  }

  const triggerClickHandler = () => {
    options.open.value = !options.open.value;
  };

  const documentClickHandler = (e: Event) => {
    const target = e.target as HTMLElement;
    if (
      !unref(options.triggerRef)?.contains(target) &&
      !unref(options.menuContainerRef)?.contains(target)
    ) {
      options.open.value = false;
    }
  };

  watchEffect(
    (onCleanup) => {
      if (!enable.value) return;

      const el = unref(options.triggerRef);
      if (!el) return;

      el.addEventListener('click', triggerClickHandler);
      document.addEventListener('click', documentClickHandler);

      onCleanup(() => {
        const el = unref(options.triggerRef);
        if (!el) return;

        el.removeEventListener('click', triggerClickHandler);
        document.removeEventListener('click', documentClickHandler);
      });
    },
    {
      flush: 'post',
    },
  );
};

const useDropdownHover = (
  enable: Ref<boolean>,
  options: {
    menuContainerRef: ShallowRef<HTMLElement>;
    triggerRef: ShallowRef<HTMLElement>;
    open: Ref<boolean>;
  },
) => {
  if (!options.triggerRef || !options.menuContainerRef) {
    console.warn('Missing required refs for dropdown click handler');
    return;
  }

  const lastHovered = shallowRef<HTMLElement | null>(null);

  const updateLastHovered = useThrottleFn(
    (e: MouseEvent) => {
      lastHovered.value = e.target as HTMLElement;
    },
    250,
    true,
    true,
  );

  watchEffect(
    (onCleanup) => {
      if (enable.value) {
        document.addEventListener('mousemove', updateLastHovered);
      }

      onCleanup(() => {
        document.removeEventListener('mousemove', updateLastHovered);
      });
    },
    {
      flush: 'post',
    },
  );

  const isHovering = computed(() => {

    if (enable.value) {
      const el = lastHovered.value;
      return options.menuContainerRef.value?.contains(el) || options.triggerRef.value?.contains(el);
    }

    return false;
  });

  watch(isHovering, (state) => {
    if (!enable.value) return;
    options.open.value = state;
  });

  onBeforeUnmount(() => {
    document.removeEventListener('mousemove', updateLastHovered);
  });
};

const useTriggerListener = (
  trigger: 'click' | 'hover',
  triggerRef: ShallowRef<HTMLElement>,
  menuContainerRef: ShallowRef<HTMLElement>,
  open: Ref<boolean>,
) => {
  const enableHover = computed(() => trigger === 'hover');

  const enableClick = computed(() => trigger === 'click');

  useDropdownHover(enableHover, {
    menuContainerRef,
    triggerRef,
    open,
  });

  useDropdownClick(enableClick, {
    triggerRef,
    menuContainerRef,
    open,
  });
};

export { useTriggerListener };
