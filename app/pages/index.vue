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

const pending = ref(false);

//const { data: pending } = await fetchProducts({ per_page: 100 });

const { origin } = useRequestURL(); // আপনার সাইটের ডোমেইন অটোমেটিক পাওয়ার জন্য

useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: "EMC Furniture & Engineering",
        alternateName: "Headless Ecommerce & Growth Agency",
        image: `${origin}/og-home.jpg`,
        url: origin,
        telephone: "+8801301648832",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Kond Mollahbari, Boliarpur",
          addressLocality: "Savar",
          addressRegion: "Dhaka",
          postalCode: "1340",
          addressCountry: "BD",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "23.7915", // আপনার লোকেশনের সঠিক ল্যাটিটিউড (ঐচ্ছিক)
          longitude: "90.2600", // আপনার লোকেশনের সঠিক লঙ্গিটিউড (ঐচ্ছিক)
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Saturday",
            "Sunday",
          ],
          opens: "10:00",
          closes: "20:00",
        },
        sameAs: [
          "https://www.facebook.com/emcfurnitureandengineering/",
          "http://m.me/emcfurnitureandengineering",
        ],
        description:
          "Headless WooCommerce Expert & Luxury Furniture Manufacturer. We provide Nuxt.js ecommerce solutions, high-converting landing pages, and advanced Google Analytics tracking with Facebook Marketing.",
        serviceType: [
          "Headless WooCommerce Store Design",
          "High-Converting Landing Page Design",
          "Facebook Ads & Digital Marketing",
          "Google Analytics 4 & Conversion Tracking",
          "CNC Cutting & Metal Fabrication",
          "Luxury Furniture Solutions",
        ],
        founder: {
          "@type": "Person",
          name: "Habib", // এখানে আপনার নাম দিন
        },
      }),
    },
  ],
});

// SEO Meta
useSeoMeta({
  title: "Luxury Sofas & Beds | Modern Furniture Store",
  description:
    "Shop our curated collection of high-quality furniture for your home.",
  ogImage: `${origin}/og-home.jpg`,
});
</script>
