// app/stores/useProductsStore.ts
import { defineStore } from "pinia";

export const useProductsStore = defineStore(
  "useProductsStore",
  () => {
    const products = ref<any[]>([]);
    const filteredProducts = ref<any[]>([]);
    const pending = ref(false);

    const getProducts = computed(() => {
      return products.value.sort((b, a) =>
        (a.date_created !== undefined ? a.date_created : "") >
        (b.date_created !== undefined ? b.date_created : "")
          ? 1
          : -1
      );
    });

    const setProducts = async () => {
      products.value = await useProducts()
        .fetchProducts({ per_page: 100 })
        .then((res) => res.data.value || []);
    };

    const getProductsBySlug = (slug: string) => {
      return getProducts.value.find((product) => product.slug === slug);
    };

    const getProductsByCategory = (categoryId: number) => {
      return getProducts.value.filter((product) =>
        product.categories.some((cat: any) => cat.id === categoryId)
      );
    };

    const fetchFilteredProducts = async (filters: {
      page?: number;
      category?: number | null;
      orderby?: string;
      order?: string;
      per_page?: number;
    }) => {
      try {
        pending.value = true;
        const { data } = await useFetch("/api/products", {
          query: {
            page: filters.page || 1,
            category: filters.category,
            orderby: filters.orderby || "date",
            order: filters.order || "desc",
            per_page: filters.per_page || 12,
          },
        });
        filteredProducts.value = data.value || [];
      } finally {
        pending.value = false;
      }
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
    persist: true, // Requires pinia-plugin-persistedstate
  }
);
