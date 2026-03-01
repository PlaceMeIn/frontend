<template>
  <section>
    <section
      class="h-[420px] flex flex-col items-center justify-center text-center bg-gradient-to-br from-primary-500/30 to-primary-900/30"
      data-aos="fade-down"
    >
      <h1 class="text-5xl font-bold tracking-tight">
        {{ "Learning Resources" }}
      </h1>

      <p class="mt-4 text-lg text-muted max-w-xl">
        {{
          "Everything you need to level up your tech skills—learning paths, workshops, repositories, and certifications"
        }}
      </p>
    </section>

    <section
      class="w-full py-24 bg-gradient-to-tr from-primary-600/10 via-transparent to-primary-400/10"
      data-aos="fade-up"
    >
      <div class="max-w-6xl mx-auto px-6 text-center">
        <UIcon name="i-lucide-library" :size="80" class="text-primary" />
        <h2 class="text-3xl md:text-4xl font-bold">Access Premium Resources</h2>
        <p class="mt-3 text-muted max-w-xl mx-auto">
          Join MUT Tech Club to unlock exclusive learning materials, workshop
          recordings, and mentorship opportunities.
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
          <div class="flex-1 gap-20 items-center">
            <ThreeDButton @clicked="$router.push('/join')" />
            <StarOnGitButton
              @clicked="$router.push('/join')"
              class="mt-10 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script lang="ts" setup></script>

<style></style>
