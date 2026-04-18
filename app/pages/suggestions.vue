<template>
  <section class="min-h-screen bg-gradient-to-b from-amber-50/70 via-white to-white px-4 py-10 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <div class="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div class="space-y-6">
          <div class="rounded-3xl border border-amber-200/70 bg-gradient-to-br from-amber-100 via-white to-primary-50 p-6 shadow-sm dark:border-neutral-800 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/30 sm:p-8">
            <div class="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-sm font-medium text-primary shadow-sm dark:bg-neutral-900/90">
              <UIcon
                name="i-lucide-lightbulb"
                class="h-4 w-4"
              />
              Suggestion Box
            </div>

            <div class="mt-5 space-y-4">
              <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Share ideas that make the club better.
              </h1>
              <p class="max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300 sm:text-base">
                Pitch a feature, flag a friction point, or suggest an experience
                we should build next. Clear, practical suggestions help the team
                review and ship faster.
              </p>
            </div>

            <div class="mt-6 grid gap-3 sm:grid-cols-3">
              <div class="rounded-2xl border border-white/70 bg-white/80 p-4 dark:border-neutral-800 dark:bg-neutral-900/80">
                <p class="text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                  Total Suggestions
                </p>
                <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ suggestionStats.total }}
                </p>
              </div>

              <div class="rounded-2xl border border-white/70 bg-white/80 p-4 dark:border-neutral-800 dark:bg-neutral-900/80">
                <p class="text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                  Under Review
                </p>
                <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ suggestionStats.underReview }}
                </p>
              </div>

              <div class="rounded-2xl border border-white/70 bg-white/80 p-4 dark:border-neutral-800 dark:bg-neutral-900/80">
                <p class="text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                  Categories
                </p>
                <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ suggestionStats.categories }}
                </p>
              </div>
            </div>
          </div>

          <UCard
            :ui="{
              root: 'border border-gray-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900',
              body: 'p-6 sm:p-7'
            }"
          >
            <div class="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  Submit a Suggestion
                </h2>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Strong suggestions are specific, actionable, and easy to test.
                </p>
              </div>

              <UBadge
                color="primary"
                variant="soft"
                size="sm"
              >
                {{ form.priorityLabel }}
              </UBadge>
            </div>

            <form
              class="space-y-6"
              @submit.prevent="submitSuggestion"
            >
              <div>
                <label
                  for="suggestion-title"
                  class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Title
                </label>
                <UInput
                  id="suggestion-title"
                  v-model="form.title"
                  name="title"
                  placeholder="Example: Add project collaboration workspaces"
                  size="lg"
                  class="w-full"
                />
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    for="suggestion-category"
                    class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Category
                  </label>
                  <USelectMenu
                    id="suggestion-category"
                    v-model="form.category"
                    :items="categories"
                    value-key="value"
                    label-key="label"
                    placeholder="Select a category"
                    size="lg"
                    class="w-full"
                  />
                </div>

                <div>
                  <label
                    class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Priority Level
                  </label>
                  <URadioGroup
                    v-model="form.priority"
                    indicator="end"
                    :items="priorities"
                    value-key="value"
                    orientation="horizontal"
                    variant="card"
                    size="sm"
                  />
                </div>
              </div>

              <div>
                <div class="mb-2 flex items-center justify-between gap-3">
                  <label
                    for="suggestion-description"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Description
                  </label>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ form.description.length }} characters
                  </span>
                </div>

                <UTextarea
                  id="suggestion-description"
                  v-model="form.description"
                  name="description"
                  placeholder="What problem does this solve, who benefits, and what would success look like?"
                  :rows="6"
                  autoresize
                  size="lg"
                  class="w-full"
                />
              </div>

              <div class="rounded-2xl border border-dashed border-amber-300/80 bg-amber-50/70 p-4 text-sm text-gray-600 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-gray-300">
                <div class="flex items-start gap-3">
                  <UIcon
                    name="i-lucide-sparkles"
                    class="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
                  />
                  <div class="space-y-1">
                    <p class="font-medium text-gray-900 dark:text-white">
                      Tip for better suggestions
                    </p>
                    <p>
                      Include the problem, the proposed solution, and the impact
                      you expect. That gives reviewers enough context to act on
                      it quickly.
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-3 pt-2 sm:flex-row">
                <UButton
                  type="submit"
                  color="primary"
                  size="lg"
                  :loading="isSubmitting"
                  class="flex-1 justify-center"
                >
                  <UIcon
                    name="i-lucide-send"
                    class="mr-2 h-4 w-4"
                  />
                  Submit Suggestion
                </UButton>

                <UButton
                  type="button"
                  color="neutral"
                  variant="outline"
                  size="lg"
                  class="justify-center"
                  @click="resetForm"
                >
                  Reset
                </UButton>
              </div>
            </form>
          </UCard>
        </div>

        <div class="space-y-6 lg:sticky lg:top-20">
          <UCard
            :ui="{
              root: 'border border-gray-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900',
              body: 'p-5 sm:p-6'
            }"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Suggestions
                </h2>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Fresh ideas from the community and their current momentum.
                </p>
              </div>

              <UBadge
                color="neutral"
                variant="soft"
                size="sm"
              >
                {{ displayedSuggestions.length }} shown
              </UBadge>
            </div>

            <div class="mt-5 space-y-4">
              <template v-if="loadingRecentSuggestions">
                <div
                  v-for="index in 3"
                  :key="index"
                  class="rounded-2xl border border-gray-200/80 p-5 dark:border-neutral-800"
                >
                  <div class="animate-pulse space-y-3">
                    <div class="flex gap-2">
                      <div class="h-5 w-24 rounded-full bg-gray-200 dark:bg-neutral-800" />
                      <div class="h-5 w-16 rounded-full bg-gray-200 dark:bg-neutral-800" />
                    </div>
                    <div class="h-5 w-2/3 rounded bg-gray-200 dark:bg-neutral-800" />
                    <div class="h-4 w-full rounded bg-gray-200 dark:bg-neutral-800" />
                    <div class="h-4 w-5/6 rounded bg-gray-200 dark:bg-neutral-800" />
                  </div>
                </div>
              </template>

              <UCard
                v-else-if="suggestionsError"
                :ui="{ root: 'border border-red-200/80 bg-red-50/60 dark:border-red-900/40 dark:bg-red-950/20' }"
              >
                <div class="flex items-start gap-3">
                  <UIcon
                    name="i-lucide-alert-circle"
                    class="mt-0.5 h-5 w-5 text-red-500"
                  />
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">
                      Couldn’t load suggestions
                    </p>
                    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Please try again in a moment.
                    </p>
                    <UButton
                      color="neutral"
                      variant="outline"
                      size="sm"
                      class="mt-3"
                      @click="refreshRecentSuggestions"
                    >
                      Retry
                    </UButton>
                  </div>
                </div>
              </UCard>

              <div
                v-else-if="!displayedSuggestions.length"
                class="rounded-2xl border border-dashed border-gray-300 p-8 text-center dark:border-neutral-800"
              >
                <UIcon
                  name="i-lucide-messages-square"
                  class="mx-auto h-8 w-8 text-gray-400"
                />
                <p class="mt-3 text-sm font-medium text-gray-900 dark:text-white">
                  No suggestions yet
                </p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Be the first to share an idea with the community.
                </p>
              </div>

              <template v-else>
                <article
                  v-for="suggestion in displayedSuggestions"
                  :key="suggestion.id"
                  class="rounded-2xl border border-gray-200/80 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div class="flex items-start justify-between gap-4">
                    <div class="min-w-0 flex-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <UBadge
                          :color="getCategoryColor(suggestion.categoryKey)"
                          variant="soft"
                        >
                          {{ suggestion.categoryLabel }}
                        </UBadge>

                        <UBadge
                          v-if="suggestion.priorityLabel"
                          :color="getPriorityColor(suggestion.priorityKey)"
                          variant="subtle"
                          size="sm"
                        >
                          {{ suggestion.priorityLabel }}
                        </UBadge>

                        <UBadge
                          v-if="suggestion.statusLabel"
                          :color="getStatusColor(suggestion.statusLabel)"
                          variant="outline"
                          size="sm"
                        >
                          {{ suggestion.statusLabel }}
                        </UBadge>
                      </div>

                      <h3 class="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
                        {{ suggestion.title }}
                      </h3>

                      <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                        {{ suggestion.description }}
                      </p>

                      <div class="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span class="inline-flex items-center gap-1.5">
                          <UIcon
                            name="i-lucide-thumbs-up"
                            class="h-4 w-4"
                          />
                          {{ suggestion.votesUp }} upvotes
                        </span>

                        <span class="inline-flex items-center gap-1.5">
                          <UIcon
                            name="i-lucide-thumbs-down"
                            class="h-4 w-4"
                          />
                          {{ suggestion.votesDown }} downvotes
                        </span>

                        <span
                          v-if="suggestion.commentsCount > 0"
                          class="inline-flex items-center gap-1.5"
                        >
                          <UIcon
                            name="i-lucide-message-circle"
                            class="h-4 w-4"
                          />
                          {{ suggestion.commentsCount }} comments
                        </span>

                        <span class="inline-flex items-center gap-1.5">
                          <UIcon
                            name="i-lucide-clock-3"
                            class="h-4 w-4"
                          />
                          {{ suggestion.dateLabel }}
                        </span>
                      </div>

                      <div
                        v-if="suggestion.adminFeedback"
                        class="mt-4 rounded-xl bg-primary/5 p-3 text-sm text-gray-600 dark:bg-primary/10 dark:text-gray-300"
                      >
                        <p class="font-medium text-gray-900 dark:text-white">
                          Admin Feedback
                        </p>
                        <p class="mt-1">
                          {{ suggestion.adminFeedback }}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              </template>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
type SuggestionResponseItem = {
  id: string | number
  title?: string | null
  category?: string | null
  priority?: string | null
  status?: string | null
  description?: string | null
  votes_up?: number | null
  votes_down?: number | null
  votes_count?: number | null
  comments_count?: number | null
  admin_feedback?: string | null
  created_at?: string | null
}

type SuggestionListResponse = {
  count?: number
  results?: SuggestionResponseItem[]
}

type SuggestionCreateResponse = {
  success?: boolean
  data?: SuggestionResponseItem
  suggestion?: SuggestionResponseItem
}

type DisplaySuggestion = {
  id: string | number
  title: string
  categoryKey: string
  categoryLabel: string
  priorityKey: string
  priorityLabel: string
  statusLabel: string
  description: string
  votesUp: number
  votesDown: number
  commentsCount: number
  adminFeedback: string
  createdAt: string | null
  dateLabel: string
}

const toast = useToast()
const { get, post } = useApi()
const endpoints = useEndpoints()

const categories = [
  { label: 'Feature Request', value: 'feature' },
  { label: 'Bug Report', value: 'bug_report' },
  { label: 'UI/UX Improvement', value: 'ui_ux_improvement' },
  { label: 'Performance', value: 'performance' },
  { label: 'Event Suggestion', value: 'event' },
  { label: 'Content Idea', value: 'content' },
  { label: 'Other', value: 'other' }
]

const priorities = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' }
]

const categoryLabelMap: Record<string, string> = Object.fromEntries(
  categories.map(item => [item.value, item.label])
)

const priorityLabelMap: Record<string, string> = Object.fromEntries(
  priorities.map(item => [item.value, item.label])
)

const form = ref({
  title: '',
  category: '',
  description: '',
  priority: 'medium',
  priorityLabel: 'Medium'
})

const isSubmitting = ref(false)

const normalizeKey = (value?: string | null) =>
  (value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

const humanize = (value?: string | null) => {
  const cleaned = (value || '').trim()

  if (!cleaned) {
    return ''
  }

  return cleaned
    .replace(/_/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase())
}

const formatRelativeDate = (value?: string | null) => {
  if (!value) {
    return 'Recently'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Recently'
  }

  const diffMs = date.getTime() - Date.now()
  const minutes = Math.round(diffMs / (1000 * 60))
  const hours = Math.round(diffMs / (1000 * 60 * 60))
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24))
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  if (Math.abs(minutes) < 60) {
    return formatter.format(minutes, 'minute')
  }

  if (Math.abs(hours) < 24) {
    return formatter.format(hours, 'hour')
  }

  if (Math.abs(days) < 7) {
    return formatter.format(days, 'day')
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const normalizeSuggestion = (suggestion: SuggestionResponseItem): DisplaySuggestion => {
  const categoryKey = normalizeKey(suggestion.category)
  const priorityKey = normalizeKey(suggestion.priority)
  const categoryLabel = categoryLabelMap[categoryKey] || humanize(suggestion.category) || 'Suggestion'
  const priorityLabel = priorityLabelMap[priorityKey] || humanize(suggestion.priority)
  const votesUp = Number(suggestion.votes_up ?? suggestion.votes_count ?? 0)
  const votesDown = Number(suggestion.votes_down ?? 0)

  return {
    id: suggestion.id,
    title: suggestion.title?.trim() || 'Untitled suggestion',
    categoryKey,
    categoryLabel,
    priorityKey,
    priorityLabel,
    statusLabel: humanize(suggestion.status),
    description: suggestion.description?.trim() || 'No extra description provided yet.',
    votesUp,
    votesDown,
    commentsCount: Number(suggestion.comments_count ?? 0),
    adminFeedback: suggestion.admin_feedback?.trim() || '',
    createdAt: suggestion.created_at || null,
    dateLabel: formatRelativeDate(suggestion.created_at)
  }
}

const {
  data: suggestionsResponse,
  pending: loadingRecentSuggestions,
  error: suggestionsError,
  refresh: refreshRecentSuggestions
} = await useAsyncData<SuggestionListResponse>(
  'suggestions-page',
  () => get<SuggestionListResponse>(endpoints.main.get_suggestions, {}, false),
  {
    default: () => ({
      count: 0,
      results: []
    })
  }
)

const normalizedSuggestions = computed(() =>
  (suggestionsResponse.value?.results || [])
    .map(normalizeSuggestion)
    .sort((a, b) => {
      const left = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const right = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return right - left
    })
)

const displayedSuggestions = computed(() => normalizedSuggestions.value.slice(0, 6))

const suggestionStats = computed(() => ({
  total: suggestionsResponse.value?.count ?? normalizedSuggestions.value.length,
  underReview: normalizedSuggestions.value.filter(item => item.statusLabel === 'Under Review').length,
  categories: new Set(normalizedSuggestions.value.map(item => item.categoryLabel)).size
}))

watch(
  () => form.value.priority,
  (value) => {
    form.value.priorityLabel = priorityLabelMap[value] || humanize(value) || 'Medium'
  },
  { immediate: true }
)

const submitSuggestion = async () => {
  if (!form.value.title.trim() || !form.value.category || !form.value.description.trim()) {
    toast.add({
      title: 'Missing details',
      description: 'Please fill in the title, category, and description fields.',
      color: 'warning',
      icon: 'i-lucide-alert-circle'
    })
    return
  }

  isSubmitting.value = true

  try {
    const payload = {
      title: form.value.title.trim(),
      category: form.value.category,
      description: form.value.description.trim(),
      priority: form.value.priority
    }

    const response = await post<SuggestionCreateResponse>(
      endpoints.main.update_suggestions,
      payload,
      true
    )

    const createdSuggestion = response?.data || response?.suggestion

    if (createdSuggestion) {
      suggestionsResponse.value = {
        count: (suggestionsResponse.value?.count ?? normalizedSuggestions.value.length) + 1,
        results: [createdSuggestion, ...(suggestionsResponse.value?.results || [])]
      }
    } else {
      await refreshRecentSuggestions()
    }

    resetForm()

    toast.add({
      title: 'Suggestion submitted',
      description: 'Thanks for sharing your idea. It has been sent for review.',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
  } catch (error) {
    console.error('Suggestion submission failed', error)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  form.value = {
    title: '',
    category: '',
    description: '',
    priority: 'medium',
    priorityLabel: 'Medium'
  }
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    feature_request: 'primary',
    bug_report: 'error',
    ui_ux_improvement: 'info',
    performance: 'success',
    event_suggestion: 'warning',
    other: 'neutral'
  }

  return colors[category] || 'neutral'
}

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    low: 'success',
    medium: 'warning',
    high: 'error'
  }

  return colors[priority] || 'neutral'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'Under Review': 'warning',
    'Approved': 'success',
    'Implemented': 'primary',
    'Declined': 'error'
  }

  return colors[status] || 'neutral'
}
</script>
