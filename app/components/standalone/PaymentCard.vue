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

const edit_email = ref(false);

const local_phone = ref(props.phone);
const local_email = ref(props.email);

const state = reactive({
  amount: props.amount,
  phone_number: props.phone,
  email: props.email,
  reference: props.reference,
});

const loading = ref(false);
const transaction_id = ref<string | null>(null);
const status = ref<"idle" | "pending" | "success" | "failed">("idle");
const poller = ref<NodeJS.Timeout | null>(null);
const polling_attempts = ref(0);
const phone_error = ref("");

const is_pending = computed(() => status.value === "pending");
const is_success = computed(() => status.value === "success");
const is_failed = computed(() => status.value === "failed");
const is_idle = computed(() => status.value === "idle");

const can_pay = computed(() => {
  return local_phone.value?.length >= 10 && !phone_error.value;
});

const button_text = computed(() => {
  if (loading.value) return "Initiating STK Push...";
  if (is_pending.value) return "Waiting for PIN entry...";
  return `Pay KES ${state.amount.toLocaleString()}`;
});

const status_config = computed(() => {
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

function validate_phone(phone: string) {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length < 10) {
    return "Phone number must be at least 10 digits";
  }
  if (!cleaned.startsWith("0") && !cleaned.startsWith("254")) {
    return "Phone should start with 0 or 254";
  }
  return "";
}

function format_phone(phone: string) {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    return "254" + cleaned.slice(1);
  }
  return cleaned;
}

watch(local_phone, (new_value) => {
  phone_error.value = validate_phone(new_value);
  state.phone_number = format_phone(new_value);
});

watch(local_email, (new_value) => {
  state.email = new_value;
});

onUnmounted(() => {
  if (poller.value) {
    clearInterval(poller.value);
    poller.value = null;
  }
});

async function pay() {
  if (!can_pay.value) return;

  try {
    loading.value = true;
    polling_attempts.value = 0;

    const response = await post<{ transaction_id: string }>(
      endpoints.payments.membership_initiate,
      state,
    );

    if (!response?.success) {
      throw new Error(response?.error.slice(0, 20));
    }

    if (!response.data?.checkout_request_id) {
      throw new Error("No transaction ID received");
    }

    transaction_id.value = response.data?.checkout_request_id || null;
    state.amount = response?.data?.amount
    status.value = "pending";

    poller.value = setInterval(check_status, 2000);

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
        error instanceof Error ?error ||  error.message : "Could not start payment",
      color: "error",
      icon: "i-heroicons-exclamation-triangle",
    });
  } finally {
    loading.value = false;
  }
}

async function check_status() {
  if (!transaction_id.value || !is_pending.value) return;

  polling_attempts.value++;

  if (polling_attempts.value > 20) {
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
      status: "idle" | "pending" | "completed" | "failed";
    }>(`${endpoints.payments.un_auth_status}`, {
      email: state.email,
      checkout_request_id: transaction_id.value
    });

    if (response?.data?.payment?.status === "completed") {
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
      controlFlow(response?.data?.actions)
      useAuthStore().token = response?.data?.tokens?.refresh

    }

    if (response?.data?.payment?.status === "failed") {
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
const router = useRouter()
function controlFlow(actions:any){
  if(!actions)return
  if(actions?.can_login){
     toast.add({
        title: "redirecting to login...",
        color: "success",
        icon: "i-heroicons-check-circle",
      });

    router.push('/auth/set_up')
  }
}
</script>

<template>
  <div
    class="min-h-[500px] flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 py-2 px-4"
  >
    <div class="w-full max-w-md">
      <div class="text-center mb-6">
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-950 mb-3"
        >
          <UIcon
            name="i-heroicons-phone-20-solid"
            class="w-8 h-8 text-green-600 dark:text-green-400"
          />
        </div>
        <h1 class="text-2xl font-bold text-neutral-900 dark:text-white">
          M-PESA Payment
        </h1>
        <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Complete your payment via M-PESA STK Push
        </p>
      </div>

      <UCard class="relative overflow-hidden border-0 shadow-lg">
        <div
          class="absolute top-0 left-0 right-0 h-1 transition-all duration-500"
          :class="{
            'bg-warning-500': is_pending,
            'bg-success-500': is_success,
            'bg-error-500': is_failed,
            'bg-primary-500': is_idle,
          }"
        />

        <div class="space-y-6 pt-2">
          <div
            class="bg-gradient-to-br from-primary-50 to-neutral-50 dark:from-primary-950 dark:to-neutral-900 rounded-xl p-5"
          >
            <div class="flex justify-between items-center mb-3">
              <span
                class="text-sm font-medium text-neutral-600 dark:text-neutral-400"
                >Payment amount</span
              >
              <span
                class="text-2xl font-bold text-primary-600 dark:text-primary-400"
              >
                KES {{ state?.amount.toLocaleString() }}
              </span>
            </div>

            <div class="space-y-2 text-sm">
              <div class="flex justify-between items-center">
                <span class="text-neutral-600 dark:text-neutral-400"
                  >Reference</span
                >
                <span
                  class="font-mono font-medium bg-white dark:bg-neutral-800 px-2 py-0.5 rounded"
                >
                  {{ reference }}
                </span>
              </div>
              <div v-if="description" class="flex justify-between">
                <span class="text-neutral-600 dark:text-neutral-400"
                  >Description</span
                >
                <span class="text-neutral-900 dark:text-white">{{
                  description
                }}</span>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="space-y-1.5">
              <label
                class="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
              >
                <UIcon name="i-heroicons-device-phone-mobile" class="w-4 h-4" />
                M-PESA phone number
              </label>
              <UInput
                v-model="local_phone"
                size="lg"
                placeholder="e.g., 0712345678 or 254712345678"
                :disabled="is_pending || is_success"
                :color="phone_error ? 'error' : 'neutral'"
                variant="outline"
              >
                <template #leading>
                  <span class="text-sm text-neutral-500">ke</span>
                </template>
                <template #trailing>
                  <UIcon
                    v-if="local_phone && !phone_error"
                    name="i-heroicons-check-circle"
                    class="w-5 h-5 text-success-500"
                  />
                </template>
              </UInput>
              <p
                v-if="phone_error"
                class="text-xs text-error-500 flex items-center gap-1"
              >
                <UIcon
                  name="i-heroicons-exclamation-triangle"
                  class="w-3 h-3"
                />
                {{ phone_error }}
              </p>
              <p v-else class="text-xs text-neutral-500">
                Enter the phone number registered with M-PESA
              </p>
            </div>

            <div class="space-y-1.5">
              <label
                class="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
              >
                <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
                Email address (for receipt)
              </label>
              <UInput
                v-model="local_email"
                size="lg"
                placeholder="your@email.com"
                :disabled="!edit_email || is_pending || is_success"
                type="email"
              >
                <template #leading>
                  <UIcon
                    name="i-heroicons-envelope"
                    class="w-5 h-5 text-neutral-400"
                  />
                </template>
              </UInput>
              <p class="text-xs text-neutral-500">
                Receipt will be sent to this email
              </p>
            </div>
          </div>

          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <UAlert
              v-if="is_pending"
              color="warning"
              variant="soft"
              title="Check your phone"
              description="Enter your M-PESA PIN when prompted. This page will update automatically."
              :icon="status_config.icon"
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
              v-else-if="is_success"
              color="success"
              variant="soft"
              title="Payment successful"
              description="Your M-PESA payment has been completed. Check your messages for confirmation."
              :icon="status_config.icon"
            >
              <template #actions>
                <UBadge color="success" variant="solid" size="sm">
                  <UIcon name="i-heroicons-check" class="w-3 h-3 mr-1" />
                  Confirmed
                </UBadge>
              </template>
            </UAlert>

            <UAlert
              v-else-if="is_failed"
              color="error"
              variant="soft"
              title="Payment failed"
              description="The M-PESA payment could not be completed. Please try again."
              :icon="status_config.icon"
            />
          </Transition>

          <UButton
            block
            size="lg"
            :loading="loading"
            :disabled="!can_pay || is_pending || is_success"
            :color="is_failed ? 'error' : 'primary'"
            variant="solid"
            @click="pay"
          >
            <template #leading>
              <UIcon
                v-if="!loading && !is_pending"
                :name="
                  is_failed
                    ? 'i-heroicons-arrow-path'
                    : 'i-heroicons-lock-closed'
                "
                class="w-4 h-4"
              />
            </template>
            {{ button_text }}
          </UButton>

          <div v-if="transaction_id" class="space-y-2">
            <p
              v-if="is_pending"
              class="text-xs text-center text-neutral-500 flex items-center justify-center gap-1"
            >
              <UIcon name="i-heroicons-clock" class="w-3 h-3 animate-pulse" />
              Transaction: {{ transaction_id.slice(0, 8) }}...
            </p>
          </div>

          <div
            class="flex items-center justify-center gap-4 pt-2 text-xs text-neutral-500 border-t border-neutral-200 dark:border-neutral-700"
          >
            <div class="flex items-center gap-1">
              <UIcon
                name="i-heroicons-shield-check"
                class="w-3 h-3 text-green-600"
              />
              <span>Secured by Safaricom</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="i-heroicons-lock-closed" class="w-3 h-3" />
              <span>256-bit SSL</span>
            </div>
          </div>
        </div>
      </UCard>

      <p class="text-center mt-4 text-xs text-neutral-500">
        Need help?
        <NuxtLink to="/support" class="text-primary-500 hover:underline"
          >Contact support</NuxtLink
        >
      </p>
    </div>
  </div>
</template>