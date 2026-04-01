<script setup lang="ts"></script>

<template>
  <UApp>
      <NuxtLoadingIndicator class="z-9999999" />

    <AppHeader :links="navLinks" />
    <UMain>
      <NuxtPage />
    </UMain>
    <AppFooter />
  </UApp>
</template>
