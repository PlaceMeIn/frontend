<template>
  <div>
    <div v-if="loading">
        <LoaderSpinnner />
    </div>
  </div>
</template>

<script lang="ts" setup>
const endpoints = useEndpoints();

const user = ref({} as any);
const { get } = useApi();

const response: any = await get(endpoints.user.profile, {}, true);

if (response) {
  user.value = response?.user;
}
</script>

<style></style>
