<template>
  <!-- ২. স্টিকি অ্যাপ বার (Header) -->
  <v-app-bar flat border-b height="55" color="#3b2822">
    <v-container class="d-flex align-center px-4 px-md-10">
      <!-- হ্যামবার্গার আইকন (শুধুমাত্র মোবাইলে) -->
      <v-app-bar-nav-icon
        class="d-md-none mr-2"
        color="white"
        @click="drawer = !drawer"
      />

      <!-- লোগো -->
      <v-img
        src="/Logo.png"
        min-width="50"
        max-width="50"
        class="cursor-pointer"
        @click="navigateTo('/')"
      />

      <!-- ডেসটপ মেগা মেনু (আগের মতো থাকবে) -->
      <div class="d-none d-md-flex h-100 ml-8" color="#3b2822">
        <!-- ক্যাটাগরি মেনু আইটেমস -->
        <v-menu
          v-for="cat in parentCategories"
          :key="cat.id"
          offset-y
          open-on-hover
          width="60%"
          location="bottom"
          offset="15"
          height="300"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              :to="`/category/${cat.slug}`"
              variant="text"
              color="white"
              class="text-none px-3 font-weight-medium"
            >
              {{ decodeHtml(cat.name) }}
            </v-btn>
          </template>
        </v-menu>

        <!-- Browse All Button -->
        <v-btn
          to="/shop"
          variant="text"
          color="white"
          class="text-none px-3 font-weight-medium"
        >
          Browse All
        </v-btn>
        <v-btn
          variant="text"
          class="text-none px-3 font-weight-medium"
          @click="navigateTo('/contact')"
          >Contact Us</v-btn
        >
      </div>

      <v-spacer />

      <!-- আইকন সেকশন -->
      <div class="d-flex align-center">
        <v-btn icon color="white" variant="text">
          <v-icon icon="mdi-magnify" />
        </v-btn>
        <ProfileMenu class="mx-2" />
        <v-btn icon color="white" variant="text" @click="openCart">
          <v-badge
            :content="cartStore.totalItems"
            :model-value="cartStore.totalItems > 0"
            color="green"
          >
            <v-icon icon="mdi-cart-outline" />
          </v-badge>
        </v-btn>
      </div>
    </v-container>
  </v-app-bar>
  <!-- ১. মোবাইল নেভিগেশন ড্রয়ার (Hamburger Menu) -->
  <v-navigation-drawer
    v-model="drawer"
    temporary
    location="left"
    width="300"
    class="mobile-nav-drawer"
  >
    <!-- ড্রয়ার হেডার -->

    <!-- ক্যাটাগরি লিস্ট (শুধুমাত্র Parent Categories) -->
    <v-list nav density="comfortable" class="mt-2">
      <v-list-item
        to="/"
        prepend-icon="mdi-home-outline"
        title="Home"
        color="#3b2822"
      />

      <v-divider class="my-2" />
      <v-list-subheader
        class="text-uppercase font-weight-bold"
        style="font-size: 11px"
      >
        Shop By Category
      </v-list-subheader>

      <v-list-item
        v-for="cat in parentCategories"
        :key="cat.id"
        :to="`/category/${cat.slug}`"
        :title="decodeHtml(cat.name)"
        prepend-icon="mdi-chevron-right"
        base-color="#3b2822"
        rounded="lg"
      />

      <v-divider class="my-2" />

      <v-list-item
        to="/shop"
        prepend-icon="mdi-store-outline"
        title="Browse All"
        base-color="#3b2822"
      />
      <v-list-item
        to="/contact"
        prepend-icon="mdi-phone-outline"
        title="Contact Us"
        base-color="#3b2822"
      />
    </v-list>
  </v-navigation-drawer>

  <!-- ৩. ড্রয়ার কম্পোনেন্টস -->
  <v-sheet v-show="cartOpen">
    <CartDrawer />
  </v-sheet>

  <!-- ৪. মেইন কন্টেন্ট -->
  <v-main>
    <slot />
  </v-main>

  <GlobalLoader />
</template>

<script setup>
import { ref, computed, provide } from "vue";

const drawer = ref(false);
const cartOpen = ref(false);
const cartStore = useCartStore();
const categoriesStore = useCategoriesStore();

provide("cartOpen", cartOpen);
const openCart = () => (cartOpen.value = true);

// ১. শুধুমাত্র Parent Categories ফিল্টার করা (parent === 0)
const parentCategories = computed(() => {
  const allCategories = categoriesStore.getCategories || [];
  return allCategories.filter((cat) => cat.parent === 0 && cat.count > 0);
});

// HTML Entities ডিকোড করার ফাংশন
const decodeHtml = (html) => {
  if (import.meta.server) return html?.replace(/&amp;/g, "&");
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};
</script>

<style scoped>
.sticky-header {
  z-index: 1000 !important;
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.9) !important;
}

/* মোবাইল মেনু একটিভ স্টেট স্টাইল */
.mobile-nav-drawer :deep(.v-list-item--active) {
  background-color: rgba(59, 40, 34, 0.1) !important;
  font-weight: bold;
}

.mobile-nav-drawer :deep(.v-list-item-title) {
  font-size: 15px !important;
  letter-spacing: 0.5px;
}
</style>
