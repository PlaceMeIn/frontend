<template>
  <section class="py-20 bg-muted/30">
    <div class="max-w-7xl mx-auto px-6 flex flex-col items-center">

      <div class="max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight">What Our Members Say</h2>
        <p class="mt-3 text-lg text-muted">
          Hear from alumni who have gone on to achieve great things
        </p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full">

        <template v-if="pending">
          <div class="col-span-full flex justify-center py-10">
            <Loader />
          </div>
        </template>

        <template v-else-if="error">
          <div class="col-span-full flex flex-col items-center gap-4 py-10">
            <UBanner color="error" icon="i-lucide-cloud-alert" title="Failed to load Reviews" />
            <UButton
              label="Retry"
              variant="outline"
              icon="i-lucide-refresh-cw"
              @click="refresh"
            />
          </div>
        </template>

        <template v-else>
          <ProjectsCard
            v-for="review in data.projects ?? []"
            :key="review?.id || review?.title || Math.random()"
            :project="{
              title: review?.title || '',
              description: review?.description || '',
              image: review?.image || '',
              link: review?.link || ''
            }"
          />
        </template>

      </div>

      <div class="mt-12">
        <UButton
          label="View All Reviews"
          variant="ghost"
          trailing-icon="i-lucide-arrow-right"
          to="/reviews"
          size="xl"
        />
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const endpoints = useEndpoints()
const { get } = useApi()

const { data, pending, error, refresh } = await useAsyncData(
  'reviews',
  () => get(endpoints.reviews.list),
  {
    lazy: true,
    default: () => ({ projects: [] })
  }
)
</script>