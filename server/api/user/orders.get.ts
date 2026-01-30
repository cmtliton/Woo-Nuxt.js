import { defineEventHandler, createError, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  // 1. Verify User & Get Session
  // requireUserSession automatically throws 401 if user is not logged in
  const { user } = await requireUserSession(event);

  const config = useRuntimeConfig();
  const query = getQuery(event);

  // 2. Prepare Auth Credentials
  if (!config.wcKey || !config.wcSecret) {
    throw createError({
      statusCode: 500,
      message: "WooCommerce API Keys missing",
    });
  }

  const authString = `${config.wcKey}:${config.wcSecret}`;
  const authHeader = "Basic " + Buffer.from(authString).toString("base64");

  try {
    // 3. Fetch Orders from WooCommerce
    // We strictly filter by 'user.id' from the secure session
    const orders = await $fetch(`${config.public.wcUrl}/wp-json/wc/v3/orders`, {
      headers: {
        Authorization: authHeader,
      },
      params: {
        customer: (user as any).id, // 🔒 SECURITY: Always use session ID
        per_page: 10,
        page: query.page || 1, // Allow pagination
        orderby: "date",
        order: "desc",
      },
    });

    return orders;
  } catch (error: any) {
    console.error(
      "❌ Fetch Orders Error:",
      error.data?.message || error.message,
    );

    throw createError({
      statusCode: error.response?.status || 500,
      message: "Failed to retrieve order history",
    });
  }
});
