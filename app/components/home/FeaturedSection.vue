<template>
  <v-sheet class="py-16 bg-grey-lighten-5">
    <v-container>
      <!-- ১. সেকশন হেডার -->
      <v-row align="center" class="mb-10">
        <v-col cols="12" md="8">
          <div class="d-flex align-center mb-2">
            <v-divider
              :color="brandColor"
              thickness="3"
              class="mr-4 opacity-100"
              style="width: 50px"
            />
            <span
              class="text-overline font-weight-bold"
              :style="{ color: brandColor }"
              >EXCLUSIVE COLLECTION</span
            >
          </div>
          <h2
            class="text-h3 font-weight-black mb-4"
            :style="{ color: brandColor }"
          >
            Featured Masterpieces
          </h2>
          <p class="text-body-1 text-grey-darken-1">
            Handpicked furniture pieces that combine industrial engineering with
            modern aesthetics. Built for comfort, designed for style.
          </p>
        </v-col>
        <v-col cols="12" md="4" class="text-md-right">
          <v-btn
            to="/shop"
            variant="flat"
            :color="brandColor"
            size="large"
            class="text-white font-weight-bold px-8"
            rounded="lg"
            elevation="2"
          >
            VIEW ALL PRODUCTS
          </v-btn>
        </v-col>
      </v-row>

      <!-- ২. প্রোডাক্ট গ্রিড -->
      <v-row v-if="featuredProducts.length > 0">
        <v-col
          v-for="product in featuredProducts"
          :key="product.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              v-bind="props"
              class="featured-card h-100 position-relative"
              flat
              border
              rounded="xl"
              :to="`/products/${product.slug}`"
            >
              <!-- সলিড ব্যাজ (Sale/New) -->
              <v-chip
                v-if="product.on_sale"
                color="red"
                size="x-small"
                class="position-absolute ma-4 font-weight-bold"
                style="z-index: 2; top: 0; left: 0"
              >
                SALE
              </v-chip>

              <!-- ইমেজ সেকশন -->
              <div class="overflow-hidden bg-white" style="height: 280px">
                <NuxtImg
                  :src="product.images[0]?.src || '/images/placeholder.jpg'"
                  :alt="product.name"
                  class="w-100 h-100 transition-swing"
                  :class="{ 'scale-up': isHovering }"
                  fit="contain"
                  format="webp"
                />
              </div>

              <!-- প্রোডাক্ট কন্টেন্ট -->
              <v-card-text class="pa-5 text-center">
                <div
                  class="text-caption text-grey mb-1 uppercase letter-spacing-1"
                >
                  {{ product.categories[0]?.name || "Furniture" }}
                </div>
                <h3
                  class="text-subtitle-1 font-weight-bold mb-2 text-truncate"
                  style="color: #333"
                >
                  {{ product.name }}
                </h3>

                <div class="d-flex align-center justify-center gap-2">
                  <span
                    v-if="product.on_sale"
                    class="text-caption text-grey text-decoration-line-through"
                  >
                    ৳{{ product.regular_price }}
                  </span>
                  <span
                    class="text-h6 font-weight-black"
                    :style="{ color: brandColor }"
                  >
                    ৳{{ product.price }}
                  </span>
                </div>

                <!-- কুইক অ্যাড বাটন (Hover করলে আসবে) -->
                <v-expand-transition>
                  <div v-if="isHovering" class="mt-4">
                    <v-btn
                      block
                      :color="brandColor"
                      variant="flat"
                      class="text-white font-weight-bold"
                      rounded="lg"
                      prepend-icon="mdi-cart-plus"
                      @click.prevent="addToCart(product)"
                    >
                      ADD TO CART
                    </v-btn>
                  </div>
                </v-expand-transition>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>

      <!-- লোডিং স্টেট -->
      <v-row v-else>
        <v-col v-for="n in 4" :key="n" cols="12" sm="6" md="3">
          <v-skeleton-loader type="card, text, button" />
        </v-col>
      </v-row>
    </v-container>

    <!-- ৩. ইঞ্জিনিয়ারিং ফিচার হাইলাইট (Small Banner Inside) -->
    <v-container class="mt-16">
      <v-card color="#3b2822" theme="dark" rounded="xl" class="pa-10">
        <v-row align="center">
          <v-col cols="12" md="7">
            <h2 class="text-h4 font-weight-bold mb-4">
              Precision CNC Cutting & Fabrication
            </h2>
            <p class="text-body-1 opacity-80 mb-6">
              Need custom metal parts or artistic CNC designs for your
              furniture? Our state-of-the-art engineering facility at Savar is
              ready for your project.
            </p>
            <div class="d-flex gap-4 flex-wrap">
              <v-chip variant="tonal" prepend-icon="mdi-check"
                >Wood Engraving</v-chip
              >
              <v-chip variant="tonal" prepend-icon="mdi-check"
                >Metal Fabrication</v-chip
              >
              <v-chip variant="tonal" prepend-icon="mdi-check"
                >Custom Stairs</v-chip
              >
            </div>
          </v-col>
          <v-col cols="12" md="5" class="text-md-right">
            <v-btn
              href="https://wa.link/4yd33h"
              target="_blank"
              size="x-large"
              color="white"
              variant="flat"
              class="font-weight-bold text-brown-darken-4 px-10"
              rounded="pill"
            >
              FREE CONSULTATION
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-sheet>
</template>

<script setup>
const brandColor = "#3b2822";
const productsStore = useProductsStore();
const cartStore = useCartStore();

// ১. স্টোর থেকে সেরা 16টি প্রোডাক্ট নেওয়া (Featured Logic)
const featuredProducts = computed(() => {
  // আপনি চাইলে এখানে specific ID বা featured: true প্রপার্টি দিয়ে ফিল্টার করতে পারেন
  return productsStore.products.slice(10, 22);
});

const addToCart = (product) => {
  cartStore.addToCart(product);
};
</script>

<style scoped>
.featured-card {
  transition: all 0.3s ease;
  background-color: white !important;
}

.featured-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
  border-color: #3b2822 !important;
}

.scale-up {
  transform: scale(1.08);
}

.gap-2 {
  gap: 8px;
}
.gap-4 {
  gap: 16px;
}

.letter-spacing-1 {
  letter-spacing: 1px !important;
}

/* স্লাইডিং এনিমেশন */
.v-expand-transition-enter-active,
.v-expand-transition-leave-active {
  transition: 0.3s ease-in-out;
}
</style>
