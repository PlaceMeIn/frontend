<template>
  <div
    class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800
    bg-white dark:bg-gray-900 hover:shadow-lg hover:-translate-y-1
    transition-all duration-300 flex flex-col"
  >

    <!-- Header -->
    <div
      :class="[
        'h-20 flex items-center justify-center text-white',
        suggestBackground(learning?.title)
      ]"
    >
      <UIcon
        :name="suggestIcon(learning?.title)"
        class="w-8 h-8"
      />
    </div>

    <!-- Content -->
    <div class="p-5 flex flex-col gap-3">

      <h3 class="text-lg font-semibold line-clamp-2">
        {{ learning?.title }}
      </h3>

      <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
        {{ learning?.description }}
      </p>

      <!-- Meta -->
      <div class="flex items-center justify-between text-sm text-gray-500">
        <span>⏱ {{ learning?.duration }}</span>
        <span class="capitalize">{{ learning?.difficulty }}</span>
      </div>

      <!-- Modules -->
      <div v-if="learning?.modules?.length" class="mt-2">
        <p class="text-sm font-semibold mb-1">Modules</p>

        <ul class="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
          <li v-for="m in learning.modules" :key="m">
            {{ m }}
          </li>
        </ul>
      </div>

      <!-- Button -->
      <div class="mt-4">
        <UButton
          label="Start Learning"
          icon="i-lucide-play"
          block
          :to="learning?.link"
        />
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>

defineProps<{
  learning?: {
    title?: string
    description?: string
    duration?: string
    difficulty?: string
    modules?: string[]
    link?: string
  }
}>()

function suggestIcon(title?: string) {
  const t = title?.toLowerCase() || ""

  if (t.includes("web") || t.includes("html")) return "i-lucide-globe"
  if (t.includes("ai") || t.includes("ml")) return "i-lucide-brain"
  if (t.includes("data")) return "i-lucide-database"
  if (t.includes("mobile")) return "i-lucide-smartphone"

  return "i-lucide-book-open"
}

function suggestBackground(title?: string) {
  const t = title?.toLowerCase() || ""

  if (t.includes("web")) return "bg-gradient-to-r from-blue-400 to-blue-600"
  if (t.includes("ai")) return "bg-gradient-to-r from-purple-400 to-purple-600"
  if (t.includes("data")) return "bg-gradient-to-r from-green-400 to-green-600"

  return "bg-gradient-to-r from-gray-400 to-gray-600"
}

</script>