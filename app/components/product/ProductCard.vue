<!-- app/components/product/ProductCard.vue -->
<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      v-bind="props"
      :elevation="isHovering ? 8 : 2"
      class="mx-auto transition-swing"
      rounded="lg"
    >
      <nuxt-link
        :to="`/products/${product.slug}`"
        class="text-decoration-none text--primary"
      >
        <NuxtImg
          :src="product.images[0]?.src"
          min-height="250"
          class="w-100 h-100 rounded-t-lg bg-grey-lighten-2"
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
          <v-card-title class="text-subtitle-1 font-weight-bold">
            {{ product.name }}
          </v-card-title>
          <v-card-subtitle>
            <span class="text-primary font-weight-black"
              >${{ product.price }}</span
            >
          </v-card-subtitle>
        </v-card-item>
      </nuxt-link>
      <v-card-actions>
        <v-btn
          block
          color="secondary"
          variant="flat"
          prepend-icon="mdi-cart"
          @click="$emit('add-to-cart', product)"
        >
          Add to Cart
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
  },
});
defineEmits(["add-to-cart"]);
</script>
