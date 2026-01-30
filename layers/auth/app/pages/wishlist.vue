<template>
  <v-container>
    <div class="d-flex align-center mb-6">
      <h2 class="text-h4 font-weight-bold text-brown-darken-4">My Wishlist</h2>
      <v-chip class="ml-4" color="#3b2822" variant="tonal" size="small">
        {{ wishlistStore.items.length }} Items
      </v-chip>
    </div>

    <!-- 1. LOADING STATE -->
    <v-row v-if="pending">
      <v-col v-for="n in 4" :key="n" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="image, article" class="rounded-xl border" />
      </v-col>
    </v-row>

    <!-- 2. EMPTY STATE -->
    <div v-else-if="products.length === 0" class="text-center py-16">
      <v-icon
        icon="mdi-heart-broken"
        size="80"
        color="grey-lighten-2"
        class="mb-4"
      />
      <h3 class="text-h5 text-grey-darken-1 font-weight-bold">
        Your wishlist is empty
      </h3>
      <p class="text-grey mb-6">
        Seems like you haven't found your favorite furniture yet.
      </p>
      <v-btn
        color="#3b2822"
        size="large"
        rounded="xl"
        to="/shop"
        prepend-icon="mdi-shopping-outline"
      >
        Browse Shop
      </v-btn>
    </div>

    <!-- 3. PRODUCT GRID -->
    <v-row v-else>
      <v-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          flat
          border
          rounded="xl"
          class="product-card h-100 d-flex flex-column"
        >
          <!-- Image -->
          <div class="position-relative">
            <v-img
              :src="product.images[0]?.src || '/placeholder.jpg'"
              height="200"
              cover
              class="bg-grey-lighten-4 cursor-pointer"
              @click="ProductRedirect(product.slug)"
            />

            <!-- Remove Button (Top Right) -->
            <v-btn
              icon="mdi-close"
              size="small"
              color="error"
              variant="flat"
              class="position-absolute top-0 right-0 ma-2"
              @click="removeItem(product.id)"
            />
          </div>

          <!-- Content -->
          <v-card-text class="pt-4 flex-grow-1">
            <div
              v-if="product.categories.length"
              class="text-caption text-grey mb-1"
            >
              {{ product.categories[0].name }}
            </div>
            <h3
              class="text-subtitle-1 font-weight-bold mb-2 line-clamp-2"
              style="height: 48px"
            >
              {{ product.name }}
            </h3>

            <div class="d-flex align-center justify-space-between mt-2">
              <span class="text-h6 font-weight-bold text-brown-darken-3">
                ৳{{ formatPrice(product.price) }}
              </span>
              <v-chip
                size="x-small"
                :color="
                  product.stock_status === 'instock' ? 'success' : 'error'
                "
                variant="tonal"
                class="font-weight-bold text-uppercase"
              >
                {{
                  product.stock_status === "instock"
                    ? "In Stock"
                    : "Out of Stock"
                }}
              </v-chip>
            </div>
          </v-card-text>

          <v-divider />

          <!-- Actions -->
          <v-card-actions class="pa-4">
            <v-btn
              block
              color="#3b2822"
              variant="flat"
              rounded="lg"
              prepend-icon="mdi-cart-plus"
              :disabled="product.stock_status !== 'instock'"
              @click="cart.addToCart(product)"
            >
              Add to Cart
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Notification -->
    <v-snackbar v-model="snackbar" location="bottom right" timeout="2000">
      Item removed from wishlist
      <template #actions>
        <v-btn color="pink" variant="text" @click="snackbar = false"
          >Close</v-btn
        >
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { useWishlistStore } from "~/stores/wishlist";

const wishlistStore = useWishlistStore();
const productsStore = useProductsStore();
const cart = useCartStore();
const snackbar = ref(false);

// 1. Initialize Wishlist from LocalStorage
onMounted(async () => {
  wishlistStore.initWishlist();
  if (productsStore.getProducts.length === 0) {
    productsStore.setProducts();
  }
});

// 2. Fetch Data Logic
const products = computed(() => {
  return productsStore.getProducts.filter((product) =>
    wishlistStore.items.includes(product.id),
  );
});

// উইশলিস্টে থাকা আইডিগুলো কমা দিয়ে স্ট্রিং বানিয়ে API তে পাঠাচ্ছি
// const { data: products, pending } = await useAsyncData(
//   "wishlist-products",
//   async () => {
//     if (wishlistStore.items.length === 0) return [];

//     const idsString = wishlistStore.items.join(",");
//     return await $fetch(`/api/products/by-ids?include=${idsString}`);
//   },
//   {
//     watch: [() => wishlistStore.items.length], // আইটেম ডিলেট হলে অটোমেটিক রিফ্রেশ হবে
//   },
// );

// 3. Remove Logic
const removeItem = (id) => {
  wishlistStore.removeFromWishlist(id);
  snackbar.value = true;
  // Note: 'watch' in useAsyncData will automatically trigger a UI update
  // but for instant feedback, we can filter locally too if needed.
};

// Helper
const formatPrice = (price) => parseFloat(price).toLocaleString("en-BD");

const ProductRedirect = (id) => {
  navigateTo(`/products/${id}`);
};

useSeoMeta({ title: "My Wishlist | EMC Furniture" });
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.product-card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}
</style>
