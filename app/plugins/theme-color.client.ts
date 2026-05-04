export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()

  const themeColor = computed(() => 
    colorMode.value === 'dark' ? '#020618' : '#ffffff'
  )

  useHead({
    meta: [
      { name: 'theme-color', content: themeColor.value }
    ]
  })

  // Optional: Watch for changes and update meta tag dynamically
  watchEffect(() => {
    useHead({
      meta: [
        { name: 'theme-color', content: themeColor.value }
      ]
    })
  })
})