<template>
  <v-app>
    <NavBarsTabByMegaMenu />
    <v-main>
      <NuxtPage />
    </v-main>
    <FootersAppFooter />
  </v-app>
</template>
<script setup>
const productsStore = useProductsStore();
productsStore.getProducts.length === 0 ? productsStore.setProducts() : null;
</script>
