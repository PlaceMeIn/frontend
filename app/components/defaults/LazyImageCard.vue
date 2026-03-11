<template>
  <UModal
    v-model="isOpen"
    :ui="{
      wrapper: 'fixed inset-0 z-50',
      container: 'flex min-h-full items-center justify-center text-center',
      base: 'w-full max-w-7xl bg-transparent shadow-none',
      overlay: 'bg-black/90 backdrop-blur-md'
    }"
    @close="close"
  >
    <div class="relative w-full h-full flex items-center justify-center">
      <!-- Close button -->
      <UButton
        color="white"
        variant="ghost"
        icon="i-lucide-x"
        size="lg"
        class="absolute top-4 right-4 z-10"
        @click="close"
      />

      <!-- Navigation -->
      <UButton
        v-if="images.length > 1"
        color="white"
        variant="ghost"
        icon="i-lucide-chevron-left"
        size="lg"
        class="absolute left-4 top-1/2 -translate-y-1/2 z-10"
        @click="prevImage"
      />
      <UButton
        v-if="images.length > 1"
        color="white"
        variant="ghost"
        icon="i-lucide-chevron-right"
        size="lg"
        class="absolute right-4 top-1/2 -translate-y-1/2 z-10"
        @click="nextImage"
      />

      <!-- Counter -->
      <UBadge
        v-if="images.length > 1"
        color="white"
        variant="solid"
        class="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-sm"
      >
        {{ currentIndex + 1 }} / {{ images.length }}
      </UBadge>

      <!-- Image container -->
      <div class="relative w-full h-full flex items-center justify-center p-4">
        <div class="relative max-w-7xl w-full h-full flex items-center justify-center">
          <UCard
            v-if="loading"
            :ui="{
              base: 'bg-transparent shadow-none',
              body: 'p-0'
            }"
          >
            <div class="text-white text-center">
              <UIcon name="i-lucide-loader-circle" class="w-10 h-10 animate-spin mx-auto mb-3" />
              <p class="text-sm text-white/80">Loading...</p>
            </div>
          </UCard>

          <UCard
            v-else-if="error"
            :ui="{
              base: 'bg-transparent shadow-none',
              body: 'p-0'
            }"
          >
            <div class="text-white text-center">
              <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <UIcon name="i-lucide-image-off" class="w-8 h-8 text-red-400" />
              </div>
              <p class="text-sm text-white/80">Failed to load</p>
              <UButton color="white" variant="link" size="xs" @click="retryLoad">
                Retry
              </UButton>
            </div>
          </UCard>

          <img
            v-else
            :src="currentImage?.url"
            :alt="currentImage?.caption || 'Image'"
            class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            @load="onImageLoad"
            @error="onImageError"
            loading="lazy"
          />

          <div
            v-if="currentImage?.caption && !loading && !error"
            class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent rounded-b-lg"
          >
            <p class="text-white text-sm text-center">
              {{ currentImage.caption }}
            </p>
          </div>
        </div>
      </div>

      <!-- Thumbnails -->
      <div
        v-if="images.length > 1"
        class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/40 backdrop-blur-sm rounded-full"
      >
        <UButton
          v-for="(image, idx) in images"
          :key="idx"
          color="white"
          variant="ghost"
          :class="[
            'relative w-10 h-10 rounded-full overflow-hidden p-0',
            idx === currentIndex ? 'ring-2 ring-primary scale-110' : ''
          ]"
          @click="goToImage(idx)"
        >
          <img
            :src="image.url"
            :alt="image.caption || `Thumbnail ${idx + 1}`"
            class="w-full h-full object-cover"
            loading="lazy"
          />
          <div
            v-if="idx !== currentIndex"
            class="absolute inset-0 bg-black/40 hover:bg-black/20 transition-colors"
          />
        </UButton>
      </div>

      <!-- Hint -->
      <div class="absolute bottom-20 left-1/2 -translate-x-1/2 text-xs text-white/40 hidden sm:block">
        ← → navigate • ESC to close
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';

interface ImageItem {
  url: string;
  caption?: string;
}

const props = defineProps<{
  modelValue: boolean;
  images: ImageItem[];
  initialIndex?: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const currentIndex = ref(props.initialIndex || 0);
const loading = ref(true);
const error = ref(false);

const currentImage = computed(() => props.images[currentIndex.value] || null);

const handleKeydown = (e: KeyboardEvent) => {
  if (!props.modelValue) return;
  if (e.key === 'ArrowLeft') prevImage();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'Escape') close();
};

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));

watch(() => currentIndex.value, () => {
  loading.value = true;
  error.value = false;
});

watch(() => props.modelValue, (val) => {
  if (val) {
    loading.value = true;
    error.value = false;
    currentIndex.value = props.initialIndex || 0;
  }
});

const onImageLoad = () => {
  loading.value = false;
  error.value = false;
};

const onImageError = () => {
  loading.value = false;
  error.value = true;
};

const retryLoad = () => {
  loading.value = true;
  error.value = false;
  const img = new Image();
  img.src = currentImage.value?.url || '';
};

const prevImage = () => {
  if (props.images.length > 1) {
    currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length;
  }
};

const nextImage = () => {
  if (props.images.length > 1) {
    currentIndex.value = (currentIndex.value + 1) % props.images.length;
  }
};

const goToImage = (index: number) => {
  currentIndex.value = index;
};

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};
</script>