<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
definePageMeta({
  layout: 'auth',
})

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const status = ref<'loading' | 'success' | 'error'>('loading')
const message = ref('Signing you in securely…')

onMounted(() => {
  try {
    if (route.query.data) {
      const decoded = JSON.parse(atob(route.query.data as string))
      if(decoded.success){
        auth.user = decoded.user
        auth.token = decoded?.token?.access
        auth.refreshToken = decoded.tokens?.refresh
      }

      // auth.setUser(decoded.user, decoded.access_token)
      status.value = 'success'
      message.value = 'Login successful. Redirecting…'

      // Popup flow
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(
          { type: 'google-login-success' },
          window.location.origin
        )
        window.close()
        return
      }

      // Normal redirect
      const redirect = auth.popRedirect()
      router.replace(redirect?.path || '/events')
      return
    }

    throw new Error('Invalid authentication response')
  } catch (err) {
    console.error(err)
    status.value = 'error'
    message.value = 'Authentication failed. Redirecting…'

    setTimeout(() => {
      router.replace('/auth/login')
    }, 2000)
  }
})
</script>

<template>
  <UApp>
    <div
      class="min-h-screen flex items-start justify-center mt-40
              px-6"
    >
      <div
        class="w-full max-w-md text-center space-y-6
               rounded-3xl border border-gray-200 dark:border-gray-800
               bg-white dark:bg-gray-900 p-10 shadow-sm"
      >
        <!-- Logo -->
        <AppLogo :size="5"/>

        <!-- Status Icon -->
        <div class="flex justify-center">
          <div
            v-if="status === 'loading'"
            class="w-14 h-14 rounded-full border-4 border-primary border-t-transparent animate-spin"
          />
          <UIcon
            v-else-if="status === 'success'"
            name="i-lucide-check-circle"
            class="w-14 h-14 text-green-500"
          />
          <UIcon
            v-else
            name="i-lucide-x-circle"
            class="w-14 h-14 text-red-500"
          />
        </div>

        <!-- Message -->
        <div class="space-y-1">
          <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {{ message }}
          </h1>
          <p
            v-if="status === 'loading'"
            class="text-sm text-gray-500 dark:text-gray-400"
          >
            Please don’t close this window.
          </p>
        </div>
      </div>
    </div>
  </UApp>
</template>