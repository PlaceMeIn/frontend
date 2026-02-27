<script setup lang="ts">
import type { PageFeatureProps, ButtonProps } from "@nuxt/ui";
import MazAnimatedCounter from "maz-ui/components/MazAnimatedCounter";

const features = ref<PageFeatureProps[]>([
  {
    title: "Icons",
    description:
      "Nuxt UI integrates with Nuxt Icon to access over 200,000+ icons from Iconify.",
    icon: "i-lucide-smile",
    to: "/docs/getting-started/integrations/icons",
  },
  {
    title: "Fonts",
    description:
      "Nuxt UI integrates with Nuxt Fonts to provide plug-and-play font optimization.",
    icon: "i-lucide-a-large-small",
    to: "/docs/getting-started/integrations/fonts",
  },
  {
    title: "Color Mode",
    description:
      "Nuxt UI integrates with Nuxt Color Mode to switch between light and dark.",
    icon: "i-lucide-sun-moon",
    to: "/docs/getting-started/integrations/color-mode",
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

useSeoMeta({
  title: config.site.title,
  ogTitle: config.site.title,
  description: config.site?.description,
  ogDescription: config.site?.description,
});
</script>

<template>
  <div class="w-full h-fit overflow-hidden min-h-50">
    <div
      class="relative w-full bg-linear-0 from-primary-50 via-primary-200 to bg-primary-500"
    >
      <div class="absolute w-full h-full overflow-hidden z-2 opacity-50">
        <BackGround class="absolute w-3/4 z-0" />

        <img
          class="w-[30%] absolute right-0 -z-1 h-full object-cover"
          src="/mut-image.jpg"
          alt="MUT image"
        />
      </div>
      <UPageSection class="z-50">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <UBadge
              color="primary"
              variant="outline"
              icon="i-lucide-graduation-cap"
              size="lg"
              >Murang'a University Of Technology</UBadge
            >
            <div>
              <h2 class="font-bold text-6xl">{{ ctaInfo.title }}</h2>
              <h2 class="font-bold text-primary text-6xl">
                {{ ctaInfo.subtitle }}
              </h2>
              <p class="mt-3 text-lg">
                {{ ctaInfo.description }}
              </p>
            </div>

            <div class="flex items-center gap-5 mt-5">
              <UButton trailing-icon="i-lucide-arrow-right" size="lg"
                >Join Club</UButton
              >
              <UButton icon="i-lucide-library-big" size="lg" color="neutral"
                >Explore Projects</UButton
              >
            </div>

            <div class="grid grid-cols-3 gap-6 mt-6">
              <div class="flex flex-col items-start">
                <span class="text-3xl font-bold text-primary flex items-center">
                  <MazAnimatedCounter :count="counts.activeMembers" />
                  <span class="ml-1">+</span>
                </span>
                <p class="text-sm text-muted">Active Members</p>
              </div>

              <div class="flex flex-col items-start">
                <span class="text-3xl font-bold text-primary flex items-center">
                  <MazAnimatedCounter :count="counts.projects" />
                  <span class="ml-1">+</span>
                </span>
                <p class="text-sm text-muted">Projects</p>
              </div>

              <div class="flex flex-col items-start">
                <span class="text-3xl font-bold text-primary flex items-center">
                  <MazAnimatedCounter :count="counts.eventsYear" />
                  <span class="ml-1">+</span>
                </span>
                <p class="text-sm text-muted">Events / Year</p>
              </div>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1758270705172-07b53627dfcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudHMlMjB0ZWNobm9sb2d5JTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NzE0MDQ0Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080"
            width="352"
            height="300"
            alt="Illustration"
            class="w-full rounded-lg"
          />
        </div>
      </UPageSection>
    </div>

    <div>
      <UPageSection
        title="What is MUT Tech Club?"
        description="We are a student-led innovation hub at Murang'a University of Technology dedicated to fostering technical excellence, creativity, and entrepreneurship."
        :features="features"
      >
      </UPageSection>
    </div>
  </div>
</template>
