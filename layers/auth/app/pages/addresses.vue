<template>
  <v-container class="py-2 bg-grey-lighten-5">
    <h2 class="text-h5 font-weight-bold mb-6 text-brown-darken-4">
      <v-btn
        icon="mdi-arrow-left"
        variant="text"
        to="/dashboard"
        class="mr-4"
      />Addresses
    </h2>

    <!-- Loading State -->
    <v-row v-if="pending">
      <v-col v-for="n in 2" :key="n" cols="12" md="6">
        <v-skeleton-loader type="article, actions" class="rounded-xl border" />
      </v-col>
    </v-row>

    <!-- Main Content -->
    <v-row v-else>
      <!-- 1. Billing Address Card -->
      <v-col cols="12" md="6">
        <v-card flat rounded="xl" border class="h-100 d-flex flex-column">
          <v-card-title class="d-flex align-center py-4 bg-grey-lighten-4">
            <v-icon
              icon="mdi-receipt-text-outline"
              class="mr-2"
              color="brown-darken-3"
            />
            <span class="text-subtitle-1 font-weight-bold"
              >Billing Address</span
            >
          </v-card-title>

          <v-card-text class="pa-6 flex-grow-1">
            <div v-if="hasAddress(customer?.billing)">
              <h3 class="text-body-1 font-weight-bold mb-1">
                {{ customer.billing.first_name }}
                {{ customer.billing.last_name }}
              </h3>
              <div class="text-body-2 text-grey-darken-2 lh-relaxed">
                <div v-if="customer.billing.company">
                  {{ customer.billing.company }}
                </div>
                <div>{{ customer.billing.address_1 }}</div>
                <div v-if="customer.billing.address_2">
                  {{ customer.billing.address_2 }}
                </div>
                <div>
                  {{ customer.billing.city }}, {{ customer.billing.postcode }}
                </div>
                <div>
                  {{ customer.billing.state }}, {{ customer.billing.country }}
                </div>
                <div class="mt-2 d-flex align-center">
                  <v-icon size="small" icon="mdi-phone" class="mr-2" />
                  {{ customer.billing.phone }}
                </div>
                <div class="d-flex align-center">
                  <v-icon size="small" icon="mdi-email" class="mr-2" />
                  {{ customer.billing.email }}
                </div>
              </div>
            </div>
            <div v-else class="text-grey text-center py-4">
              <v-icon
                icon="mdi-map-marker-off"
                size="40"
                class="mb-2 opacity-50"
              />
              <p>You have not set up this type of address yet.</p>
            </div>
          </v-card-text>

          <v-divider />

          <v-card-actions class="pa-4">
            <v-btn
              variant="flat"
              color="#3b2822"
              class="text-capitalize rounded-lg px-6"
              prepend-icon="mdi-pencil"
              @click="openEditDialog('billing')"
            >
              Edit Billing
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- 2. Shipping Address Card -->
      <v-col cols="12" md="6">
        <v-card flat rounded="xl" border class="h-100 d-flex flex-column">
          <v-card-title class="d-flex align-center py-4 bg-grey-lighten-4">
            <v-icon
              icon="mdi-truck-delivery-outline"
              class="mr-2"
              color="brown-darken-3"
            />
            <span class="text-subtitle-1 font-weight-bold"
              >Shipping Address</span
            >
          </v-card-title>

          <v-card-text class="pa-6 flex-grow-1">
            <div v-if="hasAddress(customer?.shipping)">
              <h3 class="text-body-1 font-weight-bold mb-1">
                {{ customer.shipping.first_name }}
                {{ customer.shipping.last_name }}
              </h3>
              <div class="text-body-2 text-grey-darken-2 lh-relaxed">
                <div v-if="customer.shipping.company">
                  {{ customer.shipping.company }}
                </div>
                <div>{{ customer.shipping.address_1 }}</div>
                <div v-if="customer.shipping.address_2">
                  {{ customer.shipping.address_2 }}
                </div>
                <div>
                  {{ customer.shipping.city }}, {{ customer.shipping.postcode }}
                </div>
                <div>
                  {{ customer.shipping.state }}, {{ customer.shipping.country }}
                </div>
              </div>
            </div>
            <div v-else class="text-grey text-center py-4">
              <v-icon
                icon="mdi-map-marker-off"
                size="40"
                class="mb-2 opacity-50"
              />
              <p>You have not set up this type of address yet.</p>
            </div>
          </v-card-text>

          <v-divider />

          <v-card-actions class="pa-4">
            <v-btn
              variant="flat"
              color="#3b2822"
              class="text-capitalize rounded-lg px-6"
              prepend-icon="mdi-pencil"
              @click="openEditDialog('shipping')"
            >
              Edit Shipping
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- EDIT DIALOG -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card rounded="xl">
        <v-card-title class="text-h6 font-weight-bold pa-4 bg-grey-lighten-4">
          Edit {{ activeType === "billing" ? "Billing" : "Shipping" }} Address
        </v-card-title>

        <v-card-text class="pa-4 pt-6">
          <v-form ref="addressForm" @submit.prevent="saveAddress">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.first_name"
                  label="First Name"
                  variant="outlined"
                  density="compact"
                  color="#3b2822"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.last_name"
                  label="Last Name"
                  variant="outlined"
                  density="compact"
                  color="#3b2822"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.company"
                  label="Company Name (Optional)"
                  variant="outlined"
                  density="compact"
                  color="#3b2822"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.address_1"
                  label="Street Address"
                  variant="outlined"
                  density="compact"
                  color="#3b2822"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.address_2"
                  label="Apartment, unit, etc. (Optional)"
                  variant="outlined"
                  density="compact"
                  color="#3b2822"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.city"
                  label="Town / City"
                  variant="outlined"
                  density="compact"
                  color="#3b2822"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.postcode"
                  label="Postcode / ZIP"
                  variant="outlined"
                  density="compact"
                  color="#3b2822"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.state"
                  label="State / County"
                  variant="outlined"
                  density="compact"
                  color="#3b2822"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.country"
                  label="Country"
                  variant="outlined"
                  density="compact"
                  color="#3b2822"
                />
              </v-col>

              <!-- Fields specific to Billing -->
              <template v-if="activeType === 'billing'">
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.phone"
                    label="Phone"
                    variant="outlined"
                    density="compact"
                    color="#3b2822"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.email"
                    label="Email Address"
                    variant="outlined"
                    density="compact"
                    color="#3b2822"
                  />
                </v-col>
              </template>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
          <v-btn
            color="#3b2822"
            variant="flat"
            :loading="saving"
            class="px-6"
            @click="saveAddress"
          >
            Save Address
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Notification Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackColor" location="top right">
      {{ snackMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});
const {
  data: customer,
  pending,
  refresh,
} = await useFetch("/api/user/profile");

// --- Dialog State ---
const dialog = ref(false);
const activeType = ref("billing"); // 'billing' or 'shipping'
const saving = ref(false);

// --- Form Data ---
// We use a separate reactive object for editing so we don't mutate the display data directly
const formData = reactive({
  first_name: "",
  last_name: "",
  company: "",
  address_1: "",
  address_2: "",
  city: "",
  postcode: "",
  country: "",
  state: "",
  email: "",
  phone: "",
});

// --- Helpers ---
const hasAddress = (addr) => {
  // Check if at least address_1 is present
  return addr && addr.address_1;
};

// Open Dialog and copy current data to form
const openEditDialog = (type) => {
  activeType.value = type;
  const source = customer.value[type];

  // Clone data to form
  Object.keys(formData).forEach((key) => {
    formData[key] = source[key] || "";
  });

  dialog.value = true;
};

// --- Save Logic ---
const snackbar = ref(false);
const snackMessage = ref("");
const snackColor = ref("success");

const saveAddress = async () => {
  saving.value = true;

  try {
    // Construct the payload dynamically based on type
    const payload = {
      [activeType.value]: { ...formData },
    };

    await $fetch("/api/user/profile", {
      method: "PUT",
      body: payload,
    });

    // Success Actions
    await refresh(); // Refetch data to update UI
    dialog.value = false;
    snackMessage.value = "Address updated successfully";
    snackColor.value = "success";
    snackbar.value = true;
  } catch (error) {
    snackMessage.value = "Failed to update address";
    snackColor.value = "error" + error;
    snackbar.value = true;
  } finally {
    saving.value = false;
  }
};

useSeoMeta({ title: "Addresses | EMC Furniture" });
</script>

<style scoped>
.lh-relaxed {
  line-height: 1.6;
}
</style>
