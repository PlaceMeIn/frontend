export default defineAppConfig({
  site: {
    name: "MUT TECH CLUB",
    motto: "Innovation Meets Talent",
    title: "Mut Tech Club - Murang'a University",
    description: "",
    image: "",
    icon: "",
    url: "",
    sourceLink: "https://github.com/PlaceMeIn",
    apiBase: "https://hugh-wichita-par-wealth.trycloudflare.com",
    // apiBase:"http://192.168.100.7:8080",

    contact: {
      emails: {
        support: "support.tech@mut.ac.ke",
        general: "general@mut.ac.ke"
      },
      phones: {
        support: "+254 700 000 000",
        general: "+254 700 000 001"
      }
    },
    contactInfo: [
      {
        name: "email",
        icon: "i-lucide-mail",
        data: ["info@muttechclub.ac.ke", "leadership@muttechclub.ac.ke"],
      },
      {
        name: "phone",
        icon: "i-lucide-phone",
        data: ["+254 700 000 000", "+254 111 111 111"],
      },
      {
        name: "location",
        icon: "i-lucide-map-pin",
        data: ["Murang'a University of Technology", "Murang'a, Kenya"],
      },
    ],
    socialLinks: [
      {
        name: "Facebook",
        username: "muttechclub",
        icon: "i-lucide-facebook",
        url: "https://facebook.com/muttechclub",
      },
      {
        name: "Twitter",
        username: "@muttechclub",
        icon: "i-lucide-twitter",
        url: "https://twitter.com/muttechclub",
      },
      {
        name: "LinkedIn",
        username: "MUT Tech Club",
        icon: "i-lucide-linkedin",
        url: "https://linkedin.com/company/muttechclub",
      },
      {
        name: "GitHub",
        username: "muttechclub",
        icon: "i-lucide-github",
        url: "https://github.com/muttechclub",
      },
    ],
    officeHours: {
      duringSemester: [
        { day: "Monday – Friday", hours: "9:00 AM – 5:00 PM" },
        { day: "Saturday", hours: "10:00 AM – 2:00 PM" },
        { day: "Sunday", hours: "Closed", closed: true },
      ],
      holidays: [
        { day: "Monday – Friday", hours: "10:00 AM – 3:00 PM" },
        { day: "Saturday – Sunday", hours: "Closed", closed: true },
      ],
      location: "Tech Hub, Ground Floor, Main Campus Building",
      virtualNote: "*Virtual office hours available"
    }

  },
  global: {

  },
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'neutral'
    },

  },
  footer: {
    credits: ` © ${new Date().getFullYear()}`,
    colorMode: true,
    links: [{
      'icon': 'i-simple-icons-discord',
      'to': 'https://go.nuxt.com/discord',
      'target': '_blank',
      'aria-label': 'Nuxt on Discord'
    }, {
      'icon': 'i-simple-icons-x',
      'to': 'https://go.nuxt.com/x',
      'target': '_blank',
      'aria-label': 'Nuxt on X'
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/nuxt/ui',
      'target': '_blank',
      'aria-label': 'Nuxt UI on GitHub'
    }]
  }
})
