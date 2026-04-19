<template>
  <div>
    <!-- HERO SECTION -->
    <section
      class="relative h-[320px] md:h-[400px] flex flex-col items-center justify-center text-center bg-gradient-to-br from-primary-500/30 to-primary-900/30"
    >
      <div class="z-10 px-6">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-white">
          {{ termsTitle }}
        </h1>
        <p class="mt-3 text-base md:text-lg text-gray-100 max-w-2xl mx-auto">
          Please read our terms and conditions carefully before using our services
        </p>
      </div>

      <div
        class="absolute inset-0 bg-gradient-to-tr from-white/85 dark:from-black/85 via-black/30 dark:via-black/60 to-transparent"
      ></div>
    </section>

    <!-- CONTENT SECTION -->
    <section class="max-w-4xl mx-auto px-6 py-16">
      <!-- LOADING STATE -->
      <div v-if="pending" class="flex items-center justify-center py-20">
        <div class="text-center">
          <UIcon
            name="i-heroicons-arrow-path"
            class="w-12 h-12 text-primary animate-spin mx-auto mb-4"
          />
          <p class="text-muted">Loading terms and policies...</p>
        </div>
      </div>

      <!-- ERROR STATE -->
      <UAlert
        v-if="error"
        color="red"
        icon="i-heroicons-exclamation-triangle"
        title="Failed to Load"
        :description="error"
        class="mb-8"
      />

      <!-- TERMS CONTENT -->
      <div
        v-if="termsContent && !pending && !error"
        class="prose prose-sm dark:prose-invert max-w-none"
      >
        <div v-html="termsContent" />
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
interface TermsResult {
  id: string
  title: string
  content: string
  summary: string
  status: string
  is_active: boolean
}

interface TermsResponse {
  count: number
  results: TermsResult[]
}

definePageMeta({
  layout: 'default'
})

useSeoPage({
  title: 'Terms & Policies',
  description: 'Read our terms and conditions, privacy policy, and other important policies for using MUT Tech Club services.'
})

const endpoints = useEndpoints()

const parseContent = (text: string): string => {
  if (!text) return ''

  // Split by lines first
  const lines = text.split('\n')
  const htmlParts: string[] = []
  let currentSection: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Main title
    if (line.includes('MUT TECH CLUB - TERMS AND CONDITIONS')) {
      if (currentSection.length > 0) {
        processSection(currentSection, htmlParts)
        currentSection = []
      }
      htmlParts.push(`<h1 class="terms-title">${line}</h1>`)
      continue
    }

    // Version line
    if (line.startsWith('Version') && line.includes('Effective Date')) {
      if (currentSection.length > 0) {
        processSection(currentSection, htmlParts)
        currentSection = []
      }
      htmlParts.push(`<p class="terms-version">${line}</p>`)
      continue
    }

    // Numbered section headers
    if (/^\d+\.\s+[A-Z\s&;]+$/.test(line)) {
      if (currentSection.length > 0) {
        processSection(currentSection, htmlParts)
        currentSection = []
      }
      const [num, ...titleParts] = line.split('. ')
      const title = titleParts.join('. ')
      htmlParts.push(`<h2 class="terms-section">${num}. ${title}</h2>`)
      continue
    }

    // Empty lines indicate section breaks
    if (line === '') {
      if (currentSection.length > 0) {
        processSection(currentSection, htmlParts)
        currentSection = []
      }
      continue
    }

    // Add line to current section
    currentSection.push(line)
  }

  // Process any remaining section
  if (currentSection.length > 0) {
    processSection(currentSection, htmlParts)
  }

  return htmlParts.join('\n')
}

// Helper function to process a section of content
const processSection = (sectionLines: string[], htmlParts: string[]) => {
  if (sectionLines.length === 0) return

  // Check if this section has bullet points
  const hasBullets = sectionLines.some(line => line.startsWith('- '))

  if (hasBullets) {
    // Separate text and bullets
    const textLines = sectionLines.filter(line => !line.startsWith('- '))
    const bulletLines = sectionLines.filter(line => line.startsWith('- '))

    // Add text content first (join with spaces, not newlines)
    if (textLines.length > 0) {
      htmlParts.push(`<p class="terms-text">${textLines.join(' ')}</p>`)
    }

    // Add bullet list
    if (bulletLines.length > 0) {
      htmlParts.push('<ul class="terms-list">')
      for (const bullet of bulletLines) {
        const content = bullet.substring(2)
        htmlParts.push(`<li class="terms-list-item">${content}</li>`)
      }
      htmlParts.push('</ul>')
    }
  } else {
    // Check if this is a multi-line paragraph that needs line breaks
    if (sectionLines.length > 1) {
      // Join with <br> tags for multi-line content
      const content = sectionLines.join('<br>')
      htmlParts.push(`<p class="terms-text">${content}</p>`)
    } else {
      // Single line paragraph
      htmlParts.push(`<p class="terms-text">${sectionLines[0]}</p>`)
    }
  }
}

const {
  data: termsData,
  pending,
  error: fetchError
} = await useFetch<TermsResponse>(endpoints.main.terms, {
  server: true,
  default: () => ({ count: 0, results: [] }),
  transform: (data: any) => {
    if (!data || typeof data !== 'object') {
      return { count: 0, results: [] }
    }
    return {
      count: data.count || 0,
      results: Array.isArray(data.results) ? data.results : []
    }
  }
})

const error = computed(() => {
  if (fetchError.value) {
    return typeof fetchError.value === 'string'
      ? fetchError.value
      : fetchError.value.message || 'Failed to load terms and policies'
  }
  if (termsData.value?.results.length === 0) {
    return 'No terms and policies found'
  }
  return null
})

const termsContent = computed(() => {
  const result = termsData.value?.results?.[0]
  if (!result?.content) return ''
  return parseContent(result.content)
})

const termsTitle = computed(() => {
  return termsData.value?.results?.[0]?.title || 'Terms & Policies'
})
</script>

