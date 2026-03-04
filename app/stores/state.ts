import { defineStore } from 'pinia'
import type { Ref } from 'vue'

interface ContactForm {
  fullname: string
  email: string
  phone?: string
  year?: string
  subject: string
  message: string
}

export const useStateStore = defineStore('state', {
  state: () => ({
    ongoingContact: {} as ContactForm,
  }),

  getters: {
    // Check if form is valid (basic check)
    isContactFormValid: (state): boolean => {
      const form = state.ongoingContact as ContactForm
      return !!form.fullname && !!form.email && !!form.subject && !!form.message
    },
  },

  actions: {
    // Reset form to defaults
    resetContactForm() {
      this.ongoingContact = {
        fullname: '',
        email: '',
        phone: '',
        year: '',
        subject: '',
        message: '',
      }
    },

    // Submit form (integrate your API here)
    async submitContact() {
      try {
        if (!this.isContactFormValid) {
          throw new Error('Please fill in all required fields.')
        }

        // Example API call (replace with real endpoint)
        const response = await $fetch('/api/contact', {
          method: 'POST',
          body: this.ongoingContact,
        })

        console.log('Contact submitted successfully:', response)

        // Reset form after successful submit
        this.resetContactForm()

        // Optionally show success toast
        // useToast().success('Message sent successfully!')

        return response
      } catch (error) {
        console.error('Failed to submit contact form:', error)
        // Optionally show error toast
        // useToast().error('Failed to send message. Please try again.')
        throw error
      }
    },
  },
})