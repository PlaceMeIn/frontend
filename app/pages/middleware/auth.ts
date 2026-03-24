export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  // Client-only init (localStorage not available on server)
  if (process.client && !authStore.isAuthenticated) {
    await authStore.initializeAuth()
  }

  // If not authenticated and trying to access protected route
  if (!authStore.isLoggedIn && to.path.startsWith('/profile')) {
    return navigateTo('/auth/login')
  }

  // If authenticated and trying to access login/register, redirect 
  if (authStore.isLoggedIn && (to.path === '/auth/login' || to.path === '/auth/register')) {
    return navigateTo('/events')
  }
})