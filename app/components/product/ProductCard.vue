<template>
  <div>
    <v-hover v-slot="{ isHovering }">
      <v-card
        v-bind="props"
        :elevation="isHovering ? 8 : 2"
        class="mx-auto transition-swing"
        rounded="lg"
      >
        <!-- Image Container (Position Relative for Absolute Button) -->
        <div class="position-relative">
          <nuxt-link
            :to="`/products/${product.slug}`"
            class="text-decoration-none d-block"
          >
            <NuxtImg
              :src="product.images[0]?.src || '/logo.png'"
              class="w-100 h-100 bg-grey-lighten-2 rounded-t-lg"
              fit="contain"
              loading="lazy"
              placeholder
              :alt="product.name"
              format="webp"
            />
          </nuxt-link>

          <!-- Wishlist Button - Absolute inside the image container -->
          <v-btn
            icon
            size="small"
            elevation="2"
            class="wishlist-btn"
            color="white"
            @click.prevent="toggleWishlist"
          >
            <v-icon
              :color="inWishlist ? 'red' : 'grey-darken-1'"
              :icon="inWishlist ? 'mdi-heart' : 'mdi-heart-outline'"
            />
            <v-tooltip activator="parent" location="left">
              {{ inWishlist ? "Remove from Wishlist" : "Add to Wishlist" }}
            </v-tooltip>
          </v-btn>
        </div>

        <!-- Product Details -->
        <nuxt-link
          :to="`/products/${product.slug}`"
          class="text-decoration-none text--primary d-block"
        >
          <v-card-item>
            <v-card-title
              class="text-subtitle-1 font-weight-bold text-truncate text-blue-darken-4"
            >
              {{ product.name }}
            </v-card-title>
            <v-card-subtitle class="pt-1">
              <span class="text-brown-darken-4 font-weight-black text-h6">
                ৳{{ formatPrice(product.price) }}
              </span>
              <span
                v-if="
                  product.regular_price && product.price < product.regular_price
                "
                class="text-decoration-line-through text-caption ml-2 text-grey"
              >
                ৳{{ formatPrice(product.regular_price) }}
              </span>
            </v-card-subtitle>
          </v-card-item>
        </nuxt-link>

        <v-divider />

        <!-- Action Button -->
        <v-card-actions class="pa-4">
          <v-btn
            block
            color="#3b2822"
            variant="flat"
            prepend-icon="mdi-cart-plus"
            class="text-capitalize font-weight-bold rounded-md"
            @click="$emit('add-to-cart', product)"
          >
            Add to Cart
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-hover>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useWishlistStore } from "../../../layers/auth/app/stores/wishlist";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

defineEmits(["add-to-cart"]);

const wishlistStore = useWishlistStore();
const inWishlist = computed(() => wishlistStore.isInWishlist(props.product.id));

const toggleWishlist = () => {
  wishlistStore.toggleWishlist(props.product.id);
};

const formatPrice = (price) => {
  return parseFloat(price).toLocaleString("en-BD");
};
</script>

<style scoped>
.transition-swing {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

/* Specific styling for the wishlist button to match the image */
.wishlist-btn {
  position: absolute !important;
  top: 12px;
  right: 12px;
  z-index: 2;
  transition: transform 0.2s ease-in-out;
}

.wishlist-btn:hover {
  transform: scale(1.1);
}

.wishlist-btn:active {
  transform: scale(0.95);
}
</style>
