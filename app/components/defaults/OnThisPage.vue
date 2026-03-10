<template>
  <div ref="container" class="fixed top-24 right-4 z-200" @click.stop>
    <!-- Toggle Button -->
    <button
      @click="toggle"
      class="cursor-pointer bg-white/5 dark:bg-black/5 backdrop-blur-sm border border-white/10 dark:border-black/10 rounded p-2 hover:bg-white/10 transition flex items-center gap-2 shadow-lg"
    >
      <div class="relative">
        <div class="w-1 h-8 bg-primary/40 rounded-full overflow-hidden">
          <div
            class="w-full bg-primary transition-all"
            :style="{ height: progress + '%' }"
          />
        </div>
      </div>

      <div class="flex flex-col flex-1">
        <span class="text-[8px] text-gray-500 dark:text-gray-400">ON THIS PAGE</span>
        <span class="text-xs font-medium text-primary truncate max-w-[100px]">
          {{ activeLabel || "—" }}
        </span>
      </div>

      <UIcon
        :name="isExpanded ? 'i-lucide-chevron-right' : 'i-lucide-chevron-left'"
        class="w-4 h-4 text-gray-500 transition-colors"
      />
    </button>

    <!-- Expanded Panel -->
    <transition name="fade">
      <div
        v-if="isExpanded"
        class="mt-2 bg-white/5 dark:bg-black/5 backdrop-blur-sm border border-white/10 dark:border-black/10 rounded p-2 text-[10px] font-mono min-w-[180px] shadow-xl"
      >
        <!-- Header -->
        <div class="flex justify-between items-center mb-1 px-2 py-0.5 text-[8px] uppercase tracking-widest border-b border-white/10 dark:border-black/10">
          <span class="text-primary/70">// {{ title }}</span>
          <button
            @click.stop="isExpanded = false"
            class="text-gray-500 hover:text-primary p-1 rounded hover:bg-white/10 dark:hover:bg-black/10"
          >
            <UIcon name="i-lucide-chevron-right" class="w-3 h-3" />
          </button>
        </div>

        <!-- Sections -->
        <div v-if="!sections.length" class="px-2 py-1 text-gray-500 text-[8px]">
          No sections available
        </div>

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
              <span
                class="w-1 h-1 rounded-full"
                :class="activeSection === section.id ? 'bg-primary' : 'bg-gray-400'"
              ></span>
              {{ section.label }}
            </span>
          </a>
        </template>

        <!-- Footer -->
        <div class="mt-1 pt-1 border-t border-white/10 dark:border-black/10 flex justify-between items-center">
          <button
            @click="scrollTop"
            class="text-[8px] text-gray-500 hover:text-primary inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 dark:hover:bg-black/5"
          >
            <UIcon name="i-lucide-arrow-up" class="w-3 h-3" /> TOP
          </button>

          <span class="text-[8px] text-gray-500">
            {{ displayIndex }}/{{ sections.length }}
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from "vue";
import { useRoute } from "vue-router";

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
  {
    sections: () => [],
    title: "PAGE",
    offset: 100,
  }
);

const emit = defineEmits<{
  (e: "update:active", id: string): void;
}>();

const container = ref<HTMLElement | null>(null);
const isExpanded = ref(false);
const activeSection = ref<string>("");

// Toggle button
const toggle = () => {
  isExpanded.value = !isExpanded.value;
};

// Scroll to a section
const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.offsetTop - props.offset, behavior: "smooth" });
  activeSection.value = id;
  isExpanded.value = false;
  emit("update:active", id);
};

// Scroll to top
const scrollTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  activeSection.value = "";
  isExpanded.value = false;
  emit("update:active", "");
};

// Compute current active section based on scroll
const handleScroll = () => {
  const scrollPos = window.scrollY + props.offset;
  let current = "";
  for (let i = props.sections.length - 1; i >= 0; i--) {
    const s = props.sections[i];
    const el = document.getElementById(s.id);
    if (el && scrollPos >= el.offsetTop) {
      current = s.id;
      break;
    }
  }
  if (!current && window.scrollY < 100) current = "";
  if (current !== activeSection.value) {
    activeSection.value = current;
    emit("update:active", current);
  }
};

// Throttle scroll for performance
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

// Click outside to collapse
const handleClickOutside = (e: MouseEvent) => {
  if (!container.value) return;
  if (!container.value.contains(e.target as Node)) {
    isExpanded.value = false;
  }
};

// Computed for UI
const activeLabel = computed(() => {
  return props.sections.find((s) => s.id === activeSection.value)?.label || "";
});

const activeIndex = computed(() => {
  return props.sections.findIndex((s) => s.id === activeSection.value);
});

const displayIndex = computed(() =>
  activeIndex.value === -1 ? 0 : activeIndex.value + 1
);

const progress = computed(() => {
  const idx = activeIndex.value;
  return idx === -1 ? 0 : ((idx + 1) / props.sections.length) * 100;
});

// Lifecycle
onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("mousedown", handleClickOutside);

  nextTick(() => handleScroll());
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("mousedown", handleClickOutside);
});

// Reset on route change
const route = useRoute();
watch(
  () => route.path,
  () => {
    activeSection.value = "";
    isExpanded.value = false;
    nextTick(() => handleScroll());
  }
);
</script>