<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <!-- v-stepper এ আইটেম লিস্ট অনুযায়ী স্লট নাম হবে item.1, item.2 ইত্যাদি -->
        <v-stepper
          v-model="step"
          :items="['Details', 'Review', 'Payment']"
          hide-actions
        >
          <!-- এখানে item1 এর বদলে item.1 হবে -->
          <template #[`item.1`]>
            <v-card flat class="pa-5">
              <v-form v-model="valid" fast-fail>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="cartStore.customer.first_name"
                      label="আপনার নাম"
                      :rules="nameRules"
                      variant="outlined"
                      required
                    />
                  </v-col>
                  <v-col cols="0" hidden>
                    <v-text-field
                      v-model="cartStore.customer.last_name"
                      label="Last Name"
                      variant="outlined"
                      required
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="cartStore.customer.address_1"
                      label="পুরো ঠিকানা"
                      variant="outlined"
                      :rules="addressRules"
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="6" sm="12">
                    <!-- Phone Field Updated -->
                    <v-text-field
                      v-model="cartStore.customer.phone"
                      label="মোবাইল নম্বর (যেমন: 017...)"
                      variant="outlined"
                      type="tel"
                      :rules="phoneRules"
                      maxlength="11"
                      counter="11"
                      hint="১১ ডিজিটের সঠিক নম্বর দিন"
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="6" sm="12">
                    <v-text-field
                      v-model="cartStore.customer.email"
                      label="ইমেইল"
                      type="email"
                      variant="outlined"
                      :rules="emailRules"
                    />
                  </v-col>
                </v-row>
                <v-btn color="primary" :disabled="!valid" @click="step = 2">
                  Next: Review Order
                </v-btn>
                <v-btn variant="text" class="ml-2" @click="navigateTo('/')">
                  Cancel
                </v-btn>
              </v-form>
            </v-card>
          </template>

          <!-- এখানে item2 এর বদলে item.2 হবে -->
          <template #[`item.2`]>
            <v-card flat class="pa-5">
              <h3 class="mb-4 text-h6">Order Summary</h3>
              <v-list border rounded class="mb-4">
                <v-list-item v-for="item in cartStore.items" :key="item.id">
                  <v-list-item-title
                    >{{ item.name }} x {{ item.quantity }}</v-list-item-title
                  >
                  <template #append>
                    <span class="font-weight-bold"
                      >৳{{ item.price * item.quantity }}</span
                    >
                  </template>
                </v-list-item>
              </v-list>
              <div class="text-h6 mb-6">Total: ৳{{ cartStore.cartTotal }}</div>
              <div class="d-flex gap-2">
                <v-btn variant="text" @click="step = 1">Back</v-btn>
                <v-btn
                  color="primary"
                  :disabled="cartStore.items.length === 0"
                  @click="step = 3"
                  >Proceed to Payment</v-btn
                >
              </div>
            </v-card>
          </template>

          <!-- এখানে item3 এর বদলে item.3 হবে -->
          <template #[`item.3`]>
            <v-card flat class="pa-5 text-center">
              <v-radio-group
                v-model="paymentMethod"
                label="Select Payment Method"
                class="d-inline-block text-left"
              >
                <v-radio label="Cash on Delivery" value="cod" />
                <v-radio
                  label="Online Payment (SSLCommerz/bKash)"
                  value="sslcommerz"
                  disabled
                />
              </v-radio-group>

              <div class="mt-6">
                <v-btn variant="text" class="mr-2" @click="step = 2"
                  >Back</v-btn
                >
                <v-btn
                  :loading="loading"
                  color="success"
                  size="large"
                  elevation="2"
                  @click="placeOrder"
                >
                  Confirm Order
                </v-btn>
              </div>
            </v-card>
          </template>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { ref } from "vue";
import { useCartStore } from "~/stores/cart";
const cartStore = useCartStore();
const step = ref(1);
const loading = ref(false);
const paymentMethod = ref("cod");
const valid = ref(false);

const placeOrder = async () => {
  loading.value = true;
  const orderData = {
    billing: cartStore.customer,
    shipping: cartStore.customer,
    line_items: cartStore.items.map((i) => ({
      product_id: i.id,
      quantity: i.quantity,
    })),
    payment_method: paymentMethod.value,
    set_paid: false,
  };

  try {
    const response = await $fetch("/api/orders/create", {
      method: "POST",
      body: orderData,
    });

    if (response.id) {
      alert("Order placed successfully! Order ID: " + response.id);
      cartStore.clearCart();
      navigateTo("/checkout/success?order_id=" + response.id);
    }
  } catch (err) {
    alert("Order failed! " + err.message);
  } finally {
    loading.value = false;
  }
};
const nameRules = [
  (v) => !!v || "আপনার নাম দেওয়া আবশ্যক",
  (v) => (v && v.length >= 3) || "নাম অন্তত ৩ অক্ষরের হতে হবে",
];

// Address Validation Rules
const addressRules = [
  (v) => !!v || "ডেলিভারির জন্য পুরো ঠিকানা দেওয়া আবশ্যক",
  (v) =>
    (v && v.length >= 10) ||
    "অনুগ্রহ করে বিস্তারিত ঠিকানা দিন (যেমন: গ্রাম, থানা, জেলা)",
];

// Phone Validation Rules (BD Mobile Format: 013 to 019 + 8 digits = 11 digits)
const phoneRules = [
  (v) => !!v || "মোবাইল নম্বর দেওয়া আবশ্যক",
  (v) => /^[0-9]+$/.test(v) || "শুধুমাত্র ইংরেজি সংখ্যা (0-9) ব্যবহার করুন",
  (v) =>
    /^01[3-9][0-9]{8}$/.test(v) ||
    "সঠিক বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 01712345678)",
  (v) => (v && v.length === 11) || "মোবাইল নম্বরটি অবশ্যই ১১ ডিজিটের হতে হবে",
];

// Email Validation Rules (Optional but valid format if provided)
const emailRules = [
  (v) => (!!v && /.+@.+\..+/.test(v)) || "সঠিক ইমেইল ঠিকানা দিন",
];
</script>
