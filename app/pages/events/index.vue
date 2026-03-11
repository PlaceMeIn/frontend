<template>
  <div>
    <OnThisPage :sections="sections" />

    <!-- Hero -->
    <section
      id="hero"
      class="h-[400px] sm:h-[500px] md:h-[600px] relative flex items-center justify-center text-center px-4 scroll-mt-16"
    >
      <div class="relative z-10 max-w-4xl">
        <Typewriter
          :strings="['Events • Competitions • Bootcamps • Hackathons']"
          :type-speed="100"
          :delete-speed="50"
          :delay="100"
          :loop="true"
          class="text-2xl sm:text-3xl md:text-5xl font-bold text-white"
        />
        <p class="text-gray-200 mt-3 max-w-2xl text-base sm:text-lg md:text-xl">
          Join workshops, hackathons, and conferences that help you grow your
          tech skills.
        </p>
      </div>

      <img
        :src="eventsImg"
        alt="MUT Tech Events"
        class="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div
        class="absolute inset-0 bg-gradient-to-tr from-white/90 dark:from-black/90 via-black/40 to-transparent"
      ></div>
    </section>

    <!-- Countdown -->
    <section
      id="countdown"
      class="py-12 md:py-16 flex flex-col items-center text-center px-4 scroll-mt-16"
    >
      <h3 class="text-xl md:text-2xl font-bold mb-4">Next Event Starts In</h3>
      <CountdownTimer :targetDate="nextEventDate" />
    </section>

    <!-- Filters -->
    <section
      id="filters"
      class="sticky top-14 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-y border-gray-200 dark:border-neutral-800 scroll-mt-16"
    >
      <div class="max-w-6xl mx-auto px-4 py-3">
        <div
          class="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between"
        >
          <div class="flex gap-2 w-full sm:max-w-md">
            <UInput
              v-model="search"
              placeholder="Search events..."
              icon="i-lucide-search"
              size="md"
              class="flex-1"
              @update:model-value="onSearch"
            />
            <UButton
              icon="i-lucide-rotate-ccw"
              variant="outline"
              size="md"
              :disabled="isFiltersDefault"
              @click="resetFilters"
              class="shrink-0"
            />
          </div>

          <USelect
            v-model="sort"
            :items="sortOptions"
            value-key="value"
            label-key="label"
            icon="i-lucide-arrow-up-down"
            class="w-full sm:w-48"
            size="md"
            @update:model-value="onSearch"
          />
        </div>

        <div
          v-if="!isFiltersDefault"
          class="mt-2 text-xs text-gray-500 dark:text-gray-400"
        >
          Active:
          <span v-if="search" class="inline-flex items-center gap-1 mr-2">
            <UIcon name="i-lucide-search" class="w-3 h-3" />
            "{{ search }}"
          </span>
          <span v-if="sort !== 'Newest'" class="inline-flex items-center gap-1">
            <UIcon name="i-lucide-arrow-up-down" class="w-3 h-3" />
            {{ getSortLabel(sort) }}
          </span>
        </div>
      </div>
    </section>

    <!-- Upcoming Events -->
    <section
      id="upcoming-events"
      class="max-w-6xl mx-auto px-4 py-10 md:py-14 scroll-mt-16"
    >
      <div
        v-if="events.length > 0"
        class="text-sm text-gray-500 dark:text-gray-400 mb-3"
      >
        {{ events.length }} upcoming
        {{ events.length === 1 ? "event" : "events" }}
      </div>

      <div class="space-y-6">
        <div v-if="pending || loadingMore" class="flex justify-center py-8">
          <Loader />
        </div>

        <div v-else-if="error || loadingError" class="flex justify-center py-8">
          <ErrorState
            title="Failed to load events"
            description="Please try again"
            @retry="reload"
          />
        </div>

        <div v-else-if="events.length === 0" class="flex justify-center py-8">
          <EmptyState
            icon="i-lucide-calendar-x"
            title="No Events Found"
            description="Try adjusting your filters"
            :action="'Reset Filters'"
            @action="resetFilters"
          />
        </div>

        <template v-else>
          <FullEventsCard
            v-for="(event, i) in events"
            :key="event.id"
            :event="event"
            :isOdd="i % 2 === 1"
          />
        </template>
      </div>

      <div v-if="events.length > 0" class="flex flex-col items-center mt-8">
        <UButton
          label="Load More"
          trailing-icon="i-lucide-chevron-down"
          size="md"
          :loading="loadingMore"
          :disabled="!hasMore || pending"
          @click="loadMore"
        />
        <p
          v-if="!hasMore"
          class="text-xs text-gray-500 dark:text-gray-400 mt-3"
        >
          No more events to load
        </p>
      </div>
    </section>

    <!-- Past Events -->
    <section
      id="past-events"
      class="bg-gray-100 dark:bg-neutral-900 py-12 md:py-16 px-4 scroll-mt-16"
    >
      <div class="max-w-7xl mx-auto">
        <div class="text-center">
          <h2 class="text-2xl md:text-3xl font-bold">Past Events</h2>
          <p class="text-gray-600 dark:text-gray-400 mt-2 text-sm">
            Relive memorable moments
          </p>
        </div>

        <div
          v-if="pastEvents.length > 0"
          class="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center"
        >
          {{ pastEvents.length }} past
          {{ pastEvents.length === 1 ? "event" : "events" }}
        </div>

        <div class="grid gap-4 sm:gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-if="pastPending"
            class="col-span-full flex justify-center py-8"
          >
            <Loader />
          </div>

          <div
            v-else-if="pastError"
            class="col-span-full flex justify-center py-8"
          >
            <ErrorState
              title="Failed to load past events"
              @retry="pastRefresh"
            />
          </div>

          <div
            v-else-if="pastEvents.length === 0"
            class="col-span-full flex justify-center py-8"
          >
            <EmptyState icon="i-lucide-calendar-x" title="No Past Events" />
          </div>

          <template v-else>
            <EventsCard
              v-for="event in pastEvents"
              :key="event.id"
              :event="event"
            />
          </template>
        </div>

        <div v-if="pastEvents.length > 0" class="flex justify-center mt-8">
          <UButton
            variant="soft"
            label="View All"
            trailing-icon="i-lucide-arrow-right"
            to="/events?sort=completed#upcoming-events"
            size="md"
          />
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section
      id="cta"
      class="py-16 md:py-20 text-center bg-gradient-to-tr from-primary-600/10 via-transparent to-primary-400/10 px-4 scroll-mt-16"
    >
      <div class="max-w-4xl mx-auto">
        <UIcon
          name="i-lucide-video"
          class="mx-auto text-primary w-12 h-12 md:w-14 md:h-14"
        />
        <h2 class="text-2xl md:text-3xl font-bold mt-4">Never Miss an Event</h2>
        <p
          class="text-gray-600 dark:text-gray-400 mt-3 max-w-xl mx-auto text-sm"
        >
          Join our community to get notified about upcoming events.
        </p>
        <div class="mt-6">
          <ThreeDButton @clicked="$router.push('/join')" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Typewriter from "vue-typewriter-effect";
import type { Event } from "~/types";
import eventsImg from "~/assets/files/conference-img.jpg";

const sections = [
  { id: "hero", label: "Hero", icon: "i-lucide-eye" },
  { id: "countdown", label: "Countdown", icon: "i-lucide-clock" },
  { id: "filters", label: "Filters", icon: "i-lucide-filter" },
  { id: "upcoming-events", label: "Upcoming", icon: "i-lucide-calendar" },
  { id: "past-events", label: "Past", icon: "i-lucide-history" },
  { id: "cta", label: "Join", icon: "i-lucide-log-in" },
];

const nextEventDate = ref(new Date("2026-03-15T18:00:00"));
const search = ref("");
const sort = ref("Newest");
const limit = ref(9);
const offset = ref(0);
const hasMore = ref(true);
const loadingMore = ref(false);
const loadingError = ref<Error | null>(null);
const events = ref<Event[]>([]);
const pastEvents = ref<Event[]>([]);

const router = useRouter();
const route = useRoute();
const endpoints = useEndpoints();
const { get } = useApi();

useSeoPage({
  title: `Tech Events & Workshops | ${useAppConfig().site.title}`,
  description:
    "Explore upcoming hackathons, workshops, and tech events at MUT.",
});

const sortOptions = [
  { label: "Newest", value: "-created_at" },
  { label: "Oldest", value: "created_at" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Past", value: "completed" },
] as const;

const isFiltersDefault = computed(
  () => !search.value && sort.value === "Newest",
);

function getSortLabel(sortValue: string): string {
  return sortOptions.find((opt) => opt.value === sortValue)?.label || sortValue;
}

onMounted(() => {
  if (route.query.search) search.value = route.query.search as string;
  if (route.query.sort) sort.value = route.query.sort as string;
  fetchEvents(true);
  pastRefresh();
});

watch([search, sort], () => {
  const query: Record<string, string> = {};
  if (search.value) query.search = search.value;
  if (sort.value !== "Newest") query.sort = sort.value;
  router.replace({ query });
  onSearch();
});

async function fetchEvents(reset = false) {
  if (reset) {
    offset.value = 0;
    hasMore.value = true;
    events.value = [];
  }

  loadingMore.value = true;
  loadingError.value = null;

  try {
    const params: Record<string, any> = {
      limit: limit.value,
      offset: offset.value,
      ordering:
        sort.value === "-created_at" || sort.value === "created_at"
          ? sort.value
          : "-created_at",
      status: ["ongoing", "completed"].includes(sort.value)
        ? sort.value
        : "upcoming",
    };

    if (search.value) params.search = search.value;

    const res = await get(endpoints.events.list, params);
    const newEvents = res?.results ?? [];

    hasMore.value = newEvents.length >= limit.value;
    events.value.push(...newEvents);
    offset.value += limit.value;
  } catch (err) {
    loadingError.value = err as Error;
  } finally {
    loadingMore.value = false;
  }
}

const { pending, error, refresh } = await useAsyncData("events", async () => {
  await fetchEvents(true);
  return true;
});

const {
  pending: pastPending,
  error: pastError,
  refresh: pastRefresh,
} = await useAsyncData(
  "past-events",
  async () => {
    const res = await get(endpoints.events.past, {
      status: "completed",
      ordering: "-created_at",
      limit: 3,
    });
    pastEvents.value = res?.results ?? [];
    return true;
  },
  { lazy: true },
);

function reload() {
  refresh();
}
function resetFilters() {
  search.value = "";
  sort.value = "Newest";
  fetchEvents(true);
}
function loadMore() {
  if (!hasMore.value || loadingMore.value) return;
  fetchEvents();
}

let searchTimeout: NodeJS.Timeout;
function onSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => fetchEvents(true), 400);
}
</script>
