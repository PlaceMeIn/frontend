<template>
  <div>
    <pre>
        Slug: {{ slug }}
        Data: {{ data }}
        Pending: {{ pending }}
        Error: {{ error }}  


        data : {{ data }}
    </pre>
  </div>
</template>

<script lang="ts" setup>
// definePageMeta({ layout: "gallery" })

const route = useRoute()
const slug = computed(() => route.params.slug as string)    
const LIMIT = 10;
const MAX_GALLERY_ITEMS = 50;

const offset = ref(0);
const totalCount = ref(0);

const gallery = ref<any[]>([]);
const loadingMore = ref(false);

const {get}  = useApi()
const endpoints = useEndpoints()

// MAIN GALLERY FETCH
const { data, pending, error, refresh } = await useAsyncData(
  `${slug.value} gallery`,
  () => get(endpoints.gallery.event, { event_slug: slug.value, event_name: slug.value, limit: LIMIT, offset: offset.value }),
  {
    default: () => ({
      results: [],
      count: 0,
      has_more: false,
      next_offset: 0,
    }),
  },
);


</script>

<style>

</style>