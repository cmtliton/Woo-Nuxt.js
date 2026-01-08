// app/composables/useProducts.ts
export const useProducts = () => {
  const fetchProducts = async (params: Record<string, any>) => {
    return await useFetch("/api/products", {
      query: params,
      key: `products-${JSON.stringify(params)}`, // Unique key for SSR caching
      watch: [params],
    });
  };

  const fetchProductBySlug = async (slug: string) => {
    return await useAsyncData(`product-${slug}`, async () => {
      const data = await $fetch("/api/products", { query: { slug } });
      return data[0]; // WC returns an array for slug searches
    });
  };

  return { fetchProducts, fetchProductBySlug };
};
