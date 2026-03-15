<template>
  <UPageCard title="Takeaways" description="" spotlight class="relative h-full">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-8">
      <LoaderSpinnner />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8 text-danger">
      <UIcon name="i-lucide-alert-circle" class="text-3xl mb-2" />
      <p>Failed to load takeaways: {{ error.message }}</p>
      <UButton
        size="sm"
        color="primary"
        variant="soft"
        class="mt-3"
        @click="fetchTakeaways(true)"
      >
        Try Again
      </UButton>
    </div>

    <!-- Takeaways Feed -->
    <div v-else class="relative h-full overflow-hidden">
      <div v-if="takeaways.length === 0" class="text-center py-12 text-muted">
        <UIcon
          name="i-lucide-message-square"
          class="text-4xl mb-2 opacity-50"
        />
        <p>No takeaways yet. Be the first to share!</p>
      </div>

      <!-- Scrolling Container -->
      <div
        v-else
        ref="scroll_container"
        class="takeaways-container relative h-full overflow-hidden"
        @mouseenter="pause_scroll"
        @mouseleave="resume_scroll"
        @touchstart="pause_scroll"
        @touchend="resume_scroll"
      >
        <!-- Animated content wrapper -->
        <div class="scrolling-wrapper" :style="wrapper_style">
          <!-- First copy -->
          <div class="flex flex-col gap-3 py-4 px-2">
            <div
              v-for="(item, index) in takeaways"
              :key="`first-${item.id}`"
              class="takeaway-item"
              :class="[
                index % 2 === 0 ? 'ml-auto' : 'mr-auto',
                item.is_new && animate ? 'takeaway-new' : '',
              ]"
            >
              <UCard
                class="max-w-md shadow-lg hover:shadow-xl transition-shadow"
              >
                <div class="flex items-start gap-3">
                  <UAvatar
                    :src="item?.profile_picture"
                    :alt="item?.user_name"
                    size="md"
                    :icon="!item?.profile_picture ? 'i-lucide-user' : undefined"
                    loading="lazy"
                  />

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <span class="font-semibold text-sm text-muted">{{
                          item?.user_name
                        }}</span>
                        <UBadge
                          v-if="item?.userprogramme"
                          size="xs"
                          color="primary"
                          variant="soft"
                        >
                          {{ item.userprogramme }}
                        </UBadge>
                      </div>
                      <span class="text-xs text-muted shrink-0">
                        {{ formatTimeAgo(item.created_at) }}
                      </span>
                    </div>

                    <p class="mt-2 text-sm break-words">
                      {{ item.content }}
                    </p>

                    <div
                      v-if="item.is_new && animate"
                      class="absolute -top-1 -right-1"
                    >
                      <span class="relative flex h-3 w-3">
                        <span
                          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"
                        ></span>
                        <span
                          class="relative inline-flex rounded-full h-3 w-3 bg-primary-500"
                        ></span>
                      </span>
                    </div>
                  </div>
                </div>
              </UCard>
            </div>
          </div>

          <!-- Second copy for seamless loop -->
          <div class="flex flex-col gap-3 py-4 px-2">
            <div
              v-for="(item, index) in takeaways"
              :key="`second-${item.id}`"
              class="takeaway-item"
              :class="[
                index % 2 === 0 ? 'ml-auto' : 'mr-auto',
                item.is_new && animate ? 'takeaway-new' : '',
              ]"
            >
              <UCard
                class="max-w-md shadow-lg hover:shadow-xl transition-shadow"
              >
                <div class="flex items-start gap-3">
                  <UAvatar
                    :src="item?.profile_picture"
                    :alt="item?.username"
                    size="md"
                    :icon="!item?.profile_picture ? 'i-lucide-user' : undefined"
                    loading="lazy"
                  />

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <span class="font-semibold text-sm">{{
                          item?.username
                        }}</span>
                        <UBadge
                          v-if="item?.userprogramme"
                          size="xs"
                          color="primary"
                          variant="soft"
                        >
                          {{ item.userprogramme }}
                        </UBadge>
                      </div>
                      <span class="text-xs text-muted shrink-0">
                        {{ formatTimeAgo(item.created_at) }}
                      </span>
                    </div>

                    <p class="mt-2 text-sm break-words">
                      {{ item.content }}
                    </p>
                  </div>
                </div>
              </UCard>
            </div>
          </div>
        </div>

        <!-- Loading more indicator -->
        <div
          v-if="loading_more"
          class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg"
        >
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-loader-circle"
              class="animate-spin text-primary"
            />
            <span class="text-sm">Loading more...</span>
          </div>
        </div>
      </div>

      <!-- Scroll controls -->
      <div class="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
        <button
          v-if="!is_scrolling"
          class="bg-primary text-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
          @click="start_scroll"
          title="Start scrolling"
        >
          <UIcon name="i-lucide-play" class="text-xl" />
        </button>
        <button
          v-if="is_scrolling"
          class="bg-warning text-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
          @click="pause_scroll"
          title="Pause scrolling"
        >
          <UIcon name="i-lucide-pause" class="text-xl" />
        </button>
        <button
          class="bg-neutral-800 text-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
          @click="scroll_to_top"
          title="Reset to top"
        >
          <UIcon name="i-lucide-arrow-up" class="text-xl" />
        </button>
      </div>
    </div>
  </UPageCard>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, computed } from "vue";

interface Props {
  id: string;
  type: "event" | "project";
  search?: string;
  reset?: boolean;
  animate?: boolean;
  scroll_speed?: number; // Higher = faster
}

const props = withDefaults(defineProps<Props>(), {
  search: "",
  reset: false,
  animate: true,
  scroll_speed: 30, // pixels per second
});

const { get } = useApi();
const endpoints = useEndpoints();

const takeaways = ref<any[]>([]);
const loading = ref(false);
const loading_more = ref(false);
const error = ref<Error | null>(null);
const has_more = ref(true);

const offset = ref(0);
const limit = ref(20);
const scroll_container = ref<HTMLElement | null>(null);
const is_scrolling = ref(true);
const scroll_position = ref(0);
const animation_frame = ref<number | null>(null);
const last_timestamp = ref<number | null>(null);
const content_height = ref(0);

// Calculate animation speed based on content height
const scroll_duration = computed(() => {
  if (content_height.value === 0) return 30;
  // Duration = height / speed (in seconds)
  return content_height.value / props.scroll_speed;
});

const wrapper_style = computed(() => {
  if (!is_scrolling.value) {
    return {
      transform: `translateY(-${scroll_position.value}px)`,
    };
  }

  return {
    animation: `scroll-loop ${scroll_duration.value}s linear infinite`,
    transform: `translateY(-${scroll_position.value}px)`,
  };
});

async function fetchTakeaways(reset = false) {
  if (reset) {
    offset.value = 0;
    takeaways.value = [];
    has_more.value = true;
    scroll_position.value = 0;
  }

  if (!has_more.value && !reset) return;

  const loading_ref = reset ? loading : loading_more;
  loading_ref.value = true;
  error.value = null;

  try {
    const params: Record<string, any> = {
      limit: limit.value,
      offset: offset.value,
      ordering: "-created_at",
    };

    if (props.search) {
      params.search = props.search;
    }

    if (!props.id || !props.type) return;

    params[props.type] = props.id;

    const res = await get(endpoints.takeaways.list, params);
    const results = res?.results ?? [];

    if (results.length < limit.value) {
      has_more.value = false;
    }

    const new_takeaways = results.map((item: any) => ({
      ...item,
      is_new: true,
    }));

    if (reset) {
      takeaways.value = new_takeaways;
    } else {
      takeaways.value.push(...new_takeaways);
    }

    offset.value += limit.value;

    // Calculate content height after render
    await nextTick();
    calculate_content_height();
  } catch (err) {
    error.value = err as Error;
  } finally {
    loading_ref.value = false;
  }
}

function calculate_content_height() {
  const first_copy = document.querySelector(
    ".scrolling-wrapper > div:first-child",
  );
  if (first_copy) {
    content_height.value = first_copy.clientHeight;
  }
}

function start_scroll() {
  if (is_scrolling.value) return;
  is_scrolling.value = true;
  last_timestamp.value = null;
}

function pause_scroll() {
  is_scrolling.value = false;

  // Get current scroll position from animation
  if (scroll_container.value) {
    const wrapper = scroll_container.value.querySelector(
      ".scrolling-wrapper",
    ) as HTMLElement;
    if (wrapper) {
      const transform = wrapper.style.transform;
      const match = transform.match(/translateY\(-(\d+)px\)/);
      if (match) {
        scroll_position.value = parseInt(match[1]) % content_height.value;
      }
    }
  }
}

function resume_scroll() {
  if (!is_scrolling.value) {
    setTimeout(() => {
      if (!scroll_container.value?.matches(":hover")) {
        start_scroll();
      }
    }, 500);
  }
}

function scroll_to_top() {
  pause_scroll();
  scroll_position.value = 0;
  start_scroll();
}

// Manual scroll animation as fallback for browsers with poor CSS animation support
function manual_animate(timestamp: number) {
  if (!is_scrolling.value || !scroll_container.value) {
    animation_frame.value = requestAnimationFrame(manual_animate);
    return;
  }

  if (!last_timestamp.value) {
    last_timestamp.value = timestamp;
    animation_frame.value = requestAnimationFrame(manual_animate);
    return;
  }

  const delta = timestamp - last_timestamp.value;
  last_timestamp.value = timestamp;

  // Move by (speed * delta) / 1000 pixels per second
  const move_by = (props.scroll_speed * delta) / 1000;
  scroll_position.value =
    (scroll_position.value + move_by) % content_height.value;

  // Update transform
  const wrapper = scroll_container.value.querySelector(
    ".scrolling-wrapper",
  ) as HTMLElement;
  if (wrapper) {
    wrapper.style.transform = `translateY(-${scroll_position.value}px)`;
  }

  animation_frame.value = requestAnimationFrame(manual_animate);
}

// Mark new items as not new after animation
watch(
  () => takeaways.value,
  (new_takeaways) => {
    setTimeout(() => {
      new_takeaways.forEach((item: any) => {
        item.is_new = false;
      });
    }, 3000);
  },
  { deep: true },
);

// Recalculate height when takeaways change
watch(
  () => takeaways.value.length,
  async () => {
    await nextTick();
    calculate_content_height();
    scroll_position.value = 0;
  },
);

onMounted(async () => {
  await fetchTakeaways(true);

  // Start manual animation (more reliable than CSS animation)
  animation_frame.value = requestAnimationFrame(manual_animate);

  await nextTick();
  calculate_content_height();
});

onUnmounted(() => {
  if (animation_frame.value) {
    cancelAnimationFrame(animation_frame.value);
  }
});

// Watch for prop changes
watch(
  () => [props.id, props.type, props.search, props.reset],
  () => fetchTakeaways(true),
);
</script>

<style scoped>
.takeaways-container {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.scrolling-wrapper {
  display: flex;
  flex-direction: column;
  will-change: transform;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
}

.takeaway-item {
  width: fit-content;
  max-width: 80%;
  transition: all 0.3s ease;
  margin-bottom: 0.75rem; /* gap-3 equivalent */
}

.takeaway-new {
  animation:
    slide-in 0.5s ease-out,
    pulse-glow 2s ease-in-out;
}

/* CSS-based continuous scrolling animation */
@keyframes scroll-loop {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}

/* Hover pause - works with CSS animation */
/* .scrolling-wrapper: hover {
  animation-play-state: paused;
} */

@keyframes slide-in {
  0% {
    opacity: 0;
    transform: translateX(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.2);
  }
  50% {
    box-shadow: 0 0 15px 0 rgba(var(--primary-rgb), 0.4);
  }
}

/* Hide scrollbar but keep functionality */
.takeaways-container::-webkit-scrollbar {
  display: none;
}

.takeaways-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
