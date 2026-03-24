<!-- components/PasswordSetupForm.vue -->
<template>
  <UCard class="w-full">
    <UForm :state="formState" @submit="handleSubmit" class="space-y-5">
      <UFormField 
        label="Password" 
        required 
        name="password"
        :error="passwordError"
      >
        <UInput
          v-model="formState.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Create a strong password"
          size="md"
        >
          <template #trailing>
            <UButton
              variant="ghost"
              size="xs"
              :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
        
        <div v-if="formState.password" class="mt-2 space-y-2">
          <div class="flex gap-1">
            <div 
              v-for="i in 4" 
              :key="i"
              class="h-1 flex-1 rounded-full transition-all duration-300"
              :class="getStrengthColor(i)"
            />
          </div>
          <p class="text-xs font-medium" :class="getStrengthTextColor()">
            {{ getStrengthMessage() }}
          </p>
        </div>
        
        <div class="mt-3 space-y-1.5 text-xs">
          <p class="font-medium text-muted">Password must contain:</p>
          <div class="grid grid-cols-2 gap-x-4 gap-y-1.5">
            <div :class="getRequirementClass(passwordRequirements.length)">
              <span class="mr-1">✓</span> 8+ characters
            </div>
            <div :class="getRequirementClass(passwordRequirements.uppercase)">
              <span class="mr-1">✓</span> Uppercase letter
            </div>
            <div :class="getRequirementClass(passwordRequirements.number)">
              <span class="mr-1">✓</span> Number
            </div>
            <div :class="getRequirementClass(passwordRequirements.special)">
              <span class="mr-1">✓</span> Special character
            </div>
          </div>
        </div>
      </UFormField>

      <UFormField 
        label="Confirm Password" 
        required 
        name="confirmPassword"
        :error="confirmPasswordError"
      >
        <UInput
          v-model="formState.confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="Confirm your password"
          size="md"
        >
          <template #trailing>
            <UButton
              variant="ghost"
              size="xs"
              :icon="showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              @click="showConfirmPassword = !showConfirmPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <UButton
        type="submit"
        color="primary"
        :loading="loading"
        :disabled="!isFormValid"
        block
        size="lg"
        class="mt-2"
      >
        {{ submitLabel }}
      </UButton>
    </UForm>
  </UCard>
</template>

<script lang="ts" setup>
interface Props {
  loading?: boolean
  submitLabel?: string
}

interface Emits {
  (e: 'submit', password: string): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  submitLabel: 'Set Password'
})

const emit = defineEmits<Emits>()

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const formState = reactive({
  password: '',
  confirmPassword: ''
})

const passwordRequirements = computed(() => ({
  length: formState.password.length >= 8,
  uppercase: /[A-Z]/.test(formState.password),
  number: /[0-9]/.test(formState.password),
  special: /[^A-Za-z0-9]/.test(formState.password)
}))

const isPasswordStrong = computed(() => {
  const req = passwordRequirements.value
  return req.length && req.uppercase && req.number && req.special
})

const passwordError = computed(() => {
  if (!formState.password) return ''
  if (!isPasswordStrong.value) return 'Password must meet all requirements above'
  return ''
})

const confirmPasswordError = computed(() => {
  if (!formState.confirmPassword) return ''
  if (formState.password !== formState.confirmPassword) return 'Passwords do not match'
  return ''
})

const isFormValid = computed(() => {
  return isPasswordStrong.value && 
         formState.password === formState.confirmPassword &&
         formState.password.length > 0
})

const getPasswordStrength = () => {
  if (!formState.password) return 0
  const req = passwordRequirements.value
  return Object.values(req).filter(Boolean).length
}

const getStrengthMessage = () => {
  const strength = getPasswordStrength()
  const messages = ['', 'Weak', 'Fair', 'Good', 'Strong']
  return strength > 0 ? `${messages[strength]} password${strength === 4 ? '!' : ''}` : ''
}

const getStrengthColor = (level: number) => {
  const strength = getPasswordStrength()
  if (strength >= level) {
    const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']
    return colors[strength] || 'bg-muted'
  }
  return 'bg-muted/30'
}

const getStrengthTextColor = () => {
  const strength = getPasswordStrength()
  const colors = ['', 'text-red-500', 'text-orange-500', 'text-yellow-500', 'text-green-500']
  return colors[strength] || ''
}

const getRequirementClass = (met: boolean) => ({
  'text-green-600 dark:text-green-500': met,
  'text-muted-foreground line-through opacity-60': !met
})

const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', formState.password)
  }
}

watch(() => props.loading, (isLoading) => {
  if (!isLoading) {
    formState.password = ''
    formState.confirmPassword = ''
  }
})
</script>