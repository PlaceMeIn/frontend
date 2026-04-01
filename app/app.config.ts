export default defineAppConfig({
  site:{
    name:"MUT TECH CLUB",
    motto:"Innovation Meets Talent",
    title:"Mut Tech Club - Murang'a University",
    description: "",
    image: "",
    icon:"",
    url:"",
    sourceLink:"https://github.com/PlaceMeIn",
    apiBase:"https://backend-render-pcx6.onrender.com",
    // apiBase:"https://chester-penalties-beef-alcohol.trycloudflare.com",

    contact:{
      emails:{
        support:"support.tech@mut.ac.ke",
        contact:[]
      }
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
