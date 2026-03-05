<template>
  <div
    :class="[
      'relative flex rounded-xl border border-default overflow-hidden bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg transition-all duration-300 flex-col md:flex-row gap-4',
      isOdd ? 'md:flex-row-reverse' : '',
    ]"
    data-aos="fade-up"
    :data-aos-delay="100"
    data-aos-duration="800"
  >
    <!-- Event Image -->
    <div
      class="relative md:w-1/2 h-52 md:h-auto overflow-hidden rounded-lg border border-transparent"
      :class="
        isOdd
          ? 'md:rounded-r-xl md:border-l-0 md:border-r-primary/70'
          : 'md:rounded-l-xl md:border-r-0 md:border-l-primary/70'
      "
      data-aos="zoom-in"
    >
      <img
        :src="event?.image || '/placeholder.jpg'"
        :alt="event?.title || 'Event image'"
        class="w-full h-full object-cover"
        loading="lazy"
      />

      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

      <UBadge
        :label="event?.event_type || 'Event'"
        color="primary"
        variant="solid"
        class="absolute top-3 left-3"
      />

      <div
        class="absolute bottom-3 left-3 text-xs text-white bg-black/40 backdrop-blur px-3 py-1 rounded-md flex items-center gap-1"
      >
        <UIcon name="i-lucide-calendar" class="text-primary" />
        {{ formattedStartDate }}
        <span v-if="event?.end_date"> - {{ formattedEndDate }}</span>
      </div>
    </div>

    <!-- Event Content -->
    <div class="p-5 flex-1 flex flex-col gap-4" data-aos="fade-left">
      <p v-if="event?.tagline" class="text-sm text-primary font-medium">
        {{ event?.tagline }}
      </p>

      <h2 class="text-lg font-semibold leading-tight line-clamp-2">
        {{ event?.title || "Untitled Event" }}
      </h2>

      <p v-if="event?.description" class="text-sm text-muted line-clamp-3 break-words">
        {{ event.description }}
      </p>

      <div class="flex flex-col gap-1 text-sm text-muted">
        <p class="flex items-center gap-2 text-primary">
          <UIcon name="i-lucide-clock" /> {{ formattedStartDate || "Time TBA" }}
        </p>
        <p class="flex items-center gap-2">
          <UIcon name="i-lucide-map-pin" class="text-primary" />
          {{ event?.location || "Location TBA" }}
        </p>
        <p v-if="event?.venue" class="flex items-center gap-2">
          <UIcon name="i-lucide-home" class="text-primary" />
          {{ event.venue }}
        </p>
        <p v-if="event?.expected_attendees" class="flex items-center gap-2">
          <UIcon name="i-lucide-users" class="text-primary" />
          {{ event.expected_attendees }} Expected Attendees
        </p>
        <p v-if="event?.capacity" class="flex items-center gap-2">
          <UIcon name="i-lucide-users" class="text-primary" />
          {{ event.capacity }} seats available
        </p>
        <p v-if="event?.created_at" class="flex items-center gap-2 text-xs text-muted italic">
          Created {{ formatTimeAgo(event.created_at) }}
        </p>
      </div>

      <!-- Speakers -->
      <div v-if="event?.speakers?.length" class="flex items-center justify-between mt-2">
        <UPopover >
          <UAvatarGroup :max="3">
            <UAvatar
              v-for="speaker in event.speakers"
              :key="speaker.name"
              :src="speaker.image"
              :alt="speaker.name"
              loading="lazy"
            />
          </UAvatarGroup>

          <template #content>
            <div class="p-3 flex flex-col gap-4 min-w-[240px] break-words">
              <div v-for="speaker in event.speakers" :key="speaker.name">
                <UUser
                  :name="speaker.name"
                  :description="speaker.title"
                  :avatar="{
                    src: speaker.image,
                    loading: 'lazy',
                    icon: 'i-lucide-user',
                  }"
                  class="break-words"
                />
                <div class="text-xs text-muted mt-1 space-y-1">
                  <p v-if="speaker.topic"><strong class="text-primary">Topic:</strong> {{ speaker.topic }}</p>
                  <p v-if="speaker.company"><strong class="text-primary">Company:</strong> {{ speaker.company }}</p>
                  <p v-if="speaker.bio" class="line-clamp-3">{{ speaker.bio }}</p>
                </div>
                <USeparator />
              </div>
            </div>
          </template>
        </UPopover>

        <span class="text-xs text-muted">
          {{ event.speakers.length }} Speaker{{ event.speakers.length > 1 ? "s" : "" }}
        </span>
      </div>

      <UButton
        icon="i-lucide-rocket"
        size="md"
        color="primary"
        variant="solid"
        label="Register Now"
        :to="event?.registration_link || '#'"
        target="_blank"
        class="mt-4 self-start"
        data-aos="fade-up"
        data-aos-delay="200"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { format, formatDistanceToNow, parseISO, isBefore } from "date-fns";

interface Speaker {
  name?: string;
  title?: string;
  topic?: string;
  company?: string;
  bio?: string;
  image?: string;
}

interface Event {
  title?: string;
  tagline?: string;
  image?: string;
  event_type?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  location?: string;
  venue?: string;
  capacity?: number;
  expected_attendees?: number;
  registration_link?: string;
  created_at?: string;
  speakers?: Speaker[];
}

const props = defineProps<{
  event?: Event;
  isOdd?: boolean;
}>();

const formatTimeAgo = (dateStr?: string) => {
  if (!dateStr) return "";
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
};

const formattedStartDate = computed(() => {
  const startDate = props.event?.start_date;
  if (!startDate) return "Date TBA";
  const start = parseISO(startDate);
  const now = new Date();
  return isBefore(start, now)
    ? format(start, "d MMM yyyy")
    : formatDistanceToNow(start, { addSuffix: true });
});

const formattedEndDate = computed(() => {
  const endDate = props.event?.end_date;
  if (!endDate) return "";
  return format(parseISO(endDate), "d MMM yyyy");
});
</script>