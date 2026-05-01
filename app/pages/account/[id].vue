<template>
  <section class="min-h-screen bg-gray-50 dark:bg-neutral-950">

    <!-- Loading -->
    <div v-if="pending" class="flex min-h-screen items-center justify-center">
      <div class="flex flex-col items-center gap-3">
        <UIcon name="i-lucide-loader-2" class="h-8 w-8 animate-spin text-primary-400" />
        <p class="text-sm text-gray-400">Loading profile...</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error || !user" class="flex min-h-screen items-center justify-center px-4">
      <div class="text-center">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-neutral-800">
          <UIcon name="i-lucide-user-x" class="h-7 w-7 text-gray-400" />
        </div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Profile not found</h2>
        <p class="mt-1 text-sm text-gray-400">This member account could not be found.</p>
        <UButton to="/community" color="primary" variant="soft" class="mt-4 rounded-xl" icon="i-lucide-arrow-left">
          Back to Community
        </UButton>
      </div>
    </div>

    <template v-else>
      <!-- ── Cover + Avatar Hero ── -->
      <div class="relative h-52 overflow-hidden bg-gradient-to-br from-primary-700 via-primary-500 to-cyan-400 sm:h-64">
        <div class="absolute inset-0 opacity-10 z-1"
          style="background-image: radial-gradient(circle at 25% 75%, white 1px, transparent 1px), radial-gradient(circle at 75% 25%, white 1px, transparent 1px), radial-gradient(circle at 50% 50%, white 0.5px, transparent 0.5px); background-size: 40px 40px, 28px 28px, 18px 18px;" />

        <!-- Back button -->
        <div class="absolute left-4 top-4 sm:left-6 sm:top-6">
          <UButton to="/community" color="white" variant="solid" size="sm" icon="i-lucide-arrow-left"
            class="rounded-xl shadow-sm backdrop-blur-sm bg-white/20 text-white border-white/30 hover:bg-white/30">
            Community
          </UButton>
        </div>
      </div>

      <!-- Avatar overlapping cover -->
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div class="-mt-16 mb-6 flex flex-col gap-4 sm:-mt-20 sm:flex-row sm:items-end sm:justify-between">
          <div class="flex items-end gap-4">
            <UAvatar
              :src="user.profile_picture || user.user?.profile_picture || undefined"
              :alt="user.full_name || 'Member'"
              size="3xl"
              class="h-28 w-28 ring-4 ring-white shadow-xl dark:ring-neutral-950 sm:h-36 sm:w-36 z-30"
            />
            <div class="mb-2 space-y-1 z-30">
              <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                {{ user.full_name || 'Member' }}
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ user.course || 'Course not specified' }}
                <span v-if="user.year_of_study" class="text-gray-400"> · Year {{ user.year_of_study }}</span>
              </p>
              <div class="flex flex-wrap gap-1.5 pt-1">
                <UBadge v-if="user.is_verified_member" color="success" variant="soft" size="sm" class="rounded-full">
                  <UIcon name="i-lucide-badge-check" class="mr-1 h-3 w-3" />Verified Member
                </UBadge>
                <UBadge v-if="user.user?.is_staff" color="purple" variant="soft" size="sm" class="rounded-full">
                  Staff
                </UBadge>
                <UBadge v-if="user.user?.is_active || user.is_active" color="neutral" variant="soft" size="sm" class="rounded-full">
                  <span class="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />Active
                </UBadge>
              </div>
            </div>
          </div>

          <!-- Social action buttons -->
          <div class="flex flex-wrap gap-2 pb-2">
            <UButton
              v-if="user.github_link"
              :to="user.github_link"
              target="_blank"
              rel="noopener noreferrer"
              icon="i-lucide-github"
              color="neutral"
              variant="outline"
              size="sm"
              class="rounded-xl"
            >
              GitHub
            </UButton>
            <UButton
              v-if="user.portfolio_website"
              :to="user.portfolio_website"
              target="_blank"
              rel="noopener noreferrer"
              icon="i-lucide-globe"
              color="primary"
              variant="soft"
              size="sm"
              class="rounded-xl"
            >
              Portfolio
            </UButton>
          </div>
        </div>

        <!-- ── Content Grid ── -->
        <div class="grid gap-5 pb-12 lg:grid-cols-[300px_1fr]">

          <!-- ── Left Sidebar ── -->
          <div class="space-y-4">

            <!-- Contact info -->
            <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <p class="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Contact</p>
              <div class="space-y-3">
                <div v-if="user.email || user.user?.email" class="flex items-start gap-3">
                  <div class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/20">
                    <UIcon name="i-lucide-mail" class="h-3.5 w-3.5 text-primary-500" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-[10px] uppercase tracking-widest text-gray-400">Email</p>
                    <a :href="`mailto:${user.email || user.user?.email}`"
                      class="truncate text-sm text-gray-700 hover:text-primary-500 transition-colors dark:text-gray-300">
                      {{ user.email || user.user?.email }}
                    </a>
                  </div>
                </div>

                <div v-if="user.phone_number" class="flex items-start gap-3">
                  <div class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/20">
                    <UIcon name="i-lucide-phone" class="h-3.5 w-3.5 text-primary-500" />
                  </div>
                  <div>
                    <p class="text-[10px] uppercase tracking-widest text-gray-400">Phone</p>
                    <a :href="`tel:${user.phone_number}`"
                      class="text-sm text-gray-700 hover:text-primary-500 transition-colors dark:text-gray-300">
                      {{ user.phone_number }}
                    </a>
                  </div>
                </div>

                <div v-if="user.github_link" class="flex items-start gap-3">
                  <div class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-50 dark:bg-neutral-800">
                    <UIcon name="i-lucide-github" class="h-3.5 w-3.5 text-gray-500" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-[10px] uppercase tracking-widest text-gray-400">GitHub</p>
                    <a :href="user.github_link" target="_blank" rel="noopener"
                      class="truncate text-sm text-primary-500 hover:underline">
                      {{ formatUrl(user.github_link) }}
                    </a>
                  </div>
                </div>

                <div v-if="user.portfolio_website" class="flex items-start gap-3">
                  <div class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-50 dark:bg-neutral-800">
                    <UIcon name="i-lucide-globe" class="h-3.5 w-3.5 text-gray-500" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-[10px] uppercase tracking-widest text-gray-400">Portfolio</p>
                    <a :href="user.portfolio_website" target="_blank" rel="noopener"
                      class="truncate text-sm text-primary-500 hover:underline">
                      {{ formatUrl(user.portfolio_website) }}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Academic info -->
            <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <p class="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Academic</p>
              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <div class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-900/20">
                    <UIcon name="i-lucide-graduation-cap" class="h-3.5 w-3.5 text-violet-500" />
                  </div>
                  <div>
                    <p class="text-[10px] uppercase tracking-widest text-gray-400">Course</p>
                    <p class="text-sm text-gray-700 dark:text-gray-300">{{ user.course || 'Not specified' }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-900/20">
                    <UIcon name="i-lucide-book-open" class="h-3.5 w-3.5 text-violet-500" />
                  </div>
                  <div>
                    <p class="text-[10px] uppercase tracking-widest text-gray-400">Year of Study</p>
                    <p class="text-sm text-gray-700 dark:text-gray-300">
                      {{ user.year_of_study ? `Year ${user.year_of_study}` : 'Not specified' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Joined -->
            <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <p class="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Member Since</p>
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-emerald-400" />
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(user.created_at) }}</p>
              </div>
            </div>
          </div>

          <!-- ── Right Main Content ── -->
          <div class="space-y-5">

            <!-- Skills & Interests -->
            <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="mb-5 flex items-center gap-2">
                <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/20">
                  <UIcon name="i-lucide-code-2" class="h-4 w-4 text-primary-500" />
                </div>
                <h2 class="font-semibold text-gray-900 dark:text-white">Skills & Interests</h2>
              </div>

              <div class="space-y-5">
                <div>
                  <p class="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Technical Skills</p>
                  <div class="flex flex-wrap gap-2">
                    <UBadge
                      v-for="skill in parseList(user.technical_skills)"
                      :key="skill"
                      color="primary"
                      variant="soft"
                      size="md"
                      class="rounded-full px-3"
                    >
                      {{ skill }}
                    </UBadge>
                    <p v-if="!parseList(user.technical_skills).length" class="text-sm text-gray-400">
                      No skills added yet
                    </p>
                  </div>
                </div>

                <div class="border-t border-gray-100 pt-5 dark:border-neutral-800">
                  <p class="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Areas of Interest</p>
                  <div class="flex flex-wrap gap-2">
                    <UBadge
                      v-for="interest in parseList(user.areas_of_interest)"
                      :key="interest"
                      color="neutral"
                      variant="soft"
                      size="md"
                      class="rounded-full px-3"
                    >
                      {{ interest }}
                    </UBadge>
                    <p v-if="!parseList(user.areas_of_interest).length" class="text-sm text-gray-400">
                      No interests added yet
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Community Activity (public-safe counts only) -->
            <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="mb-5 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                    <UIcon name="i-lucide-activity" class="h-4 w-4 text-emerald-500" />
                  </div>
                  <h2 class="font-semibold text-gray-900 dark:text-white">Community Activity</h2>
                </div>
                <span class="text-xs text-gray-400">Updated {{ formatRelativeTime(user.updated_at) }}</span>
              </div>

              <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div
                  v-for="item in activityItems"
                  :key="item.label"
                  class="rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-primary-100 hover:bg-primary-50/30 dark:border-neutral-800 dark:bg-neutral-800/60 dark:hover:border-primary-900/40"
                >
                  <div class="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-neutral-700">
                    <UIcon :name="item.icon" class="h-3.5 w-3.5 text-primary-500" />
                  </div>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ item.count }}</p>
                  <p class="mt-0.5 text-xs text-gray-400">{{ item.label }}</p>
                </div>
              </div>
            </div>

            <!-- Projects contributed -->
            <div
              v-if="(user.created_projects?.length || 0) > 0"
              class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div class="mb-5 flex items-center gap-2">
                <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
                  <UIcon name="i-lucide-folder-git-2" class="h-4 w-4 text-blue-500" />
                </div>
                <h2 class="font-semibold text-gray-900 dark:text-white">Projects</h2>
                <UBadge color="neutral" variant="soft" size="sm" class="ml-auto rounded-full">
                  {{ user.created_projects?.length }} total
                </UBadge>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                This member has contributed to <span class="font-semibold text-gray-800 dark:text-gray-200">{{ user.created_projects?.length }}</span>
                project{{ (user.created_projects?.length || 0) !== 1 ? 's' : '' }} in the MuTech community.
              </p>
            </div>

            <!-- Events attended -->
            <div
              v-if="(user.event_attendances?.length || 0) > 0"
              class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div class="mb-5 flex items-center gap-2">
                <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
                  <UIcon name="i-lucide-calendar-check-2" class="h-4 w-4 text-amber-500" />
                </div>
                <h2 class="font-semibold text-gray-900 dark:text-white">Events Attended</h2>
                <UBadge color="neutral" variant="soft" size="sm" class="ml-auto rounded-full">
                  {{ user.event_attendances?.length }} events
                </UBadge>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Attended <span class="font-semibold text-gray-800 dark:text-gray-200">{{ user.event_attendances?.length }}</span>
                MuTech event{{ (user.event_attendances?.length || 0) !== 1 ? 's' : '' }}.
              </p>
            </div>

          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

type NestedUser = {
  id?: string
  email?: string | null
  full_name?: string | null
  is_active?: boolean
  is_verified?: boolean
  date_joined?: string | null
  profile_picture?: string | null
  is_superuser?: boolean
  is_staff?: boolean
  google_id?: string | null
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
  updated_at?: string | null
  date_joined?: string | null
  profile_picture?: string | null
  user?: NestedUser
  saved_projects?: unknown[]
  created_projects?: unknown[]
  event_attendances?: unknown[]
  reviews?: unknown[]
  takeaways?: unknown[]
  likes?: unknown[]
}

type ProfileEnvelope = {
  success?: boolean
  data?: ProfileResponse | { user?: ProfileResponse }
  user?: ProfileResponse
}

const route = useRoute()
const endpoints = useEndpoints()
const { get } = useApi()

const profileId = computed(() => String(route.params.id || ''))

const isProfileResponse = (value: unknown): value is ProfileResponse => {
  if (!value || typeof value !== 'object') return false
  return ['phone_number', 'course', 'technical_skills', 'created_at', 'updated_at'].some(
    key => key in (value as Record<string, unknown>)
  )
}

const { data, pending, error, refresh } = await useAsyncData<ProfileResponse | null>(
  () => `profile-${profileId.value}`,
  async () => {
    const response = await get<ProfileEnvelope>(endpoints.user.user(profileId.value), {}, true)
    const directData = response?.data
    const nestedData = response?.data && typeof response.data === 'object' && 'user' in response.data
      ? (response.data as { user?: ProfileResponse }).user
      : undefined

    if (isProfileResponse(directData)) return directData
    if (isProfileResponse(nestedData)) return nestedData
    if (isProfileResponse(response?.user)) return response.user
    return isProfileResponse(response) ? response : null
  },
  { watch: [profileId] }
)

const user = computed(() => data.value)

useSeoPage({
  title: `${user.value?.full_name || 'Profile'} | ${useAppConfig().site.title}`,
  description: `View the profile of ${user.value?.full_name || '---'}, a member of our community.`,
  image: user.value?.profile_picture || user.value?.user?.profile_picture || undefined,
})

// Only public-facing, non-sensitive activity counts
const activityItems = computed(() => [
  { label: 'Projects', icon: 'i-lucide-folder-git-2', count: user.value?.created_projects?.length || 0 },
  { label: 'Events', icon: 'i-lucide-calendar-check-2', count: user.value?.event_attendances?.length || 0 },
  { label: 'Reviews', icon: 'i-lucide-message-square-quote', count: user.value?.reviews?.length || 0 },
])

const formatDate = (date?: string | null) => {
  if (!date) return 'Recently'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const formatRelativeTime = (date?: string | null) => {
  if (!date) return ''
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}

const formatUrl = (url: string) => url.replace(/(https?:\/\/)/, '').replace(/\/$/, '')

const parseList = (value?: string | null) =>
  (value || '').split(',').map(i => i.trim()).filter(Boolean)
</script>