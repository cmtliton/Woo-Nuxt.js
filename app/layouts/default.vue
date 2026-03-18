<template>
  <v-container fluid class="pa-0 ma-0">
    <NavBarsTabByHamBergerMenu />
    <v-main>
      <NuxtPage />
      <HelpDesk />
    </v-main>

    <ScrollToTop />
    <FootersAppFooter />
  </v-container>
</template>
<script setup>
import NavBarsTabByHamBergerMenu from "~/components/NavBars/TabByHamBergerMenu.vue";
import ScrollToTop from "~/components/ScrollToTop.vue";
const categoriesStore = useCategoriesStore();
// ক্যাটাগরি স্টোর ইনিশিয়ালাইজ করা
categoriesStore.getCategories.length === 0
  ? categoriesStore.setCategories()
  : null;
</script>
