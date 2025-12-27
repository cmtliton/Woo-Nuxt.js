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
        <v-btn color="primary" variant="flat" class="mt-4" to="/"
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
  { title: "Categories", disabled: false, to: "#" },
  {
    title: category.value ? decodeHtml(category.value.name) : "Loading...",
    disabled: true,
  },
]);

// SEO Meta Tags
useSeoMeta({
  title: () =>
    category.value
      ? `${decodeHtml(category.value.name)} | Luxury Furniture`
      : "Category",
  description: () =>
    category.value?.description || "Explore our exclusive collection.",
  ogTitle: () => category.value?.name,
  ogImage: () => category.value?.image?.src || "/og-default.jpg",
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
