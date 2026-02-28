import { useAppConfig } from '#app'

export interface SeoPageOptions {
  title: string
  description: string
  image?: string
  twitterCard?: string
}

/**
 * Composable to set SEO meta tags for a page.
 * Automatically uses logo from appConfig if no image is provided.
 */
export const useSeoPage = (options: SeoPageOptions) => {
  const config = useAppConfig()
  const router = useRouter()
  
  const {
    title,
    description,
    image = config.site.image,
    twitterCard = 'summary_large_image'
  } = options

  const siteUrl = config.site.url || 'https://tera-in.top'
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: imageUrl,
    ogImageSecureUrl: imageUrl,
    ogUrl: `${siteUrl}${router.currentRoute.value.path}`,
    twitterCard,
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: imageUrl
  })

  // Also update the page title in the template
  useHead({
    title
  })
}
