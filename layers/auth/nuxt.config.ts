export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["nuxt-auth-utils"],
  runtimeConfig: {
    // Private keys (Server side only)
    // .env এর NUXT_WC_KEY এখানে ম্যাপ হবে
    wcKey: "",
    wcSecret: "",

    // Public keys (Client side accessible)
    public: {
      // .env এর NUXT_PUBLIC_WC_URL এখানে ম্যাপ হবে
      wcUrl: "",
    },
  },
});
