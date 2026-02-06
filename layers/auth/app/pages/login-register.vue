<script setup>
const brandColor = "#3b2822";
const tab = ref("login");
const errorMessage = ref("");
const loading = ref(false);
const showPassword = ref(false);
const authStore = useAuthStore();

const { isAuthenticated } = useAuth();
if (isAuthenticated.value) {
  await navigateTo("/dashboard", { replace: true });
}

const isLoading = ref(false);

async function handleGitHubLogin() {
  isLoading.value = true;
  await navigateTo("/auth/github", { external: true });
}
async function handleGoogleLogin() {
  isLoading.value = true;
  await navigateTo("/auth/google", { external: true });
}
// async function handleFacebookLogin() {
//   isLoading.value = true;
//   window.location.href = "/auth/facebook";
//   await navigateTo("/auth/facebook", { external: true });
// }
const loginForm = reactive({
  username: "",
  password: "",
});

const registerForm = reactive({
  email: "",
  username: "",
  password: "",
});

const handleLogin = async () => {
  loading.value = true;
  try {
    const success = await authStore.login(
      loginForm.username,
      loginForm.password,
    );
    if (success) {
      navigateTo("/dashboard"); // সফল হলে অর্ডার পেজে নিয়ে যাবে
    }
  } catch (error) {
    useSnackbarStore().showMessage({
      msg: "Login failed. Please check your credentials." + error.message,
      clr: "red",
      time: 4000,
    });
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  // Clear previous errors
  errorMessage.value = "";
  loading.value = true;

  try {
    // Basic Validation
    if (!registerForm.email || !registerForm.password) {
      throw new Error("Email and Password are required.");
    }

    // Call your Nuxt API (The one you fixed!)
    const response = await $fetch("/auth/register", {
      method: "POST",
      body: {
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
      },
    });

    // If successful:
    useSnackbarStore().showMessage({
      msg: "Registration successful!" + response.message,
      clr: "success",
      time: 4000,
    });

    // Redirect to Login Page
    await navigateTo("/dashboard");
  } catch (error) {
    // Handle Errors (Show message from Backend)
    console.error("Registration Error:", error);

    // Check if error comes from Nuxt/WooCommerce response
    errorMessage.value =
      error.data?.message || error.message || "Something went wrong.";
  } finally {
    // Always stop loading spinner
    loading.value = false;
  }
};

useSeoMeta({
  title: "Login / Register | EMC Furniture",
  description: "Manage your furniture orders and account details.",
});
</script>
<template>
  <v-container class="fill-height bg-brown-darken-1 my-10 rounded-lg">
    <v-row no-gutters class="fill-height">
      <!-- বাম পাশ: ব্র্যান্ড ইমেজ (ডেসটপ অনলি) -->
      <v-col cols="12" md="6" class="d-none d-md-flex position-relative">
        <v-img
          src="/images/login-register-bg.jpg"
          cover
          class="fill-height rounded-lg"
        >
          <div
            class="overlay d-flex flex-column justify-center align-center text-white pa-12 text-center"
          >
            <h1 class="text-h2 font-weight-black mb-4">Welcome Back!</h1>
            <p class="text-h6 font-weight-light opacity-80">
              Access your orders, track your furniture delivery, and manage your
              wishlist.
            </p>
          </div>
        </v-img>
      </v-col>

      <!-- ডান পাশ: লগইন/রেজিস্টার ফর্ম -->
      <v-col cols="12" md="6" class="d-flex align-center justify-center">
        <v-card
          width="100%"
          max-width="500"
          flat
          bg-color="transparent"
          class="pa-6 pa-md-12"
        >
          <div class="text-center mb-10">
            <v-img src="/Logo.png" max-width="80" class="mx-auto mb-4" />
            <h2 class="text-h4 font-weight-bold" :style="{ color: brandColor }">
              My Account
            </h2>
          </div>

          <!-- ট্যাব সিস্টেম (Login vs Register) -->
          <v-tabs
            v-model="tab"
            grow
            :color="brandColor"
            class="mb-8"
            align-tabs="center"
          >
            <v-tab value="login" class="font-weight-bold">Login</v-tab>
            <v-tab value="register" class="font-weight-bold">Register</v-tab>
          </v-tabs>

          <v-window v-model="tab">
            <!-- লগইন ফর্ম -->
            <v-window-item value="login">
              <v-form @submit.prevent="handleLogin">
                <v-text-field
                  v-model="loginForm.username"
                  label="Username or Email"
                  variant="outlined"
                  rounded="lg"
                  prepend-inner-icon="mdi-account-outline"
                  class="mb-4 mt-2"
                />
                <v-text-field
                  v-model="loginForm.password"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  rounded="lg"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                />

                <div class="d-flex justify-end mb-6">
                  <v-btn
                    variant="text"
                    size="small"
                    class="text-capitalize px-0"
                    >Forgot Password?</v-btn
                  >
                </div>

                <v-btn
                  block
                  size="x-large"
                  :color="brandColor"
                  class="text-white font-weight-bold"
                  rounded="lg"
                  :loading="loading"
                  type="submit"
                >
                  SIGN IN
                </v-btn>
              </v-form>
            </v-window-item>

            <!-- রেজিস্টার ফর্ম -->
            <v-window-item value="register">
              <v-form @submit.prevent="handleRegister">
                <v-text-field
                  v-model="registerForm.email"
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  rounded="lg"
                  class="mb-4 mt-2"
                />
                <v-text-field
                  v-model="registerForm.username"
                  label="Username"
                  variant="outlined"
                  rounded="lg"
                  class="mb-4"
                />
                <v-text-field
                  v-model="registerForm.password"
                  label="Password"
                  type="password"
                  variant="outlined"
                  rounded="lg"
                  class="mb-6"
                />

                <p class="text-caption text-grey mb-6">
                  Your personal data will be used to support your experience
                  throughout this website, to manage access to your account.
                </p>

                <v-btn
                  block
                  size="x-large"
                  :color="brandColor"
                  class="text-white font-weight-bold"
                  rounded="lg"
                  :loading="loading"
                  type="submit"
                >
                  CREATE ACCOUNT
                </v-btn>
              </v-form>
            </v-window-item>
          </v-window>

          <!-- সোশ্যাল লগইন প্রক্সি -->
          <div class="text-center mt-10">
            <div class="text-caption text-grey mb-4">Or continue with</div>
            <div class="d-flex justify-center gap-4">
              <v-btn
                icon="mdi-facebook"
                variant="outlined"
                color="blue-darken-2"
                @click="handleGitHubLogin"
              />
              <v-btn
                icon="mdi-google"
                variant="outlined"
                color="red-darken-1"
                :loading="isLoading"
                @click="handleGoogleLogin"
              />
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.overlay {
  background: rgba(59, 40, 34, 0.7);
  width: 100%;
  height: 100%;
  backdrop-filter: blur(4px);
}

.gap-4 {
  gap: 16px;
}

/* মোবাইল অপ্টিমাইজেশন */
@media (max-width: 600px) {
  .v-card {
    box-shadow: none !important;
  }
}
</style>
