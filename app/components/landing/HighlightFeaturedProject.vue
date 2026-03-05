<template>
  <section class="py-20 bg-muted/30">
    <div class="max-w-7xl mx-auto px-6 flex flex-col items-center">
      <!-- Header -->
      <div class="max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight">Featured Projects</h2>
        <p class="mt-3 text-lg text-muted">
          Explore some of the innovative projects built by our members
        </p>
      </div>

      <!-- Projects Grid -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full">
        <!-- Loading -->
        <template v-if="pending">
          <div class="col-span-full flex justify-center py-10">
            <Loader />
          </div>
        </template>

        <!-- Error -->
        <template v-else-if="error">
          <div class="col-span-full flex flex-col items-center gap-4 py-10">
            <UBanner
              color="error"
              icon="i-lucide-cloud-alert"
              title="Failed to load Projects"
            />

            <UButton
              label="Retry"
              variant="outline"
              icon="i-lucide-refresh-cw"
              @click="refresh"
            />
          </div>
        </template>

        <!-- Success -->
        <template v-else>
          <ProjectsCard
            v-for="(project, index) in data.results"
            :key="project.id"
            data-aos="fade-up"
            :data-aos-delay="index * 120"
            :project="project"
          />
        </template>
      </div>

      <!-- CTA -->
      <div class="mt-12">
        <UButton
          label="View All Projects"
          trailing-icon="i-lucide-arrow-right"
          to="/projects"
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
  "events",
  () => get(endpoints.projects.list),
  {
    lazy: true,

    // prevents undefined errors
    default: () => ({
      projects: [],
    }),
  },
);
</script>
