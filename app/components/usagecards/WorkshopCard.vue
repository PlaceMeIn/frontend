<template>
  <NuxtLink
    :to="workshop?.link"
    target="_blank"
    class="group block"
  >
    <div
      class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800
      bg-white dark:bg-gray-900
      hover:shadow-xl hover:-translate-y-1
      transition-all duration-300"
    >

      <!-- Video Preview -->
      <div
        class="relative w-full h-48
        bg-gradient-to-br from-primary-500/20 to-primary-900/20
        flex items-center justify-center"
      >
        <UIcon
          name="i-lucide-video"
          class="w-12 h-12 text-primary
          group-hover:scale-110 transition"
        />
      </div>

      <!-- Content -->
      <div class="p-4 flex flex-col gap-2">

        <!-- Title -->
        <h3
          class="font-semibold text-lg line-clamp-2
          group-hover:text-primary transition"
        >
          {{ workshop?.title }}
        </h3>

        <!-- Instructor -->
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ workshop?.instructor }}
        </p>

        <!-- Meta -->
        <div
          class="flex items-center justify-between
          text-sm text-gray-600 dark:text-gray-400 mt-2"
        >
          <div class="flex items-center gap-1">
            <UIcon name="i-lucide-clock" class="w-4 h-4"/>
            <span>{{ workshop?.duration }}</span>
          </div>

          <div class="flex items-center gap-1">
            <UIcon name="i-lucide-eye" class="w-4 h-4"/>
            <span>{{ workshop?.views }}</span>
          </div>
        </div>

      </div>
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
defineProps<{
  workshop?: {
    title?: string
    instructor?: string
    duration?: string
    views?: string | number
    link?: string
  }
}>()
</script>