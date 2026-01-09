<template>
  <v-app>
    <GlobalLoader />
    <NuxtLayout>
      <!-- :key="route.fullPath" যোগ করার ফলে ইউআরএল চেঞ্জ হলে পেজ রিলোড হবে -->
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>
<script setup>
const categoriesStore = useCategoriesStore();
// ক্যাটাগরি স্টোর ইনিশিয়ালাইজ করা
categoriesStore.getCategories.length === 0
  ? categoriesStore.setCategories()
  : null;
</script>
<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
