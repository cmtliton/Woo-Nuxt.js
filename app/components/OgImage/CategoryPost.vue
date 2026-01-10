<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "Welcome to EMC Furniture & Engineering",
  },
  description: {
    type: String,
    default: "Discover premium furniture and engineering solutions",
  },
  imageUrl: {
    type: String,
    default:
      "https://emcfurniture.com/assisthem/wp-content/uploads/2025/12/3.Tzri-facetofacesixseaterWorkstation.jpg",
  },
  borderColor: {
    type: String,
    default: "#3b2822",
  },
  domain: {
    type: String,
    default: "emcfurniture.com",
  },
});
</script>

<template>
  <div
    class="h-full w-full flex items-center justify-between border-solid border-[12px] bg-gray-50"
    :style="{ borderColor: borderColor }"
  >
    <!-- Image Section -->
    <div v-if="imageUrl" class="w-1/2 h-full overflow-hidden">
      <NuxtImg
        :src="imageUrl"
        alt="OG Image"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Content Section -->
    <div class="flex flex-col justify-between w-1/2 h-full p-20">
      <div>
        <h1 class="text-6xl font-black text-left leading-tight mb-6">
          {{ title }}
        </h1>
        <p class="text-xl text-gray-600 text-left leading-relaxed">
          {{ description }}
        </p>
      </div>
      <p class="text-lg font-bold text-gray-800 mb-0">{{ domain }}</p>
    </div>
  </div>
</template>
