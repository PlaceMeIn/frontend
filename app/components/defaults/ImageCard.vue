<template>
  <UModal
    :fullscreen="fullscreen"
    :open="modelValue"
    @update:open="handleModalClose"
    :ui="modalUi"
  >
    <template #content>
      <div class="relative overflow-hidden rounded-sm bg-muted w-full max-w-7xl max-h-full m-auto">
        <!-- Media -->
        <NuxtImg
          v-if="item.image"
          :src="getMediaUrl(item, item.image)"
          :alt="item.title || 'Gallery image'"
          format="webp"
          loading="lazy"
          :placeholder="placeholderImg"
          class="w-full h-full object-contain"
        />

        <video
          v-else-if="item.video"
          :src="getMediaUrl(item, item.video)"
          controls
          :poster="placeholderImg"
          class="w-full max-h-[80vh] rounded-xl"
          @error="handleMediaError"
        />

        <!-- Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent opacity-90 pointer-events-none" />

        <!-- Content -->
        <div class="absolute inset-x-0 bottom-0 flex flex-col justify-end p-4 pointer-events-none">
          <div class="flex flex-col gap-1">
            <h3 class="text-white text-sm md:text-base font-semibold line-clamp-1 drop-shadow">
              {{ item.title }}
            </h3>

            <p v-if="item.description" class="text-gray-200 text-xs line-clamp-2">
              {{ item.description }}
            </p>

            <NuxtLink
              v-if="item.event_slug || item.project_slug"
              :to="galleryLink"
              class="inline-flex items-center gap-1 mt-2 text-xs text-primary-300 hover:text-primary-200 w-fit pointer-events-auto"
              @click.stop="closeModal"
            >
              <UIcon :name="galleryIcon" class="w-3 h-3" />
              {{ galleryLinkText }}
              <UIcon name="i-lucide-arrow-right" class="w-3 h-3" />
            </NuxtLink>
          </div>
        </div>

        <!-- Date -->
        <div class="absolute top-2 left-2 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md pointer-events-none">
          <UIcon name="i-lucide-clock" class="w-3 h-3 text-primary-300" />
          <span class="text-[10px] text-white">{{ formattedDate }}</span>
        </div>

        <!-- Actions -->
        <UButton
          class="absolute top-2 right-2 text-white z-50"
          @click="closeModal"
          variant="ghost"
          color="neutral"
          icon="i-lucide-x"
          size="lg"
        />

        <UButton
          class="absolute top-2 right-16 text-white z-50"
          variant="ghost"
          color="neutral"
          :icon="fullscreenIcon"
          @click="toggleFullscreen"
          size="lg"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { format, parseISO } from "date-fns";
import placeholderImg from "/placeholder.jpg";

const fullscreen = ref(true);

interface GalleryItem {
  image?: string;
  video?: string;
  title: string;
  description?: string;
  event_slug?: string;
  project_slug?: string;
  created_at: string;
  url?: string;
}

interface Props {
  item: GalleryItem;
  modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

// UI Configuration
const modalUi = {
  overlay: "bg-black/80",
  container: "flex items-center justify-center w-full",
  base: "bg-transparent shadow-none lg:min-w-[500px]",
};

// Computed
const formattedDate = computed(() => {
  if (!props.item?.created_at) return "";
  try {
    return format(parseISO(props.item.created_at), "MMM d, yyyy");
  } catch {
    return "";
  }
});

const galleryLink = computed(() => {
  const slug = props.item.event_slug || props.item.project_slug;
  return `/gallery/${slug}`;
});

const galleryLinkText = computed(() => {
  const type = props.item.event_slug ? "event" : "project";
  return `View ${type} gallery`;
});

const galleryIcon = computed(() => {
  return props.item.event_slug ? "i-lucide-calendar" : "i-lucide-folder";
});

const fullscreenIcon = computed(() => {
  return fullscreen.value ? "i-lucide-minimize" : "i-lucide-expand";
});


const closeModal = () => {
  emit("update:modelValue", false);
};

const handleModalClose = (value: boolean) => {
  if (!value) closeModal();
};

const toggleFullscreen = () => {
  fullscreen.value = !fullscreen.value;
};

const handleMediaError = (error: Event) => {
  console.error("Media failed to load:", error);
};
</script>