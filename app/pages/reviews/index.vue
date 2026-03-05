<script lang="ts" setup>

useSeoPage({
  title: `Reviews | ${useAppConfig().site.title}`,
  description: "Read what our users and participants say about our projects, events, and experiences.",
});

</script>


<template>
  <section data-aos="fade-up" data-aos-delay="200">
      <HighlightReviews />
    </section>
</template>
