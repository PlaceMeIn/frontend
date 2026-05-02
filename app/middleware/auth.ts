export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  if (process.server) {
    return
  }

  const toast = useToast()

  await authStore.ensureReady()

  // If not authenticated and trying to access protected route
  if (!authStore.isAuthenticated) {
    // Store the intended destination before redirecting to login
    authStore.pushRedirect(to)
    toast.add({
      title: 'You need to login'
    })
    return navigateTo('/auth/login')
  }

  // If authenticated and trying to access login/register, redirect to account
  if (authStore.isAuthenticated && (to.path === '/auth/login' || to.path === '/auth/join')) {
    toast.add({
      title: 'You are already logged in'
    })
    return navigateTo('/account')
  }
})
