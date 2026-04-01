<template>
  <NuxtLoadingIndicator class="z-9999999" />

  <div class="min-h-screen flex flex-col">
    <div
      class="flex items-center justify-between p-4 border-b border-primary-800/20 sticky top-0 z-9999 backdrop-blur-2xl"
    >
      <div class="flex items-center gap-3">
        <AppLogo :size="3" />
      </div>

      <UButton
        variant="ghost"
        size="sm"
        :icon="
          screen?.isMobile.value
            ? 'i-lucide-chevron-left'
            : 'i-lucide-arrow-left'
        "
        class="hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
        @click="handleBack"
        :label="screen?.isMobile.value ? '' : 'Back'"
      >
      </UButton>
    </div>

    <!-- Page content -->
    <div class="flex-1 p-4">
      <slot />
    </div>

    <!-- Footer -->
    <app-footer />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const screen = useScreenSize();
const handleBack = () => {
  router.back();
};
</script>
