// nuxt.config.ts
// ─────────────────────────────────────────────────────────────────────────────
// Site constants — update these when deploying to production
// ─────────────────────────────────────────────────────────────────────────────
const SITE_URL  = 'https://techclub.mut.ac.ke'
const SITE_NAME = 'MUT Tech Club'
const SITE_DESC = "Official tech community of Murang'a University of Technology — developers, designers, innovators & student tech enthusiasts building the future of Kenya's Silicon Savannah."
const THEME_COLOR = '#0f172a'
const OG_IMAGE    = `${SITE_URL}/og/default-og.png`
const FAVICON     = '/favicon.ico'

// ─────────────────────────────────────────────────────────────────────────────
// SEO keywords — grouped by intent for better relevance signals
// ─────────────────────────────────────────────────────────────────────────────
const KEYWORDS = [
  // Brand
  'MUT Tech Club', 'Murang\'a University of Technology', 'MUT techclub',
  'mut.ac.ke tech community', 'MUT students club',

  // Community & Events
  'student tech community Kenya', 'university coding club Kenya',
  'hackathon Murang\'a', 'tech events Kenya 2025', 'open source Kenya students',
  'campus developer community', 'Kenya student innovation hub',

  // Skills & Learning
  'programming club Kenya', 'web development students Kenya',
  'mobile app development students', 'AI club university Kenya',
  'machine learning students Kenya', 'data science club Kenya',
  'cybersecurity club Kenya', 'cloud computing students',
  'DevOps students Kenya', 'UI UX design students', 'game development Kenya',
  'robotics club Kenya', 'IoT club Kenya', 'blockchain Kenya students',
  'software engineering community Kenya', 'coding bootcamp Kenya',

  // Opportunities
  'internship opportunities Kenya tech', 'tech mentorship Kenya students',
  'career prep software engineering Kenya', 'tech networking Kenya',
  'startup incubator university Kenya', 'innovation hub Kenya university',

  // Location / Geo
  'Murang\'a County tech', 'Central Kenya technology students',
  'Silicon Savannah Kenya', 'Nairobi tech ecosystem students',
  'East Africa tech community', 'African student developers',

  // Actions
  'join tech club Kenya', 'tech workshops Kenya', 'coding competitions Kenya',
  'open source projects Kenya students', 'build apps Kenya students',
].join(', ')

// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD structured data (StudentOrganization + WebSite schema)
// ─────────────────────────────────────────────────────────────────────────────
const SCHEMA_ORG = [
  {
    '@context': 'https://schema.org',
    '@type': 'StudentOrganization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/icons/icon-512.png`, width: 512, height: 512 },
    image: OG_IMAGE,
    description: SITE_DESC,
    email: 'techclub@mut.ac.ke',
    inLanguage: 'en-KE',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Murang\'a',
      addressRegion: 'Murang\'a County',
      addressCountry: 'KE',
    },
    memberOf: {
      '@type': 'CollegeOrUniversity',
      name: "Murang'a University of Technology",
      url: 'https://www.mut.ac.ke',
    },
    sameAs: [
      'https://github.com/mut-techclub',
      'https://twitter.com/muttechclub',
      'https://linkedin.com/company/mut-tech-club',
      'https://instagram.com/muttechclub',
    ],
    potentialAction: {
      '@type': 'JoinAction',
      name: 'Join MUT Tech Club',
      target: `${SITE_URL}/join`,
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESC,
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-KE',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  future: {
    compatibilityVersion: 4,
  },

  // ── Site config (used by @nuxtjs/sitemap, @nuxtjs/robots, nuxt-seo-utils) ──
  // This is the single source of truth for your domain/name across SEO modules.
  site: {
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESC,
    defaultLocale: 'en',
    indexable: true,
  },

  // ── Modules ────────────────────────────────────────────────────────────────
  // NOTE: @nuxtjs/sitemap MUST come before @nuxt/content (if you add it later)
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/content',
    '@vueuse/nuxt',
    '@nuxtjs/sitemap',   // ← before @nuxt/content (module load order matters)
    '@nuxtjs/robots',
    'motion-v/nuxt',
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt',
  ],

  build: {
    transpile: ['vue-countup-v3'],
  },

  runtimeConfig: {
    apiSecret: process.env.API_SECRET,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || SITE_URL,
      siteName: SITE_NAME,
      siteDescription: SITE_DESC,
      socialImage: OG_IMAGE,
      allowedOrigins: [
        'https://techclub.mut.ac.ke',
        'https://mut-tech-club.vercel.app',
        'http://localhost:3000',
        'http://localhost:3001',
      ],
    },
  },

  vite: {
    server: {
      allowedHosts: [
        'techclub.mut.ac.ke',
        'mut-tech-club.vercel.app',
        'localhost',
        '*.trycloudflare.com',
      ],
    },
    vue: {
      features: {
        optionsAPI: false, // tree-shake Options API from bundle
      },
    },
  },

  experimental: {
    typedPages: true,
    viewTransition: true,
    renderJsonPayloads: true,
    payloadExtraction: true,
  },

  // ── Color Mode ────────────────────────────────────────────────────────────
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'mut-techclub-color-mode',
  },

  // ── Pinia ─────────────────────────────────────────────────────────────────
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

  // ── Components ────────────────────────────────────────────────────────────
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

  // ── Image ─────────────────────────────────────────────────────────────────
  image: {
    formats: ['avif', 'webp'],
    quality: 80,
    screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
    domains: [
      'github.com',
      'avatars.githubusercontent.com',
      'images.unsplash.com',
    ],
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },

  // ── App head ──────────────────────────────────────────────────────────────
  app: {
    head: {
      titleTemplate: `%s | ${SITE_NAME}`,
      title: `${SITE_NAME} — Student Tech Community Kenya`,
      htmlAttrs: { lang: 'en', dir: 'ltr' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },

        // ── Core SEO ────────────────────────────────────────────────────────
        { name: 'description', content: SITE_DESC },
        { name: 'keywords', content: KEYWORDS },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'googlebot', content: 'index, follow, max-image-preview:large' },
        { name: 'bingbot', content: 'index, follow' },

        // ── Geo targeting ───────────────────────────────────────────────────
        { name: 'geo.region', content: 'KE-13' },           // Murang'a County
        { name: 'geo.placename', content: "Murang'a, Kenya" },
        { name: 'geo.position', content: '-0.7232;37.1517' },
        { name: 'ICBM', content: '-0.7232, 37.1517' },

        // ── Open Graph ──────────────────────────────────────────────────────
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: SITE_NAME },
        { property: 'og:url', content: SITE_URL },
        { property: 'og:title', content: `${SITE_NAME} — Student Tech Community Kenya` },
        { property: 'og:description', content: SITE_DESC },
        { property: 'og:image', content: OG_IMAGE },
        { property: 'og:image:secure_url', content: OG_IMAGE },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: `${SITE_NAME} — Connecting student developers in Kenya` },
        { property: 'og:locale', content: 'en_KE' },

        // ── Twitter / X Card ────────────────────────────────────────────────
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@muttechclub' },
        { name: 'twitter:creator', content: '@muttechclub' },
        { name: 'twitter:title', content: `${SITE_NAME} — Student Tech Community Kenya` },
        { name: 'twitter:description', content: SITE_DESC },
        { name: 'twitter:image', content: OG_IMAGE },
        { name: 'twitter:image:alt', content: `${SITE_NAME} community banner` },

        // ── Theme & mobile ──────────────────────────────────────────────────
        { name: 'theme-color', content: THEME_COLOR },
        { name: 'color-scheme', content: 'dark light' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-title', content: 'MUT Tech' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'format-detection', content: 'telephone=no' },

        // ── Authorship ──────────────────────────────────────────────────────
        { name: 'author', content: `${SITE_NAME} Team` },
        { name: 'publisher', content: SITE_NAME },
        { name: 'language', content: 'English' },
        { name: 'rating', content: 'general' },
        { name: 'revisit-after', content: '7 days' },
      ],
      link: [
        // Favicons
        { rel: 'icon', type: 'image/x-icon', href: FAVICON },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },

        // Canonical
        { rel: 'canonical', href: SITE_URL },

        // Manifest — managed by @vite-pwa/nuxt; this is a fallback reference
        { rel: 'manifest', href: '/manifest.webmanifest' },

        // Sitemap reference (search-engine hint)
        { rel: 'sitemap', type: 'application/xml', title: 'Sitemap', href: '/sitemap.xml' },

        // Preconnect / DNS prefetch for performance
        { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://avatars.githubusercontent.com', crossorigin: '' },
        { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://avatars.githubusercontent.com' },

        // Alternate hreflang
        { rel: 'alternate', href: SITE_URL, hreflang: 'en-KE' },
        { rel: 'alternate', href: SITE_URL, hreflang: 'x-default' },
      ],
      script: [
        // JSON-LD structured data (StudentOrganization + WebSite)
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(SCHEMA_ORG),
          // Use innerHTML (not children) to avoid SSR/hydration escaping issues
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  // ── Nitro ─────────────────────────────────────────────────────────────────
  nitro: {
    compressPublicAssets: { gzip: true, brotli: true },

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
        '/sitemap.xml',    // ← prerender sitemap for zero-latency delivery
      ],
      crawlLinks: true,
      failOnError: false,
    },

    routeRules: {
      // Static pages — prerender once
      '/': { prerender: true },
      '/about': { prerender: true },
      '/join': { prerender: true },
      '/contact': { prerender: true },
      '/engineering': { prerender: true },

      // Content pages — SWR (stale-while-revalidate)
      '/events/**':    { ssr: true, swr: 3600,  headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' } },
      '/projects/**':  { ssr: true, swr: 3600,  headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' } },
      '/resources/**': { ssr: true, swr: 7200,  headers: { 'Cache-Control': 'public, max-age=7200, stale-while-revalidate=43200' } },
      '/gallery/**':   { ssr: true, swr: 300,   headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600' } },
      '/members/**':   { ssr: true, swr: 86400, headers: { 'Cache-Control': 'public, max-age=86400' } },
      '/community/**': { ssr: true, swr: 1800,  headers: { 'Cache-Control': 'public, max-age=1800, stale-while-revalidate=7200' } },

      // API routes
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': SITE_URL,
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      },

      // Security headers (applied globally, then overridden per route above)
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

  // ── Robots ────────────────────────────────────────────────────────────────
  // @nuxtjs/robots reads `site.url` from the site config block above
  robots: {
    groups: [
      {
        userAgent: ['*'],
        disallow: ['/api/', '/account', '/admin', '/_nuxt/', '/_ipx/'],
        allow: [
          '/',
          '/about',
          '/events/',
          '/projects/',
          '/resources/',
          '/gallery/',
          '/community/',
          '/engineering/',
          '/join',
          '/contact',
          '/members/',
        ],
      },
    ],
    sitemap: [`${SITE_URL}/sitemap.xml`],
  },

  // ── Sitemap ───────────────────────────────────────────────────────────────
  // v7/v8 API: `site.url` is the canonical host; no `siteUrl` key needed here.
  // `zeroRuntime: true` pregenerates at build time — ideal for static/Vercel.
  // For a CMS-driven site remove zeroRuntime and use sources/API endpoint instead.
  sitemap: {
    // ── Static routes (always include) ────────────────────────────────────
    urls: [
      { loc: '/',            changefreq: 'daily',   priority: 1.0 },
      { loc: '/about',       changefreq: 'monthly',  priority: 0.8 },
      { loc: '/events',      changefreq: 'daily',   priority: 0.9 },
      { loc: '/projects',    changefreq: 'weekly',  priority: 0.9 },
      { loc: '/resources',   changefreq: 'weekly',  priority: 0.8 },
      { loc: '/join',        changefreq: 'monthly',  priority: 0.8 },
      { loc: '/community',   changefreq: 'weekly',  priority: 0.7 },
      { loc: '/contact',     changefreq: 'yearly',  priority: 0.6 },
      { loc: '/gallery',     changefreq: 'weekly',  priority: 0.7 },
      { loc: '/engineering', changefreq: 'weekly',  priority: 0.7 },
    ],

    // ── Dynamic routes via API endpoint ───────────────────────────────────
    // Create `server/api/_sitemap-urls.ts` that returns SitemapUrl[]
    // The module will call it automatically at build/runtime.
    // sources: ['/api/_sitemap-urls'],

    // ── Exclusions ────────────────────────────────────────────────────────
    exclude: [
      '/account',
      '/admin/**',
      '/api/**',
      '/_nuxt/**',
      '/_ipx/**',
    ],

    defaults: {
      changefreq: 'weekly',
      priority: 0.7,
      // lastmod is set per-URL above or auto-injected by the module
    },

    // Zero-runtime: generate at build time (fastest delivery, Vercel-friendly)
    // Set to false + add `sources` array if you have a headless CMS
    zeroRuntime: false, // keep false while you have dynamic sources; flip to true for pure static

    // Cache for 10 min on runtime (default SWR)
    cacheMaxAgeSeconds: 600,

    // Auto-detect routes from pages/ directory
    autoLastmod: true,
    discoverImages: true,
  },

  // ── PWA ───────────────────────────────────────────────────────────────────
  // @vite-pwa/nuxt v0.10+ — manifest is auto-served as /manifest.webmanifest
  pwa: {
    registerType: 'autoUpdate',
    pwaAssets: false, // generate icons manually for full control

    manifest: {
      name: SITE_NAME,
      short_name: 'MUT Tech',
      description: SITE_DESC,
      theme_color: THEME_COLOR,
      background_color: '#0f172a',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      orientation: 'portrait-primary',
      lang: 'en-KE',
      categories: ['education', 'technology', 'community'],
      dir: 'ltr',
      prefer_related_applications: false,

      icons: [
        {
          src: '/icons/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icons/icon-192-maskable.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icons/icon-512-maskable.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],

      // App shortcuts (Android/Desktop)
      shortcuts: [
        {
          name: 'Events',
          short_name: 'Events',
          description: 'Upcoming tech events',
          url: '/events',
          icons: [{ src: '/icons/shortcut-events.png', sizes: '96x96', type: 'image/png' }],
        },
        {
          name: 'Projects',
          short_name: 'Projects',
          description: 'Student projects',
          url: '/projects',
          icons: [{ src: '/icons/shortcut-projects.png', sizes: '96x96', type: 'image/png' }],
        },
        {
          name: 'Join',
          short_name: 'Join',
          description: 'Become a member',
          url: '/join',
          icons: [{ src: '/icons/shortcut-join.png', sizes: '96x96', type: 'image/png' }],
        },
      ],

      // Screenshots for Play Store / Edge install UI
      screenshots: [
        {
          src: '/screenshots/mobile-home.png',
          sizes: '1080x1920',
          type: 'image/png',
          platform: 'narrow',
          label: 'Home screen on mobile',
        },
        {
          src: '/screenshots/desktop-home.png',
          sizes: '1920x1080',
          type: 'image/png',
          platform: 'wide',
          label: 'Home screen on desktop',
        },
      ],
    },

    workbox: {
      // Navigate fallback for offline SPA-style navigation
      navigateFallback: '/',
      navigateFallbackDenylist: [/^\/api\//, /^\/admin\//],

      // Precache built assets
      globPatterns: ['**/*.{js,css,html,woff2,ico,webmanifest}'],
      globIgnores: ['**/node_modules/**', '**/sw.js'],

      // Runtime caching strategies
      runtimeCaching: [
        // Google Fonts — long-lived cache
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-stylesheets',
            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-webfonts',
            cacheableResponse: { statuses: [0, 200] },
            expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
          },
        },
        // GitHub avatars — stale-while-revalidate
        {
          urlPattern: /^https:\/\/avatars\.githubusercontent\.com\/.*/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'github-avatars',
            expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
          },
        },
        // Unsplash images
        {
          urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'unsplash-images',
            cacheableResponse: { statuses: [0, 200] },
            expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
          },
        },
        // API routes — network-first with fallback (no stale data for API)
        {
          urlPattern: /^https:\/\/techclub\.mut\.ac\.ke\/api\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 5,
            expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
          },
        },
        // All other images — cache first
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'static-images',
            expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
          },
        },
      ],
    },

    // Inject meta tags into <head> automatically
    injectManifest: { injectionPoint: undefined }, // only needed if using injectManifest strategy
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600, // check for SW updates every hour
    },
    devOptions: {
      enabled: false, // keep disabled in dev — prevents SW interfering with HMR
      type: 'module',
    },
  },

  // ── ESLint ────────────────────────────────────────────────────────────────
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
      },
    },
  },

  // ── Content ───────────────────────────────────────────────────────────────
  content: {
    highlight: {
      theme: 'github-dark',
      preload: ['javascript', 'typescript', 'python', 'vue', 'html', 'css', 'json', 'bash', 'shell'],
    },
  },
})