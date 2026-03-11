// composables/useBreadcrumbs.ts
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export interface BreadcrumbItem {
  label: string
  to?: string
  disabled?: boolean
  isLast: boolean
  icon?: string
}

export const useBreadcrumbs = () => {
  const route = useRoute()

  return computed<BreadcrumbItem[]>(() => {
    const crumbs: BreadcrumbItem[] = []
    const segments = route.path.split('/').filter(Boolean)
    let currentPath = ''

    // Home always first
    crumbs.push({
      label: 'Home',
      to: '/',
      icon: 'i-lucide-home',  // default Home icon
      disabled: segments.length === 0,
      isLast: segments.length === 0
    })

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1

      crumbs.push({
        label: formatSegmentLabel(segment, index),
        to: isLast ? undefined : currentPath,
        disabled: isLast,
        isLast,
        icon: getIconForSegment(segment)
      })
    })

    return crumbs
  })
}

// Assign icons for main sections
const getIconForSegment = (segment: string): string | undefined => {
  const lower = segment.toLowerCase()

  switch (lower) {
    case 'events':
      return 'i-lucide-calendar'
    case 'projects':
      return 'i-lucide-briefcase'
    case 'gallery':
      return 'i-lucide-image'
    default:
      if (/^\d+$/.test(segment)) return 'i-lucide-hash' // IDs
      return undefined
  }
}

function formatSegmentLabel(segment: string, index: number): string {
  if (/^\d+$/.test(segment)) {
    return index === 0 ? `Section ${segment}` : `#${segment}`
  }
  return formatText(segment)
}

// Convert kebab-case, snake_case, or camelCase to Title Case
export function formatText(text: string): string {
  return text
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}