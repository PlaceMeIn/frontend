<template>
  <div class="max-w-6xl mx-auto py-8 px-3">
    <div v-if="pending" class="sticky top-15 z-10 flex justify-center py-1">
      <UProgress color="primary" class="w-full rounded-none" size="sm" />
    </div>

    <div v-if="error" class="flex flex-col items-center gap-4 py-16">
      <UBanner
        color="error"
        icon="i-lucide-cloud-alert"
        title="Unable to load gallery"
        description="Something went wrong while fetching the gallery."
      />
      <UButton
        label="Try Again"
        icon="i-lucide-refresh-cw"
        variant="outline"
        @click="refresh"
      />
    </div>

    <template v-else>
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold mb-2">Gallery</h1>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Moments captured from events, projects, and activities.
        </p>
      </div>

      <!-- Featured Section -->
      <div v-if="featuredImgs.length" class="mb-10">
        <div class="flex items-center gap-2 mb-4">
          <div class="p-1.5 bg-primary/10 rounded-lg">
            <UIcon name="i-lucide-star" class="w-4 h-4 text-primary" />
          </div>
          <h2 class="text-lg font-semibold">Featured Moments</h2>
          <UBadge color="primary" variant="soft" size="sm">{{
            featuredImgs.length
          }}</UBadge>
        </div>

        <UMarquee
          pause-on-hover
          class="py-2 -mx-8 sm:-mx-12 lg:-mx-16 [--duration:40s]"
        >
          <Motion
            v-for="(img, index) in featuredImgs"
            :key="index"
            :initial="{ scale: 1.1, opacity: 0, filter: 'blur(20px)' }"
            :animate="{ scale: 1, opacity: 1, filter: 'blur(0px)' }"
            :transition="{ duration: 0.6, delay: index * 0.1 }"
          >
            <div
              class="relative group cursor-pointer"
              @click="openImageViewer(img)"
            >
              <NuxtImg
                width="234"
                height="234"
                class="rounded-lg aspect-square object-cover min-w-[40px] min-h-[50px] bg-muted"
                :class="index % 2 === 0 ? '-rotate-2' : 'rotate-2'"
                :src="getMediaUrl(img, img.image)"
                :alt="img.title"
                :placeholder="placeholderImg"
                @error="handleImageError"
              />
              <div
                :class="index % 2 === 0 ? '-rotate-2' : 'rotate-2'"
                class="absolute inset-x-0 bottom-0 p-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent"
              >
                <h2
                  class="text-white text-lg font-semibold leading-snug line-clamp-2 tracking-tight drop-shadow"
                >
                  {{ img.title }}
                </h2>

                <NuxtLink
                  v-if="img?.event_slug || img?.project_slug"
                  :to="'/events/' + (img?.event_slug || img?.project_slug)"
                  class="mt-1 text-sm text-primary-300 hover:text-primary-200 font-medium inline-flex items-center gap-1.5 transition-colors"
                  @click.stop
                >
                  View Gallery
                  <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
                </NuxtLink>
              </div>
            </div>
          </Motion>
        </UMarquee>
      </div>

      <!-- Gallery Grid -->
      <div>
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4"
        >
          <div class="flex items-center gap-2">
            <div class="p-1.5 bg-primary/10 rounded-lg">
              <UIcon name="i-lucide-images" class="w-4 h-4 text-primary" />
            </div>
            <h2 class="text-lg font-semibold">All Media</h2>
            <UBadge color="gray" variant="soft" size="sm">{{
              filteredGallery.length
            }}</UBadge>
          </div>

          <div class="flex items-center gap-2">
            <USelectMenu
              v-model="filterType"
              :options="filterOptions"
              value-attribute="value"
              text-attribute="label"
              size="sm"
              class="w-32"
            />
            <UButton
              v-if="!isFiltersDefault"
              icon="i-lucide-x"
              size="xs"
              color="gray"
              variant="soft"
              @click="resetFilters"
            />
          </div>
        </div>

        <!-- Gallery Items -->
        <div
          v-if="gallery.length"
          class="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3"
        >
          <div
            v-for="(item, i) in filteredGallery"
            :key="item.id"
            class="break-inside-avoid group relative"
          >
            <div class="relative overflow-hidden rounded-xl bg-muted">
              <!-- Image -->
              <NuxtImg
                v-if="item.image"
                :src="getMediaUrl(item, item.image)"
                :alt="item.title || 'Gallery image'"
                format="webp"
                loading="lazy"
                :placeholder="placeholderImg"
                class="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 cursor-pointer min-h-[60px]"
                @click="openImageViewer(item)"
              />

              <!-- Video -->
              <video
                v-else-if="item.video"
                :src="getMediaUrl(item, item.video)"
                controls
                :poster="placeholderImg"
                class="w-full rounded-xl"
                @error="handleVideoError"
              />

              <!-- Caption -->
              <div
                class="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-1 transform transition duration-300"
              >
                <h3
                  class="text-white text-sm md:text-base font-semibold tracking-tight line-clamp-1 drop-shadow"
                >
                  {{ item.title }}
                </h3>

                <p
                  v-if="item.description"
                  class="text-gray-200 text-xs line-clamp-2"
                >
                  {{ item.description }}
                </p>

                <NuxtLink
                  v-if="item.event_slug || item.project_slug"
                  :to="`/gallery/${item.event_slug}`"
                  class="inline-flex items-center gap-1 mt-2 text-xs text-primary-300 hover:text-primary-200 transition-colors"
                  @click.stop
                >
                  <UIcon
                    :name="
                      item.event_slug ? 'i-lucide-calendar' : 'i-lucide-folder'
                    "
                    class="w-3 h-3"
                  />
                  View {{ item.event_slug ? "event" : "project" }} gallery
                  <UIcon name="i-lucide-arrow-right" class="w-3 h-3" />
                </NuxtLink>
              </div>

              <!-- Date -->
              <div
                class="absolute top-2 left-2 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md"
              >
                <UIcon name="i-lucide-clock" class="w-3 h-3 text-primary-300" />
                <span class="text-[10px] text-white">
                  {{ formatDate(item.created_at) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading skeleton -->
        <div v-else class="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          <div v-for="n in 8" :key="n" class="break-inside-avoid">
            <div
              class="bg-gray-200 dark:bg-neutral-800 rounded-lg aspect-square animate-pulse"
            />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="gallery.length && filteredGallery.length === 0"
        class="flex flex-col items-center gap-4 py-16"
      >
        <div
          class="w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center"
        >
          <UIcon name="i-lucide-image-off" class="w-10 h-10 text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold">No media found</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Try adjusting your filters
        </p>
        <UButton size="sm" color="primary" @click="resetFilters"
          >Clear filters</UButton
        >
      </div>

      <!-- Load More -->
      <div
        v-if="gallery.length > 0 && filteredGallery.length > 0"
        class="flex flex-col items-center gap-3 mt-10"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Showing {{ gallery.length }} of {{ totalCount }} items
        </p>
        <UButton
          v-if="hasMore"
          label="Load More"
          icon="i-lucide-loader"
          :loading="loadingMore"
          :disabled="loadingMore"
          @click="loadMore"
        />
      </div>
    </template>

    <!-- Image Viewer -->
    <ImageCard v-model="showImageViewer" :item="selectedImg" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { format, parseISO } from "date-fns";
import placeholderImg from "/placeholder.jpg";

const endpoints = useEndpoints();
const { get } = useApi();

const LIMIT = 10;
const MAX_GALLERY_ITEMS = 50;

const offset = ref(0);
const totalCount = ref(0);

const gallery = ref<any[]>([]);
const loadingMore = ref(false);
const selectedImg = ref(null);
const showImageViewer = ref(false);
const currentImageIndex = ref(0);
const currentImageTitle = ref("");
const galleryImages = ref<Array<{ url: string; caption?: string }>>([]);

const filterType = ref("all");

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Images", value: "image" },
  { label: "Videos", value: "video" },
  { label: "Events", value: "event" },
  { label: "Projects", value: "project" },
];

const isFiltersDefault = computed(() => filterType.value === "all");

// MAIN GALLERY FETCH
const { data, pending, error, refresh } = await useAsyncData(
  "gallery",
  () => get(endpoints.gallery.list, { limit: LIMIT, offset: offset.value }),
  {
    default: () => ({
      results: [],
      count: 0,
      has_more: false,
      next_offset: 0,
    }),
  },
);

// FEATURED FETCH
const { data: featuredData } = await useAsyncData(
  "featured-gallery",
  () => get(endpoints.gallery.featured, { limit: 10 }),
  { default: () => ({ results: [] }) },
);

// FEATURED IMAGES
const featuredImgs = computed(() => {
  if (!featuredData.value?.results) return [];

  return featuredData.value.results.map((item: any) => ({
    ...item,
    url: `${item.url}`,
    caption: item.description || item.title,
  }));
});

// PROCESS GALLERY DATA
watch(
  data,
  (val) => {
    if (!val?.results) return;

    totalCount.value = val.count || 0;

    const merged = [...gallery.value, ...val.results];

    // keep only latest 50 items
    if (merged.length > MAX_GALLERY_ITEMS) {
      gallery.value = merged.slice(-MAX_GALLERY_ITEMS);
    } else {
      gallery.value = merged;
    }
  },
  { immediate: true },
);

// FILTERED GALLERY
const filteredGallery = computed(() => {
  const items = gallery.value;

  if (!items.length) return [];

  switch (filterType.value) {
    case "event":
      return items.filter((i: any) => i.event_slug);

    case "project":
      return items.filter((i: any) => i.project_slug);

    case "image":
    case "video":
      return items.filter((i: any) => i.gallery_type === filterType.value);

    default:
      return items;
  }
});

const hasMore = computed(() => data.value?.has_more || false);

// LOAD MORE
async function loadMore() {
  if (!hasMore.value || loadingMore.value) return;

  loadingMore.value = true;

  offset.value = data.value?.next_offset ?? offset.value;

  await refresh();

  loadingMore.value = false;
}

// IMAGE VIEWER
function openImageViewer(item: any) {
  selectedImg.value = item;
  showImageViewer.value = true;
}

// RESET FILTERS
function resetFilters() {
  filterType.value = "all";
}

// FORMAT DATE
function formatDate(dateStr: string) {
  if (!dateStr) return "";

  try {
    return format(parseISO(dateStr), "MMM d, yyyy");
  } catch {
    return "";
  }
}

// IMAGE FALLBACK
function handleImageError(e: Event) {
  const img = e.target as HTMLImageElement;
  img.src = placeholderImg;
}

// VIDEO FALLBACK
function handleVideoError(e: Event) {
  const video = e.target as HTMLVideoElement;
  video.poster = placeholderImg;
}
</script>
