<script setup lang="ts">
import { useError, clearError } from '#app'

const error = useError()

// Check if this is a 404 (page not found)
const is404 = computed(() => error.value?.statusCode === 404)

// Go back to homepage
const goHome = () => {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900 text-white px-6 py-12">

    <!-- Logo -->
    <AppLogo :size="5" class="mb-8" />

    <NotFound />

    <div class="max-w-lg text-center">
      <!-- Error Code -->
      <h1 class="text-8xl font-extrabold text-primary mb-4">
        {{ is404 ? '404' : 'Error' }}
      </h1>

      <!-- Title -->
      <h2 class="text-2xl sm:text-3xl font-semibold mb-4">
        {{ is404 ? 'Page Not Found' : 'Something went wrong' }}
      </h2>

      <!-- Message -->
      <p class="text-gray-400 mb-6">
        {{
          is404
            ? "The page you’re looking for doesn’t exist or may have been moved."
            : error?.message || 'An unexpected error occurred.'
        }}
      </p>
      

      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <UButton
          label="Go Back Home"
          icon="i-lucide-home"
          color="primary"
          class="w-full sm:w-auto"
          @click="goHome"
        />

        <UButton
          label="Contact Us"
          icon="i-lucide-mail"
          variant="outline"
          class="w-full sm:w-auto"
          to="/contact"
        />
      </div>

    </div>
  </div>
</template>