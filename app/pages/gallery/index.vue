<template>
  <div class="min-h-screen  text-gray-900 dark:text-white">
    <!-- Top progress bar -->
    <div v-if="pending" class="fixed top-0 inset-x-0 z-50">
      <UProgress color="primary" size="xs" class="rounded-none" />
    </div>

    <!-- Hero Header -->
    <div class="relative overflow-hidden border-b border-gray-200 dark:border-white/5">
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(var(--color-primary-500-rgb),0.15),transparent)]" />
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium tracking-widest uppercase mb-4">
              <span class="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
              Visual Archive
            </div>
            <h1
              class="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 dark:from-white dark:via-white/90 dark:to-white/40 bg-clip-text text-transparent leading-none mb-3">
              Gallery
            </h1>
            <p class="text-gray-600 dark:text-neutral-400 text-base max-w-md leading-relaxed">
              Moments captured from events, projects, and activities — preserved in time.
            </p>
          </div>

          <!-- Stats strip -->
          <div class="flex items-center gap-5 shrink-0">
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{{ totalCount ?? 0 }}</div>
              <div class="text-xs text-gray-500 dark:text-neutral-500 uppercase tracking-wider">Total</div>
            </div>
            <div class="w-px h-10 bg-gray-200 dark:bg-white/10" />
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{{ gallery?.length ?? 0 }}
              </div>
              <div class="text-xs text-gray-500 dark:text-neutral-500 uppercase tracking-wider">Loaded</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">

      <!-- Error State -->
      <div v-if="error" class="flex flex-col items-center gap-5 py-24">
        <div class="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <UIcon name="i-lucide-cloud-alert" class="w-7 h-7 text-red-400" />
        </div>
        <div class="text-center">
          <h3 class="font-semibold text-lg mb-1">Failed to load gallery</h3>
          <p class="text-gray-500 dark:text-neutral-500 text-sm">Something went wrong while fetching media.</p>
        </div>
        <UButton label="Try Again" icon="i-lucide-refresh-cw" variant="outline" color="primary" @click="refresh" />
      </div>

      <template v-else>

        <!-- ── Featured Marquee ── -->
        <section v-if="featuredImgs?.length" class="mb-12 md:mb-14">
          <div class="flex items-center gap-3 mb-4 md:mb-5">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-star" class="w-4 h-4 text-amber-400" />
              <h2
                class="text-xs md:text-sm font-semibold uppercase tracking-widest text-gray-600 dark:text-neutral-300">
                Featured Moments</h2>
            </div>
            <div class="flex-1 h-px bg-gray-200 dark:bg-white/5" />
            <UBadge :label="`${featuredImgs?.length ?? 0}`" color="amber" variant="soft" size="xs" />
          </div>

          <div class="relative -mx-4 sm:-mx-6 lg:-mx-8">
            <!-- fade edges -->
            <div
              class="absolute left-0 top-0 bottom-0 w-16 sm:w-20 bg-gradient-to-r from-gray-50 dark:from-neutral-950 to-transparent z-10 pointer-events-none" />
            <div
              class="absolute right-0 top-0 bottom-0 w-16 sm:w-20 bg-gradient-to-l from-gray-50 dark:from-neutral-950 to-transparent z-10 pointer-events-none" />

            <UMarquee pause-on-hover class="py-2 [--duration:50s]">
              <div v-for="(img, index) in featuredImgs" :key="img?.id ?? index"
                class="relative group cursor-pointer mx-2 shrink-0"
                :class="index % 3 === 0 ? '-rotate-2' : index % 3 === 1 ? 'rotate-1' : 'rotate-2'"
                @click="openImageViewer(img)">
                <div
                  class="relative overflow-hidden rounded-md ring-1 ring-gray-200 dark:ring-white/10 shadow-xl transition-all duration-300 md:group-hover:ring-primary-500/40 md:group-hover:scale-[1.03] md:group-hover:rotate-0">
                  <NuxtImg width="220" height="220"
                    class="w-[180px] sm:w-[200px] md:w-[220px] h-[180px] sm:h-[200px] md:h-[220px] object-cover bg-gray-100 dark:bg-neutral-800"
                    :src="img?.image" :alt="img?.title || 'Featured image'" :placeholder="placeholderImg" loading="lazy"
                    @error="handleImageError" />
                  <!-- Overlay - always visible on mobile, hover on desktop -->
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 opacity-60 md:opacity-0" />
                  <div
                    class="absolute inset-x-0 bottom-0 p-3 translate-y-0 md:translate-y-2 opacity-100 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300">
                    <p class="text-white text-xs font-semibold line-clamp-1">{{ img?.title || 'Untitled' }}</p>
                    <NuxtLink v-if="createGallerySlugLink(img)" :to="createGallerySlugLink(img)"
                      class="text-[10px] text-primary-300 hover:text-primary-200 inline-flex items-center gap-1 mt-0.5"
                      @click.stop>
                      View Gallery
                      <UIcon name="i-lucide-arrow-right" class="w-3 h-3" />
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </UMarquee>
          </div>
        </section>

        <!-- ── Filters Bar ── -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-layout-grid" class="w-4 h-4 text-gray-500 dark:text-neutral-400" />
            <h2 class="text-xs md:text-sm font-semibold uppercase tracking-widest text-gray-600 dark:text-neutral-300">
              All Media</h2>
            <UBadge :label="`${filteredGallery?.length ?? 0}`" color="neutral" variant="soft" size="xs" />
          </div>

          <div class="flex items-center gap-2">
            <!-- Filter pills -->
            <div
              class="flex items-center gap-1.5 bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-white/8 rounded-xl p-1">
              <UButton v-for="opt in filterOptions" size="sm" variant="soft" :key="opt.value"
                class="px-2 md:px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap"
                :class="filterType === opt.value
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5'"
                @click="filterType = opt.value">
                {{ opt.label }}
              </UButton>
            </div>

            <!-- Layout toggle -->
            <div
              class="flex items-center gap-1 bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-white/8 rounded-xl p-1">
              <UButton size="sm" variant="ghost" color="gray" :class="[
                ' rounded-lg transition-all',
                layout === 'masonry'
                  ? 'bg-white dark:bg-white/10 text-primary-600 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-neutral-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5'
              ]" @click="layout = 'masonry'">
                <UIcon name="i-lucide-layout-list" class="w-4 h-4" />
              </UButton>
              <UButton size="sm" variant="ghost" color="gray" :class="[
                'rounded-lg transition-all',
                layout === 'grid'
                  ? 'bg-white dark:bg-white/10 text-primary-600 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-neutral-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5'
              ]" @click="layout = 'grid'">
                <UIcon name="i-lucide-grid-2x2" class="w-4 h-4" />
              </UButton>
            </div>
          </div>
        </div>

        <!-- ── Gallery Grid ── -->
        <div v-if="gallery?.length" :class="layout === 'masonry'
          ? 'columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 space-y-3'
          : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'">
          <div v-for="item in filteredGallery" :key="item?.id"
            class="break-inside-avoid group relative rounded-md overflow-hidden bg-gray-100 dark:bg-neutral-900 ring-1 ring-gray-200 dark:ring-white/5 transition-all duration-300 hover:ring-primary-400 dark:hover:ring-white/15 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/50">
            <!-- Image -->
            <div v-if="item?.image" class="relative cursor-pointer" @click="openImageViewer(item)">
              <NuxtImg :src="item.image" :alt="item?.title || 'Gallery image'" format="webp" loading="lazy"
                :placeholder="placeholderImg"
                class="w-full object-cover transition-transform duration-500 ease-out md:group-hover:scale-105 min-h-[80px]"
                @error="handleImageError" />

              <!-- Overlay - always visible on mobile -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 opacity-70 md:opacity-0" />

              <!-- Info overlay -->
              <div
                class="absolute inset-x-0 bottom-0 p-3 translate-y-0 md:translate-y-1 opacity-100 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300">
                <h3 class="text-white text-xs font-semibold line-clamp-1 mb-0.5">{{ item?.title || 'Untitled' }}</h3>
                <p v-if="item?.description" class="text-gray-300 text-[10px] line-clamp-2 mb-1.5">{{ item.description }}
                </p>
                <NuxtLink v-if="createGallerySlugLink(item)" :to="createGallerySlugLink(item)"
                  class="inline-flex items-center gap-1 text-[10px] text-primary-300 hover:text-primary-200 transition-colors"
                  @click.stop>
                  <UIcon :name="item?.event_slug ? 'i-lucide-calendar' : 'i-lucide-folder'" class="w-2.5 h-2.5" />
                  View {{ item?.event_slug ? 'event' : 'project' }}
                  <UIcon name="i-lucide-arrow-right" class="w-2.5 h-2.5" />
                </NuxtLink>
              </div>

              <!-- Date badge -->
              <div
                class="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md opacity-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                <span class="text-[9px] text-gray-300 tabular-nums">{{ formatDate(item?.created_at) }}</span>
              </div>

              <!-- Type badge -->
              <div class="absolute top-2 left-2">
                <div v-if="item?.event_slug"
                  class="w-5 h-5 rounded-md bg-primary-500/80 backdrop-blur-sm flex items-center justify-center">
                  <UIcon name="i-lucide-calendar" class="w-3 h-3 text-white" />
                </div>
                <div v-else-if="item?.project_slug"
                  class="w-5 h-5 rounded-md bg-emerald-500/80 backdrop-blur-sm flex items-center justify-center">
                  <UIcon name="i-lucide-folder" class="w-3 h-3 text-white" />
                </div>
              </div>
            </div>

            <!-- Video -->
            <video v-else-if="item?.video" :src="item.video" controls :poster="placeholderImg" class="w-full rounded-md"
              @error="handleVideoError" />
          </div>
        </div>

        <!-- Loading skeleton -->
        <div v-else :class="layout === 'masonry'
          ? 'columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 space-y-3'
          : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'">
          <div v-for="n in 10" :key="n" class="break-inside-avoid">
            <div class="bg-gray-200 dark:bg-neutral-800/60 rounded-md animate-pulse"
              :style="{ aspectRatio: n % 3 === 0 ? '1' : n % 2 === 0 ? '3/4' : '4/5' }" />
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="gallery?.length && filteredGallery?.length === 0" class="flex flex-col items-center gap-4 py-24">
          <div
            class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-white/5 flex items-center justify-center">
            <UIcon name="i-lucide-image-off" class="w-7 h-7 text-gray-500 dark:text-neutral-500" />
          </div>
          <div class="text-center">
            <h3 class="font-semibold mb-1">No media found</h3>
            <p class="text-sm text-gray-500 dark:text-neutral-500">Try a different filter</p>
          </div>
          <UButton size="sm" color="primary" variant="outline" label="Clear filters" @click="resetFilters" />
        </div>

        <!-- ── Pagination Footer ── -->
        <div v-if="gallery?.length && filteredGallery?.length" class="mt-12 flex flex-col items-center gap-4">
          <!-- Progress bar -->
          <div class="w-full max-w-xs">
            <div class="flex justify-between text-xs text-gray-500 dark:text-neutral-500 mb-1.5">
              <span>{{ gallery?.length ?? 0 }} loaded</span>
              <span>{{ totalCount ?? 0 }} total</span>
            </div>
            <div class="h-1 bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div class="h-full bg-primary-500 rounded-full transition-all duration-500"
                :style="{ width: `${Math.min(((gallery?.length ?? 0) / (totalCount ?? 1)) * 100, 100)}%` }" />
            </div>
          </div>

          <div class="flex items-center gap-3">
            <!-- Prev page -->
            <UButton v-if="currentPage > 1" icon="i-lucide-arrow-left" label="Previous" variant="outline"
              color="primary" size="sm" @click="goToPrevPage" />

            <!-- Page indicator -->
            <span class="text-xs text-gray-500 dark:text-neutral-500 px-3">Page {{ currentPage }}</span>

            <!-- Load more / next page -->
            <UButton v-if="hasMore" label="Load More" icon="i-lucide-plus" :loading="loadingMore"
              :disabled="loadingMore" color="primary" variant="outline" size="sm" @click="loadMore" />
          </div>
        </div>

      </template>
    </div>

    <!-- ── Image Viewer ── -->
    <GalleryImageCard v-if="showImageViewer" v-model="showImageViewer" :items="imageViewerItems"
      :current-item-id="selectedImg?.id" @change="onSlideChange" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { format, parseISO } from "date-fns";
import placeholderImg from "/placeholder.jpg";

// ── Router & URL sync ──────────────────────────────────────────────
const route = useRoute();
const router = useRouter();

const LIMIT = 20;
const MAX_GALLERY_ITEMS = 100;

// Derive initial offset from URL query param (?offset=40)
const offset = ref(Number(route.query.offset ?? 0));
const totalCount = ref(0);
const gallery = ref<any[]>([]);
const loadingMore = ref(false);
const selectedImg = ref(null);
const showImageViewer = ref(false);
const filterType = ref((route.query.filter as string) ?? "all");
const layout = ref<"masonry" | "grid">((route.query.layout as "masonry" | "grid") ?? "masonry");

const currentPage = computed(() => Math.floor(offset.value / LIMIT) + 1);

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Images", value: "image" },
  { label: "Videos", value: "video" },
  { label: "Events", value: "event" },
  { label: "Projects", value: "project" },
];

// ── Helper function to create gallery slug link ──
const createGallerySlugLink = (item: any) => {
  if (!item) return null;
  if (item.event_slug) return `/gallery/${item.event_slug}?type=event`;
  if (item.project_slug) return `/gallery/${item.project_slug}?type=project`;
  return null;
};

// ── Sync state → URL ───────────────────────────────────────────────
function syncUrl() {
  const query: Record<string, string> = {};
  if (offset.value > 0) query.offset = String(offset.value);
  if (filterType.value !== "all") query.filter = filterType.value;
  if (layout.value !== "masonry") query.layout = layout.value;

  router.replace({ query });
}

watch([filterType, layout], () => syncUrl());

// ── Endpoints & API ───────────────────────────────────────────────
const endpoints = useEndpoints();
const { get } = useApi();

// MAIN GALLERY FETCH
const { data, pending, error, refresh } = await useAsyncData(
  "gallery",
  () => get(endpoints.gallery.list, { limit: LIMIT, offset: offset.value }),
  {
    default: () => ({ results: [], count: 0, has_more: false, next_offset: 0 }),
  },
);

// FEATURED FETCH
const { data: featuredData } = await useAsyncData(
  "featured-gallery",
  () => get(endpoints.gallery.featured, { limit: 12 }),
  { default: () => ({ results: [] }) },
);

// ── Process gallery data ──────────────────────────────────────────
watch(
  data,
  (val) => {
    if (!val?.results) return;
    totalCount.value = val.count ?? 0;
    const merged = [...gallery.value, ...val.results];
    gallery.value = merged.length > MAX_GALLERY_ITEMS ? merged.slice(-MAX_GALLERY_ITEMS) : merged;
  },
  { immediate: true },
);

// ── Computed ──────────────────────────────────────────────────────
const featuredImgs = computed(() =>
  (featuredData.value?.results ?? []).map((item: any) => ({
    ...item,
    caption: item?.description || item?.title,
  }))
);

const filteredGallery = computed(() => {
  const items = gallery.value ?? [];
  if (!items.length) return [];
  switch (filterType.value) {
    case "event": return items.filter((i) => i?.event_slug);
    case "project": return items.filter((i) => i?.project_slug);
    case "image":
    case "video": return items.filter((i) => i?.gallery_type === filterType.value);
    default: return items;
  }
});

const hasMore = computed(() => data.value?.has_more ?? false);

// Image viewer items - all filtered images plus current selection
const imageViewerItems = computed(() => {
  return filteredGallery.value.filter(item => item?.image || item?.video);
});

// ── Actions ───────────────────────────────────────────────────────
async function loadMore() {
  if (!hasMore.value || loadingMore.value) return;
  loadingMore.value = true;
  offset.value = data.value?.next_offset ?? offset.value + LIMIT;
  syncUrl();
  await refresh();
  loadingMore.value = false;
}

async function goToPrevPage() {
  const prevOffset = Math.max(0, offset.value - LIMIT);
  offset.value = prevOffset;
  gallery.value = [];
  syncUrl();
  await refresh();
}

function openImageViewer(item: any) {
  selectedImg.value = item;
  showImageViewer.value = true;
}

function onSlideChange(item: any, index: number) {
  selectedImg.value = item;
}

function resetFilters() {
  filterType.value = "all";
}

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "";
  try {
    return format(parseISO(dateStr), "MMM d, yyyy");
  } catch {
    return "";
  }
}

function handleImageError(e: Event) {
  const target = e.target as HTMLImageElement;
  if (target) {
    target.src = placeholderImg;
  }
}

function handleVideoError(e: Event) {
  const target = e.target as HTMLVideoElement;
  if (target) {
    target.poster = placeholderImg;
  }
}

// Watch for filter changes to reset viewer
watch(filterType, () => {
  selectedImg.value = null;
});
</script>