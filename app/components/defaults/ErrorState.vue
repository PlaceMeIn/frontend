<!-- components/ui/ErrorState.vue -->
<template>
  <div
    class="flex flex-col items-center text-center py-5 border border-red-500/20 rounded-xl bg-red-500/5 p-5 "
  >

    <div class="bg-red-500/10 text-red-500 p-4 rounded-full mb-4">
      <UIcon name="i-lucide-globe-x" size="32" />
    </div>

    <h3 class="text-lg font-semibold text-red-600">
      {{ title }}
    </h3>

    <p class="text-sm text-red-500/80 mt-2 max-w-md">
      {{ description }}
    </p>

    <div v-if="$slots.details" class="mt-4 text-sm text-red-400">
      <slot name="details" />
    </div>

    <div class="mt-6 flex gap-4">
      <UButton
        v-if="retry"
        icon="i-lucide-refresh-cw"
        color="error"
        variant="outline"
        @click="$emit('retry')"
      >
        Retry
      </UButton>

      <slot name="actions" />
    </div>

  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "Something went wrong"
  },
  description: {
    type: String,
    default: "We couldn't load this resource."
  },
  retry: {
    type: Boolean,
    default: true
  }
})

defineEmits(["retry"])
</script>