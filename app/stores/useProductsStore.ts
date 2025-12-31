import { defineStore } from "pinia";

export const useProductsStore = defineStore(
  "useProductsStore",
  () => {
    // ১. স্টেট (State)
    const products = ref<any[]>([]);
    const filteredProducts = ref<any[]>([]);
    const pending = ref(false);

    // ২. গেটার (Getter) - সর্টিং
    const getProducts = computed(() => {
      // original array মিউটেট না করে একটি কপি নিয়ে সর্ট করা নিরাপদ
      return [...products.value].sort((b, a) => {
        const dateA = a.date_created || "";
        const dateB = b.date_created || "";
        return dateA > dateB ? 1 : -1;
      });
    });

    /**
     * ৩. অ্যাকশন (Action) - ১: ১০০টি প্রোডাক্ট লোড করা
     * এখানে useFetch এর বদলে $fetch ব্যবহার করা হয়েছে এরর এড়াতে
     */
    const setProducts = async () => {
      try {
        const data = await $fetch<any[]>("/api/products", {
          query: { per_page: 100 },
        });
        products.value = data || [];
      } catch (error) {
        console.error("setProducts Error:", error);
      }
    };

    /**
     * ৪. অ্যাকশন (Action) - ২: ফিল্টার অনুযায়ী প্রোডাক্ট লোড করা
     */
    const fetchFilteredProducts = async (filters: {
      page?: number;
      category?: number | null;
      orderby?: string;
      order?: string;
      per_page?: number;
    }) => {
      try {
        pending.value = true;

        // ফিক্স: $fetch সরাসরি ডাটা রিটার্ন করে, তাই .value করার দরকার নেই
        const data = await $fetch<any[]>("/api/products", {
          query: {
            page: filters.page || 1,
            category: filters.category || undefined,
            orderby: filters.orderby || "date",
            order: filters.order || "desc",
            per_page: filters.per_page || 12,
          },
        });

        filteredProducts.value = data || [];
      } catch (error) {
        console.error("fetchFilteredProducts Error:", error);
        filteredProducts.value = [];
      } finally {
        pending.value = false;
      }
    };

    // ৫. হেল্পার মেথডসমূহ
    const getProductsBySlug = (slug: string) => {
      return products.value.find((product) => product.slug === slug);
    };

    const getProductsByCategory = (categoryId: number) => {
      return products.value.filter((product) =>
        product.categories.some((cat: any) => cat.id === categoryId)
      );
    };

    return {
      products,
      filteredProducts,
      pending,
      setProducts,
      getProducts,
      getProductsBySlug,
      getProductsByCategory,
      fetchFilteredProducts,
    };
  },
  {
    persist: true, // পিনিয়া-পারসিস্ট-স্টেট এনাবল
  }
);
