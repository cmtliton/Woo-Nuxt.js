// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "vuetify-nuxt-module",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
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
  // routeRules: {
  //   // Product listing: Cache for 1 hour, refresh in background
  //   "/products/**": { swr: 3600 },
  //   "/shop/**": { swr: 3600 },
  //   // Homepage: Cache for 12 hours
  //   "/": { swr: 4320 },
  //   // Category pages: ISR (Incremental Static Regeneration)
  //   "/category/**": { isr: 3600 },
  //   // Cart and Checkout: Never cache
  //   "/checkout/**": { ssr: false },
  // },
  image: {
    // আপনার ওয়ার্ডপ্রেস ডোমেইন এখানে দিন
    domains: ["emcfurniture.com"],

    // Netlify-এর জন্য 'ipx' হলো ডিফল্ট প্রোভাইডার
    provider: "ipx",
  },
});
