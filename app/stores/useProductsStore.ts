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
    // const fetchFilteredProducts = async (filters: {
    //   page?: number;
    //   category?: number | null;
    //   orderby?: string;
    //   order?: string;
    //   per_page?: number;
    // }) => {
    //   try {
    //     pending.value = true;

    //     // ফিক্স: $fetch সরাসরি ডাটা রিটার্ন করে, তাই .value করার দরকার নেই
    //     const data = await $fetch<any[]>("/api/products", {
    //       query: {
    //         page: filters.page || 1,
    //         category: filters.category || undefined,
    //         orderby: filters.orderby || "date",
    //         order: filters.order || "desc",
    //         per_page: filters.per_page || 12,
    //       },
    //     });

    //     filteredProducts.value = data || [];
    //   } catch (error) {
    //     console.error("fetchFilteredProducts Error:", error);
    //     filteredProducts.value = [];
    //   } finally {
    //     pending.value = false;
    //   }
    // };

    const fetchFilteredProducts = async (filters: {
      page?: number;
      category?: number | null;
      orderby?: string;
      order?: string;
      per_page?: number;
    }) => {
      try {
        pending.value = true;

        // 1. Start with a copy of the full products array from state
        let result = [...products.value];

        // 2. Filter by Category
        if (filters.category) {
          result = result.filter((p) =>
            p.categories.some((cat: any) => cat.id === filters.category)
          );
        }

        // 3. Sorting Logic
        const orderby = filters.orderby || "date"; // 'date', 'price', or 'name'
        const order = filters.order || "desc"; // 'asc' or 'desc'

        result.sort((a, b) => {
          let valA: any, valB: any;

          if (orderby === "price") {
            valA = parseFloat(a.price) || 0;
            valB = parseFloat(b.price) || 0;
          } else if (orderby === "name") {
            valA = a.name.toLowerCase();
            valB = b.name.toLowerCase();
          } else {
            // Default to date_created
            valA = new Date(a.date_created).getTime();
            valB = new Date(b.date_created).getTime();
          }

          if (order === "asc") {
            return valA > valB ? 1 : -1;
          } else {
            return valA < valB ? 1 : -1;
          }
        });

        // 4. Pagination (Local Slicing)
        const perPage = filters.per_page || 12;
        const page = filters.page || 1;
        const start = (page - 1) * perPage;
        const end = start + perPage;

        // 5. Update the state with the processed subset
        filteredProducts.value = result.slice(start, end);
      } catch (error) {
        console.error("Local fetchFilteredProducts Error:", error);
        filteredProducts.value = [];
      } finally {
        // Simulated delay if you want to keep the UI loader visible momentarily
        // await new Promise(resolve => setTimeout(resolve, 300));
        pending.value = false;
      }
    };

    // ৫. হেল্পার মেথডসমূহ
    const getProductsBySlug = (slug: string) => {
      return getProducts.value.find((product) => product.slug === slug);
    };

    const getProductsByCategory = (categoryId: number) => {
      return products.value.filter((product) =>
        product.categories.some((cat: any) => cat.id == categoryId)
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
