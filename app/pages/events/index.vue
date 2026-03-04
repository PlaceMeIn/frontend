<template>
  <section class="pb-16">
    <!-- Hero Section -->
    <section
      class="text-center h-[400px] flex flex-col justify-center items-center bg-gradient-to-br from-primary-500/10 to-primary-900/10"
      data-aos="fade-down"
    >
      <Typewriter
        :strings="['Events & Competitions & BootCamps & Hackathons']"
        :type-speed="100"
        :delete-speed="50"
        :delay="100"
        :loop="true"
        class="text-4xl font-bold"
      />
      <p class="text-muted mt-3 text-xl max-w-2xl">
        Join us for workshops, hackathons, conferences, and networking events
        that will level up your tech skills
      </p>
    </section>

    <!-- Countdown to Next Event -->
    <section class="flex flex-col items-center py-20">
      <h3 class="text-3xl font-bold text-shadow-2xs py-5">
        Next Event Starts in
      </h3>
      <CountdownTimer :targetDate="nextEventDate" />
    </section>

    <!-- Search and Filters -->
    <section
      class="mt-10 max-w-5xl mx-auto flex flex-col gap-4 sticky top-0 backdrop-blur z-10 py-3"
      data-aos="fade-down"
      data-aos-delay="100"
    >
      <div class="text-center my-5">
        <h2 class="text-3xl md:text-4xl font-bold">Upcoming Events</h2>
        <p class="mt-3 text-muted max-w-xl mx-auto">
          Don't miss out on these exciting opportunities to learn, network, and
          innovate
        </p>
      </div>

      <div class="flex flex-wrap gap-3 justify-between items-center">
        <UInput
          v-model="search"
          placeholder="Search events..."
          icon="i-lucide-search"
          size="lg"
          @update:model-value="onSearch"
          class="transition-shadow focus:shadow-lg"
        />
        <USelect
          v-model="sort"
          :items="sortOptions"
          icon="i-lucide-arrow-up-down"
          class="w-48 transition-transform hover:scale-105"
          @update:model-value="onSearch"
        />
      </div>
    </section>

    <!-- Upcoming Events Grid -->
    <section class="mt-6 max-w-6xl mx-auto">
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full">
        <template v-if="pending || loadingMore">
          <div class="col-span-full flex justify-center py-10">
            <Loader />
          </div>
        </template>

        <template v-else-if="error || loadingError">
          <div class="col-span-full flex flex-col items-center gap-4 py-10">
            <UBanner
              color="error"
              icon="i-lucide-cloud-alert"
              title="Failed to load Events"
            />
            <UButton
              label="Retry"
              variant="outline"
              icon="i-lucide-refresh-cw"
              @click="reload"
            />
          </div>
        </template>

        <template v-else-if="events.length === 0">
          <div class="col-span-full text-center py-10 text-muted">
            No events found
          </div>
        </template>

        <template v-else>
          <EventsCard
            v-for="event in events"
            :key="event.id"
            :event="event"
            data-aos="fade-up"
            data-aos-delay="50"
            class="transition-transform hover:scale-105"
          />
        </template>
      </div>

      <div v-if="events.length > 0" class="mt-12 flex justify-center">
        <UButton
          label="Load More"
          trailing-icon="i-lucide-chevron-down"
          size="lg"
          :loading="loadingMore"
          :disabled="!hasMore || pending"
          @click="loadMore"
          class="transition-transform hover:scale-105"
        />
      </div>
    </section>

    <!-- Past Events -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-6 flex flex-col items-center">
        <div class="max-w-2xl text-center">
          <h2 class="text-3xl font-bold tracking-tight">Past Events</h2>
          <p class="mt-3 text-lg text-muted">
            Relive memorable moments from previous events
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full">
          <template v-if="pastPending">
            <div class="col-span-full flex justify-center py-10">
              <Loader />
            </div>
          </template>

          <template v-else-if="pastError">
            <div class="col-span-full flex flex-col items-center gap-4 py-10">
              <UBanner
                color="error"
                icon="i-lucide-cloud-alert"
                title="Failed to load Past Events"
              />
              <UButton
                label="Retry"
                variant="outline"
                icon="i-lucide-refresh-cw"
                @click="pastRefresh"
              />
            </div>
          </template>

          <template v-else>
            <EventsCard
              v-for="event in pastEvents"
              :key="event.id"
              :event="event"
            />
          </template>
        </div>

        <div class="mt-12">
          <UButton
            variant="soft"
            label="View All Past Events"
            trailing-icon="i-lucide-arrow-right"
            to="/events?type=past"
            size="xl"
          />
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section
      class="w-full py-24 bg-gradient-to-tr from-primary-600/10 via-transparent to-primary-400/10"
      data-aos="fade-up"
    >
      <div class="max-w-6xl mx-auto px-6 text-center">
        <UIcon name="i-lucide-video" :size="90" class="text-primary w-20" />
        <h2 class="text-3xl md:text-4xl font-bold">Never Miss an Event</h2>
        <p class="mt-3 text-muted max-w-xl mx-auto">
          Join our community to get notified about upcoming events, workshops,
          and hackathons
        </p>
        <div
          class="mt-10 flex flex-col items-center gap-6"
          data-aos="flip-left"
          data-aos-easing="ease-out-cubic"
          data-aos-duration="2000"
        >
          <h2 class="text-shadow-2xl font-mono text-2xl md:text-4xl">
            Join Us
          </h2>
          <ThreeDButton @clicked="$router.push('/join')" />
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import Typewriter from "vue-typewriter-effect";

const nextEventDate = ref(new Date("2026-03-15T18:00:00"));
const search = ref("");
const sort = ref("desc");
const limit = ref(9);
const offset = ref(0);
const hasMore = ref(true);
const loadingMore = ref(false);
const loadingError = ref(null);
const events = ref<any[]>([]);
const showAnimatedText = ref(false);

onMounted(() => {
  showAnimatedText.value = true;
});
const sortOptions = [
  { label: "Newest", value: "desc" },
  { label: "Oldest", value: "asc" },
  { label: "Past", value: "past" },
];

const endpoints = useEndpoints();
const { get } = useApi();

async function fetchEvents(reset = false) {
  if (reset) {
    offset.value = 0;
    hasMore.value = true;
    events.value = [];
  }
  loadingMore.value = true;
  loadingError.value = null;

  try {
    const params: any = {
      limit: limit.value,
      offset: offset.value,
      search: search.value,
      sort: sort.value,
    };
    const res = await get(endpoints.events.list, params);
    const newEvents = res?.events ?? [];
    if (newEvents.length < limit.value) hasMore.value = false;
    events.value.push(...newEvents);
    offset.value += limit.value;
  } catch (err) {
    loadingError.value = err;
    console.error(err);
  } finally {
    loadingMore.value = false;
  }
}

const { pending, error, refresh } = await useAsyncData("events", async () => {
  await fetchEvents(true);
  return true;
});

function reload() {
  refresh();
}

function loadMore() {
  if (!hasMore.value) return;
  fetchEvents();
}

let timeout: any;
function onSearch() {
  clearTimeout(timeout);
  timeout = setTimeout(() => fetchEvents(true), 400);
}

// Past events
const pastEvents = ref<any[]>([]);
const { pastPending, pastError, pastRefresh } = await useAsyncData(
  "past-events",
  async () => {
    const res = await get(endpoints.events.list, { type: "past" });
    pastEvents.value = res?.events ?? [];
    return true;
  },
  { lazy: true },
);
</script>
