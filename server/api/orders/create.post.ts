import { defineEventHandler, readBody, createError } from "h3";
import { getWcClient } from "../../utils/wcClient"; // Ensure this path is correct based on your folder structure

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // 1. Get the current User Session (provided by nuxt-auth-utils)
  const { user } = await getUserSession(event);

  // 2. Determine Customer ID
  // If user is logged in -> Use their specific ID
  // If user is Guest -> Use 0
  const customerId = (user as any)?.id || 0;

  // 3. Initialize WooCommerce Client
  const wc = getWcClient();

  const userIp = getRequestIP(event, { xForwardedFor: true }) || "127.0.0.1";

  console.log("📝 Creating Order for Customer ID:", customerId);

  try {
    // 4. Prepare Order Payload
    // SECURITY: We overwrite 'customer_id' to prevent users from placing orders for others
    const orderPayload = {
      ...body,
      customer_id: customerId,
      customer_ip_address: userIp,
      status: "pending", // Default status until payment is confirmed
    };

    // 5. Send Request to WooCommerce
    const { data } = await wc.post("orders", orderPayload);

    return data;
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(
      "❌ Order Creation Failed:",
      error.response?.data || error.message,
    );

    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.response?.data?.message || "Failed to create order",
    });
  }
});
