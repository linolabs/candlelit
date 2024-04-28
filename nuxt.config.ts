// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxt/image"
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
  },
  runtimeConfig: {
    public: {
      SEIUE_PASSPORT_URL: 'https://passport.seiue.com',
      SEIUE_API_URL: 'https://api.seiue.com',
      SEIUE_CHALK_URL: 'https://chalk-c3.seiue.com',
    },
  },
});