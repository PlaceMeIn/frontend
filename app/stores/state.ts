import { defineStore } from 'pinia'

interface ContactForm {
  fullname: string
  email: string
  phone?: string
  year?: string
  subject: string
  message: string
}

interface JoinForm {
  fullName: string
  email: string
  phone?: string
  program?: string
  year?: string
  techSkills: string[]
  interests: string[]
  github?: string
  portfolio?: string
  message: string
}

export const useStateStore = defineStore('state', {
  state: () => ({
    ongoingContact: {} as ContactForm,
    join: {
      fullName: '',
      email: '',
      phone: '',
      program: '',
      year: '',
      techSkills: [] as string[],
      interests: [] as string[],
      github: '',
      portfolio: '',
      message: '',
    } as JoinForm,
    isSubmitting: false,
    submitSuccess: false,
    submitError: '' as string | null,
  }),

  getters: {
    isContactFormValid: (state): boolean => {
      const form = state.ongoingContact as ContactForm
      return !!form.fullname && !!form.email && !!form.subject && !!form.message
    },
    isJoinFormValid: (state): boolean => {
      const form = state.join as JoinForm
      return !!form.fullName && !!form.email && !!form.message
    },
  },

  actions: {
    // ---------------- CONTACT FORM ----------------
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

    async submitContact() {
      try {
        if (!this.isContactFormValid) throw new Error('Please fill in all required fields.')
        const { post } = useApi()
        const endpoints = useEndpoints()
        const response = await post(endpoints.main.contact, this.ongoingContact)
        this.resetContactForm()
        return response
      } catch (error: any) {
        throw error
      }
    },

    // ---------------- JOIN FORM ----------------
    resetJoinForm() {
      this.join = {
        fullName: '',
        email: '',
        phone: '',
        program: '',
        year: '',
        techSkills: [],
        interests: [],
        github: '',
        portfolio: '',
        message: '',
      }
      this.submitSuccess = false
      this.submitError = ''
    },

    async submitJoinForm() {
      this.isSubmitting = true
      this.submitSuccess = false
      this.submitError = ''
      try {
        if (!this.isJoinFormValid) throw new Error('Please fill in all required fields.')

        const { post } = useApi()
        const endpoints = useEndpoints()
        const response = await post(endpoints.main.join, this.join)
        this.resetContactForm()

        this.submitSuccess = true
        this.resetJoinForm()

        return response
      } catch (error: any) {
        this.submitError = error.message || 'Failed to submit application.'
        throw error
      } finally {
        this.isSubmitting = false
      }
    },

    toggleSkill(skill: string) {
      if (!this.join.techSkills) this.join.techSkills = []
      const index = this.join.techSkills.indexOf(skill)
      if (index === -1) this.join.techSkills.push(skill)
      else this.join.techSkills.splice(index, 1)
    },

    toggleInterest(interest: string) {
      if (!this.join.interests) this.join.interests = []
      const index = this.join.interests.indexOf(interest)
      if (index === -1) this.join.interests.push(interest)
      else this.join.interests.splice(index, 1)
    },
  },
})