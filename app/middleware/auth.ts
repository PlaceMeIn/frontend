export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const toast = useToast()

  // Client-only init (localStorage not available on server)
  if (process.client && !authStore.isAuthenticated) {
    await authStore.init()
  }

  // If not authenticated and trying to access protected route
  if (!authStore.isLoggedIn ) {
    // Store the intended destination before redirecting to login
    authStore.pushRedirect(to)
    toast.add({
      title:"You need to login"
    })
    return navigateTo('/auth/login')
  }

  // If authenticated and trying to access login/register, redirect to account
  if (authStore.isLoggedIn && (to.path === '/auth/login' || to.path === '/auth/join')) {
    toast.add({
      title:"You are already logged in"
    })
    return navigateTo('/account')
  }
})