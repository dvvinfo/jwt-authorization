// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@vee-validate/nuxt'
  ],
  
  css: ['~/assets/css/main.css'],
  
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000/api',
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'JWT Authorization App',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3001'
    }
  },
  
  app: {
    head: {
      title: process.env.NUXT_PUBLIC_APP_NAME || 'JWT Authorization App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'JWT Authorization Application' }
      ]
    }
  }
})