<!-- app/components/GlobalLoader.vue -->
<template>
  <v-overlay
    v-model="loading"
    persistent
    class="align-center justify-center"
    scrim="white"
    style="opacity: 0.8; z-index: 9999"
  >
    <div class="text-center">
      <!-- ফার্নিচার সাইটের জন্য একটি সুন্দর লোডার -->
      <v-progress-circular indeterminate color="primary" size="64" width="6" />
      <div class="mt-4 text-h6 font-weight-bold text-primary">
        EMC Furniture...
      </div>
    </div>
  </v-overlay>
</template>

<script setup>
const nuxtApp = useNuxtApp();
const loading = ref(false);

// Nuxt Hooks ব্যবহার করে লোডার কন্ট্রোল করা
nuxtApp.hook("page:start", () => {
  loading.value = true;
});

nuxtApp.hook("page:finish", () => {
  loading.value = false;
});

// এরর হলেও লোডার বন্ধ করে দেওয়া ভালো
nuxtApp.hook("app:error", () => {
  loading.value = false;
});
</script>
