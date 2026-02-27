<template>
  <NuxtLink to="/" class="inline-flex  items-center">
    <!-- <img
      src="/logos/logo.png"
      alt="Logo"
      class="pointer-events-none select-none"
      :style="{ height: `${size * 25}px` }"
    /> -->
    <div class="bg-primary rounded-xl p-2 mr-1 text-white">MT</div>
    <div>
      <h2 class="text-md font-bold">{{config.site.name}}</h2>
      <p class="p-0 m-0 text-muted font-mono text-[10px] font-normal">{{config.site.motto}}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  size?: number
}>()

const config  = useAppConfig()
</script>