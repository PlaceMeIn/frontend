<template>
  <div class="w-full max-w-md m-auto p-1 space-y-4">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="text-center">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin w-8 h-8 mx-auto text-primary mb-2" />
        <p class="mt-2 text-gray-600 dark:text-gray-400">Processing your registration...</p>
      </div>
    </div>

    <!-- Error Display -->
    <UAlert
      v-if="error && !showPaymentStatus"
      :title="'Registration Error'"
      color="error"
      variant="soft"
      icon="i-heroicons-exclamation-triangle"
    >
      <template #default>
        <div class="space-y-2">
          <p class="text-sm">{{ error }}</p>
          <UButton 
            v-if="error.includes('simulation')"
            @click="simulatePayment" 
            color="error"
            variant="ghost"
            size="sm"
          >
            Click here to simulate payment
          </UButton>
        </div>
      </template>
    </UAlert>

    <!-- Payment Status Display (Inline) -->
    <UPageCard
      v-if="showPaymentStatus"
      :spotlight="{ gradient: 'from-primary-500 via-primary-500 to-primary-600' }"
      class="w-full"
    >
      <template #header>
        <div class="text-center pt-4">
          <div class="mb-4">
            <UIcon
              v-if="paymentProcessing"
              name="i-heroicons-arrow-path"
              class="animate-spin w-12 h-12 mx-auto text-primary"
            />
            <UIcon
              v-else-if="paymentSuccess"
              name="i-heroicons-check-circle"
              class="w-12 h-12 mx-auto text-green-500"
            />
            <UIcon
              v-else
              name="i-heroicons-x-circle"
              class="w-12 h-12 mx-auto text-red-500"
            />
          </div>
        </div>
      </template>

      <div class="space-y-4">
        <!-- Message -->
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ paymentModalTitle }}
          </h3>
          <p class="text-sm text-gray-700 dark:text-gray-300">{{ paymentModalMessage }}</p>
        </div>

        <!-- Checkout ID (if available) -->
        <div v-if="paymentCheckoutId && !paymentSuccess && !paymentProcessing" class="space-y-2">
          <p class="text-xs text-gray-600 dark:text-gray-400 text-center">
            Checkout ID: <span class="font-mono">{{ paymentCheckoutId }}</span>
          </p>
          <UButton
            @click="checkPaymentStatus"
            color="primary"
            variant="outline"
            size="sm"
            block
          >
            Check Payment Status
          </UButton>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2">
          <UButton
            v-if="!paymentProcessing && !paymentSuccess"
            @click="closePaymentModal"
            color="gray"
            variant="ghost"
            block
          >
            Close
          </UButton>
          <UButton
            v-if="paymentSuccess"
            @click="closePaymentModal"
            color="primary"
            block
          >
            Done
          </UButton>
        </div>
      </div>
    </UPageCard>

    <!-- Registration Form -->
    <UPageCard
      v-if="!loading && !showPaymentStatus"
      :spotlight="{ gradient: 'from-primary-400 via-transparent to-primary-500' }"
    >
      <div class="space-y-6">
        <!-- Event Details Section -->
        <div class="pb-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="font-semibold text-lg text-gray-900 dark:text-white">{{ event.title }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ event.event_type_display }}</p>
          <div class="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
              <span>{{ formatDate(event.start_date) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
              <span>{{ event.location }}</span>
            </div>
          </div>
        </div>

        <!-- Price Display for Paid Events -->
        <UAlert
          v-if="event.is_paid_event"
          :title="'Ticket Information'"
          color="amber"
          variant="soft"
          icon="i-heroicons-banknotes"
        >
          <template #default>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Ticket Price:</span>
                <span class="text-lg font-bold text-primary">KES {{ event.ticket_price }}</span>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400">Payment via M-Pesa required</p>
            </div>
          </template>
        </UAlert>

        <!-- Free Event Message -->
        <UAlert
          v-else
          :title="'Free Event'"
          color="success"
          variant="soft"
          icon="i-heroicons-check-circle"
        >
          <template #default>
            <p class="text-sm">This is a free event! No payment required.</p>
          </template>
        </UAlert>

        <!-- Phone Number (Required for Paid Events) -->
        <div v-if="event.is_paid_event" class="space-y-2">
          <UFormGroup
            label="Phone Number"
            name="phoneNumber"
            :required="true"
          >
            <UInput
              v-model="phoneNumber"
              type="tel"
              icon="i-heroicons-phone"
              placeholder="e.g., 0712345678 or 254712345678"
              size="lg"
              required
            />
          </UFormGroup>
          <p class="text-xs text-gray-600 dark:text-gray-400">Enter the M-Pesa registered phone number</p>
        </div>

        <!-- Already Registered Message -->
        <UAlert
          v-if="alreadyRegistered"
          :title="'Already Registered'"
          color="success"
          variant="soft"
          icon="i-heroicons-check-badge"
        >
          <template #default>
            <p class="text-sm">You are already registered for this event!</p>
          </template>
        </UAlert>

        <!-- Submit Button -->
        <UButton
          v-if="!alreadyRegistered"
          @click="handleRegistration"
          :loading="submitting"
          :disabled="submitting || (event.is_paid_event && !phoneNumber)"
          color="primary"
          size="lg"
          block
        >
          <template #leading>
            <UIcon v-if="event.is_paid_event" name="i-heroicons-credit-card" />
            <UIcon v-else name="i-heroicons-check-badge" />
          </template>
          {{ event.is_paid_event ? `Pay KES ${event.ticket_price} & Register` : 'Register for Event' }}
        </UButton>
      </div>
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Props
interface Event {
  id: string
  slug: string
  title: string
  event_type_display: string
  start_date: string
  location: string
  is_paid_event: boolean
  ticket_price: number
  user_is_registered?: boolean
}

const props = defineProps<{
  event: Event
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}>()

// State
const loading = ref(false)
const error = ref<string | null>(null)
const submitting = ref(false)
const phoneNumber = ref('')
const alreadyRegistered = ref(props.event.user_is_registered || false)

// Payment Status State
const showPaymentStatus = ref(false)
const paymentProcessing = ref(false)
const paymentSuccess = ref(false)
const paymentCheckoutId = ref<string | null>(null)
const paymentModalTitle = ref('')
const paymentModalMessage = ref('')

// Format Date Filter
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Format phone number for M-Pesa
const formatPhoneNumber = (phone: string): string => {
  let cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.slice(1)
  } else if (cleaned.startsWith('+')) {
    cleaned = cleaned.slice(1)
  }
  
  if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned
  }
  
  return cleaned
}

// Main Registration Handler
const handleRegistration = async () => {
  if (alreadyRegistered.value) {
    error.value = 'You are already registered for this event'
    return
  }
  
  submitting.value = true
  error.value = null

  alert('Registration started') // Debug alert
  
  try {
    if (props.event.is_paid_event) {
      await initiateEventPayment()
    } else {
      await registerForFreeEvent()
    }
  } catch (err: any) {
    handleError(err)
  } finally {
    submitting.value = false
  }
}

// Free Event Registration
const registerForFreeEvent = async () => {
  const res: any = await useApi().post(
    useEndpoints().eventAttendances.register,
    {
      event_id: props.event.id,
      phone_number: null
    },
    true // with auth
  )
  
  if (res?.attendance) {
    props.onSuccess?.(res)
    showSuccessModal('Successfully Registered!', `You have successfully registered for ${props.event.title}`)
    alreadyRegistered.value = true
  } else {
    throw new Error('Registration failed')
  }
}

// Initiate Payment for Paid Event
const initiateEventPayment = async () => {
  const formattedPhone = formatPhoneNumber(phoneNumber.value)
  
  const res: any = await useApi().post(
    useEndpoints().eventPayments.initiate,
    {
      event_id: props.event.id,
      phone_number: formattedPhone
    },
    true // with auth
  )
  
  if (res?.data?.checkout_request_id) {
    paymentCheckoutId.value = res.data.checkout_request_id
    paymentProcessing.value = true
    showPaymentStatus.value = true
    paymentModalTitle.value = 'Processing Payment'
    paymentModalMessage.value = 'Please check your phone and enter your M-Pesa PIN to complete payment.'
    
    // Start polling for payment status
    await pollPaymentStatus(paymentCheckoutId.value)
  } else if (res?.checkout_request_id) {
    paymentCheckoutId.value = res.checkout_request_id
    paymentProcessing.value = true
    showPaymentStatus.value = true
    paymentModalTitle.value = 'Processing Payment'
    paymentModalMessage.value = 'Please check your phone and enter your M-Pesa PIN to complete payment.'
    
    await pollPaymentStatus(paymentCheckoutId.value)
  } else if (res?.attendance) {
    // Already registered case
    props.onSuccess?.(res)
    alreadyRegistered.value = true
    showSuccessModal('Already Registered', `You are already registered for ${props.event.title}`)
  } else {
    throw new Error(res?.message || 'Payment initiation failed')
  }
}

// Poll Payment Status
const pollPaymentStatus = async (checkoutId: string, maxAttempts: number = 12) => {
  let attempts = 0
  const pollInterval = 10000 // 10 seconds
  
  const checkStatus = async (): Promise<boolean> => {
    attempts++
    
    try {
      const res: any = await useApi().get(
        `${useEndpoints().eventPayments.checkStatus}?checkout_request_id=${checkoutId}`,
        {},
        true
      )
      
      if (res?.payment?.status === 'completed') {
        paymentProcessing.value = false
        paymentSuccess.value = true
        paymentModalTitle.value = 'Payment Successful!'
        paymentModalMessage.value = `Your registration for ${props.event.title} has been confirmed.`
        props.onSuccess?.(res)
        alreadyRegistered.value = true
        return true
      } else if (res?.payment?.status === 'failed') {
        paymentProcessing.value = false
        paymentSuccess.value = false
        paymentModalTitle.value = 'Payment Failed'
        paymentModalMessage.value = res?.payment?.failure_reason || 'Payment could not be processed. Please try again.'
        return true
      }
    } catch (err) {
      console.error('Status check error:', err)
    }
    
    if (attempts >= maxAttempts) {
      paymentProcessing.value = false
      paymentSuccess.value = false
      paymentModalTitle.value = 'Payment Timeout'
      paymentModalMessage.value = 'Payment is taking longer than expected. Please check your payment status later or contact support.'
      return true
    }
    
    return false
  }
  
  while (attempts < maxAttempts) {
    const completed = await checkStatus()
    if (completed) break
    
    if (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, pollInterval))
    }
  }
}

// Simulate Payment (for sandbox testing)
const simulatePayment = async () => {
  if (!paymentCheckoutId.value) return
  
  try {
    const res: any = await useApi().post(
      useEndpoints().eventPayments.simulate,
      {
        checkout_request_id: paymentCheckoutId.value,
        result_code: 0,
        result_desc: 'Success'
      },
      true
    )
    
    if (res?.success) {
      paymentProcessing.value = false
      paymentSuccess.value = true
      paymentModalTitle.value = 'Payment Successful!'
      paymentModalMessage.value = `Your registration for ${props.event.title} has been confirmed.`
      alreadyRegistered.value = true
      props.onSuccess?.(res)
    } else {
      error.value = res?.message || 'Simulation failed'
    }
  } catch (err: any) {
    error.value = err?.message || 'Simulation failed'
  }
}

// Check payment status manually
const checkPaymentStatus = async () => {
  if (!paymentCheckoutId.value) return
  
  try {
    const res: any = await useApi().get(
      `${useEndpoints().eventPayments.checkStatus}?checkout_request_id=${paymentCheckoutId.value}`,
      {},
      true
    )
    
    if (res?.payment?.status === 'completed') {
      paymentProcessing.value = false
      paymentSuccess.value = true
      paymentModalTitle.value = 'Payment Successful!'
      paymentModalMessage.value = `Your registration for ${props.event.title} has been confirmed.`
      alreadyRegistered.value = true
    } else if (res?.payment?.status === 'pending') {
      paymentModalMessage.value = 'Payment still pending. Please check your phone and complete the transaction.'
    } else if (res?.payment?.status === 'failed') {
      paymentProcessing.value = false
      paymentSuccess.value = false
      paymentModalTitle.value = 'Payment Failed'
      paymentModalMessage.value = res?.payment?.failure_reason || 'Payment failed. Please try again.'
    }
  } catch (err: any) {
    error.value = err?.message || 'Failed to check payment status'
  }
}

// Show success modal
const showSuccessModal = (title: string, message: string) => {
  paymentSuccess.value = true
  paymentProcessing.value = false
  paymentModalTitle.value = title
  paymentModalMessage.value = message
  showPaymentStatus.value = true
}

// Close payment status
const closePaymentModal = () => {
  showPaymentStatus.value = false
  paymentProcessing.value = false
  paymentSuccess.value = false
  paymentCheckoutId.value = null
  paymentModalTitle.value = ''
  paymentModalMessage.value = ''
}

// Handle errors
const handleError = (err: any) => {
  let errorMessage = 'Registration failed. Please try again.'
  
  if (err?.message) {
    errorMessage = err.message
  } else if (err?.response?.data?.message) {
    errorMessage = err.response.data.message
  } else if (err?.response?.data?.error) {
    errorMessage = err.response.data.error
  }
  
  error.value = errorMessage
  props.onError?.(errorMessage)
  
  // Auto-clear error after 5 seconds
  setTimeout(() => {
    if (error.value === errorMessage) {
      error.value = null
    }
  }, 5000)
}

// Watch for event prop changes
watch(() => props.event.user_is_registered, (newVal) => {
  alreadyRegistered.value = newVal || false
})
</script>

<style scoped>
/* Optional custom styles */
</style>