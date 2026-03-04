<template>
  <section>
    <!-- Hero Section -->
    <section
      class="h-[420px] flex flex-col items-center justify-center text-center bg-gradient-to-br from-primary-500/30 to-primary-900/30"
      data-aos="fade-down"
    >
      <h1 class="text-5xl font-bold tracking-tight">Learning Resources</h1>
      <p class="mt-4 text-lg text-muted max-w-xl">
        Everything you need to level up your tech skills—learning paths, workshops, repositories, and certifications
      </p>
    </section>

    <!-- Structured Learning -->
    <section class="py-24">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <h2 class="text-4xl font-bold" data-aos="fade-up">Structured Learning Paths</h2>
        <p class="mt-3 text-muted" data-aos="fade-up" data-aos-delay="100">
          Follow our curated curriculum to master in-demand tech skills
        </p>

        <div v-if="loadingLearnings" class="flex justify-center mt-16">
          <Loader />
        </div>

        <div v-else class="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-16">
          <div
            v-for="(learning, i) in structuredLearnings"
            :key="learning?.name || i"
            class="group text-left"
            data-aos="zoom-in"
            :data-aos-delay="i * 100"
          >
            <!-- TODO: Display learning content -->
          </div>
        </div>

        <div v-if="learningsError" class="flex justify-center mt-12">
          <UButton
            label="Retry"
            icon="i-lucide-refresh-cw"
            variant="outline"
            @click="fetchLearnings"
          />
        </div>
      </div>
    </section>

    <!-- Club Repositories -->
    <section class="py-24 bg-primary-500/5">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <h2 class="text-4xl font-bold" data-aos="fade-up">Club Repositories</h2>
        <p class="mt-3 text-muted" data-aos="fade-up" data-aos-delay="100">
          Explore our open-source projects and code libraries
        </p>

        <div v-if="loadingRepos" class="flex justify-center mt-16">
          <Loader />
        </div>

        <div v-else class="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-16">
          <div
            v-for="(repo, i) in repos"
            :key="repo?.name || i"
            class="text-center"
            data-aos="fade-up"
            :data-aos-delay="i * 100"
          >
            <!-- TODO: Display repository -->
          </div>
        </div>

        <div v-if="reposError" class="flex justify-center mt-12">
          <UButton label="Retry" variant="outline" @click="fetchRepos" />
        </div>
      </div>
    </section>

    <!-- Recorded Workshops -->
    <section class="py-24">
      <div class="max-w-5xl mx-auto px-6 text-center">
        <h2 class="text-4xl font-bold" data-aos="fade-up">Recorded Workshops</h2>
        <p class="mt-3 text-muted" data-aos="fade-up" data-aos-delay="100">
          Watch past workshops and learn at your own pace
        </p>

        <div v-if="loadingWorkshops" class="flex justify-center mt-16">
          <Loader />
        </div>

        <div v-else class="grid sm:grid-cols-2 gap-10 mt-16 text-left">
          <div
            v-for="(workshop, i) in recordedWorkshops"
            :key="workshop?.title || i"
            class="flex gap-5 items-start"
            data-aos="fade-right"
            :data-aos-delay="i * 100"
          >
            <!-- TODO: Display workshop -->
          </div>
        </div>

        <div v-if="workshopsError" class="flex justify-center mt-12">
          <UButton label="Retry" variant="outline" @click="fetchRecordedWorkshops" />
        </div>
      </div>
    </section>

    <!-- Recommended Certifications -->
    <section class="py-24">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <h2 class="text-4xl font-bold" data-aos="fade-up">Recommended Certifications</h2>
        <p class="mt-3 text-muted" data-aos="fade-up" data-aos-delay="100">
          Industry-recognized certifications to boost your career
        </p>

        <div v-if="loadingCertifications" class="flex justify-center mt-16">
          <Loader />
        </div>

        <div v-else class="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-16">
          <div
            v-for="(certification, i) in certifications"
            :key="certification?.name || i"
            class="group text-left"
            data-aos="zoom-in"
            :data-aos-delay="i * 100"
          >
            <!-- TODO: Display certification -->
          </div>
        </div>

        <div v-if="certificationsError" class="flex justify-center mt-12">
          <UButton
            label="Retry"
            icon="i-lucide-refresh-cw"
            variant="outline"
            @click="fetchCertifications"
          />
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section
      class="w-full py-24 bg-gradient-to-tr from-primary-600/10 via-transparent to-primary-400/10"
      data-aos="fade-up"
    >
      <div class="max-w-6xl mx-auto px-6 text-center">
        <UIcon name="i-lucide-library" :size="80" class="text-primary" />
        <h2 class="text-3xl md:text-4xl font-bold">Access Premium Resources</h2>
        <p class="mt-3 text-muted max-w-xl mx-auto">
          Join MUT Tech Club to unlock exclusive learning materials, workshop recordings, and mentorship opportunities.
        </p>
        <div
          class="mt-10 flex flex-col items-center gap-6"
          data-aos="flip-left"
          data-aos-easing="ease-out-cubic"
          data-aos-duration="2000"
        >
          <h2 class="text-shadow-2xl font-mono text-2xl md:text-4xl">Join Us</h2>
          <div class="flex-1 gap-20 items-center">
            <ThreeDButton @clicked="$router.push('/join')" />
            <StarOnGitButton @clicked="$router.push('/join')" class="mt-10 cursor-pointer" />
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

/* -------------------- Reactive State -------------------- */
const structuredLearnings = ref<any[]>([])
const repos = ref<any[]>([])
const recordedWorkshops = ref<any[]>([])
const certifications = ref<any[]>([])

const loadingLearnings = ref(false)
const loadingRepos = ref(false)
const loadingWorkshops = ref(false)
const loadingCertifications = ref(false)

const learningsError = ref(false)
const reposError = ref(false)
const workshopsError = ref(false)
const certificationsError = ref(false)

/* -------------------- Default Fallbacks -------------------- */
const defaultLearnings: any[] = []
const defaultRepos: any[] = []
const defaultWorkshops: any[] = []
const defaultCertifications: any[] = []

/* -------------------- API -------------------- */
const endpoints = useEndpoints()
const { get } = useApi()

/* -------------------- Fetch Functions -------------------- */
const fetchLearnings = async () => {
  loadingLearnings.value = true
  learningsError.value = false
  try {
    const res = await get(endpoints.resources.learning)
    structuredLearnings.value = res?.data?.length ? res.data : defaultLearnings
  } catch {
    structuredLearnings.value = defaultLearnings
    learningsError.value = true
  } finally {
    loadingLearnings.value = false
  }
}

const fetchRepos = async () => {
  loadingRepos.value = true
  reposError.value = false
  try {
    const res = await get(endpoints.resources.repos)
    repos.value = res?.data?.length ? res.data : defaultRepos
  } catch {
    repos.value = defaultRepos
    reposError.value = true
  } finally {
    loadingRepos.value = false
  }
}

const fetchRecordedWorkshops = async () => {
  loadingWorkshops.value = true
  workshopsError.value = false
  try {
    const res = await get(endpoints.resources.recordedWorkshops)
    recordedWorkshops.value = res?.data?.length ? res.data : defaultWorkshops
  } catch {
    recordedWorkshops.value = defaultWorkshops
    workshopsError.value = true
  } finally {
    loadingWorkshops.value = false
  }
}

const fetchCertifications = async () => {
  loadingCertifications.value = true
  certificationsError.value = false
  try {
    const res = await get(endpoints.resources.certifications)
    certifications.value = res?.data?.length ? res.data : defaultCertifications
  } catch {
    certifications.value = defaultCertifications
    certificationsError.value = true
  } finally {
    loadingCertifications.value = false
  }
}

/* -------------------- On Mounted -------------------- */
onMounted(() => {
  fetchLearnings()
  fetchRepos()
  fetchRecordedWorkshops()
  fetchCertifications()
})
</script>

<style></style>