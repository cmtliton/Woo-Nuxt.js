import { defineEventHandler, deleteCookie } from "h3";

export default defineEventHandler((event) => {
  // 1. Delete the Auth Cookie
  // This instructs the browser to remove 'auth_token'
  deleteCookie(event, "auth_token");

  // 2. Return success response
  return {
    success: true,
    message: "Logged out successfully",
  };
});
