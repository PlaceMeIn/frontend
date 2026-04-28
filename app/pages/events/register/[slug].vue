<template>
  <div>

    <p v-if="pending">Loading...</p>
    <p v-if="error">Error: {{ error.message }}</p>

    <p>{{ slug }}</p>


    <div>
        <EventRegistrationCard v-if="data" :event="data" />
    </div>
    
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const toast = useToast();
const { copy } = useClipboard();

const slug = computed(() => String(route.params.slug || ""));

const endpoints = useEndpoints();
const { get } = useApi();

const { data, pending, error, refresh } = await useAsyncData(
  `event-${slug.value}`,
  () => get(endpoints.events.list, { slug: slug.value },true),
  { default: () => null },
);

</script>

<style>

</style>