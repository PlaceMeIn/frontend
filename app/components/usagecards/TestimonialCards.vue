<template>
  <div>
    <UBadge :label="review?.event_type" />

    <h2>{{ review?.title }}</h2>

    <div>
      <p><UIcon name=""/> Starting {{ review?.start_date }}</p>
            <p><UIcon name="i-lucide-map-pin"/>  {{ review?.location }}</p>

    </div>
    
  <UButton icon="i-lucide-rocket" size="md" color="primary" variant="solid" label="Register Now" :to="review?.registration_link"/>

  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  review:{} as any
})

</script>

<style>

</style>