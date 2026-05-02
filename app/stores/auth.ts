import { defineStore } from 'pinia'

let refreshTimer: ReturnType<typeof setInterval> | null = null
let refreshRequest: Promise<boolean> | null = null
let initRequest: Promise<boolean> | null = null
let crossTabListenerInitialized = false

interface VerificationStep {
  identifier: string
  type: 'email' | 'phone' | 'id'
  required: boolean
  completed: boolean
  redirectAfter?: string
}

interface User {
  id: string
  email: string
  full_name?: string
  is_email_verified: boolean
  is_verified?: boolean
  public_id: string
  display_name: string
  profile_picture: string
  Profile_picture_thumbnail: string
  phone_number: string | null
  is_phone_verified: boolean
  is_active?: boolean
}

interface RedirectStackItem {
  path: string
  params?: Record<string, any>
  query?: Record<string, any>
  timestamp: number
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    refreshToken: null as string | null,
    user: null as User | null,
    set_up: {} as any,
    redirectStack: [] as RedirectStackItem[],
    verificationStack: [] as VerificationStep[],
    refreshing: false,
    initialized: false,
    loading: false,
    error: null as any
  }),

  getters: {
    isAuthenticated: state => !!state.user && !!state.token,
    isLoggedIn: state => !!state.user && !!state.token,
    isEmailVerified: s => !!s.user?.is_email_verified,
    isPhoneVerified: s => !!s.user?.is_phone_verified,
    currentUser: state => state.user,
    hasRedirect: state => state.redirectStack.length > 0,
    pendingVerification: state => state.verificationStack.filter(v => !v.completed),
    nextRedirect: state => state.redirectStack[0],
    nextVerification: state => state.verificationStack.find(v => !v.completed)
  },

  actions: {
    pushRedirect(route: any) {
      const existingIndex = this.redirectStack.findIndex(r => r.path === route.path)
      if (existingIndex > -1) this.redirectStack.splice(existingIndex, 1)

      this.redirectStack.unshift({
        path: route.path,
        params: route.params,
        query: route.query,
        timestamp: Date.now()
      })

      if (this.redirectStack.length > 5) this.redirectStack.pop()
    },
    setLastAttemptedRouteToCurrent() {
      const route = useRoute()
      this.pushRedirect(route)
    },

    popRedirect() {
      return this.redirectStack.shift() || null
    },

    clearRedirects() {
      this.redirectStack = []
    },

    addVerification(step: Omit<VerificationStep, 'completed'>) {
      const existingIndex = this.verificationStack.findIndex(v => v.type === step.type)
      if (existingIndex > -1) {
        this.verificationStack[existingIndex] = { ...step, completed: false }
      } else {
        this.verificationStack.push({ ...step, completed: false })
      }
    },

    completeVerification(type: VerificationStep['type']) {
      const step = this.verificationStack.find(v => v.type === type)
      if (step) step.completed = true
    },

    clearVerifications() {
      this.verificationStack = []
    },

    setUser(user: User, token?: string, refreshToken?: string) {

      console.log(user,token,refreshToken)
      this.user = user
      if (token) this.token = token
      if (refreshToken) this.refreshToken = refreshToken

      if (this.refreshToken) {
        this.startAutoRefresh()
      }
    },

    clearUser() {
      this.user = null
      this.token = null
      this.refreshToken = null
      this.error = null
      this.stopAutoRefresh()
      this.clearRedirects()
      this.clearVerifications()
    },

    async login(credentials: { email: string, password: string, remember?: boolean }) {
      const { post } = useApi()
      const endpoints = useEndpoints()

      this.loading = true
      this.error = null

      try {
        const response = await post(endpoints.auth.login, credentials)

        if (response?.access || response?.refresh || response?.user) {
          this.setUser(
            response.user,
            response.access,
            response.refresh
          )
          await this.getUSer(false)
          this.startAutoRefresh()
          const redirect = this.popRedirect()

          return {
            success: true,
            redirectTo: redirect?.path || '/account',
            requiresVerification: this.pendingVerification.length > 0
          }
        }

        return { success: false, message: response.message }
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(payload: Record<string, any>) {
      const { post } = useApi()
      const endpoints = useEndpoints()

      this.loading = true
      this.error = null

      try {
        const response = await post(endpoints.main.join, payload)

        if (response?.success || response?.user || response?.access || response?.access_token) {
          this.setUser(
            response.user,
            response.access || response.access_token,
            response.refresh || response.refresh_token
          )

          this.addVerification({
            identifier: payload.email,
            type: 'email',
            required: true,
            redirectAfter: '/dashboard'
          })

          return {
            ...response,
            requiresVerification: true
          }
        }

        return response
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async verifyCode(credentials: { identifier: string, code: string, type: string }) {
      try {
        if (credentials.type === 'email') {
          const response = await this.verifyEmail({
            email: credentials.identifier,
            code: credentials.code
          })

          if (response?.success) {
            this.completeVerification('email')
          }

          return response
        }

        throw new Error(`Verification type "${credentials.type}" is not supported by the current API`)
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message
        throw error
      }
    },

    handleRouteGuard(route: any): boolean {
      if (route.meta?.requiresAuth && !this.isAuthenticated) {
        this.pushRedirect(route)
        useRouter().push('/login')
        return false
      }

      if (route.meta?.requiresVerified && this.user && !this.user.is_email_verified) {
        this.addVerification({
          identifier: this.user.email,
          type: 'email',
          required: true,
          redirectAfter: route.fullPath
        })

        useRouter().push('/verify')
        return false
      }

      return true
    },

    async refresh_Token() {
      if (!this.refreshToken) {
        this.stopAutoRefresh()
        return false
      }

      if (refreshRequest) {
        return refreshRequest
      }

      refreshRequest = (async () => {
        this.refreshing = true

        try {
          const { post } = useApi()
          const endpoints = useEndpoints()

          const response: any = await post(
            endpoints.auth.refreshToken,
            {
              refresh: this.refreshToken
            }
          )

          if (response?.access) {
            this.token = response.access

            if (response?.refresh) {
              this.refreshToken = response.refresh
            }

            this.startAutoRefresh()
            return true
          }

          return false
        } catch (error: any) {
          if (error.response?.status === 401) {
            this.clearUser()
          }

          return false
        } finally {
          this.refreshing = false
          refreshRequest = null
        }
      })()

      return refreshRequest
    },

    async getUSer(redirectAfterLoad = true) {
      if (!this.token) {
        console.warn('No token available')
        return false
      }

      // if (this.refreshing) return false

      this.refreshing = true
      const router = useRouter()

      try {
        const { get } = useApi()
        const endpoints = useEndpoints()

        const response: any = await get(
          endpoints.auth.userProfile, {},
          true
        )

        if (response) {
          this.user = response?.user || response?.data?.user || response

          if (redirectAfterLoad) {
            const redirect = this.popRedirect()
            router.push(redirect?.path || '/account')
          }

          return true
        }

        return false
      } catch (error: any) {
        if (error.response?.status === 401) {
          // Only clear AFTER confirmed invalid session
          this.clearUser()
        }

        return false
      } finally {
        this.refreshing = false
      }
    },

    async verifyEmail(credentials: { email: string, code: string }) {
      const { post } = useApi()
      const endpoints = useEndpoints()

      this.loading = true
      this.error = null

      try {
        const response = await post(endpoints.auth.verifyEmail, credentials)

        if (response.success && this.user) {
          this.user.is_email_verified = true
        }

        return response
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Email verification failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async verifyPhone(_credentials: { phone: string, code: string }) {
      try {
        throw new Error('Phone verification endpoint is not configured')
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Phone verification failed'
        throw error
      }
    },

    async checkEmailExists(email: string) {
      const { post } = useApi()
      const endpoints = useEndpoints()

      this.loading = true
      this.error = null

      try {
        await post(endpoints.auth.initiateChangePassword, { email })
        return { exists: true }
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Password reset request failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async sendCodes(email: string, purpose: string) {
      const { post } = useApi()
      const endpoints = useEndpoints()

      this.loading = true
      this.error = null

      try {
        const endpoint = purpose === 'password-reset'
          ? endpoints.auth.initiateChangePassword
          : endpoints.auth.initiateSetupPassword

        return await post(endpoint, { email })
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Password reset request failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateToNewPassword(data: { current_password: string, new_password: string, token: string | null }) {
      const { post } = useApi()
      const endpoints = useEndpoints()

      this.loading = true
      this.error = null

      try {
        return await post(endpoints.auth.changePassword, data)
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Password change failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async handleGoogleLogin(): Promise<void> {
      if (!process.client) return

      const url = await useApi().get(useEndpoints().auth.loginWithGoogle)
      this.setLastAttemptedRouteToCurrent()

      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      if (isMobile) {
        window.location.href = url?.auth_url
        return
      }

      const width = 500
      const height = 600
      const left = window.screenX + (window.innerWidth - width) / 2
      const top = window.screenY + (window.innerHeight - height) / 2

      const popup = window.open(
        url?.auth_url,
        'Google Login',
        `width=${width},height=${height},top=${top},left=${left},resizable,scrollbars`
      )

      if (!popup) {
        window.location.href = url?.auth_url
        return
      }

      let completed = false
      let pollInterval: NodeJS.Timeout | null = null
      let timeoutId: NodeJS.Timeout | null = null

      const cleanup = () => {
        if (pollInterval) clearInterval(pollInterval)
        if (timeoutId) clearTimeout(timeoutId)
        window.removeEventListener('message', messageHandler)
      }

      const finishPopupLogin = async (payload: any) => {
        if (completed) return
        completed = true

        cleanup()

        console.log("received payload", payload)

        // CRITICAL: Set user data FIRST
        this.setUser(
          payload.user,
          payload.access,
          payload.refresh
        )

        // Wait for storage to persist (important for cross-tab sync)
        await nextTick()

        // Close popup BEFORE redirecting
        if (popup && !popup.closed) {
          popup.close()
        }

        // Small delay to ensure popup closes and store is updated
        setTimeout(async () => {
          const router = useRouter()
          const redirect = this.popRedirect()
          const targetPath = !redirect?.path ||
            redirect.path.includes('/login') ||
            redirect.path.includes('/auth')
            ? '/account'
            : redirect.path

          await router.push(targetPath)
        }, 100)
      }

      // Listen for message from popup
      const messageHandler = (event: MessageEvent) => {
        console.log("EVENT DATA",event)
        // if (event.origin !== window.location.origin) return

        if (event.data?.type === 'google-login-success') {
          void finishPopupLogin(event.data)
        } else if (event.data?.type === 'google-login-error') {
          cleanup()
          if (popup && !popup.closed) popup.close()
          useToast().add({
            title: 'Login Failed',
            description: 'Google login was unsuccessful. Please try again.',
            color: 'error'
          })
        }
      }

      window.addEventListener('message', messageHandler)

      // Poll to check if popup was closed without completing login
      pollInterval = setInterval(() => {
        try {
          if (popup.closed && !completed) {
            cleanup()
            // Don't auto-redirect if user just closed the popup intentionally
            if (this.isAuthenticated) {
              const router = useRouter()
              const redirect = this.popRedirect()
              router.push(redirect?.path || '/account')
            }
          }
        } catch (e) {
          // Ignore cross-origin errors
        }
      }, 500)

      // Cleanup after 5 minutes
      timeoutId = setTimeout(() => {
        if (!completed) {
          cleanup()
          if (popup && !popup.closed) popup.close()
        }
      }, 5 * 60 * 1000)
    },

    startAutoRefresh() {
      if (!this.refreshToken) return

      if (refreshTimer) clearInterval(refreshTimer)

      refreshTimer = setInterval(() => {
        void this.refresh_Token()
      }, 20 * 60 * 1000)
    },

    stopAutoRefresh() {
      if (refreshTimer) clearInterval(refreshTimer)
      refreshTimer = null
    },

    logout() {
      this.clearUser()
      this.stopAutoRefresh()
      return true
    },

    initCrossTabListener() {
      if (!process.client) return
      if (crossTabListenerInitialized) return

      crossTabListenerInitialized = true
      const store = this as any

      window.addEventListener('storage', (event: StorageEvent) => {
        if (event.key === 'auth') {
          if (event.newValue) {
            try {
              const data = JSON.parse(event.newValue)
              store.user = data.user || null
              store.token = data.token || null
              store.refreshToken = data.refreshToken || null

              if (store.token && store.refreshToken) {
                store.startAutoRefresh()
              } else {
                store.stopAutoRefresh()
              }
            } catch (e) {
              console.error('Failed to parse user store:', e)
            }
          } else {
            // Logout detected in another tab
            store.stopAutoRefresh()
            store.user = null
            store.token = null
            store.refreshToken = null
            store.redirectStack = []
            store.verificationStack = []

            // Redirect to login page
            const router = useRouter()
            if (!router.currentRoute.value.path.startsWith('/login') && !router.currentRoute.value.path.startsWith('/auth')) {
              router.push('/auth/login')
            }
          }
        }
      })
    },
    async ensureReady(): Promise<boolean> {
      if (this.initialized) return this.isAuthenticated

      if (initRequest) {
        return initRequest
      }

      initRequest = this.init()
        .finally(() => {
          initRequest = null
        })

      return initRequest
    },
    async init(): Promise<boolean> {
      this.initCrossTabListener()

      if (this.token && this.user) {
        this.startAutoRefresh()
        this.initialized = true
        return true
      }

      if (!this.refreshToken) {
        this.stopAutoRefresh()
        this.initialized = true
        return this.isAuthenticated
      }

      const success = await this.refresh_Token()
      if (success) {
        await this.getUSer(false)
        this.startAutoRefresh()
      }

      this.initialized = true

      const route = useRoute()

      if (!this.user && !route.fullPath.startsWith('/admin')) {
        // useGoogleOneTap()
      }

      return this.isAuthenticated
    }
  },
  persist: {
    pick: ['token', 'refreshToken', 'user', 'redirectStack', 'verificationStack'],
    storage: piniaPluginPersistedstate.localStorage(),

    serializer: {
      serialize: JSON.stringify,
      deserialize: JSON.parse
    }
  }
})

//  persist: {
//     storage: piniaPluginPersistedstate.localStorage(),
//     serializer: {
//       serialize: JSON.stringify,
//       deserialize: JSON.parse
//     }
//   }