<!-- app/components/product/FilterSidebar.vue -->
<template>
  <v-list border rounded="lg" class="pa-4">
    <div class="text-subtitle-1 font-weight-bold mb-2">Material</div>
    <v-chip-group v-model="filters.materials" column multiple color="primary">
      <v-chip filter variant="outlined" value="velvet">Velvet</v-chip>
      <v-chip filter variant="outlined" value="leather">Leather</v-chip>
      <v-chip filter variant="outlined" value="linen">Linen</v-chip>
    </v-chip-group>

    <v-divider class="my-4" />

    <div class="text-subtitle-1 font-weight-bold mb-2">Price Range</div>
    <v-range-slider
      v-model="filters.price"
      :max="5000"
      :step="100"
      hide-details
      color="primary"
    />
    <div class="d-flex justify-space-between text-caption">
      <span>${{ filters.price[0] }}</span>
      <span>${{ filters.price[1] }}</span>
    </div>
  </v-list>
</template>
<script setup>
const filters = reactive({
  materials: [],
  price: [0, 5000],
});
</script>