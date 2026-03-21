<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4"
        >
          <UIcon
            name="i-lucide-lightbulb"
            class="w-8 h-8 text-primary-600 dark:text-primary-400"
          />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Share Your Suggestion
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          We value your feedback! Help us improve by sharing your ideas.
        </p>
      </div>

      <!-- Suggestion Form Card -->
      <UCard class="mb-8">
        <form @submit.prevent="submitSuggestion" class="space-y-6">
          <!-- Title Input -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Title
            </label>
            <UInput
              v-model="form.title"
              placeholder="Give your suggestion a clear title"
              size="lg"
              class="w-full"
              :ui="{ rounded: 'rounded-lg' }"
            />
          </div>

          <!-- Category Select -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Category
            </label>
            <USelectMenu
              v-model="form.category"
              :items="categories"
              value-key="value"
              placeholder="Select a category"
              size="lg"
              class="w-full"
            />
          </div>

          <!-- Description Textarea -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Description
            </label>
            <UTextarea
              v-model="form.description"
              placeholder="Describe your suggestion in detail..."
              :rows="5"
              autoresize
              size="lg"
              class="w-full"
            />
          </div>

          <!-- Priority Select -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Priority Level
            </label>
            <div class="flex gap-4">
              <URadioGroup
                indicator="end"
                v-model="form.priority"
                :items="priorities"
                value-key="value"
                orientation="horizontal"
                variant="card"
                default-value="low"
              />
            </div>
          </div>

          <!-- Attachments (Optional) -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Attachments (Optional)
            </label>
            <UInput
              type="file"
              accept="image/*,.pdf"
              class="w-full"
              @change="handleFileUpload"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Upload images or PDFs (max 5MB)
            </p>
          </div>

          <!-- Submit Button -->
          <div class="flex gap-3 pt-4">
            <UButton
              type="submit"
              color="primary"
              size="lg"
              :loading="isSubmitting"
              class="flex-1"
            >
              <UIcon name="i-lucide-send" class="w-4 h-4 mr-2" />
              Submit Suggestion
            </UButton>
            <UButton
              type="button"
              color="neutral"
              variant="outline"
              size="lg"
              @click="resetForm"
            >
              Reset
            </UButton>
          </div>
        </form>
      </UCard>

      <!-- Recent Suggestions Section -->
      <div class="mt-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Suggestions
          </h2>
          <!-- <UButton
            variant="link"
            color="primary"
            class="text-sm"
            @click="viewAllSuggestions"
          >
            View all
            <UIcon name="i-lucide-arrow-right" class="w-4 h-4 ml-1" />
          </UButton> -->
        </div>

        <div class="space-y-4">
          <UCard
            v-for="suggestion in recentSuggestions"
            :key="suggestion.id"
            class="hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <UBadge
                    :color="getCategoryColor(suggestion.category)"
                    variant="soft"
                  >
                    {{ suggestion.category }}
                  </UBadge>
                  <UBadge
                    :color="getPriorityColor(suggestion.priority)"
                    variant="subtle"
                    size="sm"
                  >
                    {{ suggestion.priority }}
                  </UBadge>
                </div>
                <h3
                  class="text-lg font-medium text-gray-900 dark:text-white mb-1"
                >
                  {{ suggestion.title }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  {{ suggestion.description }}
                </p>
                <div class="flex items-center gap-4 mt-3">
                  <div
                    class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400"
                  >
                    <UIcon name="i-lucide-thumbs-up" class="w-4 h-4" />
                    <span>{{ suggestion.votes }}</span>
                  </div>
                  <div
                    class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400"
                  >
                    <UIcon name="i-lucide-message-circle" class="w-4 h-4" />
                    <span>{{ suggestion.comments }}</span>
                  </div>
                  <span class="text-sm text-gray-400 dark:text-gray-500">
                    {{ suggestion.date }}
                  </span>
                </div>
              </div>
              <UButton
                variant="ghost"
                color="neutral"
                size="sm"
                @click="upvoteSuggestion(suggestion.id)"
              >
                <UIcon name="i-lucide-chevron-up" class="w-5 h-5" />
              </UButton>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Success Toast -->
      <UToast
        v-if="showToast"
        :title="toastTitle"
        :description="toastDescription"
        :color="toastColor"
      />
    </div>
  </div>
</template>

<script setup>
const categories = [
  { label: "Feature Request", value: "feature" },
  { label: "Bug Report", value: "bug" },
  { label: "UI/UX Improvement", value: "uiux" },
  { label: "Performance", value: "performance" },
  { label: "Other", value: "other" },
];

const priorities = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const form = ref({
  title: "",
  category: "",
  description: "",
  priority: "medium",
});

const isSubmitting = ref(false);
const showToast = ref(false);
const toastTitle = ref("");
const toastDescription = ref("");
const toastColor = ref("green");

const recentSuggestions = ref([
  {
    id: 1,
    title: "Dark mode improvements",
    category: "uiux",
    priority: "medium",
    description: "Add more contrast in dark mode for better readability",
    votes: 24,
    comments: 8,
    date: "2 days ago",
  },
  {
    id: 2,
    title: "Keyboard shortcuts",
    category: "feature",
    priority: "high",
    description:
      "Add keyboard shortcuts for common actions to improve productivity",
    votes: 42,
    comments: 12,
    date: "5 days ago",
  },
  {
    id: 3,
    title: "Faster load times",
    category: "performance",
    priority: "high",
    description: "Optimize initial page load by implementing code splitting",
    votes: 67,
    comments: 23,
    date: "1 week ago",
  },
]);

const submitSuggestion = async () => {
  if (!form.value.title || !form.value.category || !form.value.description) {
    showNotification("Error", "Please fill in all required fields", "red");
    return;
  }

  isSubmitting.value = true;

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Add to recent suggestions
  recentSuggestions.value.unshift({
    id: Date.now(),
    ...form.value,
    votes: 0,
    comments: 0,
    date: "Just now",
  });

  showNotification("Success!", "Your suggestion has been submitted", "green");
  resetForm();
  isSubmitting.value = false;
};

const resetForm = () => {
  form.value = {
    title: "",
    category: "",
    description: "",
    priority: "medium",
  };
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.size > 5 * 1024 * 1024) {
    showNotification("Error", "File size must be less than 5MB", "red");
    event.target.value = "";
  }
};

const upvoteSuggestion = (id) => {
  const suggestion = recentSuggestions.value.find((s) => s.id === id);
  if (suggestion) {
    suggestion.votes++;
    showNotification("Thanks!", "Your vote has been recorded", "green");
  }
};

const viewAllSuggestions = () => {
  showNotification("Info", "View all suggestions feature coming soon!", "blue");
};

const showNotification = (title, description, color) => {
  toastTitle.value = title;
  toastDescription.value = description;
  toastColor.value = color;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const getCategoryColor = (category) => {
  const colors = {
    feature: "purple",
    bug: "red",
    uiux: "blue",
    performance: "green",
    other: "gray",
  };
  return colors[category] || "gray";
};

const getPriorityColor = (priority) => {
  const colors = {
    low: "green",
    medium: "yellow",
    high: "red",
  };
  return colors[priority] || "gray";
};
</script>
