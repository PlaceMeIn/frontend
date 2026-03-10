<template>
  <section>
    <OnThisPage :sections="sections" />

    <!-- HERO SECTION -->
    <section
      id="hero"
      class="h-[420px] flex flex-col items-center justify-center text-center bg-gradient-to-br from-primary-500/30 to-primary-900/30 scroll-mt-20"
      data-aos="fade-down"
      aria-label="Leadership hero section"
    >
      <h1 class="text-5xl font-bold tracking-tight">
        {{ "Our Leadership" }}
      </h1>

      <p class="mt-4 text-lg text-muted max-w-xl">
        {{
          "Meet the passionate team driving innovation and excellence at MUT Tech Club"
        }}
      </p>
    </section>

    <!-- EXECUTIVE TEAM SECTION -->
    <section
      id="executive-team"
      class="py-24 scroll-mt-20"
      aria-label="Executive team"
    >
      <div class="max-w-6xl mx-auto px-6 text-center">
        <h2 class="text-4xl font-bold" data-aos="fade-up">
          {{ "Executive Team" }}
        </h2>

        <p class="mt-3 text-muted" data-aos="fade-up" data-aos-delay="100">
          {{ "Leading the club with vision and excellence" }}
        </p>

        <div v-if="loadingTeam" class="flex justify-center mt-16">
          <Loader />
        </div>

        <div v-else class="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-16">
          <div
            v-for="(member, i) in executiveTeam"
            :key="member?.id || i"
            class="group text-left"
            data-aos="zoom-in"
            :data-aos-delay="i * 100"
          >
            <img
              :src="member?.user_profile?.user?.profile_picture || defaultAvatar"
              :alt="member?.user_profile?.full_name || '?'"
              class="w-full h-56 object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-[1.03]"
            />

            <div class="flex flex-col gap-2 p-2">
              <h3 class="mt-4 font-semibold text-lg">
                {{ member?.user_profile?.full_name || "?" }}
              </h3>

              <p class="text-primary text-sm font-medium">
                {{ member?.title || "?" }}
              </p>

              <p class="text-muted text-sm">
                {{ member?.user_profile?.course || "?" }} - Year {{ member?.user_profile?.year_of_study || "?" }}
              </p>

              <p class="text-sm text-muted mt-2 leading-relaxed">
                {{ member?.bio || "?" }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="teamError" class="flex justify-center mt-12">
          <UButton
            label="Retry"
            icon="i-lucide-refresh-cw"
            variant="outline"
            @click="fetchTeam"
          />
        </div>
      </div>
    </section>

    <!-- DEPARTMENT LEADS SECTION -->
    <section
      id="department-leads"
      class="py-24 bg-primary-500/5 scroll-mt-20"
      aria-label="Department leads"
    >
      <div class="max-w-6xl mx-auto px-6 text-center">
        <h2 class="text-4xl font-bold" data-aos="fade-up">
          {{ "Department Leads" }}
        </h2>

        <p class="mt-3 text-muted" data-aos="fade-up" data-aos-delay="100">
          {{ "Experts leading specialized technical domains" }}
        </p>

        <div v-if="loadingLeads" class="flex justify-center mt-16">
          <Loader />
        </div>

        <div v-else class="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-16">
          <div
            v-for="(lead, i) in departmentLeads"
            :key="lead?.id || i"
            class="text-center"
            data-aos="fade-up"
            :data-aos-delay="i * 100"
          >
            <img
              :src="lead?.user_profile?.user?.profile_picture || defaultAvatar"
              :alt="lead?.user_profile?.full_name || '?'"
              class="w-28 h-28 object-cover rounded-full mx-auto"
            />

            <h3 class="mt-4 font-semibold">
              {{ lead?.user_profile?.full_name || "?" }}
            </h3>

            <p class="text-primary text-sm">
              {{ lead?.title || "?" }}
            </p>

            <p class="text-muted text-sm">
              {{ lead?.user_profile?.course || "?" }} - Year {{ lead?.user_profile?.year_of_study || "?" }}
            </p>
          </div>
        </div>

        <div v-if="leadsError" class="flex justify-center mt-12">
          <UButton label="Retry" variant="outline" @click="fetchLeads" />
        </div>
      </div>
    </section>

    <!-- FACULTY ADVISORS SECTION -->
    <section
      id="faculty-advisors"
      class="py-24 scroll-mt-20"
      aria-label="Faculty advisors"
    >
      <div class="max-w-5xl mx-auto px-6 text-center">
        <h2 class="text-4xl font-bold" data-aos="fade-up">
          {{ "Faculty Advisors" }}
        </h2>

        <p class="mt-3 text-muted" data-aos="fade-up" data-aos-delay="100">
          {{ "Guiding the club with academic excellence and mentorship" }}
        </p>

        <div v-if="loadingFaculty" class="flex justify-center mt-16">
          <Loader />
        </div>

        <div v-else class="grid sm:grid-cols-2 gap-10 mt-16 text-left">
          <div
            v-for="(advisor, i) in faculty"
            :key="advisor?.id || i"
            class="flex gap-5 items-start"
            data-aos="fade-right"
            :data-aos-delay="i * 100"
          >
            <img
              :src="advisor?.user_profile?.user?.profile_picture || defaultAvatar"
              :alt="advisor?.user_profile?.full_name || '?'"
              class="w-20 h-20 object-cover rounded-xl"
            />

            <div>
              <h3 class="font-semibold text-lg">
                {{ advisor?.user_profile?.full_name || "?" }}
              </h3>

              <p class="text-primary text-sm font-medium">
                {{ advisor?.title || "?" }}
              </p>

              <p class="text-muted text-sm">
                {{ advisor?.department_display || "?" }}
              </p>

              <p class="text-muted text-xs mt-1">
                {{ advisor?.bio || "?" }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="facultyError" class="flex justify-center mt-12">
          <UButton label="Retry" variant="outline" @click="fetchFaculty" />
        </div>
      </div>
    </section>

    <!-- CALL TO ACTION SECTION -->
    <section
      id="cta"
      class="w-full py-24 bg-gradient-to-tr from-primary-600/10 via-transparent to-primary-400/10 scroll-mt-20"
      data-aos="fade-up"
      aria-label="Join leadership call to action"
    >
      <div class="max-w-6xl mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-bold">Become a Leader!</h2>
        <p class="mt-3 text-muted max-w-xl mx-auto">
          We're always looking for passionate individuals to join our leadership
          team. Make an impact and lead the next generation of innovators.
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
const sections = [
  { id: 'hero', label: 'Hero' },
  { id: 'executive-team', label: 'Executive Team' },
  { id: 'department-leads', label: 'Department Leads' },
  { id: 'faculty-advisors', label: 'Faculty Advisors' },
  { id: 'cta', label: 'Join Leadership' }
];

const defaultAvatar =
  "https://ui-avatars.com/api/?background=6366f1&color=fff&name=Member";

// Keep your hold data structures as fallbacks
const exec_team_hold = [
  {
    user_profile: {
      full_name: "James Mwangi",
      course: "Computer Science",
      year_of_study: "4",
      user: {
        profile_picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces"
      }
    },
    title: "Chairperson",
    bio: "4th year Computer Science student passionate about React and Node.js. Led development of 3 major campus projects.",
  },
  // ... rest of your hold data transformed similarly
];

const departmentLeads_hold = [
  {
    user_profile: {
      full_name: "David Otieno",
      course: "Computer Science",
      year_of_study: "3",
      user: {
        profile_picture: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=faces"
      }
    },
    title: "Web development lead",
  },
  // ... rest transformed similarly
];

const faculty_advisors_hold = [
  {
    user_profile: {
      full_name: "Dr. John Kariuki",
      user: {
        profile_picture: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop&crop=faces"
      }
    },
    title: "Faculty Advisor",
    department_display: "School Of Computing & IT",
    bio: "Artificial Intelligence & Machine Learning",
  },
  // ... rest transformed similarly
];

const executiveTeam = ref<any[]>([]);
const departmentLeads = ref<any[]>([]);
const faculty = ref<any[]>([]);

const loadingTeam = ref(true);
const loadingLeads = ref(true);
const loadingFaculty = ref(true);

const teamError = ref(false);
const leadsError = ref(false);
const facultyError = ref(false);

const endpoints = useEndpoints();
const { get } = useApi();

async function fetchTeam() {
  loadingTeam.value = true;
  teamError.value = false;

  try {
    const res = await get(endpoints.leadership.team, {position_type: 'executive'});
    executiveTeam.value = res?.results?.length ? res.results : exec_team_hold;
  } catch {
    executiveTeam.value = exec_team_hold;
    teamError.value = true;
  } finally {
    loadingTeam.value = false;
  }
}

async function fetchLeads() {
  loadingLeads.value = true;
  leadsError.value = false;

  try {
    const res = await get(endpoints.leadership.leads, {position_type: 'department_lead'});
    departmentLeads.value = res?.results?.length ? res.results : departmentLeads_hold;
  } catch {
    departmentLeads.value = departmentLeads_hold;
    leadsError.value = true;
  } finally {
    loadingLeads.value = false;
  }
}

async function fetchFaculty() {
  loadingFaculty.value = true;
  facultyError.value = false;

  try {
    const res = await get(endpoints.leadership.faculty, {position_type: 'faculty_advisor'});
    faculty.value = res?.results?.length ? res.results : faculty_advisors_hold;
  } catch {
    faculty.value = faculty_advisors_hold;
    facultyError.value = true;
  } finally {
    loadingFaculty.value = false;
  }
}

onMounted(() => {
  fetchTeam();
  fetchLeads();
  fetchFaculty();
});
</script>