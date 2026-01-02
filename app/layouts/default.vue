<template>
  <v-app>
    <NavBarsByTab />
    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>
<script setup>
const productsStore = useProductsStore();
productsStore.getProducts.length === 0 ? productsStore.setProducts() : null;
</script>
