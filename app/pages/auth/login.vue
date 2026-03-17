<script setup lang="ts">
import * as v from "valibot";

const toast = useToast();
definePageMeta({ layout: "auth" });

const authStore = useAuthStore();

const fields: AuthFormField[] = [
  { name: "email", type: "email", label: "Email", placeholder: "Enter your email", required: true },
  { name: "password", type: "password", label: "Password", placeholder: "Enter your password", required: true },
  { name: "remember", type: "checkbox", label: "Remember me" },
];

const providers = [
  {
    label: "Google",
    icon: "i-simple-icons-google",
    onClick: () => {
      toast.add({ title: "Google", description: "Login with Google" });
      authStore.handleGoogleLogin();
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
    console.log(payload.data)
  const res = await authStore.login({email:payload.data.email, password:payload.data.password, remember:payload.data.remember});
  if (!res.success) {
    error.value = res.message;
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
          <UAlert v-if="error" color="error" icon="i-lucide-info" :title="error" />
        </template>
        <template #footer>
          By signing in, you agree to our
          <ULink to="#" class="text-primary font-medium">Terms of Service</ULink>.
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>