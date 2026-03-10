<template>
  <section class="pb-16">
    <OnThisPage :sections="sections" />

    <!-- HERO SECTION -->
    <section
      id="hero"
      class="relative h-[460px] md:h-[620px] flex items-center justify-center text-center overflow-hidden bg-gradient-to-br from-primary-500/30 to-primary-900/30"
      data-aos="fade-down"
    >
      <img
        :src="ctaImg"
        alt="Murang'a University of Technology"
        class="absolute right-0 bottom-0 w-full h-full md:h-full object-cover opacity-90"
        data-aos="fade-up"
        data-aos-duration="1200"
      />

      <div
        class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent dark:from-black/80 dark:via-black/60"
      ></div>

      <div class="relative z-10 px-6">
        <h3 class="text-4xl md:text-5xl font-bold text-white">Our Projects</h3>
        <p class="mt-4 text-lg md:text-xl text-gray-200 max-w-xl mx-auto">
          Explore innovative projects built by our members.
        </p>
      </div>
    </section>

    <!-- FILTERS SECTION -->
    <section
      id="filters"
      class="mt-10 max-w-5xl mx-auto flex flex-col gap-4 sticky top-15 backdrop-blur z-10 py-3"
      data-aos="fade-down"
      data-aos-delay="100"
    >
      <div class="flex gap-2 items-center">
        <UInput
          v-model="search"
          placeholder="Search projects..."
          icon="i-lucide-search"
          size="lg"
          @update:model-value="onSearch"
          class="transition-shadow focus:shadow-lg flex-1"
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

      <div class="flex flex-wrap gap-3 justify-between items-center">
        <div
          class="flex flex-wrap gap-2"
          role="group"
          aria-label="Project categories"
        >
          <UButton
            label="All"
            :variant="activeType === 'All' ? 'solid' : 'outline'"
            :icon="activeType === 'All' ? 'i-lucide-check' : ''"
            @click="setFilter('All')"
            class="transition-transform hover:scale-105"
            :aria-pressed="activeType === 'All'"
          />

          <UButton
            v-for="type in projectTypes"
            :key="type.value"
            :label="type.label"
            :variant="activeType === type.value ? 'solid' : 'outline'"
            :icon="activeType === type.value ? 'i-lucide-check' : ''"
            @click="setFilter(type.value)"
            class="transition-transform hover:scale-105"
            :aria-pressed="activeType === type.value"
          />
        </div>

        <USelect
          v-model="sort"
          :items="sortOptions"
          icon="i-lucide-arrow-up-down"
          class="w-48 transition-transform hover:scale-105"
          @update:model-value="onSearch"
          aria-label="Sort projects"
        />
      </div>

      <!-- Active Filters Summary -->
      <div v-if="!isFiltersDefault" class="text-sm text-muted mt-2">
        Active filters:
        <span v-if="search" class="inline-flex items-center gap-1 mr-3">
          <UIcon name="i-lucide-search" class="w-3 h-3" />
          "{{ search }}"
        </span>
        <span
          v-if="activeType !== 'All'"
          class="inline-flex items-center gap-1 mr-3"
        >
          <UIcon name="i-lucide-tag" class="w-3 h-3" />
          {{ getTypeLabel(activeType) }}
        </span>
        <span v-if="sort !== 'desc'" class="inline-flex items-center gap-1">
          <UIcon name="i-lucide-arrow-up-down" class="w-3 h-3" />
          {{ sort === "asc" ? "Oldest first" : "Newest first" }}
        </span>
      </div>
    </section>

    <!-- PROJECTS GRID SECTION -->
    <section
      id="projects"
      class="mt-6 max-w-6xl mx-auto scroll-mt-20"
      aria-label="Projects grid"
    >
      <!-- Results count -->
      <div v-if="projects.length > 0" class="text-sm text-muted mb-4 px-2">
        Showing {{ projects.length }} project{{
          projects.length !== 1 ? "s" : ""
        }}
        <span v-if="!isFiltersDefault">with current filters</span>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full">
        <!-- Loading State -->
        <template v-if="pending || loadingMore">
          <div class="col-span-full flex justify-center py-10">
            <Loader />
          </div>
        </template>

        <!-- Error State -->
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

        <!-- Empty State -->
        <template v-else-if="projects.length === 0">
          <div class="col-span-full flex justify-center my-10">
            <UEmpty
              icon="i-lucide-folder-x"
              title="No Projects Found"
              description="We couldn't find any projects matching your filters. Try refreshing or adjusting your search."
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

        <!-- Projects Grid -->
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

      <!-- Load More Button -->
      <div v-if="projects.length > 0" class="mt-12 flex justify-center">
        <UButton
          label="Load More"
          trailing-icon="i-lucide-chevron-down"
          size="lg"
          :loading="loadingMore"
          :disabled="!hasMore || pending"
          @click="loadMore"
          class="transition-transform hover:scale-105"
          :aria-label="
            hasMore ? 'Load more projects' : 'No more projects to load'
          "
        />

        <!-- End of results message -->
        <p
          v-if="!hasMore && projects.length > 0"
          class="text-sm text-muted mt-4 text-center w-full"
        >
          You've reached the end of the results
        </p>
      </div>
    </section>

    <!-- CALL TO ACTION SECTION -->
    <section
      id="cta"
      class="w-full py-24 bg-gradient-to-tr from-primary-600/10 via-transparent to-primary-400/10 scroll-mt-20"
      data-aos="fade-up"
      aria-label="Join us call to action"
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
import type { Project } from "~/types";
import ctaImg from "~/assets/files/talk-is-cheap-show-me-the-code.png";
const sections = [
  { id: "hero", label: "Hero" },
  { id: "filters", label: "Filters" },
  { id: "projects", label: "Projects" },
  { id: "cta", label: "Join Us" },
];

const config = useAppConfig();
const router = useRouter();
const route = useRoute();

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
  { value: "iot", label: "IoT" },
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
const loadingError = ref<Error | null>(null);
const projects = ref<Project[]>([]);

const endpoints = useEndpoints();
const { get } = useApi();

const isFiltersDefault = computed(() => {
  return (
    search.value === "" && sort.value === "desc" && activeType.value === "All"
  );
});

function getTypeLabel(typeValue: string): string {
  const type = projectTypes.find((t) => t.value === typeValue);
  return type?.label || typeValue;
}

onMounted(() => {
  if (route.query.search) {
    search.value = route.query.search as string;
  }
  if (route.query.sort) {
    sort.value = route.query.sort as string;
  }
  if (route.query.type && route.query.type !== "All") {
    activeType.value = route.query.type as string;
  }

  fetchProjects(true);
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

    if (newQuery.type !== undefined && newQuery.type !== activeType.value) {
      activeType.value = (newQuery.type as string) || "All";
      shouldRefetch = true;
    }

    if (shouldRefetch) {
      fetchProjects(true);
    }
  },
  { deep: true },
);

let updateUrlTimeout: NodeJS.Timeout;
watch([search, sort, activeType], () => {
  clearTimeout(updateUrlTimeout);
  updateUrlTimeout = setTimeout(() => {
    const query: Record<string, string> = {};

    if (search.value) {
      query.search = search.value;
    }
    if (sort.value !== "desc") {
      query.sort = sort.value;
    }
    if (activeType.value !== "All") {
      query.type = activeType.value;
    }

    router.replace({ query });
  }, 300);
});

async function fetchProjects(reset = false) {
  if (reset) {
    offset.value = 0;
    hasMore.value = true;
    projects.value = [];
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

    params.sort = sort.value === "desc" ? "created_at" : "-created_at";

    if (activeType.value !== "All") {
      params.category = activeType.value;
    }

    const res = await get(endpoints.projects.list, params);
    const newProjects = res?.results ?? [];

    if (newProjects.length < limit.value) {
      hasMore.value = false;
    }

    projects.value.push(...newProjects);
    offset.value += limit.value;
  } catch (err) {
    loadingError.value = err as Error;
    console.error("Failed to fetch projects:", err);
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

function resetFilters() {
  search.value = "";
  sort.value = "desc";
  activeType.value = "All";
  fetchProjects(true);
}

function loadMore() {
  if (!hasMore.value || loadingMore.value) return;
  fetchProjects();
}

let searchTimeout: NodeJS.Timeout;
function onSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => fetchProjects(true), 400);
}
</script>
