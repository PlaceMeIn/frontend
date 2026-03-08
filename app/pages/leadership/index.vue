<template>
  <section>
    <!-- HERO -->
    <section
      class="h-[420px] flex flex-col items-center justify-center text-center bg-gradient-to-br from-primary-500/30 to-primary-900/30"
      data-aos="fade-down"
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

    <!-- EXECUTIVE TEAM -->
    <section class="py-24">
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
            :key="member?.name || i"
            class="group text-left"
            data-aos="zoom-in"
            :data-aos-delay="i * 100"
          >
            <img
              :src="member?.avatar || defaultAvatar"
              :alt="member?.name || '?'"
              class="w-full h-56 object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-[1.03]"
            />

            <div class="flex flex-col gap-2 p-2">
              <h3 class="mt-4 font-semibold text-lg">
                {{ member?.name || "?" }}
              </h3>

              <p class="text-primary text-sm font-medium">
                {{ member?.position || "?" }}
              </p>

              <p class="text-muted text-sm">
                {{ member?.programme || "?" }}
              </p>

              <p class="text-sm text-muted mt-2 leading-relaxed">
                {{ member?.description || "?" }}
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

    <!-- DEPARTMENT LEADS -->
    <section class="py-24 bg-primary-500/5">
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
            :key="lead?.name || i"
            class="text-center"
            data-aos="fade-up"
            :data-aos-delay="i * 100"
          >
            <img
              :src="lead?.avatar || defaultAvatar"
              :alt="lead?.name || '?'"
              class="w-28 h-28 object-cover rounded-full mx-auto"
            />

            <h3 class="mt-4 font-semibold">
              {{ lead?.name || "?" }}
            </h3>

            <p class="text-primary text-sm">
              {{ lead?.lead || "?" }}
            </p>

            <p class="text-muted text-sm">
              {{ lead?.programme || "?" }}
            </p>
          </div>
        </div>

        <div v-if="leadsError" class="flex justify-center mt-12">
          <UButton label="Retry" variant="outline" @click="fetchLeads" />
        </div>
      </div>
    </section>

    <!-- FACULTY -->
    <section class="py-24">
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
            :key="advisor?.name || i"
            class="flex gap-5 items-start"
            data-aos="fade-right"
            :data-aos-delay="i * 100"
          >
            <img
              :src="advisor?.avatar || defaultAvatar"
              :alt="advisor?.name || '?'"
              class="w-20 h-20 object-cover rounded-xl"
            />

            <div>
              <h3 class="font-semibold text-lg">
                {{ advisor?.name || "?" }}
              </h3>

              <p class="text-primary text-sm font-medium">
                {{ advisor?.pf || "?" }}
              </p>

              <p class="text-muted text-sm">
                {{ advisor?.school || "?" }}
              </p>

              <p class="text-muted text-xs mt-1">
                {{ advisor?.expertise || "?" }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="facultyError" class="flex justify-center mt-12">
          <UButton label="Retry" variant="outline" @click="fetchFaculty" />
        </div>
      </div>
    </section>

    <section
      class="w-full py-24 bg-gradient-to-tr from-primary-600/10 via-transparent to-primary-400/10"
      data-aos="fade-up"
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
const defaultAvatar =
  "https://ui-avatars.com/api/?background=6366f1&color=fff&name=Member";

const exec_team_hold = [
  {
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    name: "James Mwangi",
    position: "Chairperson",
    programme: "Computer Science - Year 4",
    description:
      "4th year Computer Science student passionate about React and Node.js. Led development of 3 major campus projects.",
    linkedin: "https://linkedin.com/in/jamesmwangi",
    email: "j.mwangi@studentsuniversity.ac.ke",
    contact: "+254 712 345 678",
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1494790108777-466d7e0b481d?w=150&h=150&fit=crop&crop=faces",
    name: "Sarah Akinyi",
    position: "Vice Chairperson",
    programme: "Information Technology - Year 4",
    description:
      "Flutter and Kotlin expert. Built the campus navigation app with 2000+ active users.",
    linkedin: "https://linkedin.com/in/sarahakinyi",
    email: "s.akinyi@studentsuniversity.ac.ke",
    contact: "+254 723 456 789",
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
    name: "Brian Omondi",
    position: "Technical Lead",
    programme: "Software Engineering - Year 3",
    description:
      "Python/Django specialist. Manages the club's server infrastructure and database systems.",
    linkedin: "https://linkedin.com/in/brianomondi",
    email: "b.omondi@studentsuniversity.ac.ke",
    contact: "+254 734 567 890",
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces",
    name: "Cynthia Wanjiku",
    position: "Secretary",
    programme: "Business Information Technology - Year 3",
    description:
      "Creative designer with a knack for user-centered design. Led the redesign of the university portal.",
    linkedin: "https://linkedin.com/in/cynthiawanjiku",
    email: "c.wanjiku@studentsuniversity.ac.ke",
    contact: "+254 745 678 901",
  },
];

const departmentLeads_hold = [
  {
    name: "David Otieno",
    lead: "Web development lead",
    programme: "Computer Science - Year 3",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=faces",
    linkedin: "https://linkedin.com/in/davidotieno",
    contact: "+254 756 789 012",
    email: "d.otieno@studentsuniversity.ac.ke",
  },
  {
    name: "Grace Njeri",
    lead: "Mobile development lead",
    programme: "Information Technology - Year 4",
    avatar:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop&crop=faces",
    linkedin: "https://linkedin.com/in/gracenjeri",
    contact: "+254 767 890 123",
    email: "g.njeri@studentsuniversity.ac.ke",
  },
  {
    name: "Peter Kimani",
    lead: "DevOps lead",
    programme: "Software Engineering - Year 3",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces",
    linkedin: "https://linkedin.com/in/peterkimani",
    contact: "+254 778 901 234",
    email: "p.kimani@studentsuniversity.ac.ke",
  },
  {
    name: "Lucy Achieng",
    lead: "UI/UX lead",
    programme: "Multimedia Design - Year 3",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
    linkedin: "https://linkedin.com/in/lucyachieng",
    contact: "+254 789 012 345",
    email: "l.achieng@studentsuniversity.ac.ke",
  },
  {
    name: "Michael Omondi",
    lead: "Data Science lead",
    programme: "Applied Statistics - Year 4",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces",
    linkedin: "https://linkedin.com/in/michaelomondi",
    contact: "+254 790 123 456",
    email: "m.omondi@studentsuniversity.ac.ke",
  },
  {
    name: "Esther Wambui",
    lead: "Cybersecurity lead",
    programme: "Network Security - Year 3",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces",
    linkedin: "https://linkedin.com/in/estherwambui",
    contact: "+254 701 234 567",
    email: "e.wambui@studentsuniversity.ac.ke",
  },
  {
    name: "Kevin Mbaru",
    lead: "Cloud Computing lead",
    programme: "Computer Technology - Year 4",
    avatar:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae4?w=150&h=150&fit=crop&crop=faces",
    linkedin: "https://linkedin.com/in/kevinmbaru",
    contact: "+254 712 345 678",
    email: "k.mbaru@studentsuniversity.ac.ke",
  },
];

const faculty_advisors_hold = [
  {
    name: "Dr. John Kariuki",
    pf: "Faculty Advisor",
    school: "School Of Computing & IT",
    avatar:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop&crop=faces",
    email: "j.kariuki@university.ac.ke",
    expertise: "Artificial Intelligence & Machine Learning",
    office: "CIT Building, Room 305",
  },
  {
    name: "Prof. Elizabeth Mwangi",
    pf: "Technical Mentor",
    school: "Department of Computer Science",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces",
    email: "e.mwangi@university.ac.ke",
    expertise: "Distributed Systems & Cloud Computing",
    office: "CS Department, Room 210",
  },
];

/* STATE */

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
    const res = await get(endpoints.leadership.team,{position_type:'executive'});

    executiveTeam.value = res?.data?.length ? res.data : exec_team_hold;
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
    const res = await get(endpoints.leadership.leads,{position_type:'department_lead'});

    departmentLeads.value = res?.data?.length ? res.data : departmentLeads_hold;
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
    const res = await get(endpoints.leadership.faculty,{position_type:'faculty_advisor'});

    faculty.value = res?.length ? res : faculty_advisors_hold;
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
