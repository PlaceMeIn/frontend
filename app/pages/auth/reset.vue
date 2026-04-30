<template>
  <div class="max-w-md mx-auto space-y-6">

    <PasswordInputCard
      v-if="uid && token"
      :loading="isSubmitting"
      submit-label="Reset Password"
      @submit="handlePasswordSetup"
    />
    
    <SetUpPassword v-else :mode="'forgot'" />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: "auth" })

const route = useRoute()
const toast = useToast()
const isSubmitting = ref(false)

const uid = computed(() => route.query.uid)
const token = computed(() => route.query.token)

const handlePasswordSetup = async (password: string) => {
  try {
    isSubmitting.value = true
    
   const res =  await $fetch(useEndpoints().auth.changePassword, {
      method: 'POST',
      body: {
        uid: uid.value,
        token: token.value,
        password,
        confirm_password: password
      }
    })
    
    toast.add({ 
      title: res.message || "Password reset successful", 
      description: "You can now log in with your new password",
      color: "success" 
    })
    
    await navigateTo("/auth/login")
    
  } catch (error) {
    console.error("Password setup failed:", error)
    toast.add({ 
      title: "Failed to reset password", 
      description: "Please check your reset link and try again",
      color: "error" 
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>