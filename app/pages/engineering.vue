<template>
  <div class="p-4">
    <!-- Loading -->
    <div v-if="pending || statsPending" class="text-center py-10">
      <UIcon name="i-lucide-loader-2" class="animate-spin text-xl" />
      <p class="text-sm text-muted mt-2">Loading developers...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error || statsError" class="text-center text-red-500 py-10">
      <p>Failed to load developers data.</p>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Stats -->
      <div class="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <UCard>
          <p class="text-sm text-muted">Total Devs</p>
          <p class="text-lg font-semibold">
            {{ developersStats?.total || 0 }}
          </p>
        </UCard>

        <UCard>
          <p class="text-sm text-muted">Active</p>
          <p class="text-lg font-semibold">
            {{ developersStats?.active || 0 }}
          </p>
        </UCard>
      </div>

      <!-- Developers List -->
      <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        <UCard
          v-for="dev in developers"
          :key="dev.id"
          class="flex items-center gap-3"
        >
          <UAvatar :src="dev.profile_picture" size="md" />

          <div>
            <p class="font-medium text-sm">
              {{ dev.full_name }}
            </p>
            <p class="text-xs text-muted">
              {{ dev.role || 'Developer' }}
            </p>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const endpoints = useEndpoints()

// Fetch developers list
const {
  data: developers,
  pending,
  error
} = await useFetch(endpoints.main.developers)

// Fetch developers stats (FIX: use correct endpoint if different)
const {
  data: developersStats,
  pending: statsPending,
  error: statsError
} = await useFetch(endpoints.main.developersStats) // <-- FIX THIS if needed
</script>