<template>
  <v-container fluid class="pa-0 ma-0">
    <NavBarsTabByHamBergerMenu />
    <v-main>
      <NuxtPage />
    </v-main>
    <HelpDesk />
    <FootersAppFooter />
  </v-container>
</template>
<script setup>
import NavBarsTabByHamBergerMenu from "~/components/NavBars/TabByHamBergerMenu.vue";
const productsStore = useProductsStore();
productsStore.getProducts.length === 0 ? productsStore.setProducts() : null;
</script>
