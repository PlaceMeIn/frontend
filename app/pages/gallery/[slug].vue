<template>
  <div class="min-h-screen ">
    <NavigationBreadCrumb />

    <!-- Loading State - Client Only to prevent hydration mismatch -->
    <ClientOnly>
      <div v-if="pending" class="flex flex-col items-center justify-center min-h-[60vh]">
        <div class="relative">
          <div class="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading gallery...</div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div class="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
          <UIcon name="i-lucide-alert-circle" class="h-10 w-10 text-red-500" />
        </div>
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Failed to load gallery</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ error }}</p>
        </div>
        <UButton color="primary" variant="soft" icon="i-lucide-refresh-cw" @click="refresh">
          Try Again
        </UButton>
      </div>

      <!-- Gallery Content -->
      <div v-else class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        <!-- Header Section -->
        <div class="mb-8">
          <div class="flex items-center gap-2 mb-3">
            <UBadge :color="galleryTypeColor" variant="soft" size="lg" class="rounded-full">
              <UIcon :name="galleryTypeIcon" class="w-4 h-4 mr-1" />
              {{ galleryTypeLabel }}
            </UBadge>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white capitalize">
            {{ galleryTypeLabel }} Gallery
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            {{ totalCount }} {{ totalCount === 1 ? 'item' : 'items' }} in this gallery
          </p>
        </div>

        <!-- Gallery Type Tabs -->
        <div class="mb-6 flex gap-2 border-b border-gray-200 dark:border-neutral-800 overflow-x-auto">
          <button
            v-for="type in galleryTypes"
            :key="type.value"
            @click="switchGalleryType(type.value)"
            :class="[
              'px-4 py-2 text-sm font-medium transition-all relative whitespace-nowrap',
              gallery_type === type.value
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            <UIcon :name="type.icon" class="w-4 h-4 inline mr-1" />
            {{ type.label }}
          </button>
        </div>

        <!-- Gallery Grid -->
        <div v-if="galleryItems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="item in galleryItems"
            :key="item.id"
            class="group relative overflow-hidden rounded-md bg-white shadow-sm hover:shadow-xl transition-all duration-300 dark:bg-neutral-900"
          >
            <!-- Media Type Badge -->
            <div class="absolute top-3 left-3 z-10">
              <UBadge :color="item.gallery_type === 'video' ? 'red' : 'primary'" variant="solid" size="sm" class="rounded-full">
                <UIcon :name="item.gallery_type === 'video' ? 'i-lucide-video' : 'i-lucide-image'" class="w-3 h-3 mr-1" />
                {{ item.gallery_type }}
              </UBadge>
            </div>

            <!-- Media Content -->
            <div class="relative aspect-video bg-gray-100 dark:bg-neutral-800 cursor-pointer" @click="openLightbox(item.id)">
              <!-- Image -->
              <img
                v-if="item.gallery_type === 'image' || item.gallery_type === 'both'"
                :src="item.image || undefined"
                :alt="item.title || `${galleryTypeLabel} image`"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                @error="handleImageError"
              />
              
              <!-- Video Thumbnail -->
              <div v-else-if="item.gallery_type === 'video'" class="relative w-full h-full">
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.title || `${galleryTypeLabel} video`"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div class="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div class="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                    <UIcon name="i-lucide-play" class="w-6 h-6 text-primary-600 ml-0.5" />
                  </div>
                </div>
              </div>
              
              <!-- Loading Skeleton -->
              <div v-else class="w-full h-full flex items-center justify-center">
                <UIcon name="i-lucide-image" class="w-12 h-12 text-gray-300 dark:text-gray-600" />
              </div>

              <!-- Overlay on Hover -->
              <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <UButton
                  color="white"
                  variant="solid"
                  size="sm"
                  icon="i-lucide-maximize-2"
                  @click.stop="openLightbox(item.id)"
                >
                  View
                </UButton>
              </div>
            </div>

            <!-- Caption -->
            <div class="p-4">
              <h3 v-if="item.title" class="font-medium text-gray-900 dark:text-white mb-1 line-clamp-1">
                {{ item.title }}
              </h3>
              <p v-if="item.description" class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {{ item.description }}
              </p>
              <div class="mt-2 flex items-center justify-between text-xs text-gray-400">
                <span class="flex items-center gap-1">
                  <UIcon name="i-lucide-calendar" class="w-3 h-3" />
                  {{ formatDate(item.created_at) }}
                </span>
                <span v-if="item.uploaded_by_name" class="flex items-center gap-1">
                  <UIcon name="i-lucide-user" class="w-3 h-3" />
                  {{ item.uploaded_by_name }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-20 text-center">
          <div class="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800">
            <UIcon name="i-lucide-image-off" class="h-12 w-12 text-gray-400 dark:text-gray-600" />
          </div>
          <h3 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No gallery items found</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            No {{ galleryTypeLabel }} gallery items are available at the moment.
          </p>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMore && !pending" class="mt-8 text-center">
          <UButton
            @click="loadMore"
            :loading="loadingMore"
            color="neutral"
            variant="outline"
            size="lg"
            icon="i-lucide-chevron-down"
          >
            Load More
          </UButton>
        </div>

        <!-- End of Gallery Message -->
        <div v-if="!hasMore && galleryItems.length > 0 && !pending" class="mt-8 text-center">
          <p class="text-sm text-gray-400">You've reached the end of the gallery ✨</p>
        </div>
      </div>

      <!-- Lightbox Component - Client Only -->
      <GalleryImageCard
        v-if="showLightbox"
        v-model="showLightbox"
        :items="galleryItems"
        :current-item-id="selectedItemId"
        @change="onSlideChange"
      />
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
// SEO Configuration
const route = useRoute()
const router = useRouter()
const { get } = useApi()
const endpoints = useEndpoints()

// Types
interface GalleryItem {
  id: string
  gallery_type: 'image' | 'video' | 'both'
  image: string | null
  video: string | null
  title: string | null
  description: string | null
  created_at: string
  uploaded_by_name?: string
  event_slug?: string
  project_slug?: string
}

enum GalleryType {
  EVENT = 'event',
  PROJECT = 'project',
  SCENE = 'scene'
}

// Constants
const MAX_GALLERY_ITEMS = 100
const LIMIT = 12

// Gallery type configurations
const galleryTypes = [
  { value: GalleryType.EVENT, label: 'Event Gallery', icon: 'i-lucide-calendar' },
  { value: GalleryType.PROJECT, label: 'Project Gallery', icon: 'i-lucide-folder-git-2' },
  { value: GalleryType.SCENE, label: 'Scene Gallery', icon: 'i-lucide-image' }
]

// Get slug from route params
const slug = computed(() => route.params.slug as string)

// Get gallery type from route query or default to event
const gallery_type = ref<GalleryType>(
  (route.query.type as GalleryType) || GalleryType.EVENT
)

// Pagination state
const offset = ref(0)
const totalCount = ref(0)
const galleryItems = ref<GalleryItem[]>([])
const loadingMore = ref(false)

// Lightbox state
const showLightbox = ref(false)
const selectedItemId = ref<string | undefined>(undefined)

// Computed properties
const galleryTypeLabel = computed(() => {
  return galleryTypes.find(t => t.value === gallery_type.value)?.label || 'Gallery'
})

const galleryTypeIcon = computed(() => {
  return galleryTypes.find(t => t.value === gallery_type.value)?.icon || 'i-lucide-image'
})

const galleryTypeColor = computed(() => {
  const colors: Record<GalleryType, string> = {
    [GalleryType.EVENT]: 'primary',
    [GalleryType.PROJECT]: 'info',
    [GalleryType.SCENE]: 'warning'
  }
  return colors[gallery_type.value] || 'neutral'
})

const hasMore = computed(() => {
  return galleryItems.value.length < totalCount.value && galleryItems.value.length < MAX_GALLERY_ITEMS
})

// Build endpoint URL based on gallery type
const getGalleryEndpoint = () => {
  const endpointsMap: Record<GalleryType, string> = {
    [GalleryType.EVENT]: endpoints.gallery.byEvent,
    [GalleryType.PROJECT]: endpoints.gallery.byProject,
    [GalleryType.SCENE]: endpoints.gallery.byScene || endpoints.gallery.byEvent
  }
  return endpointsMap[gallery_type.value] || endpoints.gallery.byEvent
}

// Build query parameters
const getQueryParams = () => {
  const params: Record<string, any> = {
    limit: LIMIT,
    offset: offset.value
  }
  
  // Add appropriate slug parameter based on gallery type
  const slugParams: Record<GalleryType, string> = {
    [GalleryType.EVENT]: 'event_slug',
    [GalleryType.PROJECT]: 'project_slug',
    [GalleryType.SCENE]: 'scene_slug'
  }
  
  const slugParam = slugParams[gallery_type.value]
  if (slugParam) {
    params[slugParam] = slug.value
  }
  
  return params
}

const seoTitle = computed(() => {
  const typeLabel = galleryTypeLabel.value
  const itemName = slug.value.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  return `${typeLabel} Gallery - ${itemName} | MUT Tech Club`
})

const seoDescription = computed(() => {
  const typeLabel = galleryTypeLabel.value.toLowerCase()
  const total = totalCount.value
  return `Explore ${total} ${typeLabel} gallery items from MUT Tech Club. View photos, videos, and memories from our ${typeLabel.toLowerCase()} activities and events.`
})



useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: () => seoTitle.value,
  twitterDescription: () => seoDescription.value
})

definePageMeta({ 
  layout: 'default'
})

// Main gallery fetch - Using lazy to prevent blocking
const { data, pending, error, refresh } = await useLazyAsyncData(
  `gallery-${slug.value}-${gallery_type.value}`,
  async () => {
    const endpoint = getGalleryEndpoint()
    const params = getQueryParams()
    
    try {
      const response = await get(endpoint, params, false)
      return response
    } catch (err: any) {
      console.error('Gallery fetch error:', err)
      throw err
    }
  },
  {
    watch: [slug, gallery_type],
    default: () => null,
    transform: (response: any) => {
      // Handle different response formats
      let results: GalleryItem[] = []
      let count = 0
      
      if (response?.results) {
        results = response.results
        count = response.count || response.results.length
      } else if (Array.isArray(response)) {
        results = response
        count = response.length
      } else if (response?.data?.results) {
        results = response.data.results
        count = response.data.count
      } else if (response?.data && Array.isArray(response.data)) {
        results = response.data
        count = response.data.length
      }
      
      totalCount.value = count
      
      if (offset.value === 0) {
        galleryItems.value = results
      } else {
        galleryItems.value = [...galleryItems.value, ...results]
      }
      
      return {
        results: galleryItems.value,
        count: totalCount.value,
        has_more: galleryItems.value.length < totalCount.value
      }
    }
  }
)

// Watch for gallery type changes
watch(gallery_type, () => {
  offset.value = 0
  galleryItems.value = []
  refresh()
})

// Watch route query for type changes
watch(() => route.query.type, (newType) => {
  if (newType && Object.values(GalleryType).includes(newType as GalleryType)) {
    gallery_type.value = newType as GalleryType
  }
})

// Load more items
const loadMore = async () => {
  if (!hasMore.value || loadingMore.value) return
  
  loadingMore.value = true
  offset.value += LIMIT
  
  try {
    await refresh()
  } finally {
    loadingMore.value = false
  }
}

// Switch gallery type
const switchGalleryType = (type: GalleryType) => {
  if (type === gallery_type.value) return
  
  // Update URL query param without full page reload
  router.push({
    query: { ...route.query, type }
  })
  
  gallery_type.value = type
  offset.value = 0
  galleryItems.value = []
}

// Lightbox functions
const openLightbox = (itemId: string) => {
  selectedItemId.value = itemId
  showLightbox.value = true
}

const onSlideChange = (item: GalleryItem, index: number) => {
  console.log('Current slide:', { item, index })
}

// Format date
const formatDate = (dateString: string) => {
  if (!dateString) return 'Unknown date'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return 'Invalid date'
  }
}

// Handle image loading errors
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (img && img.src) {
    // Use a data URI or SVG placeholder to avoid external request
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E'
    img.onerror = null
  }
}

// Ensure lightbox is properly destroyed when closed
watch(showLightbox, (newVal) => {
  if (!newVal) {
    selectedItemId.value = undefined
  }
})

// Cleanup on unmount
onUnmounted(() => {
  showLightbox.value = false
  selectedItemId.value = undefined
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Scrollbar styling for tabs */
.overflow-x-auto::-webkit-scrollbar {
  height: 2px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}

/* Prevent hydration mismatch by hiding content during SSR */
[data-ssr] {
  display: none;
}
</style>