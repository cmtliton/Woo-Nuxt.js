<template>
  <v-container class="py-10">
    <!-- ১. ব্রেডক্রাম্বস (Breadcrumbs) -->
    <v-breadcrumbs :items="breadcrumbs" class="px-0 text-caption mb-4">
      <template #divider>
        <v-icon icon="mdi-chevron-right" size="x-small" />
      </template>
    </v-breadcrumbs>

    <div v-if="category">
      <!-- ২. ক্যাটাগরি হেডার -->
      <header class="mb-10">
        <h1 class="text-h4 font-weight-bold mb-2 text-capitalize">
          {{ decodeHtml(category.name) }}
        </h1>
        <p v-if="category.description" class="text-body-1 text-grey-darken-1">
          {{ decodeHtml(category.description) }}
        </p>
        <v-divider class="mt-6" />
      </header>

      <!-- ৩. প্রোডাক্ট গ্রিড -->
      <v-row v-if="products && products.length > 0">
        <v-col
          v-for="product in products"
          :key="product.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <!-- আপনার আগে তৈরি করা ProductCard কম্পোনেন্ট -->
          <ProductCard
            :product="product"
            @add-to-cart="useCartStore().addToCart"
          />
        </v-col>
      </v-row>

      <!-- ৪. যদি প্রোডাক্ট না থাকে -->
      <v-sheet v-else class="text-center py-16" rounded="lg" border>
        <v-icon
          icon="mdi-sofa-outline"
          size="64"
          color="grey-lighten-1"
          class="mb-4"
        />
        <div class="text-h6 text-grey">No products found in this category.</div>
        <v-btn color="primary" variant="flat" class="mt-4" to="/category"
          >Back to Shop</v-btn
        >
      </v-sheet>
    </div>

    <!-- ৫. লোডিং স্টেট -->
    <v-row v-else-if="pending">
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="card, text" />
      </v-col>
    </v-row>

    <!-- ৬. এরর স্টেট -->
    <v-alert v-else type="error" variant="tonal" class="mt-10">
      Failed to load category. Please try again later.
    </v-alert>
  </v-container>
</template>

<script setup>
const route = useRoute();
const categoriesStore = useCategoriesStore();
const slug = route.params.slug;
const category = categoriesStore.getCategoriesBySlug(slug);
const catPending = ref(false);
const products = computed(() => {
  const productsStore = useProductsStore();
  return productsStore.getProductsByCategory(category.id);
});
const prodPending = ref(false);
const pending = computed(() => catPending.value || prodPending.value);

// ব্রেডক্রাম্বস ডাটা
const breadcrumbs = computed(() => [
  { title: "Home", disabled: false, to: "/" },
  { title: "Categories", disabled: false, to: "/category" },
  {
    title: category.value ? decodeHtml(category.value.name) : "Loading...",
    disabled: true,
  },
]);

// SEO Meta Tags
const { origin } = useRequestURL(); // এটি আপনার সাইটের ডোমেইন (http://localhost:3000 বা https://site.com) নিয়ে আসবে

useSeoMeta({
  // ১. টাইটেল ফিক্স
  title: () =>
    category.value
      ? `${decodeHtml(category.value.name)} | Luxury Furniture`
      : "Category",

  // ২. ডেসক্রিপশন থেকে HTML ট্যাগ মুছে ফেলা
  description: () => {
    const desc =
      category.value?.description ||
      "Explore our exclusive collection of luxury furniture.";
    return desc.replace(/<[^>]*>?/gm, "").trim(); // এটি <p>, <b> ইত্যাদি ট্যাগ রিমুভ করবে
  },

  // ৩. ওপেন গ্রাফ (Facebook/WhatsApp) সেটিংস
  ogTitle: () =>
    category.value ? decodeHtml(category.value.name) : "Category",

  ogDescription: () => {
    const desc =
      category.value?.description || "Explore our exclusive collection.";
    return desc.replace(/<[^>]*>?/gm, "").trim();
  },

  // ৪. ইমেজ ইউআরএল ফিক্স (অবশ্যই Absolute URL হতে হবে)
  ogImage: () => {
    const imgSrc = category.value?.image?.src;
    // যদি ইমেজ থাকে তবে সেটি দেখাবে, না থাকলে আপনার লোকাল /og-default.jpg ডোমেইনসহ দেখাবে
    return imgSrc || `${origin}/og-home.jpg`;
  },

  // ৫. টুইটার কার্ড (সোশ্যাল মিডিয়া প্রিভিউ বড় দেখানোর জন্য)
  twitterCard: "summary_large_image",
  twitterTitle: () =>
    category.value ? decodeHtml(category.value.name) : "Category",
  twitterImage: () => category.value?.image?.src || `${origin}/og-home.jpg`,
});

// HTML Entity ডিকোডিং ফাংশন
function decodeHtml(html) {
  if (import.meta.server) return html;
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
</script>

<style scoped>
.v-breadcrumbs :deep(.v-breadcrumbs-item--disabled) {
  opacity: 1;
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}
</style>
