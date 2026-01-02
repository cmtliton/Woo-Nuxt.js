<template>
  <v-container
    max-width="1360"
    class="pa-0 mb-10 overflow-hidden rounded-lg hero-container"
  >
    <!-- carousel height এবং NuxtImg height এক হতে হবে -->
    <v-carousel
      height="460"
      :transition-duration="600"
      hide-delimiter-background
      show-arrows="hover"
      cycle
    >
      <v-carousel-item v-for="(src, i) in items" :key="i" class="hero-item">
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
        <!-- Overlay Content -->
        <div class="hero-overlay">
          <div class="hero-content">
            <h1 class="hero-title">{{ titles[i] }}</h1>
            <p class="hero-subtitle">{{ subtitles[i] }}</p>
            <NuxtLink to="/shop" class="hero-btn">Shop Now</NuxtLink>
          </div>
        </div>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<script setup lang="ts">
// ১. ইমেজগুলো অবশ্যই public/images ফোল্ডারে থাকতে হবে
// ২. পাথ হিসেবে './' এর বদলে সরাসরি '/' ব্যবহার করুন
const items = ["/images/hero1.jpg", "/images/hero2.jpg", "/images/hero3.jpg"];

const titles = [
  "Premium Furniture Collection",
  "Exceptional Quality & Style",
  "Transform Your Space",
];

const subtitles = [
  "Discover our handcrafted furniture designed for modern living",
  "Superior craftsmanship at unbeatable prices",
  "Find the perfect pieces to make your house a home",
];

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

.hero-container {
  position: relative;
}

.hero-item {
  position: relative;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.2) 100%
  );
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 60px 80px;
  z-index: 10;
}

.hero-content {
  max-width: 600px;
  animation: slideInLeft 0.8s ease-out;
}

.hero-title {
  font-size: 52px;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
  line-height: 1.2;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 32px;
  line-height: 1.6;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
}

.hero-btn {
  display: inline-block;
  padding: 14px 36px;
  background-color: #ff6b35;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.hero-btn:hover {
  background-color: #e55a24;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4);
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .hero-overlay {
    padding: 40px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .hero-content {
    max-width: 100%;
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
