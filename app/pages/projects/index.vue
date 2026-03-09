<template>
  <section class="pb-16">
    <!-- Hero Header -->
    <section
      class="text-center h-[400px] flex flex-col justify-center items-center bg-gradient-to-br from-primary-500/30 to-primary-900/30"
      data-aos="fade-down"
    >
      <h3 class="text-5xl font-bold">Our Projects</h3>
      <p class="text-muted mt-3 text-xl">
        Explore innovative projects built by our members.
      </p>
    </section>

    <!-- Sticky Filter Bar -->
    <section
      class="mt-10 max-w-5xl mx-auto flex flex-col gap-4 sticky top-0 backdrop-blur z-10 py-3"
      data-aos="fade-down"
      data-aos-delay="100"
    >
      <UInput
        v-model="search"
        placeholder="Search projects..."
        icon="i-lucide-search"
        size="lg"
        @update:model-value="onSearch"
        class="transition-shadow focus:shadow-lg"
      />

      <div class="flex flex-wrap gap-3 justify-between items-center">
        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="type in projectTypes"
            :key="type"
            :label="type.label"
            :variant="activeType === type.value ? 'solid' : 'outline'"
            :icon="activeType === type.value ? 'i-lucide-check' : ''"
            @click="setFilter(type.value)"
            class="transition-transform hover:scale-105"
          />
        </div>

        <USelect
          v-model="sort"
          :items="sortOptions"
          icon="i-lucide-arrow-up-down"
          class="w-48 transition-transform hover:scale-105"
          @update:model-value="onSearch"
        />
      </div>
    </section>

    <!-- Projects Grid -->
    <section class="mt-6 max-w-6xl mx-auto">
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full">
        <template v-if="pending || loadingMore">
          <div class="col-span-full flex justify-center py-10">
            <Loader />
          </div>
        </template>

        <template v-else-if="error || loadingError">
          <div
            class="col-span-full flex flex-col items-center gap-4 py-10"
            data-aos="fade-up"
          >
            <UBanner
              color="error"
              icon="i-lucide-cloud-alert"
              title="Failed to load Projects"
            />
            <UButton
              label="Retry"
              variant="outline"
              icon="i-lucide-refresh-cw"
              @click="reload"
            />
          </div>
        </template>

        <template v-else-if="projects.length === 0">
         
        <div  class="text-center py-20">
          <UIcon name="i-lucide-message-square-off" class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 class="text-xl font-semibold mb-2 dark:text-white">No Reviews Found</h3>
          <p class="text-gray-500 dark:text-gray-400">Try adjusting your filters or check back later.</p>
        </div>
        </template>

        <template v-else>
          <ProjectsCard
            v-for="project in projects"
            :key="project.id"
            :project="project"
            data-aos="fade-up"
            data-aos-delay="50"
            class="transition-transform hover:scale-105"
          />
        </template>
      </div>

      <div v-if="projects.length > 0" class="mt-12 flex justify-center">
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

    <!-- Call to Action -->
    <section
      class="w-full py-24 bg-gradient-to-tr from-primary-600/10 via-transparent to-primary-400/10"
      data-aos="fade-up"
    >
      <div class="max-w-6xl mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-bold">
          Want to Build Something Amazing?
        </h2>
        <p class="mt-3 text-muted max-w-xl mx-auto">
          Join MUT Tech Club and work on exciting projects that make a real
          impact. Turn your ideas into reality with support from our community.
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
const config = useAppConfig();
useSeoPage({
  title: `Explore Projects | ${config.site.title}`,
  description:
    "Discover our latest projects, innovations, and case studies showcasing creativity and expertise.",
});
const projectTypes = [
  { value: "ai", label: "AI" },
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "robotics", label: "Robotics" },
  { value: "open_source", label: "Open Source" },
  { value: "data_science", label: "Data Science" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "iot", label: "IoT" }
];
const sortOptions = [
  { label: "Newest", value: "desc" },
  { label: "Oldest", value: "asc" },
];

const activeType = ref("All");
const search = ref("");
const sort = ref("desc");
const limit = ref(9);
const offset = ref(0);
const hasMore = ref(true);
const loadingMore = ref(false);
const loadingError = ref(null);
const projects = ref<any[]>([]);

const endpoints = useEndpoints();
const { get } = useApi();

async function fetchProjects(reset = false) {
  if (reset) {
    offset.value = 0;
    hasMore.value = true;
    projects.value = [];
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
    if (activeType.value !== "All") params.category = activeType.value;

    const res = await get(endpoints.projects.list, params);
    const newProjects = res?.results ?? [];

    if (newProjects.length < limit.value) hasMore.value = false;
    projects.value.push(...newProjects);
    offset.value += limit.value;
  } catch (err) {
    loadingError.value = err;
    console.error(err);
  } finally {
    loadingMore.value = false;
  }
}

const { pending, error, refresh } = await useAsyncData("projects", async () => {
  await fetchProjects(true);
  return true;
});

function reload() {
  refresh();
}

function setFilter(type: string) {
  if (type === activeType.value) return;
  activeType.value = type;
  fetchProjects(true);
}

function loadMore() {
  if (!hasMore.value) return;
  fetchProjects();
}

let timeout: any;
function onSearch() {
  clearTimeout(timeout);
  timeout = setTimeout(() => fetchProjects(true), 400);
}

onMounted(() => {
  fetchProjects(true);
});
</script>
