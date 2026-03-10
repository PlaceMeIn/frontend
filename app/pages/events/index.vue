<template>
  <div class="w-full">
    <OnThisPage :sections="sections" />

    <!-- HERO SECTION -->
    <section
      id="hero"
      class="h-[460px] md:h-[620px] relative flex flex-col items-center justify-center text-center bg-gradient-to-br from-primary-500/10 to-primary-900/10 px-6 scroll-mt-20"
    >
      <Typewriter
        :strings="['Events • Competitions • Bootcamps • Hackathons']"
        :type-speed="100"
        :delete-speed="50"
        :delay="100"
        :loop="true"
        class="text-3xl md:text-5xl font-bold z-50 text-white"
      />

      <p class=" text-gray-200 mt-4 max-w-2xl text-lg md:text-xl z-50">
        Join workshops, hackathons, and conferences that help you grow your tech
        skills and connect with innovators.
      </p>

      <img
        :src="eventsImg"
        alt="Murang'a University of Technology"
        class="absolute inset-0 w-full h-full object-cover"
        data-aos="fade-up"
        data-aos-duration="1200"
      />

      <div
        class="absolute inset-0 bg-gradient-to-tr from-white/85 dark:from-black/85 via-black/30 dark:via-black/60 to-transparent"
      ></div>
    </section>

    <!-- COUNTDOWN SECTION -->
    <section
      id="countdown"
      class="py-20 flex flex-col items-center text-center px-6 scroll-mt-20 z-50"
    >
      <h3 class="text-2xl md:text-3xl font-bold mb-6">Next Event Starts In</h3>
      <CountdownTimer :targetDate="nextEventDate" />
    </section>

    <!-- FILTERS SECTION -->
    <section
      id="filters"
      class="sticky top-15 z-50 backdrop-blur-md mt-10 scroll-mt-20"
    >
      <div
        class="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between"
      >
        <div class="flex gap-2 items-center w-full md:max-w-md">
          <UInput
            v-model="search"
            placeholder="Search events..."
            icon="i-lucide-search"
            size="lg"
            class="flex-1"
            @update:model-value="onSearch"
          />

          <UButton
            label="Reset"
            icon="i-lucide-rotate-ccw"
            variant="outline"
            size="lg"
            :disabled="isFiltersDefault"
            @click="resetFilters"
            class="transition-transform hover:scale-105 whitespace-nowrap"
            title="Reset all filters to default"
          />
        </div>

        <USelect
          v-model="sort"
          :items="sortOptions"
          value-key="value"
          label-key="label"
          icon="i-lucide-arrow-up-down"
          class="w-full md:w-52"
          @update:model-value="onSearch"
          aria-label="Sort events"
        />
      </div>

      <!-- Active Filters Summary -->
      <div
        v-if="!isFiltersDefault"
        class="max-w-6xl mx-auto px-6 pb-2 text-sm text-muted"
      >
        Active filters:
        <span v-if="search" class="inline-flex items-center gap-1 mr-3">
          <UIcon name="i-lucide-search" class="w-3 h-3" />
          "{{ search }}"
        </span>
        <span v-if="sort !== 'Newest'" class="inline-flex items-center gap-1">
          <UIcon name="i-lucide-arrow-up-down" class="w-3 h-3" />
          {{ getSortLabel(sort) }}
        </span>
      </div>
    </section>

    <!-- UPCOMING EVENTS SECTION -->
    <section
      id="upcoming-events"
      class="max-w-6xl mx-auto px-6 py-16 scroll-mt-20"
      aria-label="Upcoming events grid"
    >
      <!-- Results count -->
      <div v-if="events.length > 0" class="text-sm text-muted mb-4">
        Showing {{ events.length }} upcoming event{{
          events.length !== 1 ? "s" : ""
        }}
        <span v-if="!isFiltersDefault">with current filters</span>
      </div>

      <div class="grid gap-8 md:grid-cols-2">
        <!-- Loading State -->
        <template v-if="pending || loadingMore">
          <div class="col-span-full flex justify-center py-10">
            <Loader />
          </div>
        </template>

        <!-- Error State -->
        <template v-else-if="error || loadingError">
          <div class="col-span-full flex flex-col items-center gap-4 py-10">
            <UBanner
              color="error"
              icon="i-lucide-cloud-alert"
              title="Failed to load events"
            />
            <UButton
              label="Retry"
              icon="i-lucide-refresh-cw"
              variant="outline"
              @click="reload"
            />
          </div>
        </template>

        <!-- Empty State -->
        <template v-else-if="events.length === 0">
          <div class="col-span-full flex justify-center">
            <UEmpty
              icon="i-lucide-calendar-x"
              title="No Events Found"
              description="We couldn't find any events matching your filters. Try refreshing or adjusting your search."
              :actions="[
                {
                  icon: 'i-lucide-refresh-cw',
                  label: 'Reset Filters',
                  color: 'neutral',
                  variant: 'subtle',
                  onClick: resetFilters,
                },
              ]"
            />
          </div>
        </template>

        <!-- Events Grid -->
        <template v-else>
          <FullEventsCard
            v-for="(event, i) in events"
            :key="event.id"
            :event="event"
            :isOdd="i % 2 === 1"
          />
        </template>
      </div>

      <!-- Load More Button -->
      <div v-if="events.length > 0" class="flex flex-col items-center mt-14">
        <UButton
          label="Load More"
          trailing-icon="i-lucide-chevron-down"
          size="lg"
          :loading="loadingMore"
          :disabled="!hasMore || pending"
          @click="loadMore"
          :aria-label="hasMore ? 'Load more events' : 'No more events to load'"
        />

        <!-- End of results message -->
        <p v-if="!hasMore && events.length > 0" class="text-sm text-muted mt-4">
          You've reached the end of upcoming events
        </p>
      </div>
    </section>

    <!-- PAST EVENTS SECTION -->
    <section
      id="past-events"
      class="bg-muted/20 py-24 px-6 scroll-mt-20"
      aria-label="Past events"
    >
      <div class="max-w-7xl mx-auto text-center">
        <h2 class="text-3xl font-bold">Past Events</h2>
        <p class="text-muted mt-3">
          Relive memorable moments from previous events
        </p>

        <!-- Results count -->
        <div v-if="pastEvents.length > 0" class="text-sm text-muted mt-4">
          Showing {{ pastEvents.length }} past event{{
            pastEvents.length !== 1 ? "s" : ""
          }}
        </div>

        <div class="grid gap-8 mt-14 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Loading State -->
          <template v-if="pastPending">
            <div class="col-span-full flex justify-center py-10">
              <Loader />
            </div>
          </template>

          <!-- Error State -->
          <template v-else-if="pastError">
            <div class="col-span-full flex flex-col items-center gap-4 py-10">
              <UBanner
                color="error"
                icon="i-lucide-cloud-alert"
                title="Failed to load past events"
              />
              <UButton label="Retry" variant="outline" @click="pastRefresh" />
            </div>
          </template>

          <!-- Empty State -->
          <template v-else-if="pastEvents.length === 0">
            <div class="col-span-full flex justify-center">
              <UEmpty
                icon="i-lucide-calendar-x"
                title="No Past Events"
                description="There are no past events to display at the moment."
              />
            </div>
          </template>

          <!-- Past Events Grid -->
          <template v-else>
            <EventsCard
              v-for="event in pastEvents"
              :key="event.id"
              :event="event"
            />
          </template>
        </div>

        <div v-if="pastEvents.length > 0" class="mt-16">
          <UButton
            variant="soft"
            label="View All Past Events"
            trailing-icon="i-lucide-arrow-right"
            to="/events?sort=completed#upcoming-events"
            size="xl"
          />
        </div>
      </div>
    </section>

    <!-- CALL TO ACTION SECTION -->
    <section
      id="cta"
      class="py-28 text-center bg-gradient-to-tr from-primary-600/10 via-transparent to-primary-400/10 scroll-mt-20"
      aria-label="Join us call to action"
    >
      <div class="max-w-4xl mx-auto px-6">
        <UIcon name="i-lucide-video" class="mx-auto text-primary w-16 h-16" />

        <h2 class="text-3xl md:text-4xl font-bold mt-6">Never Miss an Event</h2>

        <p class="text-muted mt-4 max-w-xl mx-auto">
          Join our community to receive notifications about upcoming workshops,
          hackathons and tech events.
        </p>

        <div class="mt-10">
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
  { id: "hero", label: "Hero" },
  { id: "countdown", label: "Countdown" },
  { id: "filters", label: "Filters" },
  { id: "upcoming-events", label: "Upcoming Events" },
  { id: "past-events", label: "Past Events" },
  { id: "cta", label: "Join Us" },
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
const showAnimatedText = ref(false);
const pastEvents = ref<Event[]>([]);

const router = useRouter();
const route = useRoute();
const endpoints = useEndpoints();
const { get } = useApi();

useSeoPage({
  title: `Tech Events & Workshops | ${useAppConfig().site.title}`,
  description:
    "Explore upcoming hackathons, coding workshops, tech talks, and innovation events hosted by the MUT Tech Club at Murang'a University of Technology.",
});

const sortOptions = [
  { label: "Newest", value: "-created_at" },
  { label: "Oldest", value: "created_at" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Past", value: "completed" },
] as const;

const isFiltersDefault = computed(() => {
  return search.value === "" && sort.value === "Newest";
});

function getSortLabel(sortValue: string): string {
  const option = sortOptions.find((opt) => opt.value === sortValue);
  return option?.label || sortValue;
}

onMounted(() => {
  showAnimatedText.value = true;

  if (route.query.search) {
    search.value = route.query.search as string;
  }
  if (route.query.sort) {
    sort.value = route.query.sort as string;
  }

  fetchEvents(true);
  pastRefresh();
});

watch(
  () => route.query,
  (newQuery) => {
    let shouldRefetch = false;

    if (newQuery.search !== undefined && newQuery.search !== search.value) {
      search.value = newQuery.search as string;
      shouldRefetch = true;
    }

    if (newQuery.sort !== undefined && newQuery.sort !== sort.value) {
      sort.value = newQuery.sort as string;
      shouldRefetch = true;
    }

    if (shouldRefetch) {
      fetchEvents(true);
    }
  },
  { deep: true },
);

let updateUrlTimeout: NodeJS.Timeout;
watch([search, sort], () => {
  clearTimeout(updateUrlTimeout);
  updateUrlTimeout = setTimeout(() => {
    const query: Record<string, string> = {};

    if (search.value) {
      query.search = search.value;
    }
    if (sort.value !== "Newest") {
      query.sort = sort.value;
    }

    router.replace({ query });
  }, 300);
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
    };

    if (search.value) {
      params.search = search.value;
    }

    if (sort.value === "-created_at" || sort.value === "created_at") {
      params.ordering = sort.value;
    } else {
      params.ordering = "-created_at";
    }

    if (sort.value === "ongoing" || sort.value === "completed") {
      params.status = sort.value;
    } else {
      params.status = "upcoming";
    }

    const res = await get(endpoints.events.list, params);
    const newEvents = res?.results ?? [];

    if (newEvents.length < limit.value) {
      hasMore.value = false;
    }

    events.value.push(...newEvents);
    offset.value += limit.value;
  } catch (err) {
    loadingError.value = err as Error;
    console.error("Failed to fetch events:", err);
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
      offset: 0,
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
