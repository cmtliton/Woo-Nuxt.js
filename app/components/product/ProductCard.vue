<template>
  <v-hover v-slot="{ isHovering }">
    <v-card
      v-bind="props"
      :elevation="isHovering ? 8 : 2"
      class="mx-auto transition-swing position-relative"
      rounded="lg"
    >
      <!-- 1. Wishlist Button (Floating Top-Right) -->
      <!-- We use @click.prevent to stop the router link from opening when clicking the heart -->
      <v-btn
        icon
        variant="flat"
        size="small"
        class="wishlist-btn position-absolute top-0 right-0 ma-3"
        :color="inWishlist ? 'white' : 'rgba(255,255,255,0.7)'"
        elevation="2"
        style="z-index: 5"
        @click.prevent="toggleWishlist"
      >
        <v-icon
          :color="inWishlist ? 'error' : 'grey-darken-2'"
          :icon="inWishlist ? 'mdi-heart' : 'mdi-heart-outline'"
          class="heart-transition"
        />
        <v-tooltip activator="parent" location="left">
          {{ inWishlist ? "Remove from Wishlist" : "Add to Wishlist" }}
        </v-tooltip>
      </v-btn>

      <!-- 2. Product Link & Image -->
      <nuxt-link
        :to="`/products/${product.slug}`"
        class="text-decoration-none text--primary d-block"
      >
        <NuxtImg
          :src="product.images[0]?.src"
          format="webp"
          height="250"
          width="100%"
          class="bg-grey-lighten-2 rounded-t-lg"
          fit="cover"
          loading="lazy"
          placeholder
          :alt="product.name"
          densities="x1"
        >
          <template #placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey-lighten-5" />
            </v-row>
          </template>
        </NuxtImg>

        <v-card-item>
          <v-card-title class="text-subtitle-1 font-weight-bold text-truncate">
            {{ product.name }}
          </v-card-title>
          <v-card-subtitle>
            <span class="text-brown-darken-4 font-weight-black text-body-1">
              ৳{{ formatPrice(product.price) }}
            </span>
            <!-- Optional: Show regular price if on sale -->
            <span
              v-if="
                product.regular_price && product.price < product.regular_price
              "
              class="text-decoration-line-through text-caption ml-2"
            >
              ৳{{ formatPrice(product.regular_price) }}
            </span>
          </v-card-subtitle>
        </v-card-item>
      </nuxt-link>

      <v-divider />

      <!-- 3. Actions -->
      <v-card-actions class="pa-4">
        <v-btn
          block
          color="#3b2822"
          variant="flat"
          prepend-icon="mdi-cart-plus"
          class="text-capitalize font-weight-bold"
          @click="$emit('add-to-cart', product)"
        >
          Add to Cart
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script setup>
import { useWishlistStore } from "../../../layers/auth/app/stores/wishlist";
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

defineEmits(["add-to-cart"]);

// --- Wishlist Logic ---
const wishlistStore = useWishlistStore();

// Check if current product ID exists in store
const inWishlist = computed(() => wishlistStore.isInWishlist(props.product.id));

const toggleWishlist = () => {
  wishlistStore.toggleWishlist(props.product.id);
};

// Helper for price formatting
const formatPrice = (price) => {
  return parseFloat(price).toLocaleString("en-BD");
};
</script>

<style scoped>
/* Smooth Transition for Card Hover */
.transition-swing {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

/* Heart Icon Beat Animation */
.heart-transition {
  transition: transform 0.2s;
}

.wishlist-btn:hover .heart-transition {
  transform: scale(1.2);
}

.wishlist-btn:active .heart-transition {
  transform: scale(0.9);
}
</style>
