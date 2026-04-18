<template>
  <div class="space-y-6">
    <div class="space-y-1">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        Update your profile
      </h2>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Keep your academic details, skills, and links up to date.
      </p>
    </div>

    <UForm
      :state="formState"
      class="space-y-5"
      @submit="handleSubmit"
    >
      <div class="grid gap-4 sm:grid-cols-2">
        <UFormField
          label="Full Name"
          name="full_name"
          required
        >
          <UInput
            v-model="formState.full_name"
            icon="i-lucide-user"
            placeholder="Your full name"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Email Address"
          name="email"
        >
          <UInput
            v-model="formState.email"
            icon="i-lucide-mail"
            type="email"
            disabled
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Phone Number"
          name="phone_number"
        >
          <UInput
            v-model="formState.phone_number"
            icon="i-lucide-phone"
            placeholder="+2547..."
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Course"
          name="course"
        >
          <UInput
            v-model="formState.course"
            icon="i-lucide-graduation-cap"
            placeholder="Computer Science"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Year of Study"
          name="year_of_study"
        >
          <USelect
            v-model="formState.year_of_study"
            :items="yearOptions"
            placeholder="Select year"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="GitHub Link"
          name="github_link"
        >
          <UInput
            v-model="formState.github_link"
            icon="i-lucide-github"
            placeholder="https://github.com/username"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Portfolio Website"
          name="portfolio_website"
          class="sm:col-span-2"
        >
          <UInput
            v-model="formState.portfolio_website"
            icon="i-lucide-globe"
            placeholder="https://yourportfolio.dev"
            class="w-full"
          />
        </UFormField>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <UFormField
          label="Technical Skills"
          name="technical_skills"
          description="Use commas to separate skills."
        >
          <UTextarea
            v-model="formState.technical_skills"
            autoresize
            :rows="4"
            placeholder="Python, Vue, Tailwind, Docker"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Areas of Interest"
          name="areas_of_interest"
          description="Use commas to separate interests."
        >
          <UTextarea
            v-model="formState.areas_of_interest"
            autoresize
            :rows="4"
            placeholder="AI, Web Development, Cybersecurity"
            class="w-full"
          />
        </UFormField>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/70">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
          Live Preview
        </p>
        <div class="mt-3 flex items-center gap-3">
          <UAvatar
            :src="profile?.profile_picture || undefined"
            :alt="formState.full_name"
            size="xl"
          />
          <div class="min-w-0">
            <p class="truncate font-medium text-gray-900 dark:text-white">
              {{ formState.full_name || 'Your name' }}
            </p>
            <p class="truncate text-sm text-gray-600 dark:text-gray-400">
              {{ formState.course || 'Your course' }}
              <span v-if="formState.year_of_study">
                · Year {{ formState.year_of_study }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end dark:border-neutral-800">
        <UButton
          type="button"
          color="neutral"
          variant="outline"
          :disabled="isSubmitting"
          @click="emit('cancel')"
        >
          Cancel
        </UButton>
        <UButton
          type="submit"
          color="primary"
          icon="i-lucide-save"
          :loading="isSubmitting"
        >
          Save Changes
        </UButton>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

type Profile = {
  id?: string
  full_name?: string | null
  email?: string | null
  phone_number?: string | null
  course?: string | null
  year_of_study?: string | null
  technical_skills?: string | null
  areas_of_interest?: string | null
  github_link?: string | null
  portfolio_website?: string | null
  profile_picture?: string | null
}

type FormState = {
  full_name: string
  email: string
  phone_number: string
  course: string
  year_of_study: string
  technical_skills: string
  areas_of_interest: string
  github_link: string
  portfolio_website: string
}

const props = defineProps<{
  profile: Profile | null
}>()

const emit = defineEmits<{
  updated: [payload?: unknown]
  cancel: []
}>()

const { post,put } = useApi()
const endpoints = useEndpoints()
const toast = useToast()

const isSubmitting = ref(false)

const yearOptions = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6'
].map(year => ({
  label: `Year ${year}`,
  value: year
}))

const createFormState = (profile: Profile | null): FormState => ({
  full_name: profile?.full_name ?? '',
  email: profile?.email ?? '',
  phone_number: profile?.phone_number ?? '',
  course: profile?.course ?? '',
  year_of_study: profile?.year_of_study ?? '',
  technical_skills: profile?.technical_skills ?? '',
  areas_of_interest: profile?.areas_of_interest ?? '',
  github_link: profile?.github_link ?? '',
  portfolio_website: profile?.portfolio_website ?? ''
})

const formState = reactive<FormState>(createFormState(props.profile))

watch(
  () => props.profile,
  (profile) => {
    Object.assign(formState, createFormState(profile))
  },
  { immediate: true }
)

const normalizeUrl = (value: string) => {
  const trimmed = value.trim()

  if (!trimmed) {
    return ''
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  return `https://${trimmed}`
}

const handleSubmit = async (event: FormSubmitEvent<FormState>) => {
  isSubmitting.value = true

  const payload = {
    full_name: event.data.full_name.trim(),
    phone_number: event.data.phone_number.trim(),
    course: event.data.course.trim(),
    year_of_study: event.data.year_of_study,
    technical_skills: event.data.technical_skills.trim(),
    areas_of_interest: event.data.areas_of_interest.trim(),
    github_link: normalizeUrl(event.data.github_link),
    portfolio_website: normalizeUrl(event.data.portfolio_website)
  }

  try {
    const response = await put(endpoints.user.updateProfile, payload, true)

    toast.add({
      title: 'Profile updated',
      description: 'Your profile details were saved successfully.',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })

    emit('updated', response)
  } catch (error: any) {
    console.error('Error updating profile:', error)
    toast.add({
      title: 'Update failed',
      description: error?.message || 'We could not update your profile.',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
