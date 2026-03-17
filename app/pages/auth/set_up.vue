<template>
  <div class="p-2 mx-auto max-w-md">
    <div class="text-3xl text-bold space-y-5 my-3">
      <h2>Set up login Option</h2>
    </div>
    <div v-for="(option, index) in loginOptions" :key="index" class="space-y-4">
      <UCard v-if="option.type === 'manual'" class="w-full">
        <UForm :state="formState" @submit="handlePasswordSetup">
          <UFormField label="Password" required name="password">
            <UInput
              v-model="formState.password"
              type="password"
              placeholder="Enter your password"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Confirm Password" required name="confirmPassword">
            <UInput
              v-model="formState.confirmPassword"
              type="password"
              placeholder="Confirm your password"
              class="w-full"
            />
          </UFormField>

          <UButton
            type="submit"
            color="primary"
            :loading="isSubmitting"
            :disabled="!isFormValid"
            block
            class="mt-4"
          >
            Set Password
          </UButton>
        </UForm>
      </UCard>

      <UButton
        v-else
        :disabled="!option.link"
        :label="option.label"
        :icon="option.icon"
        block
        class="justify-center"
        @click="site_login(option.type)"
      />

      <USeparator
        v-if="index < loginOptions.length - 1"
        label="or"
        class="my-4"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useEndpoints } from "~/composables/useEndpoints";
definePageMeta({
  layout: 'auth'
})

interface LoginOption {
  type: "google" | "manual";
  label: string;
  link: string;
  icon?: string;
}

interface FormState {
  password: string;
  confirmPassword: string;
}

const authStore = useAuthStore();
const endpoints = useEndpoints();

const formState = ref<FormState>({
  password: "",
  confirmPassword: "",
});

const isSubmitting = ref(false);

const isFormValid = computed(() => {
  return (
    formState.value.password.length >= 8 &&
    formState.value.password === formState.value.confirmPassword
  );
});

const loginOptions = ref<LoginOption[]>([
  {
    type: "google",
    label: "Continue with Google",
    link: endpoints.auth.loginWithGoogle,
    icon: "i-logos-google-icon",
  },
  {
    type: "manual",
    label: "Set up password",
    link: "",
    icon: "i-heroicons-lock-closed",
  },
]);

function site_login(type: string) {
  if (type === "google") {
    authStore.handleGoogleLogin();
  }
}

const handlePasswordSetup = async () => {
  if (!isFormValid.value) return;

  try {
    isSubmitting.value = true;
    await authStore.setPassword(formState.value.password);
    resetForm();
  } catch (error) {
    console.error("Password setup failed:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  formState.value = {
    password: "",
    confirmPassword: "",
  };
};
</script>
