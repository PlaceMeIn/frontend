<script setup lang="ts">
const breadcrumbs = useBreadcrumbs()
</script>

<template>
  <UBreadcrumb :items="breadcrumbs" class="text-sm font-sans tracking-wide">
    
    <!-- Separator -->
    <template #separator>
      <span class="mx-0 font-bold text-gray-400 dark:text-gray-500">/</span>
    </template>

    <!-- Breadcrumb Item -->
    <template #item="{ item }">
      <span 
        class="relative group inline-flex items-center capitalize"
        :class="{
          'text-primary font-semibold': item.isLast,
          'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200': !item.isLast
        }"
      >
        <!-- Icon (optional) -->
        <UIcon 
          v-if="item.icon" 
          :name="item.icon" 
          class="w-4 h-4 mr-1.5 flex-shrink-0"
          :class="{ 'text-primary': item.isLast }"
        />

        <!-- Label with underline hover effect -->
        <span class="relative">
          {{ item.label }}
          <span 
            class="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300 ease-in-out"
          />
        </span>
      </span>
    </template>

    <!-- Dropdown for nested items -->
    <template #dropdown="{ item }">
      <UDropdownMenu :items="item.children">
        <UButton 
          :icon="item.icon" 
          color="neutral" 
          variant="link"
          :class="{ 'text-primary': item.children?.some(child => child.active) }"
        />
      </UDropdownMenu>
    </template>

  </UBreadcrumb>
</template>