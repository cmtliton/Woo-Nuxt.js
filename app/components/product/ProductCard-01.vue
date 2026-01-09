<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <v-card
      v-bind="hoverProps"
      class="product-card mx-auto"
      variant="flat"
      rounded="lg"
      border
      :elevation="isHovering ? 8 : 0"
    >
      <!-- ইমেজ সেকশন -->
      <NuxtLink :to="`/products/${product.slug}`" class="text-decoration-none">
        <div class="image-container bg-grey-lighten-4">
          <NuxtImg
            :src="product.images[0]?.src || '/Logo.png'"
            :alt="product.name"
            width="300"
            height="300"
            fit="cover"
            format="webp"
            loading="lazy"
            class="w-100 h-100 transition-swing"
            :class="{ 'scale-110': isHovering }"
          />
          <v-chip
            v-if="product.on_sale"
            color="#3b2822"
            size="x-small"
            class="position-absolute ma-2 text-white font-weight-bold"
            style="top: 0; left: 0"
          >
            SALE
          </v-chip>
        </div>
      </NuxtLink>

      <!-- কন্টেন্ট সেকশন -->
      <v-card-item class="text-center pa-4">
        <v-card-title
          class="text-subtitle-1 font-weight-bold text-truncate"
          style="color: #333"
        >
          {{ decodeHtml(product.name) }}
        </v-card-title>

        <div class="d-flex align-center justify-center mt-1">
          <span
            v-if="product.on_sale"
            class="text-caption text-grey text-decoration-line-through mr-2"
          >
            ৳{{ product.regular_price }}
          </span>
          <span class="text-h6 font-weight-black" style="color: #3b2822">
            ৳{{ product.price }}
          </span>
        </div>
      </v-card-item>

      <v-card-actions class="pa-4 pt-0">
        <v-btn
          block
          color="#3b2822"
          variant="flat"
          rounded="lg"
          class="font-weight-bold text-white"
          prepend-icon="mdi-cart-outline"
          @click="addToCart"
        >
          ADD TO CART
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script setup>
const props = defineProps({
  product: { type: Object, required: true },
});

const cartStore = useCartStore();

const addToCart = () => {
  cartStore.addToCart(props.product);
};

const decodeHtml = (html) => {
  if (import.meta.server) return html?.replace(/&amp;/g, "&");
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};
</script>

<style scoped>
.product-card {
  transition: all 0.3s ease;
  max-width: 300px;
}
.image-container {
  aspect-ratio: 1;
  overflow: hidden;
  position: relative;
}
.scale-110 {
  transform: scale(1.1);
}
</style>
