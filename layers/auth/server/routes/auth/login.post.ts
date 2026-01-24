async function getRedirectUrl(userId: number): Promise<string> {
  // Placeholder implementation - replace with your logic to determine redirect URL
  return `/dashboard`;
}
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  // ১. ইনপুট চেক করা (Email/Username & Password)
  const userIdentifier = body.username || body.email;
  if (!userIdentifier || !body.password) {
    throw createError({
      statusCode: 400,
      message: "Missing credentials",
    });
  }

  try {
    // ২. ওয়ার্ডপ্রেসে লগিন রিকোয়েস্ট পাঠানো
    const response: any = await $fetch(
      `${config.public.wcUrl}/wp-json/jwt-auth/v1/token`,
      {
        method: "POST",
        body: {
          username: userIdentifier,
          password: body.password,
        },
      },
    );

    // ৩. সেশন সেট করা (nuxt-auth-utils এর মাধ্যমে)
    // এটি অটোমেটিকালি এনক্রিপ্টেড কুকি তৈরি করবে যা useUserSession() পড়তে পারে
    await setUserSession(event, {
      user: {
        // ফ্রন্টেন্ডের useAuth কম্পোজেবল এই নামগুলোই আশা করছে
        name: response.user_display_name,
        email: response.user_email,
        avatar:
          response.avatar ||
          "https://lh3.googleusercontent.com/a/ACg8ocLsrr-k6sn7ZUVzNy3dWPUtNN89Mn04YJSt17jkmScBtkt7ccbXeQ=s96-c", // ওয়ার্ডপ্রেস ডিফল্টভাবে অ্যাভাটার না দিলে নাল থাকবে

        // আমাদের ইন্টারনাল কাজের জন্য আইডি এবং টোকেন সেভ রাখা জরুরি
        id: response.id || 0, // কখনও কখনও প্লাগিন ভেদে ফিল্ডের নাম ভিন্ন হতে পারে
        wp_token: response.token, // ভবিষ্যতে অর্ডার ফেচ করার জন্য এই টোকেন সেশনেই রেখে দিলাম
      },
      loggedInAt: new Date(),
    });
    await getRedirectUrl(response.id || 0);
    return { success: true };
  } catch (error: any) {
    console.error("Login Error-liton:", error.data || error.message);

    throw createError({
      statusCode: 401,
      message: error.data?.message || "Invalid username or password",
    });
  }
});
