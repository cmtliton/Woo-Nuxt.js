<template>
  <v-container class="py-10">
    <v-row>
      <!-- ১. সাইডবার ফিল্টার (Desktop) -->
      <v-col cols="12" md="3" class="d-none d-md-block">
        <v-card variant="outlined" class="pa-5" rounded="lg">
          <div class="text-h6 font-weight-bold mb-4">Filters</div>

          <!-- ক্যাটাগরি ফিল্টার -->
          <div class="text-subtitle-2 mb-2">Categories</div>
          <v-list density="compact" class="pa-0">
            <v-list-item
              v-for="cat in categories"
              :key="cat.id"
              :active="selectedCategory == cat.id"
              color="primary"
              link
              @click="filterByCategory(cat.id)"
            >
              <v-list-item-title class="text-body-2">
                {{ decodeHtml(cat.name) }} ({{ cat.count }})
              </v-list-item-title>
            </v-list-item>
          </v-list>

          <v-divider class="my-4" />

          <!-- সর্টিং ফিল্টার -->
          <div class="text-subtitle-2 mb-2">Sort By</div>
          <v-select
            v-model="sortBy"
            :items="sortOptions"
            item-title="label"
            item-value="value"
            density="compact"
            variant="outlined"
            hide-details
          />

          <v-btn
            variant="text"
            block
            class="mt-4 text-caption"
            color="error"
            prepend-icon="mdi-refresh"
            @click="resetFilters"
          >
            Reset Filters
          </v-btn>
        </v-card>
      </v-col>

      <!-- ২. মেইন কন্টেন্ট (Product Grid) -->
      <v-col cols="12" md="9">
        <!-- মোবাইল ফিল্টার বাটন (Mobile Only) -->
        <div class="d-flex d-md-none align-center justify-space-between mb-6">
          <v-btn
            prepend-icon="mdi-filter-variant"
            variant="outlined"
            @click="mobileDrawer = true"
          >
            Filters
          </v-btn>
          <div class="text-caption">
            {{ products?.length || 0 }} products found
          </div>
        </div>

        <!-- হেডার ইনফো -->
        <div class="d-none d-md-flex align-center justify-space-between mb-6">
          <v-breadcrumbs :items="breadcrumbs" class="pa-0" />
          <div class="text-caption text-grey">
            {{ products?.length || 0 }} products found
          </div>
        </div>

        <!-- ৩. প্রোডাক্ট গ্রিড -->
        <v-row v-if="!pending && products?.length">
          <v-col
            v-for="product in products"
            :key="product.id"
            cols="12"
            sm="6"
            lg="4"
          >
            <ProductCard
              :product="product"
              @add-to-cart="cartStore.addToCart"
            />
          </v-col>
        </v-row>

        <!-- ৪. লোডিং এবং নো ডাটা স্টেট -->
        <v-row v-else-if="pending">
          <v-col v-for="n in 6" :key="n" cols="12" sm="6" lg="4">
            <v-skeleton-loader type="card, text" />
          </v-col>
        </v-row>

        <v-sheet v-else class="text-center py-16" rounded="lg" border>
          <v-icon
            icon="mdi-magnify-close"
            size="64"
            color="grey"
            class="mb-4"
          />
          <div class="text-h6 text-grey">No products match your criteria.</div>
          <v-btn color="primary" class="mt-4" @click="resetFilters"
            >Clear All</v-btn
          >
        </v-sheet>

        <!-- ৫. পেজিনেশন (Pagination) -->
        <div v-if="products?.length" class="mt-10 d-flex justify-center">
          <v-pagination
            v-model="page"
            :length="5"
            total-visible="5"
            color="primary"
          />
        </div>
      </v-col>
    </v-row>

    <!-- মোবাইল ফিল্টার ড্রয়ার -->
    <v-sheet v-show="mobileDrawer">
      <v-navigation-drawer
        v-model="mobileDrawer"
        temporary
        location="right"
        width="300"
      >
        <div class="pa-4">
          <div class="d-flex justify-space-between align-center mb-4">
            <span class="text-h6">Filters</span>
            <v-btn
              icon="mdi-close"
              variant="text"
              @click="mobileDrawer = false"
            />
          </div>
          <!-- এখানে একই ফিল্টার লজিক থাকবে -->
          <v-list nav>
            <v-list-subheader>Categories</v-list-subheader>
            <v-list-item
              v-for="cat in categories"
              :key="cat.id"
              @click="filterByCategory(cat.id)"
            >
              {{ decodeHtml(cat.name) }}
            </v-list-item>
          </v-list>
        </div>
      </v-navigation-drawer>
    </v-sheet>
  </v-container>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();
const cartStore = useCartStore();

// ১. রিয়্যাক্টিভ স্টেট (Query থেকে Number-এ কনভার্ট করা হয়েছে)
const page = ref(route.query.page ? Number(route.query.page) : 1);
const selectedCategory = ref(
  route.query.category ? Number(route.query.category) : null
);
const sortBy = ref(route.query.sort || "date");
const mobileDrawer = ref(false);

const sortOptions = [
  { label: "Newest First", value: "date" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Popularity", value: "popularity" },
];

// ২. ডাটা গেটার্স
const categories = computed(() => categoriesStore.getCategories);
const products = computed(() => productsStore.filteredProducts);
const pending = computed(() => productsStore.pending);

// ৩. ফিল্টার ফাংশন (মেমোরি থেকে ডাটা কল করার আগে নিশ্চিত করা যে মেইন লিস্ট আছে)
const applyFilters = async () => {
  // যদি মেইন প্রোডাক্ট লিস্ট খালি থাকে (রিলোড এর সময়), তবে আগে ডাটা ফেচ করতে হবে
  if (productsStore.products.length === 0) {
    await productsStore.setProducts();
  }

  await productsStore.fetchFilteredProducts({
    page: page.value,
    category: selectedCategory.value,
    orderby:
      sortBy.value === "price_asc" || sortBy.value === "price_desc"
        ? "price"
        : sortBy.value,
    order: sortBy.value === "price_asc" ? "asc" : "desc",
    per_page: 12,
  });
};

// প্রোডাক্ট ফিল্টার এবং সর্ট পরিবর্তনে স্বয়ংক্রিয় ফেচ
// ৪. ইউআরএল এবং ফিল্টার সিঙ্ক্রোনাইজেশন
watch(
  [page, selectedCategory, sortBy],
  () => {
    applyFilters();
  },
  { immediate: true }
);

// ৫. ক্যাটাগরি ফিল্টার ক্লিক হ্যান্ডলার
const filterByCategory = (id) => {
  selectedCategory.value = Number(id); // নিশ্চিত করা যে এটি নাম্বার
  page.value = 1;
  mobileDrawer.value = false;
  router.push({ query: { ...route.query, category: id, page: 1 } });
};

const resetFilters = () => {
  selectedCategory.value = null;
  sortBy.value = "date";
  page.value = 1;
  router.push({ query: {} });
};

// ব্রেডক্রাম্বস এবং মেটা ট্যাগ আগের মতোই...
const breadcrumbs = [
  { title: "Home", disabled: false, to: "/" },
  { title: "Shop", disabled: true },
];

const decodeHtml = (html) => {
  if (import.meta.server) return html;
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

useSeoMeta({
  title: "Shop Premium Furniture | Modern Home & Office Collection",
  description:
    "Explore our vast collection of sofas, beds, tables, and chairs for your home and office.",
});
</script>

<style scoped>
.v-list-item--active {
  background-color: rgb(var(--v-theme-primary), 0.1);
  font-weight: bold;
}
</style>
