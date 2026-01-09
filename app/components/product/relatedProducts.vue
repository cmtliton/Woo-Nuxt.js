<template>
  <v-container v-if="relatedProducts.length > 0" class="py-10">
    <!-- ১. সেকশন টাইটেল -->
    <div class="d-flex align-center mb-8">
      <h2 class="text-h4 font-weight-bold" :style="{ color: brandColor }">
        Related Products
      </h2>
      <v-spacer />
      <v-btn
        variant="text"
        color="primary"
        class="font-weight-bold"
        to="/shop"
        append-icon="mdi-arrow-right"
      >
        View All
      </v-btn>
    </div>

    <!-- ২. প্রোডাক্ট গ্রিড -->
    <v-row>
      <v-col
        v-for="product in relatedProducts"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <!-- আপনার আগের তৈরি করা ProductCard কম্পোনেন্ট -->
        <ProductCard :product="product" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useProductsStore } from "~/stores/useProductsStore";

// ১. Props এর মাধ্যমে বর্তমান প্রোডাক্টটি গ্রহণ করা
const props = defineProps({
  currentProduct: {
    type: Object,
    required: true,
  },
});

const brandColor = "#3b2822";
const productsStore = useProductsStore();

// ২. রিলেটেড প্রোডাক্ট লজিক
const relatedProducts = computed(() => {
  // বর্তমান প্রোডাক্টের মেইন ক্যাটাগরি আইডি নেওয়া
  const categoryId = props.currentProduct.categories?.[0]?.id;

  if (!categoryId) return [];

  // পিনিয়া স্টোর থেকে ওই ক্যাটাগরির সব প্রোডাক্ট আনা
  return (
    productsStore
      .getProductsByCategory(categoryId)
      // বর্তমান প্রোডাক্টটি লিস্ট থেকে বাদ দেওয়া (যাতে নিজে নিজেকে না দেখায়)
      .filter((p) => p.id !== props.currentProduct.id)
      // সর্বোচ্চ ৪টি প্রোডাক্ট দেখানো
      .slice(0, 4)
  );
});

// ৩. যদি স্টোর খালি থাকে তবে ডাটা লোড করা
onMounted(async () => {
  if (productsStore.products.length === 0) {
    await productsStore.setProducts();
  }
});
</script>

<style scoped>
/* টাইটেলের নিচে একটি ছোট কালার বর্ডার */
h2 {
  position: relative;
  padding-bottom: 10px;
}
h2::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 4px;
  background-color: #3b2822;
  border-radius: 2px;
}
</style>
