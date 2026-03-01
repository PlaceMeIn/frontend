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
    <section class="flex flex-col md:flex-row md:items-start md:gap-12 max-w-7xl mx-auto px-6 py-20">

      <!-- CONTACT INFO -->
      <section class="md:w-1/2 flex flex-col gap-10 mb-16 md:mb-0">
        <h1 class="text-4xl font-bold tracking-tight">Contact Information</h1>
        <p class="mt-2 text-lg text-muted max-w-lg">
          Reach out to us through any of these channels. We typically respond within 24 hours.
        </p>

        <div class="flex flex-col gap-10 mt-10 text-center md:text-left" data-aos="fade-up">
          <div
            v-for="(item, i) in contactInfo"
            :key="item.name"
            class="flex flex-col items-center md:items-start gap-3"
            :data-aos-delay="i * 100"
          >
            <UIcon :name="item.icon" class="text-primary text-2xl" />
            <h3 class="font-semibold text-lg capitalize">{{ item?.name || "?" }}</h3>
            <div class="flex flex-col gap-1 text-muted text-sm">
              <span v-for="(entry, index) in item?.data" :key="index">{{ entry || "?" }}</span>
            </div>
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
          <form class="flex flex-col gap-6" @submit.prevent="submit">
            <UFormField label="Full Name" required>
              <UInput v-model="form.fullname" icon="i-lucide-user" placeholder="John Doe" />
            </UFormField>

            <UFormField label="Email Address" required>
              <UInput v-model="form.email" type="email" icon="i-lucide-mail" placeholder="you@example.com" />
            </UFormField>

            <UFormField label="WhatsApp / Phone (optional)">
              <UInput v-model="form.phone" icon="i-lucide-phone" placeholder="+254..." />
            </UFormField>

            <UFormField label="Year of Study">
              <USelect v-model="form.year" :items="years" icon="i-lucide-graduation-cap" placeholder="Select year" />
            </UFormField>

            <UFormField label="Subject" required>
              <USelect v-model="form.subject" :items="subjects" icon="i-lucide-folder" placeholder="Select subject" />
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

            <UButton type="submit" icon="i-lucide-send" size="lg" class="justify-center">
              Send Message
            </UButton>
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
  </section>
</template>


<script setup lang="ts">
import type { AccordionItem } from "@nuxt/ui";

const config = useAppConfig();

useSeoPage({
  title: `Contact ${config.site.title}`,
  description: "Contact MUT Tech Club for collaborations, joining, or support.",
});

/* FORM STATE */
const form = reactive({
  fullname: "",
  email: "",
  phone: "",
  year: "",
  subject: "",
  message: "",
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

/* SUBMIT */
function submit() {
  console.log("form:", form);

  // integrate API here
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
