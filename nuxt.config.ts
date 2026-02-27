// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@maz-ui/nuxt',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-og-image',
    'motion-v/nuxt'
  ],
  // mazUi: {
  //   composables: {
  //     useToast: true,
  //   },
  // },
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
