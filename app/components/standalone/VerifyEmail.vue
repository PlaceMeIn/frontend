<script setup lang="ts">
import * as v from "valibot"
import type { FormSubmitEvent } from "@nuxt/ui"

const schema = v.object({
  email: v.pipe(v.string(), v.email("Please enter a valid email address")),
})

type Schema = v.InferOutput<typeof schema>

interface Props {
  email?: string
}

const props = withDefaults(defineProps<Props>(), {
  email: ""
})

const state = reactive({
  email: props.email,
  code: null as number[] | null
})

const editable = computed(() => !props.email)
const canVerify = computed(() => state.email && state.code?.length === 6)
const isCodeComplete = computed(() => state.code?.length === 6)

const endpoints = useEndpoints()
const { post,patch} = useApi()
const toast = useToast()
const loading = ref(false)
const resending = ref(false)
const countdown = ref(0)
let countdownTimer: NodeJS.Timeout | null = null

const verifyEmailInfo = {
  title: "Verify your email",
  description: "We've sent a 6-digit code to your email address"
}

onMounted(() => {
  state.email = props.email || ""
})

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})

const emit = defineEmits(['success'])

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    loading.value = true
    
    await post(endpoints.auth.verifyEmail, {
      email: state.email,
      code: state.code?.join('')
    })

    toast.add({
      title: "Email verified",
      description: "Your email has been successfully verified.",
      color: "success",
      icon: "i-heroicons-check-circle"
    })

    emit("success",true)
    startCountdown()
    
  } catch (error) {
    toast.add({
      title: "Verification failed",
      description: error instanceof Error ? error.message : "Invalid or expired code",
      color: "error",
      icon: "i-heroicons-x-circle"
    })
  } finally {
    loading.value = false
  }
}

async function resendCode() {
  if (resending.value || countdown.value > 0) return
  
  try {
    resending.value = true
    
    await post(endpoints.auth.resendVerification, {
      email: state.email
    })

    toast.add({
      title: "Code resent",
      description: "A new verification code has been sent to your email.",
      color: "success",
      icon: "i-heroicons-envelope"
    })

    startCountdown()
    state.code = null
    
  } catch (error) {
    toast.add({
      title: "Failed to resend",
      description: "Please try again later",
      color: "error",
      icon: "i-heroicons-exclamation-triangle"
    })
  } finally {
    resending.value = false
  }
}

function startCountdown() {
  countdown.value = 60
  if (countdownTimer) clearInterval(countdownTimer)
  
  countdownTimer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      if (countdownTimer) clearInterval(countdownTimer)
    }
  }, 1000)
}

function handleCodeComplete() {
  if (canVerify.value) {
    onSubmit({ data: { email: state.email } } as FormSubmitEvent<Schema>)
  }
}
</script>

<template>
  <div class="min-h-[500px] flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 py-2 px-4">
    <div class="w-full max-w-md">
      <!-- Header with illustration -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-950 mb-4">
          <UIcon 
            name="i-heroicons-envelope-20-solid" 
            class="w-8 h-8 text-primary-500" 
          />
        </div>
        
        <h1 class="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          {{ verifyEmailInfo.title }}
        </h1>

        <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-sm mx-auto">
          {{ verifyEmailInfo.description }}
        </p>
      </div>

      <!-- Main card -->
      <UCard>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-6"
          @submit="onSubmit"
        >
          <!-- Email field (editable only if not provided) -->
          <div class="space-y-2 flex flex-col" >
            <label class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Email address
            </label>
            
            <div v-if="!editable" class="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <span class="text-sm font-mono text-neutral-900 dark:text-white">{{ state.email }}</span>
              <UBadge color="neutral" variant="subtle" size="sm">
                <UIcon name="i-heroicons-lock-closed" class="w-3 h-3 mr-1" />
                Verified
              </UBadge>
            </div>
            
            <UInput
              v-else
              v-model="state.email"
              placeholder="you@example.com"
              size="lg"
              autocomplete="email"
              :disabled="loading || resending"
            >
              <template #leading>
                <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-neutral-400" />
              </template>
            </UInput>
          </div>

          <!-- Verification code field -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Verification code
              </label>
              
              <UButton
                v-if="editable"
                :disabled="resending || countdown > 0 || !state.email"
                color="neutral"
                variant="ghost"
                size="xs"
                :loading="resending"
                @click="resendCode"
              >
                <template #leading>
                  <UIcon v-if="!resending && countdown === 0" name="i-heroicons-arrow-path" class="w-3 h-3" />
                </template>
                {{ countdown > 0 ? `Resend in ${countdown}s` : 'Resend code' }}
              </UButton>
            </div>
            
            <UPinInput
              v-model="state.code"
              :length="6"
              type="number"
              size="lg"
              class="justify-center"
              :disabled="loading || resending || !state.email"
              @complete="handleCodeComplete"
            />
            
            <p class="text-xs text-neutral-500 flex items-center gap-1">
              <UIcon name="i-heroicons-information-circle" class="w-4 h-4" />
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <!-- Action button -->
          <UButton
            type="submit"
            block
            size="lg"
            :loading="loading"
            :disabled="!canVerify || loading"
            color="primary"
            variant="solid"
          >
            <template #leading>
              <UIcon v-if="!loading" name="i-heroicons-check-badge" class="w-5 h-5" />
            </template>
            {{ loading ? 'Verifying...' : 'Verify email' }}
          </UButton>

          <!-- Help link -->
          <p class="text-xs text-center text-neutral-500">
            Didn't receive the code? 
            <button 
              type="button"
              class="text-primary-500 hover:text-primary-600 font-medium"
              :disabled="resending || countdown > 0"
              @click="resendCode"
            >
              Click to resend
            </button>
          </p>
        </UForm>
      </UCard>

      <!-- Back to login link -->
      <p class="text-center mt-6">
        <NuxtLink 
          to="/login" 
          class="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white inline-flex items-center gap-1"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
          Back to login
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Hide spinner for number inputs */
:deep(input[type="number"]) {
  -moz-appearance: textfield;
}
:deep(input[type="number"]::-webkit-outer-spin-button),
:deep(input[type="number"]::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}
</style>