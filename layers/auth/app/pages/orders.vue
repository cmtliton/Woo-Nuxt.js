<template>
  <v-container class="py-2 bg-grey-lighten-5" fluid>
    <OrdersList :orders="orders" />
    <pre>{{ userName }}-{{ userAvatar }}</pre>
  </v-container>
</template>

<script setup>
const auth = useAuthStore();
const { userName, userAvatar } = useAuth();

const { data: orders } = await useFetch("/api/user/orders", {
  params: { customerId: auth.user?.id },
});

useSeoMeta({
  title: "Order History | EMC Furniture & Engineering",
  description: "View your furniture order history and track delivery status.",
});
</script>
