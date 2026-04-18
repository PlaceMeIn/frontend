<template>
  <section class="min-h-screen bg-gradient-to-b from-primary-50/40 via-white to-white dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
    <div class="mx-auto flex max-w-7xl flex-col gap-8 px-2 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div class="">
        <div class="grid gap-8 px-0 py-0 lg:grid-cols-[1.4fr_0.8fr] lg:px-0 lg:py-4">
          <div class="space-y-5">
            <div class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <UIcon
                name="i-lucide-users"
                class="h-4 w-4"
              />
              MUT Tech Club Community
            </div>

            <div class="space-y-3">
              <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                Meet the builders, designers, and problem-solvers in our club.
              </h1>
              <p class="max-w-2xl text-sm leading-6 text-gray-600 sm:text-base dark:text-gray-300">
                Browse verified members, explore their skills and interests, and
                discover collaborators across software, AI, data, cloud, and
                product development.
              </p>
            </div>

            <div class="flex flex-wrap gap-3">
              <UBadge
                color="primary"
                variant="soft"
                size="lg"
              >
                {{ stats.total }} members
              </UBadge>
              <UBadge
                color="success"
                variant="soft"
                size="lg"
              >
                {{ stats.verified }} verified
              </UBadge>
              <UBadge
                color="neutral"
                variant="soft"
                size="lg"
              >
                {{ stats.courses }} courses represented
              </UBadge>
            </div>
          </div>

          <UCard
            :ui="{
              root: 'border border-primary-100/80 bg-primary-50/60 dark:border-neutral-800 dark:bg-neutral-900',
              body: 'p-5 sm:p-6'
            }"
          >
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <div class="rounded-2xl bg-white p-2 shadow-sm dark:bg-neutral-800">
                  <UIcon
                    name="i-lucide-search"
                    class="h-5 w-5 text-primary"
                  />
                </div>
                <div>
                  <h2 class="text-base font-semibold text-gray-900 dark:text-white">
                    Find your next collaborator
                  </h2>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Search by name, course, skills, or areas of interest.
                  </p>
                </div>
              </div>

              <UInput
                v-model="searchInput"
                icon="i-lucide-search"
                size="lg"
                placeholder="Search the community..."
                class="w-full shrink-0"
              />

              <div class="grid grid-cols-2 gap-3 shrink-0">
                <USelect
                  v-model="limit"
                  :items="limitOptions"
                  value-key="value"
                  label-key="label"
                  size="sm"
                  class="w-full shrink-0"
                />
              </div>

              <div class="mt-4">
                <div class="rounded-2xl bg-white p-4 dark:bg-neutral-800/80">
                  <p class="text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                    Newest Join
                  </p>
                  <p class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                    {{ newestMemberLabel }}
                  </p>
                </div>
              </div>

              <UButton
                v-if="searchInput"
                color="neutral"
                variant="soft"
                icon="i-lucide-x"
                class="w-full justify-center"
                @click="resetSearch"
              >
                Clear search
              </UButton>
            </div>
          </UCard>
        </div>
      </div>

      <div
        v-if="pending"
        class="sticky top-15 z-10 flex justify-center py-1"
      >
        <UProgress
          color="primary"
          class="w-full rounded-none"
          size="sm"
        />
      </div>

      <div
        v-if="error"
        class="py-10"
      >
        <ErrorState
          title="Failed to load community members"
          description="We couldn't fetch the community directory right now."
          @retry="refresh"
        />
      </div>

      <template v-else>
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Community Directory
            </h2>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {{ pageRange.start }}-{{ pageRange.end }} of {{ stats.total }} member{{
                stats.total === 1 ? "" : "s"
              }}
              visible
            </p>
          </div>
          <div>
            <URadioGroup
              v-model="layout"
              indicator="end"
              variant="card"
              orientation="horizontal"
              size="sm"
              value-key="value"
              :items="layoutItems"
              aria-label="Member layout"
            />
          </div>
        </div>

        <div
          v-if="members.length"
          :class="layout === 'grid'
            ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'
            : 'flex flex-col gap-4'"
        >
          <UCard
            v-for="member in members"
            :key="member.id"
            :ui="{
              root: layout === 'grid'
                ? 'h-full overflow-hidden border border-gray-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900'
                : 'overflow-hidden border border-gray-200/80 bg-white shadow-sm transition duration-200 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900',
              body: 'p-0'
            }"
          >
            <div
              :class="layout === 'grid' ? 'relative h-full' : 'relative'"
            >
              <NuxtLink
                :to="`/account/${member.id}`"
                :aria-label="`View ${member.full_name}'s profile`"
                class="absolute inset-0 z-10 rounded-[inherit]"
              />
              <template v-if="layout === 'grid'">
                <div class="relative border-b border-gray-100 bg-gradient-to-br from-primary-500 via-primary-400 to-cyan-400 px-3 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-6 dark:border-neutral-800">
                  <div class="absolute right-2 top-2 flex gap-2 sm:right-4 sm:top-4">
                    <UBadge
                      :color="member.is_verified_member ? 'success' : 'neutral'"
                      variant="solid"
                      size="sm"
                    >
                      {{
                        member.is_verified_member ? "Verified" : "Member"
                      }}
                    </UBadge>
                  </div>

                  <div class="flex items-center gap-3 pr-14 sm:gap-4 sm:pr-20">
                    <UAvatar
                      :src="member.user.profile_picture || undefined"
                      :alt="member.full_name"
                      size="xl"
                      class="ring-4 ring-white/70"
                    />

                    <div class="min-w-0">
                      <h3 class="truncate text-sm font-semibold text-white sm:text-lg">
                        {{ member.full_name }}
                      </h3>
                      <p class="truncate text-xs text-white/85 sm:text-sm">
                        {{ member.course }}
                      </p>
                      <p class="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/70 sm:text-xs">
                        Year {{ member.year_of_study }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="space-y-4 p-3 sm:space-y-5 sm:p-5">
                  <div class="grid gap-2 text-xs text-gray-600 dark:text-gray-300 sm:gap-3 sm:text-sm">
                    <div class="flex items-start gap-3">
                      <UIcon
                        name="i-lucide-mail"
                        class="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      />
                      <a
                        :href="`mailto:${member.email}`"
                        class="relative z-20 truncate transition hover:text-primary"
                      >
                        {{ member.email }}
                      </a>
                    </div>

                    <div class="flex items-start gap-3">
                      <UIcon
                        name="i-lucide-phone"
                        class="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      />
                      <a
                        :href="`tel:${member.phone_number}`"
                        class="relative z-20 transition hover:text-primary"
                      >
                        {{ member.phone_number }}
                      </a>
                    </div>

                    <div class="flex items-start gap-3">
                      <UIcon
                        name="i-lucide-calendar-days"
                        class="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      />
                      <span>Joined {{ formatDate(member.created_at) }}</span>
                    </div>
                  </div>

                  <div class="space-y-3">
                    <div>
                      <p class="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400 sm:text-xs">
                        Technical Skills
                      </p>
                      <div class="flex flex-wrap gap-2">
                        <UBadge
                          v-for="skill in splitValues(member.technical_skills)"
                          :key="`${member.id}-${skill}`"
                          color="primary"
                          variant="soft"
                          size="sm"
                        >
                          {{ skill }}
                        </UBadge>
                      </div>
                    </div>

                    <div>
                      <p class="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400 sm:text-xs">
                        Areas of Interest
                      </p>
                      <div class="flex flex-wrap gap-2">
                        <UBadge
                          v-for="interest in splitValues(member.areas_of_interest)"
                          :key="`${member.id}-${interest}`"
                          color="neutral"
                          variant="soft"
                          size="sm"
                        >
                          {{ interest }}
                        </UBadge>
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-neutral-800">
                    <UButton
                      v-if="member.github_link"
                      :to="member.github_link"
                      target="_blank"
                      rel="noopener noreferrer"
                      icon="i-lucide-github"
                      color="neutral"
                      variant="outline"
                      size="sm"
                      class="relative z-20 flex-1 justify-center"
                    >
                      GitHub
                    </UButton>

                    <UButton
                      v-if="member.portfolio_website"
                      :to="member.portfolio_website"
                      target="_blank"
                      rel="noopener noreferrer"
                      icon="i-lucide-globe"
                      color="primary"
                      variant="soft"
                      size="sm"
                      class="relative z-20 flex-1 justify-center"
                    >
                      Portfolio
                    </UButton>
                  </div>
                </div>
              </template>

              <template v-else>
                <div class="flex flex-col gap-5 p-4 sm:p-5 lg:flex-row lg:items-start lg:justify-between">
                  <div class="flex min-w-0 flex-1 items-start gap-4">
                    <UAvatar
                      :src="member.user.profile_picture || undefined"
                      :alt="member.full_name"
                      size="2xl"
                      class="shrink-0 ring-4 ring-primary-100 dark:ring-primary-900/40"
                    />

                    <div class="min-w-0 flex-1 space-y-4">
                      <div class="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-start sm:justify-between dark:border-neutral-800">
                        <div class="min-w-0">
                          <div class="flex flex-wrap items-center gap-2">
                            <h3 class="truncate text-lg font-semibold text-gray-900 dark:text-white">
                              {{ member.full_name }}
                            </h3>
                            <UBadge
                              :color="member.is_verified_member ? 'success' : 'neutral'"
                              variant="soft"
                              size="sm"
                            >
                              {{ member.is_verified_member ? "Verified" : "Member" }}
                            </UBadge>
                          </div>
                          <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            {{ member.course }} • Year {{ member.year_of_study }}
                          </p>
                          <p class="mt-2 text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                            Joined {{ formatDate(member.created_at) }}
                          </p>
                        </div>

                        <div class="flex flex-wrap gap-2">
                          <UButton
                            v-if="member.github_link"
                            :to="member.github_link"
                            target="_blank"
                            rel="noopener noreferrer"
                            icon="i-lucide-github"
                            color="neutral"
                            variant="outline"
                            size="sm"
                            class="relative z-20 justify-center"
                          >
                            GitHub
                          </UButton>

                          <UButton
                            v-if="member.portfolio_website"
                            :to="member.portfolio_website"
                            target="_blank"
                            rel="noopener noreferrer"
                            icon="i-lucide-globe"
                            color="primary"
                            variant="soft"
                            size="sm"
                            class="relative z-20 justify-center"
                          >
                            Portfolio
                          </UButton>
                        </div>
                      </div>

                      <div class="grid gap-3 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-2">
                        <div class="flex min-w-0 items-start gap-3">
                          <UIcon
                            name="i-lucide-mail"
                            class="mt-0.5 h-4 w-4 shrink-0 text-primary"
                          />
                          <a
                            :href="`mailto:${member.email}`"
                            class="relative z-20 truncate transition hover:text-primary"
                          >
                            {{ member.email }}
                          </a>
                        </div>

                        <div class="flex min-w-0 items-start gap-3">
                          <UIcon
                            name="i-lucide-phone"
                            class="mt-0.5 h-4 w-4 shrink-0 text-primary"
                          />
                          <a
                            :href="`tel:${member.phone_number}`"
                            class="relative z-20 truncate transition hover:text-primary"
                          >
                            {{ member.phone_number }}
                          </a>
                        </div>
                      </div>

                      <div class="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
                        <div>
                          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                            Technical Skills
                          </p>
                          <div class="flex flex-wrap gap-2">
                            <UBadge
                              v-for="skill in splitValues(member.technical_skills)"
                              :key="`${member.id}-${skill}`"
                              color="primary"
                              variant="soft"
                              size="sm"
                            >
                              {{ skill }}
                            </UBadge>
                          </div>
                        </div>

                        <div>
                          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                            Areas of Interest
                          </p>
                          <div class="flex flex-wrap gap-2">
                            <UBadge
                              v-for="interest in splitValues(member.areas_of_interest)"
                              :key="`${member.id}-${interest}`"
                              color="neutral"
                              variant="soft"
                              size="sm"
                            >
                              {{ interest }}
                            </UBadge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </UCard>
        </div>

        <div
          v-if="members.length"
          class="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800 dark:bg-neutral-900"
        >
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Page starting at offset {{ offset }} with {{ members.length }} result{{
              members.length === 1 ? "" : "s"
            }}.
          </p>

          <div class="flex gap-2">
            <UButton
              color="neutral"
              variant="outline"
              icon="i-lucide-chevron-left"
              :disabled="!canGoPrevious || pending"
              @click="goPrevious"
            >
              Previous
            </UButton>
            <UButton
              color="primary"
              variant="soft"
              trailing-icon="i-lucide-chevron-right"
              :disabled="!canGoNext || pending"
              @click="goNext"
            >
              Next
            </UButton>
          </div>
        </div>

        <div
          v-else
          class="py-10"
        >
          <EmptyState
            icon="i-lucide-users-x"
            title="No members found"
            description="Try a different name, skill, course, or interest."
            :action="'Clear search'"
            @action="resetSearch"
          />
        </div>
      </template>
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

const searchInput = ref('')
const debouncedSearch = ref('')
const layout = ref<'grid' | 'list'>('grid')
const limit = ref(12)
const offset = ref(0)

const limitOptions = [
  { label: '12 / page', value: 12 },
  { label: '18 / page', value: 18 },
  { label: '24 / page', value: 24 }
]

let searchTimeout: ReturnType<typeof setTimeout> | undefined

const layoutItems = [
  { label: 'Grid', value: 'grid', icon: 'i-lucide-layout-grid' },
  { label: 'List', value: 'list', icon: 'i-lucide-layout-list' }
]

watch(searchInput, (value) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    debouncedSearch.value = value.trim()
  }, 350)
})

watch([debouncedSearch, limit], () => {
  offset.value = 0
})

const { data, pending, error, refresh } = await useAsyncData<CommunityResponse>(
  'community-members',
  () =>
    get<CommunityResponse>(
      endpoints.user.community,
      {
        limit: limit.value,
        offset: offset.value,
        ...(debouncedSearch.value ? { search: debouncedSearch.value } : {})
      },
      true
    ),
  {
    watch: [debouncedSearch, limit, offset]
  }
)

const members = computed<CommunityMember[]>(() => data.value?.results ?? [])

const splitValues = (value: string | null | undefined) =>
  (value ?? '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)

const stats = computed(() => ({
  total: data.value?.count ?? 0,
  verified: members.value.filter(member => member.is_verified_member).length,
  courses: new Set(members.value.map(member => member.course).filter(Boolean))
    .size
}))

const newestMemberLabel = computed(() => {
  if (!members.value.length) {
    return 'No members yet'
  }

  const newest = [...members.value].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0]

  return newest?.full_name ?? 'No members yet'
})

const pageRange = computed(() => {
  if (!members.value.length) {
    return { start: 0, end: 0 }
  }

  return {
    start: offset.value + 1,
    end: offset.value + members.value.length
  }
})

const canGoPrevious = computed(() => offset.value > 0)
const canGoNext = computed(() => Boolean(data.value?.next))

const resetSearch = () => {
  searchInput.value = ''
  debouncedSearch.value = ''
  offset.value = 0
}

const goPrevious = () => {
  offset.value = Math.max(0, offset.value - limit.value)
}

const goNext = () => {
  if (!canGoNext.value) {
    return
  }

  offset.value += limit.value
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value))
</script>
