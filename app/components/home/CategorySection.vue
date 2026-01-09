<template>
  <v-container class="py-16">
    <!-- ১. সেকশন হেডার -->
    <div class="text-center mb-12">
      <h2 class="text-h3 font-weight-bold mb-3" :style="{ color: brandColor }">
        Shop by Category
      </h2>
      <p
        class="text-grey-darken-1 text-subtitle-1 mx-auto"
        style="max-width: 600px"
      >
        Exquisite designs for every corner of your home. Find the perfect pieces
        crafted with precision and passion.
      </p>
      <v-divider
        :color="brandColor"
        length="80"
        thickness="4"
        class="mx-auto mt-4 opacity-100 rounded-pill"
      />
    </div>

    <!-- ২. ক্যাটাগরি গ্রিড -->
    <v-row>
      <v-col
        v-for="cat in topCategories"
        :key="cat.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            :to="`/category/${cat.slug}`"
            flat
            class="category-card overflow-hidden"
            rounded="xl"
            border
          >
            <div class="image-wrapper position-relative">
              <!-- ক্যাটাগরি ইমেজ (ডাটাতে ইমেজ না থাকলে প্লাসহোল্ডার দেখাবে) -->
              <NuxtImg
                :src="cat.image?.src || '/images/category-placeholder.jpg'"
                :alt="cat.name"
                class="w-100 h-100 transition-swing"
                :class="{ 'scale-zoom': isHovering }"
                fit="cover"
                height="320"
                format="webp"
                loading="lazy"
              />

              <!-- ওভারলে (Hover করলে কালার ডার্ক হবে) -->
              <div
                class="card-overlay d-flex flex-column align-center justify-center text-center"
                :class="{ 'active-overlay': isHovering }"
              >
                <div class="count-badge mb-2">{{ cat.count }} Items</div>
                <h3 class="text-h5 font-weight-black text-white px-4">
                  {{ decodeHtml(cat.name) }}
                </h3>

                <!-- এক্সপ্লোর বাটন (Hover করলে আসবে) -->
                <v-btn
                  v-if="isHovering"
                  variant="flat"
                  color="white"
                  size="small"
                  class="mt-4 font-weight-bold transition-slide-y"
                  rounded="lg"
                  :style="{ color: brandColor }"
                >
                  View Collection
                </v-btn>
              </div>
            </div>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <!-- সব ক্যাটাগরি দেখার জন্য বাটন -->
    <div class="text-center mt-12">
      <v-btn
        to="/shop"
        variant="outlined"
        size="large"
        rounded="xl"
        class="px-10 font-weight-bold"
        :style="{ borderColor: brandColor, color: brandColor }"
      >
        BROWSE ALL PRODUCTS
      </v-btn>
    </div>
  </v-container>
</template>

<script setup>
const brandColor = "#3b2822";
const categoriesStore = useCategoriesStore();

// ১. শুধুমাত্র Parent: 0 (Main Categories) ফিল্টার করা হচ্ছে
// ২. যেসব ক্যাটাগরিতে অন্তত ১টি প্রোডাক্ট আছে সেগুলোই দেখাবে
const topCategories = computed(() => {
  const allCats = categoriesStore.getCategories || [];
  return allCats
    .filter((c) => c.parent === 0 && c.count > 0)
    .sort((a, b) => b.count - a.count) // বেশি প্রোডাক্ট থাকা ক্যাটাগরি আগে আসবে
    .slice(0, 8); // হোমপেজে সর্বোচ্চ ৮টি ক্যাটাগরি দেখাবো
});

// HTML Entities (&amp;) ডিকোড করার ফাংশন
// Universal decoder that works both on server and client to avoid
// SSR/client hydration mismatches caused by DOM-based decoding.
const decodeHtml = (html) => {
  if (!html) return "";
  // Common named entities
  let decoded = html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Hex numeric entities: &#x1F600; etc.
  decoded = decoded.replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );

  // Decimal numeric entities: &#169; etc.
  decoded = decoded.replace(/&#(\d+);/g, (_, dec) =>
    String.fromCharCode(parseInt(dec, 10))
  );

  return decoded;
};
</script>

<style scoped>
.category-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  height: 320px;
}

.image-wrapper {
  height: 100%;
  width: 100%;
}

.scale-zoom {
  transform: scale(1.15);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(59, 40, 34, 0.2) 0%,
    rgba(59, 40, 34, 0.8) 100%
  );
  transition: all 0.3s ease;
}

.active-overlay {
  background: rgba(59, 40, 34, 0.85) !important;
}

.count-badge {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  color: white;
  padding: 2px 12px;
  border-radius: 20px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.transition-slide-y {
  animation: slideY 0.3s ease-out;
}

@keyframes slideY {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* ক্যাটাগরি নামের টেক্সট শ্যাডো যাতে ক্লিয়ার দেখা যায় */
h3 {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}
</style>
