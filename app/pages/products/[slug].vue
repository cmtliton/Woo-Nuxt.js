<template>
  <v-container v-if="product" class="py-2 py-md-2">
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
              v-if="product?.images?.length"
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
          <v-col v-for="(img, i) in product?.images" :key="i" cols="3" sm="2">
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
                  width="62"
                  height="62"
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
        <h2 class="text-h3 mb-2">{{ product?.name }}</h2>
        <v-rating v-model="rating" density="compact" color="orange" readonly />
        <!-- প্রাইস সেকশন -->
        <div class="d-flex align-center mb-4">
          <span
            v-if="product?.on_sale"
            class="text-h6 text-grey-darken-1 text-decoration-line-through mr-2"
          >
            ৳{{ product?.regular_price }}
          </span>
          <span class="text-h5 text-primary font-weight-black">
            ৳{{ product?.price }}
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
            :loading="cartStore.isAdding"
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
          <span class="font-weight-bold">Tag:</span> {{ product?.tags[0].name }}
        </div>

        <!--- ***************Social Share ***************-->
        <v-divider class="my-4" />
        <div class="d-flex align-center flex-wrap gap-2">
          <span
            class="text-subtitle-2 font-weight-bold mr-2"
            style="color: #3b2822"
          >
            Share with friends:
          </span>

          <v-btn
            v-for="social in shareLinks"
            :key="social.name"
            :icon="social.icon"
            :color="social.color"
            variant="tonal"
            size="small"
            class="share-btn ma-1"
            @click="shareProduct(social.url)"
          >
            <v-icon size="20">{{ social.icon }}</v-icon>
            <v-tooltip activator="parent" location="top">
              Share on {{ social.name }}
            </v-tooltip>
          </v-btn>

          <!-- কপি লিংক বাটন -->
          <v-btn
            icon="mdi-link-variant"
            variant="tonal"
            size="small"
            color="grey-darken-2"
            class="share-btn"
            @click="copyToClipboard"
          >
            <v-icon size="20">mdi-link-variant</v-icon>
            <v-tooltip activator="parent" location="top">Copy Link</v-tooltip>
          </v-btn>
        </div>
        <!-- ************end of social share********************-->
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
    <RelatedProducts :current-product="product" />
  </v-container>

  <!-- লোডিং স্টেট -->
  <v-container v-else-if="pending" class="py-16 text-center">
    <v-progress-circular indeterminate color="primary" size="64" />
  </v-container>
</template>

<script setup>
import { sanitizeHtml } from "~/utils/sanitizeHtml";
import RelatedProducts from "~/components/product/relatedProducts.vue";
import useProduct from "~/composables/useProduct";

const route = useRoute();
const cartStore = useCartStore();
const productsStore = useProductsStore();
const quantity = ref(1);
const tab = ref("desc");
const selectedImage = ref(null);
const rating = ref(0);
const imageLoading = ref(false);

//const pendingFromPinia = ref(false);
const productFromPinia = computed(() => {
  const slug = route.params.slug;
  return productsStore.getProductsBySlug(slug);
});

const { productl, pending } = useProduct(route.params.slug);
const product =
  productsStore.getProducts.length > 0 ? productFromPinia : productl;

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
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "Product",
        name: product.value?.name,
        image: product.value?.images?.[0]?.src,
        description: product.value?.short_description?.replace(
          /<[^>]*>?/gm,
          "",
        ),
        offers: {
          "@type": "Offer",
          priceCurrency: "BDT",
          price: product.value?.price,
          availability: "https://schema.org/InStock",
        },
      }),
    },
  ],
});

watch(product, (p) => {
  rating.value = p?.average_rating ? Number(p.average_rating) : 0;
});

// Sanitized HTML for the product description
const sanitizedDescription = computed(() => {
  return sanitizeHtml(
    product.value?.description || product.value?.short_description || "",
  );
});

const breadcrumbs = computed(() => [
  { title: "Home", disabled: false, to: "/" },
  { title: "Shop", disabled: false, to: "/shop" },
  { title: product.value?.name || "Product", disabled: true },
]);

const addToCart = () => {
  cartStore.addToCart({ ...product.value, quantity: quantity.value });
};

/** ************Social Share ******************* */
const { origin } = useRequestURL();
const currentUrl = computed(() => `${origin}${route.path}`);
const productTitle = computed(() => product.value?.name || "EMC Furniture");

const shareLinks = computed(() => [
  {
    name: "Facebook",
    icon: "mdi-facebook",
    color: "#1877F2",
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl.value)}`,
  },
  {
    name: "WhatsApp",
    icon: "mdi-whatsapp",
    color: "#25D366",
    url: `https://api.whatsapp.com/send?text=${encodeURIComponent(productTitle.value + " " + currentUrl.value)}`,
  },
  {
    name: "X (Twitter)",
    icon: "mdi-twitter",
    color: "#000000",
    url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(productTitle.value)}&url=${encodeURIComponent(currentUrl.value)}`,
  },
]);

const shareProduct = (url) => {
  window.open(url, "_blank", "width=600,height=400");
};

const copyToClipboard = () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(currentUrl.value);
    // যদি আপনার স্নাকবার স্টোর থাকে তবে এখানে মেসেজ দেখান
    alert("Link copied to clipboard!");
  }
};

/*********************Social Share */

useSeoMeta({
  title: () =>
    product.value ? `${product.value.name} | EMC Furniture` : "Loading...",
  description: () =>
    product.value?.description?.replace(/<[^>]*>?/gm, "") || "",
  ogTitle: () => product.value?.name || "",
  ogDescription: () =>
    product.value?.short_description?.replace(/<[^>]*>?/gm, ""),
  ogImage: () => product.value?.images[0].src || "",
  ogImageHeight: 600,
  ogImageWidth: 600,
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
