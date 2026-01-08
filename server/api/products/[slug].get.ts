import { getWcClient } from "../../utils/wcClient";

const wcClient = getWcClient();

export default defineCachedEventHandler(
  async (event) => {
    // ১. ইউআরএল থেকে স্লাগটি নিন
    const slug = getRouterParam(event, "slug");
    if (!slug) {
      throw createError({ statusCode: 400, statusMessage: "Missing slug" });
    }

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
        permalink: data[0].permalink,
        date_created: data[0].date_created,
        date_modified: data[0].date_modified,
        type: data[0].type,
        price: data[0].price,
        regular_price: data[0].regular_price,
        sale_price: data[0].sale_price,
        stock_status: data[0].stock_status,
        status: data[0].status,
        featured: data[0].featured,
        sku: data[0].sku,
        images: data[0].images,
        categories: data[0].categories,
        description: data[0].description,
        short_description: data[0].short_description,
        average_rating: data[0].average_rating,
        review_count: data[0].review_count,
      };
    } catch (error: any) {
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.message,
      });
    }
  },
  {
    maxAge: 0, // Cache for 1 hour
    name: "productBySlug",
    swr: true, // Enable Stale-While-Revalidate
  }
);
