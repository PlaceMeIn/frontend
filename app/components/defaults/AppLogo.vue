<template>
  <NuxtLink to="/" class="inline-flex items-center gap-2 group">
    <div
      class="flex items-center justify-center rounded-full bg-white/80 dark:bg-neutral-800/80 p-1 shadow-sm ring-1 ring-black/5 dark:ring-white/10 backdrop-blur"
    >
      <img
        src="/logo.jpeg"
        alt="Mut Tech Logo"
        class="pointer-events-none select-none rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
        :style="{ height: `${size * 15}px`, width: `${size * 15}px` }"
        loading="lazy"
      />
    </div>

    <div class="leading-tight">
      <h2 class="text-lg md:text-2xl font-semibold md:font-bold">
        {{ config.site.name }}
      </h2>
      <p class="text-muted font-mono text-[10px]">
        {{ config.site.motto }}
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  size?: number
}>()

const config = useAppConfig()
</script>