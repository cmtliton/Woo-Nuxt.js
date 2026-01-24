import { createManualCustomer } from "../../utils/woocommerce";
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
    const response = await createManualCustomer({
      username: body.email,
      email: body.email,
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
    });

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
