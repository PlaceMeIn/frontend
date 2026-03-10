<template>
  <section>
    <OnThisPage :sections="sections" />

    <!-- HERO -->
    <section
      id="hero"
      class="relative h-[460px] md:h-[620px] flex flex-col items-center justify-center text-center bg-gradient-to-br from-primary-500/30 to-primary-900/30 scroll-mt-20"
    >
      <img
        :src="ctaImg"
        alt="Murang'a University of Technology"
        class="absolute right-0 bottom-0 w-full h-full object-cover opacity-90"
      />

      <div
        class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
      ></div>

      <div class="z-50 px-6">
        <h1 class="text-5xl font-bold tracking-tight text-white">
          Learning Resources
        </h1>
        <p class="mt-4 text-lg text-gray-200 max-w-xl">
          Everything you need to level up your tech skills—learning paths,
          workshops, repositories, and certifications
        </p>
      </div>
    </section>

    <!-- LEARNING PATHS -->
    <section id="learning-paths" class="py-24 scroll-mt-20">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <h2 class="text-4xl font-bold">Structured Learning Paths</h2>
        <p class="mt-3 text-muted">
          Follow our curated curriculum to master in-demand tech skills
        </p>

        <div class="mt-16">
          <!-- Loading -->
          <div v-if="loadingLearnings" class="flex flex-col items-center gap-4">
            <Loader />
            <p class="text-sm text-muted">Loading learning paths...</p>
          </div>

          <!-- Error -->
          <ErrorState
            v-else-if="learningsError"
            title="Failed to load learning paths"
            description="We couldn't retrieve the learning paths. Please try again."
            @retry="fetchLearnings"
          />

          <!-- Empty -->
          <EmptyState
            v-else-if="structuredLearnings.length === 0"
            icon="i-lucide-book-open"
            title="No learning paths yet"
            description="We're preparing structured learning paths for you."
          />

          <!-- Data -->
          <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <div
              v-for="(learning, i) in structuredLearnings"
              :key="learning?.name || i"
              data-aos="zoom-in"
              :data-aos-delay="i * 100"
            >
              <StLearningPathCard :learning="learning" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- REPOSITORIES -->
    <section id="repositories" class="py-24 bg-primary-500/5 scroll-mt-20">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <h2 class="text-4xl font-bold">Club Repositories</h2>
        <p class="mt-3 text-muted">
          Explore our open-source projects and code libraries
        </p>

        <div class="mt-16">
          <div v-if="loadingRepos" class="flex flex-col items-center gap-4">
            <Loader />
            <p class="text-sm text-muted">Loading repositories...</p>
          </div>

          <ErrorState
            v-else-if="reposError"
            title="Failed to load repositories"
            description="We couldn't retrieve repositories at the moment."
            @retry="fetchRepos"
          />

          <EmptyState
            v-else-if="repos.length === 0"
            icon="i-lucide-folder-x"
            title="No repositories yet"
            description="Our club repositories will appear here once available."
          />

          <div v-else class="grid md:grid-cols-2 gap-10">
            <div
              v-for="(repo, i) in repos"
              :key="repo?.name || i"
              data-aos="fade-up"
              :data-aos-delay="i * 100"
            >
              <ClubRepositoryCard :repo="repo" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- WORKSHOPS -->
    <section id="workshops" class="py-24 scroll-mt-20">
      <div class="max-w-5xl mx-auto px-6 text-center">
        <h2 class="text-4xl font-bold">Recorded Workshops</h2>
        <p class="mt-3 text-muted">
          Watch past workshops and learn at your own pace
        </p>

        <div class="mt-16">
          <div v-if="loadingWorkshops" class="flex flex-col items-center gap-4">
            <Loader />
            <p class="text-sm text-muted">Loading workshops...</p>
          </div>

          <ErrorState
            v-else-if="workshopsError"
            title="Failed to load workshops"
            description="We couldn't retrieve workshop recordings."
            @retry="fetchRecordedWorkshops"
          />

          <EmptyState
            v-else-if="recordedWorkshops.length === 0"
            icon="i-lucide-video"
            title="No workshops available"
            description="New workshop recordings will appear here."
          />

          <div v-else class="grid sm:grid-cols-2 gap-10 text-left">
            <div
              v-for="(workshop, i) in recordedWorkshops"
              :key="workshop?.title || i"
              class="flex gap-5 items-start"
              data-aos="fade-right"
              :data-aos-delay="i * 100"
            >
              <WorkshopCard :workshop="workshop" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CERTIFICATIONS -->
    <section id="certifications" class="py-24 scroll-mt-20">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <h2 class="text-4xl font-bold">Recommended Certifications</h2>

        <p class="mt-3 text-muted">
          Industry-recognized certifications to boost your career
        </p>

        <div class="mt-16">
          <div
            v-if="loadingCertifications"
            class="flex flex-col items-center gap-4"
          >
            <Loader />
            <p class="text-sm text-muted">Loading certifications...</p>
          </div>

          <ErrorState
            v-else-if="certificationsError"
            title="Failed to load certifications"
            description="Unable to retrieve certification resources."
            @retry="fetchCertifications"
          />

          <EmptyState
            v-else-if="certifications.length === 0"
            icon="i-lucide-award"
            title="No certifications yet"
            description="Recommended certifications will appear here."
          />

          <div v-else class="grid md:grid-cols-2 gap-10">
            <div
              v-for="(certification, i) in certifications"
              :key="certification?.name || i"
              data-aos="zoom-in"
              :data-aos-delay="i * 100"
            >
              <RecommendedCertificationCard :certification="certification" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section
      id="cta"
      class="w-full py-24 bg-gradient-to-tr from-primary-600/10 via-transparent to-primary-400/10 scroll-mt-20"
    >
      <div class="max-w-6xl mx-auto px-6 text-center">
        <UIcon name="i-lucide-library" :size="80" class="text-primary" />

        <h2 class="text-3xl md:text-4xl font-bold">Access Premium Resources</h2>

        <p class="mt-3 text-muted max-w-xl mx-auto">
          Join MUT Tech Club to unlock exclusive learning materials, workshop
          recordings, and mentorship opportunities.
        </p>

        <div class="mt-10 flex flex-col items-center gap-6">
          <h2 class="font-mono text-2xl md:text-4xl">Join Us</h2>

          <div class="flex gap-20 flex-col md:flex-row items-center">
            <ThreeDButton @clicked="$router.push('/join')" />

            <a :href="useAppConfig().site?.sourceLink"
              target="_blank"
              rel="noopener noreferrer"
            >
              <StarOnGitButton class="cursor-pointer" />
            </a>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script lang="ts" setup>
import ctaImg from "~/assets/files/learning.jpg";
const sections = [
  { id: "hero", label: "Hero" },
  { id: "learning-paths", label: "Learning Paths" },
  { id: "repositories", label: "Repositories" },
  { id: "workshops", label: "Workshops" },
  { id: "certifications", label: "Certifications" },
  { id: "cta", label: "Join Us" },
];

const structuredLearnings = ref<any[]>([]);
const repos = ref<any[]>([]);
const recordedWorkshops = ref<any[]>([]);
const certifications = ref<any[]>([]);

const loadingLearnings = ref(false);
const loadingRepos = ref(false);
const loadingWorkshops = ref(false);
const loadingCertifications = ref(false);

const learningsError = ref(false);
const reposError = ref(false);
const workshopsError = ref(false);
const certificationsError = ref(false);

const defaultLearnings: any[] = [];
const defaultRepos: any[] = [];
const defaultWorkshops: any[] = [];
const defaultCertifications: any[] = [];

const endpoints = useEndpoints();
const { get } = useApi();

const fetchLearnings = async () => {
  loadingLearnings.value = true;
  learningsError.value = false;
  try {
    const res = await get(endpoints.resources.main, {
      resource_type: "learning_path",
    });
    structuredLearnings.value = res?.results?.length
      ? res.results
      : defaultLearnings;
  } catch {
    structuredLearnings.value = defaultLearnings;
    learningsError.value = true;
  } finally {
    loadingLearnings.value = false;
  }
};

const fetchRepos = async () => {
  loadingRepos.value = true;
  reposError.value = false;
  try {
    const res = await get(endpoints.resources.main, {
      resource_type: "repository",
    });
    repos.value = res?.results?.length ? res.results : defaultRepos;
  } catch {
    repos.value = defaultRepos;
    reposError.value = true;
  } finally {
    loadingRepos.value = false;
  }
};

const fetchRecordedWorkshops = async () => {
  loadingWorkshops.value = true;
  workshopsError.value = false;
  try {
    const res = await get(endpoints.resources.main, {
      resource_type: "workshop",
    });
    recordedWorkshops.value = res?.results?.length
      ? res.results
      : defaultWorkshops;
  } catch {
    recordedWorkshops.value = defaultWorkshops;
    workshopsError.value = true;
  } finally {
    loadingWorkshops.value = false;
  }
};

const fetchCertifications = async () => {
  loadingCertifications.value = true;
  certificationsError.value = false;
  try {
    const res = await get(endpoints.resources.main, {
      resource_type: "certification",
    });
    certifications.value = res?.results?.length
      ? res.results
      : defaultCertifications;
  } catch {
    certifications.value = defaultCertifications;
    certificationsError.value = true;
  } finally {
    loadingCertifications.value = false;
  }
};

onMounted(() => {
  fetchLearnings();
  fetchRepos();
  fetchRecordedWorkshops();
  fetchCertifications();
});
</script>
