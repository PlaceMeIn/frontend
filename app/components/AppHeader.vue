<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
const screen = useScreenSize();

defineProps<{
  links: NavigationMenuItem[];
}>();

const route = useRoute();

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Home",
    to: "/",
    active: route.path === "/",
    icon: screen.isMobile.value ? "i-heroicons-home-solid" : undefined,
  },
  {
    label: "About",
    to: "/about",
    active: route.path.startsWith("/about"),
    icon: screen.isMobile.value
      ? "i-heroicons-information-circle-solid"
      : undefined,
  },
  {
    label: "Projects",
    to: "/projects",
    active: route.path.startsWith("/projects"),
    icon: screen.isMobile.value ? "i-heroicons-code-solid" : undefined,
  },
  {
    label: "Events",
    to: "/events",
    active: route.path.startsWith("/events"),
    icon: screen.isMobile.value ? "i-heroicons-calendar-solid" : undefined,
  },
  {
    label: "Leadership",
    to: "/leadership",
    active: route.path.startsWith("/leadership"),
    icon: screen.isMobile.value ? "i-heroicons-users-solid" : undefined,
  },
  {
    label: "Resources",
    to: "/resources",
    active: route.path.startsWith("/resources"),
    icon: screen.isMobile.value ? "i-heroicons-document-text-solid" : undefined,
  },
  {
    label: "More",
    icon: "i-lucide-more-horizontal",
    children: [
      {
        label: "Contact",
        to: "/contact",
        active: route.path.startsWith("/contact"),
        icon: "i-heroicons-phone-solid",
        description:
          "Get in touch with us for any inquiries or collaborations.",
      },

      {
        label: "community",
        description:
          "Join our community of developers and stay updated with the latest news and events.",
        icon: "i-lucide-users",
        to: "/community",
      },
      {
        label: "Gallery",
        description:
          "Explore our gallery to see photos and videos from our past events and projects.",
        icon: "i-lucide-image",
        to: "/gallery",
      },
      {
        label: "Reviews",
        icon: "i-lucide-star",
        description:
          "Read reviews from our members and see what they have to say about their experience with our club.",
        to: "/reviews",
      },
      {
        label: "Support",
        icon: "i-lucide-life-buoy",
        description:
          "Need help? Contact our support team for assistance with any issues or questions you may have.",
        to: "/support",
      },
      {
        label: "Suggestion",
        description:
          "We would love to hear your thoughts and suggestions to improve our club.",
        to: "/suggestion",
        icon: "i-lucide-message-square",
      },
      {},
    ],
  },
]);
</script>

<!-- mode="drawer" -->
<!-- mode="slideover" -->

<template>
  <UHeader
    mode="slideover"
    title="MUT Tech Club"
    class="z-9999 border-b border-gray-200 dark:border-gray-800"
  >
    <template #title>
      <AppLogo :size="3" class="h-6 w-auto" />
    </template>

    <UNavigationMenu :items="items" class="hidden md:flex" />

    <template #right>
      <ColorModeButton class="hidden md:block mr-2" />

      <JoinMutButton />
    </template>

    <!-- Drawer body for mobile menu -->
    <template #body>
      <div class="flex flex-col space-y-2 p-4">
        <UNavigationMenu
          :items="items"
          variant="link"
          color="neutral"
          orientation="vertical"
          class="-mx-2.5"
        />
        <ColorModeButton class="mt-2" />
        <JoinMutButton :showName="true" :isHeaderOpen="true" />
      </div>
    </template>
  </UHeader>
  <!-- <div class="border w-full fixed top-2 sm:top-4 mx-auto left-1/2 transform -translate-x-1/2 z-10">

    <UNavigationMenu
      :items="links"
      variant="link"
      color="neutral"
      class="bg-muted/80 backdrop-blur-sm rounded-full px-2 sm:px-4 border border-muted/50 shadow-lg shadow-neutral-950/5"
      :ui="{
        link: 'px-2 py-1',
        linkLeadingIcon: 'hidden'
      }"
    >
      <template #list-trailing>
        <ColorModeButton />
      </template>
    </UNavigationMenu>
  </div> -->
</template>
