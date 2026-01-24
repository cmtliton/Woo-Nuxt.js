// server/routes/auth/google.get.ts
import { findOrCreateCustomer } from "../../utils/woocommerce";
export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user }) {
    // 1. Sync with WooCommerce
    const wcUser = await findOrCreateCustomer({
      email: user.email,
      name: user.name,
      avatar: user.picture,
    });

    // 2. Set Session
    await setUserSession(event, {
      user: {
        id: wcUser.id, // WC ID
        email: wcUser.email,
        name: wcUser.first_name + " " + wcUser.last_name,
        avatar: wcUser.avatar_url,
        provider: "google",
      },
      loggedInAt: new Date(),
    });

    return sendRedirect(event, "/dashboard");
  },
  // ... onError logic
  onError(event, error) {
    console.error("Google OAuth Error:", error);
    return sendRedirect(event, "/");
  },
});
