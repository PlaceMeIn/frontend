<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-950">
    <!-- Sticky Action Bar -->
    <div
      class="sticky top-15 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800"
    >
      <div class="max-w-7xl mx-auto px-3 sm:px-6">
        <div class="flex items-center justify-between h-14">
          <div class="lg:hidden">
            <UButton
              to="/events"
              color="neutral"
              variant="ghost"
              size="sm"
              class="!p-1.5"
            >
              <UIcon name="i-lucide-arrow-left" class="w-5 h-5" />
            </UButton>
          </div>

          <NavigationBreadCrumb class="hidden lg:block" />

          <div class="flex items-center gap-1.5">
            <UButton
              v-if="eventData?.status"
              :icon="getIcon(eventData?.status)"
              size="sm"
              :color="getColor(eventData?.status)"
              :variant="eventData?.status === 'completed' ? 'outline' : 'solid'"
              :disabled="
                eventData?.status === 'ongoing' ||
                eventData?.status === 'completed'
              "
              :label="getLabel(eventData?.status)"
              :to="eventData?.registration_link || '#'"
              target="_blank"
              class="w-full"
            />

            <UButton
              color="neutral"
              variant="soft"
              size="sm"
              class="!px-2.5 !py-1.5"
              @click="shareContent"
            >
              <UIcon name="i-lucide-share-2" class="w-3.5 h-3.5" />
              <span class="hidden sm:inline ml-1.5 text-xs">Share</span>
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      <OnThisPage
        :sections="sections"
        class="mb-4"
        :class="{ 'opacity-50 pointer-events-none': pending || error }"
      />

      <div v-if="pending" class="flex justify-center items-center min-h-[50vh]">
        <div class="text-center">
          <UIcon
            name="i-lucide-loader-circle"
            class="w-10 h-10 text-primary animate-spin mx-auto mb-3"
          />
          <p class="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>

      <div
        v-else-if="error"
        class="flex flex-col items-center justify-center min-h-[50vh] gap-3"
      >
        <div
          class="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center"
        >
          <UIcon name="i-lucide-alert-triangle" class="w-8 h-8 text-red-500" />
        </div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          Unable to load event
        </h2>
        <p
          class="text-gray-600 dark:text-gray-400 text-center max-w-md text-xs"
        >
          Something went wrong. Please try again.
        </p>
        <UButton color="primary" size="sm" @click="refresh" class="mt-1">
          <UIcon name="i-lucide-refresh-cw" class="w-3.5 h-3.5 mr-1.5" />
          Try Again
        </UButton>
      </div>

      <div v-else-if="eventData" class="space-y-4">
        <!-- Hero -->
        <section id="overview" class="scroll-mt-16">
          <div
            class="bg-white dark:bg-neutral-900 rounded-lg shadow-sm overflow-hidden"
          >
            <div class="relative h-[250px] sm:h-[300px] lg:h-[350px]">
              <img
                :src="
                  eventData.image || eventData.image_url || '/placeholder.jpg'
                "
                :alt="eventData.title"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
              />

              <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <UBadge
                  :color="getStatusColor(eventData.status)"
                  variant="solid"
                  class="!px-2 !py-1 text-[10px] font-medium backdrop-blur-sm"
                >
                  <UIcon
                    :name="getStatusIcon(eventData.status)"
                    class="w-3 h-3 mr-1"
                  />
                  {{ eventData.status_display || eventData.status }}
                </UBadge>

                <UBadge
                  v-if="eventData.is_featured"
                  color="warning"
                  variant="solid"
                  class="!px-2 !py-1 text-[10px] font-medium backdrop-blur-sm"
                >
                  <UIcon name="i-lucide-star" class="w-3 h-3 mr-1" />
                  Featured
                </UBadge>
              </div>

              <div class="absolute top-3 right-3">
                <UBadge
                  color="white"
                  variant="solid"
                  class="!px-2 !py-1 text-[10px] font-medium backdrop-blur-sm bg-white/20 text-white border-0"
                >
                  <UIcon
                    :name="getEventTypeIcon(eventData.event_type)"
                    class="w-3 h-3 mr-1"
                  />
                  {{ eventData.event_type_display || eventData.event_type }}
                </UBadge>
              </div>

              <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">
                  {{ eventData.title }}
                </h1>
                <p
                  class="text-sm sm:text-base text-gray-200 flex items-center gap-1"
                >
                  <UIcon name="i-lucide-quote" class="w-3 h-3 opacity-50" />
                  {{ eventData.tagline }}
                </p>
                <p class="text-muted text-sm">
                  Created {{ formatDistanceToNow(eventData.created_at) }}
                </p>
              </div>
            </div>

            <!-- Quick Info -->
            <div
              class="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-200 dark:divide-neutral-800 border-t border-gray-200 dark:border-neutral-800"
            >
              <div class="p-3">
                <div class="flex items-start gap-2">
                  <div class="p-1.5 bg-primary/10 rounded">
                    <UIcon
                      name="i-lucide-calendar"
                      class="w-3.5 h-3.5 text-primary"
                    />
                  </div>
                  <div>
                    <p class="text-[10px] text-gray-500 dark:text-gray-400">
                      Date
                    </p>
                    <p class="font-semibold text-xs">{{ formatDateRange }}</p>
                    <p
                      class="text-[10px] text-primary mt-0.5 flex items-center gap-0.5"
                    >
                      <UIcon name="i-lucide-clock" class="w-2.5 h-2.5" />
                      {{ daysUntil }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="p-3">
                <div class="flex items-start gap-2">
                  <div class="p-1.5 bg-primary/10 rounded">
                    <UIcon
                      name="i-lucide-map-pin"
                      class="w-3.5 h-3.5 text-primary"
                    />
                  </div>
                  <div>
                    <p class="text-[10px] text-gray-500 dark:text-gray-400">
                      Location
                    </p>
                    <p class="font-semibold text-xs">
                      {{ eventData?.location || "TBA" }}
                    </p>
                    <p
                      v-if="eventData?.venue"
                      class="text-[10px] text-gray-600 dark:text-gray-300 truncate"
                    >
                      {{ eventData?.venue }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="p-3">
                <div class="flex items-start gap-2">
                  <div class="p-1.5 bg-primary/10 rounded">
                    <UIcon
                      name="i-lucide-users"
                      class="w-3.5 h-3.5 text-primary"
                    />
                  </div>
                  <div>
                    <p class="text-[10px] text-gray-500 dark:text-gray-400">
                      Attendees
                    </p>
                    <p class="font-semibold text-xs">
                      {{
                        eventData.expected_attendees?.toLocaleString() || "TBA"
                      }}
                    </p>
                    <p class="text-[10px] text-gray-600 dark:text-gray-300">
                      Expected
                    </p>
                  </div>
                </div>
              </div>

              <div class="p-3">
                <div class="flex items-start gap-2">
                  <div class="p-1.5 bg-primary/10 rounded">
                    <UIcon
                      name="i-lucide-door-open"
                      class="w-3.5 h-3.5 text-primary"
                    />
                  </div>
                  <div>
                    <p class="text-[10px] text-gray-500 dark:text-gray-400">
                      Capacity
                    </p>
                    <p class="font-semibold text-xs">
                      {{ eventData.capacity || "Unlimited" }}
                    </p>
                    <p class="text-[10px] text-gray-600 dark:text-gray-300">
                      {{ eventData.capacity ? "Limited" : "Open" }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Main Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Left Column -->
          <div class="lg:col-span-2 space-y-4">
            <!-- Description -->
            <section id="description" class="scroll-mt-16">
              <div
                class="bg-white dark:bg-neutral-900 rounded-lg shadow-sm p-4"
              >
                <h2
                  class="text-base font-semibold mb-2 flex items-center gap-1.5"
                >
                  <div class="p-1 bg-primary/10 rounded">
                    <UIcon
                      name="i-lucide-info"
                      class="w-3.5 h-3.5 text-primary"
                    />
                  </div>
                  About
                </h2>
                <p
                  class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed"
                >
                  {{ eventData.description || "No description available." }}
                </p>
              </div>
            </section>

            <!-- Speakers -->
            <section
              id="speakers"
              v-if="eventData.speakers?.length"
              class="scroll-mt-16"
            >
              <div
                class="bg-white dark:bg-neutral-900 rounded-lg shadow-sm p-4"
              >
                <h2
                  class="text-base font-semibold mb-3 flex items-center gap-1.5"
                >
                  <div class="p-1 bg-primary/10 rounded">
                    <UIcon
                      name="i-lucide-mic-2"
                      class="w-3.5 h-3.5 text-primary"
                    />
                  </div>
                  Speakers ({{ eventData.speakers.length }})
                </h2>

                <div class="space-y-3">
                  <div
                    v-for="speaker in eventData.speakers"
                    :key="speaker.id"
                    class="flex gap-3 p-2 bg-gray-50 dark:bg-neutral-800/50 rounded-lg"
                  >
                    <div class="relative w-12 h-12 flex-shrink-0">
                      <img
                        :src="speaker.image || '/placeholder-avatar.jpg'"
                        :alt="speaker.name"
                        class="w-full h-full rounded-full object-cover border border-white dark:border-neutral-700"
                      />
                    </div>

                    <div class="flex-1 min-w-0">
                      <h3 class="font-medium text-sm">{{ speaker.name }}</h3>
                      <p class="text-primary text-xs">{{ speaker.title }}</p>
                      <p
                        v-if="speaker.company"
                        class="text-gray-600 dark:text-gray-400 text-xs"
                      >
                        {{ speaker.company }}
                      </p>
                      <p
                        v-if="speaker.topic"
                        class="text-xs text-gray-700 dark:text-gray-300 mt-1 line-clamp-2"
                      >
                        <span class="font-medium">Topic:</span>
                        {{ speaker.topic }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Right Column -->
          <div class="space-y-4">
            <!-- Mobile Sticky -->
            <div class="lg:hidden sticky bottom-3 z-30">
              <div
                class="bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-800 p-3"
              >
                <div class="flex items-center gap-2">
                  <div class="flex-1">
                    <p
                      class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"
                    >
                      <UIcon name="i-lucide-clock" class="w-3 h-3" />
                      {{ daysUntil }}
                    </p>
                  </div>
                  <UButton
                    v-if="eventData?.status"
                    :icon="getIcon(eventData?.status)"
                    size="sm"
                    :color="getColor(eventData?.status)"
                    :variant="
                      eventData?.status === 'completed' ? 'outline' : 'solid'
                    "
                    :disabled="
                      eventData?.status === 'ongoing' ||
                      eventData?.status === 'completed'
                    "
                    :label="getLabel(eventData?.status)"
                    :to="eventData?.registration_link || '#'"
                    target="_blank"
                    class="w-full"
                  />
                </div>
              </div>
            </div>

            <!-- Details -->
            <section id="details" class="scroll-mt-16">
              <div
                class="bg-white dark:bg-neutral-900 rounded-lg shadow-sm p-4"
              >
                <h3
                  class="text-sm font-semibold mb-3 flex items-center gap-1.5"
                >
                  <div class="p-1 bg-primary/10 rounded">
                    <UIcon
                      name="i-lucide-info"
                      class="w-3.5 h-3.5 text-primary"
                    />
                  </div>
                  Details
                </h3>

                <div class="space-y-2 text-sm">
                  <div class="flex items-start gap-2">
                    <UIcon
                      name="i-lucide-calendar"
                      class="w-3.5 h-3.5 text-primary mt-0.5"
                    />
                    <div>
                      <p class="text-xs text-gray-500">Start</p>
                      <p class="text-xs">
                        {{
                          format(parseISO(eventData.start_date), "MMM d, yyyy")
                        }}
                      </p>
                      <p class="text-[10px] text-gray-600">
                        {{ format(parseISO(eventData.start_date), "h:mm a") }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2">
                    <UIcon
                      name="i-lucide-calendar-check"
                      class="w-3.5 h-3.5 text-primary mt-0.5"
                    />
                    <div>
                      <p class="text-xs text-gray-500">End</p>
                      <p class="text-xs">
                        {{
                          format(parseISO(eventData.end_date), "MMM d, yyyy")
                        }}
                      </p>
                      <p class="text-[10px] text-gray-600">
                        {{ format(parseISO(eventData.end_date), "h:mm a") }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2">
                    <UIcon
                      name="i-lucide-map-pin"
                      class="w-3.5 h-3.5 text-primary mt-0.5"
                    />
                    <div>
                      <p class="text-xs text-gray-500">Venue</p>
                      <p class="text-xs">{{ eventData.venue || "TBA" }}</p>
                      <p class="text-[10px] text-gray-600">
                        {{ eventData.location || "TBA" }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Desktop Registration -->
            <section id="registration" class="hidden lg:block scroll-mt-16">
              <div
                class="bg-white dark:bg-neutral-900 rounded-lg shadow-sm p-4"
              >
                <h3
                  class="text-sm font-semibold mb-3 flex items-center gap-1.5"
                >
                  <div class="p-1 bg-primary/10 rounded">
                    <UIcon
                      name="i-lucide-ticket"
                      class="w-3.5 h-3.5 text-primary"
                    />
                  </div>
                  Registration
                </h3>

                <UButton
                  v-if="eventData?.status"
                  :icon="getIcon(eventData?.status)"
                  size="sm"
                  :color="getColor(eventData?.status)"
                  :variant="
                    eventData?.status === 'completed' ? 'outline' : 'solid'
                  "
                  :disabled="
                    eventData?.status === 'ongoing' ||
                    eventData?.status === 'completed'
                  "
                  :label="getLabel(eventData?.status)"
                  :to="eventData?.registration_link || '#'"
                  target="_blank"
                  class="w-full"
                />

                <p
                  class="text-xs text-center text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center gap-1"
                >
                  <UIcon name="i-lucide-clock" class="w-3 h-3" />
                  {{ daysUntil }}
                </p>
              </div>
            </section>

            <!-- Share -->
            <section id="share" class="scroll-mt-16">
              <div
                class="bg-white dark:bg-neutral-900 rounded-lg shadow-sm p-4"
              >
                <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
                  <UIcon name="i-lucide-share-2" class="w-4 h-4 text-primary" />
                  Share
                </h3>

                <div class="flex flex-wrap gap-2">
                  <UButton
                    icon="i-lucide-link"
                    color="neutral"
                    variant="soft"
                    size="xs"
                    @click="copyToClipboard(currentUrl)"
                  >
                    Copy
                  </UButton>

                  <UButton
                    icon="i-lucide-facebook"
                    color="neutral"
                    variant="soft"
                    size="xs"
                    square
                    :to="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`"
                    target="_blank"
                    aria-label="Share on Facebook"
                  />

                  <UButton
                    icon="i-lucide-linkedin"
                    color="neutral"
                    variant="soft"
                    size="xs"
                    square
                    :to="`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`"
                    target="_blank"
                    aria-label="Share on LinkedIn"
                  />

                  <UButton
                    icon="i-simple-icons-whatsapp"
                    color="neutral"
                    variant="soft"
                    size="xs"
                    square
                    :to="`https://wa.me/?text=${encodeURIComponent(shareText)}`"
                    target="_blank"
                    aria-label="Share on WhatsApp"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        <section>
          <UAccordion :items="accordionitems" type="multiple">
            <template #content="{ item }">
              <p class="pb-3.5 text-sm text-muted">
                This is the {{ item.label }} panel.
              </p>
              <section id="takeaways">
                <div v-if="item.key === 'takeaways'">
                  <UModal
                    fullscreen
                    :overlay="false"
                    title="Mut Tech Club Takeaways"
                    description="Key take aways"
                  >
                    <UButton
                      icon="i-lucide-expand"
                      color="neutral"
                      variant="subtle"
                    />

                    <template #body>
                      <TakeAways
                        :id="eventData?.id"
                        :type="'event'"
                        class="h-full"
                      />
                    </template>
                  </UModal>
                  <TakeAways
                    :id="eventData?.id"
                    :type="'event'"
                    class="h-[400px]"
                  />
                </div>
              </section>

              <section id="gallery">
                <div v-if="item.key === 'gallery'"></div>
              </section>
            </template>
          </UAccordion>
        </section>

        <!-- Related -->
        <section id="related" class="scroll-mt-16">
          <HighlightUpcomingEvent
            :limit="10"
            :h-scroll="true"
            :related="eventData?.event_type"
            :title="'Related Events'"
          />
        </section>
      </div>

      <!-- Not Found -->
      <div
        v-else
        class="flex flex-col items-center justify-center min-h-[50vh] gap-3"
      >
        <div
          class="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center"
        >
          <UIcon name="i-lucide-file-x" class="w-8 h-8 text-gray-400" />
        </div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          Event Not Found
        </h2>
        <p
          class="text-gray-600 dark:text-gray-400 text-center max-w-md text-xs"
        >
          The event doesn't exist or has been removed.
        </p>
        <UButton color="primary" size="sm" to="/events" class="mt-1">
          <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5 mr-1.5" />
          Browse Events
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  format,
  formatDistanceToNow,
  parseISO,
  differenceInDays,
} from "date-fns";

interface Speaker {
  id: number;
  name: string;
  title: string;
  topic: string;
  company: string;
  image: string;
}

interface Event {
  id: string;
  slug: string;
  title: string;
  event_type: string;
  event_type_display: string;
  tagline: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  venue: string;
  expected_attendees: number;
  capacity?: number;
  registration_link: string;
  image: string;
  image_url: string;
  status: string;
  status_display: string;
  is_featured: boolean;
  speakers: Speaker[];
  created_at: string;
}
import type { AccordionItem } from "@nuxt/ui";

const accordionitems: AccordionItem[] = [
  {
    label: "Takeaways",
    key: "takeaways",
    icon: "i-lucide-notebook-pen",
  },
  {
    label: "Gallery",
    key: "gallery",
    icon: "i-lucide-images",
  },
];

const sections = [
  { id: "overview", label: "Overview", icon: "i-lucide-eye" },
  { id: "description", label: "About", icon: "i-lucide-info" },
  { id: "speakers", label: "Speakers", icon: "i-lucide-mic-2" },
  { id: "details", label: "Details", icon: "i-lucide-list" },
  { id: "registration", label: "Register", icon: "i-lucide-ticket" },
  { id: "share", label: "Share", icon: "i-lucide-share-2" },
  {
    label: "Takeaways",
    id: "takeaways",
    icon: "i-lucide-notebook-pen",
  },
  {
    label: "Gallery",
    id: "gallery",
    icon: "i-lucide-images",
  },
  { id: "related", label: "Related", icon: "i-lucide-calendar-heart" },
];

const route = useRoute();
const toast = useToast();
const { copy } = useClipboard();

const slug = computed(() => String(route.params.slug || ""));
const currentUrl = computed(() => (process.client ? window.location.href : ""));

const endpoints = useEndpoints();
const { get } = useApi();

const { data, pending, error, refresh } = await useAsyncData(
  `event-${slug.value}`,
  () => get(endpoints.events.list, { slug: slug.value }),
  { default: () => null },
);

const eventData = computed<Event | null>(() => {
  if (data.value) {
    if (data.value.id) return data.value;
    if (data.value.event) return data.value.event;
    if (Array.isArray(data.value) && data.value.length > 0)
      return data.value[0];
  }
  return null;
});

const daysUntil = computed(() => {
  if (!eventData.value?.start_date) return "";
  const days = differenceInDays(
    parseISO(eventData.value.start_date),
    new Date(),
  );
  if (days < 0) return "Ended";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `in ${days} days`;
});

const formatDateRange = computed(() => {
  if (!eventData.value?.start_date) return "TBA";
  const start = parseISO(eventData.value.start_date);
  if (!eventData.value.end_date) return format(start, "MMM d, yyyy");
  const end = parseISO(eventData.value.end_date);
  return `${format(start, "MMM d")} - ${format(end, "MMM d")}`;
});

useSeoPage({
  title: eventData.value
    ? `${eventData.value.title} | Events`
    : "Event Details",
  description: eventData.value?.description,
  image: eventData.value?.image || eventData.value?.image_url,
});

const formatTimeAgo = (dateStr: string) =>
  formatDistanceToNow(parseISO(dateStr), { addSuffix: true });

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "ongoing":
      return "success";
    case "completed":
      return "neutral";
    case "canceled":
      return "error";
    default:
      return "primary";
  }
};

const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case "ongoing":
      return "i-lucide-play-circle";
    case "completed":
      return "i-lucide-check-circle";
    case "canceled":
      return "i-lucide-x-circle";
    default:
      return "i-lucide-clock";
  }
};

const getEventTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    hackathon: "i-lucide-code-2",
    conference: "i-lucide-mic",
    workshop: "i-lucide-wrench",
    meetup: "i-lucide-users",
    webinar: "i-lucide-video",
  };
  return icons[type?.toLowerCase()] || "i-lucide-calendar";
};

const shareContent = () => {
  if (navigator.share) {
    navigator
      .share({
        title: eventData.value?.title,
        text: eventData.value?.tagline,
        url: currentUrl.value,
      })
      .catch(() => copyToClipboard(currentUrl.value));
  } else {
    copyToClipboard(currentUrl.value);
  }
};

const copyToClipboard = async (text: string) => {
  try {
    await copy(text);
    toast.add({
      title: "Copied!",
      icon: "i-lucide-check-circle",
      color: "success",
    });
  } catch {
    toast.add({
      title: "Failed to copy",
      icon: "i-lucide-alert-circle",
      color: "error",
    });
  }
};

function getColor(status: string) {
  switch (status) {
    case "ongoing":
      return "success";
    case "completed":
      return "neutral";
    case "canceled":
      return "error";
    default:
      return "primary";
  }
}

function getIcon(status: string) {
  switch (status) {
    case "ongoing":
      return "i-lucide-play-circle";
    case "completed":
      return "i-lucide-check-circle";
    case "canceled":
      return "i-lucide-x-circle";
    default:
      return "i-lucide-ticket";
  }
}

function getLabel(status: string) {
  switch (status) {
    case "ongoing":
      return "Ongoing";
    case "completed":
      return `Ended ${getRelativeDate(eventData.value?.start_date)}`;
    case "canceled":
      return "Canceled";
    default:
      return "Register";
  }
}

function getRelativeDate(dateStr: string) {
  const date = parseISO(dateStr);
  const distance = formatDistanceToNow(date, { addSuffix: true });
  return distance;
}
</script>
