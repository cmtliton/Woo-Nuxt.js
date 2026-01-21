<!-- app/pages/index.vue -->
<template>
  <v-container>
    <HomeHero />
    <HomeTrustFeatures />
    <HomeCategorySection />
    <VideoShowcase />
    <HomeFeaturedSection />

    <v-row v-if="pending">
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="card" />
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col>
        <h1 class="text-h4 py-6">Premium Furniture</h1>
        <LoadMore />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import LoadMore from "~/components/product/loadMore.vue";

//const { fetchProducts } = useProducts();
const route = useRequestURL();
const pending = ref(false);

//const { data: pending } = await fetchProducts({ per_page: 100 });

// SEO Meta
useSeoMeta({
  title: "Luxury Sofas & Beds | Modern Furniture Store",
  description:
    "Shop our curated collection of high-quality furniture for your home.",
  ogImage: `${route.origin}/og-home.jpg`,
});
</script>
