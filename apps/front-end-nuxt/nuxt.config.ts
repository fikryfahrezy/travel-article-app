import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  srcDir: 'app/',
  devtools: { enabled: true },
  runtimeConfig: {
    sessionPassword: process.env.NUXT_SESSION_PASSWORD || '',
    apiBaseURL: process.env.NUXT_API_BASE_URL || '',
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    'nuxt-auth-utils',
    '@pinia/nuxt',
  ],
  fonts: {
    families: [
      {
        name: 'Titillium Web',
        provider: 'google',
        weights: ['200', '300', '400', '600', '700', '900'],
        styles: ['normal', 'italic'],
      },
    ]
  },
  css: [
    './app/assets/css/main.css'
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  // Disable component auto-imports to maintain explicit imports
  components: {
    dirs: [],
  },
  // Disable auto-imports
  imports: {
    autoImport: false,
  },
})