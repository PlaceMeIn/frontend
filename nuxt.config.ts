// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },

  // ========== CORE MODULES ==========
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt', '@nuxt/content', '@vueuse/nuxt', '@nuxtjs/sitemap', 'motion-v/nuxt', '@nuxtjs/color-mode',
     '@vite-pwa/nuxt', // ✅ Add OG image module to handle signing
     'nuxt-og-image'],

  // ========== RUNTIME CONFIG (env variables) ==========
  runtimeConfig: {
    // Server-side secrets
    apiSecret: process.env.API_SECRET,
    ogImageSecret: process.env.NUXT_OG_IMAGE_SECRET, // Set this!
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

  // ========== OG IMAGE CONFIGURATION (fixes security warning) ==========
  ogImage: {
    // Enable zero-runtime mode if you don't need dynamic generation
    // zeroRuntime: true,
    // Or provide a signing secret (recommended for dynamic images)
    secret: process.env.NUXT_OG_IMAGE_SECRET,
  },

  // ========== VITE OPTIMIZATION (fixes unresolvable deps) ==========
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
        optionsAPI: false,    // Smaller bundle
      },
    },
    // Remove problematic entries from optimizeDeps.include
    optimizeDeps: {
      include: [],            // Let Vite auto-detect
      exclude: [],            // No forced exclusions
    },
    // Ensure dependencies are properly resolved
    resolve: {
      dedupe: ['vue', 'vue-router', '@nuxtjs/mdc'],
    },
  },

  // ========== NUXT 4 ROUTING (trailing slashes) ==========
  router: {
    options: {
      strict: false,          // Accept both /about and /about/
    },
  },

  // ========== EXPERIMENTAL FEATURES ==========
  experimental: {
    typedPages: true,         // Type-safe routes
    componentIslands: true,   // Optional: improves performance
  },

  // ========== COLOR MODE ==========
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'mut-techclub-color-mode',
  },

  // ========== PERSISTED STATE (cookies) ==========
  piniaPluginPersistedstate: {
    storage: 'cookies',
    cookieOptions: {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    },
  },

  // ========== DEVTOOLS ==========
  devtools: {
    enabled: process.env.NODE_ENV !== 'production',
  },

  // ========== CSS ==========
  css: ['~/assets/css/main.css'],

  // ========== COMPONENTS ==========
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

  // ========== IMAGE OPTIMIZATION ==========
  image: {
    domains: [
      'github.com',
      'vercel.com',
      'avatars.githubusercontent.com',
      'images.unsplash.com',
    ],
    remotePatterns: [
      { protocol: 'http', hostname: '**' },
      { protocol: 'https', hostname: '**' },
    ],
  },

  // ========== APP HEAD (SEO) ==========
  app: {
    head: {
      titleTemplate: '%s | MUT Tech Club',
      title: 'MUT Tech Club',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'MUT Tech Club – A community of developers, innovators and tech enthusiasts at Murang\'a University of Technology. Join Kenya\'s premier student tech community.' },
        { name: 'keywords', content: 'MUT Tech Club, Murang\'a University of Technology, tech community Kenya, student developers Kenya, programming club Kenya, open source Kenya, web development club, tech students MUT, software engineering community Kenya, coding bootcamp Kenya, hackathon Kenya, tech events MUT, AI club Kenya, cybersecurity club, mobile dev Kenya, cloud computing Kenya, devops students, UI/UX Kenya, game dev Kenya, data science club, robotics Kenya, IoT students, startup incubator Kenya, tech mentorship, career prep Kenya, internship opportunities, tech networking, innovation hub Kenya' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'googlebot', content: 'index, follow, max-image-preview:large' },
        { name: 'bingbot', content: 'index, follow' },
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
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@muttechclub' },
        { name: 'twitter:title', content: 'MUT Tech Club - Student Tech Community' },
        { name: 'twitter:description', content: 'Join Murang\'a University Tech Club for coding, innovation, and community.' },
        { name: 'twitter:image', content: '/og/default-og.png' },
        { name: 'color-scheme', content: 'dark light' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'MUT Tech' },
        { name: 'author', content: 'MUT Tech Club Team' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        // Do NOT manually add manifest.json – PWA module handles it
        { rel: 'canonical', href: 'https://techclub.mut.ac.ke' },
        { rel: 'sitemap', type: 'application/xml', title: 'Sitemap', href: '/sitemap.xml' },
      ],
    },
  },

  // ========== NITRO (SERVER ENGINE) ==========
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
        // Remove dynamic or auth-protected routes like '/account'
      ],
      crawlLinks: false,            // Prevent infinite loops
      failOnError: true,            // Detect missing files during build
      ignore: ['/account/**', '/api/**', '/_ipx/**', '/__sitemap/**'],
    },
    routeRules: {
      '/': { prerender: true },
      '/events/**': { ssr: true, swr: 3600 },
      '/projects/**': { ssr: true, swr: 3600 },
      '/resources/**': { ssr: true, swr: 7200 },
      '/gallery/**': { ssr: true, swr: 300 },
      '/members/**': { ssr: true, swr: 86400 },
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': 'https://mutech-club.vercel.app',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      },
      '/__sitemap/**': { headers: { 'Content-Type': 'application/xml' } },
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

  // ========== PWA CONFIGURATION (fixes manifest generation) ==========
  pwa: {
    registerType: 'autoUpdate',
    // Enable automatic asset generation (no need to manually provide icons)
    pwaAssets: {
      enabled: true,
      include: ['icon-192.png', 'icon-512.png'],
      // Optionally generate from a source image
      // source: 'public/logo.png',
    },
    manifest: {
      name: 'MUT Tech Club',
      short_name: 'MUT Tech',
      description: 'Official tech community of Murang\'a University of Technology',
      theme_color: '#0f172a',
      background_color: '#0f172a',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      orientation: 'portrait',
      categories: ['education', 'technology', 'community'],
      // Icons are auto-generated by pwaAssets – no need to define here
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,webp,json}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts',
            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
          },
        },
        {
          urlPattern: /^https:\/\/avatars\.githubusercontent\.com\/.*/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'github-avatars',
            expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
          },
        },
      ],
    },
  },

  // ========== SITEMAP CONFIGURATION (error-free generation) ==========
  sitemap: {
    enabled: true,
    // Disable XSL to avoid unnecessary requests
    xsl: false,
    defaults: {
      changefreq: 'weekly',
      priority: 0.8,
      // lastmod is automatically added from file dates or can be omitted
    },
    // Fetch dynamic URLs safely (avoid prerender errors)
    urls: async () => {
      let eventSlugs: string[] = [];
      let projectSlugs: string[] = [];
      try {
        // Example: fetch from your API – replace with actual endpoints
        // const { data: events } = await $fetch('/api/events');
        // eventSlugs = events.map(e => `/events/${e.slug}`);
        // const { data: projects } = await $fetch('/api/projects');
        // projectSlugs = projects.map(p => `/projects/${p.slug}`);
      } catch (e) {
        console.warn('Could not fetch dynamic URLs for sitemap – static URLs only');
      }
      return [
        '/',
        '/about/',
        '/events/',
        '/resources/',
        '/projects/',
        '/join/',
        '/community/',
        '/contact/',
        '/gallery/',
        '/engineering/',
        ...eventSlugs.map(slug => slug + '/'),
        ...projectSlugs.map(slug => slug + '/'),
      ];
    },
    // Alternative: use sources array if you have an endpoint that returns URLs
    // sources: ['/api/sitemap-urls'],
  },

  // ========== ESLINT ==========
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
      },
    },
  },

  // ========== BUILD TRANSPILATION ==========
  build: {
    transpile: ['vue-countup-v3'],
  },
});