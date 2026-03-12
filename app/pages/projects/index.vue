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
        loading="lazy"
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
      class="sticky top-16 z-40 mt-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-y border-gray-200 dark:border-neutral-800 scroll-mt-16"
      data-aos="fade-down"
      data-aos-delay="100"
    >
      <div class="max-w-5xl mx-auto px-2 py-2">
        <!-- Search and Reset Row -->
        <div class="flex gap-2 mb-4">
          <UInput
            v-model="search"
            placeholder="Search projects..."
            icon="i-lucide-search"
            size="md"
            class="flex-1"
            :ui="{
              wrapper: 'w-full',
              base: 'h-10 pl-10',
              icon: { trailing: { pointer: '' } },
            }"
            @update:model-value="onSearch"
          />
          <UButton
            icon="i-lucide-rotate-ccw"
            variant="soft"
            color="gray"
            size="md"
            :disabled="isFiltersDefault"
            @click="resetFilters"
            class="shrink-0"
            :ui="{ base: 'h-10 px-3' }"
            title="Reset filters"
          />
        </div>

        <!-- Categories and Sort Row -->
        <div
          class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
        >
          <!-- Category Filters -->
          <div
            class="flex flex-wrap gap-1.5"
            role="group"
            aria-label="Project categories"
          >
            <UButton
              label="All"
              size="sm"
              :color="activeType === 'All' ? 'primary' : 'neutral'"
              :variant="activeType === 'All' ? 'solid' : 'soft'"
              @click="setFilter('All')"
              class="!px-3 !py-1.5 text-xs"
              :aria-pressed="activeType === 'All'"
            />

            <UButton
              v-for="type in projectTypes"
              :key="type.value"
              :label="type.label"
              size="sm"
              :color="activeType === type.value ? 'primary' : 'neutral'"
              :variant="activeType === type.value ? 'solid' : 'soft'"
              @click="setFilter(type.value)"
              class="!px-3 !py-1.5 text-xs"
              :aria-pressed="activeType === type.value"
            />
          </div>

          <!-- Sort Dropdown -->
          <USelect
            v-model="sort"
            :items="sortOptions"
            value-key="value"
            label-key="label"
            icon="i-lucide-arrow-up-down"
            size="sm"
            class="w-full sm:w-40"
            :ui="{
              base: 'h-9',
              wrapper: 'w-full',
            }"
            @update:model-value="onSearch"
            aria-label="Sort projects"
          />
        </div>

        <!-- Active Filters Summary -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <div
            v-if="!isFiltersDefault"
            class="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-gray-200 dark:border-neutral-800 text-xs"
          >
            <span class="text-gray-500 dark:text-gray-400 font-medium"
              >Active:</span
            >

            <span
              v-if="search"
              class="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full"
            >
              <UIcon name="i-lucide-search" class="w-3 h-3" />
              "{{ search }}"
            </span>

            <span
              v-if="activeType !== 'All'"
              class="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full"
            >
              <UIcon name="i-lucide-tag" class="w-3 h-3" />
              {{ getTypeLabel(activeType) }}
            </span>

            <span
              v-if="sort !== 'desc'"
              class="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full"
            >
              <UIcon name="i-lucide-arrow-up-down" class="w-3 h-3" />
              {{ sort === "asc" ? "Oldest first" : "Newest first" }}
            </span>

            <UButton
              label="Clear all"
              color="neutral"
              variant="link"
              size="xs"
              class="!text-xs underline"
              @click="resetFilters"
            />
          </div>
        </Transition>
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

        <!-- Error State -->
        <template v-if="error || loadingError">
          <div
            class="col-span-full flex flex-col items-center gap-4 py-10"
            data-aos="fade-up"
          >
            <ErrorState
              title="Failed to load projects"
              description="Unable to fetch projects. Please try again."
              @retry="reload"
            />
          </div>
        </template>

        <!-- Empty State -->
        <template v-else-if="projects.length === 0">
          <div class="col-span-full flex justify-center my-10">
            <EmptyState
              icon="i-lucide-folder-x"
              title="No Projects Found"
              description="We couldn't find any projects matching your filters."
              :action="'Reset Filters'"
              @action="resetFilters"
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

        <template v-if="pending || loadingMore">
          <div class="col-span-full flex justify-center py-10">
            <Loader />
          </div>
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
          impact.
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
