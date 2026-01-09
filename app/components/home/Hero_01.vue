<template>
  <v-container max-width="1360" class="pa-0 mb-10 overflow-hidden rounded-lg">
    <!-- carousel height এবং NuxtImg height এক হতে হবে -->
    <v-carousel
      height="460"
      :transition-duration="600"
      hide-delimiter-background
      show-arrows="hover"
      cycle
    >
      <v-carousel-item v-for="(src, i) in items" :key="i">
        <NuxtImg
          :src="src"
          width="1360"
          height="460"
          fit="cover"
          format="webp"
          :loading="i === 0 ? 'eager' : 'lazy'"
          :fetchpriority="i === 0 ? 'high' : 'low'"
          class="w-100 h-100"
          alt="EMC Furniture Hero Slide"
        />
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<script setup lang="ts">
// ১. ইমেজগুলো অবশ্যই public/images ফোল্ডারে থাকতে হবে
// ২. পাথ হিসেবে './' এর বদলে সরাসরি '/' ব্যবহার করুন
const items = ["/images/hero1.jpg", "/images/hero2.jpg", "/images/hero3.jpg"];

// ৩. প্রথম ইমেজটি ব্রাউজারকে আগেভাগে জানানোর জন্য Preload করা (Best for SEO/LCP)
useHead({
  link: [{ rel: "preload", as: "image", href: items[0] }],
});
</script>

<style>
.cross-scale-enter-active,
.cross-scale-leave-active {
  transition: 0.5s cubic-bezier(0.25, 0.8, 0.5, 1);
  transition-property: opacity, transform;
}

.cross-scale-leave-from,
.cross-scale-leave-to {
  position: absolute !important;
  top: 0;
  width: 100%;
}

.cross-scale-enter-from,
.cross-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@media (prefers-reduced-motion: reduce) {
  .cross-scale-enter-from,
  .cross-scale-leave-to {
    transform: none;
  }
}
</style>

<style scoped>
.reduced-motion-info {
  display: none;
}
@media (prefers-reduced-motion: reduce) {
  .reduced-motion-info {
    display: block;
  }
}
</style>
