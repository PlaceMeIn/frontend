<template>
  <div class="mx-auto max-w-md p-2">
    <h2 class="mb-6 text-3xl font-bold">Set up Login Option</h2>

    <div v-for="(option, index) in loginOptions" :key="index" class="space-y-4">
      <!-- Manual Password Setup Form -->
      <div v-if="option.type === 'manual'" class="w-full">
        <SetUpPassword />
      </div>

      <!-- Social Login -->
      <UButton
        v-else
        :disabled="!option.link"
        :label="option.label"
        :icon="option.icon"
        block
        class="justify-center"
        @click="handleSocialLogin(option.type)"
      />

      <USeparator v-if="index < loginOptions.length - 1" label="or" class="my-4" />
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: "auth" });

const authStore = useAuthStore()
const endpoints = useEndpoints()
// Login options
const loginOptions = ref([
  {
    type: "google",
    label: "Continue with Google",
    link: endpoints.auth.loginWithGoogle,
    icon: "i-logos-google-icon",
  },
  {
    type: "manual",
    label: "Set up Password",
    link: "",
    icon: "i-heroicons-lock-closed",
  },
]);

// Methods
const handleSocialLogin = (type: string) => {
  if (type === "google") authStore.handleGoogleLogin();
};

</script>