// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-og-image',
    'motion-v/nuxt',
    '@nuxtjs/color-mode',
  ],

  colorMode: {
    classSuffix: '',
    preference: 'system', // or 'dark' if you want default dark
    fallback: 'light',
    storageKey: 'nuxt-color-mode'
  },

  piniaPluginPersistedstate: {
    storage: 'cookies',
    cookieOptions: {
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60 * 24 * 30 // 30 days
    },
  },


  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2024-11-01',
  components: {
    global: true,
    dirs: [
      { path: '~/components/', pathPrefix: false },
      { path: '~/components/defaults', pathPrefix: false },
      { path: '~/components/landing', pathPrefix: false },
      { path: '~/components/cool', pathPrefix: false },
    ]
  },

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
