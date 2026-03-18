import { getWcClient } from "../../utils/wcClient";

const wcClient = getWcClient();
export default defineCachedEventHandler(
  async (event) => {
    const query = getQuery(event);
    try {
      const { data } = await wcClient.get("products", {
        per_page: query.per_page || 12,
        page: query.page || 1,
        category: query.category || undefined,
        status: "publish",
      });
      return data;
    } catch (error: any) {
      throw createError({ statusCode: 500, statusMessage: error.message });
    }
  },
  {
    maxAge: 3600, // Cache for 1 hour
    swr: true, // Enable Stale-While-Revalidate
    name: "productsList",
    getKey: (event) => {
      const query = getQuery(event);
      const category = query.category || "all";
      const page = query.page || 1;
      const per_page = query.per_page || 12;
      return `productsList:category=${category}:page=${page}:per_page=${per_page}`;
    },
  },
);
