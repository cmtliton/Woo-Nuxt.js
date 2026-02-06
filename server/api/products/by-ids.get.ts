import { getWcClient } from "../../utils/wcClient";

const wcClient = getWcClient();
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const includeIds = query.include;

  if (!includeIds) return [];
  try {
    const { data } = await wcClient.get("products", {
      include: includeIds,
      status: "publish",
    });
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      permalink: data.permalink,
      description: data.description,
      short_description: data.short_description,
      price: data.price,
      regular_price: data.regular_price,
      sale_price: data.sale_price,
      images: data.images,
      categories: data.categories,
      related_ids: data.related_ids,
      tags: data.tags,
    };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});
