<template>
  <div class="p-4 space-y-12 max-w-5xl m-auto">

    <!-- About the Project Section -->
    <section class="space-y-4">
      <div class="space-y-4">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          Engineering the MuTech Vision
        </h1>
        
        <UPageCard 
          :spotlight="{ gradient: 'from-blue-400 via-purple-400 to-pink-400' }"
          class="mt-6"
        >
          <div class="space-y-4">
            <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              The <span class="font-semibold text-primary">MuTech Club website</span> was developed by a passionate team of <span class="font-semibold">core developers, contributors, and statistics specialists</span> who collaborated to create a modern, scalable platform that serves the entire MuTech community.
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div class="space-y-2">
                <h3 class="font-semibold text-primary flex items-center gap-2">
                  <UIcon name="i-heroicons-rocket-launch" class="w-5 h-5" />
                  Modern Technology Stack
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Built with Nuxt 3, Vue.js, and Tailwind CSS for a cutting-edge user experience
                </p>
              </div>

              <div class="space-y-2">
                <h3 class="font-semibold text-primary flex items-center gap-2">
                  <UIcon name="i-heroicons-users" class="w-5 h-5" />
                  Collaborative Effort
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Developed collaboratively by talented members across different specializations
                </p>
              </div>

              <div class="space-y-2">
                <h3 class="font-semibold text-primary flex items-center gap-2">
                  <UIcon name="i-heroicons-star" class="w-5 h-5" />
                  Community Focused
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Designed to showcase MuTech's mission and connect members with opportunities
                </p>
              </div>
            </div>

            <div class="pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
              <p class="text-sm text-gray-600 dark:text-gray-400 italic">
                Meet the talented individuals who brought this vision to life through their dedication, expertise, and commitment to excellence.
              </p>
            </div>
          </div>
        </UPageCard>
      </div>
    </section>

    <section>
      <h2 class="text-xl font-semibold mb-4">Core Developers</h2>

      <div v-if="pendingCoreDevelopers" class="text-center py-6">
        <UIcon name="i-lucide-loader-2" class="animate-spin text-2xl" />
        <p class="text-sm text-muted mt-2">Loading core developers...</p>
      </div>

      <div v-else-if="errorCoreDevelopers" class="text-center text-red-500 py-6">
        Failed to load core developers.
      </div>

      <div v-else class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        <UCard
          v-for="dev in coreDevelopersSafe"
          :key="dev.id"
          class="p-4 flex gap-4 items-center"
        >
          <UAvatar
            size="lg"
            :src="dev.profile_picture_url"
            :alt="dev.name"
          />

          <div>
            <p class="font-semibold">{{ dev.name }}</p>
            <p class="text-sm text-muted">{{ dev.course }}</p>
            <p class="text-xs text-muted">{{ dev.academic_year }}</p>
            <p class="text-xs text-primary-600">{{ dev.scope_display }}</p>
          </div>
        </UCard>
      </div>
    </section>

    <!-- ======================
         Contributors
    ======================= -->
    <section>
      <h2 class="text-xl font-semibold mb-4">Contributors</h2>

      <div v-if="pendingContributors" class="text-center py-6">
        <UIcon name="i-lucide-loader-2" class="animate-spin text-2xl" />
        <p class="text-sm text-muted mt-2">Loading contributors...</p>
      </div>

      <div v-else-if="errorContributors" class="text-center text-red-500 py-6">
        Failed to load contributors.
      </div>

      <div v-else class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        <UCard
          v-for="dev in contributorsSafe"
          :key="dev.id"
          class="p-4 flex gap-4 items-center"
        >
          <UAvatar
            size="lg"
            :src="dev.profile_picture_url"
            :alt="dev.name"
          />

          <div>
            <p class="font-semibold">{{ dev.name }}</p>
            <p class="text-sm text-muted">{{ dev.course }}</p>
            <p class="text-xs text-muted">{{ dev.academic_year }}</p>
            <p class="text-xs text-primary-600">{{ dev.scope_display }}</p>
          </div>
        </UCard>
      </div>
    </section>

    <!-- ======================
         Statistics Team
    ======================= -->
    <section>
      <h3 class="text-lg font-semibold mb-4">Statistics Team</h3>

      <div v-if="pendingStatistics" class="text-center py-4">
        <UIcon name="i-lucide-loader-2" class="animate-spin text-xl" />
        <p class="text-sm text-muted mt-2">Loading statistics team...</p>
      </div>

      <div v-else-if="errorStatistics" class="text-center text-red-500 py-4">
        Failed to load statistics team.
      </div>

      <div v-else class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        <UCard
          v-for="dev in statisticsSafe"
          :key="dev.id"
          class="p-4 flex gap-4 items-center"
        >
          <UAvatar
            size="lg"
            :src="dev.profile_picture_url"
            :alt="dev.name"
          />

          <div>
            <p class="font-semibold">{{ dev.name }}</p>
            <p class="text-sm text-muted">{{ dev.course }}</p>
            <p class="text-xs text-muted">{{ dev.academic_year }}</p>
            <p class="text-xs text-primary-600">{{ dev.scope_display }}</p>
          </div>
        </UCard>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
interface Developer {
  id: string
  name: string
  profile_picture_url: string | null
  course: string
  academic_year: string
  scope_display: string
  is_active: boolean
}

interface StatsResponse {
  total: number
  active: number
  founders: number
  contributors: number
}

const endpoints = useEndpoints()

const { data: coreDevelopers, pending: pendingCoreDevelopers, error: errorCoreDevelopers } =
  await useFetch<any>(endpoints.engineering.coreDevelopers)

const { data: contributors, pending: pendingContributors, error: errorContributors } =
  await useFetch<any>(endpoints.engineering.contributors)

const { data: statistics, pending: pendingStatistics, error: errorStatistics } =
  await useFetch<any>(endpoints.engineering.statistics)

/* Safe fallbacks */
const coreDevelopersSafe = computed(() => coreDevelopers.value?.results ?? [])
const contributorsSafe = computed(() => contributors.value?.results ?? [])
const statisticsSafe = computed(() => statistics.value?.results ?? [])
</script>