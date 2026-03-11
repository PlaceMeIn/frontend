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
                :src="img.url"
                :alt="img.title"
                :placeholder="placeholderImg"
                @error="handleImageError"
              />
              <div class="absolute bottom-1 left-4 right-4">
                <h2
                  class="text-white text-base font-semibold line-clamp-2  drop-shadow-md truncate"
                >
                  {{ img.title }}
                </h2>

                <NuxtLink
                  v-if="img?.event_slug || img?.project_slug"
                  :to="'/events/' + (img?.event_slug || img?.project_slug)"
                  class="text-sm text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1 transition-colors"
                  @click.stop
                >
                  View Gallery
                  <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
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
            v-for="item in filteredGallery"
            :key="item.id"
            class="break-inside-avoid group relative"
          >
            <!-- Image Container -->
            <div class="relative overflow-hidden rounded-lg">
              <NuxtImg
                v-if="item.image"
                :src="item.url + '/' + item.image"
                format="webp"
                loading="lazy"
                class="w-full object-cover transition-transform duration-500 cursor-pointer min-h-[50px] bg-muted min-w-[40px]"
                :placeholder="placeholderImg"
                @click="openImageViewer(item)"
                @error="handleImageError"
              />
              <video
                v-else-if="item.video"
                :src="item.url + '/' + item.video"
                controls
                class="w-full rounded-lg"
                :poster="placeholderImg"
                @error="handleVideoError"
              />

              <!-- Gradient Overlay - Always visible on mobile -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
              />

              <!-- Title and Link - Always visible on mobile -->
              <div
                class="absolute bottom-0 left-0 right-0 p-3 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300"
              >
                <h3 class="text-white text-sm font-semibold line-clamp-1 mb-1">
                  {{ item.title }}
                </h3>
                <p
                  v-if="item.description"
                  class="text-gray-200 text-xs line-clamp-2"
                >
                  {{ item.description }}
                </p>

                <!-- Small link to gallery -->
                <NuxtLink
                  v-if="item.event_slug || item.project_slug"
                  :to="`/gallery/${item.event_slug}`"
                  class="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:text-primary/80 transition-colors"
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

              <!-- Uploader Info -->
              <div
                class="absolute top-2 left-2 flex items-center gap-1 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg"
              >
                <UIcon name="i-lucide-clock" class="w-3 h-3 text-primary" />
                <span class="text-[10px] text-white truncate max-w-[80px]">{{
                  formatDate(item.created_at)
                }}</span>
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
    <LazyImageCard
      v-model="showImageViewer"
      :images="galleryImages"
      :initial-index="currentImageIndex"
      :title="currentImageTitle"
      @close="showImageViewer = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { format, parseISO } from "date-fns";
import placeholderImg from "/placeholder.jpg";

const endpoints = useEndpoints();
const { get } = useApi();

const limit = 10;
const offset = ref(0);
const totalCount = ref(0);
const gallery = ref<any[]>([]);
const loadingMore = ref(false);
const showImageViewer = ref(false);
const currentImageIndex = ref(0);
const currentImageTitle = ref("");
const filterType = ref("all");
const galleryImages = ref<Array<{ url: string; caption?: string }>>([]);

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Images", value: "image" },
  { label: "Videos", value: "video" },
  { label: "Events", value: "event" },
  { label: "Projects", value: "project" },
];

const isFiltersDefault = computed(() => filterType.value === "all");

// Fetch main gallery
const { data, pending, error, refresh } = await useAsyncData(
  "gallery",
  () => get(endpoints.gallery.list, { limit, offset: offset.value }),
  {
    default: () => ({ results: [], count: 0, has_more: false, next_offset: 0 }),
  },
);

// Fetch featured images
const { data: featuredData } = await useAsyncData(
  "featured-gallery",
  () => get(endpoints.gallery.featured, { limit: 10 }),
  { default: () => ({ results: [] }) },
);

// Process featured images
const featuredImgs = computed(() => {
  if (!featuredData.value?.results) return [];
  return featuredData.value.results.map((item: any) => ({
    ...item,
    url: item.url + "/" + item.image,
    caption: item.description || item.title,
  }));
});

watch(
  data,
  (val) => {
    if (val?.results) {
      totalCount.value = val.count || 0;
      gallery.value = [...gallery.value, ...val.results];
    }
  },
  { immediate: true },
);

// Filtered gallery
const filteredGallery = computed(() => {
  if (!gallery.value.length) return [];

  if (filterType.value === "all") return gallery.value;
  if (filterType.value === "event")
    return gallery.value.filter((i: any) => i.event_slug);
  if (filterType.value === "project")
    return gallery.value.filter((i: any) => i.project_slug);
  return gallery.value.filter((i: any) => i.gallery_type === filterType.value);
});

const hasMore = computed(() => data.value?.has_more || false);

async function loadMore() {
  if (!hasMore.value || loadingMore.value) return;
  loadingMore.value = true;
  offset.value = data.value?.next_offset || offset.value;
  await refresh();
  loadingMore.value = false;
}

function openImageViewer(item: any) {
  // Build array of all images for viewer
  const allImages = gallery.value
    .filter((i: any) => i.image)
    .map((i: any) => ({
      url: i.url + "/" + i.image,
      caption: i.title || i.description,
    }));

  galleryImages.value = allImages;
  currentImageIndex.value = allImages.findIndex((img) => img.url === item.url);
  currentImageTitle.value = item.title || "Gallery image";
  showImageViewer.value = true;
}

function resetFilters() {
  filterType.value = "all";
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  try {
    return format(parseISO(dateStr), "MMM d, yyyy");
  } catch {
    return "";
  }
}

function handleImageError(e: Event) {
  const img = e.target as HTMLImageElement;
  img.src = placeholderImg;
}

function handleVideoError(e: Event) {
  const video = e.target as HTMLVideoElement;
  video.poster = placeholderImg;
}
</script>
