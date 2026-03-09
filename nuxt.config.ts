export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

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
    '@nuxtjs/color-mode'
  ],

  runtimeConfig: {
    apiSecret: process.env.API_SECRET,

    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://techclub.mut.ac.ke',
      allowedOrigins: [
        'https://techclub.mut.ac.ke',
        'https://mut-tech-club.vercel.app',
        'http://localhost:3000',
        'https://app.tera-in.top',

      ],


    }
  },
  // vite: {
  //   server: {
  //     allowedHosts: [
  //       'app.tera-in.top',
  //       'localhost'
  //     ]
  //   }
  // },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'mut-techclub-color-mode'
  },

  piniaPluginPersistedstate: {
    storage: 'cookies',
    cookieOptions: {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30
    }
  },

  devtools: {
    enabled: process.env.NODE_ENV !== 'production'
  },

  css: ['~/assets/css/main.css'],

  components: {
    global: true,
    dirs: [
      { path: '~/components', pathPrefix: false },
      { path: '~/components/defaults', pathPrefix: false },
      { path: '~/components/landing', pathPrefix: false },
      { path: '~/components/cool', pathPrefix: false }
    ]
  },

  image: {
    domains: [
      'github.com',
      'avatars.githubusercontent.com',
      'images.unsplash.com'
    ]
  },

  app: {
    head: {
      title: 'MUT Tech Club',
      meta: [
        {
          name: 'description',
          content:
            'MUT Tech Club – A community of developers, innovators and tech enthusiasts at Murang’a University of Technology.'
        },
        {
          name: 'keywords',
          content:
            'MUT Tech Club, Murang’a University of Technology, tech community Kenya, student developers Kenya, programming club Kenya, open source Kenya, web development club, tech students MUT, software engineering community Kenya'
        },
        {
          name: 'theme-color',
          content: '#0f172a'
        }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.png'
        }
      ]
    }
  },

  nitro: {
    compressPublicAssets: true,

    prerender: {
      routes: [
        '/',
        '/about',
        '/events',
        '/resources',
        '/projects',
        '/join'
      ],
      crawlLinks: true,
      failOnError: false
    },

    routeRules: {
      '/': { prerender: true },

      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE'
        }
      }
    }
  },

  routeRules: {
    '/**': {
      headers: {
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
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