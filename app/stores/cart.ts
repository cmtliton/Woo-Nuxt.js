// app/stores/cart.ts
import { defineStore } from "pinia";

export const useCartStore = defineStore(
  "cart",
  () => {
    const items = ref<any[]>([]);
    const customer = ref({
      first_name: "",
      last_name: "",
      address_1: "",
      email: "",
      phone: "",
    });
    const isAdding = ref(false);

    const totalItems = computed(() =>
      items.value.reduce((acc, item) => acc + item.quantity, 0),
    );
    const totalPrice = computed(() =>
      items.value.reduce((acc, item) => acc + item.price * item.quantity, 0),
    );
    const cartTotal = computed(() =>
      items.value.reduce((acc, item) => acc + item.price * item.quantity, 0),
    );

    function addToCart(product: any) {
      isAdding.value = true;
      const existing = items.value.find((i) => i.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        items.value.push({ ...product, quantity: 1 });
      }
      useSnackbarStore().showMessage({
        msg: `${product.name} added to cart`,
        clr: "success",
        time: 3000,
      });
      isAdding.value = false;
    }

    function removeFromCart(id: number) {
      items.value = items.value.filter((i) => i.id !== id);
    }

    function clearCart() {
      items.value = [];
    }

    return {
      items,
      customer,
      totalItems,
      totalPrice,
      cartTotal,
      addToCart,
      removeFromCart,
      clearCart,
    };
  },
  {
    persist: true, // Requires pinia-plugin-persistedstate
  },
);
