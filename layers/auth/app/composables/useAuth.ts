export const useAuth = () => {
  const { loggedIn, user, session, fetch, clear } = useUserSession();

  const logout = async () => {
    await clear();
    await navigateTo("/");
  };

  const isAuthenticated = computed(() => loggedIn.value);

  const userName = computed(
    () =>
      (user.value as GitHubUser)?.name ??
      (user.value as GitHubUser)?.email ??
      "Guest",
  );

  const userAvatar = computed(
    () =>
      (user.value as GitHubUser)?.avatar ??
      "https://lh3.googleusercontent.com/a/ACg8ocLsrr-k6sn7ZUVzNy3dWPUtNN89Mn04YJSt17jkmScBtkt7ccbXeQ=s96-c",
  );

  const userEmail = computed(() => (user.value as GitHubUser)?.email ?? null);

  return {
    isAuthenticated,
    user: readonly(session),
    refressh: fetch,
    logout,
    userName,
    userAvatar,
    userEmail,
  };
};
