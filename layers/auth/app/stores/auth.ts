import { defineStore } from "pinia";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const user = ref({});
    const token = ref<string | null>(null);

    const login = async (username: string, password: string) => {
      try {
        const data = await $fetch<{
          success: boolean;
          user: any;
          token: string;
        }>("/auth/login", {
          method: "POST",
          body: { username, password },
        });
        if (data.token) {
          token.value = data.token;
          user.value = data.user;
          return true;
        }
      } catch (e) {
        throw e;
      }
    };

    async function register(details: any) {
      const { error } = await useFetch("/api/auth/register", {
        method: "POST",
        body: details,
      });
      if (error.value) throw error.value;
      // Auto login after register or redirect
    }

    async function logout() {
      // Call an API endpoint to clear the HTTP-only cookie
      await useFetch("/api/auth/logout", { method: "POST" });
      user.value = {};
      navigateTo("/");
    }

    return { user, login, register, logout, token };
  },
  { persist: true },
);
