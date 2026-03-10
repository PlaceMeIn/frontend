<template>
  <div
    ref="container"
    class="fixed z-200"
    :class="{ 'cursor-grabbing': isDragging, 'cursor-grab': !isDragging }"
    :style="{ left: left + 'px', top: top + 'px' }"
    @mousedown="startDrag"
    @touchstart.prevent="startTouchDrag"
  >
  <div>
    <UIcon name="i-lucide-grip-horizontal" class="border -mb-3  ml-[90px] z-201" />
  </div>
    <button
      @click.stop="toggle"
      class="flex items-center gap-2 p-2 rounded bg-white/5 dark:bg-black/5 backdrop-blur-sm border border-white/10 dark:border-black/10 hover:bg-white/10 dark:hover:bg-black/10 shadow-lg pointer-events-auto"
      :class="{ 'opacity-50': isDragging }"
    >
      <div class="relative">
        <div class="w-1 h-8 bg-primary/40 rounded-full overflow-hidden">
          <div class="w-full bg-primary transition-all" :style="{ height: progress + '%' }" />
        </div>
      </div>
      <div class="flex flex-col flex-1">
        <span class="text-[8px] text-gray-500 dark:text-gray-400 whitespace-nowrap">ON THIS PAGE</span>
        <span class="text-xs font-medium text-primary truncate max-w-[50px]">{{ activeLabel || "—" }}</span>
      </div>
      <UIcon :name="isExpanded ? 'i-lucide-chevron-right' : 'i-lucide-chevron-left'" class="w-4 h-4 text-gray-500 transition-colors"/>
    </button>

    <transition name="fade">
      <div
        v-if="isExpanded"
        class="mt-2 bg-white/5 dark:bg-black/5 backdrop-blur-sm border border-white/10 dark:border-black/10 rounded p-2 text-[10px] font-mono w-fit min-w-[110px] shadow-xl pointer-events-auto"
        @click.stop
      >
        <div class="flex justify-between items-center mb-1 px-2 py-0.5 text-[8px] uppercase tracking-widest border-b border-white/10 dark:border-black/10">
          <span class="text-primary/70">// {{ title }}</span>
          <button @click.stop="isExpanded = false" class="text-gray-500 hover:text-primary p-1 rounded hover:bg-white/10 dark:hover:bg-black/10">
            <UIcon name="i-lucide-chevron-right" class="w-3 h-3" />
          </button>
        </div>

        <div v-if="!sections.length" class="px-2 py-1 text-gray-500 text-[8px]">No sections available</div>

        <template v-else>
          <a
            v-for="section in sections"
            :key="section.id"
            href="#"
            class="block px-2 py-1 hover:text-primary transition-colors truncate text-[9px] rounded hover:bg-white/5 dark:hover:bg-black/5"
            :class="{
              'text-primary font-bold bg-primary/5': activeSection === section.id,
              'text-gray-600 dark:text-gray-400': activeSection !== section.id,
            }"
            @click.prevent="scrollTo(section.id)"
          >
            <span class="flex items-center gap-2">
              <span class="w-1 h-1 rounded-full" :class="activeSection === section.id ? 'bg-primary' : 'bg-gray-400'"></span>
              {{ section.label }}
            </span>
          </a>
        </template>

        <div class="mt-1 pt-1 border-t border-white/10 dark:border-black/10 flex justify-between items-center">
          <button @click.stop="scrollTop" class="text-[8px] text-gray-500 hover:text-primary inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 dark:hover:bg-black/5">
            <UIcon name="i-lucide-arrow-up" class="w-3 h-3" /> TOP
          </button>
          <span class="text-[8px] text-gray-500">{{ displayIndex }}/{{ sections.length }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from "vue";
import { useRoute } from "vue-router";
import { useStateStore } from "@/stores/state";

export interface OnThisPageSection { id: string; label: string; }

const props = withDefaults(
  defineProps<{ sections?: OnThisPageSection[], title?: string, offset?: number }>(),
  { sections: () => [], title: "PAGE", offset: 100 },
);

const emit = defineEmits<{ (e: "update:active", id: string): void }>();
const stateStore = useStateStore();

const container = ref<HTMLElement | null>(null);
const isExpanded = ref(false);
const activeSection = ref("");
const isDragging = ref(false);

const left = ref(0);
const top = ref(0);

let startX = 0;
let startY = 0;
let initialLeft = 0;
let initialTop = 0;

let longPressTimer: number | null = null;

const toggle = () => {
  if (!isDragging.value) {
    isExpanded.value = !isExpanded.value;
  }
};

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.offsetTop - props.offset, behavior: "smooth" });
  activeSection.value = id;
  isExpanded.value = false;
  emit("update:active", id);
};

const scrollTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  activeSection.value = "";
  isExpanded.value = false;
  emit("update:active", "");
};

// Desktop drag
const startDrag = (e: MouseEvent) => {
  // Only start drag if clicking on the container (not on interactive elements)
  const target = e.target as HTMLElement;
  if (target.closest('button, a')) return;
  
  e.preventDefault();
  isDragging.value = true;
  startX = e.clientX;
  startY = e.clientY;
  initialLeft = left.value;
  initialTop = top.value;
  
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;
  e.preventDefault();
  
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  const cw = container.value?.offsetWidth || 0;
  const ch = container.value?.offsetHeight || 0;
  
  left.value = Math.min(Math.max(0, initialLeft + dx), window.innerWidth - cw);
  top.value = Math.min(Math.max(0, initialTop + dy), window.innerHeight - ch);
  stateStore.onthispage.left = left.value;
  stateStore.onthispage.top = top.value;
};

const stopDrag = () => {
  isDragging.value = false;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
};

// Mobile drag (long press to activate)
const startTouchDrag = (e: TouchEvent) => {
  const target = e.target as HTMLElement;
  if (target.closest('button, a')) return;
  
  e.preventDefault();
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
  initialLeft = left.value;
  initialTop = top.value;
  
  // Long press to activate drag mode
  longPressTimer = window.setTimeout(() => {
    isDragging.value = true;
    window.addEventListener('touchmove', onTouchDrag, { passive: false });
    window.addEventListener('touchend', stopTouchDrag);
    window.addEventListener('touchcancel', stopTouchDrag);
  }, 300);
};

const onTouchDrag = (e: TouchEvent) => {
  if (!isDragging.value) return;
  e.preventDefault();
  
  const touch = e.touches[0];
  const dx = touch.clientX - startX;
  const dy = touch.clientY - startY;
  const cw = container.value?.offsetWidth || 0;
  const ch = container.value?.offsetHeight || 0;
  
  left.value = Math.min(Math.max(0, initialLeft + dx), window.innerWidth - cw);
  top.value = Math.min(Math.max(0, initialTop + dy), window.innerHeight - ch);
  
  startX = touch.clientX;
  startY = touch.clientY;
  initialLeft = left.value;
  initialTop = top.value;
  
  stateStore.onthispage.left = left.value;
  stateStore.onthispage.top = top.value;
};

const stopTouchDrag = () => {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }
  isDragging.value = false;
  window.removeEventListener('touchmove', onTouchDrag);
  window.removeEventListener('touchend', stopTouchDrag);
  window.removeEventListener('touchcancel', stopTouchDrag);
};

const handleClickOutside = (e: MouseEvent) => {
  if (!container.value) return;
  if (!container.value.contains(e.target as Node) && !isDragging.value) {
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
  if (!current && window.scrollY < 100) current = "";
  if (current !== activeSection.value) { 
    activeSection.value = current; 
    emit("update:active", current); 
  }
};

let ticking = false;
const onScroll = () => { 
  if (!ticking) { 
    window.requestAnimationFrame(() => { 
      handleScroll(); 
      ticking = false; 
    }); 
    ticking = true; 
  } 
};

// Computed
const activeLabel = computed(() => props.sections.find(s => s.id === activeSection.value)?.label || "");
const activeIndex = computed(() => props.sections.findIndex(s => s.id === activeSection.value));
const displayIndex = computed(() => activeIndex.value === -1 ? 0 : activeIndex.value + 1);
const progress = computed(() => activeIndex.value === -1 ? 0 : ((activeIndex.value + 1) / props.sections.length) * 100);

// Lifecycle
onMounted(() => {
  left.value = stateStore.onthispage.left ?? (window.innerWidth - 150);
  top.value = stateStore.onthispage.top ?? 100;

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("mousedown", handleClickOutside);
  nextTick(() => handleScroll());
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("mousedown", handleClickOutside);
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
  window.removeEventListener('touchmove', onTouchDrag);
  window.removeEventListener('touchend', stopTouchDrag);
  window.removeEventListener('touchcancel', stopTouchDrag);
  if (longPressTimer) clearTimeout(longPressTimer);
});

const route = useRoute();
watch(() => route.path, () => { 
  activeSection.value = ""; 
  isExpanded.value = false; 
  nextTick(() => handleScroll()); 
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { 
  transition: opacity 0.2s ease, transform 0.2s ease; 
}
.fade-enter-from, .fade-leave-to { 
  opacity: 0; 
  transform: translateY(5px); 
}
.cursor-grab { 
  cursor: grab; 
}
.cursor-grabbing { 
  cursor: grabbing; 
}
.pointer-events-auto {
  pointer-events: auto;
}
</style>