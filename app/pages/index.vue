<script setup lang="ts">
import type { PageFeatureProps } from "@nuxt/ui";
import CountUp from 'vue-countup-v3'
import HighlightUpcomingEvent from "~/components/landing/HighlightUpcomingEvent.vue";
import HightlightFeaturedProject from "~/components/landing/HighlightFeaturedProject.vue";

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
    to: "/programs",
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
    to: "/focus/ai",
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
    to: "/focus/web",
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
    to: "/focus/security",
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
    to: "/focus/data",
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
    to: "/focus/cloud",
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

const groupImages = ref([
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=640&h=640&fit=crop",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=640&h=640&fit=crop",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=640&h=640&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=640&h=640&fit=crop",
  "https://images.unsplash.com/photo-1552664688-cf412ec27db2?w=640&h=640&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=640&h=640&fit=crop",
  "https://images.unsplash.com/photo-1543269664-7eef42226a21?w=640&h=640&fit=crop",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=640&h=640&fit=crop",
  // "https://images.unsplash.com/photo-1558403710-8c56b4f5c2f1?w=640&h=640&fit=crop",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=640&h=640&fit=crop",
  "https://images.unsplash.com/photo-1520881363902-a0ff4e722963?w=640&h=640&fit=crop",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&h=640&fit=crop",
  // "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=640&h=640&fit=crop",
  // "https://images.unsplash.com/photo-1573164574001-518958d9baa2?w=640&h=640&fit=crop"
]);

useSeoMeta({
  title: config.site.title,
  ogTitle: config.site.title,
  description: config.site?.description,
  ogDescription: config.site?.description,
});
</script>

<template>
  <div class="w-full overflow-hidden">
    <div
      class="relative w-full bg-gradient-to-b from-primary-50 via-primary-200 to-white dark:to-transparent"
    >
      <div class="absolute inset-0 overflow-hidden opacity-40">
        <BackGround class="absolute w-3/4" />
        <img
          class="absolute right-0 h-full w-[30%] object-cover"
          src="/mut-image.jpg"
          alt="Murang'a University of Technology"
          data-aos="fade-left"
        />
      </div>

      <UPageSection class="relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <UBadge
              color="success"
              variant="outline"
              icon="i-lucide-graduation-cap"
              size="lg"
              data-aos="fade-down"
            >
              Murang'a University of Technology
            </UBadge>

            <div class="mt-4 space-y-2">
              <h1
                class="font-bold text-5xl lg:text-6xl"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {{ ctaInfo.title }}
              </h1>
              <h1
                class="font-bold text-primary text-5xl lg:text-6xl"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                {{ ctaInfo.subtitle }}
              </h1>
              <p
                class="mt-4 text-lg text-gray-500 dark:text-gray-300"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                {{ ctaInfo.description }}
              </p>
            </div>

            <div
              class="flex flex-wrap items-center gap-4 mt-6"
              data-aos="fade-up"
              data-aos-delay="400"
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

            <div
              class="grid grid-cols-3 gap-8 mt-8"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <div data-aos="zoom-in" data-aos-delay="100">
                <div class="flex items-center text-3xl font-bold text-primary">
                  <CountUp :endVal="counts.activeMembers" />
                  <span class="ml-1">+</span>
                </div>
                <p class="text-sm text-muted">Active Members</p>
              </div>

              <div data-aos="zoom-in" data-aos-delay="200">
                <div class="flex items-center text-3xl font-bold text-primary">
                  <CountUp :endVal="counts.projects" />
                  <span class="ml-1">+</span>
                </div>
                <p class="text-sm text-muted">Projects Built</p>
              </div>

              <div data-aos="zoom-in" data-aos-delay="300">
                <div class="flex items-center text-3xl font-bold text-primary">
                  <CountUp :endVal="counts.eventsYear" />
                  <span class="ml-1">+</span>
                </div>
                <p class="text-sm text-muted">Events / Year</p>
              </div>
            </div>
          </div>

          <div data-aos="zoom-in-left" data-aos-delay="300">
            <UCarousel
              v-slot="{ item }"
              dots
              :items="groupImages"
              loop
              :autoplay="{ delay: 4000 }"
              wheel-gestures
              class="w-full max-w-xs md:max-w-md  mx-auto"
            >
              <img
                :src="item"
                alt="Students collaborating"
                class="w-full h-[300px] rounded-sm shadow-xl object-cover"
              />
            </UCarousel>
          </div>
        </div>
      </UPageSection>
    </div>

    <section class="py-20">
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

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <NuxtLink
            v-for="(feature, i) in features"
            :key="feature.title"
            :to="feature.to"
            class="group rounded-xl border border-default p-6 hover:border-primary hover:shadow-lg transition-all duration-200"
            data-aos="fade-up"
            :data-aos-delay="i * 100"
          >
            <div
              class="flex items-center justify-center w-12 h-12 rounded-lg mb-4"
              :class="`bg-${feature.icon?.color}-500/10`"
            >
              <UIcon
                :name="feature.icon?.name"
                class="text-xl"
                :class="`text-${feature.icon?.color}-500`"
              />
            </div>

            <h3
              class="font-semibold text-lg group-hover:text-primary transition"
            >
              {{ feature.title }}
            </h3>

            <p class="mt-2 text-sm text-muted">
              {{ feature.description }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="py-20 bg-muted/30">
      <div class="max-w-7xl mx-auto px-6 flex flex-col items-center">
        <div class="max-w-2xl text-center" data-aos="fade-up">
          <h2 class="text-3xl font-bold tracking-tight">Our Focus Areas</h2>
          <p class="mt-3 text-lg text-muted">
            Develop expertise in high-impact technology fields shaping the
            future.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <NuxtLink
            v-for="(area, i) in focusAreas"
            :key="area.title"
            :to="area.to"
            class="group rounded-xl border border-default p-6 hover:border-primary hover:shadow-lg transition-all duration-200"
            data-aos="fade-up"
            :data-aos-delay="i * 100"
          >
            <div
              class="flex items-center justify-center w-12 h-12 rounded-lg mb-4"
              :class="`bg-${area.icon?.color}-500/10`"
            >
              <UIcon
                :name="area.icon?.name"
                class="text-xl"
                :class="`text-${area.icon?.color}-500`"
              />
            </div>

            <h3
              class="font-semibold text-lg group-hover:text-primary transition"
            >
              {{ area.title }}
            </h3>

            <p class="mt-2 text-sm text-muted">
              {{ area.description }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section data-aos="fade-up">
      <HightlightFeaturedProject />
    </section>

    <section data-aos="fade-up" data-aos-delay="100">
      <HighlightUpcomingEvent />
    </section>

    <section class="m-auto">
      <HighlightCommunityGallery />
    </section>

    <section data-aos="fade-up" data-aos-delay="200">
      <HighlightReviews />
    </section>

    <div class="my-20 w-full">
      <div class="max-w-2xl text-center m-auto mb-5" data-aos="fade-up">
        <h2 class="text-3xl font-bold tracking-tight">Our Partners</h2>
        <p class="mt-3 text-lg text-muted">
          Collaborating with industry leaders to provide opportunities for our
          members
        </p>
      </div>

      <UMarquee
        pause-on-hover
        :overlay="false"
        :ui="{ root: '[--gap:--spacing(4)]', content: 'w-auto py-1' }"
      >
        <UPageCard
          v-for="(patner, index) in collaborationPatners"
          :key="index"
          variant="subtle"
          class="w-64"
          data-aos="zoom-in"
          :data-aos-delay="index * 100"
        >
          <div class="flex items-center flex-row gap-2">
            <img
              v-if="patner.image"
              :src="patner?.image"
              :alt="patner.label"
              class="w-20 h-15 object-contain"
            />
            <p class="text-xl font-bold">{{ patner.label }}</p>
          </div>
        </UPageCard>
      </UMarquee>
    </div>

    <div
      class="w-full p-10 my-15 flex flex-col items-center gap-10 justify-around bg-linear-to-tr from-primary/50 via-primary-200/50 dark:via-transparent to-transparent"
    >
      <CodeCards
        data-aos="flip-left"
        data-aos-easing="ease-out-cubic"
        data-aos-duration="2000"
      />

      <UPageCard
        spotlight
        spotlight-color="primary"
        class="py-12 flex flex-col items-center text-center gap-6 w-fit m-auto"
      >
        <div class="max-w-2xl" data-aos="zoom-in-up">
          <h2 class="text-3xl font-bold tracking-tight">
            Ready to Join the Club?
          </h2>
          <p class="mt-3 text-lg text-muted">
            Become part of Kenya's most innovative university tech community.
            Transform your ideas into reality.
          </p>
        </div>

        <UButton
          label="Join MUT Tech Club"
          color="primary"
          trailing-icon="i-lucide-arrow-right"
          size="xl"
          to="/join"
          class="w-fit shrink-0 m-auto"
        />
      </UPageCard>
    </div>
  </div>
</template>
