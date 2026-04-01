<template>
  <div class="p-4 space-y-12 max-w-5xl m-auto">

    <section>
      <h2 class="text-xl font-semibold mb-4">Statistics Overview</h2>

      <template v-if="statsPending">
        <div class="text-center py-6">
          <UIcon name="i-lucide-loader-2" class="animate-spin text-2xl" />
          <p class="text-sm text-muted mt-2">Loading statistics...</p>
        </div>
      </template>

      <template v-else-if="statsError">
        <p class="text-center text-red-500 py-6">
          Failed to load statistics.
        </p>
      </template>

      <template v-else>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <UCard class="p-4">
            <p class="text-sm text-muted">Total Developers</p>
            <p class="text-xl font-semibold">{{ statsSafe.total }}</p>
          </UCard>

          <UCard class="p-4">
            <p class="text-sm text-muted">Active</p>
            <p class="text-xl font-semibold">{{ statsSafe.active }}</p>
          </UCard>

          <UCard class="p-4">
            <p class="text-sm text-muted">Founders</p>
            <p class="text-xl font-semibold">{{ statsSafe.founders }}</p>
          </UCard>

          <UCard class="p-4">
            <p class="text-sm text-muted">Contributors</p>
            <p class="text-xl font-semibold">{{ statsSafe.contributors }}</p>
          </UCard>
        </div>
      </template>
    </section>

    <section>
      <h3 class="text-lg font-semibold mb-4">Developers</h3>

      <div v-if="pendingFounders" class="text-center py-4">
        <UIcon name="i-lucide-loader-2" class="animate-spin text-xl" />
        <p class="text-sm text-muted mt-2">Loading founders...</p>
      </div>

      <div v-else-if="errorFounders" class="text-center text-red-500 py-4">
        Failed to load founders.
      </div>

      <div v-else class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        <UCard
          v-for="dev in foundersSafe"
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
      <h3 class="text-lg font-semibold mb-4">Contributors</h3>

      <div v-if="pendingContributors" class="text-center py-4">
        <UIcon name="i-lucide-loader-2" class="animate-spin text-xl" />
        <p class="text-sm text-muted mt-2">Loading contributors...</p>
      </div>

      <div v-else-if="errorContributors" class="text-center text-red-500 py-4">
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
      
          <div>
           {{ dev }}
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

const { data: stats, pending: statsPending, error: statsError } =
  await useFetch<StatsResponse>(endpoints.engineering.stats)

const { data: founders, pending: pendingFounders, error: errorFounders } =
  await useFetch<any>(endpoints.engineering.founders)

const { data: contributors, pending: pendingContributors, error: errorContributors } =
  await useFetch<any>(endpoints.engineering.contributors)

const { data: statistics, pending: pendingStatistics, error: errorStatistics } =
  await useFetch<any>(endpoints.engineering.statistics)

/* Safe fallbacks */
const statsSafe = computed(() => stats.value ?? {
  total: 0,
  active: 0,
  founders: 0,
  contributors: 0
})

const foundersSafe = computed(() => founders.value?.results ?? [])
const contributorsSafe = computed(() => contributors.value?.results ?? [])
const statisticsSafe = computed(() => statistics.value?.results ?? [])
</script>