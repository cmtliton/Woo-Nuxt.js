import { getWcClient } from "../utils/wcClient";
const api = getWcClient();
export default defineCachedEventHandler(
  async (event) => {
    const query = getQuery(event);
    try {
      const response = await api.get("products", query);
      // return response.data;

      return response.data.map((product: any) => {
        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          permalink: product.permalink,
          date_created: product.date_created,
          date_modified: product.date_modified,
          type: product.type,
          price: product.price,
          regular_price: product.regular_price,
          sale_price: product.sale_price,
          stock_status: product.stock_status,
          status: product.status,
          featured: product.featured,
          sku: product.sku,
          images: product.images,
          categories: product.categories,
          description: product.description,
          short_description: product.short_description,
          average_rating: product.average_rating,
          review_count: product.review_count,
        };
      });
    } catch (error) {
      throw createError({ statusCode: 500, message: "WC API Error" });
    }
  },
  {
    maxAge: 0, // Cache for 1 hour
    name: "useProducts",
    swr: true, // Enable Stale-While-Revalidate
  }
);
