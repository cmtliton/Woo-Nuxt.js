// app/composables/useCategories.ts
export const useCategories = () => {
  const fetchCategories = async (params: Record<string, any>) => {
    return await useFetch("/api/categories", {
      query: params,
      key: `categories-${JSON.stringify(params)}`, // Unique key for SSR caching
      watch: [params],
    });
  };

  const fetchCategoryBySlug = async (slug: string) => {
    return await useAsyncData(`category-${slug}`, async () => {
      const data = await $fetch("/api/categories/", { query: { slug } });
      return data[0]; // WC returns an array for slug searches
    });
  };

  return { fetchCategories, fetchCategoryBySlug };
};
