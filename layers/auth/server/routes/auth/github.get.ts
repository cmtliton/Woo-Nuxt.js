import { findOrCreateCustomer } from "../../utils/woocommerce";
export default defineOAuthGitHubEventHandler({
  config: { emailRequired: true },
  async onSuccess(event, { user }) {
    // 1. Call our utility to sync with WooCommerce
    const wcUser = await findOrCreateCustomer({
      email: user.email,
      name: user.name || user.login,
      avatar: user.avatar_url,
    });

    // 2. Set the User Session with WooCommerce ID
    await setUserSession(event, {
      user: {
        id: wcUser.id, // IMPORTANT: Use WooCommerce ID, not GitHub ID
        email: wcUser.email,
        name: wcUser.first_name + " " + wcUser.last_name,
        avatar: wcUser.avatar_url,
        role: wcUser.role,
        provider: "github",
      },
      loggedInAt: new Date(),
    });

    return sendRedirect(event, "/dashboard");
  },
  onError(event, error) {
    console.error("GitHub Error:", error);
    return sendRedirect(event, "/login?error=github");
  },
});
