<template>
  <v-container class="py-10">
    <!-- প্রোডাক্ট গ্রিড -->
    <v-row v-if="displayedProducts.length > 0">
      <v-col
        v-for="product in displayedProducts"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <ProductCard-01 :product="product" />
      </v-col>
    </v-row>

    <!-- যদি কোনো প্রোডাক্ট না থাকে -->
    <v-row v-else-if="!pending">
      <v-col cols="12" class="text-center py-16">
        <v-icon icon="mdi-sofa-outline" size="64" color="grey" />
        <p class="mt-4 text-h6 text-grey">No products found.</p>
      </v-col>
    </v-row>

    <!-- লোড মোর বাটন -->
    <div v-if="hasMore" class="text-center mt-12">
      <v-btn
        size="x-large"
        variant="outlined"
        rounded="xl"
        class="px-12 font-weight-bold"
        :style="{ borderColor: '#3b2822', color: '#3b2822' }"
        :loading="loadingMore"
        @click="loadMore"
      >
        LOAD MORE PRODUCTS
      </v-btn>
      <div class="mt-4 text-caption text-grey">
        Showing {{ displayedProducts.length }} of
        {{ allProducts.length }} products
      </div>
    </div>
  </v-container>
</template>

<script setup>
const productsStore = useProductsStore();

// ১. স্টেট: কতটি প্রোডাক্ট বর্তমানে দেখা যাচ্ছে
const displayLimit = ref(12);
const loadingMore = ref(false);

// ২. স্টোর থেকে সব প্রোডাক্ট নেওয়া (আপনার আগের কোড অনুযায়ী সর্টেড লিস্ট)
const allProducts = computed(
  () =>
    productsStore.getProducts.filter((product) => product.featured === false) ||
    [],
);
const pending = computed(() => productsStore.pending);

// ৩. কম্পিউটেড: শুধুমাত্র লিমিট অনুযায়ী প্রোডাক্ট ফিল্টার করা
const displayedProducts = computed(() => {
  return allProducts.value.slice(0, displayLimit.value);
});

// ৪. আরও আছে কি না চেক করা
const hasMore = computed(() => {
  return displayLimit.value < allProducts.value.length;
});

// ৫. লোড মোর ফাংশন
const loadMore = async () => {
  loadingMore.value = true;

  // একটি ছোট ডিলে (Delay) যাতে ইউজার বুঝতে পারে লোড হচ্ছে
  await new Promise((resolve) => setTimeout(resolve, 600));

  displayLimit.value += 12;
  loadingMore.value = false;
};

// পেজ লোড হওয়ার সময় যদি স্টোর খালি থাকে তবে ডাটা ফেচ করা
onMounted(async () => {
  if (allProducts.value.length === 0) {
    await productsStore.setProducts();
  }
});
</script>
