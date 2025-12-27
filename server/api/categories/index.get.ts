// server/api/categories/index.get.ts
import { getWcClient } from "../../utils/wcClient";

const wcClient = getWcClient();

export default defineCachedEventHandler(
  async (event) => {
    const query = getQuery(event);

    try {
      const { data } = await wcClient.get("products/categories", {
        per_page: query.per_page || 100, // সব ক্যাটাগরি একসাথে পেতে ১০০ দেওয়া হয়েছে
        orderby: "name", // নামের ক্রমানুসারে (Alphabetical)
        order: "asc",
        hide_empty: true, // যে ক্যাটাগরিতে কোনো প্রোডাক্ট নেই সেগুলো লুকাবে (খুবই কার্যকর)
        //parent: query.parent || 0
      });
      //return data;
      return data.map((category: any) => {
        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          parent: category.parent,
          description: category.description,
          display: category.display,
          count: category.count,
          menu_order: category.menu_order,
          image: category.image,
        };
      });
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message || "Failed to fetch categories",
      });
    }
  },
  {
    maxAge: 3600, // Cache for 1 hour
    name: "categoriesList",
    swr: true, // Enable Stale-While-Revalidate
  }
);
