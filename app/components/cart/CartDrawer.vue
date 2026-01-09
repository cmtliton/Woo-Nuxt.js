<!-- app/components/cart/CartDrawer.vue -->
<template>
  <v-navigation-drawer
    v-model="cartOpen"
    location="right"
    width="400"
    temporary
    class="cart-drawer"
  >
    <!-- Header -->
    <v-toolbar flat border-b class="d-flex align-center">
      <v-toolbar-title class="text-h6 font-weight-bold"
        >Shopping Cart</v-toolbar-title
      >
      <v-spacer />
      <v-btn icon="mdi-close" variant="text" @click="closeDrawer" />
    </v-toolbar>

    <!-- Cart Items -->
    <v-container v-if="cartItems.length > 0" class="pa-0" fluid>
      <v-list class="pa-0">
        <template v-for="(item, index) in cartItems" :key="item.id">
          <v-list-item class="px-4 py-3">
            <template #prepend>
              <v-avatar rounded="lg" size="80" class="mr-4">
                <NuxtImg
                  :src="item.images[0].thumbnail || '/Logo.png'"
                  :alt="item.name"
                  fit="cover"
                  width="80"
                  height="80"
                  densities="x1"
                />
              </v-avatar>
            </template>

            <v-list-item-title class="text-body-1 font-weight-medium mb-1">
              {{ item.name }}
            </v-list-item-title>

            <v-list-item-subtitle
              class="text-body-2 text-primary font-weight-bold mb-2"
            >
              ${{ formatPrice(item.price) }}
            </v-list-item-subtitle>

            <!-- Quantity Controls -->
            <div class="d-flex align-center mt-2">
              <v-btn
                icon="mdi-minus"
                variant="text"
                size="small"
                :disabled="item.quantity <= 1"
                @click="updateQuantity(item.id, item.quantity - 1)"
              />
              <v-text-field
                :model-value="item.quantity"
                type="number"
                density="compact"
                hide-details
                variant="outlined"
                min="1"
                class="quantity-input mx-2"
                style="width: 70px"
                @update:model-value="
                  updateQuantity(item.id, parseInt($event) || 1)
                "
              />
              <v-btn
                icon="mdi-plus"
                variant="text"
                size="small"
                @click="updateQuantity(item.id, item.quantity + 1)"
              />
              <v-spacer />
              <div class="text-body-1 font-weight-bold">
                ${{ formatPrice(item.price * item.quantity) }}
              </div>
            </div>

            <!-- Remove Button -->
            <template #append>
              <v-btn
                icon="mdi-delete-outline"
                variant="text"
                size="small"
                color="error"
                @click="removeItem(item.id)"
              />
            </template>
          </v-list-item>
          <v-divider v-if="index < cartItems.length - 1" />
        </template>
      </v-list>
    </v-container>

    <!-- Empty Cart State -->
    <div
      v-else
      class="d-flex flex-column align-center justify-center pa-8"
      style="height: 100%"
    >
      <v-icon
        icon="mdi-cart-outline"
        size="80"
        color="grey-lighten-1"
        class="mb-4"
      />
      <div class="text-h6 text-grey mb-2">Your cart is empty</div>
      <div class="text-body-2 text-grey mb-4">
        Add some items to get started
      </div>
      <v-btn color="black" variant="flat" @click="closeDrawer">
        Continue Shopping
      </v-btn>
    </div>

    <!-- Footer with Total and Checkout -->
    <v-footer
      v-if="cartItems.length > 0"
      border-t
      class="pa-4 flex-column bg-surface"
    >
      <div class="d-flex justify-space-between w-100 mb-2">
        <span class="text-body-1">Subtotal</span>
        <span class="text-h6 font-weight-bold"
          >${{ formatPrice(subtotal) }}</span
        >
      </div>
      <div class="text-caption text-grey mb-4 w-100">
        Shipping and taxes calculated at checkout
      </div>
      <v-btn
        block
        color="black"
        size="large"
        variant="flat"
        :disabled="cartItems.length === 0"
        @click="goToCheckout"
      >
        Checkout Now
      </v-btn>
      <v-btn block variant="text" class="mt-2" @click="closeDrawer">
        Continue Shopping
      </v-btn>
    </v-footer>
  </v-navigation-drawer>
</template>

<script setup>
import { inject, computed } from "vue";
import { useCartStore } from "~/stores/cart";

// Inject the cartOpen ref from parent (default.vue)
const cartOpenRef = inject("cartOpen");
const cartStore = useCartStore();

const cartItems = computed(() => cartStore.items);
const subtotal = computed(() => cartStore.totalPrice);

// Create a computed property for cartOpen to handle the ref properly
const cartOpen = computed({
  get: () => cartOpenRef?.value ?? false,
  set: (value) => {
    if (
      cartOpenRef &&
      typeof cartOpenRef === "object" &&
      "value" in cartOpenRef
    ) {
      cartOpenRef.value = value;
    }
  },
});

// Format price to 2 decimal places
const formatPrice = (price) => {
  return parseFloat(price).toFixed(2);
};

// Update item quantity
const updateQuantity = (id, newQuantity) => {
  const item = cartStore.items.find((i) => i.id === id);
  if (item) {
    if (newQuantity <= 0) {
      cartStore.removeFromCart(id);
    } else {
      item.quantity = newQuantity;
    }
  }
};

// Remove item from cart
const removeItem = (id) => {
  cartStore.removeFromCart(id);
};

// Close drawer
const closeDrawer = () => {
  cartOpen.value = false;
};

// Navigate to checkout
const goToCheckout = () => {
  closeDrawer();
  navigateTo("/checkout/checkout");
};
</script>

<style scoped>
.cart-drawer :deep(.v-list-item) {
  min-height: auto;
  padding: 12px 16px;
}

.quantity-input :deep(.v-field__input) {
  text-align: center;
  padding: 4px 8px;
}

.quantity-input :deep(input[type="number"]) {
  text-align: center;
  appearance: textfield;
  -moz-appearance: textfield;
}

.quantity-input :deep(input[type="number"]::-webkit-outer-spin-button),
.quantity-input :deep(input[type="number"]::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}
</style>
