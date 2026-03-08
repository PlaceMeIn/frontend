<template>
  <section>
    <!-- HERO -->
    <section
      class="relative h-[420px] flex flex-col items-center justify-center text-center bg-gradient-to-br from-primary-500/30 to-primary-900/30"
      data-aos="fade-down"
    >
      <h1 class="text-5xl font-bold tracking-tight">Get in Touch</h1>
      <p class="mt-4 text-lg text-muted max-w-xl">
        Have questions? Want to collaborate? We'd love to hear from you.
      </p>
    </section>

    <!-- CONTACT SECTION -->
    <section
      class="flex flex-col md:flex-row md:items-start md:gap-12 max-w-7xl mx-auto px-6 py-20"
    >
      <!-- CONTACT INFO + SOCIAL LINKS -->
      <section class="md:w-1/2 flex flex-col gap-6 mb-16 md:mb-0">
        <div data-aos="fade-up">
          <h2 class="text-4xl font-bold tracking-tight">Contact Information</h2>
          <p class="mt-2 text-lg text-muted max-w-lg">
            Reach out to us through any of these channels. We typically respond
            within 24 hours.
          </p>
        </div>

        <div class="flex flex-col gap-4 mt-6">
          <div
            v-for="(item, i) in contactInfo"
            :key="item.name"
            class="p-4 bg-primary-500/10 dark:bg-primary-500/5 flex gap-3 rounded-lg items-start hover:bg-primary-500/15 transition-colors duration-300"
            :data-aos="'fade-up'"
            :data-aos-delay="i * 100"
          >
            <UIcon :name="item.icon" class="text-primary text-2xl shrink-0" />
            <div>
              <h3 class="font-semibold text-lg capitalize">{{ item.name }}</h3>
              <div class="flex flex-col gap-1 text-muted text-sm">
                <span v-for="(entry, index) in item.data" :key="index">{{
                  entry
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- SOCIAL LINKS -->
        <div
          class="flex flex-col gap-2 mt-6"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <h3 class="font-semibold text-lg">Follow us on social media</h3>
          <div class="flex flex-row flex-wrap gap-4 mt-2">
            <a
              v-for="(link, index) in socialLinks"
              :key="index"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-500/5 hover:bg-primary-500/10 transition-colors duration-300"
            >
              <UIcon :name="link.icon" class="text-2xl text-primary" />
              <span class="text-sm font-medium">{{
                link.username || link.name
              }}</span>
            </a>
          </div>
        </div>
      </section>

      <!-- CONTACT FORM -->
      <section class="md:w-1/2 w-full max-w-md mx-auto">
        <div class="text-center mb-10" data-aos="fade-up">
          <h2 class="text-3xl font-bold">Send us a message</h2>
          <p class="text-muted mt-2">We'll respond as soon as possible</p>
        </div>

        <UCard data-aos="fade-up" data-aos-delay="100">
          <form @submit.prevent="validateAndSubmit" class="flex flex-col gap-6">
            <!-- Full Name Field -->
            <UFormField label="Full Name" required :error="errors.fullname">
              <UInput
                v-model="form.fullname"
                icon="i-lucide-user"
                placeholder="John Doe"
                class="w-full"
                :class="{
                  'border-red-500 focus:border-red-500': errors.fullname,
                }"
                @blur="validateField('fullname')"
                @update:model-value="clearFieldError('fullname')"
              />
            </UFormField>

            <!-- Email Field -->
            <UFormField label="Email Address" required :error="errors.email">
              <UInput
                v-model="form.email"
                type="email"
                icon="i-lucide-mail"
                placeholder="you@example.com"
                class="w-full"
                :class="{ 'border-red-500 focus:border-red-500': errors.email }"
                @blur="validateField('email')"
                @update:model-value="clearFieldError('email')"
              />
            </UFormField>

            <!-- Phone Field -->
            <UFormField
              label="WhatsApp / Phone (optional)"
              :error="errors.phone"
            >
              <UInput
                v-model="form.phone"
                icon="i-lucide-phone"
                placeholder="+254 700 000 000"
                class="w-full"
                :class="{ 'border-red-500 focus:border-red-500': errors.phone }"
                @blur="validateField('phone')"
                @update:model-value="clearFieldError('phone')"
              />
              <p class="text-xs text-muted mt-1">
                Include country code (e.g., +254)
              </p>
            </UFormField>

            <!-- Year of Study Field -->
            <UFormField label="Year of Study" :error="errors.year">
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

            <!-- Subject Field -->
            <UFormField label="Subject" required :error="errors.subject">
              <USelect
                v-model="form.subject"
                :items="subjects"
                value-key="value"
                label-key="label"
                icon="i-lucide-folder"
                placeholder="Select subject"
                class="w-full"
                :class="{ 'border-red-500': errors.subject }"
                @update:model-value="clearFieldError('subject')"
              />
            </UFormField>

            <!-- Message Field -->
            <UFormField label="Message" required :error="errors.message">
              <UTextarea
                v-model="form.message"
                icon="i-lucide-message-square"
                placeholder="Type your message..."
                autoresize
                class="w-full"
                :class="{
                  'border-red-500 focus:border-red-500': errors.message,
                }"
                :rows="5"
                @blur="validateField('message')"
                @update:model-value="clearFieldError('message')"
              />
              <p class="text-xs text-muted mt-1">Minimum 10 characters</p>
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
              class="justify-center"
              :loading="stateStore.isSubmitting"
              :disabled="
                stateStore.isSubmitting || Object.keys(errors).length > 0
              "
            >
              {{ stateStore.isSubmitting ? "Sending..." : "Send Message" }}
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
                Message sent successfully! We'll get back to you soon.
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
    </section>

    <!-- FAQ -->
    <section class="max-w-3xl mx-auto px-6 pb-24">
      <div class="text-center mb-10" data-aos="fade-up">
        <h2 class="text-3xl font-bold">Frequently Asked Questions</h2>
        <p class="text-muted mt-2">Quick answers to common questions</p>
      </div>

      <div data-aos="fade-up" data-aos-delay="100">
        <UAccordion :items="faqs" />
      </div>
    </section>

    <!-- Office Hours Section -->
    <section
      class="w-full py-24 bg-gradient-to-tr from-primary-600/10 via-transparent to-primary-400/10 dark:from-primary-900/20 dark:via-transparent dark:to-primary-800/20"
      data-aos="fade-up"
    >
      <div class="max-w-6xl mx-auto px-6">
        <div class="mb-12 text-center">
          <h2 class="text-3xl md:text-4xl font-bold tracking-tight">
            Visit Our Office
          </h2>
          <p class="mt-3 text-muted">
            We'd love to see you. Here are our operating hours.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- During Semester -->
          <div
            class="p-8 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <h3
              class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400 flex items-center gap-2"
            >
              <UIcon name="i-lucide-calendar" class="text-2xl" />
              During Semester
            </h3>
            <ul class="space-y-2 text-muted">
              <li class="flex items-center gap-2">
                <UIcon name="i-lucide-clock" class="text-sm" />
                Monday – Friday: 9:00 AM – 5:00 PM
              </li>
              <li class="flex items-center gap-2">
                <UIcon name="i-lucide-clock" class="text-sm" />
                Saturday: 10:00 AM – 2:00 PM
              </li>
              <li class="flex items-center gap-2 text-danger">
                <UIcon name="i-lucide-clock" class="text-sm" />
                Sunday: Closed
              </li>
            </ul>
          </div>

          <!-- Holidays / Breaks -->
          <div
            class="p-8 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <h3
              class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400 flex items-center gap-2"
            >
              <UIcon name="i-lucide-calendar" class="text-2xl" />
              Holidays / Breaks
            </h3>
            <ul class="space-y-2 text-muted">
              <li class="flex items-center gap-2">
                <UIcon name="i-lucide-clock" class="text-sm" />
                Monday – Friday: 10:00 AM – 3:00 PM
              </li>
              <li class="flex items-center gap-2 text-danger">
                <UIcon name="i-lucide-clock" class="text-sm" />
                Saturday – Sunday: Closed
              </li>
              <li class="text-sm text-muted/70 mt-2 flex items-center gap-1">
                <UIcon name="i-lucide-info" class="text-sm" />
                *Virtual office hours available
              </li>
            </ul>
          </div>
        </div>

        <!-- Location -->
        <div class="mt-12 text-center">
          <p class="text-muted flex items-center justify-center gap-2">
            <UIcon name="i-lucide-map-pin" class="text-primary" />
            Tech Hub, Ground Floor, Main Campus Building
          </p>
        </div>
      </div>
    </section>
  </section>

  <!-- Error Modal -->
  <UModal v-model:open="showModal" title="Error submitting form">
    <template #body>
      <div class="flex flex-col items-center gap-4 py-4">
        <UIcon name="i-lucide-alert-circle" class="text-6xl text-danger" />
        <p class="text-center text-muted">
          {{
            errorMessage || "An unexpected error occurred. Please try again."
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
  <UModal v-model:open="showSuccessModal" title="Message Sent Successfully!">
    <template #body>
      <div class="flex flex-col items-center gap-4 py-4">
        <UIcon name="i-lucide-check-circle" class="text-6xl text-success" />
        <p class="text-center text-muted">
          Thank you for reaching out! We've received your message and will get
          back to you within 24 hours.
        </p>
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
    <UModal v-model:open="submitting" dismissible="false">
    <template #content>
      <div class=" ">
        <TechLoader />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from "vue";
import type { AccordionItem } from "@nuxt/ui";
import * as v from "valibot";

const stateStore = useStateStore();
const toast = useToast();

// Validation schema
const schema = v.object({
  fullname: v.pipe(
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
  year: v.optional(v.string()),
  subject: v.pipe(v.string(), v.minLength(1, "Please select a subject")),
  message: v.pipe(
    v.string(),
    v.minLength(10, "Message must be at least 10 characters"),
  ),
});

type Schema = v.InferOutput<typeof schema>;

/* FORM STATE */
const form = computed({
  get: () => stateStore.ongoingContact,
  set: (value) => (stateStore.ongoingContact = value),
});

/* ERROR STATE */
const errors = reactive<Partial<Record<keyof Schema, string>>>({});

/* VALIDATION FUNCTIONS */
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
  stateStore.resetContactForm();
  Object.keys(errors).forEach((key) => delete errors[key as keyof Schema]);
}

/* OPTIONS */
const years = [
  { value: "1", label: "Year 1" },
  { value: "2", label: "Year 2" },
  { value: "3", label: "Year 3" },
  { value: "4", label: "Year 4" },
  { value: "alumni", label: "Alumni" },
  { value: "other", label: "Other" },
];

const subjects = [
  { value: "general", label: "General Inquiry" },
  { value: "partnership", label: "Partnership / Collaboration" },
  { value: "membership", label: "Membership Questions" },
  { value: "event", label: "Event Inquiry" },
  { value: "support", label: "Technical Support" },
  { value: "other", label: "Other" },
];

/* CONTACT INFO */
const contactInfo = [
  {
    name: "email",
    icon: "i-lucide-mail",
    data: ["info@muttechclub.ac.ke", "leadership@muttechclub.ac.ke"],
  },
  {
    name: "phone",
    icon: "i-lucide-phone",
    data: ["+254 700 000 000", "+254 111 111 111"],
  },
  {
    name: "location",
    icon: "i-lucide-map-pin",
    data: ["Murang'a University of Technology", "Murang'a, Kenya"],
  },
];

/* SOCIAL LINKS */
const socialLinks = [
  {
    name: "Facebook",
    username: "muttechclub",
    icon: "i-lucide-facebook",
    url: "https://facebook.com/muttechclub",
  },
  {
    name: "Twitter",
    username: "@muttechclub",
    icon: "i-lucide-twitter",
    url: "https://twitter.com/muttechclub",
  },
  {
    name: "LinkedIn",
    username: "MUT Tech Club",
    icon: "i-lucide-linkedin",
    url: "https://linkedin.com/company/muttechclub",
  },
  {
    name: "GitHub",
    username: "muttechclub",
    icon: "i-lucide-github",
    url: "https://github.com/muttechclub",
  },
];

const showModal = ref(false);
const errorMessage = ref<string | null>(null);
const showSuccessModal = ref(false);
const submitting = ref(false);

async function validateAndSubmit() {
  submitting.value = true;

  if (!validateAll()) {
    toast.add({
      title: "Validation Error",
      description: "Please fix the errors in the form",
      color: "warning",
      icon: "i-lucide-alert-circle",
    });
    submitting.value = false;

    return;
  }

  try {
    submitting.value = true;

    const res = await stateStore.submitContact();
    if (res.success) {
      showSuccessModal.value = true;
      toast.add({
        title: "Success!",
        description: "Your message has been sent successfully",
        color: "success",
        icon: "i-lucide-check-circle",
      });
    }
  } catch (error: any) {
    errorMessage.value =
      error?.message || "Failed to send message. Please try again.";
    showModal.value = true;
    toast.add({
      title: "Error",
      description: errorMessage.value,
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  } finally {
    submitting.value = false;
  }
}

/* FAQ */
const faqs = ref<AccordionItem[]>([
  {
    label: "How can I join MUT Tech Club?",
    content:
      "You can join through our onboarding sessions held at the beginning of each semester. Follow us on social media for announcements, or reach out via our contact form to get added to the WhatsApp group.",
  },
  {
    label: "Do I need experience to join?",
    content:
      "Not at all! We welcome members of all skill levels – from complete beginners to experienced developers. We have mentorship programs and workshops tailored for different experience levels.",
  },
  {
    label: "How can organizations collaborate with the club?",
    content:
      "We're always open to partnerships! Reach out via our contact form with 'Partnership' as the subject, or email us directly at partnerships@muttechclub.ac.ke. We'll get back to you within 2-3 business days.",
  },
  {
    label: "Are there membership fees?",
    content:
      "No, membership is completely free for all MUT students! We believe in making tech education accessible to everyone.",
  },
]);
</script>

<style scoped>
/* Optional: Add custom transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
