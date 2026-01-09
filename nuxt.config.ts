// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "vuetify-nuxt-module",
    "@nuxt/image",
    "@nuxt/eslint",
  ],
  runtimeConfig: {
    // Keys here are server-side only
    wcKey: "",
    wcSecret: "",
    public: {
      // Keys here are exposed to the client
      wcUrl: "",
    },
  },
  build: {
    transpile: ["@woocommerce/woocommerce-rest-api"],
  },
  nitro: {
    // Nitro কে নিশ্চিত করুন যেন এটি সঠিকভাবে ইমপোর্ট হয়
    externals: {
      inline: ["@woocommerce/woocommerce-rest-api"],
    },
  },
  image: {
    domains: ["emcfurniture.com"],
    // Use format: ['webp', 'avif'] to automatically convert heavy JPEGs
    format: ["webp"],
    quality: 80,
    provider: "ipx",
  },
});
