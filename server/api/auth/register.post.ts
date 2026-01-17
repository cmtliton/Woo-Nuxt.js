import { defineEventHandler, readBody, createError } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  // 1. Basic Validation
  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      message: "Missing fields: email and password are required",
    });
  }

  try {
    // 2. Prepare Headers
    // Ensure keys exist before creating buffer
    if (!config.wcKey || !config.wcSecret) {
      throw new Error("WooCommerce API Keys are missing in runtimeConfig");
    }

    const authString = `${config.wcKey}:${config.wcSecret}`;
    const authHeader = "Basic " + Buffer.from(authString).toString("base64");

    // 3. Send Request to WooCommerce
    const response = await $fetch(`${config.public.wpApiUrl}/wc/v3/customers`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: {
        email: body.email,
        password: body.password,
        first_name: body.firstName,
        last_name: body.lastName,
        username: body.email, // Using email as username
      },
    });

    return response;
  } catch (error: any) {
    // 4. LOG THE ERROR (Check your VS Code Terminal when this happens!)
    console.error(
      "❌ WooCommerce Registration Error:",
      error.data || error.message
    );

    // 5. Return the actual error from WooCommerce to the Frontend
    // WooCommerce errors usually come in `error.data.message`
    const wcError =
      error.data?.message || error.message || "Registration failed";
    const wcStatus = error.response?.status || 500;

    throw createError({
      statusCode: wcStatus,
      message: wcError,
    });
  }
});
