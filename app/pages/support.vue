<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4">
          <UIcon name="i-lucide-headset" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Support Center
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Need help? Fill out the form below and we'll get back to you
        </p>
      </div>

      <!-- Contact Info Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <UCard class="text-center">
          <UIcon name="i-lucide-mail" class="w-6 h-6 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
          <p class="text-sm text-gray-500 dark:text-gray-400">Email Us</p>
          <a :href="`mailto:${supportEmail}`" class="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600">
            {{ supportEmail }}
          </a>
        </UCard>

        <UCard class="text-center">
          <UIcon name="i-lucide-phone" class="w-6 h-6 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
          <p class="text-sm text-gray-500 dark:text-gray-400">Call Us</p>
          <a :href="`tel:${supportPhone}`" class="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600">
            {{ supportPhone }}
          </a>
        </UCard>
      </div>

      <!-- Support Form -->
      <UCard>
        <form @submit.prevent="submitSupport" class="space-y-5">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Email *
            </label>
            <UInput
              v-model="form.email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <!-- Contact Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contact Number
            </label>
            <UInput
              v-model="form.phone"
              type="tel"
              placeholder="+1 234 567 8900"
            />
          </div>

          <!-- Urgency Level -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Level of Urgency *
            </label>
            <div class="flex gap-4">
                <URadioGroup
                indicator="end"
                v-model="form.priority"
                :items="urgencyLevels"
                value-key="value"
                orientation="horizontal"
                variant="card"
                default-value="low"
              />
            </div>
          </div>

          <!-- Message -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message *
            </label>
            <UTextarea
              v-model="form.message"
              placeholder="Please describe your issue or question..."
              :rows="4"
              required
              autoresize
              class="w-full"
            />
          </div>

          <!-- File Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Attachment (Optional)
            </label>
            <UInput
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              @change="handleFileUpload"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Max size: 5MB. Images, PDFs, or documents
            </p>
          </div>

          <!-- Submit Button -->
          <UButton
            type="submit"
            color="primary"
            size="lg"
            block
            :loading="isSubmitting"
          >
            <UIcon name="i-lucide-send" class="w-4 h-4 mr-2" />
            Send Message
          </UButton>
        </form>
      </UCard>

      <!-- Toast Notification -->
      <UToast v-if="showToast" :title="toastTitle" :description="toastDescription" :color="toastColor" />
    </div>
  </div>
</template>

<script setup>
// Contact Information
const supportEmail = 'support@example.com'
const supportPhone = '+1 (555) 123-4567'

// Form Data
const form = ref({
  email: '',
  phone: '',
  urgency: 'medium',
  message: ''
})

const urgencyLevels = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' }
]

const isSubmitting = ref(false)
const showToast = ref(false)
const toastTitle = ref('')
const toastDescription = ref('')
const toastColor = ref('green')

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.size > 5 * 1024 * 1024) {
    showNotification('Error', 'File size must be less than 5MB', 'red')
    event.target.value = ''
  }
}

const submitSupport = async () => {
  if (!form.value.email || !form.value.message) {
    showNotification('Error', 'Please fill in all required fields', 'red')
    return
  }

  isSubmitting.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  showNotification('Success!', 'Your message has been sent. We\'ll get back to you soon!', 'green')
  
  // Reset form
  form.value = {
    email: '',
    phone: '',
    urgency: 'medium',
    message: ''
  }
  
  isSubmitting.value = false
}

const showNotification = (title, description, color) => {
  toastTitle.value = title
  toastDescription.value = description
  toastColor.value = color
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
</script>