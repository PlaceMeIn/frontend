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
    onthispage:{
      left:null,
      top:null
    },
    ongoingContact: {
      fullname: '',
      email: '',
      phone: undefined,
      message: '',
      subject:''
    } as ContactForm,
    join: {
      fullName: '',
      email: '',
      phone: undefined,
      program: undefined,
      year: undefined,
      techSkills: [],
      interests: [],
      github: undefined,
      portfolio: undefined,
      message: '',
    } as JoinForm,
    isSubmitting: false,
    submitSuccess: false,
    submitError: '' as string | null,
    validationErrors: {} as Record<string, string>,
  }),

  getters: {
    isContactFormValid: (state): boolean => {
      const form = state.ongoingContact as ContactForm
      return !!form.fullname?.trim() &&
        !!form.email?.trim() &&
        !!form.subject?.trim() &&
        !!form.message?.trim()
    },

    isJoinFormValid: (state): boolean => {
      const form = state.join as JoinForm;

      const hasFullName = !!form.fullName?.trim();
      const hasEmail = !!form.email?.trim();
      const hasMessage = !!form.message?.trim() && form.message.trim().length >= 20;
      const hasTechSkills = form.techSkills?.length >= 1;
      const hasInterests = form.interests?.length >= 1;

      return hasFullName && hasEmail && hasMessage && hasTechSkills && hasInterests;
    },

    getJoinFormErrors: (state): Record<string, string> => {
      const form = state.join as JoinForm;
      const errors: Record<string, string> = {};

      if (!form.fullName?.trim()) {
        errors.fullName = 'Full name is required';
      } else if (form.fullName.trim().length < 3) {
        errors.fullName = 'Full name must be at least 3 characters';
      }

      if (!form.email?.trim()) {
        errors.email = 'Email is required';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
          errors.email = 'Please enter a valid email address';
        }
      }

      if (!form.message?.trim()) {
        errors.message = 'Message is required';
      } else if (form.message.trim().length < 20) {
        errors.message = 'Message must be at least 20 characters';
      }

      if (!form.techSkills?.length) {
        errors.techSkills = 'Please select at least one technical skill';
      }

      if (!form.interests?.length) {
        errors.interests = 'Please select at least one area of interest';
      }

      if (form.phone) {
        const phoneRegex = /^\+?[0-9\s\-\(\)]+$/;
        if (!phoneRegex.test(form.phone)) {
          errors.phone = 'Please enter a valid phone number';
        }
      }

      if (form.github) {
        const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/;
        if (!githubRegex.test(form.github)) {
          errors.github = 'Please enter a valid GitHub URL';
        }
      }

      if (form.portfolio) {
        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (!urlRegex.test(form.portfolio)) {
          errors.portfolio = 'Please enter a valid URL';
        }
      }

      return errors;
    },
  },

  actions: {
    resetContactForm() {
      this.ongoingContact = {
        fullname: '',
        email: '',
        phone: undefined,
        year: undefined,
        subject: '',
        message: '',
      }
    },

    async submitContact() {
      this.isSubmitting = true
      this.submitSuccess = false
      this.submitError = ''

      try {
        if (!this.isContactFormValid) {
          throw new Error('Please fill in all required fields.')
        }

        // Remove undefined values
        const contactData = JSON.parse(JSON.stringify(this.ongoingContact));

        const { post } = useApi()
        const endpoints = useEndpoints()
        const response = await post(endpoints.main.contact, contactData)

        this.resetContactForm()
        this.submitSuccess = true

        return response
      } catch (error: any) {
        this.submitError = error.message || 'Failed to submit contact form.'
        throw error
      } finally {
        this.isSubmitting = false
      }
    },

    resetJoinForm() {
      this.join = {
        fullName: '',
        email: '',
        phone: undefined,
        program: "",
        year: "",
        techSkills: [],
        interests: [],
        github: undefined,
        portfolio: undefined,
        message: '',
      }
      this.submitSuccess = false
      this.submitError = ''
      this.validationErrors = {}
    },

    async submitJoinForm() {
      this.isSubmitting = true
      this.submitSuccess = false
      this.submitError = ''
      this.validationErrors = {}

      try {
        const errors = this.getJoinFormErrors;

        if (Object.keys(errors).length > 0) {
          this.validationErrors = errors;
          throw {
            type: 'VALIDATION_ERROR',
            errors: errors,
            message: 'Please fix the validation errors and fill in all required fields!'
          };
        }

        // Remove undefined and empty arrays
        const joinData = JSON.parse(JSON.stringify(this.join, (key, value) => {
          // Remove empty arrays
          if (Array.isArray(value) && value.length === 0) {
            return undefined;
          }
          return value;
        }));

        const { post } = useApi()
        const endpoints = useEndpoints()
        const response = await post(endpoints.main.join, joinData)

        this.submitSuccess = true
        this.resetJoinForm()

        return { success: true, data: response }
      } catch (error: any) {
        if (error.type === 'VALIDATION_ERROR') {
          this.submitError = error.message;
          throw error;
        }

        this.submitError = error.message || 'Failed to submit application.'
        throw new Error(this.submitError);
      } finally {
        this.isSubmitting = false
      }
    },

    toggleSkill(skill: string) {
      if (!this.join.techSkills) this.join.techSkills = []
      const index = this.join.techSkills.indexOf(skill)
      if (index === -1) this.join.techSkills.push(skill)
      else this.join.techSkills.splice(index, 1)

      if (this.join.techSkills.length > 0) {
        delete this.validationErrors.techSkills;
      }
    },

    toggleInterest(interest: string) {
      if (!this.join.interests) this.join.interests = []
      const index = this.join.interests.indexOf(interest)
      if (index === -1) this.join.interests.push(interest)
      else this.join.interests.splice(index, 1)

      if (this.join.interests.length > 0) {
        delete this.validationErrors.interests;
      }
    },
  },
})