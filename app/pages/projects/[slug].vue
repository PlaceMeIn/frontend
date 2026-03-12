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
              to="/projects"
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
              v-if="projectData?.demo_link"
              :to="projectData.demo_link"
              target="_blank"
              color="primary"
              size="sm"
              class="!px-3 !py-1.5 text-xs font-medium"
            >
              <UIcon name="i-lucide-external-link" class="w-3.5 h-3.5 mr-1.5" />
              Demo
            </UButton>

            <UButton
              v-if="projectData?.code_link"
              :to="projectData.code_link"
              target="_blank"
              color="neutral"
              variant="soft"
              size="sm"
              class="!px-3 !py-1.5 text-xs font-medium"
            >
              <UIcon name="i-lucide-github" class="w-3.5 h-3.5 mr-1.5" />
              Code
            </UButton>

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

      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center items-center min-h-[50vh]">
        <div class="text-center">
          <UIcon
            name="i-lucide-loader-circle"
            class="w-10 h-10 text-primary animate-spin mx-auto mb-3"
          />
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Loading project...
          </p>
        </div>
      </div>

      <!-- Error State -->
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
          Unable to load project
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

      <!-- Project Content -->
      <div v-else-if="projectData" class="space-y-4">
        <!-- Image Gallery Grid - Hero Section -->
        <section id="gallery" class="scroll-mt-14">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <!-- Main Image -->
            <div
              class="relative md:col-span-2 lg:col-span-1 aspect-[16/9] md:aspect-[21/9] lg:aspect-[16/9] rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800 cursor-pointer group"
              @click="openImageViewer(projectData.image, projectData.title)"
            >
              <img
                :src="projectData.image"
                :alt="projectData.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div
                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <div class="bg-black/60 rounded-full p-2">
                  <UIcon name="i-lucide-zoom-in" class="w-5 h-5 text-white" />
                </div>
              </div>

              <!-- Category Badge -->
              <div class="absolute top-3 left-3">
                <UBadge
                  color="primary"
                  variant="solid"
                  class="!px-2.5 !py-1 text-xs font-medium backdrop-blur-sm bg-opacity-90"
                >
                  <UIcon
                    :name="getCategoryIcon(projectData.category)"
                    class="w-3 h-3 mr-1"
                  />
                  {{ projectData.category_display || projectData.category }}
                </UBadge>
              </div>

              <!-- Featured Badge -->
              <div class="absolute top-3 right-3">
                <UBadge
                  v-if="projectData.is_featured"
                  color="warning"
                  variant="solid"
                  class="!px-2.5 !py-1 text-xs font-medium backdrop-blur-sm bg-opacity-90"
                >
                  <UIcon name="i-lucide-star" class="w-3 h-3 mr-1" />
                  Featured
                </UBadge>
              </div>
            </div>

            <!-- Gallery Thumbnails -->
            <div
              v-if="projectData.images?.length"
              class="grid grid-cols-2 gap-3"
            >
              <div
                v-for="(img, idx) in projectData.images.slice(0, 4)"
                :key="img.id"
                class="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800 cursor-pointer group relative"
                @click="
                  openImageViewer(
                    img.image,
                    img.caption || `Project image ${idx + 1}`,
                  )
                "
              >
                <img
                  :src="img.image"
                  :alt="img.caption || `Project image ${idx + 1}`"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div
                  class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <div class="bg-black/60 rounded-full p-1.5">
                    <UIcon
                      name="i-lucide-zoom-in"
                      class="w-3.5 h-3.5 text-white"
                    />
                  </div>
                </div>

                <!-- More images overlay -->
                <div
                  v-if="idx === 3 && projectData.images.length > 4"
                  class="absolute inset-0 bg-black/60 flex items-center justify-center"
                >
                  <span class="text-white font-semibold text-sm"
                    >+{{ projectData.images.length - 4 }}</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Title and Meta -->
          <div class="mt-3">
            <h1
              class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white"
            >
              {{ projectData.title }}
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ projectData.short_description }}
            </p>
          </div>

        <p class="text-muted text-sm">Created {{ formatDistanceToNow(projectData.created_at) }}</p>
        </section>

        <!-- Quick Stats Bar -->
        <div
          class="grid grid-cols-4 gap-2 p-3 bg-white dark:bg-neutral-900 rounded-lg shadow-sm"
        >
          <div class="text-center">
            <p class="text-xs text-gray-500 dark:text-gray-400">Contributors</p>
            <p class="font-semibold text-sm">
              {{
                projectData.contributor_count ||
                projectData.contributors?.length ||
                0
              }}
            </p>
          </div>
          <div class="text-center">
            <p class="text-xs text-gray-500 dark:text-gray-400">Tech Stack</p>
            <p class="font-semibold text-sm">
              {{ projectData.tech_stack?.length || 0 }}
            </p>
          </div>
          <div class="text-center">
            <p class="text-xs text-gray-500 dark:text-gray-400">Likes</p>
            <p class="font-semibold text-sm">
              {{ projectData.likes_count || 0 }}
            </p>
          </div>
          <div class="text-center">
            <p class="text-xs text-gray-500 dark:text-gray-400">Saves</p>
            <p class="font-semibold text-sm">
              {{ projectData.takeaways_count || 0 }}
            </p>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Left Column - Main Info -->
          <div class="lg:col-span-2 space-y-4">
            <!-- Description -->
            <section id="description" class="scroll-mt-14">
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
                  class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line"
                >
                  {{ projectData.description }}
                </p>
              </div>
            </section>

            <!-- Tech Stack -->
            <section id="tech-stack" class="scroll-mt-14">
              <div
                class="bg-white dark:bg-neutral-900 rounded-lg shadow-sm p-4"
              >
                <h2
                  class="text-base font-semibold mb-3 flex items-center gap-1.5"
                >
                  <div class="p-1 bg-primary/10 rounded">
                    <UIcon
                      name="i-lucide-cpu"
                      class="w-3.5 h-3.5 text-primary"
                    />
                  </div>
                  Tech Stack
                </h2>
                <div class="flex flex-wrap gap-1.5">
                  <UBadge
                    v-for="tech in projectData.tech_stack"
                    :key="tech"
                    color="neutral"
                    variant="soft"
                    class="!px-2.5 !py-1 text-xs"
                  >
                    <UIcon :name="getTechIcon(tech)" class="w-3 h-3 mr-1" />
                    {{ tech }}
                  </UBadge>
                </div>
              </div>
            </section>

            <!-- Contributors -->
            <section
              id="contributors"
              v-if="projectData.contributors?.length"
              class="scroll-mt-14"
            >
              <div
                class="bg-white dark:bg-neutral-900 rounded-lg shadow-sm p-4"
              >
                <h2
                  class="text-base font-semibold mb-3 flex items-center gap-1.5"
                >
                  <div class="p-1 bg-primary/10 rounded">
                    <UIcon
                      name="i-lucide-users"
                      class="w-3.5 h-3.5 text-primary"
                    />
                  </div>
                  Contributors ({{ projectData.contributors.length }})
                </h2>

                <div class="space-y-3">
                  <div
                    v-for="contributor in projectData.contributors"
                    :key="contributor.id"
                    class="flex gap-3 p-2 bg-gray-50 dark:bg-neutral-800/50 rounded-lg"
                  >
                    <div class="relative w-10 h-10 flex-shrink-0">
                      <img
                        :src="
                          contributor.user?.profile_picture ||
                          '/placeholder-avatar.jpg'
                        "
                        :alt="contributor.full_name"
                        class="w-full h-full rounded-full object-cover border border-gray-200 dark:border-neutral-700"
                      />
                      <div
                        v-if="contributor.is_verified_member"
                        class="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center"
                      >
                        <UIcon
                          name="i-lucide-check"
                          class="w-2.5 h-2.5 text-white"
                        />
                      </div>
                    </div>

                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-1">
                        <h3 class="font-medium text-sm">
                          {{ contributor.full_name }}
                        </h3>
                        <UBadge
                          v-if="contributor.is_verified_member"
                          color="primary"
                          size="xs"
                          variant="soft"
                          >Verified</UBadge
                        >
                      </div>
                      <p class="text-xs text-gray-600 dark:text-gray-400">
                        {{ contributor.course }} • Year
                        {{ contributor.year_of_study }}
                      </p>

                      <div class="mt-1 flex flex-wrap gap-1">
                        <UBadge
                          v-for="skill in formatContributorSkills(
                            contributor.technical_skills,
                          )"
                          :key="skill"
                          color="neutral"
                          variant="soft"
                          size="xs"
                          class="text-[10px]"
                        >
                          {{ skill }}
                        </UBadge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Right Column - Sidebar -->
          <div class="space-y-4">
            <!-- Mobile Sticky Bar -->
            <div class="lg:hidden sticky bottom-3 z-30">
              <div
                class="bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-800 p-3"
              >
                <div class="flex items-center gap-2">
                  <div class="flex-1">
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      Quick Actions
                    </p>
                  </div>
                  <div class="flex gap-1.5">
                    <UButton
                      v-if="projectData.demo_link"
                      :to="projectData.demo_link"
                      target="_blank"
                      color="primary"
                      size="sm"
                      class="!px-3 !py-1.5 text-xs"
                    >
                      Demo
                    </UButton>
                    <UButton
                      v-if="projectData.code_link"
                      :to="projectData.code_link"
                      target="_blank"
                      color="neutral"
                      variant="soft"
                      size="sm"
                      class="!px-3 !py-1.5 text-xs"
                    >
                      Code
                    </UButton>
                  </div>
                </div>
              </div>
            </div>

            <!-- Links Card -->
            <section id="links" class="scroll-mt-14">
              <div
                class="bg-white dark:bg-neutral-900 rounded-lg shadow-sm p-4"
              >
                <h3
                  class="text-sm font-semibold mb-3 flex items-center gap-1.5"
                >
                  <div class="p-1 bg-primary/10 rounded">
                    <UIcon
                      name="i-lucide-link-2"
                      class="w-3.5 h-3.5 text-primary"
                    />
                  </div>
                  Links
                </h3>

                <div class="space-y-2">
                  <UButton
                    v-if="projectData.demo_link"
                    :to="projectData.demo_link"
                    target="_blank"
                    color="primary"
                    variant="soft"
                    size="sm"
                    block
                    class="justify-start text-xs"
                  >
                    <UIcon
                      name="i-lucide-external-link"
                      class="w-3.5 h-3.5 mr-2"
                    />
                    Live Demo
                  </UButton>

                  <UButton
                    v-if="projectData.code_link"
                    :to="projectData.code_link"
                    target="_blank"
                    color="neutral"
                    variant="soft"
                    size="sm"
                    block
                    class="justify-start text-xs"
                  >
                    <UIcon name="i-lucide-github" class="w-3.5 h-3.5 mr-2" />
                    Source Code
                  </UButton>
                </div>
              </div>
            </section>

            <!-- Engagement Card -->
            <section id="engagement" class="scroll-mt-14">
              <div
                class="bg-white dark:bg-neutral-900 rounded-lg shadow-sm p-4"
              >
                <h3
                  class="text-sm font-semibold mb-3 flex items-center gap-1.5"
                >
                  <div class="p-1 bg-primary/10 rounded">
                    <UIcon
                      name="i-lucide-heart"
                      class="w-3.5 h-3.5 text-primary"
                    />
                  </div>
                  Engagement
                </h3>

                <div class="grid grid-cols-3 gap-1.5 text-center mb-3">
                  <div class="p-2 bg-gray-50 dark:bg-neutral-800/50 rounded">
                    <UIcon
                      name="i-lucide-heart"
                      class="w-4 h-4 text-red-500 mx-auto mb-1"
                    />
                    <p class="font-semibold text-xs">
                      {{ projectData.likes_count || 0 }}
                    </p>
                    <p class="text-[10px] text-gray-500">Likes</p>
                  </div>
                  <div class="p-2 bg-gray-50 dark:bg-neutral-800/50 rounded">
                    <UIcon
                      name="i-lucide-share-2"
                      class="w-4 h-4 text-primary mx-auto mb-1"
                    />
                    <p class="font-semibold text-xs">
                      {{ projectData.shares_count || 0 }}
                    </p>
                    <p class="text-[10px] text-gray-500">Shares</p>
                  </div>
                  <div class="p-2 bg-gray-50 dark:bg-neutral-800/50 rounded">
                    <UIcon
                      name="i-lucide-bookmark"
                      class="w-4 h-4 text-primary mx-auto mb-1"
                    />
                    <p class="font-semibold text-xs">
                      {{ projectData.takeaways_count || 0 }}
                    </p>
                    <p class="text-[10px] text-gray-500">Saves</p>
                  </div>
                </div>

                <div class="flex gap-1.5">
                  <UButton
                    color="neutral"
                    variant="soft"
                    size="xs"
                    class="flex-1 text-xs"
                    @click="likeProject"
                  >
                    <UIcon
                      :name="
                        projectData.user_has_liked
                          ? 'i-lucide-heart'
                          : 'i-lucide-heart'
                      "
                      class="w-3.5 h-3.5 mr-1"
                    />
                    {{ projectData.user_has_liked ? "Liked" : "Like" }}
                  </UButton>
                  <UButton
                    color="neutral"
                    variant="soft"
                    size="xs"
                    class="flex-1 text-xs"
                    @click="saveTakeaway"
                  >
                    <UIcon name="i-lucide-bookmark" class="w-3.5 h-3.5 mr-1" />
                    Save
                  </UButton>
                </div>
              </div>
            </section>

            <!-- Share Card -->
            <section id="share" class="scroll-mt-14">
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
                    :to="`https://wa.me/?text=${encodeURIComponent(projectData.title + ' ' + currentUrl)}`"
                    target="_blank"
                    aria-label="Share on WhatsApp"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        <!-- Related Projects -->
        <section id="related" class="scroll-mt-14">
          <div class="bg-white dark:bg-neutral-900 rounded-lg shadow-sm p-4">
            <h2 class="text-base font-semibold mb-3 flex items-center gap-1.5">
              <div class="p-1 bg-primary/10 rounded">
                <UIcon
                  name="i-lucide-folder"
                  class="w-3.5 h-3.5 text-primary"
                />
              </div>
              Similar Projects
            </h2>
            <HighlightFeaturedProject
              :limit="10"
              :title="'Related projects'"
              :related="projectData?.category"
              :h-scroll=true
            />
          </div>
        </section>
      </div>

      <!-- Not Found State -->
      <div
        v-else
        class="flex flex-col items-center justify-center min-h-[50vh] gap-3"
      >
        <div
          class="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center"
        >
          <UIcon name="i-lucide-folder-x" class="w-8 h-8 text-gray-400" />
        </div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          Project Not Found
        </h2>
        <p
          class="text-gray-600 dark:text-gray-400 text-center max-w-md text-xs"
        >
          The project you're looking for doesn't exist or has been removed.
        </p>
        <UButton color="primary" size="sm" to="/projects" class="mt-1">
          <UIcon name="i-lucide-folder" class="w-3.5 h-3.5 mr-1.5" />
          Browse Projects
        </UButton>
      </div>
    </div>

    <!-- Image Viewer Modal -->
    <LazyImageCard
      v-if="showImageViewer"
      :images="galleryImages"
      :initial-index="currentImageIndex"
      @close="showImageViewer = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { formatDistanceToNow, parseISO } from "date-fns";

// State for image viewer
const showImageViewer = ref(false);
const currentImageIndex = ref(0);
const galleryImages = ref<Array<{ url: string; caption?: string }>>([]);

const openImageViewer = (imageUrl: string, caption?: string) => {
  // Build array of all images
  const images = [
    { url: projectData.value?.image || "", caption: projectData.value?.title },
    ...(projectData.value?.images?.map((img) => ({
      url: img.image,
      caption: img.caption,
    })) || []),
  ];

  galleryImages.value = images;
  currentImageIndex.value = images.findIndex((img) => img.url === imageUrl);
  showImageViewer.value = true;
};

interface Contributor {
  id: string;
  full_name: string;
  course: string;
  year_of_study: string;
  technical_skills: string;
  github_link: string | null;
  portfolio_website: string | null;
  is_verified_member: boolean;
  user: {
    profile_picture: string | null;
  };
}

interface ProjectImage {
  id: number;
  image: string;
  caption: string;
}

interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  category_display: string;
  description: string;
  short_description: string;
  image: string;
  tech_stack: string[];
  contributors: Contributor[];
  contributor_count: number;
  code_link: string | null;
  demo_link: string | null;
  is_featured: boolean;
  images: ProjectImage[];
  likes_count: number;
  shares_count: number;
  takeaways_count: number;
  user_has_liked: boolean;
  created_at: string;
}

const sections = [
  { id: "gallery", label: "Gallery", icon: "i-lucide-images" },
  { id: "description", label: "About", icon: "i-lucide-info" },
  { id: "tech-stack", label: "Tech Stack", icon: "i-lucide-cpu" },
  { id: "contributors", label: "Team", icon: "i-lucide-users" },
  { id: "links", label: "Links", icon: "i-lucide-link-2" },
  { id: "engagement", label: "Stats", icon: "i-lucide-heart" },
  { id: "share", label: "Share", icon: "i-lucide-share-2" },
  { id: "related", label: "Similar", icon: "i-lucide-folder" },
];

const route = useRoute();
const toast = useToast();
const { copy } = useClipboard();

const slug = computed(() => String(route.params.slug || ""));

const currentUrl = computed(() => {
  if (process.client) {
    return window.location.href;
  }
  return "";
});

const endpoints = useEndpoints();
const { get } = useApi();

const { data, pending, error, refresh } = await useAsyncData(
  `project-${slug.value}`,
  () => get(endpoints.projects.list, { slug: slug.value }),
  {
    default: () => null,
  },
);

const projectData = computed<Project | null>(() => {
  if (data.value) {
    if (data.value.id) return data.value as Project;
    if (data.value.project) return data.value.project as Project;
    if (Array.isArray(data.value) && data.value.length > 0)
      return data.value[0] as Project;
  }
  return null;
});

useSeoPage({
  title: projectData.value
    ? `${projectData.value.title} | Projects`
    : "Project Details",
  description:
    projectData.value?.short_description || projectData.value?.description,
  image: projectData.value?.image,
});

const formatContributorSkills = (skillsStr?: string) => {
  if (!skillsStr) return [];
  return skillsStr
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    mobile: "i-lucide-smartphone",
    web: "i-lucide-globe",
    desktop: "i-lucide-monitor",
    ai: "i-lucide-brain",
    iot: "i-lucide-wifi",
    blockchain: "i-lucide-link-2",
    game: "i-lucide-gamepad-2",
  };
  return icons[category?.toLowerCase()] || "i-lucide-folder";
};

const getTechIcon = (tech: string) => {
  const icons: Record<string, string> = {
    flutter: "i-lucide-smartphone",
    firebase: "i-lucide-flame",
    "google maps api": "i-lucide-map",
    react: "i-lucide-code-2",
    python: "i-lucide-terminal",
    docker: "i-lucide-container",
    aws: "i-lucide-cloud",
  };
  return icons[tech?.toLowerCase()] || "i-lucide-code-2";
};

const shareContent = () => {
  if (navigator.share) {
    navigator
      .share({
        title: projectData.value?.title,
        text: projectData.value?.short_description,
        url: currentUrl.value,
      })
      .catch(() => {
        copyToClipboard(currentUrl.value);
      });
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
  } catch (err) {
    toast.add({
      title: "Failed to copy",
      icon: "i-lucide-alert-circle",
      color: "error",
    });
  }
};

const likeProject = async () => {
  toast.add({
    title: projectData.value?.user_has_liked ? "Unliked" : "Liked!",
    icon: "i-lucide-heart",
    color: "success",
  });
};

const saveTakeaway = async () => {
  toast.add({
    title: "Saved!",
    icon: "i-lucide-bookmark",
    color: "success",
  });
};
</script>
