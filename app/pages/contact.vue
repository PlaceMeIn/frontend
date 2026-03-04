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
            class="p-4 bg-primary-500/10 dark:bg-primary-500/5 flex gap-3 rounded-lg items-start"
            :data-aos="'fade-up'"
            :data-aos-delay="i * 100"
          >
            <UIcon :name="item.icon" class="text-primary text-2xl" />
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
              class="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
            >
              <UIcon :name="link.icon" class="text-2xl" />
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
          <form class="flex flex-col gap-6" @submit.prevent="submitForm">
            <UFormField label="Full Name" required>
              <UInput
                v-model="form.fullname"
                icon="i-lucide-user"
                placeholder="John Doe"
                class="w-full"
              />
            </UFormField>

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

            <UFormField label="Year of Study">
              <USelect
                v-model="form.year"
                :items="years"
                icon="i-lucide-graduation-cap"
                placeholder="Select year"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Subject" required>
              <USelect
                v-model="form.subject"
                :items="subjects"
                icon="i-lucide-folder"
                placeholder="Select subject"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Message" required>
              <UTextarea
                v-model="form.message"
                icon="i-lucide-message-square"
                placeholder="Type your message..."
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
              Send Message
            </UButton>

            <p v-if="stateStore.submitSuccess" class="text-success mt-2">
              Message sent successfully!
            </p>
            <p v-if="stateStore.submitError" class="text-danger mt-2">
              {{ stateStore.submitError }}
            </p>
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

<section
  class="w-full py-24 
         bg-gradient-to-tr 
         from-primary-600/10 via-transparent to-primary-400/10
         dark:from-primary-900/20 dark:via-transparent dark:to-primary-800/20"
  data-aos="fade-up"
>
  <div class="max-w-6xl mx-auto px-6">

    <!-- Section Header -->
    <div class="mb-12 text-center">
      <h2 class="text-3xl md:text-4xl font-bold tracking-tight 
                 text-gray-900 dark:text-white">
        Visit Our Office
      </h2>
      <p class="mt-3 text-gray-600 dark:text-gray-400">
        We’d love to see you. Here are our operating hours.
      </p>
    </div>

    <!-- Cards -->
    <div class="grid md:grid-cols-2 gap-8">

      <!-- During Semester -->
      <div
        class="p-8 rounded-2xl
               bg-white/70 dark:bg-white/5
               backdrop-blur-xl
               border border-gray-200/50 dark:border-white/10
               shadow-lg dark:shadow-none
               hover:shadow-xl dark:hover:bg-white/10
               transition duration-300"
      >
        <h3 class="text-xl font-semibold mb-4 
                   text-primary-600 dark:text-primary-400">
          During Semester
        </h3>
        <ul class="space-y-2 text-gray-700 dark:text-gray-300">
          <li>Monday – Friday: 9:00 AM – 5:00 PM</li>
          <li>Saturday: 10:00 AM – 2:00 PM</li>
          <li>Sunday: Closed</li>
        </ul>
      </div>

      <!-- Holidays / Breaks -->
      <div
        class="p-8 rounded-2xl
               bg-white/70 dark:bg-white/5
               backdrop-blur-xl
               border border-gray-200/50 dark:border-white/10
               shadow-lg dark:shadow-none
               hover:shadow-xl dark:hover:bg-white/10
               transition duration-300"
      >
        <h3 class="text-xl font-semibold mb-4 
                   text-primary-600 dark:text-primary-400">
          Holidays / Breaks
        </h3>
        <ul class="space-y-2 text-gray-700 dark:text-gray-300">
          <li>Monday – Friday: 10:00 AM – 3:00 PM</li>
          <li>Saturday – Sunday: Closed</li>
          <li class="text-sm text-gray-500 dark:text-gray-400">
            *Virtual office hours available
          </li>
        </ul>
      </div>

    </div>

    <!-- Location -->
    <div class="mt-12 text-center">
      <p class="text-gray-700 dark:text-gray-400">
                <UIcon name="i-lucide-map-pin" />

        Tech Hub, Ground Floor, Main Campus Building
      </p>
    </div>

  </div>
</section>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { AccordionItem } from "@nuxt/ui";

const stateStore = useStateStore();

/* FORM STATE */
const form = computed({
  get: () => stateStore.ongoingContact,
  set: (value) => (stateStore.ongoingContact = value),
});

/* OPTIONS */
const years = ["Year 1", "Year 2", "Year 3", "Year 4", "Alumni", "Other"];
const subjects = [
  "Join the club",
  "Partnership",
  "Event inquiry",
  "Technical support",
  "Mentorship",
  "General question",
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

function submitForm() {
  stateStore.submitContactForm();
}

/* FAQ */
const faqs = ref<AccordionItem[]>([
  {
    label: "How can I join MUT Tech Club?",
    content: "Join via onboarding sessions or WhatsApp groups.",
  },
  {
    label: "Do I need experience?",
    content: "No. Beginners and experienced members are welcome.",
  },
  {
    label: "How can organizations collaborate?",
    content: "Contact us via this form or email.",
  },
]);
</script>
