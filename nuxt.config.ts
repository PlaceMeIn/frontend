// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },

  // Core modules (keep only framework modules here)
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/content',
    '@vueuse/nuxt',
    '@nuxtjs/sitemap',
    'motion-v/nuxt',
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt',        // ✅ PWA module – keep this
  ],

  build: {
    transpile: ['vue-countup-v3'],
  },

  runtimeConfig: {
    apiSecret: process.env.API_SECRET,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://mutech-club.vercel.app',
      siteName: 'MUT Tech Club',
      siteDescription: 'Official tech community of Murang\'a University of Technology – developers, innovation, projects, and student tech community in Kenya.',
      socialImage: '/og/default-og.png',
      allowedOrigins: [
        'https://techclub.mut.ac.ke',
        'https://mut-tech-club.vercel.app',
        'http://localhost:3000',
        'http://localhost:3001',
        'https://app.tera-in.top',
      ],
    },
  },

  vite: {
    server: {
      allowedHosts: [
        'app.tera-in.top',
        'localhost',
        'mutech-club.vercel.app',
        '*.trycloudflare.com',
      ],
    },
    vue: {
      features: {
        optionsAPI: false,    // Reduces bundle size by disabling Options API
      },
    },
  },

  experimental: {
    typedPages: true,         // Enables full type safety for your routes
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'mut-techclub-color-mode',
  },

  piniaPluginPersistedstate: {
    storage: 'cookies',
    cookieOptions: {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    },
  },

  devtools: {
    enabled: process.env.NODE_ENV !== 'production',
  },

  css: ['~/assets/css/main.css'],

  components: {
    global: true,
    dirs: [
      { path: '~/components', pathPrefix: false },
      { path: '~/components/defaults', pathPrefix: false },
      { path: '~/components/landing', pathPrefix: false },
      { path: '~/components/standalone', pathPrefix: false },
      { path: '~/components/cool', pathPrefix: false },
      { path: '~/components/auth', pathPrefix: false },
    ],
  },

  image: {
    domains: [
      'github.com',
      'vercel.com',
      'avatars.githubusercontent.com',
      'images.unsplash.com',
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
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
          content: 'MUT Tech Club – A community of developers, innovators and tech enthusiasts at Murang\'a University of Technology. Join Kenya\'s premier student tech community.',
        },
        {
          name: 'keywords',
          content: 'MUT Tech Club, Murang\'a University of Technology, tech community Kenya, student developers Kenya, programming club Kenya, open source Kenya, web development club, tech students MUT, software engineering community Kenya, coding bootcamp Kenya, hackathon Kenya, tech events MUT, AI club Kenya, cybersecurity club, mobile dev Kenya, cloud computing Kenya, devops students, UI/UX Kenya, game dev Kenya, data science club, robotics Kenya, IoT students, startup incubator Kenya, tech mentorship, career prep Kenya, internship opportunities, tech networking, innovation hub Kenya',
        },

        // Robots & Crawling
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'googlebot', content: 'index, follow, max-image-preview:large' },
        { name: 'bingbot', content: 'index, follow' },

        // Open Graph / Social Media
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'MUT Tech Club' },
        { property: 'og:title', content: 'MUT Tech Club - Student Tech Community Kenya' },
        { property: 'og:description', content: 'Join MUT Tech Club: coding workshops, hackathons, open source, and tech networking. Kenya\'s leading university tech community.' },
        { property: 'og:image', content: '/og/default-og.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'MUT Tech Club - Connecting student developers in Kenya' },
        { property: 'og:url', content: 'https://mutech-club.vercel.app/' },
        { property: 'og:locale', content: 'en_KE' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@muttechclub' },
        { name: 'twitter:title', content: 'MUT Tech Club - Student Tech Community' },
        { name: 'twitter:description', content: 'Join Murang\'a University Tech Club for coding, innovation, and community.' },
        { name: 'twitter:image', content: '/og/default-og.png' },

        // Theme & Appearance
        { name: 'color-scheme', content: 'dark light' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'MUT Tech' },

        // Author & Verification
        { name: 'author', content: 'MUT Tech Club Team' },
        // Remove dynamic copyright from meta to prevent hydration mismatches
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'canonical', href: 'https://techclub.mut.ac.ke' }, // Updated to your production domain
        { rel: 'sitemap', type: 'application/xml', title: 'Sitemap', href: '/sitemap.xml' },
      ],
      // Structured data moved to a plugin (see below)
    },
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
        '/join',
        '/community',
        '/contact',
        '/gallery',
        '/engineering',
        '/account',
      ],
      crawlLinks: true,
      failOnError: false,
    },

    routeRules: {
      '/': { prerender: true },

      // Dynamic routes with proper indexing
      '/events/**': {
        ssr: true,
        swr: 3600,
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      },
      '/projects/**': {
        ssr: true,
        swr: 3600,
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      },
      '/resources/**': {
        ssr: true,
        swr: 7200,
        headers: {
          'Cache-Control': 'public, max-age=7200, stale-while-revalidate=43200',
        },
      },
      '/gallery/**': {
        ssr: true,
        swr: 300,
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
        },
      },
      '/members/**': {
        ssr: true,
        swr: 86400,
        headers: {
          'Cache-Control': 'public, max-age=86400',
        },
      },

      // API routes
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': 'https://mutech-club.vercel.app',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      },

      // Dynamic sitemap
      '/__sitemap/**': {
        headers: {
          'Content-Type': 'application/xml',
        },
      },

      // Security headers for all routes
      '/**': {
        headers: {
          'X-Frame-Options': 'SAMEORIGIN',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
        },
      },
    },
  },

  // ✅ PWA Configuration (fixed)
  pwa: {
    registerType: 'autoUpdate',
    pwaAssets: false,                  // Disable automatic asset generation
    manifest: {
      name: 'MUT Tech Club',
      short_name: 'MUT Tech',
      description: 'Official tech community of Murang\'a University of Technology',
      theme_color: '#0f172a',
      background_color: '#0f172a',
      display: 'standalone',
      scope: '/',
      start_url: '/account',
      orientation: 'portrait',
      categories: ['education', 'technology', 'community'],
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable',
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
      screenshots: [
        {
          src: '/screenshot-mobile.png',
          sizes: '1080x1920',
          type: 'image/png',
          platform: 'android',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,webp}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
          },
        },
        {
          urlPattern: /^https:\/\/avatars\.githubusercontent\.com\/.*/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'github-avatars',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
          },
        },
      ],
    },
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
      },
    },
  },

  sitemap: {
    enabled: true,
    urls: async () => {
      const dynamicUrls = [
        // Add logic to fetch event slugs, project slugs, etc.
      ];
      return [
        '/',
        '/about',
        '/events',
        '/resources',
        '/projects',
        '/join',
        '/community',
        '/contact',
        '/gallery',
        '/engineering',
        ...dynamicUrls,
      ];
    },
    defaults: {
      changefreq: 'weekly',
      priority: 0.8,
      // Remove dynamic lastmod from static config
      // lastmod: new Date().toISOString(),
    },
  },
});