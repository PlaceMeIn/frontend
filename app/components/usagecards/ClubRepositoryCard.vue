<template>
  <NuxtLink
    :to="repo?.link"
    target="_blank"
    class="block group"
  >
    <div
      class="p-5 rounded-xl border border-gray-200 dark:border-gray-800
      bg-white dark:bg-gray-900
      hover:border-primary hover:shadow-lg  hover:-translate-y-1
      transition-all duration-300
      flex flex-col gap-4"
      
    >
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 font-semibold text-lg">
          <UIcon
            name="i-lucide-github"
            class="w-5 h-5 text-gray-500"
          />
          <p class="truncate ">{{ repo?.title }}</p>
        </div>

        <UIcon
          name="i-lucide-square-arrow-out-up-right"
          class="w-4 h-4 text-gray-400 group-hover:text-primary transition"
        />
      </div>

      <!-- Description -->
      <p
        class="text-sm text-gray-600 dark:text-gray-400" 
      >
        {{ repo?.description }}
      </p>

      <!-- Footer -->
      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center gap-1 text-yellow-500">
          ⭐
          <span class="text-gray-700 dark:text-gray-300">
            {{ repo?.stars }}
          </span>
        </div>

        <span
          class="px-2 py-1 text-xs rounded-md
          bg-gray-100 dark:bg-gray-800
          text-gray-700 dark:text-gray-300"
        >
          {{ repo?.language }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
defineProps<{
  repo?: {
    title?: string
    description?: string
    stars?: number
    language?: string
    link?: string
  }
}>()
</script>