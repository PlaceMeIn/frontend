// plugins/structured-data.ts
export default defineNuxtPlugin(() => {
  useHead({
    script: [
      {
        hid: 'structured-data',
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'MUT Tech Club',
          url: 'https://techclub.mut.ac.ke',
          logo: 'https://techclub.mut.ac.ke/logo.png',
          sameAs: [
            'https://github.com/mut-tech-club',
            'https://twitter.com/muttechclub',
            'https://linkedin.com/company/mut-tech-club',
          ],
          description: 'Official tech community at Murang\'a University of Technology',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Murang\'a',
            addressRegion: 'Murang\'a County',
            addressCountry: 'KE',
          },
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Membership',
            email: 'info@techclub.mut.ac.ke',
          },
        }),
      },
    ],
  });
});