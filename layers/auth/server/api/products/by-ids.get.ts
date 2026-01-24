import { defineEventHandler, getQuery, createError } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const config = useRuntimeConfig();

  // IDs কমা দিয়ে আলাদা করা স্ট্রিং হিসেবে আসবে (e.g., "101,202,305")
  const includeIds = query.include;

  if (!includeIds) return [];

  try {
    const products = await $fetch(`${config.public.wpApiUrl}/wc/v3/products`, {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${config.wcKey}:${config.wcSecret}`).toString("base64"),
      },
      params: {
        include: includeIds, // WooCommerce feature to filter by specific IDs
        status: "publish",
      },
    });
    return products;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to fetch wishlist products",
    });
  }
});
