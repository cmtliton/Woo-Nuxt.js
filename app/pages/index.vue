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

const { origin } = useRequestURL() || { origin: "https://emcfurniture.com" }; // আপনার সাইটের ডোমেইন অটোমেটিক পাওয়ার জন্য

useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: "EMC Furniture & Engineering",
        alternateName: "Furniture Design & Manufacturing",
        image: `${origin}/og-home.jpg`,
        url: origin,
        telephone: "+8801301648832",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Konda Mollahbari, Boliarpur",
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
          "CNC Cutting, PEB, Metal Gate, Stair Design, Interior & Furniture Solutions under one roof! We work hard to create products that are beautiful, functional, and built to last.",
        serviceType: [
          "Furniture Design & Manufacturing",
          "CNC Cutting & Metal Fabrication",
          "PEB Structures & Steel Fabrication",
          "Metal Gate Design & Fabrication",
          "CNC Cutting & Metal Fabrication",
          "Luxury Furniture Solutions",
          "Stair Design & Fabrication",
          "Interior Solutions",
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
  // ১. Main SEO Tags
  title: "Premium Modern Furniture in Bangladesh | EMC Furniture",
  description:
    "Discover stylish, durable, and premium home and office furniture at EMC Furniture & Engineering. Shop luxury sofas, beds, TV cabinets, and more online.",

  // ২. Open Graph (Facebook, LinkedIn, WhatsApp, etc.)
  ogType: "website",
  ogUrl: origin,
  ogTitle: "EMC Furniture & Engineering | Best Furniture Store in BD",
  ogDescription:
    "Upgrade your living space with our premium collection of modern furniture. High-quality sofas, beds, and smart storage solutions.",
  ogImage: `${origin}/og-home.jpg`,
  ogSiteName: "EMC Furniture & Engineering",

  // ৩. Twitter Cards (X)
  twitterCard: "summary_large_image",
  twitterTitle: "Premium Modern Furniture | EMC Furniture",
  twitterDescription:
    "Shop our curated collection of high-quality home and office furniture.",
  twitterImage: `${origin}/og-home.jpg`,

  // ৪. Theme Color (Mobile Browser Toolbar Color)
  themeColor: "#3b2822",
});
const productsStore = useProductsStore();
productsStore.setProducts();
</script>
