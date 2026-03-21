<template>
  <div>
    
  </div>
</template>

<script lang="ts" setup>
const endpoints = useEndpoints()
const { data: user } = await useFetch(endpoints.user.this(useRouter().param.id), {
  
})

</script>

<style>

</style>