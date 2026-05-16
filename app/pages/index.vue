<script setup lang="ts">
import type { PageFeatureProps } from "@nuxt/ui";
import HighlightUpcomingEvent from "~/components/landing/HighlightUpcomingEvent.vue";
import HightlightFeaturedProject from "~/components/landing/HighlightFeaturedProject.vue";
const { get } = useApi();

const { status, data: statsData } = await useLazyAsyncData("stats", () =>
  get(useEndpoints().main.home_data),
);

const { status: galleryStatus, data: galleryData } = await useLazyAsyncData(
  "gallery",
  () => get(useEndpoints().main.home_gallery),
);

const sections = [
  { id: "hero", label: "Hero" },
  { id: "about", label: "About" },
  { id: "focus-areas", label: "Focus Areas" },
  { id: "highlights", label: "Highlights" },
  { id: "featured-project", label: "Featured Project" },
  { id: "upcoming-event", label: "Upcoming Event" },
  { id: "community", label: "Community" },
  { id: "reviews", label: "Reviews" },
  { id: "partners", label: "Partners" },
  { id: "cta", label: "Join Us" },
];

const features = ref<PageFeatureProps[]>([
  {
    title: "Community Driven",
    description:
      "Connect with like-minded developers, engineers, and innovators while building meaningful collaborations.",
    icon: {
      name: "i-lucide-users",
      color: "primary",
      variant: "soft",
    },
    to: "/community",
  },
  {
    title: "Excellence Focused",
    description:
      "Gain real-world experience through mentorship, workshops, and production-level projects.",
    icon: {
      name: "i-lucide-award",
      color: "warning",
      variant: "soft",
    },
    to: "",
  },
  {
    title: "Innovation First",
    description:
      "Transform ideas into impactful solutions through hackathons, research, and startup collaboration.",
    icon: {
      name: "i-lucide-lightbulb",
      color: "success",
      variant: "soft",
    },
    to: "/projects",
  },
]);

const focusAreas = ref<PageFeatureProps[]>([
  {
    title: "Artificial Intelligence",
    description:
      "Build intelligent systems, machine learning models, and next-generation AI applications.",
    icon: {
      name: "i-lucide-brain",
      color: "primary",
      variant: "soft",
    },
    to: "/projects?type=ai",
  },
  {
    title: "Web Development",
    description:
      "Create modern web apps using Vue, Nuxt, Node.js, and scalable backend systems.",
    icon: {
      name: "i-lucide-code",
      color: "success",
      variant: "soft",
    },
    to: "/projects?type=web",
  },
  {
    title: "Cybersecurity",
    description:
      "Learn ethical hacking, penetration testing, and modern defensive security practices.",
    icon: {
      name: "i-lucide-shield",
      color: "error",
      variant: "soft",
    },
    to: "/projects?type=security",
  },
  {
    title: "Data Science",
    description:
      "Analyze data, build predictive models, and create powerful visualizations.",
    icon: {
      name: "i-lucide-database",
      color: "info",
      variant: "soft",
    },
    to: "/projects?type=data",
  },
  {
    title: "Cloud Computing",
    description:
      "Deploy scalable applications using AWS, Azure, Docker, and DevOps workflows.",
    icon: {
      name: "i-lucide-cloud",
      color: "secondary",
      variant: "soft",
    },
    to: "/projects?type=cloud",
  },
]);

const ctaInfo = {
  title: "Where innovation",
  subtitle: "Meets Talent",
  description:
    "We are building the next generation of engineers, developers, cybersecurity experts, and tech innovators. Join Kenya's premier university tech community.",
};

const config = useAppConfig();

const counts = ref({
  activeMembers: 500,
  projects: 50,
  eventsYear: 20,
});

const groupImages = import.meta.glob(
  "/assets/files/mut/*.{jpg,jpeg,png,webp}",
  { eager: true, as: "url" },
);

useSeoMeta({
  title: config.site.title,
  ogTitle: config.site.title,
  description: config.site?.description,
  ogDescription: config.site?.description,
});
</script>

<template>
  <div class="w-full overflow-hidden">
    <OnThisPage :sections="sections" />

    <!-- HERO SECTION -->
    <section
      id="hero"
      class="relative w-full scroll-mt-20 overflow-hidden bg-gradient-to-b from-primary-50 via-primary-200 to-white dark:from-black/90 dark:via-black/70 dark:to-black/50"
      aria-label="Hero section"
    >
      <!-- Background container -->
      <div class="absolute inset-0 pointer-events-none">
        <!-- SVG/Component Background -->
        <BackGround
          class="absolute -left-0 top-0 w-[120%] h-[75%] md:w-[80%] md:h-full"
        />

        <!-- Hero Image (desktop only) -->
        <img
          src="/mut-image.jpg"
          alt="Murang'a University of Technology"
          class="hidden md:block absolute right-0 top-0 w-[40%] h-full object-cover shadow-lg"
          data-aos="fade-left"
          data-aos-duration="1200"
          loading="lazy"
        />

        <!-- Hero Image (mobile/tablet) -->
        <img
          src="/mut-image.jpg"
          alt="Murang'a University of Technology"
          class="block md:hidden absolute top-0 left-0 w-full h-[200px] object-cover shadow-lg"
          data-aos="fade-up"
          data-aos-duration="1200"
          loading="lazy"
        />
      </div>

      <!-- Gradient overlay -->
      <div
        class="absolute inset-0 z-10 pointer-events-none bg-gradient-to-tr from-white/30 dark:from-black/80 via-black/20 dark:via-black/50 to-white/0 dark:to-black/20"
      ></div>

      <!-- Hero content -->
      <UPageSection class="relative z-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- LEFT CONTENT -->
          <div class="max-w-xl space-y-5">
            <!-- Badge -->
            <UBadge
              color="success"
              variant="soft"
              icon="i-lucide-graduation-cap"
              size="lg"
              data-aos="fade-down"
            >
              Murang'a University of Technology
            </UBadge>

            <!-- Headings -->
            <div class="space-y-2">
              <h1
                class="font-bold text-4xl md:text-5xl lg:text-6xl leading-tight text-white"
                data-aos="fade-up"
              >
                {{ ctaInfo?.title || "Welcome to" }}
              </h1>

              <h1
                class="font-bold text-primary text-4xl md:text-5xl lg:text-6xl leading-tight"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {{ ctaInfo?.subtitle || "MUT Tech Club" }}
              </h1>

              <p
                class="text-lg md:text-xl text-gray-200 dark:text-gray-300"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                {{
                  ctaInfo?.description ||
                  "Empowering students with real-world technical skills, innovation, and collaboration."
                }}
              </p>
            </div>

            <!-- CTA Buttons -->
            <div
              class="flex flex-wrap gap-4 mt-6"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <UButton
                to="/join"
                size="lg"
                trailing-icon="i-lucide-arrow-right"
              >
                Join Club
              </UButton>

              <UButton
                to="/projects"
                size="lg"
                color="neutral"
                variant="soft"
                icon="i-lucide-folder-code"
              >
                Explore Projects
              </UButton>
            </div>

            <!-- Stats -->
            <div
              class="grid grid-cols-3 gap-6 mt-10"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div
                v-for="st in statsData?.statistics || []"
                :key="st.id"
                class="text-center"
                data-aos="zoom-in"
              >
                <div
                  class="flex justify-center items-center text-3xl font-bold text-primary"
                >
                  <ClientOnly><CountUp :endVal="st?.value || 0" /></ClientOnly>
                  <span class="ml-1">+</span>
                </div>
                <p class="text-sm text-muted">{{ st?.label }}</p>
              </div>

              <div v-if="status">
                <LoaderSpinnner class="mx-auto" />
              </div>
            </div>
          </div>

          <!-- RIGHT CAROUSEL -->
          <div
            class="flex justify-center items-start"
            data-aos="zoom-in-left"
            data-aos-delay="200"
          >
            <UCarousel
              v-slot="{ item }"
              :items="galleryData?.results || groupImages"
              loop
              dots
              :autoplay="{ delay: 4500 }"
              wheel-gestures
              class="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-xl shadow-lg md:rounded-l-xl"
            >
              <img
                :src="item?.image || item || '/placeholder.jpg'"
                loading="lazy"
                alt="Students collaborating"
                class="w-full h-[260px] sm:h-[280px] md:h-[340px] lg:h-[380px] object-cover rounded-lg md:rounded-l-xl shadow-lg"
              />
            </UCarousel>
          </div>
        </div>
      </UPageSection>
    </section>
    <!-- ABOUT SECTION -->
    <section
      id="about"
      class="py-20 scroll-mt-20"
      aria-label="About MUT Tech Club"
    >
      <div class="max-w-7xl mx-auto px-6 flex flex-col items-center">
        <div class="max-w-2xl text-center" data-aos="fade-up">
          <h2 class="text-3xl font-bold tracking-tight">
            What is MUT Tech Club?
          </h2>

          <p class="mt-3 text-lg text-muted">
            We are a student-led innovation hub dedicated to building real-world
            technical skills, fostering creativity, and preparing students for
            global tech careers.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
          <NuxtLink
            v-for="(feature, i) in features || []"
            :key="feature?.title || i"
            :to="feature?.to || '#'"
            class="group rounded-xl border border-default p-6 hover:border-primary hover:shadow-lg transition"
            data-aos="fade-up"
            :data-aos-delay="i * 100"
          >
            <div
              class="flex items-center justify-center w-12 h-12 rounded-lg mb-4 bg-primary/10"
            >
              <UIcon
                :name="feature?.icon?.name || 'i-lucide-box'"
                class="text-xl text-primary"
              />
            </div>

            <h3 class="font-semibold text-lg group-hover:text-primary">
              {{ feature?.title || "Feature" }}
            </h3>

            <p class="mt-2 text-sm text-muted">
              {{ feature?.description || "Feature description." }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- FOCUS AREAS SECTION -->
    <section
      id="focus-areas"
      class="py-20 bg-muted/30 scroll-mt-20"
      aria-label="Our focus areas"
    >
      <div class="max-w-7xl mx-auto px-6 flex flex-col items-center">
        <div class="max-w-2xl text-center" data-aos="fade-up">
          <h2 class="text-3xl font-bold tracking-tight">Our Focus Areas</h2>

          <p class="mt-3 text-lg text-muted">
            Develop expertise in high-impact technology fields shaping the
            future.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
          <NuxtLink
            v-for="(area, i) in focusAreas || []"
            :key="area?.title || i"
            :to="area?.to || '#'"
            class="group rounded-xl border border-default p-6 hover:border-primary hover:shadow-lg transition"
            data-aos="fade-up"
            :data-aos-delay="i * 100"
          >
            <div
              class="flex items-center justify-center w-12 h-12 rounded-lg mb-4 bg-primary/10"
            >
              <UIcon
                :name="area?.icon?.name || 'i-lucide-cpu'"
                class="text-xl text-primary"
              />
            </div>

            <h3 class="font-semibold text-lg group-hover:text-primary">
              {{ area?.title || "Technology Area" }}
            </h3>

            <p class="mt-2 text-sm text-muted">
              {{ area?.description || "Area description." }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Highlights wrapper -->
    <section id="highlights" class="scroll-mt-20" aria-label="Highlights">
      <section
        id="featured-project"
        class="scroll-mt-20"
        aria-label="Featured Project"
        data-aos="fade-up"
      >
        <HightlightFeaturedProject :limit="6" :related="'technology'" />
      </section>

      <section 
        id="upcoming-event"
        class="scroll-mt-20"
        aria-label="Upcoming Event"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <HighlightUpcomingEvent :limit="6"  :related="'technology'" />
      </section>

      <section
        id="community"
        class="scroll-mt-20 m-auto text-center"
        aria-label="Community"
      >
        <HighlightCommunityGallery />
      </section>

      <section
        id="reviews"
        class="scroll-mt-20"
        aria-label="Reviews"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <HighlightReviews />
      </section>
    </section>

    <!-- PARTNERS SECTION -->
    <section
      id="partners"
      class="my-20 w-full scroll-mt-20"
      aria-label="Our partners"
    >
      <div class="max-w-2xl text-center m-auto mb-10" data-aos="fade-up">
        <h2 class="text-3xl font-bold tracking-tight">Our Partners</h2>

        <p class="mt-3 text-lg text-muted">
          Collaborating with industry leaders to provide opportunities for our
          members.
        </p>
      </div>

      <UMarquee
        pause-on-hover
        :overlay="false"
        :ui="{ root: '[--gap:--spacing(4)]', content: 'w-auto py-1' }"
      >
        <UPageCard
          v-for="(partner, index) in collaborationPatners || []"
          :key="index"
          variant="subtle"
          class="w-64"
        >
          <div class="flex items-center gap-3">
            <img
              v-if="partner?.image"
              :src="partner?.image || '/placeholder.jpg'"
              :alt="partner?.label"
              class="w-16 h-12 object-contain"
              loading="lazy"
            />

            <p class="text-lg font-semibold">
              {{ partner?.label || "Partner" }}
            </p>
          </div>
        </UPageCard>
      </UMarquee>
    </section>

    <!-- CALL TO ACTION SECTION -->
    <section
      id="cta"
      class="w-full px-6 py-16 flex flex-col items-center gap-10 bg-gradient-to-tr from-primary/40 via-primary-400/20 dark:via-primary-400/7 to-transparent scroll-mt-20"
      aria-label="Join us call to action"
    >
      <CodeCards data-aos="flip-left" data-aos-duration="1500" />

      <UPageCard
        spotlight
        spotlight-color="primary"
        class="py-12 flex flex-col items-center text-center gap-6 max-w-xl"
      >
        <div data-aos="zoom-in-up">
          <h2 class="text-3xl font-bold tracking-tight">
            Ready to Join the Club?
          </h2>

          <p class="mt-3 text-lg text-muted">
            Become part of Kenya's most innovative university tech community.
          </p>
        </div>

        <UButton
          label="Join MUT Tech Club"
          color="primary"
          trailing-icon="i-lucide-arrow-right"
          size="xl"
          to="/join"
          class="w-fit m-auto"
        />
      </UPageCard>
    </section>
  </div>
</template>
