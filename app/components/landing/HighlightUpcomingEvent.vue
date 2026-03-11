<template>
  <section id="upcoming-event" class="py-20 bg-gradient-to-tr from-primary-600/10 via-transparent to-primary-400/10 scroll-mt-20">
    <div class="max-w-7xl mx-auto px-6 flex flex-col items-center">
      <div class="max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight">{{ title || 'Upcoming Events' }}</h2>
        <p class="mt-3 text-lg text-muted">
          Join us at our upcoming tech events, workshops, and hackathons
        </p>
      </div>

      <!-- Projects Grid -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full">
        <!-- Loading -->
        <template v-if="pending">
          <div class="col-span-full flex justify-center py-10">
            <Loader />
          </div>
        </template>

        <!-- Error -->
        <template v-else-if="error">
          <div class="col-span-full flex flex-col items-center gap-4 py-10">
            <UBanner
              color="error"
              icon="i-lucide-cloud-alert"
              title="Failed to load Events"
            />

            <UButton
              label="Retry"
              variant="outline"
              icon="i-lucide-refresh-cw"
              @click="refresh"
            />
          </div>
        </template>

        <template v-else>
          <EventsCard
            v-for="(event, index) in data?.results"
            :key="event.id"
            data-aos="fade-up"
            :data-aos-delay="index * 120"
            :event="event"
          />
        </template>
      </div>

      <div class="mt-12">
        <UButton
          label="View All Events"
          trailing-icon="i-lucide-arrow-right"
          to="/events"
          size="xl"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useEndpoints } from '@/composables/useEndpoints'
import { useApi } from '@/composables/useApi'

const endpoints = useEndpoints()
const { get } = useApi()

interface Props {
  title: string
  limit: number
  related: string
}
const props = defineProps<Props>()

const { data, pending, error, refresh } = await useAsyncData(
  'projects',
  () => get(endpoints.events.list, {
    limit: props.limit,
    search: props.related,
  }),
  {
    lazy: true,
    default: () => ({
      events: [] as Array<any>, // You can replace `any` with proper type
    }),
  }
)
</script>