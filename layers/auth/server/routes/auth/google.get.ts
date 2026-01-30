// server/routes/auth/google.get.ts
import { findOrCreateCustomer } from "../../utils/woocommerce";
export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user }) {
    let googleAvatar = user.picture;
    if (googleAvatar && googleAvatar.includes("=s96-c")) {
      googleAvatar = googleAvatar.replace("=s96-c", "=s400-c");
    }
    // 1. Sync with WooCommerce
    const wcUser = await findOrCreateCustomer({
      email: user.email,
      name: user.name,
      avatar: googleAvatar,
    });
    // 2. Set Session
    await setUserSession(event, {
      user: {
        id: wcUser.id, // WC ID
        email: wcUser.email,
        name: wcUser.first_name + " " + wcUser.last_name,
        avatar: googleAvatar,
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
