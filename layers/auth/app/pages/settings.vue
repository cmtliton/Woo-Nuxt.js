<template>
  <v-container class="pa-0">
    <h2 class="text-h5 font-weight-bold mb-6 text-brown-darken-4">
      <v-btn
        icon="mdi-arrow-left"
        variant="text"
        to="/dashboard"
        class="mr-4"
      />
      Account Details
    </h2>

    <!-- Loading State -->
    <div v-if="pending">
      <v-skeleton-loader type="image, article" class="mb-6 rounded-xl border" />
      <v-skeleton-loader type="image, article" class="rounded-xl border" />
    </div>

    <v-row v-else>
      <!-- 1. EDIT PROFILE DETAILS -->
      <v-col cols="12">
        <v-card flat rounded="xl" border>
          <v-card-title class="d-flex align-center py-4 bg-grey-lighten-4">
            <v-icon
              icon="mdi-account-circle-outline"
              class="mr-2"
              color="brown-darken-3"
            />
            <span class="text-subtitle-1 font-weight-bold"
              >Personal Information</span
            >
          </v-card-title>

          <v-card-text class="pa-6">
            <v-form ref="profileForm" @submit.prevent="updateProfile">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="accountData.first_name"
                    label="First Name"
                    variant="outlined"
                    density="comfortable"
                    color="#3b2822"
                    :rules="[rules.required]"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="accountData.last_name"
                    label="Last Name"
                    variant="outlined"
                    density="comfortable"
                    color="#3b2822"
                    :rules="[rules.required]"
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="accountData.display_name"
                    label="Display Name"
                    hint="This will be how your name will be displayed in the account section and reviews"
                    persistent-hint
                    variant="outlined"
                    density="comfortable"
                    color="#3b2822"
                    :rules="[rules.required]"
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="accountData.email"
                    label="Email Address"
                    type="email"
                    variant="outlined"
                    density="comfortable"
                    color="#3b2822"
                    :rules="[rules.required, rules.email]"
                  />
                </v-col>
              </v-row>

              <div class="d-flex justify-end mt-4">
                <v-btn
                  color="#3b2822"
                  size="large"
                  variant="flat"
                  class="text-capitalize rounded-lg px-6"
                  :loading="savingProfile"
                  type="submit"
                >
                  Save Changes
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 2. CHANGE PASSWORD -->
      <v-col cols="12">
        <v-card flat rounded="xl" border>
          <v-card-title class="d-flex align-center py-4 bg-grey-lighten-4">
            <v-icon
              icon="mdi-lock-outline"
              class="mr-2"
              color="brown-darken-3"
            />
            <span class="text-subtitle-1 font-weight-bold"
              >Password Change</span
            >
          </v-card-title>

          <v-card-text class="pa-6">
            <v-form ref="passwordForm" @submit.prevent="updatePassword">
              <v-row>
                <v-col cols="12">
                  <v-alert
                    color="info"
                    variant="tonal"
                    icon="mdi-information"
                    class="mb-4 text-caption"
                    density="compact"
                  >
                    Leave blank if you do not wish to change your password.
                  </v-alert>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="passData.password"
                    label="New Password"
                    :type="showPass ? 'text' : 'password'"
                    :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                    variant="outlined"
                    density="comfortable"
                    color="#3b2822"
                    @click:append-inner="showPass = !showPass"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="passData.confirm_password"
                    label="Confirm New Password"
                    :type="showPass ? 'text' : 'password'"
                    variant="outlined"
                    density="comfortable"
                    color="#3b2822"
                    :rules="[rules.matchPassword]"
                  />
                </v-col>
              </v-row>

              <div class="d-flex justify-end mt-4">
                <v-btn
                  color="#3b2822"
                  size="large"
                  variant="outlined"
                  class="text-capitalize rounded-lg px-6"
                  :loading="savingPass"
                  :disabled="!passData.password"
                  type="submit"
                >
                  Update Password
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Notification Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackColor" location="top right">
      {{ snackMessage }}
      <template #actions>
        <v-btn variant="text" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});
// 1. Fetch User Data
const {
  data: customer,
  pending,
  refresh,
} = await useFetch("/api/user/profile");

// 2. Reactive State
const savingProfile = ref(false);
const savingPass = ref(false);
const showPass = ref(false);

const snackbar = ref(false);
const snackMessage = ref("");
const snackColor = ref("success");

// Forms Data
const accountData = reactive({
  first_name: "",
  last_name: "",
  display_name: "",
  email: "",
});

const passData = reactive({
  password: "",
  confirm_password: "",
});

// 3. Validation Rules
const rules = {
  required: (value) => !!value || "Required.",
  email: (value) => /.+@.+\..+/.test(value) || "E-mail must be valid.",
  matchPassword: (value) =>
    value === passData.password || "Passwords do not match.",
};

// 4. Populate Form when Data Loads
watchEffect(() => {
  if (customer.value) {
    accountData.first_name = customer.value.first_name || "";
    accountData.last_name = customer.value.last_name || "";
    accountData.display_name = customer.value.username || ""; // WP often uses username as display initially
    accountData.email = customer.value.email || "";
  }
});

// 5. Update Profile Logic
const updateProfile = async () => {
  savingProfile.value = true;
  try {
    await $fetch("/api/user/profile", {
      method: "PUT",
      body: accountData,
    });

    snackMessage.value = "Account details updated successfully!";
    snackColor.value = "success";
    snackbar.value = true;
    refresh(); // Get fresh data
  } catch (error) {
    snackMessage.value = error.data?.message || "Failed to update profile.";
    snackColor.value = "error";
    snackbar.value = true;
  } finally {
    savingProfile.value = false;
  }
};

// 6. Update Password Logic
const updatePassword = async () => {
  if (passData.password !== passData.confirm_password) return;

  savingPass.value = true;
  try {
    await $fetch("/api/user/profile", {
      method: "PUT",
      body: {
        password: passData.password,
      },
    });

    snackMessage.value = "Password changed successfully!";
    snackColor.value = "success";
    snackbar.value = true;

    // Clear password fields
    passData.password = "";
    passData.confirm_password = "";
  } catch (error) {
    snackMessage.value = error.data?.message || "Failed to change password.";
    snackColor.value = "error";
    snackbar.value = true;
  } finally {
    savingPass.value = false;
  }
};

useSeoMeta({ title: "Account Settings | EMC Furniture" });
</script>
