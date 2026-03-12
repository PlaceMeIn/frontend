<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import placeholderImg from '/placeholder.jpg'

const groupImagesObj = import.meta.glob('/assets/files/mut/*.{jpg,jpeg,png,webp}', { eager: true, as: 'url' })
const allImages = Object.values(groupImagesObj)

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

const endpoints = useEndpoints()
const { get } = useApi()

const { data: featuredData } = await useAsyncData(
  'featured-gallery',
  () => get(endpoints.gallery.featured, { limit: 12 }),
  { default: () => ({ results: [] }) }
)

const featuredImages = computed(() => {
  if (featuredData.value?.results?.length) {
    return featuredData.value.results.map((item: any) => item.url + '/' + item.image)
  }
  return allImages
})

// Group images into sets of 4
const communityGallery = ref(chunkArray(featuredImages.value, 4))

// Watch featuredImages in case API updates
watch(featuredImages, (newImages) => {
  communityGallery.value = chunkArray(newImages, 4)
}, { immediate: true })
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
      <NuxtImg
        v-for="(image, index) in communityGallery[0]"
        :key="`left-${index}`"
        :src="image || '/placeholder.jpg'"
        :placeholder="placeholderImg"
        loading="lazy"
        width="460"
        height="258"
        :alt="`Coding camp group ${index + 1}`"
        class="aspect-video border-4 border-white/20 object-cover rounded-lg shadow-2xl hover:scale-105 hover:border-white/40 transition-all duration-300"
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
      <NuxtImg
        v-for="(image, index) in communityGallery[1]"
        :key="`middle-${index}`"
        :src="image || '/placeholder.jpg'"
        :placeholder="placeholderImg"
        loading="lazy"
        width="460"
        height="258"
        :alt="`Coding camp group ${index + 5}`"
        class="aspect-video border-4 border-white/20 object-cover rounded-lg shadow-2xl hover:scale-105 hover:border-white/40 transition-all duration-300"
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
      <NuxtImg
        v-for="(image, index) in communityGallery[2]"
        :key="`right-${index}`"
        :src="image || '/placeholder.jpg'"
        :placeholder="placeholderImg"
        loading="lazy"
        width="460"
        height="258"
        :alt="`Coding camp group ${index + 9}`"
        class="aspect-video border-4 border-white/20 object-cover rounded-lg shadow-2xl hover:scale-105 hover:border-white/40 transition-all duration-300"
      />
    </UMarquee>

    <UMarquee
      orientation="vertical"
      :overlay="false"
      :ui="{
        root: 'hidden xl:flex [--duration:40s] absolute w-[460px] -top-[350px] left-[1650px] h-[1100px] transform-3d rotate-x-55 rotate-z-30',
      }"
    >
      <NuxtImg
        v-for="(image, index) in communityGallery[0]"
        :key="`xl-${index}`"
        :src="image || '/placeholder.jpg'"
        :placeholder="placeholderImg"
        loading="lazy"
        width="460"
        height="258"
        class="aspect-video border-4 border-white/20 object-cover rounded-lg shadow-2xl hover:scale-105 transition"
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
      <NuxtImg
        v-for="(image, index) in communityGallery[1]"
        :key="`2xl-${index}`"
        :src="image || '/placeholder.jpg'"
        :placeholder="placeholderImg"
        loading="lazy"
        width="460"
        height="258"
        class="aspect-video border-4 object-cover border-white/20 rounded-lg shadow-2xl hover:scale-105 transition"
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
