<template>
  <div
    ref="container"
    class="fixed z-200 select-none shadow-xl text-xs"
    :class="{ dragging: isDragging }"
    :style="{ left: left + 'px', top: top + 'px' }"
    @touchstart.passive="onTouchStart"
    @mousedown="onMouseDown"
  >
    <!-- Drag Handle -->
    <div
      class="drag-handle flex items-center justify-between w-full px-2 py-1.5 rounded-t-md cursor-grab active:cursor-grabbing transition-all"
      :class="{
        'bg-white/25 dark:bg-black/25 backdrop-blur-lg border-b border-white/10 dark:border-black/20':
          isExpanded,
        'bg-white/10 dark:bg-black/10 backdrop-blur-md hover:bg-white/20 dark:hover:bg-black/20':
          !isExpanded,
      }"
      @click.stop="isExpanded = !isExpanded"
    >
      <!-- Drag icon -->
      <div class="flex items-center gap-1 text-gray-500">
        <UIcon name="i-lucide-grip-vertical" class="w-3 h-3 opacity-70" />
      </div>

      <!-- Center content -->
      <div class="flex items-center gap-2 flex-1 justify-start w-full ml-0">
        <!-- Progress bar -->
        <div class="w-[3px] h-5 bg-primary/25 rounded-full overflow-hidden">
          <div
            class="w-full bg-primary transition-all duration-300"
            :style="{ height: progress + '%' }"
          />
        </div>

        <span
          class="text-[10px] font-medium text-primary truncate max-w-[80px]"
        >
          {{ activeLabel || "Page" }}
        </span>
      </div>

      <!-- Expand icon -->
      <UIcon
        :name="isExpanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
        class="w-3.5 h-3.5 text-gray-500 transition-transform duration-200"
        :class="{ 'rotate-180': isExpanded }"
      />
    </div>

    <!-- Expanded -->
    <transition name="slide">
      <div
        v-if="isExpanded"
        class="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-white/20 dark:border-black/20 rounded-b-md shadow-lg overflow-hidden"
        @click.stop
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-2 py-1 border-b border-white/10 dark:border-black/10"
        >
          <span
            class="text-[9px] font-mono uppercase tracking-wide text-primary/70"
          >
            // {{ title }}
          </span>

          <button
            @click.stop="isExpanded = false"
            class="p-1 rounded hover:bg-white/10 dark:hover:bg-black/10 transition"
          >
            <UIcon name="i-lucide-x" class="w-3 h-3" />
          </button>
        </div>

        <!-- Sections -->
        <div class="max-h-[35vh] overflow-y-auto overscroll-contain">
          <div
            v-if="!sections.length"
            class="px-2 py-1 text-center text-gray-500 text-[10px]"
          >
            No sections
          </div>

          <template v-else>
            <button
              v-for="section in sections"
              :key="section.id"
              @click.stop="scrollTo(section.id)"
              class="w-full text-left px-2 py-1.5 flex items-center gap-1.5 hover:bg-white/5 dark:hover:bg-black/5 transition border-b border-white/5 dark:border-black/5 last:border-0"
              :class="{
                'bg-primary/5 text-primary font-medium':
                  activeSection === section.id,
                'text-gray-700 dark:text-gray-300':
                  activeSection !== section.id,
              }"
            >
              <span
                class="w-1.5 h-1.5 rounded-full flex-shrink-0"
                :class="
                  activeSection === section.id ? 'bg-primary' : 'bg-gray-400'
                "
              ></span>

              <span class="text-[11px] flex-1 truncate">
                {{ section.label }}
              </span>
            </button>
          </template>
        </div>

        <!-- Footer -->
        <div
          class="flex items-center justify-between px-2 py-1 border-t border-white/10 dark:border-black/10 bg-white/5 dark:bg-black/5"
        >
          <button
            @click.stop="scrollTop"
            class="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-gray-600 dark:text-gray-400 hover:text-primary transition"
          >
            <UIcon name="i-lucide-arrow-up" class="w-3 h-3" />
            <span>TOP</span>
          </button>

          <span class="text-[9px] text-gray-500">
            {{ displayIndex }}/{{ sections.length }}
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from "vue";
import { useRoute } from "vue-router";
import { useStateStore } from "@/stores/state";

export interface OnThisPageSection {
  id: string;
  label: string;
}

const props = withDefaults(
  defineProps<{
    sections?: OnThisPageSection[];
    title?: string;
    offset?: number;
  }>(),
  { sections: () => [], title: "PAGE", offset: 100 },
);

const emit = defineEmits<{ (e: "update:active", id: string): void }>();
const stateStore = useStateStore();

const container = ref<HTMLElement | null>(null);
const isExpanded = ref(false);
const activeSection = ref("");
const isDragging = ref(false);

const left = ref(0);
const top = ref(80);

let startX = 0;
let startY = 0;
let initialLeft = 0;
let initialTop = 0;
let dragStartTime = 0;
let touchStartTarget: EventTarget | null = null;

// Constants
const DRAG_THRESHOLD = 5; // pixels to move before considering it a drag
const LONG_PRESS_DURATION = 300; // ms
const SNAP_EDGE_DISTANCE = 20; // pixels from edge to snap

// Toggle expanded state
const toggle = () => {
  if (!isDragging.value) {
    isExpanded.value = !isExpanded.value;
  }
};

// Scroll to section
const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;

  // Close expanded view first for better UX
  isExpanded.value = false;

  // Small delay to allow UI to update
  setTimeout(() => {
    window.scrollTo({
      top: el.offsetTop - props.offset,
      behavior: "smooth",
    });
    activeSection.value = id;
    emit("update:active", id);
  }, 50);
};

const scrollTop = () => {
  isExpanded.value = false;
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    activeSection.value = "";
    emit("update:active", "");
  }, 50);
};

// Mouse drag handlers (desktop)
const onMouseDown = (e: MouseEvent) => {
  // Only start drag if clicking on drag handle or container background
  const target = e.target as HTMLElement;
  if (!target.closest(".drag-handle") && target.closest(".expanded-content"))
    return;

  e.preventDefault();
  startDrag(e.clientX, e.clientY);
};

// Touch handlers (mobile)
const onTouchStart = (e: TouchEvent) => {
  const target = e.target as HTMLElement;
  touchStartTarget = e.target;

  // Don't start drag if touching interactive elements in expanded content
  if (target.closest(".expanded-content button, .expanded-content a")) {
    return;
  }

  // Allow drag from anywhere in the collapsed state
  if (!isExpanded.value || target.closest(".drag-handle")) {
    e.preventDefault(); // Prevent scrolling while dragging

    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    initialLeft = left.value;
    initialTop = top.value;
    dragStartTime = Date.now();

    // Add non-passive touchmove listener to prevent scrolling
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
  }
};

const onTouchMove = (e: TouchEvent) => {
  if (!startX && startX !== 0) return;

  const touch = e.touches[0];
  const deltaX = Math.abs(touch.clientX - startX);
  const deltaY = Math.abs(touch.clientY - startY);
  const moveDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  // Start dragging after threshold or long press
  if (!isDragging.value && moveDistance > DRAG_THRESHOLD) {
    isDragging.value = true;
    // Prevent default scrolling
    e.preventDefault();
  }

  if (isDragging.value) {
    e.preventDefault();

    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    const cw = container.value?.offsetWidth || 0;
    const ch = container.value?.offsetHeight || 0;

    // Calculate new position
    let newLeft = initialLeft + dx;
    let newTop = initialTop + dy;

    // Constrain to screen bounds
    newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - cw));
    newTop = Math.max(0, Math.min(newTop, window.innerHeight - ch));

    left.value = newLeft;
    top.value = newTop;

    // Update store
    stateStore.onthispage.left = left.value;
    stateStore.onthispage.top = top.value;
  }
};

const onTouchEnd = (e: TouchEvent) => {
  const touchDuration = Date.now() - dragStartTime;
  const touch = e.changedTouches[0];

  // Handle long press to toggle expanded state
  if (
    !isDragging.value &&
    touchDuration >= LONG_PRESS_DURATION &&
    touchStartTarget
  ) {
    const target = touchStartTarget as HTMLElement;
    if (!target.closest(".expanded-content button, .expanded-content a")) {
      isExpanded.value = !isExpanded.value;
    }
  }

  // Snap to edges if close
  if (isDragging.value) {
    snapToEdge();
  }

  // Clean up
  isDragging.value = false;
  startX = 0;
  startY = 0;
  touchStartTarget = null;

  window.removeEventListener("touchmove", onTouchMove);
  window.removeEventListener("touchend", onTouchEnd);
  window.removeEventListener("touchcancel", onTouchEnd);
};

// Desktop drag handlers
const startDrag = (clientX: number, clientY: number) => {
  isDragging.value = true;
  startX = clientX;
  startY = clientY;
  initialLeft = left.value;
  initialTop = top.value;

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
};

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return;
  e.preventDefault();

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  const cw = container.value?.offsetWidth || 0;
  const ch = container.value?.offsetHeight || 0;

  let newLeft = initialLeft + dx;
  let newTop = initialTop + dy;

  newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - cw));
  newTop = Math.max(0, Math.min(newTop, window.innerHeight - ch));

  left.value = newLeft;
  top.value = newTop;

  stateStore.onthispage.left = left.value;
  stateStore.onthispage.top = top.value;
};

const onMouseUp = () => {
  if (isDragging.value) {
    snapToEdge();
  }

  isDragging.value = false;
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
};

// Snap to screen edges
const snapToEdge = () => {
  const cw = container.value?.offsetWidth || 0;
  const screenWidth = window.innerWidth;

  // Snap to left or right edge
  if (left.value < SNAP_EDGE_DISTANCE) {
    left.value = 0;
  } else if (left.value + cw > screenWidth - SNAP_EDGE_DISTANCE) {
    left.value = screenWidth - cw;
  }

  // Optional: snap to top/bottom edges
  // if (top.value < SNAP_EDGE_DISTANCE) top.value = 0;
  // if (top.value + ch > window.innerHeight - SNAP_EDGE_DISTANCE) top.value = window.innerHeight - ch;

  stateStore.onthispage.left = left.value;
  stateStore.onthispage.top = top.value;
};

// Handle click outside
const handleClickOutside = (e: MouseEvent | TouchEvent) => {
  if (!container.value || !isExpanded.value || isDragging.value) return;

  const target = e.target as Node;
  if (!container.value.contains(target)) {
    isExpanded.value = false;
  }
};

// Scroll detection
const handleScroll = () => {
  const scrollPos = window.scrollY + props.offset;
  let current = "";

  for (let i = props.sections.length - 1; i >= 0; i--) {
    const el = document.getElementById(props.sections[i].id);
    if (el && scrollPos >= el.offsetTop) {
      current = props.sections[i].id;
      break;
    }
  }

  if (window.scrollY < 100) current = "";

  if (current !== activeSection.value) {
    activeSection.value = current;
    emit("update:active", current);
  }
};

// Throttled scroll handler
let ticking = false;
const onScroll = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      handleScroll();
      ticking = false;
    });
    ticking = true;
  }
};

// Computed
const activeLabel = computed(
  () => props.sections.find((s) => s.id === activeSection.value)?.label || "",
);
const activeIndex = computed(() =>
  props.sections.findIndex((s) => s.id === activeSection.value),
);
const displayIndex = computed(() =>
  activeIndex.value === -1 ? 0 : activeIndex.value + 1,
);
const progress = computed(() =>
  activeIndex.value === -1
    ? 0
    : ((activeIndex.value + 1) / props.sections.length) * 100,
);

// Lifecycle
onMounted(() => {
  // Load saved position or set default
  left.value = stateStore.onthispage.left ?? 16; // Default left margin
  top.value = stateStore.onthispage.top ?? 100;

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("mousedown", handleClickOutside);
  window.addEventListener("touchstart", handleClickOutside, { passive: true });

  nextTick(() => handleScroll());
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("mousedown", handleClickOutside);
  window.removeEventListener("touchstart", handleClickOutside);
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
  window.removeEventListener("touchmove", onTouchMove);
  window.removeEventListener("touchend", onTouchEnd);
  window.removeEventListener("touchcancel", onTouchEnd);
});

// Reset on route change
const route = useRoute();
watch(
  () => route.path,
  () => {
    activeSection.value = "";
    isExpanded.value = false;
    nextTick(() => handleScroll());
  },
);
</script>

<style scoped>
/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
  transform-origin: top;
  max-height: 500px;
  opacity: 1;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: scaleY(0.8);
}

/* Dragging state */
.dragging {
  transition: none !important;
  opacity: 0.9;
  z-index: 9999;
}

.dragging .drag-handle {
  cursor: grabbing;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
}

/* Drag handle */
.drag-handle {
  min-width: 140px;
  touch-action: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.2s ease;
}

.drag-handle:active {
  cursor: grabbing;
  background: rgba(255, 255, 255, 0.15);
}

/* Expanded content */
.expanded-content {
  min-width: 200px;
  max-width: 280px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .drag-handle {
    min-width: 120px;
    padding: 12px 8px;
  }

  .expanded-content {
    min-width: 180px;
    max-width: 240px;
  }
}

/* Prevent text selection while dragging */
.select-none {
  user-select: none;
  -webkit-user-select: none;
}

/* Improve touch targets */
button,
.drag-handle,
.expanded-content button {
  touch-action: manipulation;
}

/* Scrollbar styling */
.expanded-content .overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
}

.expanded-content .overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.expanded-content .overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.expanded-content .overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(155, 155, 155, 0.5);
  border-radius: 20px;
}
</style>
