import { defineStore } from "pinia";

export const useWishlistStore = defineStore(
  "wishlist",
  () => {
    // আমরা লোকাল স্টোরেজে আইডিগুলো রাখবো
    const items = ref<number[]>([]);

    // অ্যাপ লোড হওয়ার সময় লোকাল স্টোরেজ থেকে ডাটা আনা
    const initWishlist = () => {
      if (import.meta.client) {
        const stored = localStorage.getItem("emc-wishlist");
        if (stored) items.value = JSON.parse(stored);
      }
    };

    // প্রোডাক্ট যোগ/বাদ দেওয়া (Toggle)
    const toggleWishlist = (productId: number) => {
      const index = items.value.indexOf(productId);
      if (index === -1) {
        items.value.push(productId); // Add
      } else {
        items.value.splice(index, 1); // Remove
      }
      syncStorage();
    };

    const removeFromWishlist = (productId: number) => {
      const index = items.value.indexOf(productId);
      if (index !== -1) {
        items.value.splice(index, 1);
        syncStorage();
      }
    };

    const isInWishlist = (productId: number) => items.value.includes(productId);

    const syncStorage = () => {
      if (import.meta.client) {
        localStorage.setItem("emc-wishlist", JSON.stringify(items.value));
      }
    };

    return {
      items,
      initWishlist,
      toggleWishlist,
      removeFromWishlist,
      isInWishlist,
    };
  },
  { persist: true },
);
