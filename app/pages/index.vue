<!-- app/pages/index.vue -->
<template>
  <v-container>
    <HomeHero />
    <HomeCategorySection />
    <HomeFeaturedSection />
    <h1 class="text-h4 mb-6">Premium Furniture</h1>

    <v-row v-if="pending">
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="card" />
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="product in productsStore.getProducts"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <ProductCard :product="product" @add-to-cart="cartStore.addToCart" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
//const { fetchProducts } = useProducts();
const cartStore = useCartStore();
const productsStore = useProductsStore();

const pending = ref(false);

//const { data: pending } = await fetchProducts({ per_page: 100 });

// SEO Meta
useSeoMeta({
  title: "Luxury Sofas & Beds | Modern Furniture Store",
  description:
    "Shop our curated collection of high-quality furniture for your home.",
  ogImage: "/og-home.jpg",
});
</script>
