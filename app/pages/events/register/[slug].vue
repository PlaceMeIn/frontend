<template>
  <div class="min-h-screen">
    <div class="container max-w-4xl mx-auto px-4 py-12">
      <!-- Header Section -->
      <div class="mb-8">
        <UBreadcrumb :links="[
          { label: 'Events', to: '/events' },
          { label: 'Register' }
        ]" />
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center space-y-4">
          <LoaderSpinnner />
          <p class="text-gray-600 dark:text-gray-400">Loading event details...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error">
        <UAlert :title="'Failed to Load Event'" color="red" variant="soft" icon="i-heroicons-exclamation-triangle"
          class="mb-6">
          <template #default>
            <div class="space-y-2">
              <p class="text-sm">{{ error.message || 'An error occurred while loading the event' }}</p>
              <UButton @click="refresh" color="red" variant="ghost" size="sm">
                Try Again
              </UButton>
            </div>
          </template>
        </UAlert>
      </div>

      <!-- Success State -->
      <div v-else-if="data">
        <!-- Page Title -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {{ data.title }}
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Register for this event
          </p>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Registration Card (Main) -->
          <div class="lg:col-span-2">
            <EventRegistrationCard v-if="data" :event="data" @success="handleRegistrationSuccess"
              @error="handleRegistrationError" />
          </div>

          <!-- Sidebar Info -->
          <div class="space-y-4">
            <!-- Event Type Card -->
            <UPageCard :spotlight="{ gradient: 'from-amber-400 via-transparent to-amber-500' }">
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-tag" class="w-6 h-6 text-amber-500" />
                  <h3 class="font-semibold text-gray-900 dark:text-white">Event Type</h3>
                </div>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  {{ data.event_type_display }}
                </p>
              </div>
            </UPageCard>

            <!-- Location Card -->
            <UPageCard :spotlight="{ gradient: 'from-blue-400 via-transparent to-blue-500' }">
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-map-pin" class="w-6 h-6 text-blue-500" />
                  <h3 class="font-semibold text-gray-900 dark:text-white">Location</h3>
                </div>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  {{ data.location }}
                </p>
              </div>
            </UPageCard>

            <!-- Date/Time Card -->
            <UPageCard :spotlight="{ gradient: 'from-green-400 via-transparent to-green-500' }">
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-calendar" class="w-6 h-6 text-green-500" />
                  <h3 class="font-semibold text-gray-900 dark:text-white">Date & Time</h3>
                </div>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  {{ formatDate(data.start_date) }}
                </p>
              </div>
            </UPageCard>
          </div>
        </div>

        <!-- Registration Info -->
        <div v-if="attendances" class="mt-8">
          <UAlert v-if="attendances.length > 0" :title="'Your Registrations'" color="success" variant="soft"
            icon="i-heroicons-check-circle" class="mb-4">
            <template #default>
              <p class="text-sm mb-2">You have {{ attendances.length }} registration(s) for this event.</p>
            </template>
          </UAlert>
          <div v-if="attendances.length > 0" class="space-y-4">
            <UPageCard v-for="attendance in attendances" :key="attendance.id" class="p-4">
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-user" class="w-5 h-5 text-primary" />
                  <span class="font-semibold">{{ attendance.user_name }}</span>
                  <span class="text-xs text-gray-500">({{ attendance.user_email }})</span>
                </div>
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-tag" class="w-5 h-5 text-amber-500" />
                  <span class="text-sm">Event: <span class="font-medium">{{ attendance.event_title }}</span></span>
                </div>
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-check-badge" class="w-5 h-5 text-green-500" />
                  <span class="text-sm">Status: <span class="font-medium">{{ attendance.status_display }}</span></span>
                </div>
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-calendar" class="w-5 h-5 text-blue-500" />
                  <span class="text-sm">Registered:
                    <span class="font-medium">{{ formatDate(attendance.registration_date) }}</span>
                  </span>
                </div>
                <div v-if="attendance.notes" class="flex items-center gap-2">
                  <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-gray-400" />
                  <span class="text-sm">Notes: {{ attendance.notes }}</span>
                </div>
              </div>
            </UPageCard>
          </div>
          <div v-else>
            <UAlert :title="'No Registrations Found'" color="gray" variant="soft" icon="i-heroicons-information-circle">
              <template #default>
                <p class="text-sm">You have not registered for this event yet.</p>
              </template>
            </UAlert>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else>
        <UAlert :title="'Event Not Found'" color="gray" variant="soft" icon="i-heroicons-exclamation-triangle">
          <template #default>
            <p class="text-sm">The event you're looking for doesn't exist or has been removed.</p>
          </template>
        </UAlert>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'

const route = useRoute()
const toast = useToast()

const slug = computed(() => String(route.params.slug || ""))

const endpoints = useEndpoints()
const { get } = useApi()

// State
const data = ref(null)
const attendances = ref<any[]>([])
const pending = ref(true)
const error = ref(null)

// Fetch data on mount with user cookies
onMounted(async () => {
  try {
    pending.value = true

    // Fetch event details
    const eventResponse: any = await get(
      endpoints.events.list,
      { slug: slug.value },
      true // with auth to get user cookies
    )
    data.value = eventResponse

    // Fetch user attendances
    const attendanceResponse: any = await get(
      endpoints.eventAttendances.myRegistrations,
      {},
      true // with auth
    )
    attendances.value = attendanceResponse || []

    useSeoPage({
      title: data.value
        ? ` Register for ${data.value.title} |  Register Events`
        : "Event Details",
      description: ` Register for ${data.value.title} held on ${formatDate(data.value.date)}  in ${data.value?.location || 'the venue'}.  \n -> ${data.value?.description}`,
      image: data.value?.image || data.value?.image_url,
    });
  } catch (err: any) {
    error.value = err
  } finally {
    pending.value = false
  }
})

// Refresh function
const refresh = async () => {
  pending.value = true
  try {
    const eventResponse: any = await get(
      endpoints.events.list,
      { slug: slug.value },
      true
    )
    data.value = eventResponse
  } catch (err: any) {
    error.value = err
  } finally {
    pending.value = false
  }
}

// Format date for display
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Handle registration success
const handleRegistrationSuccess = (res: any) => {
  toast.add({
    title: 'Success!',
    description: 'You have successfully registered for the event.',
    color: 'green',
    icon: 'i-heroicons-check-circle'
  })
}

// Handle registration error
const handleRegistrationError = (err: string) => {
  toast.add({
    title: 'Registration Failed',
    description: err,
    color: 'red',
    icon: 'i-heroicons-exclamation-triangle'
  })
}


useSeoPage({
  title: data.value
    ? ` Register for ${data.value.title} |  Register Events`
    : "Event Details",
  description: data.value?.description,
  image: data.value?.image || data.value?.image_url,
});
</script>

<style scoped>
/* Optional custom styles */
</style>