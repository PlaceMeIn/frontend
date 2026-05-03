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
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt'
  ],

  build: {
    transpile: ['vue-countup-v3']
  },

  runtimeConfig: {
    apiSecret: process.env.API_SECRET,

    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://mutech-club.vercel.app',
      siteName: 'MUT Tech Club',
      siteDescription:
        'Official Murang’a University of Technology Tech Club – developers, innovation, projects, and student tech community in Kenya.',

      socialImage: '/og/default-og.png',

      allowedOrigins: [
        'https://techclub.mut.ac.ke',
        'https://mut-tech-club.vercel.app',
        'http://localhost:3000',
        'http://localhost:3001',
        'https://app.tera-in.top'
      ]
    }
  },

  vite: {
    server: {
      allowedHosts: ['app.tera-in.top', 'localhost', '*.trycloudflare.com']
    }
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'mut-techclub-color-mode'
  },

  css: ['~/assets/css/main.css'],

  image: {
    domains: [
      'github.com',
      'vercel.com',
      'avatars.githubusercontent.com',
      'images.unsplash.com'
    ],    
  },

  app: {
    head: {
      titleTemplate: '%s | MUT Tech Club',
      title: 'MUT Tech Club',

      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },

        // SEO Core
        {
          name: 'description',
          content:
            'Official tech community of Murang’a University of Technology – projects, events, innovation, student developers in Kenya.'
        },
        {
          name: 'keywords',
          content:
            'MUT Tech Club, Murang’a University of Technology, Kenya developers, student tech community, programming Kenya, software engineering students, open source Kenya, tech events MUT, web development Kenya, AI student projects Kenya'
        },

        // Robots
        { name: 'robots', content: 'index, follow, max-image-preview:large' },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'MUT Tech Club' },
        { property: 'og:image', content: '/og/default-og.jpeg' },

        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' }
      ],

      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://mutech-club.vercel.app' }
      ]
    }
  },

  nitro: {
    compressPublicAssets: true,

    prerender: {
      crawlLinks: true,

      routes: [
        '/',
        '/about',
        '/events',
        '/resources',
        '/projects',
        '/community',
        '/contact',
        '/engineering',
        '/gallery',
        '/join',

        // IMPORTANT: dynamic SEO entry points
        '/account',
        '/gallery/featured'
      ]
    },

    routeRules: {
      '/': { prerender: true },

      // Gallery is public + SEO friendly
      '/gallery/**': {
        swr: 60,
        headers: {
          'Cache-Control': 'public, max-age=3600'
        }
      },

      '/account': {
        ssr: true,
        index: false
      },

      '/account/**': {
        ssr: true,
        index: true,
        headers: {
          'Cache-Control': 'public, max-age=3600'
        }
      },
      '/event/**': {
        ssr: true,
        swr: 60,
        headers: { 'Cache-Control': 'public, max-age=3600' }
      },

      '/projects/**': {
        ssr: true,
        swr: 60,
        headers: { 'Cache-Control': 'public, max-age=3600' }
      },

      '/resources/**': {
        ssr: true,
        swr: 60,
        headers: { 'Cache-Control': 'public, max-age=3600' }
      },

      '/api/**': {
        cors: true
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

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'MUT Tech Club',
      short_name: 'MUT Tech',
      // theme_color: '#0f172a',
      start_url: '/account',
      display: 'standalone',
      icons: [
        {
          src: '/favicon.ico',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  }
})