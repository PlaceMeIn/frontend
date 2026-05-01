<template>
  <section class="min-h-screen bg-gray-50 dark:bg-neutral-950">
    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">

      <!-- ── Hero ── -->
      <div class="mb-14">
        <div class="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 mb-4">
          <UIcon name="i-lucide-code-2" class="h-3.5 w-3.5" />
          MUT Tech Club
        </div>
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white mb-4">
          Engineering the<br />
          <span class="text-primary-500">MuTech Vision</span>
        </h1>

        <div class="grid gap-6 lg:grid-cols-[1fr_320px]">
          <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400 max-w-2xl">
            The MuTech Club website was built by a passionate team of core developers who collaborated to create a modern, scalable platform. Powered by <span class="font-semibold text-gray-700 dark:text-gray-200">Nuxt 3</span>, <span class="font-semibold text-gray-700 dark:text-gray-200">Django</span>, and <span class="font-semibold text-gray-700 dark:text-gray-200">PostgreSQL</span> — designed to serve and connect the entire MuTech community.
          </p>

          <!-- Quick tech pills -->
          <div class="flex flex-wrap items-start gap-2 lg:justify-end">
            <span v-for="tech in techStack" :key="tech.label"
              class="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-300">
              <UIcon :name="tech.icon" class="h-3.5 w-3.5 text-primary-400" />
              {{ tech.label }}
            </span>
          </div>
        </div>

        <!-- 3 pillars -->
        <div class="mt-8 grid gap-4 sm:grid-cols-3">
          <div v-for="pillar in pillars" :key="pillar.title"
            class="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-primary-200 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-primary-800">
            <div class="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/20">
              <UIcon :name="pillar.icon" class="h-5 w-5 text-primary-500" />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">{{ pillar.title }}</h3>
            <p class="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{{ pillar.description }}</p>
          </div>
        </div>
      </div>

      <!-- ── Statistics Banner ── -->
      <div class="mb-14">
        <div class="flex items-center gap-3 mb-5">
          <div class="h-px flex-1 bg-gray-200 dark:bg-neutral-800" />
          <span class="text-xs font-semibold uppercase tracking-widest text-gray-400">Team Statistics</span>
          <div class="h-px flex-1 bg-gray-200 dark:bg-neutral-800" />
        </div>

        <div v-if="pendingStatistics" class="flex justify-center py-8">
          <UIcon name="i-lucide-loader-2" class="h-6 w-6 animate-spin text-primary-400" />
        </div>

        <template v-else>
          <!-- Stat cards row -->
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
            <div v-for="stat in statCards" :key="stat.label"
              class="rounded-2xl border bg-white p-5 shadow-sm dark:bg-neutral-900 dark:border-neutral-800"
              :class="stat.borderColor">
              <p class="text-3xl font-bold" :class="stat.color">{{ stat.value }}</p>
              <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">{{ stat.label }}</p>
            </div>
          </div>

          <!-- By course + by year -->
          <div class="grid gap-4 md:grid-cols-2">
            <!-- By Course -->
            <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="mb-4 flex items-center gap-2">
                <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <UIcon name="i-lucide-graduation-cap" class="h-4 w-4 text-blue-500" />
                </div>
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white">By Course</h4>
              </div>
              <div class="space-y-3">
                <div v-for="item in statData.by_course" :key="item.course">
                  <div class="mb-1 flex items-center justify-between">
                    <span class="text-xs text-gray-600 dark:text-gray-400 truncate mr-3">{{ item.course ?? 'N/A' }}</span>
                    <span class="text-xs font-bold text-gray-900 dark:text-white shrink-0">{{ item.count }}</span>
                  </div>
                  <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800">
                    <div
                      class="h-full rounded-full bg-gradient-to-r from-primary-500 to-cyan-400 transition-all duration-700"
                      :style="{ width: `${(item.count / statData.total) * 100}%` }"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- By Academic Year -->
            <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="mb-4 flex items-center gap-2">
                <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-900/20">
                  <UIcon name="i-lucide-calendar" class="h-4 w-4 text-violet-500" />
                </div>
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white">By Academic Year</h4>
              </div>
              <div class="space-y-3">
                <div v-for="item in statData.by_academic_year" :key="item.academic_year">
                  <div class="mb-1 flex items-center justify-between">
                    <span class="text-xs text-gray-600 dark:text-gray-400 truncate mr-3">{{ item.academic_year ?? 'N/A' }}</span>
                    <span class="text-xs font-bold text-gray-900 dark:text-white shrink-0">{{ item.count }}</span>
                  </div>
                  <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800">
                    <div
                      class="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-400 transition-all duration-700"
                      :style="{ width: `${(item.count / statData.total) * 100}%` }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- ── Core Developers ── -->
      <div>
        <div class="flex items-center gap-3 mb-5">
          <div class="h-px flex-1 bg-gray-200 dark:bg-neutral-800" />
          <span class="text-xs font-semibold uppercase tracking-widest text-gray-400">Core Developers</span>
          <div class="h-px flex-1 bg-gray-200 dark:bg-neutral-800" />
        </div>

        <div v-if="pendingCoreDevelopers" class="flex flex-col items-center justify-center py-12 gap-2">
          <UIcon name="i-lucide-loader-2" class="h-6 w-6 animate-spin text-primary-400" />
          <p class="text-sm text-gray-400">Loading core developers...</p>
        </div>

        <div v-else-if="errorCoreDevelopers" class="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-500 dark:border-red-900/30 dark:bg-red-900/10">
          Failed to load core developers.
        </div>

        <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="dev in coreDevelopersSafe"
            :key="dev.id"
            class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary-200 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-primary-800"
          >
            <!-- Cover gradient -->
            <div class="relative h-24 overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-cyan-400  ">
              <div class="absolute inset-0 opacity-20"
                style="background-image: radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px); background-size: 25px 25px, 18px 18px;" />
              <!-- Scope badge -->
              <div class="absolute right-3 top-3 z-1">
                <span class="inline-flex items-center rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                  {{ dev.scope_display }}
                </span>
              </div>
            </div>

            <!-- Avatar overlapping cover -->
            <div class="px-5 pb-5 z-30">
              <div class="-mt-8 mb-3 flex items-end justify-between z-30">
                <UAvatar
                  :src="dev.profile_picture_url || undefined"
                  :alt="dev.name"
                  size="xl"
                  class="ring-4 ring-white shadow-lg dark:ring-neutral-900 z-30"
                />
                <!-- Social links -->
                <div class="flex gap-1 pb-1 z-30">
                  <a v-if="dev.social_links?.github" :href="dev.social_links.github" target="_blank" rel="noopener"
                    class="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition hover:border-primary-200 hover:text-primary-500 dark:border-neutral-700 dark:bg-neutral-800">
                    <UIcon name="i-lucide-github" class="h-3.5 w-3.5" />
                  </a>
                  <a v-if="dev.social_links?.linkedin" :href="dev.social_links.linkedin" target="_blank" rel="noopener"
                    class="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition hover:border-blue-200 hover:text-blue-500 dark:border-neutral-700 dark:bg-neutral-800">
                    <UIcon name="i-lucide-linkedin" class="h-3.5 w-3.5" />
                  </a>
                  <a v-if="dev.social_links?.portfolio" :href="dev.social_links.portfolio" target="_blank" rel="noopener"
                    class="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition hover:border-primary-200 hover:text-primary-500 dark:border-neutral-700 dark:bg-neutral-800">
                    <UIcon name="i-lucide-globe" class="h-3.5 w-3.5" />
                  </a>
                  <a v-if="dev.social_links?.twitter" :href="dev.social_links.twitter" target="_blank" rel="noopener"
                    class="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition hover:border-sky-200 hover:text-sky-500 dark:border-neutral-700 dark:bg-neutral-800">
                    <UIcon name="i-lucide-twitter" class="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              <div class="space-y-2">
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ dev.name }}</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ dev.course }} · {{ dev.academic_year }}</p>
                </div>

                <p v-if="dev.details" class="text-xs leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2">
                  {{ dev.details }}
                </p>

                <div v-if="dev.part_worked_on"
                  class="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-800/60">
                  <p class="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Worked on</p>
                  <p class="text-xs text-gray-600 dark:text-gray-300">{{ dev.part_worked_on }}</p>
                </div>

                <!-- Active dot -->
                <div class="flex items-center gap-1.5 pt-1">
                  <span :class="['h-1.5 w-1.5 rounded-full', dev.is_active ? 'bg-emerald-400' : 'bg-gray-300']" />
                  <span class="text-[10px] text-gray-400">{{ dev.is_active ? 'Active' : 'Inactive' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
interface Developer {
  id: string
  name: string
  profile_picture_url: string | null
  course: string
  academic_year: string
  scope_display: string
  details?: string
  part_worked_on?: string
  is_active: boolean
  social_links?: {
    portfolio?: string
    github?: string
    linkedin?: string
    twitter?: string
  }
}

const endpoints = useEndpoints()

const { data: coreDevelopers, pending: pendingCoreDevelopers, error: errorCoreDevelopers } =
  await useFetch<any>(endpoints.engineering.coreDevelopers)

const { data: statistics, pending: pendingStatistics, error: errorStatistics } =
  await useFetch<any>(endpoints.engineering.statistics)

const coreDevelopersSafe = computed<Developer[]>(() => coreDevelopers.value?.results ?? [])

// Use API stats or fallback to static
const statData = computed(() => statistics.value ?? {
  total: 5,
  active: 5,
  founders: 0,
  contributors: 2,
  by_course: [
    { course: 'Computer Science', count: 3 },
    { course: 'Machine Learning', count: 1 },
    { course: 'Public Administration and Governance', count: 1 },
  ],
  by_academic_year: [
    { academic_year: '2026, 3rd Year', count: 3 },
    { academic_year: '2026, 2nd Year (resit)', count: 1 },
    { academic_year: '4th Year', count: 1 },
  ],
})

const statCards = computed(() => [
  { label: 'Total Developers', value: statData.value.total, color: 'text-primary-500', borderColor: 'border-primary-100 dark:border-primary-900/30' },
  { label: 'Active', value: statData.value.active, color: 'text-emerald-500', borderColor: 'border-emerald-100 dark:border-emerald-900/30' },
  { label: 'Founders', value: statData.value.founders, color: 'text-violet-500', borderColor: 'border-violet-100 dark:border-violet-900/30' },
  { label: 'Contributors', value: statData.value.contributors, color: 'text-pink-500', borderColor: 'border-pink-100 dark:border-pink-900/30' },
])

const techStack = [
  { label: 'Nuxt 3', icon: 'i-lucide-layers' },
  { label: 'Vue.js', icon: 'i-lucide-component' },
  { label: 'Tailwind CSS', icon: 'i-lucide-paintbrush' },
  { label: 'Django', icon: 'i-lucide-server' },
  { label: 'PostgreSQL', icon: 'i-lucide-database' },
]

useSeoPage({
  title: `Engineering & Make | ${useAppConfig().site.title}`,
  description:
    "Discover the engineering behind the MuTech Club website. Built by passionate student developers using Nuxt 3, Django, and PostgreSQL to create a modern platform that connects our community. Learn about our core team, tech stack, and how we bring the MuTech vision to life online.",
})

const pillars = [
  {
    icon: 'i-lucide-rocket',
    title: 'Modern Stack',
    description: 'Built with Nuxt 3, Vue.js, and Tailwind CSS for a fast, cutting-edge experience.',
  },
  {
    icon: 'i-lucide-users',
    title: 'Collaborative',
    description: 'Developed by talented members across different specializations and academic years.',
  },
  {
    icon: 'i-lucide-star',
    title: 'Community First',
    description: 'Designed to showcase MuTech\'s mission and connect members with real opportunities.',
  },
]
</script>