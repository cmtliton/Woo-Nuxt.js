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
              <v-form v-model="valid">
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="cartStore.customer.first_name"
                      label="First Name"
                      required
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="cartStore.customer.last_name"
                      label="Last Name"
                      required
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="cartStore.customer.address_1"
                      label="Full Address"
                      required
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="cartStore.customer.email"
                      label="Email"
                      type="email"
                      required
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="cartStore.customer.phone"
                      label="Phone"
                      required
                    />
                  </v-col>
                </v-row>
                <v-btn color="primary" :disabled="!valid" @click="step = 2">
                  Next: Review Order
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
                <v-btn color="primary" @click="step = 3"
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
</script>
