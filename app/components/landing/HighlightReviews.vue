<template>
  <section id="reviews" class="py-20 bg-muted/30">
    <div class="max-w-7xl mx-auto px-6 flex flex-col items-center">
      <div class="max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight">What Our Members Say</h2>
        <p class="mt-3 text-lg text-muted">
          Hear from alumni who have gone on to achieve great things
        </p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full">
        <template v-if="pending">
          <div class="col-span-full flex justify-center py-10">
            <Loader />
          </div>
        </template>

        <template v-else-if="error">
          <div class="col-span-full flex flex-col items-center gap-4 py-10">
            <UBanner
              color="error"
              icon="i-lucide-cloud-alert"
              title="Failed to load Reviews"
            />
            <UButton
              label="Retry"
              variant="outline"
              icon="i-lucide-refresh-cw"
              @click="refresh"
            />
          </div>
        </template>

        <template v-else>
          <div
            v-for="(review, index) in (data?.results?.slice(0,3) || [])"
            :key="review?.id || index"
            class="w-full"
            data-aos="fade-up"
            :data-aos-delay="index * 120"
            data-aos-duration="800"
          >
            <UPageCTA
              :description="review?.content || 'No review content available.'"
              variant="naked"
              class="rounded-none"
              :ui="{
                container: 'sm:py-12 lg:py-12 sm:gap-8 relative',
                description:
                  '!text-base md:!text-lg text-balance relative leading-relaxed text-muted before:content-[open-quote] before:text-5xl lg:before:text-7xl before:text-primary/30 before:absolute before:-left-6 lg:before:-left-10 before:-top-3 after:content-[close-quote] after:text-5xl lg:after:text-7xl after:text-primary/30 after:absolute after:-right-2 after:top-2',
              }"
            >
              <div class="flex justify-center mt-6">
                <UUser
                  :name="review?.user_profile?.full_name || 'Anonymous'"
                  :description="review?.user_profile?.course || 'Student'"
                  :avatar="{
                    src: review?.user_profile?.profile_picture || undefined,
                    icon: 'i-lucide-user',
                  }"
          
                  size="xl"
                />
              </div>
            </UPageCTA>
          </div>
        </template>
      </div>

      <div class="mt-12">
        <UButton
          label="View All Reviews"
          variant="ghost"
          trailing-icon="i-lucide-arrow-right"
          to="/reviews"
          size="xl"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const endpoints = useEndpoints();
const { get } = useApi();

const { data, pending, error, refresh } = await useAsyncData(
  "reviews",
  () => get(endpoints.reviews.list),
  {
    lazy: true,
    default: () => ({ projects: [] }),
  },
);
</script>
