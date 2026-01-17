import { defineEventHandler, readBody, createError, setCookie } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  try {
    // 1. Log the attempt
    console.log(`Login attempt for: ${body.username}`);
    console.log(`Hitting URL: ${config.public.wpApiUrl}/jwt-auth/v1/token`);

    // 2. Request JWT Token from WordPress
    const response: any = await $fetch(
      `${config.public.wpApiUrl}/jwt-auth/v1/token`,
      {
        method: "POST",
        body: {
          username: body.username,
          password: body.password,
        },
      }
    );

    // 3. Set HTTP-Only Cookie
    setCookie(event, "auth_token", response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    // 4. Return user data
    return {
      success: true,
      user: {
        email: response.user_email,
        displayName: response.user_display_name,
        id: response.id,
      },
      token: response.token,
    };
  } catch (error: any) {
    // --- DEBUGGING ---
    console.error("❌ Login Failed:", error.data || error.message);

    // Return the actual error from WordPress
    const wpMessage = error.data?.message || error.message || "Login failed";
    const wpCode = error.data?.code || "unknown_error";

    throw createError({
      statusCode: 401,
      message: `WP Error: ${wpCode} - ${wpMessage}`,
    });
  }
});
