import { defineStore } from "pinia";

export const useCategoriesStore = defineStore(
  "useCategoriesStore",
  () => {
    const categories = ref<any[]>([]);
    // ২. গেটার (Getter) - নাম অনুযায়ী সর্ট করা
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
        const data = await $fetch<any[]>("/api/categories");
        categories.value = data || [];
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
