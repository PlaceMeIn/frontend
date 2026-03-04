<template>
  <section>
    <!-- HERO SECTION -->
    <div
      class="relative w-full h-[460px] md:h-[620px] flex items-center justify-center bg-gradient-to-tr from-primary-900/10 via-primary-500/10 to-primary-400/20"
    >
      <div
        class="flex flex-col items-center text-center px-4 md:px-0"
        data-aos="zoom-out"
        data-aos-duration="900"
      >
        <UBadge
          icon="i-lucide-star"
          variant="outline"
          class="mb-4"
          label="Apply to Join Kenya's Premier Tech Club"
        />
        <h1 class="text-4xl md:text-6xl font-bold tracking-tight">
          Join MUT Tech Club
        </h1>
        <p class="mt-4 text-base md:text-lg text-muted max-w-2xl mx-auto">
          This is not just a club membership — it's your gateway to becoming
          part of an elite community of innovators, builders, and tech leaders.
        </p>

        <!-- Stats Cards -->
        <div class="flex flex-wrap gap-5 mt-6 justify-center">
          <div
            class="flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-lg bg-white/20 dark:bg-gray-800/30 shadow-lg transition-transform hover:scale-105"
          >
            <UIcon name="i-lucide-group" class="text-primary text-2xl" />
            <span class="font-semibold text-base">500+ Active Members</span>
          </div>
          <div
            class="flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-lg bg-white/20 dark:bg-gray-800/30 shadow-lg transition-transform hover:scale-105"
          >
            <UIcon name="i-lucide-check" class="text-green-500 text-2xl" />
            <span class="font-semibold text-base">Industry Mentors</span>
          </div>
          <div
            class="flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-lg bg-white/20 dark:bg-gray-800/30 shadow-lg transition-transform hover:scale-105"
          >
            <UIcon name="i-lucide-star" class="text-yellow-400 text-2xl" />
            <span class="font-semibold text-base">Real Projects</span>
          </div>
        </div>
      </div>
    </div>

    <!-- MEMBERSHIP BENEFITS & APPLICATION FORM -->
    <div class="max-w-7xl mx-auto px-6 py-16 lg:flex lg:gap-12 relative">
      <section class="lg:w-1/3 lg:sticky lg:top-20 self-start">
        <div class="mb-8" data-aos="fade-up">
          <h2 class="text-3xl md:text-4xl font-bold tracking-tight">
            Membership Benefits
          </h2>
          <p class="text-muted mt-3 max-w-xl mx-auto">
            Unlock opportunities designed to accelerate your growth.
          </p>
        </div>

        <div
          class="flex flex-col gap-0"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div
            v-for="(ftr, i) in membership_benefits"
            :key="i"
            class="flex items-start gap-3 p-3 rounded-lg bg-white/10 dark:bg-gray-800/20 backdrop-blur-lg"
          >
            <UIcon
              name="i-lucide-check-circle"
              class="text-green-500 text-xl mt-1"
            />
            <span class="text-base">{{ ftr }}</span>
          </div>
        </div>

        <div
          class="mt-12 flex justify-center"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <UCard
            class="text-center w-full bg-gradient-to-br from-primary-500/80 to-primary-900/20"
          >
            <p class="text-muted text-sm">Application Status</p>
            <h3 class="text-2xl font-bold mt-2">Open for 2026</h3>
            <p class="text-sm mt-1 text-primary font-medium">
              Limited spots available
            </p>
          </UCard>
        </div>
      </section>

      <!-- Application Form -->
      <section class="lg:w-2/3 mt-12 lg:mt-0">
        <h2 class="text-3xl font-bold mb-4">Application Form</h2>
        <p class="text-muted mb-6">
          Fill out this form to apply for membership. We review all applications
          carefully.
        </p>

        <form class="flex flex-col gap-6" @submit.prevent="submitForm">
          <h3 class="border-b border-primary pb-2">Personal Information</h3>
          <UFormField label="Full Name" required>
            <UInput
              v-model="form.fullName"
              icon="i-lucide-user"
              placeholder="John Doe"
              class="w-full"
            />
          </UFormField>

          <div class="flex flex-col md:flex-row gap-3">
            <UFormField label="Email Address" required>
              <UInput
                v-model="form.email"
                type="email"
                icon="i-lucide-mail"
                placeholder="you@example.com"
                class="w-full"
              />
            </UFormField>
            <UFormField label="WhatsApp / Phone (optional)">
              <UInput
                v-model="form.phone"
                icon="i-lucide-phone"
                placeholder="+254..."
                class="w-full"
              />
            </UFormField>
          </div>

          <h3 class="border-b border-primary pb-2 mt-6">
            Academic Information
          </h3>
          <div class="flex flex-col md:flex-row gap-3">
            <UFormField label="Course/Program">
              <USelect
                v-model="form.program"
                :items="programs"
                icon="i-lucide-graduation-cap"
                placeholder="Select program"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Year of Study">
              <USelect
                v-model="form.year"
                :items="years"
                icon="i-lucide-graduation-cap"
                placeholder="Select year"
                class="w-full"
              />
            </UFormField>
          </div>

          <h3 class="border-b border-primary pb-2 mt-6">Technical Skills</h3>
          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="skill in allTechSkills"
              :key="skill"
              size="sm"
              :variant="form.techSkills?.includes(skill) ? 'solid' : 'outline'"
              @click="toggleSkill(skill)"
            >
              {{ skill }}
            </UButton>
          </div>

          <h3 class="border-b border-primary pb-2 mt-6">Areas of Interest</h3>
          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="interest in allInterests"
              :key="interest"
              size="sm"
              :variant="
                form.interests?.includes(interest) ? 'solid' : 'outline'
              "
              @click="toggleInterest(interest)"
            >
              {{ interest }}
            </UButton>
          </div>

          <h3 class="border-b border-primary pb-2 mt-6">Portfolio & Links</h3>
          <UFormField label="GitHub Profile (Optional)">
            <UInput
              v-model="form.github"
              icon="i-lucide-github"
              placeholder="https://github.com/username"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Portfolio Website (Optional)">
            <UInput
              v-model="form.portfolio"
              icon="i-lucide-globe"
              placeholder="https://example.com"
              class="w-full"
            />
          </UFormField>

          <h3 class="border-b border-primary pb-2 mt-6">
            Tell Us About Yourself
          </h3>
          <UFormField label="Why do you want to join MUT Tech Club?" required>
            <UTextarea
              v-model="form.message"
              icon="i-lucide-message-square"
              placeholder="Share your passion and goals..."
              autoresize
              class="w-full"
              :rows="5"
            />
          </UFormField>

          <UButton
            type="submit"
            icon="i-lucide-send"
            size="lg"
            class="justify-center"
            :loading="stateStore.isSubmitting"
          >
            Submit Application
          </UButton>

          <p v-if="stateStore.submitSuccess" class="text-success mt-2">
            Application submitted successfully!
          </p>
          <p v-if="stateStore.submitError" class="text-danger mt-2">
            {{ stateStore.submitError }}
          </p>
        </form>
      </section>
    </div>

    <!-- WHAT HAPPENS NEXT -->
    <section class="bg-muted/20 py-20">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl md:text-4xl font-bold tracking-tight">
            What Happens Next?
          </h2>
          <p class="mt-3 text-muted max-w-2xl">
            Our application process ensures the best fit for both you and the
            club.
          </p>
        </div>

        <div
          class="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <UCard
            v-for="(step, index) in reviewSteps"
            :key="index"
            class="text-center p-6"
          >
            <div
              class="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold"
            >
              {{ index + 1 }}
            </div>
            <h3 class="font-semibold text-lg">{{ step.title }}</h3>
            <p class="text-sm text-muted mt-2">{{ step.description }}</p>
          </UCard>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
const stateStore = useStateStore();

const form = computed({
  get: () => stateStore.join,
  set: (val) => (stateStore.join = val),
});

const membership_benefits = [
  "Access to exclusive workshops and training",
  "Work on real-world projects",
  "Mentorship from industry professionals",
  "Networking opportunities",
  "Career development resources",
  "Certificate of membership",
];

const reviewSteps = [
  {
    title: "Application Review",
    description: "We review your application within 3–5 business days.",
  },
  {
    title: "Interview",
    description: "Selected candidates are invited for a brief interview.",
  },
  {
    title: "Onboarding",
    description: "Attend a welcome session and orientation.",
  },
  {
    title: "Get Started",
    description: "Join projects, attend events, and start building!",
  },
];

const years = ["Year 1", "Year 2", "Year 3", "Year 4", "Alumni", "Other"];
const programs = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Software Engineering",
  "Other",
];

const allTechSkills = [
  "Web Development",
  "Mobile Development",
  "AI / ML",
  "Data Science",
  "Cybersecurity",
  "UI/UX Design",
  "Cloud Computing",
  "Embedded Systems",
];

const allInterests = [
  "Hackathons",
  "Competitions",
  "Workshops",
  "Community Service",
  "Research",
  "Startups",
  "Open Source",
  "Mentorship",
];

function toggleSkill(skill: string) {
  form.value.techSkills = form.value.techSkills || [];
  form.value.techSkills = form.value.techSkills.includes(skill)
    ? form.value.techSkills.filter((s) => s !== skill)
    : [...form.value.techSkills, skill];
}

function toggleInterest(interest: string) {
  form.value.interests = form.value.interests || [];
  form.value.interests = form.value.interests.includes(interest)
    ? form.value.interests.filter((i) => i !== interest)
    : [...form.value.interests, interest];
}

function submitForm() {
  stateStore.submitJoinForm();
}
</script>
