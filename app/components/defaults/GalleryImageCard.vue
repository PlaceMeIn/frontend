<template>
  <UModal
    :fullscreen="fullscreen"
    :open="modelValue"
    @update:open="handleModalClose"
    :ui="modalUi"
  >
    <template #content>
      <div class="relative overflow-hidden bg-black w-full max-w-7xl max-h-full m-auto">
        <!-- Main Media Container -->
        <div class="relative flex items-center justify-center min-h-[80vh]">
          
          <!-- Previous Button -->
          <button
            v-if="canGoPrevious"
            @click="previousImage"
            class="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all duration-200 hover:scale-110"
          >
            <UIcon name="i-lucide-chevron-left" class="w-6 h-6 text-white" />
          </button>
          
          <!-- Next Button -->
          <button
            v-if="canGoNext"
            @click="nextImage"
            class="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all duration-200 hover:scale-110"
          >
            <UIcon name="i-lucide-chevron-right" class="w-6 h-6 text-white" />
          </button>

          <!-- Image -->
          <NuxtImg
            v-if="currentItem?.image"
            :src="currentItem.image"
            :alt="currentItem.title || 'Gallery image'"
            format="webp"
            loading="lazy"
            :placeholder="placeholderImg"
            class="max-w-full max-h-[85vh] object-contain transition-all duration-300"
            @error="handleMediaError"
          />

          <!-- Video -->
          <video
            v-else-if="currentItem?.video"
            :src="currentItem.video"
            controls
            autoplay
            :poster="currentItem.image || placeholderImg"
            class="max-w-full max-h-[85vh] rounded-lg"
            @error="handleMediaError"
          />

          <!-- Loading State -->
          <div v-else class="flex items-center justify-center min-h-[60vh]">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
          </div>
        </div>

        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 pointer-events-none" />

        <!-- Content Section -->
        <div class="absolute inset-x-0 bottom-0 flex flex-col justify-end p-4 md:p-6 pointer-events-none">
          <div class="flex flex-col gap-2">
            <!-- Title -->
            <h3 class="text-white text-lg md:text-xl font-semibold line-clamp-2 drop-shadow-lg">
              {{ currentItem?.title || 'Untitled' }}
            </h3>

            <!-- Description -->
            <p v-if="currentItem?.description" class="text-gray-200 text-sm md:text-base line-clamp-3">
              {{ currentItem.description }}
            </p>

            <!-- Gallery Link -->
            <NuxtLink
              v-if="create_gallery_slug_link(currentItem)"
              :to="create_gallery_slug_link(currentItem)"
              class="inline-flex items-center gap-2 mt-2 text-primary-300 hover:text-primary-200 transition-colors w-fit pointer-events-auto text-sm md:text-base"
              @click.stop="closeModal"
            >
              <UIcon :name="galleryIcon" class="w-4 h-4" />
              {{ galleryLinkText }}
              <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>

        <!-- Top Left Info -->
        <div class="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full pointer-events-none">
          <UIcon name="i-lucide-clock" class="w-3.5 h-3.5 text-primary-300" />
          <span class="text-xs text-white">{{ formattedDate }}</span>
        </div>

        <!-- Image Counter -->
        <div v-if="galleryImages.length > 1" class="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full pointer-events-none">
          <span class="text-xs text-white">
            {{ currentIndex + 1 }} / {{ galleryImages.length }}
          </span>
        </div>

        <!-- Close Button -->
        <UButton
          class="absolute top-4 right-4 text-white z-50"
          @click="closeModal"
          variant="ghost"
          color="neutral"
          icon="i-lucide-x"
          size="lg"
        />

        <!-- Fullscreen Toggle Button -->
        <UButton
          class="absolute top-4 right-16 text-white z-50"
          variant="ghost"
          color="neutral"
          :icon="fullscreenIcon"
          @click="toggleFullscreen"
          size="lg"
        />

        <!-- Download Button -->
        <UButton
          v-if="currentItem?.image || currentItem?.video"
          class="absolute bottom-4 right-4 text-white z-50"
          variant="ghost"
          color="neutral"
          icon="i-lucide-download"
          size="lg"
          @click="downloadMedia"
        />
      </div>

      <!-- Thumbnail Navigation -->
      <div v-if="galleryImages.length > 1 && !fullscreen" class="absolute bottom-20 left-0 right-0 flex justify-center px-4 pointer-events-none">
        <div class="flex gap-2 overflow-x-auto max-w-full px-4 py-2 pointer-events-auto">
          <button
            v-for="(img, idx) in galleryImages"
            :key="img.id || idx"
            @click="goToImage(idx)"
            class="relative flex-shrink-0 transition-all duration-200 hover:scale-105 focus:outline-none"
            :class="[
              currentIndex === idx 
                ? 'ring-2 ring-primary-500 scale-105' 
                : 'ring-1 ring-white/30 hover:ring-white/60',
              'rounded-lg overflow-hidden'
            ]"
          >
            <img
              :src="img.image || img.video || placeholderImg"
              :alt="`Thumbnail ${idx + 1}`"
              class="w-16 h-16 object-cover"
              loading="lazy"
            />
            <div v-if="img.video" class="absolute inset-0 flex items-center justify-center bg-black/40">
              <UIcon name="i-lucide-play" class="w-4 h-4 text-white" />
            </div>
          </button>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { format, parseISO } from "date-fns";
import placeholderImg from "/placeholder.jpg";

// Types
interface GalleryItem {
  id?: string
  image?: string
  video?: string
  title?: string
  description?: string
  event_slug?: string
  project_slug?: string
  created_at?: string
  url?: string
}

interface Props {
  items: GalleryItem[]  // Array of gallery items
  currentItemId?: string  // ID of the current item to display
  modelValue: boolean  // Modal open state
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
  (e: "change", item: GalleryItem, index: number): void
}>()

// State
const fullscreen = ref(true)
const currentIndex = ref(0)

// UI Configuration
const modalUi = {
  overlay: "bg-black/90 backdrop-blur-sm",
  container: "flex items-center justify-center w-full h-full",
  base: "bg-transparent shadow-none w-full h-full max-w-none rounded-none",
}

// Computed - Get filtered images (only items with image or video)
const galleryImages = computed(() => {
  return props.items.filter(item => item.image || item.video)
})

// Current item based on index
const currentItem = computed(() => {
  return galleryImages.value[currentIndex.value] || null
})

// Navigation controls
const canGoPrevious = computed(() => currentIndex.value > 0)
const canGoNext = computed(() => currentIndex.value < galleryImages.value.length - 1)

// Formatted date
const formattedDate = computed(() => {
  if (!currentItem.value?.created_at) return ""
  try {
    return format(parseISO(currentItem.value.created_at), "MMM d, yyyy")
  } catch {
    return ""
  }
})


const galleryLinkText = computed(() => {
  if (!currentItem.value) return ""
  const type = currentItem.value.event_slug ? "event" : "project"
  return `View ${type} gallery`
})

const galleryIcon = computed(() => {
  return currentItem.value?.event_slug ? "i-lucide-calendar" : "i-lucide-folder"
})

const fullscreenIcon = computed(() => {
  return fullscreen.value ? "i-lucide-minimize" : "i-lucide-maximize"
})

// Methods - Navigation
const goToImage = (index: number) => {
  if (index >= 0 && index < galleryImages.value.length) {
    currentIndex.value = index
    emit("change", galleryImages.value[index], index)
  }
}

const nextImage = () => {
  if (canGoNext.value) {
    goToImage(currentIndex.value + 1)
  }
}

const previousImage = () => {
  if (canGoPrevious.value) {
    goToImage(currentIndex.value - 1)
  }
}

// Methods - Modal
const closeModal = () => {
  emit("update:modelValue", false)
}

const handleModalClose = (value: boolean) => {
  if (!value) closeModal()
}

const toggleFullscreen = () => {
  fullscreen.value = !fullscreen.value
}

// Download media
const downloadMedia = async () => {
  if (!currentItem.value) return
  
  const url = currentItem.value.image || currentItem.value.video
  if (!url) return
  
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const downloadUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = currentItem.value.title || 'gallery-media'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('Download failed:', error)
    // Fallback: open in new tab
    window.open(url, '_blank')
  }
}

// Handle media loading errors
const handleMediaError = (error: Event) => {
  console.error("Media failed to load:", error)
}

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (!props.modelValue) return
  
  switch (e.key) {
    case 'ArrowLeft':
      previousImage()
      break
    case 'ArrowRight':
      nextImage()
      break
    case 'Escape':
      closeModal()
      break
  }
}

// Watch for currentItemId prop changes
watch(() => props.currentItemId, (newId) => {
  if (newId && galleryImages.value.length > 0) {
    const index = galleryImages.value.findIndex(item => item.id === newId)
    if (index !== -1 && index !== currentIndex.value) {
      currentIndex.value = index
    }
  }
}, { immediate: true })

// Watch for modal open to reset index or find by ID
watch(() => props.modelValue, (isOpen) => {
  if (isOpen && props.currentItemId && galleryImages.value.length > 0) {
    const index = galleryImages.value.findIndex(item => item.id === props.currentItemId)
    if (index !== -1) {
      currentIndex.value = index
    }
  }
})

// Lifecycle
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Custom scrollbar for thumbnails */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>