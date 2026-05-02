<script setup lang="ts">
import * as v from "valibot";

const toast = useToast();
definePageMeta({ layout: "auth" });

const authStore = useAuthStore();
const router = useRouter();

const isLoading = ref(false);
const isGoogleLoading = ref(false);
const showRedirectModal = ref(false);
const redirectTarget = ref<string>('/account');
let redirectTimeout: NodeJS.Timeout | null = null;

const fields: AuthFormField[] = [
  { name: "email", type: "email", label: "Email", placeholder: "Enter your email", required: true, autocomplete: "email" },
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
        if (authStore.isAuthenticated) {
          handleAlreadyLoggedIn();
          return;
        }
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

// Track previous auth state
let previousAuthState = authStore.isAuthenticated;

// Watch for auth state changes (for new logins)
watch(() => authStore.isAuthenticated, (isNowAuthenticated) => {
  // Scenario 1: User just logged in (was false, now true)
  if (!previousAuthState && isNowAuthenticated) {
    handleSuccessfulLogin();
  }
  previousAuthState = isNowAuthenticated;
});

// Scenario 2: Check if user is already logged in when component mounts
onMounted(() => {
  setTimeout(() => {
    if (authStore.isAuthenticated) {
      handleAlreadyLoggedIn();
    }
  }, 500);

});

function handleSuccessfulLogin() {
  const redirect = authStore.popRedirect();
  const targetPath =
    !redirect?.path ||
      redirect.path.includes('/login') ||
      redirect.path.includes('/auth')
      ? '/account'
      : redirect.path;

  redirectTarget.value = targetPath;

  // Show modal and redirect after 2 seconds
  showRedirectModal.value = true;

  // Clear any existing timeout
  if (redirectTimeout) clearTimeout(redirectTimeout);

  // Auto redirect after 2 seconds
  redirectTimeout = setTimeout(() => {
    if (showRedirectModal.value) {
      router.replace(targetPath);
      showRedirectModal.value = false;
    }
  }, 2000);
}

function handleAlreadyLoggedIn() {
  const redirect = authStore.popRedirect();
  const targetPath =
    !redirect?.path ||
      redirect.path.includes('/login') ||
      redirect.path.includes('/auth')
      ? '/account'
      : redirect.path;

  redirectTarget.value = targetPath;

  // Show modal to inform user they're already logged in
  showRedirectModal.value = true;

  // Clear any existing timeout
  if (redirectTimeout) clearTimeout(redirectTimeout);

  // Auto redirect after 2 seconds
  redirectTimeout = setTimeout(() => {
    if (showRedirectModal.value) {
      router.replace(targetPath);
      showRedirectModal.value = false;
    }
  }, 2000);
}

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  // Don't proceed if already authenticated
  if (authStore.isAuthenticated) {
    handleAlreadyLoggedIn();
    return;
  }

  error.value = null;
  isLoading.value = true;

  try {
    const res = await authStore.login({
      email: payload.data.email,
      password: payload.data.password,
      remember: payload.data.remember
    });

    if (res.success) {
      // Don't add extra toast - the modal will handle feedback
      // The watcher will trigger handleSuccessfulLogin()
    } else {
      error.value = res.message;
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Login failed";
  } finally {
    isLoading.value = false;
  }
}

function closeModal() {
  if (redirectTimeout) {
    clearTimeout(redirectTimeout);
    redirectTimeout = null;
  }
  showRedirectModal.value = false;
}

function redirectNow() {
  if (redirectTimeout) {
    clearTimeout(redirectTimeout);
    redirectTimeout = null;
  }
  router.replace(redirectTarget.value);
  showRedirectModal.value = false;
}

// Cleanup on unmount
onUnmounted(() => {
  if (redirectTimeout) {
    clearTimeout(redirectTimeout);
  }
});
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm :schema="schema" :fields="fields" :providers="providers" :loading="isLoading" title="Welcome back!"
        icon="i-lucide-lock" @submit="onSubmit">
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
          <ULink to="/terms" class="text-primary font-medium">Terms of Service</ULink>.
        </template>

        <template #providers>
          <div class="flex flex-col gap-2">
            <UButton v-for="provider in providers" :key="provider.label" :icon="provider.icon"
              :loading="provider.label === 'Google' && isGoogleLoading" :disabled="isLoading || isGoogleLoading" block
              @click="provider.onClick">
              {{ provider.label }}
            </UButton>
          </div>
        </template>
      </UAuthForm>
    </UPageCard>

    <!-- Redirect Modal -->
    <UModal v-model:open="showRedirectModal" :prevent-close="true">

      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-log-in" class="text-primary" />
          <h3 class="text-lg font-semibold">Already Logged In</h3>
        </div>
      </template>
      <template #body>

        <div class="text-center py-4">
          <UIcon name="i-lucide-check-circle" class="text-green-500 w-12 h-12 mb-3" />
          <p class="mb-2">You are already logged in!</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Redirecting you to {{ redirectTarget === '/account' ? 'your account' : 'the previous page' }} in a moment...
          </p>
          <div class="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div class="h-full bg-primary rounded-full animate-pulse" style="width: 100%"></div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="primary" variant="ghost" @click="closeModal">
            Stay Here
          </UButton>
          <UButton color="primary" @click="redirectNow">
            Redirect Now
          </UButton>
        </div>
      </template>

    </UModal>
  </div>
</template>