<template>
  <div
    class="relative rounded-xl border border-default overflow-hidden bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg transition-all duration-300"
  >
    <!-- Event Image -->
    <div class="relative h-48 md:h-52 w-full overflow-hidden">
      <NuxtLink v-if="event?.slug" :to="`/events/${event.slug}`">
        <img
          :src="event?.image || '/placeholder.jpg'"
          :alt="event?.title || 'Event image'"
          class="w-full h-full object-cover"
          loading="lazy"
        />

        <!-- Gradient Overlay -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
        ></div>

        <!-- Event Type Badge -->
        <UBadge
          :label="event?.event_type || 'Event'"
          color="primary"
          variant="solid"
          class="absolute top-2 left-2 text-xs md:text-sm"
        />

        <!-- Date Badge (Muted & readable) -->
        <div
          class="absolute bottom-2 left-2 text-[10px] sm:text-xs text-muted bg-black/30 backdrop-blur px-2 py-1 rounded-md flex items-center gap-1"
        >
          <UIcon name="i-lucide-calendar" class="w-3 h-3 sm:w-4 sm:h-4" />
          {{ event?.start_date ? getRelativeDate(event.start_date) : "TBA" }}
        </div>
      </NuxtLink>
    </div>

    <!-- Content -->
    <div class="p-4 sm:p-5 flex flex-col gap-3 sm:gap-4">
      <!-- Tagline -->
      <NuxtLink
        v-if="event?.tagline && event?.slug"
        :to="`/events/${event.slug}`"
      >
        <p class="text-[12px] sm:text-sm text-primary font-medium truncate">
          {{ event.tagline }}
        </p>
      </NuxtLink>

      <!-- Title -->
      <NuxtLink v-if="event?.slug" :to="`/events/${event.slug}`">
        <h2 class="text-sm sm:text-lg font-semibold leading-tight line-clamp-2">
          {{ event?.title || "Untitled Event" }}
        </h2>
      </NuxtLink>

      <!-- Event Info -->
      <div class="flex flex-col gap-1 text-[11px] sm:text-sm text-muted">
        <p class="flex items-center gap-1 sm:gap-2 text-[12px]">
          <UIcon name="i-lucide-clock" class="w-3 h-3 sm:w-4 sm:h-4" />
          {{ formatEventTime(event?.start_date, event?.end_date) }}
        </p>

        <p class="flex items-center gap-1 sm:gap-2">
          <UIcon name="i-lucide-map-pin" class="w-3 h-3 sm:w-4 sm:h-4" />
          {{ event?.location || "Location TBA" }}
        </p>

        <p v-if="event?.capacity" class="flex items-center gap-1 sm:gap-2">
          <UIcon name="i-lucide-users" class="w-3 h-3 sm:w-4 sm:h-4" />
          {{ event.capacity }} seats available
        </p>
      </div>

      <!-- Speakers -->
      <div
        v-if="event?.speakers?.length"
        class="flex items-center justify-between mt-2 sm:mt-3"
      >
        <UPopover>
          <UAvatarGroup :max="3">
            <UAvatar
              v-for="speaker in event.speakers"
              :key="speaker.name"
              :src="speaker.image"
              :alt="speaker.name"
              loading="lazy"
              class="w-6 h-6 sm:w-8 sm:h-8"
            />
          </UAvatarGroup>

          <template #content>
            <div class="p-3 flex flex-col gap-4 min-w-[240px]">
              <div v-for="speaker in event.speakers" :key="speaker.name">
                <UUser
                  :name="speaker.name"
                  :description="speaker.title"
                  :avatar="{
                    src: speaker.image,
                    loading: 'lazy',
                    icon: 'i-lucide-user',
                  }"
                />
                <div class="text-xs text-muted mt-1 space-y-1">
                  <p v-if="speaker.topic">
                    <strong>Topic:</strong> {{ speaker.topic }}
                  </p>
                  <p v-if="speaker.company">{{ speaker.company }}</p>
                  <p v-if="speaker.bio" class="line-clamp-3">
                    {{ speaker.bio }}
                  </p>
                </div>
                <USeparator />
              </div>
            </div>
          </template>
        </UPopover>

        <span class="text-[10px] sm:text-xs text-muted">
          {{ event.speakers.length }} Speaker{{
            event.speakers.length > 1 ? "s" : ""
          }}
        </span>
      </div>

      <!-- CTA -->
      <UButton
        v-if="event?.status "
        :icon="getIcon(event.status)"
        size="sm"
        :color="getColor(event.status)"
        :variant="event.status === 'completed'?'outline':'solid'"
        :disabled="event.status === 'ongoing' || event.status === 'completed'"
        :label="getLabel(event.status, event.start_date || null)"
        :to="event?.registration_link || '#'"
        target="_blank"
        class="mt-2 sm:mt-3 w-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { format, parseISO, formatDistanceToNow, isFuture } from "date-fns";

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
  start_date?: string;
  end_date?: string;
  location?: string;
  capacity?: number;
  registration_link?: string;
  status?: "ongoing" | "completed" | "canceled";
  speakers?: Speaker[];
}

const props = defineProps<{
  event?: Event;
}>();


// Display relative date like "3 days ago" or "in 5 days"
function getRelativeDate(dateStr: string) {
  const date = parseISO(dateStr);
  const distance = formatDistanceToNow(date, { addSuffix: true });
  return distance;
}

// Format start and end time for event info
function formatEventTime(start?: string, end?: string) {
  if (!start) return "--";
  const startDate = parseISO(start);
  const endDate = end ? parseISO(end) : null;
  if (endDate) {
    return `${format(startDate, "PPpp")} -to- ${format(endDate, "PPpp")}`;
  }
  return format(startDate, "PPpp");
}
</script>
