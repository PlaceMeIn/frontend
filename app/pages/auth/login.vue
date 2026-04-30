<script setup lang="ts">
import * as v from "valibot";

const toast = useToast();
definePageMeta({ layout: "auth" });

const authStore = useAuthStore();

const isLoading = ref(false);
const isGoogleLoading = ref(false);

const fields: AuthFormField[] = [
  { name: "email", type: "email", label: "Email", placeholder: "Enter your email", required: true , autocomplete: "email" },
  { name: "password", type: "password", label: "Password", placeholder: "Enter your password", required: true },
  { name: "remember", type: "checkbox", label: "Remember me" },
];

const providers = [
  {
    label: "Google",
    icon: "i-simple-icons-google",
    onClick: async () => {
      isGoogleLoading.value = true;
      try {
        toast.add({ title: "Google", description: "Login with Google" });
        await authStore.handleGoogleLogin();
      } catch (err) {
        error.value = err instanceof Error ? err.message : "Google login failed";
      } finally {
        isGoogleLoading.value = false;
      }
    },
  },
];

const schema = v.object({
  email: v.pipe(v.string(), v.email("Please enter a valid email address")),
  password: v.pipe(v.string(), v.minLength(8, "Password must be at least 8 characters")),
});

type Schema = typeof schema extends v.Validator<infer T> ? T : never;

const error = ref<string | null>(null);

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  // Clear previous error
  error.value = null;
  
  // Set loading state
  isLoading.value = true;
  
  try {
    console.log(payload.data);
    const res = await authStore.login({
      email: payload.data.email, 
      password: payload.data.password, 
      remember: payload.data.remember
    });
    
    if (res.success) {
      // Navigate to the intended destination or account page
      const redirectUrl = res.redirectTo || '/account';
      await navigateTo(redirectUrl);
    } else {
      error.value = res.message;
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Login failed";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        :fields="fields"
        :providers="providers"
        :loading="isLoading"
        title="Welcome back!"

        icon="i-lucide-lock"
        @submit="onSubmit"
      >
        <template #description>
          Don't have an account?
          <ULink to="/join" class="text-primary font-medium">Sign up</ULink>.
        </template>
        <template #password-hint>
          <ULink to="/auth/reset" class="text-primary font-medium" tabindex="-1">Forgot password?</ULink>
        </template>
        <template #validation>
          <UAlert v-if="error" color="error" icon="i-lucide-info" :title="error" class="w-full break-words" />
        </template>
        <template #footer>
          By signing in, you agree to our
          <ULink to="#" class="text-primary font-medium">Terms of Service</ULink>.
        </template>
        
        <template #providers>
          <div class="flex flex-col gap-2">
            <UButton
              v-for="provider in providers"
              :key="provider.label"
              :icon="provider.icon"
              :loading="provider.label === 'Google' && isGoogleLoading"
              :disabled="isLoading || isGoogleLoading"
              block
              @click="provider.onClick"
            >
              {{ provider.label }}
            </UButton>
          </div>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>