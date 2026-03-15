<template>
  <section class="relative">
    <OnThisPage :sections="sections" />

    <!-- HERO SECTION -->
    <section
      id="hero"
      class="relative w-full h-[460px] md:h-[620px] flex items-center justify-center bg-gradient-to-tr from-primary-900/10 via-primary-500/10 to-primary-400/20 overflow-hidden scroll-mt-20"
      aria-label="Join hero section"
    >
      <!-- Animated background elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl"
        ></div>
        <div
          class="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-700/20 rounded-full blur-3xl"
        ></div>
      </div>

      <div
        class="flex flex-col items-center text-center px-4 md:px-0 relative z-10"
        data-aos="zoom-out"
        data-aos-duration="900"
      >
        <UBadge
          icon="i-lucide-star"
          variant="outline"
          class="mb-4 animate-pulse"
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
            v-for="(stat, index) in stats"
            :key="index"
            class="flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-lg bg-white/20 dark:bg-gray-800/30 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            <UIcon :name="stat.icon" :class="stat.iconClass" class="text-2xl" />
            <span class="font-semibold text-base">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- MEMBERSHIP BENEFITS & APPLICATION FORM -->

    <section
      id="application"
      class="max-w-7xl mx-auto px-6 py-16 lg:flex lg:gap-12 relative scroll-mt-20"
      aria-label="Membership benefits and application form"
    >
      <!-- Benefits Section (Sticky) -->
      <div id="benefits-f" class="lg:w-1/3 lg:sticky lg:top-20 self-start">
        <div class="mb-8" data-aos="fade-up">
          <h2 class="text-3xl md:text-4xl font-bold tracking-tight">
            Membership Benefits
          </h2>
          <p class="text-muted mt-3 max-w-xl mx-auto">
            Unlock opportunities designed to accelerate your growth.
          </p>
        </div>

        <div
          class="flex flex-col gap-3"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div
            v-for="(ftr, i) in membership_benefits"
            :key="i"
            class="flex items-start gap-3 p-3 rounded-lg bg-white/10 dark:bg-gray-800/20 backdrop-blur-lg hover:bg-white/20 transition-colors duration-300"
          >
            <UIcon
              name="i-lucide-check-circle"
              class="text-green-500 text-xl mt-1 shrink-0"
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
            class="text-center w-full bg-gradient-to-br from-primary-500/80 to-primary-900/20 border-2 border-primary-500/30"
          >
            <p class="text-muted text-sm">Application Status</p>
            <h3 class="text-2xl font-bold mt-2">Open for 2026</h3>
            <p
              class="text-sm mt-1 text-primary font-medium flex items-center justify-center gap-1"
            >
              <UIcon name="i-lucide-clock" class="text-sm" />
              Limited spots available
            </p>
            <div class="mt-4 w-full bg-primary-500/20 rounded-full h-2">
              <div class="bg-primary-500 h-2 rounded-full w-3/4"></div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Application Form -->
      <section id="join" class="lg:w-2/3 mt-12 lg:mt-0">
        <template>
          <UStepper v-model="activeStep" :items="items" class="w-full">
            <template #form>
              <section>
                <div class="mb-8" data-aos="fade-up">
                  <h2 class="text-3xl font-bold mb-2">Application Form</h2>
                  <p class="text-muted">
                    Fill out this form to apply for membership. Fields marked
                    with
                    <span class="text-red-500">*</span> are required.
                  </p>
                </div>

                <UCard data-aos="fade-up" data-aos-delay="100">
                  <form
                    @submit.prevent="validateAndSubmit"
                    class="flex flex-col gap-6"
                  >
                    <!-- Personal Information -->
                    <div
                      class="flex items-center gap-2 border-b border-primary pb-2"
                    >
                      <UIcon name="i-lucide-user" class="text-primary" />
                      <h3 class="text-lg font-semibold">
                        Personal Information
                      </h3>
                    </div>

                    <UFormField
                      label="Full Name"
                      required
                      :error="errors.fullName"
                    >
                      <UInput
                        v-model="form.fullName"
                        icon="i-lucide-user"
                        placeholder="John Doe"
                        class="w-full"
                        :class="{
                          'border-red-500 focus:border-red-500':
                            errors.fullName,
                        }"
                        @blur="validateField('fullName')"
                        @update:model-value="clearFieldError('fullName')"
                      />
                    </UFormField>

                    <div class="flex flex-col md:flex-row gap-3">
                      <UFormField
                        label="Email Address"
                        required
                        :error="errors.email"
                        class="flex-1"
                      >
                        <UInput
                          v-model="form.email"
                          type="email"
                          icon="i-lucide-mail"
                          placeholder="you@example.com"
                          class="w-full"
                          :class="{
                            'border-red-500 focus:border-red-500': errors.email,
                          }"
                          @blur="validateField('email')"
                          @update:model-value="clearFieldError('email')"
                        />
                      </UFormField>

                      <UFormField
                        label="WhatsApp / Phone (optional)"
                        :error="errors.phone"
                        class="flex-1"
                      >
                        <UInput
                          v-model="form.phone"
                          icon="i-lucide-phone"
                          placeholder="+254 700 000 000"
                          class="w-full"
                          :class="{
                            'border-red-500 focus:border-red-500': errors.phone,
                          }"
                          @blur="validateField('phone')"
                          @update:model-value="clearFieldError('phone')"
                        />
                        <p class="text-xs text-muted mt-1">
                          Include country code
                        </p>
                      </UFormField>
                    </div>

                    <!-- Academic Information -->
                    <div
                      class="flex items-center gap-2 border-b border-primary pb-2 mt-4"
                    >
                      <UIcon
                        name="i-lucide-graduation-cap"
                        class="text-primary"
                      />
                      <h3 class="text-lg font-semibold">
                        Academic Information
                      </h3>
                    </div>

                    <div class="flex flex-col md:flex-row gap-3">
                      <UFormField
                        label="Course/Program"
                        required
                        :error="errors.program"
                        class="flex-1"
                      >
                        <USelectMenu
                          v-model="form.program"
                          :items="programs"
                          create-item
                          value-key="value"
                          label-key="label"
                          @create="onProgramCreate"
                          icon="i-lucide-graduation-cap"
                          placeholder="Select program"
                          class="w-full"
                          :class="{ 'border-red-500': errors.program }"
                          @update:model-value="clearFieldError('program')"
                        />
                      </UFormField>

                      <UFormField
                        label="Year of Study"
                        required
                        :error="errors.year"
                        class="flex-1"
                      >
                        <USelect
                          v-model="form.year"
                          :items="years"
                          icon="i-lucide-graduation-cap"
                          placeholder="Select year"
                          class="w-full"
                          :class="{ 'border-red-500': errors.year }"
                          @update:model-value="clearFieldError('year')"
                        />
                      </UFormField>
                    </div>

                    <!-- Technical Skills -->
                    <div
                      class="flex items-center gap-2 border-b border-primary pb-2 mt-4"
                    >
                      <UIcon name="i-lucide-code" class="text-primary" />
                      <h3 class="text-lg font-semibold">
                        Technical Skills
                        <span class="text-sm text-red-500">*</span>
                      </h3>
                    </div>

                    <div class="flex flex-wrap gap-2">
                      <UButton
                        v-for="skill in allTechSkills"
                        :key="skill"
                        size="sm"
                        :variant="
                          form.techSkills?.includes(skill) ? 'solid' : 'outline'
                        "
                        :color="
                          form.techSkills?.includes(skill)
                            ? 'primary'
                            : 'neutral'
                        "
                        @click="toggleSkill(skill)"
                        class="transition-all duration-200"
                      >
                        <UIcon
                          v-if="form.techSkills?.includes(skill)"
                          name="i-lucide-check"
                          class="mr-1"
                        />
                        {{ skill }}
                      </UButton>
                    </div>
                    <p
                      v-if="errors.techSkills"
                      class="text-danger text-sm mt-1"
                    >
                      {{ errors.techSkills }}
                    </p>

                    <!-- Areas of Interest -->
                    <div
                      class="flex items-center gap-2 border-b border-primary pb-2 mt-4"
                    >
                      <UIcon name="i-lucide-heart" class="text-primary" />
                      <h3 class="text-lg font-semibold">
                        Areas of Interest
                        <span class="text-sm text-red-500">*</span>
                      </h3>
                    </div>

                    <div class="flex flex-wrap gap-2">
                      <UButton
                        v-for="interest in allInterests"
                        :key="interest"
                        size="sm"
                        :variant="
                          form.interests?.includes(interest)
                            ? 'solid'
                            : 'outline'
                        "
                        :color="
                          form.interests?.includes(interest)
                            ? 'primary'
                            : 'neutral'
                        "
                        @click="toggleInterest(interest)"
                        class="transition-all duration-200"
                      >
                        <UIcon
                          v-if="form.interests?.includes(interest)"
                          name="i-lucide-check"
                          class="mr-1"
                        />
                        {{ interest }}
                      </UButton>
                    </div>
                    <p v-if="errors.interests" class="text-danger text-sm mt-1">
                      {{ errors.interests }}
                    </p>

                    <!-- Portfolio & Links -->
                    <div
                      class="flex items-center gap-2 border-b border-primary pb-2 mt-4"
                    >
                      <UIcon name="i-lucide-link" class="text-primary" />
                      <h3 class="text-lg font-semibold">Portfolio & Links</h3>
                    </div>

                    <UFormField
                      label="GitHub Profile (Optional)"
                      :error="errors.github"
                    >
                      <UInput
                        v-model="form.github"
                        icon="i-lucide-github"
                        placeholder="https://github.com/username"
                        class="w-full"
                        :class="{
                          'border-red-500 focus:border-red-500': errors.github,
                        }"
                        @blur="validateField('github')"
                        @update:model-value="clearFieldError('github')"
                      />
                    </UFormField>

                    <UFormField
                      label="Portfolio Website (Optional)"
                      :error="errors.portfolio"
                    >
                      <UInput
                        v-model="form.portfolio"
                        icon="i-lucide-globe"
                        placeholder="https://example.com"
                        class="w-full"
                        :class="{
                          'border-red-500 focus:border-red-500':
                            errors.portfolio,
                        }"
                        @blur="validateField('portfolio')"
                        @update:model-value="clearFieldError('portfolio')"
                      />
                    </UFormField>

                    <!-- Personal Statement -->
                    <div
                      class="flex items-center gap-2 border-b border-primary pb-2 mt-4"
                    >
                      <UIcon
                        name="i-lucide-message-square"
                        class="text-primary"
                      />
                      <h3 class="text-lg font-semibold">
                        Tell Us About Yourself
                      </h3>
                    </div>

                    <UFormField
                      label="Why do you want to join MUT Tech Club?"
                      required
                      :error="errors.message"
                    >
                      <UTextarea
                        v-model="form.message"
                        icon="i-lucide-message-square"
                        placeholder="Share your passion, goals, and what you hope to achieve..."
                        autoresize
                        class="w-full"
                        :class="{
                          'border-red-500 focus:border-red-500': errors.message,
                        }"
                        :rows="5"
                        @blur="validateField('message')"
                        @update:model-value="clearFieldError('message')"
                      />
                      <p class="text-xs text-muted mt-1">
                        Minimum 50 characters
                      </p>
                    </UFormField>

                    <!-- Submit Button -->
                    <UButton
                      type="submit"
                      :icon="
                        stateStore.isSubmitting
                          ? 'i-lucide-loader-circle'
                          : 'i-lucide-send'
                      "
                      size="lg"
                      class="justify-center mt-4"
                      :loading="stateStore.isSubmitting"
                      :disabled="
                        stateStore.isSubmitting ||
                        Object.keys(errors).length > 0
                      "
                    >
                      {{
                        stateStore.isSubmitting
                          ? "Submitting Application..."
                          : "Submit Application"
                      }}
                    </UButton>

                    <!-- Success Message -->
                    <Transition
                      enter-active-class="transition duration-300 ease-out"
                      enter-from-class="transform scale-95 opacity-0"
                      enter-to-class="transform scale-100 opacity-100"
                      leave-active-class="transition duration-200 ease-in"
                      leave-from-class="transform scale-100 opacity-100"
                      leave-to-class="transform scale-95 opacity-0"
                    >
                      <p
                        v-if="stateStore.submitSuccess"
                        class="text-success mt-2 flex items-center gap-2"
                      >
                        <UIcon name="i-lucide-check-circle" class="text-xl" />
                        Application submitted successfully! We'll review it and
                        get back to you within 3-5 business days.
                      </p>
                    </Transition>

                    <!-- Error Message -->
                    <Transition
                      enter-active-class="transition duration-300 ease-out"
                      enter-from-class="transform scale-95 opacity-0"
                      enter-to-class="transform scale-100 opacity-100"
                      leave-active-class="transition duration-200 ease-in"
                      leave-from-class="transform scale-100 opacity-100"
                      leave-to-class="transform scale-95 opacity-0"
                    >
                      <p
                        v-if="stateStore.submitError"
                        class="text-danger mt-2 flex items-center gap-2"
                      >
                        <UIcon name="i-lucide-alert-circle" class="text-xl" />
                        {{ stateStore.submitError }}
                      </p>
                    </Transition>
                  </form>
                </UCard>
              </section>
            </template>

            <template #verify>
              <VerifyEmail
                :email="form?.email || ''"
                @success="activeStep = 2"
              />
            </template>

            <template #pay>
              <PaymentCard
                :amount="100"
                :email="form?.email"
                :phone="form?.phone || null"
                reference="ORDER-123"
              />
            </template>
          </UStepper>
        </template>
      </section>
    </section>

    <!-- WHAT HAPPENS NEXT SECTION -->
    <section
      id="next-steps"
      class="bg-muted/20 py-20 scroll-mt-20"
      aria-label="Application next steps"
    >
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-12" data-aos="fade-up">
          <h2 class="text-3xl md:text-4xl font-bold tracking-tight">
            What Happens Next?
          </h2>
          <p class="mt-3 text-muted max-w-2xl mx-auto">
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
            class="text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div
              class="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg"
            >
              {{ index + 1 }}
            </div>
            <h3 class="font-semibold text-lg">{{ step.title }}</h3>
            <p class="text-sm text-muted mt-2">{{ step.description }}</p>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Error Modal -->
    <UModal v-model:open="showModal" title="Application Error">
      <template #body>
        <div class="flex flex-col items-center gap-4 py-4">
          <UIcon name="i-lucide-alert-circle" class="text-6xl text-danger" />
          <p class="text-center text-muted">
            {{
              errorMessage ||
              "An unexpected error occurred while submitting your application."
            }}
          </p>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex justify-end gap-3">
          <UButton
            label="Reset Form"
            color="neutral"
            variant="outline"
            @click="
              resetForm();
              close();
            "
          />
          <UButton label="Try Again" color="primary" @click="close()" />
        </div>
      </template>
    </UModal>

    <!-- Success Modal -->
    <UModal v-model:open="showSuccessModal" title="Application Submitted!">
      <template #body>
        <div class="flex flex-col items-center gap-4 py-4">
          <UIcon name="i-lucide-check-circle" class="text-6xl text-success" />
          <h3 class="text-xl font-semibold">Thank You for Applying!</h3>
          <p class="text-center text-muted">
            Your application has been received. Our team will review it and
            contact you within 3-5 business days.
          </p>
          <div class="bg-primary/10 p-4 rounded-lg w-full mt-2">
            <p class="text-sm text-center">
              <span class="font-semibold">Next steps:</span> Check your email
              for confirmation and updates.
            </p>
          </div>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex justify-end">
          <UButton
            label="Close"
            color="success"
            variant="subtle"
            @click="
              close();
              resetForm();
            "
          />
        </div>
      </template>
    </UModal>

    <UModal v-model:open="submitting" :dismissible="false">
      <template #content>
        <div class=" ">
          <TechLoader />
        </div>
      </template>
    </UModal>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from "vue";
import * as v from "valibot";

const items: StepperItem[] = [
  {
    title: "Your Details",
    description: "Enter your information to get started.",
    icon: "i-lucide-user",
    slot: "form" as const,
  },
  {
    title: "Email Verification",
    description: "Check your email and enter the verification code.",
    icon: "i-lucide-mail-check",
    slot: "verify" as const,
  },
  {
    title: "Complete Payment",
    description: "Pay KES 50 to finish your registration.",
    icon: "i-lucide-credit-card",
    slot: "pay" as const,
  },
];

function onProgramCreate(item: string) {
  programs.value.push({ value: item, label: "item" });

  form.value.programe = item;
}

const activeStep = ref(0);

useSeoPage({
  title: `Join MUT Tech Club | ${useAppConfig().site.title}`,
  description:
    "Become part of the MUT Tech Club community. Learn, build projects, collaborate with fellow innovators, and grow your skills in technology at Murang'a University of Technology.",
});

const sections = [
  { id: "hero", label: "Hero" },
  { id: "application", label: "Application" },
  { id: "benefits-f", label: "Benefits" },
  { id: "join", label: "Join" },

  { id: "next-steps", label: "Next Steps" },
];

const stateStore = useStateStore();
const toast = useToast();

const schema = v.object({
  fullName: v.pipe(
    v.string(),
    v.minLength(3, "Full name must be at least 3 characters"),
  ),
  email: v.pipe(v.string(), v.email("Please enter a valid email address")),
  phone: v.optional(
    v.pipe(
      v.string(),
      v.regex(/^\+?[0-9\s\-\(\)]+$/, "Please enter a valid phone number"),
    ),
  ),
  program: v.pipe(v.string(), v.minLength(1, "Please select your program")),
  year: v.pipe(v.string(), v.minLength(1, "Please select your year of study")),
  techSkills: v.optional(v.array(v.string())),
  interests: v.optional(v.array(v.string())),
  github: v.optional(
    v.pipe(
      v.string(),
      v.regex(
        /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/,
        "Please enter a valid GitHub URL",
      ),
    ),
  ),
  portfolio: v.optional(
    v.pipe(
      v.string(),
      v.regex(
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        "Please enter a valid URL",
      ),
    ),
  ),
  message: v.pipe(
    v.string(),
    v.minLength(
      20,
      "Please write at least 20 characters explaining why you want to join",
    ),
  ),
});

type Schema = v.InferOutput<typeof schema>;

const form = computed({
  get: () => stateStore.join,
  set: (val) => (stateStore.join = val),
});

const errors = reactive<Partial<Record<keyof Schema, string>>>({});

function validateField(field: keyof Schema) {
  const value = form.value[field];
  try {
    v.parse(schema.entries[field], value);
    delete errors[field];
  } catch (error) {
    if (error instanceof v.ValiError) {
      errors[field] = error.issues[0]?.message || "Invalid field";
    }
  }
}

function validateAll() {
  let isValid = true;
  (Object.keys(schema.entries) as Array<keyof Schema>).forEach((field) => {
    try {
      v.parse(schema.entries[field], form.value[field]);
      delete errors[field];
    } catch (error) {
      if (error instanceof v.ValiError) {
        errors[field] = error.issues[0]?.message || "Invalid field";
        isValid = false;
      }
    }
  });
  return isValid;
}

function clearFieldError(field: keyof Schema) {
  delete errors[field];
}

function resetForm() {
  stateStore.resetJoinForm();
  Object.keys(errors).forEach((key) => delete errors[key as keyof Schema]);
}

const stats = [
  {
    icon: "i-lucide-group",
    iconClass: "text-primary",
    label: "500+ Active Members",
  },
  {
    icon: "i-lucide-check",
    iconClass: "text-green-500",
    label: "Industry Mentors",
  },
  {
    icon: "i-lucide-star",
    iconClass: "text-yellow-400",
    label: "Real Projects",
  },
];

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

const years = [
  { value: "1", label: "Year 1" },
  { value: "2", label: "Year 2" },
  { value: "3", label: "Year 3" },
  { value: "4", label: "Year 4" },
  { value: "alumni", label: "Alumni" },
  { value: "other", label: "Other" },
];

const programs = ref([
  { value: "cs", label: "Computer Science" },
  { value: "it", label: "Information Technology" },
  { value: "electronics", label: "Electronics" },
  { value: "se", label: "Software Engineering" },
  { value: "other", label: "Other" },
]);

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

const showModal = ref(false);
const errorMessage = ref<string | null>(null);
const showSuccessModal = ref(false);
const submitting = ref(false);

function toggleSkill(skill: string) {
  form.value.techSkills = form.value.techSkills || [];
  form.value.techSkills = form.value.techSkills.includes(skill)
    ? form.value.techSkills.filter((s) => s !== skill)
    : [...form.value.techSkills, skill];

  if (form.value.techSkills.length > 0) {
    delete errors.techSkills;
  }
}

function toggleInterest(interest: string) {
  form.value.interests = form.value.interests || [];
  form.value.interests = form.value.interests.includes(interest)
    ? form.value.interests.filter((i) => i !== interest)
    : [...form.value.interests, interest];

  if (form.value.interests.length > 0) {
    delete errors.interests;
  }
}

async function validateAndSubmit() {
  submitting.value = true;
  if (!validateAll()) {
    toast.add({
      title: "Validation Error",
      description: "Please fix the errors in the form before submitting",
      color: "warning",
      icon: "i-lucide-alert-circle",
    });

    const firstError = Object.keys(errors)[0];
    if (firstError) {
      const element = document.querySelector(`[name="${firstError}"]`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    submitting.value = false;
    return;
  }

  try {
    const response = await stateStore.submitJoinForm();
    showSuccessModal.value = true;
    activeStep.value = 1;
    toast.add({
      title: "Application Submitted!",
      description:
        "Your application has been received,verify email to Create  account!",
      color: "success",
      icon: "i-lucide-check-circle",
    });
  } catch (error: any) {
    if (error.validationErrors) {
      toast.add({
        title: "Validation Error",
        description: error.message || "Please check your form inputs",
        color: "warning",
        icon: "i-lucide-alert-circle",
      });

      if (error.validationErrors) {
        Object.assign(errors, error.validationErrors);
      }
    } else {
      errorMessage.value =
        error?.message ||
        "An error occurred while submitting your application.";
      showModal.value = true;
      toast.add({
        title: "Submission Failed",
        description: errorMessage.value,
        color: "error",
        icon: "i-lucide-alert-circle",
      });
    }
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
