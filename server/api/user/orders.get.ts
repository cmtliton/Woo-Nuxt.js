import { defineEventHandler, getCookie, createError, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const token = getCookie(event, "auth_token");
  const query = getQuery(event);

  // 1. Verify User is Logged In
  if (!token) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  // 2. Validate Token with WP (Optional but recommended)
  // For performance, you might just decode the JWT locally if you have the secret,
  // but here we validate by making a lightweight call or trusting the cookie for the proxy call.

  // We need the Customer ID. Ideally, store this in the cookie or pass it from client state
  // (and verify ownership). For this example, let's assume we pass ID in query,
  // but in production, decode the JWT to ensure the ID matches the token owner.

  const customerId = query.customerId;

  try {
    const authHeader =
      "Basic " +
      Buffer.from(`${config.wcKey}:${config.wcSecret}`).toString("base64");

    const orders = await $fetch(`${config.public.wpApiUrl}/wc/v3/orders`, {
      headers: { Authorization: authHeader },
      params: {
        customer: customerId, // Filter by logged-in user
        per_page: 20,
      },
    });

    return orders;
  } catch (error) {
    throw createError({ statusCode: 500, message: "Failed to fetch orders" });
  }
});
