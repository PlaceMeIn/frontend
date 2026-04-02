import { defineNuxtPlugin } from '#app'
import { useAuthStore } from '~/stores/auth'
import { watch } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
    const auth = useAuthStore()

    // Ensure Pinia + App hydration is complete before running init()
    nuxtApp.hook('app:mounted', () => {
        console.log('App mounted → running auth.init()')
        auth.init()
    })

    // Watch for user loading, then refresh token
    watch(
        () => auth.user,
        async (newUser) => {
            if (newUser) {
                console.log('User loaded → refreshing token…')
                await auth.refreshToken()
            }
        },
        {
            immediate: false,   // don't run on plugin load or SSR hydration
            deep: false,
        }
    )
})