<template>
  <v-container class="fill-height py-16" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" lg="5" class="text-center">
        <!-- ১. সাকসেস আইকন অ্যানিমেশন -->
        <v-avatar color="success" size="100" class="mb-6 elevation-4 bounce-in">
          <v-icon icon="mdi-check" size="64" color="white" />
        </v-avatar>

        <!-- ২. মেইন মেসেজ -->
        <h1 class="text-h3 font-weight-bold mb-4 text-grey-darken-4">
          Thank You For Your Order!
        </h1>
        <p class="text-h6 text-grey-darken-1 mb-8">
          Your furniture is being prepared for delivery. We have sent a
          confirmation email to you.
        </p>

        <!-- ৩. অর্ডার ডিটেইলস কার্ড -->
        <v-card
          variant="outlined"
          class="pa-6 mb-10 bg-grey-lighten-5"
          rounded="lg"
        >
          <v-row>
            <v-col cols="6" class="text-left border-e">
              <div class="text-caption text-grey">Order Number</div>
              <div class="text-h6 font-weight-bold text-primary">
                #{{ orderId || "N/A" }}
              </div>
            </v-col>
            <v-col cols="6" class="text-left ps-6">
              <div class="text-caption text-grey">Expected Delivery</div>
              <div class="text-h6 font-weight-bold">5-7 Business Days</div>
            </v-col>
          </v-row>
        </v-card>

        <!-- ৪. নেভিগেশন বাটন -->
        <div class="d-flex flex-column flex-sm-row justify-center gap-4">
          <v-btn
            color="primary"
            size="x-large"
            prepend-icon="mdi-shopping"
            flat
            class="px-8"
            to="/shop"
          >
            Continue Shopping
          </v-btn>
          <v-btn
            variant="outlined"
            size="x-large"
            prepend-icon="mdi-truck-delivery-outline"
            class="px-8"
            to="/"
          >
            Track Order
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const route = useRoute();
// ইউআরএল থেকে অর্ডার আইডি রিসিভ করা (যেমন: /checkout/success?order_id=123)
const orderId = computed(() => route.query.order_id);

// এসইও (SEO) মেটা সেট করা
useSeoMeta({
  title: "Order Successful | Luxury Furniture Store",
  description:
    "Thank you for your purchase. Your order has been placed successfully.",
  robots: "noindex, nofollow", // চেকআউট সাকসেস পেজ গুগলে ইনডেক্স করা উচিত নয়
});
</script>

<style scoped>
.bounce-in {
  animation: bounceIn 0.8s cubic-bezier(0.36, 0, 0.66, -0.56) both;
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

.gap-4 {
  gap: 16px;
}
</style>
