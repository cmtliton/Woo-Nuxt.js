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
  }
);
