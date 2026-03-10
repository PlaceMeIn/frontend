<script lang="ts" setup>
import { ref } from "vue";

const communityGallery = ref([
  // First marquee - Coding camp group photos 1-4
  [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=460&h=258&fit=crop", // Diverse team coding together
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=460&h=258&fit=crop", // Team brainstorming
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=460&h=258&fit=crop", // Coding workshop
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=460&h=258&fit=crop", // Hackathon participants
  ],
  // Second marquee - Coding camp group photos 5-8
  [
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=460&h=258&fit=crop", // Kids coding camp
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=460&h=258&fit=crop", // Students learning
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=460&h=258&fit=crop", // Tech team meeting
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=460&h=258&fit=crop", // Group collaboration
  ],
  // Third marquee - Coding camp group photos 9-12
  [
    "https://images.unsplash.com/photo-1543269664-7eef42226a21?w=460&h=258&fit=crop", // Diverse developers
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=460&h=258&fit=crop", // Workshop presentation
    "https://images.unsplash.com/photo-1529333320936-e2193f4e3b2b?w=460&h=258&fit=crop", // Coding bootcamp
    "https://images.unsplash.com/photo-1517048676738-d65ab937acf1?w=460&h=258&fit=crop", // Team building
  ],
]);
</script>

<template>
  <div
    id="community"
    class="relative w-full h-[500px] bg-gradient-to-br overflow-hidden"
  >
    <!-- First marquee (left) -->
    <UMarquee
      reverse
      orientation="vertical"
      :overlay="false"
      :ui="{
        root: '[--duration:40s] absolute w-[460px] -left-[100px] -top-[300px] h-[940px] transform-3d rotate-x-55 rotate-y-0 rotate-z-30',
      }"
    >
      <img
        v-for="(image, index) in communityGallery[0]"
        :key="`left-${index}`"
        :src="image"
        width="460"
        height="258"
        :alt="`Coding camp group ${index + 1}`"
        class="aspect-video border-4 border-white/20 rounded-lg shadow-2xl hover:scale-105 hover:border-white/40 transition-all duration-300"
      />
    </UMarquee>

    <!-- Second marquee (middle) -->
    <UMarquee
      orientation="vertical"
      :overlay="false"
      :ui="{
        root: '[--duration:40s] absolute w-[460px] -top-[400px] left-[480px] h-[1160px] transform-3d rotate-x-55 rotate-y-0 rotate-z-30',
      }"
    >
      <img
        v-for="(image, index) in communityGallery[1]"
        :key="`middle-${index}`"
        :src="image"
        width="460"
        height="258"
        :alt="`Coding camp group ${index + 5}`"
        class="aspect-video border-4 border-white/20 rounded-lg shadow-2xl hover:scale-105 hover:border-white/40 transition-all duration-300"
      />
    </UMarquee>

    <!-- Third marquee (right) - hidden on mobile -->
    <UMarquee
      reverse
      orientation="vertical"
      :overlay="false"
      :ui="{
        root: 'hidden md:flex [--duration:40s] absolute w-[460px] -top-[300px] left-[1020px] h-[1060px] transform-3d rotate-x-55 rotate-y-0 rotate-z-30',
      }"
    >
      <img
        v-for="(image, index) in communityGallery[2]"
        :key="`right-${index}`"
        :src="image"
        width="460"
        height="258"
        :alt="`Coding camp group ${index + 9}`"
        class="aspect-video border-4 border-white/20 rounded-lg shadow-2xl hover:scale-105 hover:border-white/40 transition-all duration-300"
      />
    </UMarquee>

    <UMarquee
      orientation="vertical"
      :overlay="false"
      :ui="{
        root: 'hidden xl:flex [--duration:40s] absolute w-[460px] -top-[350px] left-[1650px] h-[1100px] transform-3d rotate-x-55 rotate-z-30',
      }"
    >
      <img
        v-for="(image, index) in communityGallery[0]"
        :key="`xl-${index}`"
        :src="image"
        width="460"
        height="258"
        class="aspect-video border-4 border-white/20 rounded-lg shadow-2xl hover:scale-105 transition"
      />
    </UMarquee>

    <UMarquee
      reverse
      orientation="vertical"
      :overlay="false"
      :ui="{
        root: 'hidden 2xl:flex [--duration:40s] absolute w-[460px] -top-[300px] left-[2250px] h-[1000px] transform-3d rotate-x-55 rotate-z-30',
      }"
    >
      <img
        v-for="(image, index) in communityGallery[1]"
        :key="`2xl-${index}`"
        :src="image"
        width="460"
        height="258"
        class="aspect-video border-4 border-white/20 rounded-lg shadow-2xl hover:scale-105 transition"
      />
    </UMarquee>

    <!-- Optional overlay text -->
    <div
      class="absolute inset-0 flex flex-col gap-10 items-center justify-center z-10"
      data-aos="zoom-in-up"
    >
      <div class="text-center text-white backdrop-blur-md p-3 rounded">
        <h2
          class="text-2xl md:text-5xl font-bold mb-4 drop-shadow-lg text-shadow-xl"
        >
          Join Our Coding Camp
        </h2>
        <p class="text-sm md:text-xl drop-shadow-md">
          Learn together, grow together
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-4 z-99">
        <UButton
          label="Join Now"
          to="/join"
          trailing-icon="i-lucide-move-right"
        />

        <UButton
          label="View Gallery"
          to="/gallery"
          color="neutral"
          variant="soft"
          trailing-icon="i-lucide-images"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.transform-3d {
  transform-style: preserve-3d;
  backface-visibility: hidden;
}
</style>
