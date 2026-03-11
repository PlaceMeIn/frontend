<template>
  <section class="w-full flex flex-col items-center overflow-hidden">
    <OnThisPage :sections="sections" />

    <!-- HERO SECTION -->
    <div
      id="hero"
      class="relative w-full h-[460px] md:h-[620px] flex items-center justify-center scroll-mt-20 overflow-hidden"
    >
      <img
        :src="passionateImg"
        alt="Murang'a University of Technology"
        class="absolute inset-0 w-full h-full object-cover"
        data-aos="fade-up"
        data-aos-duration="1200"
          loading="lazy" 

      />

      <div
        class="absolute inset-0 bg-gradient-to-tr from-white/85 dark:from-black/85 via-black/30 dark:via-black/60 to-transparent"
      ></div>

      <div
        data-aos="zoom-out"
        data-aos-duration="900"
        class="relative z-20 max-w-3xl px-6 md:px-12 text-white text-center"
      >
        <h1 class="text-4xl md:text-6xl font-bold tracking-tight">
          About MUT Tech Club
        </h1>

        <p class="mt-4 text-sm md:text-lg text-gray-100 max-w-xl leading-relaxed">
          Building Kenya's premier university tech community by empowering
          innovators, developers, and future tech leaders.
        </p>
      </div>
    </div>

    <!-- MISSION SECTION -->
    <section
      id="mission"
      class="max-w-7xl w-full px-6 py-24 grid md:grid-cols-2 gap-16 items-center scroll-mt-20"
      aria-label="Our mission"
    >
      <div data-aos="fade-right">
        <h2 class="text-3xl md:text-4xl font-bold tracking-tight">
          Our Mission
        </h2>

        <p class="mt-5 text-lg text-muted leading-relaxed">
          We cultivate an ecosystem where students gain real-world technical
          skills, mentorship, and collaborative experience. Our goal is to
          bridge academic learning with industry practice and prepare globally
          competitive innovators.
        </p>
      </div>

      <div class="grid sm:grid-cols-2 gap-6">
        <div
          v-for="(ftr, i) in inMission"
          :key="i"
          data-aos="fade-up"
          :data-aos-delay="i * 120"
          class="group p-6 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur border border-white/10 hover:-translate-y-1 hover:shadow-xl transition duration-500"
        >
          <UIcon
            :name="ftr.icon"
            class="text-primary text-3xl mb-4 group-hover:scale-110 transition"
          />

          <h3 class="font-semibold text-lg">
            {{ ftr.title }}
          </h3>

          <p class="text-sm text-muted mt-1">
            {{ ftr.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- STATS SECTION -->
    <section
      id="stats"
      class="w-full py-20 bg-gradient-to-b from-transparent to-primary-500/5 scroll-mt-20"
      aria-label="Community statistics"
    >
      <div
        class="max-w-6xl mx-auto px-6 grid sm:grid-cols-3 gap-10 text-center"
      >
        <div data-aos="fade-up">
          <div class="text-4xl font-bold text-primary flex justify-center">
            <CountUp :end="2030" :endVal="2030" :duration="2" />
          </div>

          <h3 class="mt-3 font-semibold">Leading Tech Hub</h3>

          <p class="text-sm text-muted">
            One of East Africa's fastest-growing student tech communities
          </p>
        </div>

        <div data-aos="fade-up" data-aos-delay="150">
          <div class="text-4xl font-bold text-primary flex justify-center">
            <CountUp :endVal="1000" :duration="2" />
            <span>+</span>
          </div>

          <h3 class="mt-3 font-semibold">Active Members</h3>

          <p class="text-sm text-muted">
            Engineers, designers, founders, and innovators
          </p>
        </div>

        <div data-aos="fade-up" data-aos-delay="300">
          <div class="flex justify-center mb-2">
            <UIcon name="i-lucide-globe" class="text-primary text-4xl" />
          </div>

          <h3 class="font-semibold">Global Reach</h3>

          <p class="text-sm text-muted">
            Contributing to startups and open-source worldwide
          </p>
        </div>
      </div>
    </section>

    <!-- VALUES SECTION -->
    <section
      id="values"
      class="max-w-6xl w-full px-6 py-24 scroll-mt-20"
      aria-label="Our core values"
    >
      <div class="text-center max-w-2xl mx-auto" data-aos="fade-up">
        <h2 class="text-3xl md:text-4xl font-bold">What Makes Us Elite</h2>

        <p class="mt-3 text-muted">Values that define our innovation culture</p>
      </div>

      <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div
          v-for="(val, i) in whatMakesLifeBetter"
          :key="i"
          data-aos="fade-up"
          :data-aos-delay="i * 120"
          class="p-6 rounded-2xl backdrop-blur border border-white/10 hover:-translate-y-1 hover:shadow-xl transition duration-500"
        >
          <UIcon :name="val.icon" class="text-primary text-2xl mb-3" />

          <div
            :class="`h-2 w-1/2 rounded-full bg-gradient-to-r ${val.color}`"
          ></div>

          <h3 class="mt-4 font-semibold text-lg">
            {{ val.title }}
          </h3>

          <p class="text-sm text-muted mt-1">
            {{ val.desc }}
          </p>
        </div>
      </div>
    </section>

    <!-- BENEFITS SECTION -->
    <section
      id="benefits"
      class="w-full py-24 bg-gradient-to-tr from-primary-600/10 via-transparent to-primary-400/10 scroll-mt-20"
      aria-label="Benefits of joining"
    >
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto" data-aos="fade-up">
          <h2 class="text-3xl md:text-4xl font-bold">Benefits of Joining</h2>

          <p class="mt-3 text-muted">
            Opportunities designed to accelerate your growth
          </p>
        </div>

        <div class="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(ftr, i) in benefitsOfJoinning"
            :key="i"
            data-aos="fade-up"
            :data-aos-delay="i * 120"
            class="p-6 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur border border-white/10 hover:-translate-y-1 hover:shadow-xl transition duration-500"
          >
            <UIcon :name="ftr.icon" class="text-primary text-3xl mb-4" />

            <h3 class="font-semibold">
              {{ ftr.title }}
            </h3>

            <p class="text-sm text-muted mt-1">
              {{ ftr.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- COMMUNITY SECTION -->
    <section
      id="community"
      class="max-w-6xl w-full px-6 py-24 grid md:grid-cols-2 gap-12 items-stretch scroll-mt-20"
      aria-label="Our community"
    >
      <div
        data-aos="fade-right"
        class="p-8 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur border border-white/10"
      >
        <UIcon name="i-lucide-users" class="text-primary text-3xl mb-4" />

        <h3 class="text-2xl font-semibold">Inclusive & Diverse</h3>

        <p class="mt-3 text-muted">
          Open to all students regardless of experience level. Everyone has a
          place to learn and grow.
        </p>

        <div class="mt-8 flex gap-6">
          <div class="p-5 rounded-xl bg-primary/10">
            <div class="text-3xl font-bold text-primary flex">
              <CountUp :endVal="50" :duration="2" />
              <span>+</span>
            </div>

            <p class="text-sm text-muted">Departments</p>
          </div>

          <div class="p-5 rounded-xl bg-primary/10">
            <div class="text-3xl font-bold text-primary flex">
              <ClientOnly>
                <CountUp :endVal="35" :duration="2" />
              </ClientOnly>
              <span>%</span>
            </div>

            <p class="text-sm text-muted">Women in Tech</p>
          </div>
        </div>
      </div>

      <div
        data-aos="fade-left"
        class="p-8 rounded-2xl bg-gradient-to-br from-primary-700/50 to-primary-500 text-white shadow-xl"
      >
        <UIcon name="i-lucide-rocket" class="text-3xl mb-4" />

        <h3 class="text-2xl font-semibold">Learn by Doing</h3>

        <p class="mt-3 text-white/80">
          Build production-level systems, participate in hackathons, and
          contribute to real technology.
        </p>

        <div class="mt-8 flex gap-6">
          <div class="p-5 rounded-xl bg-white/10">
            <div class="text-3xl font-bold flex">
              <ClientOnly>
                <CountUp :endVal="100" :duration="2" />
              </ClientOnly>
              <span>+</span>
            </div>

            <p class="text-sm text-white/70">Projects yearly</p>
          </div>

          <div class="p-5 rounded-xl bg-white/10">
            <div class="text-3xl font-bold flex">
              <ClientOnly>
                <CountUp :endVal="15" :duration="2" />
              </ClientOnly>
              <span>+</span>
            </div>

            <p class="text-sm text-white/70">Workshops</p>
          </div>
        </div>
      </div>
    </section>

    <!-- MINDSET SECTION -->
    <section
      id="mindset"
      class="w-full px-6 pb-24 text-center bg-gradient-to-b from-transparent to-primary-500/5 scroll-mt-20"
      aria-label="Our innovation mindset"
    >
      <div data-aos="zoom-in">
        <h2 class="text-3xl md:text-4xl font-bold">Innovation Mindset</h2>

        <p class="mt-4 text-muted max-w-[600px] text-center m-auto">
          At MUT Tech Club, we don't just learn technology—we create it. We
          challenge conventional thinking, embrace failure as a learning
          opportunity, and constantly push the boundaries of what's possible.
        </p>
      </div>

      <div class="mt-16 grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <UPageCard data-aos="fade-up" class="py-10">
          <h3 class="font-semibold text-xl text-primary">Think Big</h3>
          <p class="text-sm text-muted">Solve ambitious problems</p>
        </UPageCard>

        <UPageCard data-aos="fade-up" data-aos-delay="150" class="py-10">
          <h3 class="font-semibold text-xl text-primary">Build Fast</h3>
          <p class="text-sm text-muted">Rapid experimentation and iteration</p>
        </UPageCard>

        <UPageCard data-aos="fade-up" data-aos-delay="300" class="py-10">
          <h3 class="font-semibold text-xl text-primary">Ship Better</h3>
          <p class="text-sm text-muted">Deliver real-world solutions</p>
        </UPageCard>
      </div>
    </section>

    <!-- CALL TO ACTION SECTION -->
    <section
      id="cta"
      class="w-full px-6 pb-24 text-center scroll-mt-20"
      aria-label="Join us call to action"
    >
      <div
        class="mt-10"
        data-aos="flip-left"
        data-aos-easing="ease-out-cubic"
        data-aos-duration="2000"
      >
        <h2 class="text-shadow-2xl font-mono text-2xl md:text-4xl mb-6">
          Join Us
        </h2>
        <ThreeDButton @clicked="$router.push('/join')" />
      </div>
    </section>
  </section>
</template>

<script lang="ts" setup>
import ThreeDButton from "~/components/cool/ThreeDButton.vue";
import passionateImg from "~/assets/files/passionate.jpg";
const sections = [
  { id: "hero", label: "Hero" },
  { id: "mission", label: "Mission" },
  { id: "stats", label: "Statistics" },
  { id: "values", label: "Values" },
  { id: "benefits", label: "Benefits" },
  { id: "community", label: "Community" },
  { id: "mindset", label: "Mindset" },
  { id: "cta", label: "Join Us" },
];

const config = useAppConfig();

useSeoPage({
  title: `About MUT Tech Club | ${config.site.title}`,
  description:
    "We are a student-led innovation hub dedicated to building real-world technical skills, fostering creativity, and preparing students for global tech careers.",
});

const benefitsOfJoinning = [
  {
    icon: "i-lucide-code",
    title: "Hands-On Learning",
    desc: "Build real-world projects using modern technologies",
  },
  {
    icon: "i-lucide-network",
    title: "Networking",
    desc: "Connect with professionals, alumni, and innovators",
  },
  {
    icon: "i-lucide-user-check",
    title: "Mentorship",
    desc: "Guidance from experienced engineers and tech leaders",
  },
  {
    icon: "i-lucide-briefcase",
    title: "Career Growth",
    desc: "Internships, job opportunities, and career preparation",
  },
  {
    icon: "i-lucide-globe",
    title: "Global Exposure",
    desc: "Participate in hackathons and international collaborations",
  },
  {
    icon: "i-lucide-users",
    title: "Supportive Community",
    desc: "Inclusive environment focused on growth and innovation",
  },
];

const whatMakesLifeBetter = [
  {
    icon: "i-lucide-sparkles",
    color: "from-blue-500 to-cyan-400",
    title: "Innovation",
    desc: "Creating impactful and forward-thinking solutions",
  },
  {
    icon: "i-lucide-award",
    color: "from-pink-500 to-rose-400",
    title: "Excellence",
    desc: "Maintaining the highest standards in everything",
  },
  {
    icon: "i-lucide-handshake",
    color: "from-emerald-500 to-green-400",
    title: "Collaboration",
    desc: "Growing through teamwork and shared knowledge",
  },
  {
    icon: "i-lucide-shield-check",
    color: "from-orange-500 to-amber-400",
    title: "Integrity",
    desc: "Ethical and responsible technology development",
  },
];

const inMission = [
  {
    icon: "i-lucide-graduation-cap",
    title: "Quality Education",
    description: "Industry-relevant technical learning beyond classrooms",
  },
  {
    icon: "i-lucide-users",
    title: "Community Building",
    description: "Strong network of developers and innovators",
  },
  {
    icon: "i-lucide-lightbulb",
    title: "Innovation Culture",
    description: "Encouraging creativity and problem-solving",
  },
];
</script>
