import { defineEventHandler, readBody, createError } from "h3";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const config = useRuntimeConfig();
  const method = event.method;

  // Auth Header for WooCommerce
  const authHeader =
    "Basic " +
    Buffer.from(`${config.wcKey}:${config.wcSecret}`).toString("base64");

  // --- GET: Fetch Customer Details ---
  if (method === "GET") {
    try {
      const customer = await $fetch(
        `${config.public.wcUrl}/wp-json/wc/v3/customers/${(user as any).id}`,
        {
          headers: { Authorization: authHeader },
        },
      );
      return customer;
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: "Failed to fetch profile",
      });
    }
  }

  // --- PUT: Update Customer Details ---
  if (method === "PUT") {
    const body = await readBody(event);

    try {
      const updatedCustomer = await $fetch(
        `${config.public.wcUrl}/wp-json/wc/v3/customers/${(user as any).id}`,
        {
          method: "PUT",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          body: body, // Expecting { billing: {...}, shipping: {...} }
        },
      );
      return updatedCustomer;
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        message: error.data?.message || "Update failed",
      });
    }
  }
});
