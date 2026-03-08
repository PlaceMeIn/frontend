<template>
  <NuxtLink
    :to="certification?.link"
    target="_blank"
    class="block group"
  >
    <div
      class="p-5 rounded-xl border border-gray-200 dark:border-gray-800
      bg-white dark:bg-gray-900
      hover:shadow-lg hover:-translate-y-1
      transition-all duration-300 flex flex-col gap-4"
    >

      <!-- Header -->
      <div class="flex items-start justify-between gap-3">
        <h3
          class="font-semibold text-lg leading-snug
          group-hover:text-primary transition line-clamp-2"
        >
          {{ certification?.title }}
        </h3>

        <UBadge
          :label="certification?.level"
          color="primary"
          variant="soft"
        />
      </div>

      <!-- Provider -->
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ certification?.provider }}
      </p>

      <USeparator />

      <!-- Footer -->
      <div class="flex items-center justify-between mt-2">

        <p class="font-semibold text-primary">
          ${{ certification?.price }}
        </p>

        <UButton
          label="Learn More"
          trailing-icon="i-lucide-square-arrow-out-up-right"
          size="sm"
          variant="soft"
          :to="certification?.link"
        />

      </div>

    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
defineProps<{
  certification?: {
    title?: string
    provider?: string
    level?: string
    price?: string
    link?: string
  }
}>()
</script>