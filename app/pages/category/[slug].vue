<template>
  <v-container class="py-10">
    <!-- ১. ব্রেডক্রাম্বস -->
    <v-breadcrumbs :items="breadcrumbs" class="px-0 text-caption mb-4">
      <template #divider>
        <v-icon icon="mdi-chevron-right" size="x-small" />
      </template>
    </v-breadcrumbs>

    <!-- ২. ক্যাটাগরি ডাটা থাকলে দেখাবে -->
    <div v-if="category">
      <header class="mb-10">
        <h1 class="text-h4 font-weight-bold mb-2 text-capitalize">
          {{ decodeHtml(category.name) }}
        </h1>
        <div v-if="category.description" class="text-body-1 text-grey-darken-1">
          <!-- WooCommerce ডেসক্রিপশনে HTML থাকে তাই v-html নিরাপদ -->
          <div>{{ sanitizeHtml(category.description) }}</div>
        </div>
        <v-divider class="mt-6" />
      </header>

      <!-- ৩. প্রোডাক্ট গ্রিড -->
      <v-row v-if="categoryProducts && categoryProducts.length > 0">
        <v-col
          v-for="product in categoryProducts"
          :key="product.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <ProductCard :product="product" @add-to-cart="cartStore.addToCart" />
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
        <v-btn color="primary" variant="flat" class="mt-4" to="/shop"
          >Back to Shop</v-btn
        >
      </v-sheet>
    </div>

    <!-- ৫. লোডিং স্টেট (যখন ডাটা এখনো আসেনি) -->
    <v-row v-else-if="pending">
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="card, text" />
      </v-col>
    </v-row>

    <!-- ৬. এরর বা নট ফাউন্ড স্টেট -->
    <v-alert v-else type="error" variant="tonal" class="mt-10">
      Category not found or failed to load.
    </v-alert>
  </v-container>
</template>

<script setup>
import { sanitizeHtml } from "~/utils/sanitizeHtml";

const route = useRoute();
const categoriesStore = useCategoriesStore();
const productsStore = useProductsStore();
const cartStore = useCartStore();

// ১. ক্যাটাগরিকে 'computed' করতে হবে যাতে ইউআরএল চেঞ্জ হলে এটি আপডেট হয়
const category = computed(() => {
  return categoriesStore.getCategoriesBySlug(route.params.slug);
});

// ২. প্রোডাক্ট ফিল্টারিং (category.value চেক করে নিতে হবে)
const categoryProducts = computed(() => {
  if (!category.value) return [];
  return productsStore.getProductsByCategory(category.value.id);
});

// ৩. পেন্ডিং স্টেট হ্যান্ডলিং
const pending = computed(
  () => categoriesStore.pending || productsStore.pending
);

// ৪. ব্রেডক্রাম্বস ডাটা (category.value দিয়ে চেক করা হয়েছে)
const breadcrumbs = computed(() => [
  { title: "Home", disabled: false, to: "/" },
  { title: "Categories", disabled: false, to: "/category" },
  {
    title: category.value ? decodeHtml(category.value.name) : "Loading...",
    disabled: true,
  },
]);

// ৫. SEO Meta Tags
useSeoMeta({
  title: () =>
    category.value
      ? `${decodeHtml(category.value.name)} | Luxury Furniture`
      : "Category",
  description: () => {
    const desc =
      categoryProducts.value?.description || "Explore our collection.";
    return desc.replace(/<[^>]*>?/gm, "").trim();
  },
});
defineOgImageComponent("NuxtSeo", {
  title: () =>
    category.value
      ? `${decodeHtml(category.value.name)} | Luxury Furniture`
      : "Category",
  description: () => {
    const desc =
      categoryProducts.value?.description || "Explore our collection.";
    return desc.replace(/<[^>]*>?/gm, "").trim();
  },
  colorMode: "dark",
});

// HTML Entity ডিকোডিং ফাংশন
function decodeHtml(html) {
  if (!html) return "";
  if (import.meta.server) return html.replace(/&amp;/g, "&"); // সার্ভার সাইড সিম্পল রিপ্লেস
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
