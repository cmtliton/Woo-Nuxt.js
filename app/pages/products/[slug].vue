<template>
  <v-container v-if="product" class="py-5 py-md-10">
    <!-- ১. ব্রেডক্রাম্বস (Breadcrumbs) -->
    <v-breadcrumbs :items="breadcrumbs" class="px-0 text-caption mb-4">
      <template #divider>
        <v-icon icon="mdi-chevron-right" size="x-small" />
      </template>
    </v-breadcrumbs>

    <v-row>
      <!-- ২. বাম পাশ: ইমেজ গ্যালারি -->
      <v-col cols="12" md="6">
        <v-card variant="flat" border class="position-relative overflow-hidden">
          <!-- Sale Badge -->
          <v-chip
            v-if="product.on_sale"
            color="primary"
            class="position-absolute ma-4 font-weight-bold"
            style="z-index: 2; top: 0; left: 0"
            size="small"
          >
            Sale!
          </v-chip>

          <!-- মেইন ইমেজ -->
          <div class="position-relative">
            <GlobalLoader v-show="imageLoading" />
            <NuxtImg
              :src="selectedImage || product.images[0]?.src"
              :alt="product.name"
              preload
              fetchpriority="high"
              loading="eager"
              format="webp"
              width="600"
              height="600"
              fit="contain"
              class="bg-grey-lighten-4 w-100 h-100 transition-fade"
              :placeholder="[50, 50, 75, 5]"
            />
          </div>
        </v-card>

        <!-- থাম্বনেইল গ্যালারি -->
        <v-row class="mt-2" dense>
          <v-col v-for="(img, i) in product.images" :key="i" cols="3" sm="2">
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                border
                :elevation="isHovering ? 4 : 0"
                class="cursor-pointer"
                @click="selectedImage = img.src"
              >
                <NuxtImg
                  :src="img.src"
                  width="100"
                  height="100"
                  aspect-ratio="1"
                  fit="cover"
                  format="webp"
                  class="w-100 h-100"
                  loading="lazy"
                />
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-col>

      <!-- ৩. ডান পাশ: প্রোডাক্ট ইনফো -->
      <v-col cols="12" md="6" class="ps-md-10">
        <h2 class="text-h3 mb-2">{{ product.name }}</h2>
        <v-rating v-model="rating" density="compact" color="orange" readonly />
        <!-- প্রাইস সেকশন -->
        <div class="d-flex align-center mb-4">
          <span
            v-if="product.on_sale"
            class="text-h6 text-grey-darken-1 text-decoration-line-through mr-2"
          >
            ৳{{ product.regular_price }}
          </span>
          <span class="text-h5 text-primary font-weight-black">
            ৳{{ product.price }}
          </span>
        </div>

        <p
          class="text-caption text-grey-darken-2 mb-6"
          style="line-height: 1.4"
        >
          <strong>Disclaimer:</strong> The actual color of the physical product
          may slightly vary due to the deviation of lighting sources,
          photography or your device display settings.
        </p>

        <!-- কোয়ান্টিটি ও অ্যাড টু কার্ট -->
        <div class="d-flex align-center mb-6 flex-wrap gap-4">
          <v-sheet
            border
            rounded
            class="d-flex align-center px-2 mr-4"
            height="48"
          >
            <v-btn
              icon="mdi-minus"
              variant="text"
              size="small"
              @click="quantity > 1 ? quantity-- : null"
            />
            <span class="px-4 font-weight-bold">{{ quantity }}</span>
            <v-btn
              icon="mdi-plus"
              variant="text"
              size="small"
              @click="quantity++"
            />
          </v-sheet>

          <v-btn
            color="#3b2822"
            size="large"
            prepend-icon="mdi-cart"
            class="flex-grow-1 flex-md-grow-0 px-10"
            flat
            @click="addToCart"
          >
            Add to cart
          </v-btn>
        </div>

        <!-- ক্যাটাগরি ও ট্যাগ -->
        <v-divider class="mb-4" />
        <div class="text-caption mb-1">
          <span class="font-weight-bold">Categories:</span>
          <span v-for="(cat, i) in product.categories" :key="cat.id">
            {{ cat.name }}{{ i < product.categories.length - 1 ? ", " : "" }}
          </span>
        </div>
        <div v-if="product.tags?.length" class="text-caption">
          <span class="font-weight-bold">Tag:</span> {{ product.tags[0].name }}
        </div>
      </v-col>
    </v-row>

    <!-- ৪. নিচের অংশ: ডেসক্রিপশন এবং রিভিউ ট্যাব -->
    <v-row class="mt-10">
      <v-col cols="12">
        <v-tabs v-model="tab" color="primary" border-b>
          <v-tab value="desc" class="text-capitalize">Description</v-tab>
          <v-tab value="reviews" class="text-capitalize">Reviews (0)</v-tab>
        </v-tabs>

        <v-window v-model="tab" class="pt-6">
          <v-window-item value="desc">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="product-description" v-html="sanitizedDescription" />
          </v-window-item>

          <v-window-item value="reviews">
            <p class="text-body-2">There are no reviews yet.</p>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>

  <!-- লোডিং স্টেট -->
  <v-container v-else-if="pending" class="py-16 text-center">
    <v-progress-circular indeterminate color="primary" size="64" />
  </v-container>
</template>

<script setup>
import { sanitizeHtml } from "~/utils/sanitizeHtml";
//const { fetchProductBySlug } = useProducts();
const route = useRoute();
const cartStore = useCartStore();
const productsStore = useProductsStore();
const pending = ref(false);
const product = computed(() => {
  const slug = route.params.slug;
  return productsStore.getProductsBySlug(slug);
});

const quantity = ref(1);
const tab = ref("desc");
const selectedImage = ref(null);
const rating = ref(0);
const imageLoading = ref(false);

// Preload the main image to improve LCP (Largest Contentful Paint)
useHead({
  link: [
    {
      rel: "preload",
      as: "image",
      href: product.value?.images[0]?.src,
      imagesrcset: product.value?.images[0]?.srcset, // If available
    },
  ],
});

watch(product, (p) => {
  rating.value = p?.average_rating ? Number(p.average_rating) : 0;
});

// Sanitized HTML for the product description
const sanitizedDescription = computed(() => {
  return sanitizeHtml(
    product.value?.description || product.value?.short_description || ""
  );
});

const breadcrumbs = computed(() => [
  { title: "Home", disabled: false, to: "/" },
  { title: "Shop", disabled: false, to: "/shop" },
  { title: product.value?.name || "Product", disabled: true },
]);

const addToCart = () => {
  cartStore.addToCart({ ...product.value, quantity: quantity.value });
  // আপনি চাইলে এখানে একটি Snackbar বা নোটিফিকেশন দেখাতে পারেন
};

useSeoMeta({
  title: () =>
    product.value ? `${product.value.name} | Luxury Furniture` : "Loading...",
  ogDescription: () =>
    product.value?.short_description?.replace(/<[^>]*>?/gm, ""),
  ogImage: product.value?.images[0]?.src,
});
</script>

<style scoped>
.product-description :deep(h2) {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}
.product-description :deep(ul) {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}
.product-description :deep(li) {
  margin-bottom: 0.5rem;
  color: #444;
}
.gap-4 {
  gap: 16px;
}
</style>
