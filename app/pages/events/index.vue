<template>
  <div class="w-full">

    <!-- HERO -->
    <section
      class="h-[380px] flex flex-col items-center justify-center text-center
      bg-gradient-to-br from-primary-500/10 to-primary-900/10 px-6"
    >
      <Typewriter
        :strings="['Events • Competitions • Bootcamps • Hackathons']"
        :type-speed="100"
        :delete-speed="50"
        :delay="100"
        :loop="true"
        class="text-3xl md:text-5xl font-bold"
      />

      <p class="text-muted mt-4 max-w-2xl text-lg md:text-xl">
        Join workshops, hackathons, and conferences that help you
        grow your tech skills and connect with innovators.
      </p>
    </section>


    <!-- COUNTDOWN -->
    <section class="py-20 flex flex-col items-center text-center px-6">
      <h3 class="text-2xl md:text-3xl font-bold mb-6">
        Next Event Starts In
      </h3>

      <CountdownTimer :targetDate="nextEventDate" />
    </section>


    <!-- EVENTS TITLE -->
    <section class="max-w-6xl mx-auto text-center px-6">
      <h2 class="text-3xl md:text-4xl font-bold">
        Upcoming Events
      </h2>

      <p class="mt-3 text-muted max-w-xl mx-auto">
        Don't miss opportunities to learn, network and innovate
        with other developers.
      </p>
    </section>


    <!-- STICKY FILTER BAR -->
    <section
      class="sticky top-15 z-50
      backdrop-blur-md 
      mt-10"
    >
      <div
        class="max-w-6xl mx-auto px-6 py-4
        flex flex-col md:flex-row
        gap-4 md:items-center md:justify-between"
      >

        <UInput
          v-model="search"
          placeholder="Search events..."
          icon="i-lucide-search"
          size="lg"
          class="w-full md:max-w-md"
          @update:model-value="onSearch"
        />

        <USelect
          v-model="sort"
          :items="sortOptions"
          value-key="value"
          label-key="label"
          icon="i-lucide-arrow-up-down"
          class="w-full md:w-52"
          @update:model-value="onSearch"
        />

      </div>
    </section>


    <!-- EVENTS GRID -->
    <section class="max-w-6xl mx-auto px-6 py-16">

      <div class="grid gap-8 md:grid-cols-2">

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

        <template v-else-if="events.length === 0">
          
        <div  class="text-center py-20">
          <UIcon name="i-lucide-message-square-off" class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 class="text-xl font-semibold mb-2 dark:text-white">No Reviews Found</h3>
          <p class="text-gray-500 dark:text-gray-400">Try adjusting your filters or check back later.</p>
        </div>
        </template>

        <template v-else>
          <FullEventsCard
            v-for="(event,i) in events"
            :key="event.id"
            :event="event"
            :isOdd="i % 2 === 1"
          />
        </template>

      </div>


      <!-- LOAD MORE -->
      <div
        v-if="events.length > 0"
        class="flex justify-center mt-14"
      >
        <UButton
          label="Load More"
          trailing-icon="i-lucide-chevron-down"
          size="lg"
          :loading="loadingMore"
          :disabled="!hasMore || pending"
          @click="loadMore"
        />
      </div>

    </section>


    <!-- PAST EVENTS -->
    <section class="bg-muted/20 py-24 px-6">

      <div class="max-w-7xl mx-auto text-center">
        <h2 class="text-3xl font-bold">
          Past Events
        </h2>

        <p class="text-muted mt-3">
          Relive memorable moments from previous events
        </p>


        <div
          class="grid gap-8 mt-14
          sm:grid-cols-2
          lg:grid-cols-3"
        >

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
                title="Failed to load past events"
              />
              <UButton
                label="Retry"
                variant="outline"
                @click="pastRefresh"
              />
            </div>
          </template>

          <template v-else>
            <EventsCard
              v-for="event in pastEvents?.slice(0,3)"
              :key="event.id"
              :event="event"
            />
          </template>

        </div>

        <div class="mt-16">
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


    <!-- CTA -->
    <section
      class="py-28 text-center
      bg-gradient-to-tr from-primary-600/10 via-transparent to-primary-400/10"
    >
      <div class="max-w-4xl mx-auto px-6">

        <UIcon
          name="i-lucide-video"
          class="mx-auto text-primary w-16 h-16"
        />

        <h2 class="text-3xl md:text-4xl font-bold mt-6">
          Never Miss an Event
        </h2>

        <p class="text-muted mt-4 max-w-xl mx-auto">
          Join our community to receive notifications about
          upcoming workshops, hackathons and tech events.
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

const nextEventDate = ref(new Date("2026-03-15T18:00:00"));
const search = ref("");
const sort = ref("Newest");
const limit = ref(9);
const offset = ref(0);
const hasMore = ref(true);
const loadingMore = ref(false);
const loadingError = ref(null);
const events = ref<any[]>([]);
const showAnimatedText = ref(false);

useSeoPage({
  title: `Tech Events & Workshops | ${useAppConfig().site.title}`,
  description:
    "Explore upcoming hackathons, coding workshops, tech talks, and innovation events hosted by the MUT Tech Club at Murang'a University of Technology.",
});

onMounted(() => {
  showAnimatedText.value = true;
  fetchEvents(true);
});

const sortOptions = [
  { label: "Newest", value: "-created_at" },
  { label: "Oldest", value: "created_at" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Past", value: "completed" },
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
      ordering: (sort.value === '-created_at'||sort.value ==='created_at' )? sort.value :"-created_at" , 
      status: (sort.value === 'ongoing'||sort.value ==='completed' )? sort.value :"upcoming"
    };
    const res = await get(endpoints.events.list, params);
    const newEvents = res?.results ?? [];
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
    const res = await get(endpoints.events.past, {
      status: "completed", ordering :"-created_at", limit:6, offset:0
    });
    pastEvents.value = res?.results;
    return true;
  },
  { lazy: true },
);
</script>
