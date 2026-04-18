<template>
  <div class="min-h-screen bg-gradient-to-b from-primary/5 via-transparent to-transparent">
    <div class="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div class="flex flex-col gap-4 rounded-3xl border border-primary/10 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-primary/20 dark:bg-neutral-950/80 sm:flex-row sm:items-start sm:justify-between">
        <div class="max-w-2xl">
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Account Settings
          </p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Manage your MUT Tech Club preferences
          </h1>
          <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            View transaction logs, choose how you want notifications, switch theme,
            check this signed-in session, and jump to your account details.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <UButton
            icon="i-lucide-user-round-cog"
            to="/account"
            v-if="isLoggedIn"
          >
            Edit Profile
          </UButton>
          <UButton
            icon="i-lucide-log-in"
            to="/auth/login"
            v-else
          >
            Log In
          </UButton>
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-refresh-cw"
            :loading="pending"
            @click="refresh"
          >
            Refresh
          </UButton>
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-user-plus"
            to="/join"
            v-if="!isLoggedIn"
            class="hidden sm:inline-flex"
          >
            Join the Club
          </UButton>
        </div>
      </div>

      <div class="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div class="space-y-6">
          <UCard>
            <template #header>
              <div class="flex items-center justify-between gap-3">
                <div>
                  <h2 class="text-lg font-semibold">
                    Account Status
                  </h2>
                  <p class="text-sm text-muted-foreground">
                    Your current profile and membership state.
                  </p>
                </div>
                <UBadge
                  :color="isLoggedIn ? 'success' : 'neutral'"
                  variant="soft"
                >
                  {{ isLoggedIn ? "Logged in" : "Guest" }}
                </UBadge>
              </div>
            </template>

            <div
              v-if="pending"
              class="flex justify-center py-12"
            >
              <UIcon
                name="i-lucide-loader-2"
                class="size-6 animate-spin text-primary"
              />
            </div>

            <div
              v-else-if="profileError"
              class="space-y-4"
            >
              <div class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-950/60 dark:bg-red-950/20 dark:text-red-300">
                {{ profileError }}
              </div>
              <UButton
                color="neutral"
                variant="outline"
                icon="i-lucide-refresh-cw"
                @click="refresh"
              >
                Try Again
              </UButton>
            </div>

            <div
              v-else-if="isLoggedIn"
              class="space-y-5"
            >
              <div class="flex items-center gap-4">
                <UAvatar
                  :src="userAvatar"
                  :alt="displayName"
                  size="3xl"
                  class="ring-4 ring-primary/10"
                />

                <div class="min-w-0">
                  <h3 class="truncate text-lg font-semibold">
                    {{ displayName }}
                  </h3>
                  <p class="truncate text-sm text-muted-foreground">
                    {{ displayEmail }}
                  </p>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <UBadge
                      color="success"
                      variant="soft"
                    >
                      <UIcon
                        name="i-lucide-circle-check-big"
                        class="mr-1 size-3.5"
                      />
                      Signed In
                    </UBadge>
                    <UBadge
                      v-if="isVerified"
                      color="primary"
                      variant="soft"
                    >
                      <UIcon
                        name="i-lucide-badge-check"
                        class="mr-1 size-3.5"
                      />
                      Verified
                    </UBadge>
                    <UBadge
                      v-if="isMember"
                      color="success"
                      variant="soft"
                    >
                      <UIcon
                        name="i-lucide-users"
                        class="mr-1 size-3.5"
                      />
                      Member
                    </UBadge>
                  </div>
                </div>
              </div>

              <div class="grid gap-3 sm:grid-cols-2">
                <div class="rounded-2xl border bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                  <p class="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Member Since
                  </p>
                  <p class="mt-2 text-sm font-medium">
                    {{ formatDate(memberSince) }}
                  </p>
                </div>
                <div class="rounded-2xl border bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                  <p class="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Last Updated
                  </p>
                  <p class="mt-2 text-sm font-medium">
                    {{ formatRelativeTime(profile?.updated_at) }}
                  </p>
                </div>
                <div class="rounded-2xl border bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                  <p class="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Phone
                  </p>
                  <p class="mt-2 text-sm font-medium">
                    {{ profile?.phone_number || "Not added yet" }}
                  </p>
                </div>
                <div class="rounded-2xl border bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                  <p class="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Course
                  </p>
                  <p class="mt-2 text-sm font-medium">
                    {{ profile?.course || "Not added yet" }}
                  </p>
                </div>
              </div>
            </div>

            <div
              v-else
              class="space-y-4"
            >
              <div class="rounded-2xl border border-dashed p-5">
                <h3 class="text-base font-semibold">
                  Sign in to unlock account settings
                </h3>
                <p class="mt-2 text-sm text-muted-foreground">
                  Notification preferences and theme controls still work on this device,
                  but account details, transaction logs, and session info need a signed-in account.
                </p>
              </div>

              <div class="flex flex-wrap gap-3">
                <UButton
                  icon="i-lucide-log-in"
                  to="/auth/login"
                >
                  Log In
                </UButton>
                <UButton
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-user-plus"
                  to="/join"
                >
                  Join the Club
                </UButton>
              </div>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <div>
                <h2 class="text-lg font-semibold">
                  Quick Actions
                </h2>
                <p class="text-sm text-muted-foreground">
                  Jump to the pages people usually need from settings.
                </p>
              </div>
            </template>

            <div class="grid gap-3">
              <UButton
                class="justify-between"
                color="neutral"
                variant="outline"
                icon="i-lucide-user-round-cog"
                to="/account"
                v-if="isLoggedIn"
              >
                Edit profile details
              </UButton>
              <UButton
                class="justify-between"
                color="neutral"
                variant="outline"
                icon="i-lucide-log-in"
                to="/auth/login"
                v-else
              >
                Log in to edit profile
              </UButton>
              <UButton
                class="justify-between"
                color="neutral"
                variant="outline"
                icon="i-lucide-ticket"
                to="/support"
              >
                Contact support
              </UButton>
              <UButton
                class="justify-between"
                color="neutral"
                variant="outline"
                icon="i-lucide-calendar-check-2"
                to="/events"
              >
                View upcoming events
              </UButton>
              <UButton
                class="justify-between"
                color="neutral"
                variant="outline"
                icon="i-lucide-power"
                @click="signOut"
                v-if="isLoggedIn"
              >
                Sign out
              </UButton>
            </div>
          </UCard>
        </div>

        <div class="space-y-6">
          <UCard>
            <template #header>
              <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 class="text-lg font-semibold">
                    Notifications
                  </h2>
                  <p class="text-sm text-muted-foreground">
                    Choose the updates you want to receive from the club.
                  </p>
                </div>
                <UBadge variant="soft">
                  Saved on this device
                </UBadge>
              </div>
            </template>

            <div class="grid gap-6 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
              <div class="space-y-2">
                <label class="text-sm font-medium">Notification type</label>
                <USelect
                  v-model="notificationType"
                  :items="notificationOptions"
                  value-key="value"
                  label-key="label"
                  icon="i-lucide-bell-ring"
                  class="w-full"
                />
                <p class="text-sm text-muted-foreground">
                  {{ activeNotificationDescription }}
                </p>
              </div>

              <div class="space-y-3">
                <p class="text-sm font-medium">
                  Delivery channels
                </p>
                <div class="flex flex-wrap gap-3">
                  <button
                    v-for="channel in notificationChannelOptions"
                    :key="channel.key"
                    type="button"
                    class="flex min-w-[170px] items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition"
                    :class="notificationChannels[channel.key]
                      ? 'border-primary bg-primary/5 text-primary dark:border-primary/50'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary/40 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300'"
                    @click="toggleNotificationChannel(channel.key)"
                  >
                    <div>
                      <p class="text-sm font-medium">
                        {{ channel.label }}
                      </p>
                      <p class="text-xs text-muted-foreground">
                        {{ channel.description }}
                      </p>
                    </div>
                    <UIcon
                      :name="notificationChannels[channel.key] ? 'i-lucide-check-circle-2' : 'i-lucide-circle'"
                      class="size-5 shrink-0"
                    />
                  </button>
                </div>
              </div>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 class="text-lg font-semibold">
                    Appearance
                  </h2>
                  <p class="text-sm text-muted-foreground">
                    Switch between light and dark mode using the site theme control.
                  </p>
                </div>
                <ClientOnly>
                  <UBadge variant="soft">
                    {{ colorModeLabel }}
                  </UBadge>
                </ClientOnly>
              </div>
            </template>

            <div class="flex flex-col gap-4 rounded-2xl border bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-base font-semibold">
                  Theme
                </p>
                <p class="mt-1 text-sm text-muted-foreground">
                  Use the existing color mode component to match your preferred look.
                </p>
              </div>

              <ColorModeButton />
            </div>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 class="text-lg font-semibold">
                    Transaction Logs
                  </h2>
                  <p class="text-sm text-muted-foreground">
                    Recent payment activity from the profile data available on this site.
                  </p>
                </div>
                <UBadge variant="soft">
                  {{ transactionLogs.length }} found
                </UBadge>
              </div>
            </template>

            <div
              v-if="transactionLogs.length"
              class="space-y-3"
            >
              <div
                v-for="transaction in transactionLogs"
                :key="transaction.id"
                class="rounded-2xl border p-4 dark:border-neutral-800"
              >
                <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                      <p class="text-sm font-semibold">
                        {{ transaction.title }}
                      </p>
                      <UBadge
                        :color="getTransactionStatusColor(transaction.status)"
                        variant="soft"
                        size="sm"
                      >
                        {{ transaction.status }}
                      </UBadge>
                    </div>
                    <p class="mt-1 text-sm text-muted-foreground">
                      Ref: {{ transaction.reference }}
                    </p>
                    <p class="mt-1 text-xs text-muted-foreground">
                      {{ transaction.method }} • {{ formatDate(transaction.date) }}
                    </p>
                  </div>

                  <div class="text-left sm:text-right">
                    <p class="text-lg font-semibold">
                      {{ formatCurrency(transaction.amount) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-else
              class="rounded-2xl border border-dashed p-6 text-center dark:border-neutral-800"
            >
              <UIcon
                name="i-lucide-receipt-text"
                class="mx-auto size-10 text-muted-foreground"
              />
              <h3 class="mt-3 text-base font-semibold">
                No transaction logs yet
              </h3>
              <p class="mt-2 text-sm text-muted-foreground">
                When membership or event payments are available on your account,
                they will show up here.
              </p>
            </div>
          </UCard>

          <div class="grid gap-6 lg:grid-cols-2">
            <UCard>
              <template #header>
                <div>
                  <h2 class="text-lg font-semibold">
                    Where You&apos;re Logged In
                  </h2>
                  <p class="text-sm text-muted-foreground">
                    A quick view of the current signed-in browser session.
                  </p>
                </div>
              </template>

              <div
                v-if="isLoggedIn"
                class="space-y-3"
              >
                <div
                  v-for="item in sessionItems"
                  :key="item.label"
                  class="flex items-start justify-between gap-4 rounded-2xl border bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div>
                    <p class="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {{ item.label }}
                    </p>
                    <p class="mt-1 text-sm font-medium">
                      {{ item.value }}
                    </p>
                  </div>
                  <UIcon
                    :name="item.icon"
                    class="mt-1 size-5 text-primary"
                  />
                </div>
              </div>

              <div
                v-else
                class="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground dark:border-neutral-800"
              >
                Sign in to see the current device and browser session details.
              </div>
            </UCard>

            <UCard>
              <template #header>
                <div>
                  <h2 class="text-lg font-semibold text-red-600 dark:text-red-400">
                    Danger Zone
                  </h2>
                  <p class="text-sm text-muted-foreground">
                    Careful actions that affect your account access.
                  </p>
                </div>
              </template>

              <div class="space-y-4">
                <div class="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-950/60 dark:bg-red-950/20">
                  <p class="text-sm font-medium text-red-700 dark:text-red-300">
                    Delete account
                  </p>
                  <p class="mt-2 text-sm text-red-600/90 dark:text-red-300/90">
                    I did not find a self-service delete API in this app, so this button
                    opens a guided confirmation and sends the user to support instead of
                    pretending the account was deleted.
                  </p>
                </div>

                <UButton
                  color="error"
                  variant="outline"
                  icon="i-lucide-trash-2"
                  @click="isDeleteModalOpen = true"
                  :disabled="!isLoggedIn"
                >
                  Delete Account
                </UButton>
                <p v-if="!isLoggedIn" class="text-sm text-muted-foreground">
                  Sign in first to manage account deletion safely.
                </p>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </div>

    <UModal
      v-model:open="isDeleteModalOpen"
      title="Delete account"
    >
      <template #body>
        <div class="space-y-4">
          <p class="text-sm text-muted-foreground">
            This site does not appear to expose a direct delete-account endpoint yet.
            To avoid a broken or unsafe flow, the best next step is to contact support
            so the team can help remove the account properly.
          </p>

          <div class="rounded-2xl border bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <p class="text-sm font-medium">
              Suggested next step
            </p>
            <p class="mt-1 text-sm text-muted-foreground">
              Open the support page and request account deletion from the club team.
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <UButton
              icon="i-lucide-life-buoy"
              to="/support"
              @click="isDeleteModalOpen = false"
            >
              Go to Support
            </UButton>
            <UButton
              color="neutral"
              variant="outline"
              @click="isDeleteModalOpen = false"
            >
              Cancel
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

type NotificationType = 'all' | 'important' | 'none'
type NotificationChannelKey
  = | 'email'
    | 'inApp'
    | 'events'
    | 'community'

type NotificationChannels = Record<NotificationChannelKey, boolean>

type NestedUser = {
  id?: string | number | null
  email?: string | null
  full_name?: string | null
  display_name?: string | null
  is_active?: boolean
  is_verified?: boolean
  date_joined?: string | null
  profile_picture?: string | null
}

type TransactionLike = Record<string, unknown>

type ProfileData = {
  id?: string | number | null
  user?: NestedUser | null
  full_name?: string | null
  email?: string | null
  phone_number?: string | null
  course?: string | null
  year_of_study?: string | null
  created_at?: string | null
  updated_at?: string | null
  date_joined?: string | null
  profile_picture?: string | null
  is_verified_member?: boolean
  is_verified?: boolean
  is_active?: boolean
  transactions?: TransactionLike[] | null
  transaction_logs?: TransactionLike[] | null
  payment_logs?: TransactionLike[] | null
  payments?: TransactionLike[] | null
  membership_payments?: TransactionLike[] | null
}

type ApiResponse = {
  success?: boolean
  data?: ProfileData | { user?: ProfileData | null } | null
  user?: ProfileData | null
}

type TransactionLog = {
  id: string
  title: string
  amount: number | null
  status: string
  reference: string
  date: string | null
  method: string
}

const auth = useAuthStore()
const endpoints = useEndpoints()
const { get } = useApi()
const colorMode = useColorMode()
const router = useRouter()

const profile = ref<ProfileData | null>(null)
const pending = ref(false)
const profileError = ref<string | null>(null)
const isDeleteModalOpen = ref(false)

const sessionInfo = ref({
  device: 'Desktop',
  browser: 'Unknown browser',
  timezone: 'Africa/Nairobi',
  language: 'en'
})

const notificationType = useLocalStorage<NotificationType>(
  'mut-settings-notification-type',
  'all'
)

const notificationChannels = useLocalStorage<NotificationChannels>(
  'mut-settings-notification-channels',
  {
    email: true,
    inApp: true,
    events: true,
    community: false
  }
)

const notificationOptions = [
  {
    label: 'All activity',
    value: 'all',
    description: 'Get updates about events, community activity, and account actions.'
  },
  {
    label: 'Important only',
    value: 'important',
    description: 'Only receive high-priority club and account updates.'
  },
  {
    label: 'None',
    value: 'none',
    description: 'Turn off optional notifications on this device.'
  }
] satisfies Array<{
  label: string
  value: NotificationType
  description: string
}>

const notificationChannelOptions = [
  {
    key: 'email',
    label: 'Email',
    description: 'Announcements and account updates'
  },
  {
    key: 'inApp',
    label: 'In-app',
    description: 'Useful updates inside the website'
  },
  {
    key: 'events',
    label: 'Event reminders',
    description: 'Reminders before workshops and meetups'
  },
  {
    key: 'community',
    label: 'Community highlights',
    description: 'Occasional updates from the club community'
  }
] satisfies Array<{
  key: NotificationChannelKey
  label: string
  description: string
}>

const isLoggedIn = computed(() => auth.isAuthenticated)

const isProfileData = (value: unknown): value is ProfileData => {
  if (!value || typeof value !== 'object') {
    return false
  }

  return [
    'phone_number',
    'course',
    'created_at',
    'updated_at',
    'transactions',
    'payment_logs'
  ].some(key => key in (value as Record<string, unknown>))
}

const normalizeProfile = (
  payload: ApiResponse | ProfileData | null | undefined
): ProfileData | null => {
  if (!payload) {
    return null
  }

  const response = payload as ApiResponse
  const directData = response.data
  const nestedData
    = response.data
      && typeof response.data === 'object'
      && 'user' in response.data
      ? (response.data as { user?: ProfileData | null }).user
      : undefined

  if (isProfileData(directData)) {
    return directData
  }

  if (isProfileData(nestedData)) {
    return nestedData
  }

  if (isProfileData(response.user)) {
    return response.user
  }

  return isProfileData(payload) ? payload : null
}

const refresh = async () => {
  if (!auth.token) {
    profile.value = null
    profileError.value = null
    return
  }

  pending.value = true
  profileError.value = null

  try {
    const response = await get<ApiResponse>(endpoints.user.profile, {}, true)
    profile.value = normalizeProfile(response)
  } catch (error) {
    profileError.value = 'We could not load your settings right now.'
    console.error('Settings profile load error:', error)
  } finally {
    pending.value = false
  }
}




const displayName = computed(
  () =>
    profile.value?.full_name
    || profile.value?.user?.full_name
    || auth.user?.full_name
    || auth.user?.display_name
    || 'Club member'
)

const displayEmail = computed(
  () =>
    profile.value?.email
    || profile.value?.user?.email
    || auth.user?.email
    || 'No email available'
)

const userAvatar = computed(
  () =>
    profile.value?.profile_picture
    || profile.value?.user?.profile_picture
    || auth.user?.profile_picture
    || undefined
)

const isVerified = computed(
  () =>
    !!profile.value?.is_verified
    || !!profile.value?.user?.is_verified
    || !!auth.user?.is_verified
)

const isMember = computed(() => !!profile.value?.is_verified_member)

const memberSince = computed(
  () =>
    profile.value?.created_at
    || profile.value?.user?.date_joined
    || profile.value?.date_joined
    || null
)

const activeNotificationDescription = computed(() => {
  return (
    notificationOptions.find(option => option.value === notificationType.value)
      ?.description ?? notificationOptions[0]?.description ?? ''
  )
})

const colorModeLabel = computed(() => {
  if (colorMode.value === 'dark') {
    return 'Dark mode'
  }

  if (colorMode.value === 'light') {
    return 'Light mode'
  }

  return 'System'
})


const fetchTransactions = async () => {
  try {
    const response = await get<Record<string, unknown>>(endpoints.payments.my_payments, {}, true)
    const payload = (response as any).data ?? response

    if (Array.isArray(payload)) {
      return payload
    }

    if (Array.isArray(payload.results)) {
      return payload.results
    }

    if (Array.isArray(payload.payments)) {
      return payload.payments
    }

    return []
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return []
  }
}

const { data: rawTransactionLogs, error: transactionsError, refresh: refreshTransactions } = useAsyncData<TransactionLike[]>(
  'profile-transactions',
  fetchTransactions,
  {
    immediate: true,
    default: () => []
  }
)

const transactionLogs = computed<TransactionLog[]>(() => {
  return (rawTransactionLogs.value ?? []).map((item, index) => normalizeTransaction(item, index))
})

const sessionItems = computed(() => [
  {
    label: 'Device',
    value: sessionInfo.value.device,
    icon: 'i-lucide-monitor-smartphone'
  },
  {
    label: 'Browser',
    value: sessionInfo.value.browser,
    icon: 'i-lucide-globe'
  },
  {
    label: 'Timezone',
    value: sessionInfo.value.timezone,
    icon: 'i-lucide-clock-3'
  },
  {
    label: 'Language',
    value: sessionInfo.value.language,
    icon: 'i-lucide-languages'
  }
])

const toggleNotificationChannel = (key: NotificationChannelKey) => {
  notificationChannels.value = {
    ...notificationChannels.value,
    [key]: !notificationChannels.value[key]
  }
}

const normalizeTransaction = (
  item: TransactionLike,
  index: number
): TransactionLog => {
  const amountCandidate
    = item.amount
      ?? item.total_amount
      ?? item.paid_amount
      ?? item.payment_amount
      ?? null

  const parsedAmount
    = typeof amountCandidate === 'number'
      ? amountCandidate
      : typeof amountCandidate === 'string'
        ? Number(amountCandidate)
        : null

  return {
    id: String(
      item.id
      ?? item.transaction_id
      ?? item.checkout_request_id
      ?? item.reference
      ?? `transaction-${index}`
    ),
    title: String(
      item.description
      ?? item.payment_type
      ?? item.type
      ?? item.title
      ?? 'Membership payment'
    ),
    amount: Number.isFinite(parsedAmount) ? parsedAmount : null,
    status: String(item.status ?? item.payment_status ?? 'Pending'),
    reference: String(
      item.reference
      ?? item.transaction_id
      ?? item.checkout_request_id
      ?? item.mpesa_receipt_number
      ?? 'Awaiting reference'
    ),
    date: String(
      item.paid_at
      ?? item.created_at
      ?? item.updated_at
      ?? item.transaction_date
      ?? ''
    ) || null,
    method: String(item.payment_method ?? item.method ?? 'M-PESA')
  }
}

const getTransactionStatusColor = (status: string) => {
  const normalized = status.toLowerCase()

  if (['success', 'successful', 'completed', 'paid'].includes(normalized)) {
    return 'success'
  }

  if (['pending', 'processing', 'queued'].includes(normalized)) {
    return 'warning'
  }

  if (['failed', 'cancelled', 'canceled', 'declined'].includes(normalized)) {
    return 'error'
  }

  return 'neutral'
}

const formatDate = (value?: string | null) => {
  if (!value) {
    return 'Not available'
  }

  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatRelativeTime = (value?: string | null) => {
  if (!value) {
    return 'Not available'
  }

  const now = new Date().getTime()
  const then = new Date(value).getTime()
  const diffMs = now - then
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  }
  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
  }

  return formatDate(value)
}

const formatCurrency = (amount?: number | null) => {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return 'KES -'
  }

  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0
  }).format(amount)
}

const detectBrowser = (userAgent: string) => {
  if (userAgent.includes('Edg')) return 'Microsoft Edge'
  if (userAgent.includes('Chrome')) return 'Google Chrome'
  if (userAgent.includes('Firefox')) return 'Mozilla Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  return 'Unknown browser'
}

const detectDevice = (userAgent: string) => {
  if (/iPad|Tablet/i.test(userAgent)) return 'Tablet'
  if (/Mobile|Android|iPhone/i.test(userAgent)) return 'Mobile'
  return 'Desktop'
}

onMounted(() => {
  const userAgent = window.navigator.userAgent || ''

  sessionInfo.value = {
    device: detectDevice(userAgent),
    browser: detectBrowser(userAgent),
    timezone:
      Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Nairobi',
    language: window.navigator.language || 'en'
  }
})

const signOut = async () => {
  auth.logout()
  await router.push('/auth/login')
}

watch(
  () => auth.token,
  async (token) => {
    await refresh()

    if (token) {
      await refreshTransactions()
    }
  },
  { immediate: true }
)
</script>
