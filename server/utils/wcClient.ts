
// server/utils/wcClient.ts
import WooCommerceRestApiPackage from "@woocommerce/woocommerce-rest-api";

// ESM এবং CJS এর ঝামেলা এড়াতে এটি ব্যবহার করুন
const WooCommerceRestApi = (WooCommerceRestApiPackage as any).default || WooCommerceRestApiPackage;

export const getWcClient = () => {
  const config = useRuntimeConfig();

  return new WooCommerceRestApi({
     url: config.public.wcUrl!,
  consumerKey: config.wcKey!,
  consumerSecret: config.wcSecret!,
  version: "wc/v3"
  });
};