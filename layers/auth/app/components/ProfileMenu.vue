<template>
  <div class="profile-menu">
    <!-- ১. যদি ইউজার লগইন না থাকে -->

    <v-btn
      v-if="!isAuthenticated"
      icon
      color="white"
      variant="text"
      @click="handleLogin"
    >
      <v-icon icon="mdi-account-outline" />
    </v-btn>

    <!-- ২. যদি ইউজার লগইন থাকে (ডাউনডাউন মেনু) -->
    <v-menu
      v-else
      min-width="240px"
      rounded="xl"
      transition="slide-y-transition"
    >
      <template #activator="{ props }">
        <v-btn icon v-bind="props" class="profile-avatar-btn">
          <v-avatar color="#3b2822" size="40" class="elevation-2">
            <v-img :alt="userName" :src="userAvatar" />
          </v-avatar>
        </v-btn>
      </template>

      <v-list class="pa-2 mt-2" elevation="10" border>
        <!-- ইউজার ইনফো হেডার -->
        <v-list-item class="mb-2 pa-4 bg-grey-lighten-4 rounded-lg">
          <template #prepend>
            <v-avatar color="#3b2822" size="48">
              <v-img :alt="userName" :src="userAvatar" />
            </v-avatar>
          </template>
          <v-list-item-title class="font-weight-black text-subtitle-1">
            {{ userName }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            {{ userEmail }}
          </v-list-item-subtitle>
        </v-list-item>

        <v-divider class="mb-2" />

        <!-- মেনু আইটেমসমূহ -->
        <v-list-item
          v-for="(item, i) in menuItems"
          :key="i"
          :to="item.to"
          :prepend-icon="item.icon"
          rounded="lg"
          class="mb-1"
          active-color="#3b2822"
        >
          <v-list-item-title class="text-body-2 font-weight-medium">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>

        <v-divider class="my-2" />

        <!-- লগআউট বাটন -->
        <v-list-item
          prepend-icon="mdi-logout"
          rounded="lg"
          color="error"
          @click="handleLogout"
        >
          <v-list-item-title class="text-body-2 font-weight-bold text-error">
            Sign Out
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup>
// আপনার তৈরি করা Auth Store

const { isAuthenticated, userName, userAvatar, userEmail, logout } = useAuth();

const menuItems = [
  {
    title: "My Profile",
    icon: "mdi-account-circle-outline",
    to: "/dashboard",
  },
  {
    title: "Order History",
    icon: "mdi-package-variant-closed",
    to: "/orders",
  },
  { title: "Wishlist", icon: "mdi-heart-outline", to: "/wishlist" },
  { title: "Settings", icon: "mdi-cog-outline", to: "/settings" },
];

const handleLogin = async () => {
  await navigateTo("/login-register");
};
const handleLogout = async () => {
  await logout();
  navigateTo("/");
};
</script>

<style scoped>
.profile-menu {
  display: flex;
  align-items: center;
}

.profile-avatar-btn {
  transition: transform 0.2s ease;
}

.profile-avatar-btn:hover {
  transform: scale(1.05);
}

:deep(.v-list-item__prepend > .v-icon) {
  opacity: 0.8;
  margin-inline-end: 16px !important;
}

/* শ্যাডো এবং বর্ডার ফিক্স */
.v-list {
  border-radius: 16px !important;
  overflow: hidden;
}
</style>
