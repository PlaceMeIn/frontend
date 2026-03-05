<template>
  <div
    class="relative group rounded-xl border border-default bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
  >
    <!-- Image -->
    <img
      :src="project?.image || '/placeholder.jpg'"
      :alt="project?.title || 'Project image'"
      class="w-full h-50 object-cover"
    />

    <UBadge class="absolute top-2 right-2" :label="project?.category" />

    <!-- Content -->
    <div class="p-5 flex flex-col gap-3">
      <!-- Title -->
      <h2 class="text-lg font-semibold truncate">
        {{ project?.title || "Untitled Project" }}
      </h2>

      <!-- Description -->
      <p class="text-sm text-muted line-clamp-3">
        {{ project?.description || "No description available." }}
      </p>

      <!-- Tech stack -->
      <div class="flex flex-wrap items-center gap-2">
        <UBadge
          v-for="tech in (project?.tech_stack || []).slice(0,3)"
          :key="tech"
          :label="tech"
          color="primary"
          variant="soft"
        />

        <span
          v-if="project?.tech_stack?.length > 3"
          class="text-xs text-muted"
        >
          +{{ project.tech_stack.length - 3 }}
        </span>
      </div>

      <!-- Contributors -->
      <p class="flex items-center gap-2 text-sm text-muted">
        <UIcon name="i-lucide-users" />
        {{ project?.contributor_count || 0 }} Contributors
      </p>

      <!-- Buttons -->
      <div class="flex gap-3 mt-2">
        <UButton
          icon="i-lucide-github"
          color="neutral"
          variant="soft"
          label="Code"
          :to="project?.code_link || '#'"
          target="_blank"
        />

        <UButton
          icon="i-lucide-external-link"
          color="primary"
          label="Demo"
          :to="project?.demo_link || '#'"
          target="_blank"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Project {
  title?: string
  description?: string
  image?: string
  tech_stack?: string[]
  contributor_count?: number
  code_link?: string
  demo_link?: string
}

defineProps<{
  project?: Project
}>()
</script>