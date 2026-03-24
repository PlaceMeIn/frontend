<template>
  <div class="mx-auto max-w-md p-2">
    <!-- Header -->
    <div class="mb-6 text-center">
      <h2 class="text-3xl font-bold">{{ isForgotPassword ? 'Reset Password' : 'Set Up Password' }}</h2>
      <p class="mt-2 text-sm text-muted">
        {{ isForgotPassword ? 'Enter your email to receive a verification code' : 'Create a strong password for your account' }}
      </p>
    </div>

    <!-- Password Setup Form -->
    <UCard class="w-full">
      <UForm :state="formState" @submit="handlePasswordSetup" class="space-y-5">
        <!-- Email Field -->
        <UFormField 
          label="Email Address" 
          required 
          name="email"
          :error="emailError"
        >
          <UInput
            v-model="formState.email"
            placeholder="you@example.com"
            type="email"
            :disabled="isEmailDisabled"
            size="md"
          />
        </UFormField>

        <!-- Verification Code Section -->
        <div class="space-y-3">
          <UFormField 
            label="Verification Code" 
            required 
            name="token"
            :error="tokenError"
          >
            <UPinInput
              v-model="formState.token"
              :length="6"
              placeholder="•"
              class="w-full justify-center"
              size="md"
            />
          </UFormField>
          
          <div class="flex items-center justify-between gap-2">
            <UButton
              :loading="isRequestingCode"
              :disabled="!canRequestCode"
              size="sm"
              variant="soft"
              @click="requestCode"
              class="flex-1"
            >
              {{ codeRequestButtonText }}
            </UButton>
            
            <span v-if="codeSent" class="text-xs text-success flex items-center gap-1">
              <UIcon name="i-heroicons-check-circle" />
              Sent!
            </span>
          </div>
          
          <p v-if="codeSent && formState.email" class="text-xs text-muted">
            Code sent to {{ maskEmail(formState.email) }}
          </p>
        </div>

        <!-- Password Field -->
        <UFormField 
          label="Password" 
          required 
          name="password"
          :error="passwordError"
        >
          <UInput
            v-model="formState.password"
            type="password"
            placeholder="Create a strong password"
            size="md"
          />
          
          <!-- Password Strength Indicator -->
          <div v-if="formState.password" class="mt-2 space-y-1">
            <div class="flex gap-1">
              <div 
                v-for="i in 4" 
                :key="i"
                class="h-1 flex-1 rounded-full transition-all"
                :class="getStrengthColor(i)"
              />
            </div>
            <p class="text-xs" :class="getStrengthTextColor()">
              {{ getStrengthMessage() }}
            </p>
          </div>
          
          <!-- Password Requirements -->
          <div class="mt-2 space-y-1 text-xs">
            <p class="font-medium text-muted">Password must contain:</p>
            <div class="grid grid-cols-2 gap-x-4 gap-y-1">
              <div :class="getRequirementClass(formState.password.length >= 8)">
                ✓ {{ formState.password.length >= 8 ? '' : 'At least ' }}8 characters
              </div>
              <div :class="getRequirementClass(/[A-Z]/.test(formState.password))">
                ✓ Uppercase letter
              </div>
              <div :class="getRequirementClass(/[0-9]/.test(formState.password))">
                ✓ Number
              </div>
              <div :class="getRequirementClass(/[^A-Za-z0-9]/.test(formState.password))">
                ✓ Special character
              </div>
            </div>
          </div>
        </UFormField>

        <!-- Confirm Password Field -->
        <UFormField 
          label="Confirm Password" 
          required 
          name="confirmPassword"
          :error="confirmPasswordError"
        >
          <UInput
            v-model="formState.confirmPassword"
            type="password"
            placeholder="Confirm your password"
            size="md"
          />
        </UFormField>

        <!-- Submit Button -->
        <UButton
          type="submit"
          color="primary"
          :loading="isSubmitting"
          :disabled="!isFormValid"
          block
          size="lg"
          class="mt-2"
        >
          {{ isForgotPassword ? 'Reset Password' : 'Set Password' }}
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useEndpoints } from "~/composables/useEndpoints";
import { useApi } from "~/composables/useApi";

// Props for reusability
const props = defineProps<{
  mode?: "setup" | "forgot";
}>();

const isForgotPassword = computed(() => props.mode === "forgot");

// Composables
const authStore = useAuthStore();
const endpoints = useEndpoints();
const { post } = useApi();
const toast = useToast();

// State
const formState = ref({
  email: "",
  token: "",
  password: "",
  confirmPassword: "",
});

const isSubmitting = ref(false);
const isRequestingCode = ref(false);
const codeSent = ref(false);
const countdown = ref(0);
let countdownInterval: NodeJS.Timeout | null = null;

// Computed: Validation
const isValidEmail = (email: string) => /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email);

const emailError = computed(() => {
  if (!formState.value.email) return "";
  if (!isValidEmail(formState.value.email)) return "Please enter a valid email address";
  return "";
});

const tokenError = computed(() => {
  if (!formState.value.token) return "";
  if (formState.value.token.length !== 6) return "Code must be 6 digits";
  return "";
});

const passwordRequirements = computed(() => ({
  length: formState.value.password.length >= 8,
  uppercase: /[A-Z]/.test(formState.value.password),
  number: /[0-9]/.test(formState.value.password),
  special: /[^A-Za-z0-9]/.test(formState.value.password),
}));

const isPasswordStrong = computed(() => {
  const req = passwordRequirements.value;
  return req.length && req.uppercase && req.number && req.special;
});

const passwordError = computed(() => {
  if (!formState.value.password) return "";
  if (!isPasswordStrong.value) return "Password must meet all requirements above";
  return "";
});

const confirmPasswordError = computed(() => {
  if (!formState.value.confirmPassword) return "";
  if (formState.value.password !== formState.value.confirmPassword) return "Passwords do not match";
  return "";
});

// Password strength helpers
const getStrengthColor = (level: number) => {
  const strength = getPasswordStrength();
  if (strength >= level) {
    if (strength === 1) return "bg-red-500";
    if (strength === 2) return "bg-orange-500";
    if (strength === 3) return "bg-yellow-500";
    return "bg-green-500";
  }
  return "bg-muted";
};

const getPasswordStrength = () => {
  if (!formState.value.password) return 0;
  let score = 0;
  if (formState.value.password.length >= 8) score++;
  if (/[A-Z]/.test(formState.value.password)) score++;
  if (/[0-9]/.test(formState.value.password)) score++;
  if (/[^A-Za-z0-9]/.test(formState.value.password)) score++;
  return score;
};

const getStrengthMessage = () => {
  const strength = getPasswordStrength();
  if (strength === 0) return "";
  if (strength === 1) return "Weak password";
  if (strength === 2) return "Fair password";
  if (strength === 3) return "Good password";
  return "Strong password!";
};

const getStrengthTextColor = () => {
  const strength = getPasswordStrength();
  if (strength === 1) return "text-red-500";
  if (strength === 2) return "text-orange-500";
  if (strength === 3) return "text-yellow-500";
  if (strength === 4) return "text-green-500";
  return "";
};

const getRequirementClass = (met: boolean) => ({
  "text-success": met,
  "text-muted line-through": !met,
});

const canRequestCode = computed(() => {
  return (
    formState.value.email.trim() !== "" &&
    isValidEmail(formState.value.email) &&
    !isRequestingCode.value &&
    countdown.value === 0
  );
});

const codeRequestButtonText = computed(() => {
  if (isRequestingCode.value) return "Sending Code...";
  if (countdown.value > 0) return `Resend (${countdown.value}s)`;
  return codeSent.value ? "Resend Code" : "Send Code";
});

const isFormValid = computed(() => {
  return (
    isPasswordStrong.value &&
    formState.value.password === formState.value.confirmPassword &&
    formState.value.email.trim() !== "" &&
    isValidEmail(formState.value.email) &&
    formState.value.token.length === 6
  );
});

const isEmailDisabled = computed(() => {
  return !!authStore?.user?.email || codeSent.value;
});

// Helpers
const maskEmail = (email: string) => {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const maskedLocal = local.length > 3 
    ? local.slice(0, 2) + "***" + local.slice(-1)
    : local[0] + "***";
  return `${maskedLocal}@${domain}`;
};

const startCountdown = (seconds: number) => {
  if (countdownInterval) clearInterval(countdownInterval);
  
  countdown.value = seconds;
  countdownInterval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      if (countdownInterval) clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }, 1000);
};

const requestCode = async () => {
  if (!canRequestCode.value) return;

  try {
    isRequestingCode.value = true;
    
    const endpoint = isForgotPassword.value 
      ? endpoints.auth.initiateChangePassword 
      : endpoints.auth.initiateSetupPassword;
    
    await post(endpoint, { email: formState.value.email });
    
    codeSent.value = true;
    startCountdown(60);
    
  } catch (error) {
    console.error("Failed to send code:", error);
    toast.add({ title: "Failed to send code. Please try again.", color: "error" });
    codeSent.value = false;
  } finally {
    isRequestingCode.value = false;
  }
};

const handlePasswordSetup = async () => {
  if (!isFormValid.value) return;

  try {
    isSubmitting.value = true;
    
    const payload = {
      id: authStore?.user?.id,
      email: formState.value.email,
      token: Array.isArray(formState.value.token) 
        ? formState.value.token.join("") 
        : formState.value.token,
      password: formState.value.password,
      confirm_password: formState.value.confirmPassword,
    };
    
    const endpoint = isForgotPassword.value 
      ? endpoints.auth.changePassword 
      : endpoints.auth.setPassword;
    
    await post(endpoint, payload, true);
    
    toast.add({ 
      title: isForgotPassword.value ? "Password reset successfully!" : "Password set up successfully!", 
      color: "success" 
    });
    
    await navigateTo("/auth/login");
    
  } catch (error) {
    console.error("Password setup failed:", error);
    toast.add({ 
      title: isForgotPassword.value ? "Failed to reset password" : "Password setup failed", 
      description: "Please check your code and try again",
      color: "error" 
    });
  } finally {
    isSubmitting.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  await authStore.refresh_Token();
  
  if (authStore?.user?.email) {
    formState.value.email = authStore.user.email;
  }
  
  // Auto-send code if email is pre-filled (for setup mode)
  if (formState.value.email && !isForgotPassword.value) {
    setTimeout(() => requestCode(), 500);
  }
});

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval);
});
</script>