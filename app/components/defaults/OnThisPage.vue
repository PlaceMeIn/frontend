<template>
  <div
    ref="container"
    class="fixed z-200 cursor-grab touch-none"
    :style="{ left: left + 'px', top: top + 'px' }"
    @click.stop
  >
    <button
      @click="toggle"
      class="flex items-center gap-2 p-2 rounded bg-white/5 dark:bg-black/5 backdrop-blur-sm border border-white/10 dark:border-black/10 hover:bg-white/10 dark:hover:bg-black/10 shadow-lg"
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
        class="mt-2 bg-white/5 dark:bg-black/5 backdrop-blur-sm border border-white/10 dark:border-black/10 rounded p-2 text-[10px] font-mono w-fit min-w-[110px] shadow-xl"
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
          <button @click="scrollTop" class="text-[8px] text-gray-500 hover:text-primary inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 dark:hover:bg-black/5">
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

const left = ref(0);
const top = ref(0);

let dragging = false;
let startX = 0;
let startY = 0;
let initialLeft = 0;
let initialTop = 0;

let touchDragging = false;
let touchTimer: number | null = null;
let touchStartX = 0;
let touchStartY = 0;

const toggle = () => (isExpanded.value = !isExpanded.value);

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

const handleScroll = () => {
  const scrollPos = window.scrollY + props.offset;
  let current = "";
  for (let i = props.sections.length - 1; i >= 0; i--) {
    const el = document.getElementById(props.sections[i].id);
    if (el && scrollPos >= el.offsetTop) { current = props.sections[i].id; break; }
  }
  if (!current && window.scrollY < 100) current = "";
  if (current !== activeSection.value) { activeSection.value = current; emit("update:active", current); }
};

let ticking = false;
const onScroll = () => { if (!ticking) { window.requestAnimationFrame(() => { handleScroll(); ticking = false; }); ticking = true; } };

// Desktop drag
const onMouseDown = (e: MouseEvent) => {
  dragging = true; startX = e.clientX; startY = e.clientY; initialLeft = left.value; initialTop = top.value; e.preventDefault();
};
const onMouseMove = (e: MouseEvent) => {
  if (!dragging) return;
  const dx = e.clientX - startX, dy = e.clientY - startY;
  const cw = container.value?.offsetWidth || 0, ch = container.value?.offsetHeight || 0;
  left.value = Math.min(Math.max(0, initialLeft + dx), window.innerWidth - cw);
  top.value = Math.min(Math.max(0, initialTop + dy), window.innerHeight - ch);
  stateStore.onthispage.left = left.value;
  stateStore.onthispage.top = top.value;
};
const onMouseUp = () => (dragging = false);

// Mobile drag
const onTouchStart = (e: TouchEvent) => { const t = e.touches[0]; touchStartX = t.clientX; touchStartY = t.clientY; touchTimer = window.setTimeout(() => touchDragging = true, 250); };
const onTouchMove = (e: TouchEvent) => {
  if (!touchDragging) return;
  const t = e.touches[0];
  const cw = container.value?.offsetWidth || 0, ch = container.value?.offsetHeight || 0;
  const dx = t.clientX - touchStartX, dy = t.clientY - touchStartY;
  left.value = Math.min(Math.max(0, left.value + dx), window.innerWidth - cw);
  top.value = Math.min(Math.max(0, top.value + dy), window.innerHeight - ch);
  touchStartX = t.clientX; touchStartY = t.clientY;
  stateStore.onthispage.left = left.value;
  stateStore.onthispage.top = top.value;
};
const onTouchEnd = () => { touchDragging = false; if (touchTimer) clearTimeout(touchTimer); touchTimer = null; };

const handleClickOutside = (e: MouseEvent) => { if (!container.value) return; if (!container.value.contains(e.target as Node)) isExpanded.value = false; };

const activeLabel = computed(() => props.sections.find(s => s.id === activeSection.value)?.label || "");
const activeIndex = computed(() => props.sections.findIndex(s => s.id === activeSection.value));
const displayIndex = computed(() => activeIndex.value === -1 ? 0 : activeIndex.value + 1);
const progress = computed(() => activeIndex.value === -1 ? 0 : ((activeIndex.value + 1) / props.sections.length) * 100);

onMounted(() => {
  left.value = stateStore.onthispage.left ?? (window.innerWidth - 100);
  top.value = stateStore.onthispage.top ?? 100;

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("touchstart", onTouchStart);
  window.addEventListener("touchmove", onTouchMove);
  window.addEventListener("touchend", onTouchEnd);
  window.addEventListener("touchcancel", onTouchEnd);
  window.addEventListener("mousedown", handleClickOutside);
  nextTick(() => handleScroll());
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("mousedown", onMouseDown);
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
  window.removeEventListener("touchstart", onTouchStart);
  window.removeEventListener("touchmove", onTouchMove);
  window.removeEventListener("touchend", onTouchEnd);
  window.removeEventListener("touchcancel", onTouchEnd);
  window.removeEventListener("mousedown", handleClickOutside);
});

const route = useRoute();
watch(() => route.path, () => { activeSection.value = ""; isExpanded.value = false; nextTick(() => handleScroll()); });
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(5px); }
.cursor-grab { cursor: grab; }
.cursor-grabbing { cursor: grabbing; }
</style>