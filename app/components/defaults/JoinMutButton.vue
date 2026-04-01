<template>
  <div class="flex items-center">
    <!-- Guest حالت -->
    <UButton
      v-if="!authStore?.user?.email"
      :label="showName || !screen.isMobile.value ? 'Join the Club' : undefined"
      icon="i-lucide-user-pen"
      size="sm"
      color="primary"
      class="w-full"
      to="/join"
    />

    <!-- Authenticated User -->
    <UPopover v-else arrow>
      <!-- Trigger -->
      <div
        class="flex items-center gap-2 px-2 py-1 rounded-2xl border border-primary hover:bg-muted transition cursor-pointer"
      >
        <UAvatar
          size="sm"
          :src="formatMediaUrl(authStore.user?.profile_picture)"
        />

        <!-- User Info -->
        <div
          v-if="isHeaderOpen || !screen.isMobile.value"
          class="flex flex-col leading-tight"
        >
          <p class="text-sm font-medium truncate max-w-[120px]">
            {{ authStore.user?.full_name }}
          </p>

          <div class="flex items-center gap-1 text-xs">
            <UIcon
              name="i-lucide-badge-check"
              :class="authStore.user?.is_verified ? 'text-green-500' : 'text-red-500'"
            />
            <span class="text-muted">
              {{
                authStore.user?.is_verified
                  ? "Active member"
                  : "Unverified"
              }}
            </span>
          </div>
        </div>
      </div>

      <!-- Dropdown Content -->
      <template #content>
        <div class="w-56 p-3 space-y-3">
          <!-- Profile Summary -->
          <div class="flex items-center gap-3">
            <UAvatar
              size="md"
              :src="formatMediaUrl(authStore.user?.profile_picture)"
            />
            <div>
              <p class="font-medium text-sm">
                {{ authStore.user?.full_name }}
              </p>
              <p class="text-xs text-muted">
                {{ authStore.user?.email }}
              </p>
            </div>
          </div>

          <UDivider />

          <!-- Actions -->
          <div class="flex flex-col gap-1">
            <UButton
              variant="ghost"
              icon="i-lucide-user"
              label="Profile"
              to="/account"
            />
            <UButton
              variant="ghost"
              icon="i-lucide-settings"
              label="Settings"
              to="/settings"
            />
            <UButton
              variant="ghost"
              icon="i-lucide-log-out"
              label="Logout"
              @click="authStore.logout()"
            />
          </div>
        </div>
      </template>
    </UPopover>
  </div>
</template>

<script lang="ts" setup>
const screen = useScreenSize();
const authStore = useAuthStore();

defineProps({
  showName: { type: Boolean, default: false },
  isHeaderOpen: { type: Boolean, default: false },
});
</script>