<template>
  <div
    class="relative rounded-xl border border-default overflow-hidden bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg transition-all duration-300"
  >
    <!-- Event Image -->
    <div class="relative h-52 w-full overflow-hidden">
      <img
        :src="event?.image || '/placeholder.jpg'"
        :alt="event?.title || 'Event image'"
        class="w-full h-full object-cover"
        loading="lazy"
      />

      <!-- Gradient Overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
      ></div>

      <!-- Event Type -->
      <UBadge
        :label="event?.event_type || 'Event'"
        color="primary"
        variant="solid"
        class="absolute top-3 left-3"
      />

      <!-- Date Badge -->
      <div
        class="absolute bottom-3 left-3 text-xs text-white bg-black/40 backdrop-blur px-3 py-1 rounded-md flex items-center gap-1"
      >
        <UIcon name="i-lucide-calendar" />
        {{ event?.start_date || "TBA" }}
      </div>
    </div>

    <!-- Content -->
    <div class="p-5 flex flex-col gap-4">
      <!-- Tagline -->
      <p v-if="event?.tagline" class="text-sm text-primary font-medium">
        {{ event?.tagline }}
      </p>

      <!-- Title -->
      <h2 class="text-lg font-semibold leading-tight line-clamp-2">
        {{ event?.title || "Untitled Event" }}
      </h2>

      <!-- Event Info -->
      <div class="flex flex-col gap-1 text-sm text-muted">
        <p class="flex items-center gap-2">
          <UIcon name="i-lucide-clock" />
          {{ event?.start_time || "Time TBA" }}
        </p>

        <p class="flex items-center gap-2">
          <UIcon name="i-lucide-map-pin" />
          {{ event?.location || "Location TBA" }}
        </p>

        <p v-if="event?.capacity" class="flex items-center gap-2">
          <UIcon name="i-lucide-users" />
          {{ event.capacity }} seats available
        </p>
      </div>

      <!-- Speakers -->
      <div
        v-if="event?.speakers?.length"
        class="flex items-center justify-between"
      >
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

          <!-- Speaker Details -->
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

        <span class="text-xs text-muted">
          {{ event.speakers.length }} Speaker{{
            event.speakers.length > 1 ? "s" : ""
          }}
        </span>
      </div>

      <!-- CTA -->
      <UButton
        icon="i-lucide-rocket"
        size="md"
        color="primary"
        variant="solid"
        label="Register Now"
        :to="event?.registration_link || '#'"
        target="_blank"
        class="mt-2"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
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
  start_time?: string;
  location?: string;
  capacity?: number;
  registration_link?: string;
  speakers?: Speaker[];
}

defineProps<{
  event?: Event;
}>();
</script>
