// server/api/categories/[slug].get.ts
import { getWcClient } from "../../utils/wcClient";

const wcClient = getWcClient();

export default defineCachedEventHandler(
  async (event) => {
    // ১. ইউআরএল থেকে স্লাগটি (slug) গ্রহণ করা
    const slug = getRouterParam(event, "slug");

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: "Category slug is required",
      });
    }

    try {
      // ২. স্লাগ ব্যবহার করে WooCommerce থেকে ক্যাটাগরি ফিল্টার করা
      // নোট: WooCommerce API স্লাগ দিয়ে সার্চ করলে সব সময় একটি অ্যারে (Array) পাঠায়
      const { data } = await wcClient.get("products/categories", {
        slug: slug,
      });

      // ৩. চেক করা ক্যাটাগরি পাওয়া গেছে কি না
      if (!data || data.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: "Category not found",
        });
      }

      // ৪. অ্যারের প্রথম আইটেমটি (Object) রিটার্ন করা
      return data[0];
    } catch (error: any) {
      // এরর হ্যান্ডলিং
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.message || "Internal Server Error",
      });
    }
  },
  {
    maxAge: 3600, // Cache for 1 hour
    name: "categoryBySlug",
    swr: true, // Enable Stale-While-Revalidate
  }
);
