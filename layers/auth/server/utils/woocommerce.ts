// server/utils/woocommerce.ts
import { randomUUID } from "node:crypto";

export const findOrCreateCustomer = async (socialUser: any) => {
  const config = useRuntimeConfig();

  // 1. Prepare Auth Headers
  const authString = `${config.wcKey}:${config.wcSecret}`;
  const authHeader = "Basic " + Buffer.from(authString).toString("base64");

  // 2. Check if user already exists in WooCommerce
  // We search by email

  const existingUsers: any[] = await $fetch(
    `${config.public.wcUrl}/wp-json/wc/v3/customers`,
    {
      params: { email: socialUser.email },
      headers: { Authorization: authHeader },
    },
  );

  if (existingUsers.length > 0) {
    // --- USER EXISTS: RETURN EXISTING DATA ---
    return existingUsers[0];
  }

  // 3. Create NEW User (if not found)
  // We generate a random crazy password because they will login via Social anyway
  const randomPassword = crypto.randomUUID() + "-Social-" + Date.now();

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
          email: socialUser.email,
          first_name: socialUser.name?.split(" ")[0] || "Social",
          last_name: socialUser.name?.split(" ")[1] || "User",
          username: socialUser.email, // Use email as username
          password: randomPassword,
          avatar_url: socialUser.avatar, // Optional: Save avatar URL if you have a custom field
        },
      },
    );

    return newUser;
  } catch (error: any) {
    console.error("WC Creation Error:", error.data?.message);
    throw new Error("Failed to create WooCommerce user from Social Login");
  }
};

export const createManualCustomer = async (userData: any) => {
  const config = useRuntimeConfig();

  // 1. Auth Headers তৈরি
  // আপনার কনফিগের নাম অনুযায়ী wcKey বা wcConsumerKey ব্যবহার করুন
  const authString = `${config.wcKey}:${config.wcSecret}`;
  const authHeader = "Basic " + Buffer.from(authString).toString("base64");

  try {
    // 2. সরাসরি WooCommerce এ রিকোয়েস্ট পাঠানো
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
          password: userData.password, // ইউজারের দেওয়া পাসওয়ার্ড
          first_name: userData.firstName,
          last_name: userData.lastName,
          username: userData.email, // ইমেইলকেই ইউজারনেম হিসেবে ব্যবহার করছি
        },
      },
    );

    return newUser;
  } catch (error: any) {
    // 3. এরর হ্যান্ডলিং (যেমন: ইমেইল অলরেডি আছে কি না)
    console.error("Manual Registration Error:", error.data?.message);

    // WooCommerce এর অরিজিনাল এরর মেসেজটি ফেরত পাঠাবো
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || "Registration failed",
    });
  }
};
