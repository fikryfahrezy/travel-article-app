// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'my-auth',
  },
  srcDir: 'app/',
  // Disable component auto-imports to maintain explicit imports
  components: {
    dirs: [],
  },
  // Disable auto-imports
  imports: {
    autoImport: false,
  },
})