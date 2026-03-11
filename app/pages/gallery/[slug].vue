<template>
  <div>
    <!-- Loading -->
    <template v-if="pending">
      <div class="flex justify-center py-12">
        <Loader />
      </div>
    </template>

    <!-- Error -->
    <template v-else-if="error">
      <div class="flex flex-col items-center gap-4 py-12">
        <UBanner
          color="error"
          icon="i-lucide-cloud-alert"
          title="Unable to load event"
          description="Something went wrong while fetching the event details."
        />

        <UButton
          label="Try Again"
          variant="outline"
          icon="i-lucide-refresh-cw"
          @click="refresh"
        />
      </div>
    </template>

    <!-- Content -->
    <template v-else>
      <div>
        <!-- Event content -->
        ........
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const slug = computed(() => String(route.params.slug || ""))

useSeoPage({
  title: `${slug.value} | ${useAppConfig().site.title}`,
  description: "Explore event details and updates."
})

const endpoints = useEndpoints()
const { get } = useApi()

const { data, pending, error, refresh } = await useAsyncData(
  `event-${slug.value}`,
  () => get(endpoints.events.list, { slug: slug.value }),
  {
    default: () => ({
      events: {}
    })
  }
)
</script>