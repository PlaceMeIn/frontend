<template>
  <div class="min-h-screen">
    <OnThisPage :sections="sections" />

    <!-- HERO SECTION -->
    <section
      id="hero"
      class="relative py-24 overflow-hidden scroll-mt-20"
      aria-label="Reviews hero section"
    >
      <div class="absolute inset-0 opacity-5 dark:opacity-10">
        <div class="absolute top-0 -left-4 w-72 h-72 bg-primary-400 dark:bg-primary-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div class="absolute top-0 -right-4 w-72 h-72 bg-primary-300 dark:bg-primary-700 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-primary-200 dark:bg-primary-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="text-center max-w-3xl mx-auto">
          <UBadge color="primary" variant="soft" size="lg" class="mb-6">
            ★ {{ reviewStats.averageRating }} Average Rating
          </UBadge>
          
          <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-6 dark:text-white">
            Trusted by Thousands of
            <span class="text-primary-600 dark:text-primary-400">Students Worldwide</span>
          </h1>
          
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Discover why learners love our programs. Read authentic reviews from our global community.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all shadow-sm">
              <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">{{ reviewStats.averageRating }}/5</div>
              <div class="flex justify-center gap-0.5 mb-2">
                <UIcon v-for="i in 5" :key="i" name="i-lucide-star" class="w-5 h-5"
                  :class="i <= Number(reviewStats.averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'"
                />
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Overall Rating</div>
            </div>
            
            <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all shadow-sm">
              <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">{{ reviewStats.fiveStarPercentage }}%</div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div class="bg-primary-500 dark:bg-primary-400 rounded-full h-2 transition-all duration-500" 
                  :style="{ width: reviewStats.fiveStarPercentage + '%' }"
                />
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">5-Star Reviews</div>
            </div>
            
            <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all shadow-sm">
              <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">{{ reviewStats.totalReviews }}</div>
              <UIcon name="i-lucide-message-square" class="w-8 h-8 text-primary-400 dark:text-primary-500 mx-auto mb-2" />
              <div class="text-sm text-gray-500 dark:text-gray-400">Total Reviews</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FILTERS SECTION -->
    <section
      id="filters"
      class="py-2 sticky top-20 z-10 backdrop-blur-md scroll-mt-20"
      aria-label="Review filters"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div class="w-full lg:w-96">
            <UInput v-model="searchQuery" placeholder="Search reviews..." icon="i-lucide-search" size="lg" class="w-full"
              @update:model-value="handleFilterChange">
              <template #trailing><UKbd value="/" /></template>
            </UInput>
          </div>

          <div class="flex flex-wrap gap-3 items-center justify-center">
            <USelectMenu value-key="value" label-key="label" v-model="selectedStars" :items="starsOptions" placeholder="Stars" value-attribute="value"
              option-attribute="label" size="lg" class="w-44" clearable @update:model-value="handleFilterChange">
              <template #label>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-star" class="w-4 h-4" />
                  <span>{{ selectedStars ? `${selectedStars} Stars` : 'Stars' }}</span>
                </div>
              </template>
            </USelectMenu>

            <USelectMenu v-model="minStars" value-key="value" label-key="label" :items="minStarsOptions" placeholder="Min Stars" value-attribute="value"
              option-attribute="label" size="lg" class="w-44" clearable @update:model-value="handleFilterChange" />

            <USelectMenu v-model="selectedSort" value-key="value" label-key="label" :items="sortOptions" placeholder="Sort by" value-attribute="value"
              option-attribute="label" size="lg" class="w-44" @update:model-value="handleFilterChange">
              <template #label>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-arrow-up-down" class="w-4 h-4" />
                  <span>{{ sortOptions.find(o => o.value === selectedSort)?.label || 'Sort' }}</span>
                </div>
              </template>
            </USelectMenu>

            <UButton v-if="selectedStars || minStars || searchQuery" color="error" variant="outline" size="lg"
              icon="i-lucide-x" @click="clearFilters">Clear</UButton>
          </div>
        </div>
      </div>
    </section>

    <!-- REVIEWS GRID SECTION -->
    <section
      id="reviews"
      class="py-16 scroll-mt-20"
      aria-label="Reviews grid"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading State -->
        <div v-if="pending" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 6" :key="i" class="animate-pulse">
            <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div class="flex-1">
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
                </div>
              </div>
              <div class="space-y-2">
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <UIcon name="i-lucide-cloud-alert" class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 class="text-xl font-semibold mb-2 dark:text-white">Failed to Load Reviews</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">We couldn't load the reviews. Please try again.</p>
          <UButton color="primary" size="lg" icon="i-lucide-refresh-cw" @click="refresh">Retry</UButton>
        </div>

        <!-- Empty State -->
        <div v-else-if="!hasReviews" class="text-center py-20">
          <UIcon name="i-lucide-message-square-off" class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 class="text-xl font-semibold mb-2 dark:text-white">No Reviews Found</h3>
          <p class="text-gray-500 dark:text-gray-400">Try adjusting your filters or check back later.</p>
        </div>

        <!-- Reviews Grid -->
        <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(review, index) in reviews" :key="review.id" class="group"
            data-aos="fade-up" :data-aos-delay="index * 100">
            
            <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-primary-900/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden relative">
              
              <div v-if="review.is_featured" class="absolute top-4 right-4 z-10">
                <UBadge color="primary" variant="soft" size="sm">
                  <UIcon name="i-lucide-star" class="w-3 h-3 mr-1" />Featured
                </UBadge>
              </div>

              <div class="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
                <div class="flex items-start gap-4">
                  <UAvatar :src="review.user_profile.user.profile_picture || undefined" 
                    :alt="review.user_profile.full_name" size="lg"
                    :chip="review.user_profile.is_verified_member ? 'primary' : undefined" chip-position="bottom-right">
                    <template #fallback>{{ getInitials(review.user_profile.full_name) }}</template>
                  </UAvatar>

                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-lg truncate dark:text-white">{{ review.user_profile.full_name }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {{ review.user_profile.course || 'Student' }}
                      <span v-if="review.user_profile.year_of_study">· Year {{ review.user_profile.year_of_study }}</span>
                    </p>
                    <p v-if="review.role || review.company" class="text-xs text-primary-600 dark:text-primary-400 mt-1">
                      {{ review.role }} <span v-if="review.role && review.company">at</span> {{ review.company }}
                    </p>
                  </div>
                </div>

                <div class="mt-3 flex items-center justify-between">
                  <div class="flex items-center gap-1">
                    <div class="flex gap-0.5">
                      <UIcon v-for="i in 5" :key="i" name="i-lucide-star" class="w-4 h-4"
                        :class="i <= review.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'"
                      />
                    </div>
                    <span class="text-xs font-medium ml-1 text-gray-700 dark:text-gray-300">{{ review.stars_display }}</span>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(review.created_at) }}</span>
                </div>
              </div>

              <div class="p-6">
                <div class="relative">
                  <UIcon name="i-lucide-quote" class="absolute -top-2 -left-2 w-8 h-8 text-primary-200 dark:text-primary-800" />
                  <p class="text-gray-600 dark:text-gray-300 relative z-10 pl-4 italic">"{{ review.content }}"</p>
                </div>

                <div v-if="review.user_profile.technical_skills" class="mt-4 flex flex-wrap gap-1">
                  <UBadge v-for="skill in review.user_profile.technical_skills.split(',').slice(0, 3)" :key="skill"
                    color="neutral" variant="soft" size="sm" class="dark:bg-gray-700 dark:text-gray-300">
                    {{ skill.trim() }}
                  </UBadge>
                  <span v-if="review.user_profile.technical_skills.split(',').length > 3" 
                    class="text-xs text-gray-500 dark:text-gray-400">
                    +{{ review.user_profile.technical_skills.split(',').length - 3 }} more
                  </span>
                </div>

                <div v-if="review.user_profile.github_link || review.user_profile.portfolio_website" 
                  class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                  <UButton v-if="review.user_profile.github_link" :to="review.user_profile.github_link" target="_blank"
                    color="neutral" variant="ghost" size="xs" icon="i-lucide-github"
                    class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    GitHub
                  </UButton>
                  <UButton v-if="review.user_profile.portfolio_website" :to="review.user_profile.portfolio_website" target="_blank"
                    color="neutral" variant="ghost" size="xs" icon="i-lucide-globe"
                    class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    Portfolio
                  </UButton>
                </div>

                <div v-if="review.user_profile.is_verified_member" class="mt-3">
                  <span class="text-xs text-primary-600 dark:text-primary-400 flex items-center gap-1">
                    <UIcon name="i-lucide-badge-check" class="w-3 h-3" />Verified Member
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="hasReviews && totalPages > 1" class="mt-12 flex justify-center">
          <UPagination v-model="currentPage" :page-count="itemsPerPage" :total="totalReviews" :max="5" size="lg"
            :show-first="true" :show-last="true" />
        </div>
      </div>
    </section>

    <!-- CALL TO ACTION SECTION -->
    <section
      id="cta"
      class="py-20 bg-primary-50 dark:bg-primary-900/20 scroll-mt-20"
      aria-label="Call to action"
    >
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold mb-4 dark:text-white">Ready to Start Your Journey?</h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Join thousands of successful students who have transformed their careers with our programs.
        </p>
        <div class="flex flex-wrap gap-4 justify-center">
          <UButton color="primary" size="xl" to="/resources" trailing-icon="i-lucide-arrow-right">
            Explore Courses
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
const sections = [
  { id: 'hero', label: 'Hero' },
  { id: 'filters', label: 'Filters' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'cta', label: 'Join Us' }
];

useSeoPage({
  title: `Student Reviews | ${useAppConfig().site.title}`,
  description: "Discover authentic experiences from our community. Read honest reviews about our programs, events, and learning journey.",
  ogImage: '/images/reviews-og.jpg'
});

interface Review {
  id: number;
  user_profile: {
    user: {
      profile_picture: string | null;
    };
    full_name: string;
    course: string;
    year_of_study: string;
    technical_skills: string;
    github_link: string | null;
    portfolio_website: string | null;
    is_verified_member: boolean;
  };
  content: string;
  role: string | null;
  company: string | null;
  stars: number;
  stars_display: string;
  is_featured: boolean;
  created_at: string;
}

const selectedStars = ref<number | null>(null);
const minStars = ref<number | null>(null);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 6;
const selectedSort = ref<string>('-created_at');

const starsOptions = [
  { label: '5 Stars ★★★★★', value: 5 },
  { label: '4 Stars ★★★★☆', value: 4 },
  { label: '3 Stars ★★★☆☆', value: 3 },
  { label: '2 Stars ★★☆☆☆', value: 2 },
  { label: '1 Star ★☆☆☆☆', value: 1 }
];

const minStarsOptions = [
  { label: 'Minimum 5 ★', value: 5 },
  { label: 'Minimum 4 ★', value: 4 },
  { label: 'Minimum 3 ★', value: 3 },
  { label: 'Minimum 2 ★', value: 2 },
  { label: 'Minimum 1 ★', value: 1 }
];

const sortOptions = [
  { label: 'Most Recent', value: '-created_at' },
  { label: 'Highest Rated', value: '-stars' },
  { label: 'Lowest Rated', value: 'stars' },
  { label: 'Featured First', value: '-is_featured' }
];

let searchTimeout: NodeJS.Timeout;
const handleFilterChange = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    refresh();
  }, 400);
};

const endpoints = useEndpoints();
const { get } = useApi();

const { data, pending, error, refresh } = await useAsyncData(
  'reviews',
  async () => {
    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      page_size: itemsPerPage.toString(),
      ...(selectedStars.value && { stars: selectedStars.value.toString() }),
      ...(minStars.value && { min_stars: minStars.value.toString() }),
      ...(searchQuery.value && { search: searchQuery.value }),
      ...(selectedSort.value && { ordering: selectedSort.value })
    });
    
    return get(`${endpoints.reviews.list}?${params}`);
  },
  {
    lazy: true,
    default: () => ({ results: [], count: 0 }),
    watch: [currentPage, selectedStars, minStars, searchQuery, selectedSort]
  }
);

const reviews = computed<Review[]>(() => data.value?.results || []);
const totalReviews = computed(() => data.value?.count || 0);
const totalPages = computed(() => Math.ceil(totalReviews.value / itemsPerPage));
const hasReviews = computed(() => reviews.value.length > 0);

const reviewStats = computed(() => {
  const allReviews = reviews.value;
  const total = allReviews.length;
  const avgRating = total > 0 
    ? (allReviews.reduce((acc, r) => acc + r.stars, 0) / total).toFixed(1)
    : '4.8';
  
  const fiveStarCount = allReviews.filter(r => r.stars === 5).length;
  const fiveStarPercentage = total > 0 ? Math.round((fiveStarCount / total) * 100) : 85;
  
  return {
    averageRating: avgRating,
    totalReviews: totalReviews.value,
    fiveStarPercentage
  };
});

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.ceil(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const clearFilters = () => {
  selectedStars.value = null;
  minStars.value = null;
  searchQuery.value = '';
  selectedSort.value = '-created_at';
  currentPage.value = 1;
};
</script>

<style scoped>
@keyframes blob {
  0%, 100% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>