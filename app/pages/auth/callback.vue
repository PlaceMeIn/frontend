<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'auth'
})

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const status = ref<'loading' | 'success' | 'error'>('loading')
const message = ref('Signing you in securely...')

const decodeAuthPayload = (payload: string) => {
  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(normalized.length + (4 - normalized.length % 4) % 4, '=')
  return JSON.parse(atob(padded))
}

onMounted(async () => {
  try {
    if (!route.query.data) {
      throw new Error('Invalid authentication response')
    }

    const decoded = decodeAuthPayload(route.query.data as string)

    if (!decoded?.success || !decoded?.user) {
      throw new Error('Invalid authentication response')
    }

    // Hydrate the store immediately so parent window has auth state
    // before we send the postMessage / close the popup.
    auth.setUser(
      decoded.user,
      decoded?.token?.access,
      decoded?.token?.refresh
    )

    // Fetch full profile — this updates `auth.user` with server-fresh data
    // and triggers pinia-persist to write to localStorage so the parent tab
    // picks it up via the storage event (belt-and-suspenders).
    await auth.getUSer(false)

    status.value = 'success'
    message.value = 'Login successful. Redirecting...'

    if (window.opener && !window.opener.closed) {
      // Primary path: we're in a popup — notify parent then close.
      window.opener.postMessage(
        {
          type: 'google-login-success',
          user: decoded.user,
          access: decoded?.token?.access,
          refresh: decoded?.token?.refresh
        },
        window.location.origin
      )

      // Give the message a tick to be received before closing
      await new Promise(r => setTimeout(r, 150))
      window.close()

      // Fallback: if window.close() was blocked (some browsers require user gesture)
      setTimeout(() => {
        message.value = 'Login successful. You can close this window.'
      }, 500)
      return
    }

    // Standalone redirect path (mobile, or popup blocked)
    const redirect = auth.popRedirect()
    const targetPath =
      !redirect?.path || redirect.path.includes('/login') || redirect.path.includes('/auth')
        ? '/account'
        : redirect.path

    await router.replace(targetPath)
  } catch (err) {
    console.error(err)
    status.value = 'error'
    message.value = 'Authentication failed. Redirecting...'

    setTimeout(() => {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: 'google-login-error' }, window.location.origin)
        window.close()
      } else {
        router.replace('/auth/login')
      }
    }, 2000)
  }
})
</script>

<template>
  <UApp>
    <div class="min-h-screen flex items-start justify-center mt-40 px-6">
      <div
        class="w-full max-w-md text-center space-y-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-10 shadow-sm">
        <AppLogo :size="5" />

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
          <UIcon v-else name="i-lucide-x-circle" class="w-14 h-14 text-red-500" />
        </div>

        <div class="space-y-1">
          <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {{ message }}
          </h1>
          <p v-if="status === 'loading'" class="text-sm text-gray-500 dark:text-gray-400">
            Please don't close this window.
          </p>
        </div>
      </div>
    </div>
  </UApp>
</template>