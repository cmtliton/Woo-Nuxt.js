<template>
  <v-container>
    <!-- ২. মেইন অ্যাপ বার (Desktop + Mobile Header) -->
    <v-app-bar flat border-b height="65" color="#3b2822">
      <v-container class="d-flex align-center px-4 px-md-10">
        <!-- মোবাইল মেনু আইকন -->
        <v-app-bar-nav-icon class="d-md-none mr-2" @click="drawer = true" />

        <!-- লোগো -->
        <v-img
          src="/Logo.png"
          max-width="55"
          class="cursor-pointer"
          @click="navigateTo('/')"
        />

        <!-- ডেসটপ মেনু (আগের মেগা মেনু কোড) -->
        <div class="d-none d-md-flex h-100 ml-8">
          <v-menu
            v-for="cat in categoryTree"
            :key="cat.id"
            open-on-hover
            width="60%"
            location="bottom"
            offset="15"
            height="300"
          >
            <template #activator="{ props }">
              <v-btn v-bind="props" variant="text" class="nav-btn h-100 px-4">
                {{ decodeHtml(cat.name) }}
              </v-btn>
            </template>
            <v-sheet class="pa-10 mega-menu">
              <v-container>
                <v-row>
                  <v-col v-for="sub in cat.children" :key="sub.id" cols="3">
                    <div class="font-weight-bold mb-2 text-primary">
                      {{ decodeHtml(sub.name) }}
                    </div>
                    <div
                      v-for="child in sub.children"
                      :key="child.id"
                      class="mb-1"
                    >
                      <nuxt-link
                        :to="`/category/${child.slug}`"
                        class="sub-link"
                        >{{ decodeHtml(child.name) }}</nuxt-link
                      >
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-sheet>
          </v-menu>
          <v-btn
            variant="text"
            class="nav-btn h-100 px-4"
            @click="navigateTo('/contact')"
            >Contact Us</v-btn
          >
        </div>

        <v-spacer />

        <!-- *******************সার্চ ও কার্ট************* -->
        <v-btn icon="mdi-magnify" variant="text" />
        <v-btn icon variant="text" class="cart-btn" @click="openCart()">
          <v-badge
            :content="cartStore.totalItems"
            :model-value="cartStore.totalItems > 0"
            color="black"
          >
            <v-icon icon="mdi-cart-outline" />
          </v-badge>
        </v-btn>
      </v-container>
    </v-app-bar>
    <!-- ১. মোবাইল নেভিগেশন ড্রয়ার (Mobile Drawer) -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      width="300"
      class="mobile-drawer"
    >
      <!-- <div class="pa-4 d-flex align-center border-b">
        <v-img src="/Logo.png" max-width="100" />
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="drawer = false" />
      </div> -->

      <v-list v-model:opened="openedGroups" nav>
        <v-list-item to="/" title="Home" prepend-icon="mdi-home-outline" />

        <!-- ক্যাটাগরি লুপ (Recursive Menu) -->
        <template v-for="cat in categoryTree" :key="cat.id">
          <!-- যদি সাব-ক্যাটাগরি থাকে (যেমন: Home Furniture) -->
          <v-list-group v-if="cat.children.length > 0" :value="cat.id">
            <template #activator="{ props }">
              <v-list-item v-bind="props" :title="decodeHtml(cat.name)" />
            </template>

            <!-- ২য় লেভেল (যেমন: Beds & Mattresses) -->
            <template v-for="sub in cat.children" :key="sub.id">
              <v-list-group
                v-if="sub.children.length > 0"
                :value="sub.id"
                class="ml-2"
              >
                <template #activator="{ props }">
                  <v-list-item v-bind="props" :title="decodeHtml(sub.name)" />
                </template>

                <!-- ৩য় লেভেল (যেমন: King Bed, Queen Bed) -->
                <v-list-item
                  v-for="child in sub.children"
                  :key="child.id"
                  :title="decodeHtml(child.name)"
                  :to="`/category/${child.slug}`"
                  class="ml-4"
                  link
                />
              </v-list-group>

              <!-- যদি ২য় লেভেলের কোনো চাইল্ড না থাকে -->
              <v-list-item
                v-else
                :title="decodeHtml(sub.name)"
                :to="`/category/${sub.slug}`"
                class="ml-2"
              />
            </template>
          </v-list-group>

          <!-- যদি কোনো সাব-ক্যাটাগরি না থাকে -->
          <v-list-item
            v-else
            :title="decodeHtml(cat.name)"
            :to="`/category/${cat.slug}`"
          />
        </template>

        <v-divider class="my-2" />
        <v-list-item
          title="Contact Us"
          prepend-icon="mdi-phone-outline"
          to="/contact"
        />
      </v-list>
    </v-navigation-drawer>

    <!-- ৩. কার্ট ড্রয়ার (Cart Drawer) -->
    <v-sheet v-show="cartOpen">
      <CartDrawer />
    </v-sheet>
  </v-container>
</template>
<script setup>
import { ref, provide, computed } from "vue";
import { useCartStore } from "~/stores/cart";
import CartDrawer from "../cart/CartDrawer.vue";
const categoriesStore = useCategoriesStore();
// Mobile navigation drawer state
const drawer = ref(false);
const openedGroups = ref([]);

// Cart drawer state - provided to CartDrawer component
const cartOpen = ref(false);
provide("cartOpen", cartOpen);

// Cart store
const cartStore = useCartStore();

// Open cart drawer function
const openCart = () => {
  cartOpen.value = true;
};

// ১. ক্যাটাগরি ডাটা ফেচ করা
//const { data: rawCategories } = await useFetch("/api/categories");

const rawCategories = computed(() => categoriesStore.getCategories);

// ২. ফ্ল্যাট লিস্টকে ট্রিতে কনভার্ট করা (Recursive Function)
const buildCategoryTree = (items, parentId = 0) => {
  return items
    .filter((item) => item.parent === parentId)
    .map((item) => ({
      ...item,
      children: buildCategoryTree(items, item.id),
    }));
};

const categoryTree = computed(() => {
  if (!rawCategories.value) return [];
  return buildCategoryTree(rawCategories.value, 0);
});

// ৩. HTML Entities (&amp;) ডিকোড করার ফাংশন
const decodeHtml = (html) => {
  if (import.meta.server) return html; // SSR-এর সময় স্কিপ করবে
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};
</script>

<style scoped>
/* মেগা মেনু ডেসটপ স্টাইল */
.nav-btn {
  text-transform: capitalize !important;
  font-weight: 600;
  font-size: 14px;
}

.mega-menu {
  position: fixed;
  left: 0 !important;
  width: 100vw;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.sub-link {
  text-decoration: none;
  color: #666;
  font-size: 13px;
  display: block;
}
.sub-link:hover {
  color: #000;
  padding-left: 5px;
  transition: 0.2s;
}

/* মোবাইল ড্রয়ার স্টাইল */
.mobile-drawer :deep(.v-list-group__items .v-list-item) {
  padding-inline-start: 16px !important;
}

.v-list-item-title {
  font-size: 14px !important;
}
</style>
