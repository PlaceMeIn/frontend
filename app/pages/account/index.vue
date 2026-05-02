<template>
  <div class="min-h-screen">

    <!-- Loading skeleton -->
    <div v-if="pending" class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-8 flex items-center justify-between">
        <div class="space-y-2">
          <div class="h-7 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-neutral-800" />
          <div class="h-4 w-48 animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-900" />
        </div>
        <div class="flex gap-2">
          <div class="h-9 w-28 animate-pulse rounded-xl bg-gray-200 dark:bg-neutral-800" />
          <div class="h-9 w-28 animate-pulse rounded-xl bg-gray-200 dark:bg-neutral-800" />
        </div>
      </div>
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-4">
          <div class="h-64 animate-pulse rounded-2xl bg-gray-200 dark:bg-neutral-800" />
          <div class="h-40 animate-pulse rounded-2xl bg-gray-200 dark:bg-neutral-800" />
        </div>
        <div class="space-y-4 lg:col-span-2">
          <div class="h-32 animate-pulse rounded-2xl bg-gray-200 dark:bg-neutral-800" />
          <div class="h-48 animate-pulse rounded-2xl bg-gray-200 dark:bg-neutral-800" />
          <div class="h-48 animate-pulse rounded-2xl bg-gray-200 dark:bg-neutral-800" />
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="flex min-h-screen flex-col items-center justify-center gap-4">
      <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20">
        <UIcon name="i-lucide-alert-circle" class="h-8 w-8 text-red-500" />
      </div>
      <div class="text-center">
        <h3 class="font-semibold text-gray-900 dark:text-white">Failed to load profile</h3>
        <p class="mt-1 text-sm text-gray-400">{{ error }}</p>
      </div>
      <UButton variant="soft" color="primary" icon="i-lucide-refresh-cw" @click="loadProfile">
        Try again
      </UButton>
    </div>

    <!-- Profile content -->
    <div v-else-if="profileData" class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

      <!-- Header with Share Button -->
      <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div
            class="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 mb-2">
            <UIcon name="i-lucide-user-round" class="h-3.5 w-3.5" />
            Member Profile
          </div>
          <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ profileData.full_name }}</h1>
          <p class="mt-0.5 text-sm text-gray-400">{{ profileData.course }} • Year {{ profileData.year_of_study }}</p>
        </div>
        <div class="flex gap-2">
          <!-- Share Button -->
          <UTooltip text="Share profile" :delay-duration="200">
            <UButton color="neutral" variant="soft" icon="i-lucide-share-2" class="rounded-xl" @click="shareProfile">
              Share
            </UButton>
          </UTooltip>

          <UButton color="primary" variant="soft" icon="i-lucide-pencil" class="rounded-xl"
            @click="isEditModalOpen = true">
            Edit Profile
          </UButton>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">

        <!-- ── Sidebar ── -->
        <div class="space-y-4 lg:col-span-1">

          <!-- Profile card -->
          <div
            class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <!-- Cover -->
            <div class="relative h-24 bg-gradient-to-br from-primary-600 via-primary-500 to-cyan-400">
              <div class="absolute inset-0 opacity-20 z-1"
                style="background-image: radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px); background-size: 25px 25px, 18px 18px;" />
            </div>

            <div class="px-5 pb-5 z-30">
              <div class="-mt-10 mb-4 flex items-end justify-between">
                <UAvatar :src="profileData.user?.profile_picture || undefined" :alt="profileData.full_name || 'User'"
                  size="3xl" class="ring-4 ring-white shadow-lg dark:ring-neutral-900 z-30" />
                <div class="flex flex-wrap justify-end gap-1.5 pb-1 z-30">
                  <UBadge v-if="profileData.user?.is_verified" color="success" variant="solid" size="sm"
                    class="rounded-full">
                    <UIcon name="i-lucide-badge-check" class="mr-1 h-3 w-3" />Verified
                  </UBadge>
                  <UBadge v-if="profileData.is_verified_member" color="primary" variant="solid" size="sm"
                    class="rounded-full">
                    <UIcon name="i-lucide-users" class="mr-1 h-3 w-3" />Member
                  </UBadge>
                </div>
              </div>

              <div class="space-y-1 mb-4">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ profileData.full_name }}
                </h2>
                <p class="text-sm text-gray-400">{{ profileData.email }}</p>
                <div class="flex items-center gap-1.5 pt-0.5">
                  <span
                    :class="['h-2 w-2 rounded-full', profileData.user?.is_active ? 'bg-emerald-400 animate-pulse' : 'bg-gray-300']" />
                  <span class="text-xs text-gray-400">{{ profileData.user?.is_active ? 'Active account' : 'Inactive'
                  }}</span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2 border-t border-gray-100 pt-4 dark:border-neutral-800">
                <div class="rounded-xl bg-gray-50 p-3 dark:bg-neutral-800">
                  <p class="text-[10px] uppercase tracking-widest text-gray-400">Member Since</p>
                  <p class="mt-1 text-xs font-semibold text-gray-700 dark:text-gray-200">{{
                    formatDate(profileData.created_at) }}</p>
                </div>
                <div class="rounded-xl bg-gray-50 p-3 dark:bg-neutral-800">
                  <p class="text-[10px] uppercase tracking-widest text-gray-400">Joined</p>
                  <p class="mt-1 text-xs font-semibold text-gray-700 dark:text-gray-200">{{
                    formatDate(profileData.user?.date_joined) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact card -->
          <div
            class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h3 class="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <div class="flex h-6 w-6 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/20">
                <UIcon name="i-lucide-contact" class="h-3.5 w-3.5 text-primary-500" />
              </div>
              Contact
            </h3>
            <div class="space-y-3">
              <div v-for="item in contactItems" :key="item.label" class="flex items-start gap-3">
                <UIcon :name="item.icon" class="mt-0.5 h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600" />
                <div class="min-w-0 flex-1">
                  <p class="text-[10px] uppercase tracking-widest text-gray-400">{{ item.label }}</p>
                  <component :is="item.href ? 'a' : 'p'" :href="item.href" target="_blank" rel="noopener noreferrer"
                    :class="['mt-0.5 truncate text-xs', item.href ? 'text-primary-500 hover:underline' : 'text-gray-600 dark:text-gray-300']">
                    {{ item.value }}
                  </component>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Main Content ── -->
        <div class="space-y-4 lg:col-span-2">

          <!-- Academic info -->
          <div
            class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h3 class="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <div class="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-900/20">
                <UIcon name="i-lucide-graduation-cap" class="h-3.5 w-3.5 text-violet-500" />
              </div>
              Academic Information
            </h3>
            <div class="grid gap-3 sm:grid-cols-2">
              <div
                class="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <p class="text-[10px] uppercase tracking-widest text-gray-400">Course</p>
                <p class="mt-1 text-sm font-medium text-gray-800 dark:text-gray-100">{{ profileData.course ||
                  'Notspecified' }}</p>
              </div>
              <div
                class="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
                <p class="text-[10px] uppercase tracking-widest text-gray-400">Year of Study</p>
                <p class="mt-1 text-sm font-medium text-gray-800 dark:text-gray-100">
                  {{ profileData.year_of_study ? `Year ${profileData.year_of_study}` : 'Not specified' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Skills & Interests -->
          <div
            class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h3 class="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <div class="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-50 dark:bg-cyan-900/20">
                <UIcon name="i-lucide-code-2" class="h-3.5 w-3.5 text-cyan-500" />
              </div>
              Skills & Interests
            </h3>
            <div class="space-y-4">
              <div>
                <p class="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Technical Skills</p>
                <div class="flex flex-wrap gap-2">
                  <UBadge v-if="parseSkills(profileData.technical_skills).length"
                    v-for="skill in parseSkills(profileData.technical_skills)" :key="skill" color="primary"
                    variant="soft" size="sm" class="rounded-full">{{ skill }}</UBadge>
                  <p v-else class="text-xs text-gray-400">No skills added yet</p>
                </div>
              </div>
              <div class="border-t border-gray-100 pt-4 dark:border-neutral-800">
                <p class="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Areas of Interest</p>
                <div class="flex flex-wrap gap-2">
                  <UBadge v-if="parseSkills(profileData.areas_of_interest).length"
                    v-for="interest in parseSkills(profileData.areas_of_interest)" :key="interest" color="neutral"
                    variant="soft" size="sm" class="rounded-full">{{ interest }}</UBadge>
                  <p v-else class="text-xs text-gray-400">No interests added yet</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Activity Overview -->
          <div
            class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                <div class="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                  <UIcon name="i-lucide-activity" class="h-3.5 w-3.5 text-emerald-500" />
                </div>
                Activity Overview
              </h3>
              <span class="text-[10px] text-gray-400">Updated {{ formatRelativeTime(profileData.updated_at) }}</span>
            </div>
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div v-for="item in activityItems" :key="item.label"
                class="group rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:border-primary-100 hover:bg-primary-50/40 dark:border-neutral-800 dark:bg-neutral-800/50 dark:hover:border-primary-900/50 dark:hover:bg-primary-900/10">
                <div
                  class="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-neutral-700 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 transition-colors">
                  <UIcon :name="item.icon"
                    class="h-4 w-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
                </div>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ item.count }}</p>
                <p class="mt-0.5 text-[10px] text-gray-400">{{ item.label }}</p>
              </div>
            </div>
          </div>

          <!-- Event Attendances -->
          <div v-if="profileData.event_attendances?.length"
            class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                <div class="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <UIcon name="i-lucide-calendar" class="h-3.5 w-3.5 text-blue-500" />
                </div>
                Event Attendances
              </h3>
              <UBadge color="neutral" variant="soft" size="xs" class="rounded-full">
                {{ profileData.event_attendances.length }} events
              </UBadge>
            </div>
            <div class="space-y-3">
              <div v-for="event in profileData.event_attendances.slice(0, 5)" :key="event.id"
                class="rounded-xl border border-gray-100 p-4 dark:border-neutral-800">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <NuxtLink :to="`/events/${event.event_slug}`"
                      class="font-medium text-sm text-gray-900 hover:text-primary-500 dark:text-white transition-colors">
                      {{ event.event_title }}
                    </NuxtLink>
                    <p class="mt-0.5 text-xs text-gray-400">{{ formatDate(event.event_date) }}</p>
                  </div>
                  <UBadge :color="getEventStatusColor(event.status)" variant="soft" size="sm"
                    class="shrink-0 rounded-full">
                    {{ event.status }}
                    <span v-if="event.checked_in" class="ml-1">✓</span>
                  </UBadge>
                </div>
                <p class="mt-2 text-[10px] text-gray-400">Registered: {{ formatDate(event.registration_date) }}</p>
              </div>
              <UButton v-if="profileData.event_attendances.length > 5" color="neutral" variant="soft" size="sm"
                class="w-full" @click="showAllEvents = !showAllEvents">
                {{ showAllEvents ? 'Show less' : `View all ${profileData.event_attendances.length} events` }}
              </UButton>
            </div>
          </div>

          <!-- Support Tickets -->
          <div v-if="profileData.support_tickets?.length"
            class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                <div class="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20">
                  <UIcon name="i-lucide-ticket" class="h-3.5 w-3.5 text-amber-500" />
                </div>
                Support Tickets
              </h3>
              <UBadge color="neutral" variant="soft" size="xs" class="rounded-full">
                {{ profileData.support_tickets.length }} total
              </UBadge>
            </div>
            <div class="space-y-3">
              <div v-for="ticket in profileData.support_tickets.slice(0, 3)" :key="ticket.id"
                class="rounded-xl border border-gray-100 p-4 dark:border-neutral-800">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <p class="font-medium text-sm text-gray-900 dark:text-white">{{ ticket.message || 'No title' }}</p>
                    <p class="mt-0.5 text-[10px] text-gray-400">Priority: {{ ticket.priority }}</p>
                  </div>
                  <UBadge :color="getStatusColor(ticket.status)" variant="soft" size="sm" class="shrink-0 rounded-full">
                    {{ ticket.status }}
                  </UBadge>
                </div>
                <p class="mt-2 text-[10px] text-gray-400">{{ formatRelativeTime(ticket.created_at) }}</p>
                <div v-if="ticket.admin_response"
                  class="mt-3 rounded-lg border border-primary-100 bg-primary-50/50 p-3 text-xs text-gray-600 dark:border-primary-900/30 dark:bg-primary-900/10 dark:text-gray-400">
                  <p class="mb-1 text-[10px] font-semibold uppercase tracking-widest text-primary-500">Admin Response
                  </p>
                  {{ ticket.admin_response }}
                </div>
              </div>
            </div>
          </div>

          <!-- Suggestions -->
          <div v-if="profileData.suggestions?.length"
            class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                <div class="flex h-6 w-6 items-center justify-center rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                  <UIcon name="i-lucide-lightbulb" class="h-3.5 w-3.5 text-yellow-500" />
                </div>
                Your Suggestions
              </h3>
              <UBadge color="neutral" variant="soft" size="xs" class="rounded-full">
                {{ profileData.suggestions.length }} total
              </UBadge>
            </div>
            <div class="space-y-3">
              <div v-for="suggestion in profileData.suggestions.slice(0, 3)" :key="suggestion.id"
                class="rounded-xl border border-gray-100 p-4 dark:border-neutral-800">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <p class="font-medium text-sm text-gray-900 dark:text-white">{{ suggestion.title || 'No title' }}
                    </p>
                  </div>
                  <div class="flex shrink-0 items-center gap-3">
                    <div class="flex items-center gap-1 text-xs text-emerald-500">
                      <UIcon name="i-lucide-thumbs-up" class="h-3.5 w-3.5" />
                      {{ suggestion.votes_up }}
                    </div>
                    <div class="flex items-center gap-1 text-xs text-red-400">
                      <UIcon name="i-lucide-thumbs-down" class="h-3.5 w-3.5" />
                      {{ suggestion.votes_down }}
                    </div>
                  </div>
                </div>
                <div class="mt-3 flex items-center justify-between gap-2">
                  <UBadge :color="getSuggestionStatusColor(suggestion.status)" variant="soft" size="sm"
                    class="rounded-full">
                    {{ suggestion.status }}
                  </UBadge>
                  <p class="text-[10px] text-gray-400">{{ formatRelativeTime(suggestion.created_at) }}</p>
                </div>
                <div v-if="suggestion.admin_feedback"
                  class="mt-3 rounded-lg border border-primary-100 bg-primary-50/50 p-3 dark:border-primary-900/30 dark:bg-primary-900/10">
                  <p class="mb-1 text-[10px] font-semibold uppercase tracking-widest text-primary-500">Admin Feedback
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">{{ suggestion.admin_feedback }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty activity state -->
          <div
            v-if="!profileData.event_attendances?.length && !profileData.support_tickets?.length && !profileData.suggestions?.length"
            class="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center dark:border-neutral-800 dark:bg-neutral-900">
            <div
              class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 dark:bg-neutral-800">
              <UIcon name="i-lucide-inbox" class="h-6 w-6 text-gray-300 dark:text-gray-600" />
            </div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">No activity yet</p>
            <p class="mt-1 text-xs text-gray-400">Your events, support tickets, and suggestions will appear here</p>
          </div>

        </div>
      </div>
    </div>

    <!-- Empty / not authenticated -->
    <div v-else class="flex min-h-screen flex-col items-center justify-center gap-3">
      <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-neutral-800">
        <UIcon name="i-lucide-user-x" class="h-8 w-8 text-gray-300" />
      </div>
      <p class="text-sm text-gray-400">No profile data available</p>
    </div>



    <!-- Edit Modal -->
    <UModal v-model:open="isEditModalOpen" title="Edit Profile">
      <template #body>
        <UpdateProfile :profile="profileData" @updated="handleProfileUpdated" @cancel="isEditModalOpen = false" />
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import { url } from 'valibot'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()

// Types based on actual API response
type EventAttendance = {
  id: string
  event_id: string
  event_title: string
  event_slug: string
  event_date: string
  status: string
  registration_date: string
  checked_in: boolean
}

type SupportTicket = {
  id: string
  priority: string
  status: string
  created_at: string
  message: string
  admin_response: string | null
  resolved: boolean
}

type Suggestion = {
  id: string
  title?: string
  status: string
  votes_up: number
  votes_down: number
  created_at: string
  admin_feedback: string | null
}

type ProfileData = {
  id: string
  user: {
    id: string
    email: string
    full_name: string
    is_active: boolean
    is_verified: boolean
    date_joined: string
    profile_picture: string | null
    is_superuser: boolean
    google_id: string | null
  }
  full_name: string
  email: string
  phone_number: string
  course: string
  year_of_study: string
  technical_skills: string
  areas_of_interest: string
  github_link: string
  portfolio_website: string | null
  is_verified_member: boolean
  created_at: string
  updated_at: string
  saved_projects: any[]
  created_projects: any[]
  event_attendances: EventAttendance[]
  reviews: any[]
  takeaways: any[]
  likes: any[]
  support_tickets: SupportTicket[]
  suggestions: Suggestion[]
}

type ApiResponse = {
  success: boolean
  data: ProfileData
}

const endpoints = useEndpoints()
const { get } = useApi()
const auth = useAuthStore()

const profileData = ref<ProfileData | null>(null)
const pending = ref(false)
const error = ref<string | null>(null)
const isEditModalOpen = ref(false)
const showShareToast = ref(false)
const showAllEvents = ref(false)

const loadProfile = async () => {
  if (!auth.token) {
    error.value = 'Please login to view your profile'
    return
  }

  pending.value = true
  error.value = null

  try {
    const res = await get<ApiResponse>(`${endpoints.user.profile}`, {}, true)

    if (res?.success && res?.data) {
      profileData.value = res.data
    } else {
      throw new Error('Invalid response format')
    }
  } catch (err: any) {
    error.value = err?.message || 'Failed to fetch profile'
    console.error('Profile load error:', err)
  } finally {
    pending.value = false
  }
}


useSeoPage({
  title: `${profileData.value?.full_name || 'User'} - Profile | ${useAppConfig().site.title}`,
  description: `View the profile of ${profileData.value?.full_name || '---'}, a member of our community.`,
  image: profileData.value?.profile_picture || profileData.value?.user?.profile_picture || undefined,
})


// Share profile function
const shareProfile = async () => {
  const profileId = profileData.value?.id
  if (!profileId) return

  const shareUrl = `${window.location.origin}/account/${profileId}`

  try {
    await navigator.clipboard.writeText(shareUrl)
    showShareToast.value = true
    shareContent(
      {
        url: shareUrl,
        title: `Check out ${profileData.value?.full_name}'s profile on ${useAppConfig().site.title}`,
        text: `View the profile of ${profileData.value?.full_name || '---'}, a member of our community.`,
        fallbackToClipboard: true,
      })
  } catch (err) {
    console.error('Failed to copy:', err)
    // Fallback
    const textarea = document.createElement('textarea')
    textarea.value = shareUrl
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    showShareToast.value = true
  }
}

const toast = useToast()
const authStore = useAuthStore()

onMounted(() => {
  if (!authStore.isAuthenticated) {
    authStore.setLastAttemptedRouteToCurrent()
    toast.add({
      description: "Please login to view your profile.",
      color: "neutral",
    })
    return navigateTo('/auth/login')
  }
  loadProfile()
})

const refresh = () => loadProfile()

const handleProfileUpdated = async () => {
  isEditModalOpen.value = false
  await refresh()
}

const contactItems = computed(() => [
  {
    label: 'Phone',
    icon: 'i-lucide-phone',
    value: profileData.value?.phone_number || 'Not provided',
    href: profileData.value?.phone_number ? `tel:${profileData.value.phone_number}` : undefined,
  },
  {
    label: 'Email',
    icon: 'i-lucide-mail',
    value: profileData.value?.email || 'Not provided',
    href: profileData.value?.email ? `mailto:${profileData.value.email}` : undefined,
  },
  {
    label: 'GitHub',
    icon: 'i-lucide-github',
    value: profileData.value?.github_link ? formatUrl(profileData.value.github_link) : 'Not provided',
    href: profileData.value?.github_link || undefined,
  },
  {
    label: 'Portfolio',
    icon: 'i-lucide-globe',
    value: profileData.value?.portfolio_website ? formatUrl(profileData.value.portfolio_website) : 'Not provided',
    href: profileData.value?.portfolio_website || undefined,
  },
])

const activityItems = computed(() => [
  { label: 'Saved Projects', icon: 'i-lucide-bookmark', count: profileData.value?.saved_projects?.length || 0 },
  { label: 'Created Projects', icon: 'i-lucide-folder-git-2', count: profileData.value?.created_projects?.length || 0 },
  { label: 'Events', icon: 'i-lucide-calendar-check-2', count: profileData.value?.event_attendances?.length || 0 },
  { label: 'Reviews', icon: 'i-lucide-message-square-quote', count: profileData.value?.reviews?.length || 0 },
  { label: 'Takeaways', icon: 'i-lucide-notebook-pen', count: profileData.value?.takeaways?.length || 0 },
  { label: 'Likes', icon: 'i-lucide-heart', count: profileData.value?.likes?.length || 0 },
])

const formatDate = (date?: string | null) => {
  if (!date) return 'Recently'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const formatRelativeTime = (date?: string | null) => {
  if (!date) return ''
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(date)
}

const formatUrl = (url: string) =>
  url.replace(/(https?:\/\/)/, '').replace(/\/$/, '')

const parseSkills = (skills?: string | null) => {
  if (!skills) return []
  return skills.split(',').map(s => s.trim()).filter(Boolean)
}

const getStatusColor = (status?: string) => {
  const colors: Record<string, string> = {
    Pending: 'warning',
    'In Progress': 'info',
    Resolved: 'success',
    Closed: 'neutral',
  }
  return colors[status || ''] || 'neutral'
}

const getEventStatusColor = (status?: string) => {
  const colors: Record<string, string> = {
    registered: 'warning',
    confirmed: 'success',
    checked_in: 'success',
    cancelled: 'error',
    no_show: 'neutral',
  }
  return colors[status || ''] || 'neutral'
}

const getSuggestionStatusColor = (status?: string) => {
  const colors: Record<string, string> = {
    'Pending Review': 'warning',
    'Under Review': 'info',
    Accepted: 'success',
    Implemented: 'primary',
    Declined: 'error',
  }
  return colors[status || ''] || 'neutral'
}
</script>