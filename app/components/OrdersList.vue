<template>
  <v-container>
    <!-- ১. পেজ হেডার -->
    <div class="mb-8 d-flex align-center">
      <v-btn
        icon="mdi-arrow-left"
        variant="text"
        to="/dashboard"
        class="mr-4"
      />
      <div>
        <h1 class="text-h4 font-weight-bold" :style="{ color: brandColor }">
          My Orders
        </h1>
        <p class="text-subtitle-2 text-grey">
          Track and manage your furniture purchases
        </p>
      </div>
    </div>

    <!-- ২. অর্ডার লিস্ট (যদি ডাটা থাকে) -->
    <v-row v-if="orders.length > 0">
      <v-col cols="12">
        <v-expansion-panels variant="accordion" class="custom-panels">
          <v-expansion-panel
            v-for="order in orders"
            :key="order.id"
            class="mb-4 border rounded-lg overflow-hidden"
            elevation="0"
          >
            <!-- প্যানেল হেডার: অর্ডারের সারসংক্ষেপ -->
            <v-expansion-panel-title class="pa-6">
              <v-row no-gutters align="center">
                <v-col cols="12" sm="3">
                  <div
                    class="text-caption text-grey text-uppercase font-weight-bold"
                  >
                    Order Number
                  </div>
                  <div class="text-body-1 font-weight-black">
                    #{{ order.id }}
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div
                    class="text-caption text-grey text-uppercase font-weight-bold"
                  >
                    Date
                  </div>
                  <div class="text-body-1">
                    {{ formatDate(order.date_created) }}
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div
                    class="text-caption text-grey text-uppercase font-weight-bold"
                  >
                    Total
                  </div>
                  <div
                    class="text-body-1 font-weight-bold"
                    :style="{ color: brandColor }"
                  >
                    ৳{{ formatPrice(order.total) }}
                  </div>
                </v-col>
                <v-col cols="12" sm="3" class="mt-2 mt-sm-0">
                  <v-chip
                    :color="getStatusColor(order.status)"
                    size="small"
                    class="font-weight-bold text-uppercase"
                    variant="tonal"
                  >
                    {{ order.status }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-expansion-panel-title>

            <!-- প্যানেল কন্টেন্ট: বিস্তারিত তথ্য -->
            <v-expansion-panel-text class="pa-0">
              <v-divider />

              <!-- আইটেম লিস্ট -->
              <div class="pa-6">
                <h4 class="text-subtitle-1 font-weight-bold mb-4">
                  Ordered Items
                </h4>
                <v-list class="bg-transparent">
                  <v-list-item
                    v-for="item in order.line_items"
                    :key="item.id"
                    class="px-0 mb-4"
                  >
                    <template #prepend>
                      <v-avatar rounded="lg" size="70" class="mr-4 border">
                        <NuxtImg
                          :src="item.image?.src || '/Logo.png'"
                          width="70"
                          height="70"
                          fit="cover"
                        />
                      </v-avatar>
                    </template>
                    <v-list-item-title class="font-weight-bold text-wrap">
                      {{ item.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="mt-1">
                      Qty: {{ item.quantity }} × ৳{{ formatPrice(item.price) }}
                    </v-list-item-subtitle>
                    <template #append>
                      <div class="font-weight-black">
                        ৳{{ formatPrice(item.total) }}
                      </div>
                    </template>
                  </v-list-item>
                </v-list>

                <v-divider class="my-6" />

                <!-- ডেলিভারি এবং পেমেন্ট ইনফো -->
                <v-row>
                  <v-col cols="12" md="6">
                    <h4 class="text-subtitle-2 font-weight-bold mb-2">
                      Shipping Address
                    </h4>
                    <div class="text-caption text-grey-darken-1">
                      {{ order.shipping.first_name }}
                      {{ order.shipping.last_name }}
                      {{ order.shipping.address_1 }}
                      {{ order.shipping.city }},
                      {{ order.shipping.postcode }} Phone:
                      {{ order.shipping.phone }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <h4 class="text-subtitle-2 font-weight-bold mb-2">
                      Order Information
                    </h4>
                    <div class="d-flex justify-space-between text-caption mb-1">
                      <span>Payment Method:</span>
                      <span class="text-uppercase font-weight-bold">{{
                        order.payment_method
                      }}</span>
                    </div>
                    <div class="d-flex justify-space-between text-caption">
                      <span>Currency:</span>
                      <span class="font-weight-bold">{{ order.currency }}</span>
                    </div>
                    <v-btn
                      v-if="order.needs_payment"
                      block
                      :href="order.payment_url"
                      target="_blank"
                      color="success"
                      class="mt-4 font-weight-bold"
                      size="small"
                      flat
                    >
                      Pay Now
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <!-- ৩. এম্পটি স্টেট (অর্ডার না থাকলে) -->
    <v-sheet v-else class="text-center py-16 bg-transparent">
      <v-icon
        icon="mdi-package-variant"
        size="80"
        color="grey-lighten-2"
        class="mb-4"
      />
      <h3 class="text-h5 text-grey-darken-1">No orders found</h3>
      <p class="text-body-2 text-grey mb-6">
        You haven't placed any furniture orders yet.
      </p>
      <v-btn
        :color="brandColor"
        class="text-white px-10"
        rounded="lg"
        to="/shop"
        flat
      >
        Start Shopping
      </v-btn>
    </v-sheet>
  </v-container>
</template>

<script setup>
const brandColor = "#3b2822";
// আপনার ডাটা ফেচ করার লজিক এখানে (Props বা API Call)
// উদাহরণ হিসেবে আপনার দেওয়া JSON ডাটা এখানে orders হিসেবে কল্পনা করা হয়েছে।
defineProps({
  orders: {
    type: Array,
    default: () => [],
  },
});

// ইউটিলিটি ফাংশন
const formatPrice = (price) => {
  return parseFloat(price).toLocaleString("en-IN");
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "success";
    case "processing":
      return "info";
    case "pending":
      return "warning";
    case "on-hold":
      return "grey";
    case "cancelled":
    case "failed":
      return "error";
    default:
      return "primary";
  }
};
</script>

<style scoped>
.custom-panels :deep(.v-expansion-panel-title--active) {
  background-color: #3b2822 !important;
  color: white !important;
}

.custom-panels :deep(.v-expansion-panel-title--active .text-grey) {
  color: rgba(255, 255, 255, 0.7) !important;
}

.custom-panels :deep(.v-expansion-panel-title--active .text-body-1) {
  color: white !important;
}

/* স্লাইডিং অ্যানিমেশন স্মুথ করা */
.v-expansion-panel {
  transition: all 0.3s ease-in-out;
}

.text-wrap {
  white-space: normal;
  line-height: 1.4;
}
</style>
