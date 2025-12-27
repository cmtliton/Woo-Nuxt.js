import { defineStore } from "pinia";
export const useCategoriesStore = defineStore(
  "useCategoriesStore",
  () => {
    const Categories = ref<any[]>([]);
    const getCategories = computed(() => {
      return Categories.value.sort((a, b) =>
        (a.name !== undefined ? a.name : "") >
        (b.name !== undefined ? b.name : "")
          ? 1
          : -1
      );
    });
    const setCategories = async () => {
      Categories.value = await useFetch("/api/categories").then(
        (res) => res.data.value || []
      );
      useProductsStore().setProducts();
    };
    const getCategoriesBySlug = (slug: string) => {
      return getCategories.value.find((category) => category.slug === slug);
    };
    return {
      Categories,
      setCategories,
      getCategories,
      getCategoriesBySlug,
    };
  },
  {
    persist: true, // Requires pinia-plugin-persistedstate
  }
);
