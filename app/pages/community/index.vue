<template>
  <section class="min-h-screen ">
    <div class="mx-auto max-w-8xl px-4 py-10 sm:px-6 lg:px-8">

      <!-- ── Hero ── -->
      <div class="mb-8">
        <div class="flex flex-col gap-1">
          <div class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-500">
            <UIcon name="i-lucide-users" class="h-3.5 w-3.5" />
            MUT Tech Club
          </div>
          <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Community Directory
          </h1>
          <p class="mt-1 max-w-xl text-sm text-gray-500 dark:text-gray-400">
            Browse members, explore their skills, and find collaborators across software, AI, data, and product development.
          </p>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <UBadge color="primary" variant="soft" size="md" class="rounded-full px-3">
            <UIcon name="i-lucide-users-round" class="mr-1.5 h-3.5 w-3.5" />
            {{ stats.total }} members
          </UBadge>
          <UBadge color="success" variant="soft" size="md" class="rounded-full px-3">
            <UIcon name="i-lucide-badge-check" class="mr-1.5 h-3.5 w-3.5" />
            {{ stats.verified }} verified
          </UBadge>
          <UBadge color="info" variant="soft" size="md" class="rounded-full px-3">
            <UIcon name="i-lucide-graduation-cap" class="mr-1.5 h-3.5 w-3.5" />
            {{ stats.courses }} courses
          </UBadge>
        </div>
      </div>

      <!-- ── Main Layout: Sidebar + Content ── -->
      <div class="flex gap-6">

        <!-- ── Sidebar Filters ── -->
        <aside class="hidden w-72 shrink-0 lg:block">
          <div class="sticky top-6 space-y-4">

            <!-- Search -->
            <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <p class="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Search</p>
              <UInput
                v-model="searchInput"
                icon="i-lucide-search"
                size="lg"
                placeholder="Name, skill, course..."
                class="w-full"
              />
            </div>

            <!-- Filters Card -->
            <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div class="mb-4 flex items-center justify-between">
                <p class="text-xs font-semibold uppercase tracking-widest text-gray-400">Filters</p>
                <UButton
                  v-if="hasActiveFilters"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  icon="i-lucide-x"
                  @click="resetAllFilters"
                >
                  Clear
                </UButton>
              </div>

              <div class="space-y-5">
                <!-- Year -->
                <div>
                  <label class="mb-2 block text-xs font-medium text-gray-500 dark:text-gray-400">Year of Study</label>
                  <div class="flex flex-wrap gap-1.5">
                    <button
                      v-for="opt in yearOptions"
                      :key="opt.value"
                      @click="toggleArrayFilter(yearFilter, opt.value)"
                      :class="[
                        'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                        yearFilter.includes(opt.value)
                          ? 'bg-primary-500 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-400 dark:hover:bg-neutral-700'
                      ]"
                    >
                      {{ opt.label }}
                    </button>
                  </div>
                </div>

                <!-- Verification -->
                <div>
                  <label class="mb-2 block text-xs font-medium text-gray-500 dark:text-gray-400">Status</label>
                  <div class="flex gap-1.5">
                    <button
                      v-for="opt in verificationOptions"
                      :key="opt.value"
                      @click="verifiedFilter = verifiedFilter === opt.value ? '' : opt.value"
                      :class="[
                        'flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                        verifiedFilter === opt.value
                          ? opt.value === 'true' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-amber-500 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-400 dark:hover:bg-neutral-700'
                      ]"
                    >
                      {{ opt.label }}
                    </button>
                  </div>
                </div>

                <!-- Role -->
                <div>
                  <label class="mb-2 block text-xs font-medium text-gray-500 dark:text-gray-400">Role</label>
                  <div class="flex flex-col gap-1">
                    <button
                      v-for="opt in roleOptions"
                      :key="opt.value"
                      @click="staffFilter = opt.value"
                      :class="[
                        'flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all text-left',
                        staffFilter === opt.value
                          ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                          : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-neutral-800'
                      ]"
                    >
                      <UIcon :name="opt.icon" class="h-4 w-4" />
                      {{ opt.label }}
                      <UIcon v-if="staffFilter === opt.value" name="i-lucide-check" class="ml-auto h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <!-- Course -->
                <div>
                  <label class="mb-2 block text-xs font-medium text-gray-500 dark:text-gray-400">Course</label>
                  <USelectMenu
                    v-model="courseFilter"
                    :options="courseOptions"
                    placeholder="All Courses"
                    size="sm"
                    multiple
                    clearable
                    searchable
                    class="w-full"
                  />
                </div>
              </div>
            </div>

            <!-- Active filters summary -->
            <div v-if="hasActiveFilters" class="rounded-2xl border border-primary-100 bg-primary-50/50 p-4 dark:border-primary-900/30 dark:bg-primary-900/10">
              <p class="mb-2 text-xs font-semibold uppercase tracking-widest text-primary-500">Active Filters</p>
              <div class="flex flex-wrap gap-1.5">
                <UBadge
                  v-for="filter in activeFiltersList"
                  :key="filter.key"
                  color="primary"
                  variant="soft"
                  size="sm"
                  class="gap-1 rounded-full"
                >
                  {{ filter.label }}
                  <button @click="removeFilter(filter.key)" class="ml-1 opacity-60 hover:opacity-100">×</button>
                </UBadge>
              </div>
            </div>

            <!-- Newest member -->
            <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <p class="text-xs uppercase tracking-widest text-gray-400">Latest Join</p>
              <div class="mt-2 flex items-center gap-2">
                <div class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ newestMemberLabel }}</p>
              </div>
            </div>
          </div>
        </aside>

        <!-- ── Main Content ── -->
        <div class="min-w-0 flex-1">

          <!-- Mobile search bar -->
          <div class="mb-4 lg:hidden">
            <UInput
              v-model="searchInput"
              icon="i-lucide-search"
              size="lg"
              placeholder="Search members..."
              class="w-full"
            />
          </div>

          <!-- Toolbar -->
          <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              <span class="font-semibold text-gray-900 dark:text-white">{{ filteredMembers.length }}</span>
              members found{{ hasActiveFilters ? ' · filtered' : '' }}
            </p>

            <div class="flex items-center gap-3">
              <!-- Per page -->
              <USelect
                v-model="limit"
                :items="limitOptions"
                value-key="value"
                label-key="label"
                size="sm"
                class="w-32"
              />

              <!-- Layout toggle -->
              <div class="flex rounded-xl border border-gray-200 p-0.5 dark:border-neutral-700">
                <button
                  v-for="item in layoutItems"
                  :key="item.value"
                  @click="layout = item.value"
                  :class="[
                    'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                    layout === item.value
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-700 dark:text-white'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  ]"
                >
                  <UIcon :name="item.icon" class="h-3.5 w-3.5" />
                  {{ item.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="pending" class="flex justify-center py-2">
            <UProgress color="primary" class="w-full rounded-full" size="xs" />
          </div>

          <!-- Error -->
          <div v-if="error" class="py-10">
            <ErrorState
              title="Failed to load community members"
              description="We couldn't fetch the community directory right now."
              @retry="refresh"
            />
          </div>

          <template v-else>
            <!-- ── GRID VIEW ── -->
            <div
              v-if="filteredMembers.length && layout === 'grid'"
              class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
            >
              <UCard
                v-for="member in filteredMembers"
                :key="member.id"
                :ui="{
                  root: 'group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary-200 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-primary-800',
                  body: 'p-0'
                }"
              >
                <NuxtLink
                  :to="`/account/${member.id}`"
                  :aria-label="`View ${member.full_name}'s profile`"
                  class="absolute inset-0 z-10 rounded-[inherit]"
                />

                <!-- Cover Image Area -->
                <div class="relative h-32 overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-cyan-400">
                  <!-- Abstract pattern overlay -->
                  <div class="absolute inset-0 opacity-20"
                    style="background-image: radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 50% 50%, white 0.5px, transparent 0.5px); background-size: 30px 30px, 20px 20px, 15px 15px;" />

                  <!-- Badges -->
                  <div class="absolute right-3 top-3 flex gap-1.5">
                    <UBadge v-if="member.user?.is_staff" color="purple" variant="solid" size="sm" class="rounded-full shadow">
                      Staff
                    </UBadge>
                    <UBadge
                      :color="member.is_verified_member ? 'success' : 'neutral'"
                      variant="solid"
                      size="sm"
                      class="rounded-full shadow"
                    >
                      {{ member.is_verified_member ? "✓ Verified" : "Member" }}
                    </UBadge>
                  </div>
                </div>

                <!-- Avatar overlapping cover -->
                <div class="relative px-5 pb-5">
                  <div class="-mt-10 mb-3 flex items-end justify-between">
                    <UAvatar
                      :src="member.user.profile_picture || undefined"
                      :alt="member.full_name"
                      size="3xl"
                      class="ring-4 ring-white shadow-lg dark:ring-neutral-900"
                    />
                    <div class="flex gap-1.5 pb-1 z-30">
                      <UButton
                        v-if="member.github_link"
                        :to="member.github_link"
                        target="_blank"
                        rel="noopener noreferrer"
                        icon="i-lucide-github"
                        color="neutral"
                        variant="soft"
                        size="xs"
                        class="relative z-20  z-30"
                      />
                      <UButton
                        v-if="member.portfolio_website"
                        :to="member.portfolio_website"
                        target="_blank"
                        rel="noopener noreferrer"
                        icon="i-lucide-globe"
                        color="primary"
                        variant="solid"
                        size="xs"
                        class="relative z-20  z-30"
                      />
                    </div>
                  </div>

                  <div class="space-y-3">
                    <div>
                      <h3 class="font-semibold text-gray-900 dark:text-white">{{ member.full_name }}</h3>
                      <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{{ member.course }} · Year {{ member.year_of_study }}</p>
                    </div>

                    <div class="flex items-center gap-2 text-xs text-gray-400">
                      <UIcon name="i-lucide-mail" class="h-3.5 w-3.5 shrink-0" />
                      <a :href="`mailto:${member.email}`" class="relative z-20 truncate hover:text-primary-500 transition-colors">{{ member.email }}</a>
                    </div>

                    <!-- Skills -->
                    <div v-if="splitValues(member.technical_skills).length">
                      <div class="flex flex-wrap gap-1.5">
                        <UBadge
                          v-for="skill in splitValues(member.technical_skills).slice(0, 4)"
                          :key="`${member.id}-s-${skill}`"
                          color="primary"
                          variant="soft"
                          size="xs"
                          class="rounded-full"
                        >{{ skill }}</UBadge>
                        <UBadge
                          v-if="splitValues(member.technical_skills).length > 4"
                          color="neutral"
                          variant="soft"
                          size="xs"
                          class="rounded-full"
                        >+{{ splitValues(member.technical_skills).length - 4 }}</UBadge>
                      </div>
                    </div>

                    <!-- Interests -->
                    <div v-if="splitValues(member.areas_of_interest).length">
                      <div class="flex flex-wrap gap-1.5">
                        <UBadge
                          v-for="interest in splitValues(member.areas_of_interest).slice(0, 3)"
                          :key="`${member.id}-i-${interest}`"
                          color="neutral"
                          variant="soft"
                          size="xs"
                          class="rounded-full"
                        >{{ interest }}</UBadge>
                        <UBadge
                          v-if="splitValues(member.areas_of_interest).length > 3"
                          color="neutral"
                          variant="soft"
                          size="xs"
                          class="rounded-full"
                        >+{{ splitValues(member.areas_of_interest).length - 3 }}</UBadge>
                      </div>
                    </div>

                    <div class="border-t border-gray-100 pt-2 dark:border-neutral-800">
                      <p class="text-[10px] text-gray-400">
                        <UIcon name="i-lucide-calendar" class="mr-1 inline h-3 w-3" />
                        Joined {{ formatDate(member.created_at) }}
                      </p>
                    </div>
                  </div>
                </div>
              </UCard>
            </div>

            <!-- ── LIST VIEW ── -->
            <div
              v-if="filteredMembers.length && layout === 'list'"
              class="flex flex-col gap-3"
            >
              <UCard
                v-for="member in filteredMembers"
                :key="member.id"
                :ui="{
                  root: 'group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary-200 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-primary-800',
                  body: 'p-0'
                }"
              >
                <NuxtLink
                  :to="`/account/${member.id}`"
                  :aria-label="`View ${member.full_name}'s profile`"
                  class="absolute inset-0 z-10 rounded-[inherit]"
                />

                <div class="flex items-stretch">
                  <!-- Left accent bar + avatar -->
                  <div class="relative flex w-48 shrink-0 flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-b from-primary-600 to-primary-500 px-4 py-5 sm:w-56">
                    <div class="absolute inset-0 opacity-10"
                      style="background-image: radial-gradient(circle at 50% 0%, white 1px, transparent 1px); background-size: 20px 20px;" />
                    <UAvatar
                      :src="member.user.profile_picture || undefined"
                      :alt="member.full_name"
                      size="2xl"
                      class="ring-4 ring-white/30 shadow-xl"
                    />
                    <div class="text-center">
                      <p class="text-xs font-semibold text-white">Year {{ member.year_of_study }}</p>
                      <p class="mt-0.5 text-[10px] text-white/70 leading-tight">{{ formatDate(member.created_at) }}</p>
                    </div>
                  </div>

                  <!-- Content -->
                  <div class="flex min-w-0 flex-1 flex-col justify-center gap-3 p-4 sm:p-5">
                    <div class="flex flex-wrap items-start justify-between gap-3">
                      <div class="min-w-0">
                        <div class="flex flex-wrap items-center gap-2">
                          <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ member.full_name }}</h3>
                          <UBadge v-if="member.user?.is_staff" color="purple" variant="soft" size="sm" class="rounded-full">Staff</UBadge>
                          <UBadge
                            :color="member.is_verified_member ? 'success' : 'neutral'"
                            variant="soft"
                            size="sm"
                            class="rounded-full"
                          >{{ member.is_verified_member ? "✓ Verified" : "Member" }}</UBadge>
                        </div>
                        <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{{ member.course }}</p>
                      </div>

                      <div class="flex shrink-0 gap-2 relative z-20">
                        <UButton
                          v-if="member.github_link"
                          :to="member.github_link"
                          target="_blank"
                          rel="noopener noreferrer"
                          icon="i-lucide-github"
                          color="neutral"
                          variant="outline"
                          size="sm"
                          class="rounded-xl"
                        >GitHub</UButton>
                        <UButton
                          v-if="member.portfolio_website"
                          :to="member.portfolio_website"
                          target="_blank"
                          rel="noopener noreferrer"
                          icon="i-lucide-globe"
                          color="primary"
                          variant="soft"
                          size="sm"
                          class="rounded-xl"
                        >Portfolio</UButton>
                      </div>
                    </div>

                    <div class="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-400">
                      <a :href="`mailto:${member.email}`" class="relative z-20 flex items-center gap-1.5 hover:text-primary-500 transition-colors">
                        <UIcon name="i-lucide-mail" class="h-3.5 w-3.5" />{{ member.email }}
                      </a>
                      <a :href="`tel:${member.phone_number}`" class="relative z-20 flex items-center gap-1.5 hover:text-primary-500 transition-colors">
                        <UIcon name="i-lucide-phone" class="h-3.5 w-3.5" />{{ member.phone_number }}
                      </a>
                    </div>

                    <div class="flex flex-wrap gap-4">
                      <div v-if="splitValues(member.technical_skills).length">
                        <p class="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Skills</p>
                        <div class="flex flex-wrap gap-1.5">
                          <UBadge
                            v-for="skill in splitValues(member.technical_skills).slice(0, 5)"
                            :key="`${member.id}-s-${skill}`"
                            color="primary"
                            variant="soft"
                            size="xs"
                            class="rounded-full"
                          >{{ skill }}</UBadge>
                          <UBadge v-if="splitValues(member.technical_skills).length > 5" color="neutral" variant="soft" size="xs" class="rounded-full">
                            +{{ splitValues(member.technical_skills).length - 5 }}
                          </UBadge>
                        </div>
                      </div>
                      <div v-if="splitValues(member.areas_of_interest).length">
                        <p class="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Interests</p>
                        <div class="flex flex-wrap gap-1.5">
                          <UBadge
                            v-for="interest in splitValues(member.areas_of_interest).slice(0, 4)"
                            :key="`${member.id}-i-${interest}`"
                            color="neutral"
                            variant="soft"
                            size="xs"
                            class="rounded-full"
                          >{{ interest }}</UBadge>
                          <UBadge v-if="splitValues(member.areas_of_interest).length > 4" color="neutral" variant="soft" size="xs" class="rounded-full">
                            +{{ splitValues(member.areas_of_interest).length - 4 }}
                          </UBadge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </UCard>
            </div>

            <!-- Empty State -->
            <div v-if="!filteredMembers.length" class="py-16 text-center">
              <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-neutral-800">
                <UIcon name="i-lucide-users-x" class="h-7 w-7 text-gray-400" />
              </div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">No members found</h3>
              <p class="mt-1 text-sm text-gray-400">Try adjusting your filters or search query.</p>
              <UButton class="mt-4" color="primary" variant="soft" @click="resetAll">Clear all filters</UButton>
            </div>

            <!-- Pagination -->
            <div
              v-if="filteredMembers.length && !hasActiveFilters"
              class="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm sm:flex-row dark:border-neutral-800 dark:bg-neutral-900"
            >
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Showing <span class="font-semibold text-gray-900 dark:text-white">{{ offset + 1 }}–{{ Math.min(offset + limit, stats.total) }}</span>
                of <span class="font-semibold text-gray-900 dark:text-white">{{ stats.total }}</span> members
              </p>
              <div class="flex gap-2">
                <UButton
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-chevron-left"
                  :disabled="!canGoPrevious || pending"
                  class="rounded-xl"
                  @click="goPrevious"
                >
                  Previous
                </UButton>
                <UButton
                  color="primary"
                  variant="soft"
                  trailing-icon="i-lucide-chevron-right"
                  :disabled="!canGoNext || pending"
                  class="rounded-xl"
                  @click="goNext"
                >
                  Next
                </UButton>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
type CommunityUser = {
  id: string
  email: string
  full_name: string
  is_active: boolean
  is_verified: boolean
  date_joined: string
  profile_picture: string | null
  is_superuser: boolean
  is_staff?: boolean
  google_id: string | null
}

type CommunityMember = {
  id: string
  user: CommunityUser
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
}

type CommunityResponse = {
  count: number
  next: string | null
  previous: string | null
  results: CommunityMember[]
}

const { get } = useApi()
const endpoints = useEndpoints()

// State
const searchInput = ref('')
const debouncedSearch = ref('')
const layout = ref<'grid' | 'list'>('grid')
const limit = ref(12)
const offset = ref(0)

// Filter states
const yearFilter = ref<string[]>([])
const verifiedFilter = ref<string>('')
const courseFilter = ref<string[]>([])
const staffFilter = ref<string>('all')

// Filter options
const yearOptions = [
  { label: 'Year 1', value: '1' },
  { label: 'Year 2', value: '2' },
  { label: 'Year 3', value: '3' },
  { label: 'Year 4', value: '4' },
  { label: 'Year 5+', value: '5' },
  { label: 'Alumni', value: 'alumni' }
]

const verificationOptions = [
  { label: '✓ Verified', value: 'true' },
  { label: '⏳ Pending', value: 'false' }
]

const roleOptions = [
  { label: 'All Members', value: 'all', icon: 'i-lucide-users' },
  { label: 'Staff Only', value: 'staff', icon: 'i-lucide-shield' },
  { label: 'Non-Staff', value: 'non-staff', icon: 'i-lucide-user' }
]

const limitOptions = [
  { label: '12 / page', value: 12 },
  { label: '18 / page', value: 18 },
  { label: '24 / page', value: 24 }
]

const layoutItems = [
  { label: 'Grid', value: 'grid', icon: 'i-lucide-layout-grid' },
  { label: 'List', value: 'list', icon: 'i-lucide-layout-list' }
]

// Helpers
const toggleArrayFilter = (arr: string[], value: string) => {
  const idx = arr.indexOf(value)
  if (idx === -1) arr.push(value)
  else arr.splice(idx, 1)
}

let searchTimeout: ReturnType<typeof setTimeout> | undefined
watch(searchInput, (value) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    debouncedSearch.value = value.trim()
    offset.value = 0
  }, 350)
})

watch([debouncedSearch, limit, yearFilter, verifiedFilter, courseFilter, staffFilter], () => {
  offset.value = 0
})


useSeoPage({
  title: `Community  |  Mut Tech Club  Members  |  ${useAppConfig().site.title}`,
  description:"Browse the MUT Tech Club community directory. Discover members, explore their skills, and connect with collaborators across software, AI, data, and product development. Join us to innovate and grow together!"
})

const { data, pending, error, refresh } = await useAsyncData<CommunityResponse>(
  'community-members',
  () =>
    get<CommunityResponse>(
      endpoints.user.community,
      {
        limit: limit.value,
        offset: offset.value,
        ...(debouncedSearch.value ? { search: debouncedSearch.value } : {}),
        ...(verifiedFilter.value ? { is_verified_member: verifiedFilter.value } : {}),
        ...(yearFilter.value.length === 1 ? { year_of_study: yearFilter.value[0] } : {})
      },
      true
    ),
  {
    watch: [debouncedSearch, limit, offset, yearFilter, verifiedFilter, staffFilter]
  }
)

const allMembers = computed<CommunityMember[]>(() => data.value?.results ?? [])

const courseOptions = computed(() => {
  const courses = new Set<string>()
  allMembers.value.forEach(m => { if (m.course) courses.add(m.course) })
  return Array.from(courses).sort().map(c => ({ label: c, value: c }))
})

const filteredMembers = computed(() => {
  let members = [...allMembers.value]
  if (courseFilter.value.length > 0) {
    members = members.filter(m => courseFilter.value.includes(m.course))
  }
  if (staffFilter.value === 'staff') {
    members = members.filter(m => m.user?.is_staff === true)
  } else if (staffFilter.value === 'non-staff') {
    members = members.filter(m => !m.user?.is_staff)
  }
  return members
})

const stats = computed(() => ({
  total: data.value?.count ?? 0,
  verified: filteredMembers.value.filter(m => m.is_verified_member).length,
  courses: new Set(filteredMembers.value.map(m => m.course).filter(Boolean)).size
}))

const hasActiveFilters = computed(() =>
  !!(searchInput.value || yearFilter.value.length > 0 || verifiedFilter.value || courseFilter.value.length > 0 || staffFilter.value !== 'all')
)

const activeFiltersList = computed(() => {
  const filters = []
  if (searchInput.value) filters.push({ key: 'search', label: `"${searchInput.value}"` })
  if (yearFilter.value.length > 0) filters.push({ key: 'year', label: yearFilter.value.map(y => `Y${y}`).join(', ') })
  if (verifiedFilter.value) filters.push({ key: 'verified', label: verifiedFilter.value === 'true' ? 'Verified' : 'Pending' })
  if (courseFilter.value.length > 0) filters.push({ key: 'course', label: courseFilter.value.join(', ') })
  if (staffFilter.value !== 'all') filters.push({ key: 'role', label: roleOptions.find(r => r.value === staffFilter.value)?.label ?? '' })
  return filters
})

const removeFilter = (key: string) => {
  if (key === 'search') { searchInput.value = ''; debouncedSearch.value = '' }
  if (key === 'year') yearFilter.value = []
  if (key === 'verified') verifiedFilter.value = ''
  if (key === 'course') courseFilter.value = []
  if (key === 'role') staffFilter.value = 'all'
  offset.value = 0
}

const resetAllFilters = () => {
  yearFilter.value = []
  verifiedFilter.value = ''
  courseFilter.value = []
  staffFilter.value = 'all'
  offset.value = 0
}

const resetAll = () => {
  resetAllFilters()
  searchInput.value = ''
  debouncedSearch.value = ''
}

const newestMemberLabel = computed(() => {
  if (!filteredMembers.value.length) return 'No members yet'
  return [...filteredMembers.value]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]?.full_name ?? 'No members yet'
})

const canGoPrevious = computed(() => offset.value > 0)
const canGoNext = computed(() => Boolean(data.value?.next))
const goPrevious = () => { offset.value = Math.max(0, offset.value - limit.value) }
const goNext = () => { if (canGoNext.value) offset.value += limit.value }

const splitValues = (value: string | null | undefined) =>
  (value ?? '').split(',').map(i => i.trim()).filter(Boolean)

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
</script>