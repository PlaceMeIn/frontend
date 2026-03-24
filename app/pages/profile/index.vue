<template>
  <div class="min-h-screen p-6 md:p-8">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Profile</h1>
          <p class="text-sm text-muted-foreground">Manage your account information</p>
        </div>
        <UButton 
          variant="outline" 
          icon="i-lucide-settings"
          @click="isEditModalOpen = true"
        >
          Edit Profile
        </UButton>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <UCard>
            <div class="text-center space-y-4">
              <UAvatar 
                :src="profile.user?.profile_picture" 
                :alt="profile.full_name"
                size="3xl"
                class="mx-auto ring-4 ring-primary/10"
              />
              
              <div>
                <h2 class="text-xl font-semibold">{{ profile.full_name }}</h2>
                <p class="text-sm text-muted-foreground">{{ profile.email }}</p>
              </div>

              <div class="flex flex-wrap gap-2 justify-center">
                <UBadge v-if="profile.user?.is_verified" color="success" variant="soft">
                  <UIcon name="i-lucide-badge-check" class="mr-1" />
                  Verified
                </UBadge>
                <UBadge v-if="profile.is_verified_member" color="primary" variant="soft">
                  <UIcon name="i-lucide-users" class="mr-1" />
                  Member
                </UBadge>
                <UBadge v-if="profile.user?.is_active" color="success" variant="soft">
                  <UIcon name="i-lucide-circle" class="mr-1 size-2" />
                  Active
                </UBadge>
              </div>

              <div class="pt-4 border-t dark:border-gray-800">
                <div class="text-sm text-muted-foreground">
                  Member since {{ formatDate(profile.created_at) }}
                </div>
              </div>
            </div>
          </UCard>

          <!-- Contact Info -->
          <UCard>
            <h3 class="font-semibold mb-4 flex items-center gap-2">
              <UIcon name="i-lucide-phone" class="size-4" />
              Contact Information
            </h3>
            <div class="space-y-3">
              <div>
                <p class="text-xs text-muted-foreground">Phone Number</p>
                <p class="text-sm">{{ profile.phone_number || 'Not provided' }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Email</p>
                <p class="text-sm">{{ profile.email }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">GitHub</p>
                <p v-if="profile.github_link" class="text-sm">
                  <ULink :to="profile.github_link" target="_blank" class="text-primary">
                    {{ profile.github_link }}
                  </ULink>
                </p>
                <p v-else class="text-sm text-muted-foreground">Not provided</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Portfolio</p>
                <p v-if="profile.portfolio_website" class="text-sm">
                  <ULink :to="profile.portfolio_website" target="_blank" class="text-primary">
                    {{ profile.portfolio_website }}
                  </ULink>
                </p>
                <p v-else class="text-sm text-muted-foreground">Not provided</p>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Academic Info -->
          <UCard>
            <h3 class="font-semibold mb-4 flex items-center gap-2">
              <UIcon name="i-lucide-graduation-cap" class="size-4" />
              Academic Information
            </h3>
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-muted-foreground">Course</p>
                <p class="text-sm">{{ profile.course || 'Not specified' }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Year of Study</p>
                <p class="text-sm">{{ profile.year_of_study || 'Not specified' }}</p>
              </div>
            </div>
          </UCard>

          <!-- Skills & Interests -->
          <UCard>
            <h3 class="font-semibold mb-4 flex items-center gap-2">
              <UIcon name="i-lucide-code-2" class="size-4" />
              Skills & Interests
            </h3>
            <div class="space-y-4">
              <div>
                <p class="text-xs text-muted-foreground mb-2">Technical Skills</p>
                <div class="flex flex-wrap gap-2">
                  <template v-if="profile.technical_skills">
                    <UBadge v-for="skill in parseSkills(profile.technical_skills)" :key="skill" variant="soft">
                      {{ skill }}
                    </UBadge>
                  </template>
                  <p v-else class="text-sm text-muted-foreground">No skills added yet</p>
                </div>
              </div>
              <div>
                <p class="text-xs text-muted-foreground mb-2">Areas of Interest</p>
                <div class="flex flex-wrap gap-2">
                  <template v-if="profile.areas_of_interest">
                    <UBadge v-for="interest in parseSkills(profile.areas_of_interest)" :key="interest" variant="soft">
                      {{ interest }}
                    </UBadge>
                  </template>
                  <p v-else class="text-sm text-muted-foreground">No interests added yet</p>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Support Tickets -->
          <UCard v-if="profile.support_tickets?.length">
            <h3 class="font-semibold mb-4 flex items-center gap-2">
              <UIcon name="i-lucide-ticket" class="size-4" />
              Support Tickets
            </h3>
            <div class="space-y-3">
              <div v-for="ticket in profile.support_tickets" :key="ticket.id" class="p-3 rounded-lg border dark:border-gray-800">
                <div class="flex items-start justify-between">
                  <div>
                    <p class="font-medium text-sm">{{ ticket.title }}</p>
                    <p class="text-xs text-muted-foreground">{{ ticket.category }}</p>
                  </div>
                  <UBadge :color="getStatusColor(ticket.status)" variant="soft" size="sm">
                    {{ ticket.status }}
                  </UBadge>
                </div>
                <p class="text-xs text-muted-foreground mt-2">
                  Created {{ formatDate(ticket.created_at) }}
                </p>
              </div>
            </div>
          </UCard>

          <!-- Suggestions -->
          <UCard v-if="profile.suggestions?.length">
            <h3 class="font-semibold mb-4 flex items-center gap-2">
              <UIcon name="i-lucide-lightbulb" class="size-4" />
              Your Suggestions
            </h3>
            <div class="space-y-3">
              <div v-for="suggestion in profile.suggestions" :key="suggestion.id" class="p-3 rounded-lg border dark:border-gray-800">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <p class="font-medium text-sm">{{ suggestion.title }}</p>
                    <p class="text-xs text-muted-foreground">{{ suggestion.category }}</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="flex items-center gap-1 text-xs">
                      <UIcon name="i-lucide-thumbs-up" class="size-3" />
                      {{ suggestion.votes_up }}
                    </div>
                    <div class="flex items-center gap-1 text-xs">
                      <UIcon name="i-lucide-thumbs-down" class="size-3" />
                      {{ suggestion.votes_down }}
                    </div>
                  </div>
                </div>
                <div v-if="suggestion.admin_feedback" class="mt-2 p-2 rounded bg-primary/5 dark:bg-primary/10">
                  <p class="text-xs font-medium">Admin Feedback:</p>
                  <p class="text-xs text-muted-foreground">{{ suggestion.admin_feedback }}</p>
                </div>
                <div class="mt-2 flex items-center justify-between">
                  <UBadge :color="getSuggestionStatusColor(suggestion.status)" variant="soft" size="sm">
                    {{ suggestion.status }}
                  </UBadge>
                  <p class="text-xs text-muted-foreground">
                    {{ formatDate(suggestion.created_at) }}
                  </p>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: 'default' })

interface Profile {
  id: string
  full_name: string
  email: string
  phone_number: string | null
  course: string
  year_of_study: string
  technical_skills: string
  areas_of_interest: string
  github_link: string | null
  portfolio_website: string | null
  is_verified_member: boolean
  created_at: string
  updated_at: string
  user: {
    id: string
    email: string
    full_name: string
    is_active: boolean
    is_verified: boolean
    date_joined: string
    profile_picture: string
    is_superuser: boolean
    google_id: string | null
  }
  support_tickets: Array<{
    id: string
    title: string
    category: string
    status: string
    created_at: string
    admin_response: string | null
    resolved: boolean
  }>
  suggestions: Array<{
    id: string
    title: string
    category: string
    status: string
    votes_up: number
    votes_down: number
    created_at: string
    admin_feedback: string | null
  }>
  saved_projects: any[]
  created_projects: any[]
  event_attendances: any[]
  reviews: any[]
  takeaways: any[]
  likes: any[]
}

const { data: profile, error } = await useFetch<{ success: boolean; data: Profile }>('/api/profile')

const isEditModalOpen = ref(false)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const parseSkills = (skills: string) => {
  return skills.split(',').map(s => s.trim()).filter(Boolean)
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'Open': 'warning',
    'In Progress': 'info',
    'Resolved': 'success',
    'Closed': 'secondary'
  }
  return colors[status] || 'default'
}

const getSuggestionStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'Under Review': 'warning',
    'Approved': 'success',
    'Implemented': 'primary',
    'Declined': 'error'
  }
  return colors[status] || 'default'
}
</script>