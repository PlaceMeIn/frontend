import { useRuntimeConfig } from '#app'

export interface SeoPageOptions {
  title: string
  description: string
  image?: string
  type?: string
}

export const useSeoPage = (options: SeoPageOptions) => {
  const config = useRuntimeConfig()
  const route = useRoute()
  const url = useRequestURL()

  const siteUrl = config.public.siteUrl

  const {
    title,
    description,
    image = config.public.socialImage || '/favicon.ico',
    type = 'website'
  } = options

  const imageUrl = image.startsWith('http')
    ? image
    : `${siteUrl}${image}`

  const canonicalUrl = `${siteUrl}${route.path}`

  useSeoMeta({
    title,
    description,

    ogTitle: title,
    ogDescription: description,
    ogImage: imageUrl,
    ogUrl: canonicalUrl,
    ogType: type,

    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: imageUrl
  })

  useHead({
    title,
    link: [
      {
        rel: 'canonical',
        href: canonicalUrl
      }
    ]
  })
}