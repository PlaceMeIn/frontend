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


    <!-- Core Developers Section -->
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
          class="p-4 flex flex-col gap-2"
        >
          <div class="flex gap-4 items-center">
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
          </div>
          <div class="mt-2">
            <p class="text-xs text-gray-700 dark:text-gray-300 mb-1" v-if="dev.details">{{ dev.details }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1" v-if="dev.part_worked_on"><span class="font-semibold">Worked on:</span> {{ dev.part_worked_on }}</p>
            <div class="flex flex-wrap gap-2 mt-1">
              <a v-if="dev.social_links?.portfolio" :href="dev.social_links.portfolio" target="_blank" rel="noopener" class="text-primary-600 hover:underline text-xs">Portfolio</a>
              <a v-if="dev.social_links?.github" :href="dev.social_links.github" target="_blank" rel="noopener" class="text-primary-600 hover:underline text-xs">GitHub</a>
              <a v-if="dev.social_links?.linkedin" :href="dev.social_links.linkedin" target="_blank" rel="noopener" class="text-primary-600 hover:underline text-xs">LinkedIn</a>
              <a v-if="dev.social_links?.twitter" :href="dev.social_links.twitter" target="_blank" rel="noopener" class="text-primary-600 hover:underline text-xs">Twitter</a>
            </div>
          </div>
        </UCard>
      </div>
    </section>


    <!-- Contributors Section (hide if error) -->
    <section v-if="!errorContributors">
      <h2 class="text-xl font-semibold mb-4">Contributors</h2>

      <div v-if="pendingContributors" class="text-center py-6">
        <UIcon name="i-lucide-loader-2" class="animate-spin text-2xl" />
        <p class="text-sm text-muted mt-2">Loading contributors...</p>
      </div>

      <div v-else class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        <UCard
          v-for="dev in contributorsSafe"
          :key="dev.id"
          class="p-4 flex flex-col gap-2"
        >
          <div class="flex gap-4 items-center">
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
          </div>
          <div class="mt-2">
            <p class="text-xs text-gray-700 dark:text-gray-300 mb-1" v-if="dev.details">{{ dev.details }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1" v-if="dev.part_worked_on"><span class="font-semibold">Worked on:</span> {{ dev.part_worked_on }}</p>
            <div class="flex flex-wrap gap-2 mt-1">
              <a v-if="dev.social_links?.portfolio" :href="dev.social_links.portfolio" target="_blank" rel="noopener" class="text-primary-600 hover:underline text-xs">Portfolio</a>
              <a v-if="dev.social_links?.github" :href="dev.social_links.github" target="_blank" rel="noopener" class="text-primary-600 hover:underline text-xs">GitHub</a>
              <a v-if="dev.social_links?.linkedin" :href="dev.social_links.linkedin" target="_blank" rel="noopener" class="text-primary-600 hover:underline text-xs">LinkedIn</a>
              <a v-if="dev.social_links?.twitter" :href="dev.social_links.twitter" target="_blank" rel="noopener" class="text-primary-600 hover:underline text-xs">Twitter</a>
            </div>
          </div>
        </UCard>
      </div>
    </section>


    <!-- ======================
         Statistics Section
    ======================= -->
    <section>
      <h3 class="text-lg font-semibold mb-4">Statistics</h3>

      <div v-if="pendingStatistics" class="text-center py-4">
        <UIcon name="i-lucide-loader-2" class="animate-spin text-xl" />
        <p class="text-sm text-muted mt-2">Loading statistics team...</p>
      </div>

      <div v-else-if="errorStatistics" class="text-center text-red-500 py-4">
        Failed to load statistics team.
      </div>

      <div v-else>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center">
            <span class="text-2xl font-bold text-primary-600">{{ statistics.value?.total ?? 0 }}</span>
            <span class="text-xs text-gray-500">Total Developers</span>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center">
            <span class="text-2xl font-bold text-green-600">{{ statistics.value?.active ?? 0 }}</span>
            <span class="text-xs text-gray-500">Active</span>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center">
            <span class="text-2xl font-bold text-blue-600">{{ statistics.value?.founders ?? 0 }}</span>
            <span class="text-xs text-gray-500">Founders</span>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center">
            <span class="text-2xl font-bold text-pink-600">{{ statistics.value?.contributors ?? 0 }}</span>
            <span class="text-xs text-gray-500">Contributors</span>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-semibold mb-2 text-primary-700">By Course</h4>
            <ul class="space-y-1">
              <li v-for="item in statistics.value?.by_course ?? []" :key="item.course" class="flex justify-between">
                <span>{{ item.course }}</span>
                <span class="font-semibold">{{ item.count }}</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-2 text-primary-700">By Academic Year</h4>
            <ul class="space-y-1">
              <li v-for="item in statistics.value?.by_academic_year ?? []" :key="item.academic_year" class="flex justify-between">
                <span>{{ item.academic_year }}</span>
                <span class="font-semibold">{{ item.count }}</span>
              </li>
            </ul>
          </div>
        </div>
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