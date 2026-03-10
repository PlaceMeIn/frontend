<!-- components/ui/EmptyState.vue -->
<template>
  <div class="flex flex-col items-center justify-center text-center py-16">
    <UEmpty
    class=""
      icon="i-lucide-folder-x"
      :title="title"
      :description="description"
      :actions="[
        {
          icon: 'i-lucide-refresh-cw',
          label: 'Reset Filters',
          color: 'neutral',
          variant: 'subtle',
          onClick: emitFn
        },
      ]"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  icon: { type: String, default: "i-lucide-folder-x" },
  title: String,
  description: String,
  action: String,
});


const emit  = defineEmits(["action"]);
function emitFn(){
    emit('action')
}

</script>
