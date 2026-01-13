import { getWcClient } from "../../utils/wcClient";

const wcClient = getWcClient();

export default defineCachedEventHandler(
  async (event) => {
    // ১. ইউআরএল থেকে স্লাগটি নিন
    const slug = getRouterParam(event, "slug");

    try {
      // ২. স্লাগ ব্যবহার করে WooCommerce থেকে ডাটা আনুন
      const { data } = await wcClient.get("products", {
        slug: slug, // এখানে স্লাগ ফিল্টার যোগ করা হয়েছে
        status: "publish",
      });

      // ৩. চেক করুন প্রোডাক্ট পাওয়া গেছে কি না
      if (!data || data.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: "Product not found",
        });
      }

      // ৪. অ্যারের প্রথম আইটেমটি (সিঙ্গেল অবজেক্ট) রিটার্ন করুন
      return {
        id: data[0].id,
        name: data[0].name,
        slug: data[0].slug,
        description: data[0].description,
        short_description: data[0].short_description,
        price: data[0].price,
        regular_price: data[0].regular_price,
        sale_price: data[0].sale_price,
        images: data[0].images,
        categories: data[0].categories,
        related_ids: data[0].related_ids,
        tags: data[0].tags,
        attributes: data[0].attributes,
        variations: data[0].variations,
        stock_status: data[0].stock_status,
      };
    } catch (error: any) {
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.message,
      });
    }
  },
  {
    maxAge: 3600, // Cache for 1 hour
    name: "productBySlug",
    swr: true, // Enable Stale-While-Revalidate
  }
);
