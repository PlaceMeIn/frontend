<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

defineProps<{
  links: NavigationMenuItem[];
}>();

const route = useRoute();

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Home",
    to: "/",
    active: route.path === "/"
  },
  {
    label: "About",
    to: "/about",
    active: route.path.startsWith("/about")
  },
  {
    label: "Projects",
    to: "/projects",
    active: route.path.startsWith("/projects")
  },
  {
    label: "Events",
    to: "/events",
    active: route.path.startsWith("/events")
  },
  {
    label: "Leadership",
    to: "/leadership",
    active: route.path.startsWith("/leadership")
  },
  {
    label: "Resources",
    to: "/resources",
    active: route.path.startsWith("/resources")
  },
  {
    label: "Contact",
    to: "/contact",
    active: route.path.startsWith("/contact")
  }
]);

</script>

<template>
  <UHeader mode="drawer"  title="MUT Tech Club" class="z-9999 border">
    <template #title>
      <AppLogo :size="3" class="h-6 w-auto" />
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <ColorModeButton />
      <UButton label="Join the CLub" to="/join"/>
    </template>

    <template #body>
      <UNavigationMenu :items="items" variant="link" color="neutral" orientation="vertical" class="-mx-2.5" />
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
