import { createManualCustomer } from "../../utils/woocommerce";
async function getRedirectUrl(userId: number): Promise<string> {
  // Placeholder implementation - replace with your logic to determine redirect URL
  return `/dashboard`;
}
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // 1. ব্যাসিক ভ্যালিডেশন (Basic Validation)
  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      message: "Missing fields: email and password are required",
    });
  }

  try {
    // 2. আমাদের তৈরি করা Utility Function কল করা
    // এটি সরাসরি WooCommerce এ ইউজার তৈরি করবে
    const response: any = await createManualCustomer({
      username: body.email,
      email: body.email,
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
    });

    await setUserSession(event, {
      user: {
        // ফ্রন্টেন্ডের useAuth কম্পোজেবল এই নামগুলোই আশা করছে
        name: response.user_display_name,
        email: response.user_email,
        avatar:
          response.avatar ||
          "https://lh3.googleusercontent.com/a/ACg8ocLsrr-k6sn7ZUVzNy3dWPUtNN89Mn04YJSt17jkmScBtkt7ccbXeQ=s96-c", // ওয়ার্ডপ্রেস ডিফল্টভাবে অ্যাভাটার না দিলে নাল থাকবে

        id: response.id || 0, // কখনও কখনও প্লাগিন ভেদে ফিল্ডের নাম ভিন্ন হতে পারে
        wp_token: response.token, // ভবিষ্যতে অর্ডার ফেচ করার জন্য এই টোকেন সেশনেই রেখে দিলাম
      },
      loggedInAt: new Date(),
    });
    await getRedirectUrl(response.id || 0);
    // 3. সফল হলে রেসপন্স রিটার্ন করুন

    return {
      success: true,
      message: "Registration successful",
      user: response,
    };
  } catch (error: any) {
    // Utility থেকে আসা এররটি ফ্রন্টেন্ডে পাঠিয়ে দেওয়া
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
});
