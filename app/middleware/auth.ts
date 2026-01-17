export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();

  // If user is not logged in, redirect to login
  // Note: On full page reload, you need a plugin to re-fetch user profile
  // based on the existence of the cookie (via /api/user/me endpoint)
  console.log(to.fullPath);
  console.log(from.fullPath);
  if (!auth.token) {
    return navigateTo("/my-account/");
  }
});
