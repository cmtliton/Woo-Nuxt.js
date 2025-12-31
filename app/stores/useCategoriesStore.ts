import { defineStore } from "pinia";

export const useCategoriesStore = defineStore(
  "useCategoriesStore",
  () => {
    // ১. স্টেট (State) - ভেরিয়েবল নাম ছোট হাতের (camelCase) রাখা ভালো
    const categories = ref<any[]>([]);

    // ২. গেটার (Getter) - সর্টিং লজিক আরও ক্লিন করা হয়েছে
    const getCategories = computed(() => {
      // original array পরিবর্তন না করে একটি কপি নিয়ে সর্ট করা নিরাপদ
      return [...categories.value].sort((a, b) => {
        const nameA = a.name || "";
        const nameB = b.name || "";
        return nameA.localeCompare(nameB); // মডার্ন টেক্সট সর্টিং পদ্ধতি
      });
    });

    // ৩. অ্যাকশন (Action) - এপিআই থেকে ডাটা আনা
    const setCategories = async () => {
      try {
        /**
         * সমাধান: useFetch এর বদলে $fetch ব্যবহার করা হয়েছে।
         * Pinia অ্যাকশনে useFetch ব্যবহার করলে "[nuxt] instance unavailable" এরর আসে।
         */
        const data = await $fetch<any[]>("/api/categories");
        categories.value = data || [];

        // ক্যাটাগরি সেট হওয়ার পর প্রোডাক্ট স্টোর কল করা
        // Nuxt auto-import এর কারণে এটি সরাসরি কাজ করবে
        const productsStore = useProductsStore();
        await productsStore.setProducts();
      } catch (error) {
        console.error("Failed to set categories:", error);
      }
    };

    // ৪. স্লাগ দিয়ে ক্যাটাগরি খুঁজে বের করা
    const getCategoriesBySlug = (slug: string) => {
      return categories.value.find((cat) => cat.slug === slug);
    };

    return {
      categories,
      setCategories,
      getCategories,
      getCategoriesBySlug,
    };
  },
  {
    persist: true, // ব্রাউজার রিফ্রেশ করলেও ডাটা হারাবে না
  }
);
