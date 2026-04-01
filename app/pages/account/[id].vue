<template>
  <div class="min-h-screen bg-gradient-to-b from-primary-50/40 via-white to-white p-6 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900 md:p-8">
    <div class="mx-auto max-w-7xl space-y-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm font-medium text-primary">
            Community Profile
          </p>
          <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {{ user?.full_name || 'Member Profile' }}
          </h1>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            View account details, skills, interests, and activity.
          </p>
        </div>

        <UButton
          to="/community"
          color="neutral"
          variant="outline"
          icon="i-lucide-arrow-left"
        >
          Back to Community
        </UButton>
      </div>

      <div
        v-if="pending"
        class="flex justify-center py-12"
      >
        <UIcon
          name="i-lucide-loader-2"
          class="text-2xl animate-spin"
        />
      </div>

      <div
        v-else-if="error"
        class="py-10"
      >
        <ErrorState
          title="Failed to load member profile"
          description="We couldn't fetch this user's details right now."
          @retry="refresh"
        />
      </div>

      <div
        v-else-if="!user"
        class="py-10"
      >
        <EmptyState
          icon="i-lucide-user-x"
          title="Profile not found"
          description="This member account could not be found."
          :action="'Go back'"
          @action="navigateTo('/community')"
        />
      </div>

      <div
        v-else
        class="grid gap-6 lg:grid-cols-3"
      >
        <div class="space-y-6 lg:col-span-1">
          <UCard>
            <div class="space-y-5 text-center">
              <div class="flex justify-center">
                <div class="rounded-full bg-gradient-to-br from-primary/20 to-cyan-400/20 p-2 shadow-sm">
                  <UAvatar
                    :src="user.profile_picture || user.user?.profile_picture || undefined"
                    :alt="user.full_name"
                    size="3xl"
                    class="mx-auto h-36 w-36 ring-4 ring-white dark:ring-neutral-900 md:h-44 md:w-44"
                  />
                </div>
              </div>

              <div>
                <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ user.full_name || 'Not provided' }}
                </h2>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ user.email || user.user?.email || 'Not provided' }}
                </p>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {{ user.course || 'Course not provided' }}
                  <span v-if="user.year_of_study">
                    · Year {{ user.year_of_study }}
                  </span>
                </p>
              </div>

              <div class="flex flex-wrap justify-center gap-2">
                <UBadge
                  v-if="user.user?.is_verified || user.is_verified"
                  color="success"
                  variant="soft"
                >
                  Verified
                </UBadge>
                <UBadge
                  v-if="user.is_verified_member"
                  color="primary"
                  variant="soft"
                >
                  Verified Member
                </UBadge>
                <UBadge
                  v-if="user.user?.is_active || user.is_active"
                  color="success"
                  variant="soft"
                >
                  Active
                </UBadge>
              </div>

              <div class="border-t pt-4 dark:border-neutral-800">
                <div class="grid grid-cols-2 gap-3 text-left">
                  <div class="rounded-xl bg-gray-50 p-3 dark:bg-neutral-900">
                    <p class="text-[11px] uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                      Member Since
                    </p>
                    <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      {{ formatDate(user.created_at) }}
                    </p>
                  </div>
                  <div class="rounded-xl bg-gray-50 p-3 dark:bg-neutral-900">
                    <p class="text-[11px] uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                      Account Joined
                    </p>
                    <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      {{ formatDate(user.user?.date_joined || user.date_joined) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </UCard>

          <UCard>
            <h3 class="mb-4 flex items-center gap-2 font-semibold">
              <UIcon
                name="i-lucide-phone"
                class="size-4"
              />
              Contact Information
            </h3>

            <div class="space-y-4">
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Full Name
                </p>
                <p class="text-sm text-gray-900 dark:text-white">
                  {{ user.full_name || 'Not provided' }}
                </p>
              </div>

              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Phone Number
                </p>
                <p class="text-sm text-gray-900 dark:text-white">
                  {{ user.phone_number || 'Not provided' }}
                </p>
              </div>

              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p class="text-sm text-gray-900 dark:text-white">
                  {{ user.email || user.user?.email || 'Not provided' }}
                </p>
              </div>

              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  GitHub
                </p>
                <ULink
                  v-if="user.github_link"
                  :to="user.github_link"
                  target="_blank"
                  class="text-sm text-primary"
                >
                  {{ formatUrl(user.github_link) }}
                </ULink>
                <p
                  v-else
                  class="text-sm text-gray-500 dark:text-gray-400"
                >
                  Not provided
                </p>
              </div>

              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Portfolio
                </p>
                <ULink
                  v-if="user.portfolio_website"
                  :to="user.portfolio_website"
                  target="_blank"
                  class="text-sm text-primary"
                >
                  {{ formatUrl(user.portfolio_website) }}
                </ULink>
                <p
                  v-else
                  class="text-sm text-gray-500 dark:text-gray-400"
                >
                  Not provided
                </p>
              </div>
            </div>
          </UCard>
        </div>

        <div class="space-y-6 lg:col-span-2">
          <UCard>
            <h3 class="mb-4 flex items-center gap-2 font-semibold">
              <UIcon
                name="i-lucide-graduation-cap"
                class="size-4"
              />
              Academic Information
            </h3>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Course
                </p>
                <p class="text-sm text-gray-900 dark:text-white">
                  {{ user.course || 'Not specified' }}
                </p>
              </div>

              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Year of Study
                </p>
                <p class="text-sm text-gray-900 dark:text-white">
                  {{ user.year_of_study || 'Not specified' }}
                </p>
              </div>
            </div>
          </UCard>

          <UCard>
            <h3 class="mb-4 flex items-center gap-2 font-semibold">
              <UIcon
                name="i-lucide-code-2"
                class="size-4"
              />
              Skills & Interests
            </h3>

            <div class="space-y-5">
              <div>
                <p class="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Technical Skills
                </p>
                <div class="flex flex-wrap gap-2">
                  <template v-if="parseList(user.technical_skills).length">
                    <UBadge
                      v-for="skill in parseList(user.technical_skills)"
                      :key="skill"
                      color="primary"
                      variant="soft"
                    >
                      {{ skill }}
                    </UBadge>
                  </template>
                  <p
                    v-else
                    class="text-sm text-gray-500 dark:text-gray-400"
                  >
                    No skills added yet
                  </p>
                </div>
              </div>

              <div>
                <p class="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Areas of Interest
                </p>
                <div class="flex flex-wrap gap-2">
                  <template v-if="parseList(user.areas_of_interest).length">
                    <UBadge
                      v-for="interest in parseList(user.areas_of_interest)"
                      :key="interest"
                      color="neutral"
                      variant="soft"
                    >
                      {{ interest }}
                    </UBadge>
                  </template>
                  <p
                    v-else
                    class="text-sm text-gray-500 dark:text-gray-400"
                  >
                    No interests added yet
                  </p>
                </div>
              </div>
            </div>
          </UCard>

          <UCard>
            <h3 class="mb-4 flex items-center gap-2 font-semibold">
              <UIcon
                name="i-lucide-user-round-search"
                class="size-4"
              />
              Raw Member Snapshot
            </h3>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Profile ID
                </p>
                <p class="break-all text-sm text-gray-900 dark:text-white">
                  {{ user.id }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  User ID
                </p>
                <p class="break-all text-sm text-gray-900 dark:text-white">
                  {{ user.user?.id || 'Not provided' }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Verified Member
                </p>
                <p class="text-sm text-gray-900 dark:text-white">
                  {{ user.is_verified_member ? 'Yes' : 'No' }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Superuser
                </p>
                <p class="text-sm text-gray-900 dark:text-white">
                  {{ user.user?.is_superuser ? 'Yes' : 'No' }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Email Verified
                </p>
                <p class="text-sm text-gray-900 dark:text-white">
                  {{ user.user?.is_verified ? 'Yes' : 'No' }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Google ID
                </p>
                <p class="break-all text-sm text-gray-900 dark:text-white">
                  {{ user.user?.google_id || 'Not connected' }}
                </p>
              </div>
            </div>
          </UCard>

          <UCard v-if="user.support_tickets?.length">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="flex items-center gap-2 font-semibold">
                <UIcon
                  name="i-lucide-ticket"
                  class="size-4"
                />
                Support Tickets
              </h3>
              <UBadge
                size="xs"
                variant="soft"
              >
                {{ user.support_tickets.length }} total
              </UBadge>
            </div>

            <div class="space-y-3">
              <div
                v-for="ticket in user.support_tickets"
                :key="ticket.id"
                class="rounded-lg border p-3 dark:border-neutral-800"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ ticket.title }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ ticket.category }}
                    </p>
                  </div>
                  <UBadge
                    :color="getStatusColor(ticket.status)"
                    variant="soft"
                    size="sm"
                  >
                    {{ ticket.status }}
                  </UBadge>
                </div>
                <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {{ formatRelativeTime(ticket.created_at) }}
                </p>
              </div>
            </div>
          </UCard>

          <UCard v-if="user.suggestions?.length">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="flex items-center gap-2 font-semibold">
                <UIcon
                  name="i-lucide-lightbulb"
                  class="size-4"
                />
                Suggestions
              </h3>
              <UBadge
                size="xs"
                variant="soft"
              >
                {{ user.suggestions.length }} total
              </UBadge>
            </div>

            <div class="space-y-3">
              <div
                v-for="suggestion in user.suggestions"
                :key="suggestion.id"
                class="rounded-lg border p-3 dark:border-neutral-800"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ suggestion.title }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ suggestion.category }}
                    </p>
                  </div>
                  <UBadge
                    :color="getSuggestionStatusColor(suggestion.status)"
                    variant="soft"
                    size="sm"
                  >
                    {{ suggestion.status }}
                  </UBadge>
                </div>

                <p
                  v-if="suggestion.admin_feedback"
                  class="mt-2 rounded-md bg-primary/5 p-2 text-xs text-gray-600 dark:bg-primary/10 dark:text-gray-300"
                >
                  {{ suggestion.admin_feedback }}
                </p>

                <div class="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{{ formatRelativeTime(suggestion.created_at) }}</span>
                  <span>{{ suggestion.votes_up }} upvotes · {{ suggestion.votes_down }} downvotes</span>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

type SupportTicket = {
  id: string
  title: string
  category: string
  status: string
  created_at: string
}

type Suggestion = {
  id: string
  title: string
  category: string
  status: string
  admin_feedback?: string | null
  votes_up: number
  votes_down: number
  created_at: string
}

type NestedUser = {
  id?: string
  email?: string | null
  is_active?: boolean
  is_verified?: boolean
  date_joined?: string | null
  profile_picture?: string | null
}

type ProfileResponse = {
  id?: string
  full_name?: string | null
  email?: string | null
  phone_number?: string | null
  course?: string | null
  year_of_study?: string | null
  technical_skills?: string | null
  areas_of_interest?: string | null
  github_link?: string | null
  portfolio_website?: string | null
  is_verified_member?: boolean
  is_verified?: boolean
  is_active?: boolean
  created_at?: string | null
  date_joined?: string | null
  profile_picture?: string | null
  user?: NestedUser
  support_tickets?: SupportTicket[]
  suggestions?: Suggestion[]
}

const route = useRoute()
const endpoints = useEndpoints()
const { get } = useApi()

const profileId = computed(() => String(route.params.id || ''))

const {
  data,
  pending,
  error,
  refresh
} = await useAsyncData<ProfileResponse>(
  () => `profile-${profileId.value}`,
  async () => {
    const response = await get<any>(
      endpoints.user.user(profileId.value),
      {},
      true
    )

    return response?.user || response?.data?.user || response?.data || response
  },
  {
    watch: [profileId]
  }
)

const user = computed(() => data.value)

const formatDate = (date?: string | null) => {
  if (!date) {
    return 'Recently'
  }

  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatRelativeTime = (date?: string | null) => {
  if (!date) {
    return ''
  }

  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) {
    return 'Just now'
  }

  if (diffMins < 60) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  }

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  }

  if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  return formatDate(date)
}

const formatUrl = (url: string) =>
  url.replace(/(https?:\/\/)/, '').replace(/\/$/, '')

const parseList = (value?: string | null) =>
  (value || '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)

const getStatusColor = (status?: string) => {
  const colors: Record<string, string> = {
    'Open': 'warning',
    'In Progress': 'info',
    'Resolved': 'success',
    'Closed': 'neutral'
  }

  return colors[status || ''] || 'neutral'
}

const getSuggestionStatusColor = (status?: string) => {
  const colors: Record<string, string> = {
    'Under Review': 'warning',
    'Approved': 'success',
    'Implemented': 'primary',
    'Declined': 'error'
  }

  return colors[status || ''] || 'neutral'
}
</script>
