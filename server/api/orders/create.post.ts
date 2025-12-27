// server/api/orders/create.post.ts
import { getWcClient } from "../../utils/wcClient";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const wc = getWcClient();

  try {
    // ১. এখানে আপনি চাইলে চেক করতে পারেন ইউজার লগইন করা কি না
    // যদি লগইন থাকে তবে customer_id বডিতে যুক্ত করতে পারেন
    
    const { data } = await wc.post("orders", {
      ...body,
      status: 'pending' // পেমেন্ট না হওয়া পর্যন্ত স্ট্যাটাস পেন্ডিং থাকবে
    });

    return data;
  } catch (error: any) {
    throw createError({ 
      statusCode: 500, 
      statusMessage: error.message 
    });
  }
});