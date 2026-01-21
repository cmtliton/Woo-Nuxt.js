<template>
  <v-container class="py-16">
    <v-row justify="center">
      <!-- ১. Returns & Warranty -->
      <v-col cols="12" md="4" class="text-center px-6">
        <div class="feature-item">
          <v-icon
            icon="mdi-shield-check-outline"
            size="80"
            class="mb-6 feature-icon"
          />
          <h3
            class="text-h5 font-weight-bold mb-4"
            :style="{ color: brandColor }"
          >
            Returns & Warranty
          </h3>
          <p class="text-body-1 text-grey-darken-1 lh-relaxed">
            Buy with confidence! Our products come with a warranty and easy
            return policy.
          </p>
        </div>
      </v-col>

      <!-- ২. Cash on Delivery -->
      <v-col cols="12" md="4" class="text-center px-6 border-x-md">
        <div class="feature-item">
          <v-icon
            icon="mdi-hand-coin-outline"
            size="80"
            class="mb-6 feature-icon"
          />
          <h3
            class="text-h5 font-weight-bold mb-4"
            :style="{ color: brandColor }"
          >
            Cash on Delivery
          </h3>
          <p class="text-body-1 text-grey-darken-1 lh-relaxed">
            Pay securely at your doorstep after receiving your product. No
            advance payment required.
          </p>
        </div>
      </v-col>

      <!-- ৩. Customer Support -->
      <v-col cols="12" md="4" class="text-center px-6">
        <div class="feature-item">
          <v-icon icon="mdi-headset" size="80" class="mb-6 feature-icon" />
          <h3
            class="text-h5 font-weight-bold mb-4"
            :style="{ color: brandColor }"
          >
            Customer Support
          </h3>
          <p class="text-body-1 text-grey-darken-1 lh-relaxed">
            Get assistance anytime! Our dedicated customer support team is ready
            to help you.
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const brandColor = "#3b2822";
</script>

<style scoped>
/* আইকন স্টাইলিং (ছবির মতো আউটলাইন লুক) */
.feature-icon {
  color: #000; /* ছবির মতো ব্ল্যাক আইকন */
  transition: transform 0.3s ease;
}

.feature-item:hover .feature-icon {
  transform: translateY(-10px);
  color: v-bind(brandColor); /* হোভার করলে ব্র্যান্ড কালার হবে */
}

/* লাইন হাইট এবং টেক্সট এলাইনমেন্ট */
.lh-relaxed {
  line-height: 1.6 !important;
  max-width: 320px;
  margin: 0 auto;
}

/* ডেক্সটপে মাঝখানের আইটেমের দুই পাশে বর্ডার (ঐচ্ছিক) */
@media (min-width: 960px) {
  .border-x-md {
    border-left: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
  }
}

/* মোবাইল রেসপন্সিভ */
@media (max-width: 959px) {
  .v-col {
    margin-bottom: 40px;
  }
}
</style>
