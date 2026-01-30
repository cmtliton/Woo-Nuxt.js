<template>
  <v-container class="py-10 bg-grey-lighten-5" fluid>
    <v-container>
      <v-row>
        <!-- ১. বাম পাশের মেনু (Sidebar) -->
        <v-col cols="12" md="3">
          <v-card flat rounded="xl" border class="pa-4">
            <div class="text-center py-6">
              <v-avatar size="80" color="#3b2822" class="mb-4 elevation-4">
                <v-img v-if="userAvatar" :src="userAvatar" alt="User" cover />
                <span v-else class="text-h4 text-white">{{ userInitial }}</span>
              </v-avatar>
              <h3 class="text-h6 font-weight-bold">{{ userName }}</h3>
              <p class="text-caption text-grey">{{ userEmail }}</p>
            </div>

            <v-divider class="mb-4" />

            <v-list nav density="comfortable" bg-color="transparent">
              <v-list-item
                v-for="item in menuItems"
                :key="item.title"
                :to="item.to"
                :prepend-icon="item.icon"
                :title="item.title"
                rounded="lg"
                color="#3b2822"
                class="mb-1"
              />
              <v-divider class="my-2" />
              <v-list-item
                prepend-icon="mdi-logout"
                title="Logout"
                color="error"
                rounded="lg"
                :loading="loggingOut"
                @click="handleLogout"
              />
            </v-list>
          </v-card>
        </v-col>

        <!-- ২. ডান পাশের মেইন কন্টেন্ট -->
        <v-col cols="12" md="9">
          <!-- লোডিং স্কেলেটন (Data Fetching State) -->
          <div v-if="pending">
            <v-skeleton-loader
              type="image, article"
              class="mb-4 rounded-xl bg-transparent"
            />
            <v-row>
              <v-col v-for="n in 3" :key="n" md="4" cols="12">
                <v-skeleton-loader type="card" class="rounded-xl" />
              </v-col>
            </v-row>
          </div>

          <!-- মেইন ড্যাশবোর্ড কন্টেন্ট (Data Loaded) -->
          <div v-else>
            <!-- স্বাগতম সেকশন -->
            <v-card
              flat
              rounded="xl"
              color="#3b2822"
              class="pa-8 text-white mb-8 elevation-2"
            >
              <v-row align="center">
                <v-col cols="12" sm="8">
                  <h2 class="text-h4 font-weight-bold mb-2">
                    Hello, {{ firstName }}!
                  </h2>
                  <p class="text-body-1 opacity-80">
                    Welcome back. You have
                    <strong>{{ pendingOrderCount }}</strong> pending orders.
                    Manage your shipping addresses and password from here.
                  </p>
                </v-col>
                <v-col cols="12" sm="4" class="text-center d-none d-sm-block">
                  <v-icon
                    icon="mdi-armchair-outline"
                    size="100"
                    class="opacity-20"
                  />
                </v-col>
              </v-row>
            </v-card>

            <!-- স্ট্যাটাস কার্ডস (Dynamic Stats) -->
            <v-row class="mb-8">
              <v-col v-for="stat in stats" :key="stat.title" cols="12" sm="4">
                <v-card
                  flat
                  rounded="xl"
                  border
                  class="pa-6 text-center shadow-sm h-100 d-flex flex-column justify-center align-center"
                >
                  <v-icon
                    :icon="stat.icon"
                    :color="stat.color || brandColor"
                    size="32"
                    class="mb-2"
                  />
                  <div class="text-h4 font-weight-black">{{ stat.value }}</div>
                  <div
                    class="text-caption text-uppercase font-weight-bold text-grey"
                  >
                    {{ stat.title }}
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <!-- সাম্প্রতিক অর্ডার -->
            <v-card flat rounded="xl" border>
              <v-toolbar flat bg-color="transparent" class="px-4">
                <v-toolbar-title class="font-weight-bold text-subtitle-1"
                  >Recent Orders</v-toolbar-title
                >
                <v-spacer />
                <v-btn
                  to="/orders"
                  variant="text"
                  :color="brandColor"
                  class="text-capitalize"
                >
                  View All
                </v-btn>
              </v-toolbar>

              <v-divider />

              <v-table v-if="recentOrders.length > 0" hover>
                <thead>
                  <tr>
                    <th class="text-left font-weight-bold">Order</th>
                    <th class="text-left font-weight-bold">Date</th>
                    <th class="text-left font-weight-bold">Status</th>
                    <th class="text-left font-weight-bold">Total</th>
                    <th class="text-right font-weight-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in recentOrders" :key="order.id">
                    <td class="font-weight-bold text-primary">
                      #{{ order.id }}
                    </td>
                    <td class="text-caption">
                      {{ formatDate(order.date_created) }}
                    </td>
                    <td>
                      <v-chip
                        size="x-small"
                        :color="getStatusColor(order.status)"
                        class="font-weight-bold text-uppercase"
                      >
                        {{ order.status }}
                      </v-chip>
                    </td>
                    <td class="font-weight-bold">
                      ৳{{ formatPrice(order.total) }}
                    </td>
                    <td class="text-right">
                      <v-btn
                        icon="mdi-eye-outline"
                        variant="text"
                        size="small"
                        :to="`/orders/${order.id}`"
                      />
                    </td>
                  </tr>
                </tbody>
              </v-table>

              <!-- Empty State -->
              <div v-else class="pa-10 text-center">
                <v-icon
                  icon="mdi-package-variant"
                  size="48"
                  color="grey-lighten-2"
                  class="mb-4"
                />
                <p class="text-grey">No orders found.</p>
                <v-btn
                  :color="brandColor"
                  variant="tonal"
                  class="mt-4"
                  to="/shop"
                  >Start Shopping{{ totalSpent }}</v-btn
                >
              </div>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup>
// ১. সেশন এবং রাউটিং ইমপোর্ট
const { userName, userAvatar, userEmail, clear } = useAuth(); // nuxt-auth-utils
//const router = useRouter();
const brandColor = "#3b2822";

// ২. ডাইনামিক ডেটা ফেচিং (API Call)
// সার্ভার থেকে ইউজারের অর্ডারগুলো নিয়ে আসা হচ্ছে
const { data: orders, pending } = await useFetch("/api/user/orders", {
  key: "user-orders", // ক্যাশিং কী
  lazy: true, // পেজ লোড ফাস্ট হবে, পরে ডেটা আসবে
});

// ৩. কম্পিউটেড প্রপার্টিজ (Computed Properties)
const orderList = computed(() => orders.value || []); // নাল সেফটি

const userInitial = computed(() => userName.value.charAt(0).toUpperCase());
const firstName = computed(() => userName.value.split(" ")[0]);

// পরিসংখ্যান (Stats) ক্যালকুলেশন
const pendingOrderCount = computed(
  () =>
    orderList.value.filter((o) =>
      ["pending", "processing", "on-hold"].includes(o.status),
    ).length,
);

const completedOrderCount = computed(
  () => orderList.value.filter((o) => o.status === "completed").length,
);

const totalSpent = computed(() => {
  const total = orderList.value.reduce(
    (acc, order) => acc + parseFloat(order.total),
    0,
  );
  return new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(
    total,
  );
});

const stats = computed(() => [
  {
    title: "Total Orders",
    value: orderList.value.length,
    icon: "mdi-shopping-outline",
  },
  {
    title: "Pending",
    value: pendingOrderCount.value,
    icon: "mdi-clock-outline",
    color: "orange-darken-2",
  },
  {
    title: "Completed",
    value: completedOrderCount.value,
    icon: "mdi-check-circle-outline",
    color: "success",
  },
]);

const recentOrders = computed(() => orderList.value.slice(0, 5));

// ৪. মেনু আইটেম
const menuItems = [
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard-outline",
    to: "/dashboard",
  },
  {
    title: "My Orders",
    icon: "mdi-package-variant-closed",
    to: "/orders",
  },
  {
    title: "My Wishlist",
    icon: "mdi-heart-outline",
    to: "/wishlist",
  },
  {
    title: "Addresses",
    icon: "mdi-map-marker-outline",
    to: "/addresses",
  },
  {
    title: "Account Details",
    icon: "mdi-account-edit-outline",
    to: "/settings",
  },
];

// ৫. হেল্পার ফাংশন
const formatPrice = (p) => parseFloat(p).toLocaleString("en-BD");
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getStatusColor = (status) => {
  const map = {
    pending: "warning",
    processing: "info",
    "on-hold": "orange",
    completed: "success",
    cancelled: "error",
    refunded: "grey",
    failed: "error",
  };
  return map[status] || "grey";
};

// ৬. লগআউট লজিক
const loggingOut = ref(false);
const handleLogout = async () => {
  loggingOut.value = true;
  await clear(); // সেশন ক্লিয়ার
  await navigateTo("/login");
  loggingOut.value = false;
};

useSeoMeta({ title: "My Dashboard" });
</script>

<style scoped>
.shadow-sm {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03) !important;
  transition: transform 0.2s;
}
.shadow-sm:hover {
  transform: translateY(-2px);
}
.v-list-item--active {
  background-color: rgba(59, 40, 34, 0.08) !important;
  color: #3b2822 !important;
  font-weight: 600;
}
</style>
