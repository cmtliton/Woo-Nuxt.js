// server/utils/woocommerce.ts
import { randomUUID } from "node:crypto";

export const findOrCreateCustomer = async (socialUser: any) => {
  const config = useRuntimeConfig();

  // 1. Setup Keys
  const consumerKey = config.wcKey;
  const consumerSecret = config.wcSecret;
  const apiUrl = config.public.wcUrl;

  if (!consumerKey || !consumerSecret) {
    throw new Error("WooCommerce API Keys are missing");
  }

  const authString = `${consumerKey}:${consumerSecret}`;
  const authHeader = "Basic " + Buffer.from(authString).toString("base64");

  // Helper to fetch user by email
  const fetchUserByEmail = async (email: string) => {
    return await $fetch<any[]>(`${apiUrl}/wp-json/wc/v3/customers`, {
      params: {
        email: email,
        role: "all", // Important: Ensure we find Admins too
      },
      headers: { Authorization: authHeader },
    });
  };

  try {
    // ---------------------------------------------------------
    // STEP 1: Check if user exists
    // ---------------------------------------------------------
    const existingUsers = await fetchUserByEmail(socialUser.email);

    if (existingUsers && existingUsers.length > 0) {
      console.log("✅ User found via Search:", existingUsers[0].id);
      return existingUsers[0];
    }

    // ---------------------------------------------------------
    // STEP 2: Create New User (If not found)
    // ---------------------------------------------------------
    const randomPassword = randomUUID() + "-Social-" + Date.now();

    const newUser = await $fetch(`${apiUrl}/wp-json/wc/v3/customers`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: {
        email: socialUser.email,
        first_name: socialUser.name?.split(" ")[0] || "Social",
        last_name: socialUser.name?.split(" ")[1] || "User",
        username: socialUser.email,
        password: randomPassword,
        avatar_url: socialUser.avatar,
      },
    });

    return newUser;
  } catch (error: any) {
    // ---------------------------------------------------------
    // STEP 3: FAIL-SAFE (The Fix)
    // ---------------------------------------------------------
    const errorMessage = error.data?.message || error.message || "";

    // If WooCommerce says "Already registered", we know they exist!
    if (errorMessage.includes("already registered")) {
      console.log("⚠️ User exists but search failed. Retrying fetch...");

      // Force fetch again (sometimes specific role permissions hide users in list view)
      const fallbackUsers = await fetchUserByEmail(socialUser.email);

      if (fallbackUsers.length > 0) {
        return fallbackUsers[0];
      }
    }

    // If still failing, throw the real error
    console.error("❌ WC Creation Error:", errorMessage);
    throw createError({
      statusCode: 400,
      message: "Social Login Failed: " + errorMessage,
    });
  }
};

// Manual Registration
export const createManualCustomer = async (userData: any) => {
  const config = useRuntimeConfig();
  const authString = `${config.wcKey}:${config.wcSecret}`;
  const authHeader = "Basic " + Buffer.from(authString).toString("base64");

  try {
    const newUser = await $fetch(
      `${config.public.wcUrl}/wp-json/wc/v3/customers`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: {
          email: userData.email,
          password: userData.password,
          first_name: userData.firstName,
          last_name: userData.lastName,
          username: userData.email,
        },
      },
    );
    return newUser;
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || "Registration failed",
    });
  }
};
