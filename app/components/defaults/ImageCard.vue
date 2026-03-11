<template>
  <transition name="fade">
    <div
      v-if="url"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      @click.self="$emit('close')"
    >
      <NuxtImg
        :src="url"
        class="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
      />
      <UButton
        class="absolute top-5 right-5 text-white text-2xl font-bold"
        @click="$emit('close')"
        variant="outline"
        color="neutral"
        icon="i-licide-x"
      />
        
    </div>
  </transition>
</template>

<script lang="ts" setup>
interface Props {
  alt: string;
  url: string;
}

defineEmits(['close'])
const props = defineProps<Props>();
</script>
