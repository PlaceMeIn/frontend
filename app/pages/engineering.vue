<template>
  <div class="p-4 space-y-6">
    <!-- Stats Section -->
    <div class="mb-6">
      <div v-if="statsPending" class="text-center py-4">
        <UIcon name="i-lucide-loader-2" class="animate-spin text-xl" />
        <p class="text-sm text-muted mt-2">Loading stats...</p>
      </div>
      
      <div v-else-if="statsError" class="text-center text-red-500 py-4">
        <p>Failed to load statistics</p>
      </div>
      
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <UCard>
          <p class="text-sm text-muted">Total Devs</p>
          <p class="text-lg font-semibold">{{ developersStats?.total || 0 }}</p>
        </UCard>

        <UCard>
          <p class="text-sm text-muted">Active</p>
          <p class="text-lg font-semibold">{{ developersStats?.active || 0 }}</p>
        </UCard>
      </div>
    </div>

    <!-- Developers Section -->
    <div>
      <h3 class="text-lg font-semibold mb-4">Founders</h3>
      <div v-if="pendingFounders" class="text-center py-4">
        <UIcon name="i-lucide-loader-2" class="animate-spin text-xl" />
        <p class="text-sm text-muted mt-2">Loading founders...</p>
      </div>
      <div v-else-if="errorFounders" class="text-center text-red-500 py-4">
        <p>Failed to load founders</p>
      </div>
      <div v-else class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        <UCard v-for="dev in founders" :key="dev.id" class="flex items-center gap-3">
          <UAvatar :src="dev.profile_picture" size="md" />
          <div>
            <p class="font-medium text-sm">{{ dev.full_name }}</p>
            <p class="text-xs text-muted">{{ dev.role || 'Founder' }}</p>
          </div>
        </UCard>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-4">Contributors</h3>
      <div v-if="pendingContributers" class="text-center py-4">
        <UIcon name="i-lucide-loader-2" class="animate-spin text-xl" />
        <p class="text-sm text-muted mt-2">Loading contributors...</p>
      </div>
      <div v-else-if="errorContributers" class="text-center text-red-500 py-4">
        <p>Failed to load contributors</p>
      </div>
      <div v-else class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        <UCard v-for="dev in contributers" :key="dev.id" class="flex items-center gap-3">
          <UAvatar :src="dev.profile_picture" size="md" />
          <div>
            <p class="font-medium text-sm">{{ dev.full_name }}</p>
            <p class="text-xs text-muted">{{ dev.role || 'Contributor' }}</p>
          </div>
        </UCard>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-4">Statistics Team</h3>
      <div v-if="pendingStatistics" class="text-center py-4">
        <UIcon name="i-lucide-loader-2" class="animate-spin text-xl" />
        <p class="text-sm text-muted mt-2">Loading statistics team...</p>
      </div>
      <div v-else-if="errorStatistics" class="text-center text-red-500 py-4">
        <p>Failed to load statistics team</p>
      </div>
      <div v-else class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        <UCard v-for="dev in statistics" :key="dev.id" class="flex items-center gap-3">
          <UAvatar :src="dev.profile_picture" size="md" />
          <div>
            <p class="font-medium text-sm">{{ dev.full_name }}</p>
            <p class="text-xs text-muted">{{ dev.role || 'Statistician' }}</p>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const endpoints = useEndpoints()

const { data: founders, pending: pendingFounders, error: errorFounders, refresh: refreshFounders } = await useFetch(endpoints.engineering.founders)
const { data: contributers, pending: pendingContributers, error: errorContributers, refresh: refreshContributers } = await useFetch(endpoints.engineering.contributers)
const { data: statistics, pending: pendingStatistics, error: errorStatistics, refresh: refreshStatistics } = await useFetch(endpoints.engineering.statistics)
const { data: developersStats, pending: statsPending, error: statsError, refresh: refreshStats } = await useFetch(endpoints.main.developersStats)
</script>