<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";

interface Props {
  amount: number;
  email: string;
  phone: string;
  reference: string;
  description?: string;
}

const props = withDefaults(defineProps<Props>(), {
  description: "Payment",
});

const endpoints = useEndpoints();
const { post, get } = useApi();
const toast = useToast();

const editEmail = ref(false)

// Create local editable state
const localPhone = ref(props.phone);
const localEmail = ref(props.email);

const state = reactive({
  amount: props.amount,
  phone_number: props.phone,
  email: props.email,
  reference: props.reference,
});

const loading = ref(false);
const transactionId = ref<string | null>(null);
const status = ref<"idle" | "pending" | "success" | "failed">("idle");
const poller = ref<NodeJS.Timeout | null>(null);
const pollingAttempts = ref(0);
const phoneError = ref("");

const isPending = computed(() => status.value === "pending");
const isSuccess = computed(() => status.value === "success");
const isFailed = computed(() => status.value === "failed");
const isIdle = computed(() => status.value === "idle");

const canPay = computed(() => {
  return localPhone.value?.length >= 10 && !phoneError.value;
});

const buttonText = computed(() => {
  if (loading.value) return "Initiating STK Push...";
  if (isPending.value) return "Waiting for PIN entry...";
  return `Pay KES ${props.amount.toLocaleString()}`;
});

const statusConfig = computed(() => {
  const configs = {
    idle: {
      color: "neutral" as const,
      icon: "i-heroicons-credit-card",
      title: "Ready to pay",
    },
    pending: {
      color: "warning" as const,
      icon: "i-heroicons-arrow-path",
      title: "Check your phone",
    },
    success: {
      color: "success" as const,
      icon: "i-heroicons-check-circle",
      title: "Payment successful",
    },
    failed: {
      color: "error" as const,
      icon: "i-heroicons-x-circle",
      title: "Payment failed",
    },
  };
  return configs[status.value];
});

function validatePhone(phone: string) {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length < 10) {
    return "Phone number must be at least 10 digits";
  }
  if (!cleaned.startsWith("0") && !cleaned.startsWith("254")) {
    return "Phone should start with 0 or 254";
  }
  return "";
}

function formatPhone(phone: string) {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    return "254" + cleaned.slice(1);
  }
  return cleaned;
}

watch(localPhone, (newValue) => {
  phoneError.value = validatePhone(newValue);
  state.phone_number = formatPhone(newValue);
});

watch(localEmail, (newValue) => {
  state.email = newValue;
});

onUnmounted(() => {
  if (poller.value) {
    clearInterval(poller.value);
    poller.value = null;
  }
});

async function pay() {
  if (!canPay.value) return;

  try {
    loading.value = true;
    pollingAttempts.value = 0;

    const response = await post<{ transaction_id: string }>(
      endpoints.payments.membership_initiate,
      state,
    );

    if (!response?.transaction_id) {
      throw new Error("No transaction ID received");
    }

    transactionId.value = response.transaction_id;
    status.value = "pending";

    poller.value = setInterval(checkStatus, 3000);

    toast.add({
      title: "STK Push sent",
      description: "Please enter your M-PESA PIN to complete payment",
      color: "primary",
      icon: "i-heroicons-phone-arrow-up-right",
    });
  } catch (error) {
    console.error("Payment initiation failed:", error);
    status.value = "failed";

    toast.add({
      title: "STK Push failed",
      description:
        error instanceof Error ? error.message : "Could not start payment",
      color: "error",
      icon: "i-heroicons-exclamation-triangle",
    });
  } finally {
    loading.value = false;
  }
}

async function checkStatus() {
  if (!transactionId.value || !isPending.value) return;

  pollingAttempts.value++;

  if (pollingAttempts.value > 20) {
    if (poller.value) {
      clearInterval(poller.value);
      poller.value = null;
    }
    status.value = "failed";

    toast.add({
      title: "Payment timeout",
      description: "Please check your M-PESA messages for confirmation",
      color: "warning",
    });
    return;
  }

  try {
    const response = await get<{
      status: "idle" | "pending" | "success" | "failed";
    }>(`${endpoints.payments.status}/${transactionId.value}`);

    if (response?.status === "success") {
      status.value = "success";
      if (poller.value) {
        clearInterval(poller.value);
        poller.value = null;
      }

      toast.add({
        title: "Payment successful",
        description: "Your M-PESA payment has been confirmed",
        color: "success",
        icon: "i-heroicons-check-circle",
      });
    }

    if (response?.status === "failed") {
      status.value = "failed";
      if (poller.value) {
        clearInterval(poller.value);
        poller.value = null;
      }
    }
  } catch (error) {
    console.error("Status check failed:", error);
  }
}
</script>

<template>
  <div class="min-h-[500px] flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 py-2 px-4">
    <div class="w-full max-w-md">
      <!-- Header with M-PESA branding -->
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-950 mb-3">
          <UIcon name="i-heroicons-phone-20-solid" class="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 class="text-2xl font-bold text-neutral-900 dark:text-white">M-PESA Payment</h1>
        <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Complete your payment via M-PESA STK Push</p>
      </div>

      <UCard class="relative overflow-hidden border-0 shadow-lg">
        <!-- Status bar -->
        <div
          class="absolute top-0 left-0 right-0 h-1 transition-all duration-500"
          :class="{
            'bg-warning-500': isPending,
            'bg-success-500': isSuccess,
            'bg-error-500': isFailed,
            'bg-primary-500': isIdle,
          }"
        />

        <div class="space-y-6 pt-2">
          <!-- Payment summary card -->
          <div class="bg-gradient-to-br from-primary-50 to-neutral-50 dark:from-primary-950 dark:to-neutral-900 rounded-xl p-5">
            <div class="flex justify-between items-center mb-3">
              <span class="text-sm font-medium text-neutral-600 dark:text-neutral-400">Payment amount</span>
              <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                KES {{ amount.toLocaleString() }}
              </span>
            </div>
            
            <div class="space-y-2 text-sm">
              <div class="flex justify-between items-center">
                <span class="text-neutral-600 dark:text-neutral-400">Reference</span>
                <span class="font-mono font-medium bg-white dark:bg-neutral-800 px-2 py-0.5 rounded">
                  {{ reference }}
                </span>
              </div>
              <div v-if="description" class="flex justify-between">
                <span class="text-neutral-600 dark:text-neutral-400">Description</span>
                <span class="text-neutral-900 dark:text-white">{{ description }}</span>
              </div>
            </div>
          </div>

          <!-- Editable fields -->
          <div class="space-y-4">
            <!-- Phone number field with validation -->
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                <UIcon name="i-heroicons-device-phone-mobile" class="w-4 h-4" />
                M-PESA phone number
              </label>
              <UInput
                v-model="localPhone"
                size="lg"
                placeholder="e.g., 0712345678 or 254712345678"
                :disabled="isPending || isSuccess"
                :color="phoneError ? 'error' : 'neutral'"
                variant="outline"
              >
                <template #leading>
                  <span class="text-sm text-neutral-500">ke</span>
                </template>
                <template #trailing>
                  <UIcon 
                    v-if="localPhone && !phoneError" 
                    name="i-heroicons-check-circle" 
                    class="w-5 h-5 text-success-500" 
                  />
                </template>
              </UInput>
              <p v-if="phoneError" class="text-xs text-error-500 flex items-center gap-1">
                <UIcon name="i-heroicons-exclamation-triangle" class="w-3 h-3" />
                {{ phoneError }}
              </p>
              <p v-else class="text-xs text-neutral-500">
                Enter the phone number registered with M-PESA
              </p>
            </div>

            <!-- Email field for payee identification -->
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
                Email address (for receipt)
              </label>
              <UInput
                v-model="localEmail"
                size="lg"
                placeholder="your@email.com"
                :disabled="!editEmail ||  isPending || isSuccess"
                type="email"
              >
                <template #leading>
                  <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-neutral-400" />
                </template>
              </UInput>
              <p class="text-xs text-neutral-500">
                Receipt will be sent to this email
              </p>
            </div>
          </div>

          <!-- Status alerts with animations -->
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <UAlert
              v-if="isPending"
              color="warning"
              variant="soft"
              title="Check your phone"
              description="Enter your M-PESA PIN when prompted. This page will update automatically."
              :icon="statusConfig.icon"
            >
              <template #actions>
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  :loading="true"
                >
                  Waiting for PIN
                </UButton>
              </template>
            </UAlert>

            <UAlert
              v-else-if="isSuccess"
              color="success"
              variant="soft"
              title="Payment successful"
              description="Your M-PESA payment has been completed. Check your messages for confirmation."
              :icon="statusConfig.icon"
            >
              <template #actions>
                <UBadge color="success" variant="solid" size="sm">
                  <UIcon name="i-heroicons-check" class="w-3 h-3 mr-1" />
                  Confirmed
                </UBadge>
              </template>
            </UAlert>

            <UAlert
              v-else-if="isFailed"
              color="error"
              variant="soft"
              title="Payment failed"
              description="The M-PESA payment could not be completed. Please try again."
              :icon="statusConfig.icon"
            />
          </Transition>

          <!-- Action button -->
          <UButton
            block
            size="lg"
            :loading="loading"
            :disabled="!canPay || isPending || isSuccess"
            :color="isFailed ? 'error' : 'primary'"
            variant="solid"
            @click="pay"
          >
            <template #leading>
              <UIcon
                v-if="!loading && !isPending"
                :name="isFailed ? 'i-heroicons-arrow-path' : 'i-heroicons-lock-closed'"
                class="w-4 h-4"
              />
            </template>
            {{ buttonText }}
          </UButton>

          <!-- Transaction info -->
          <div v-if="transactionId" class="space-y-2">
            <p
              v-if="isPending"
              class="text-xs text-center text-neutral-500 flex items-center justify-center gap-1"
            >
              <UIcon name="i-heroicons-clock" class="w-3 h-3 animate-pulse" />
              Transaction: {{ transactionId.slice(0, 8) }}...
            </p>
          </div>

          <!-- Footer with security badges -->
          <div class="flex items-center justify-center gap-4 pt-2 text-xs text-neutral-500 border-t border-neutral-200 dark:border-neutral-700">
            <div class="flex items-center gap-1">
              <UIcon name="i-heroicons-shield-check" class="w-3 h-3 text-green-600" />
              <span>Secured by Safaricom</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="i-heroicons-lock-closed" class="w-3 h-3" />
              <span>256-bit SSL</span>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Help text -->
      <p class="text-center mt-4 text-xs text-neutral-500">
        Need help? <NuxtLink to="/support" class="text-primary-500 hover:underline">Contact support</NuxtLink>
      </p>
    </div>
  </div>
</template>