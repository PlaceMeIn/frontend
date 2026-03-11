<script setup lang="ts">
const columns = [
  {
    label: "QuichLinks",
    children: [
      {
        label: "Home",
        to: "/",
      },
      {
        label: "About",
        to: "/about",
      },
      {
        label: "Projects",
        to: "/projects",
      },
      {
        label: "Events",
        to: "/events",
      },
      {
        label: "Leadership",
        to: "/leadership",
      },
      {
        label: "Gallery & Memories",
        to: "/gallery",
      },
      {
        label: "Reviews",
        to: "/reviews",
      },
      {
        label: "Suggestions",
        to: "/suggestions",
      },
    ],
  },
  {
    label: "Features",
    children: [
      {
        label: "Contests",
        to: "/contests",
      },
      {
        label: "Resources",
        to: "/resources",
      },
      {
        label: "projects",
        to: "/projects",
      },
      {
        label: "Join MUT Tech",
        to: "/join",
      },

      {
        label: "Contact",
        to: "/contact",
      },
    ],
  },
  {
    label: "Contact",
    children: [
      {
        label: "Murang'a University Of Technology",
        to: "",
      },
      {
        label: "P.O.Box 75-10200",
        to: "",
      },
      {
        label: "Murnag'a, Kenya",
        to: "",
      },
      {
        label: "info@muttechclub.ac.ke",
        to: "mailto:info@muttechclub.ac.ke",
      },
    ],
  },
];

const social_links = [
  {
    label: "Github",
    icon: "i-lucide-github",
    link: "https://github.com/yourusername",
  },
  {
    label: "LinkedIn",
    icon: "i-lucide-linkedin",
    link: "https://linkedin.com/in/yourprofile",
  },
  {
    label: "X",
    icon: "i-lucide-x", // X is the new Twitter
    link: "https://x.com/yourprofile",
  },
  {
    label: "Instagram",
    icon: "i-lucide-instagram",
    link: "https://instagram.com/yourprofile",
  },
];
const toast = useToast();
</script>

<template>
  <USeparator icon="i-lucide-code" class="h-px" />

  <UFooter :ui="{ top: 'border-b border-default' }">
    <template #top>
      <UContainer>
        <UFooterColumns :columns="columns">
          <template #left>
            <div>
              <AppLogo :size="5" />
              <p class="font-normal text-muted text-md mt-5">
                Empowering the next generation of innovators, developers, and
                tech leaders at Murang'a University of Technology.
              </p>
              <div class="flex gap-2 mt-5">
                <UButton
                  v-for="(social, index) in social_links"
                  :key="index"
                  :icon="social.icon"
                  :to="social.link"
                  variant="soft"
                  color="neutral"
                />
              </div>
            </div>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <div>
      <p class="text-sm text-muted text-center">
        © {{ new Date().getFullYear() }} MUT Tech Club. All rights reserved.
        <br />
        Developed by VD
      </p>
    </div>
  </UFooter>
</template>
