<template>
  <v-container class="bg-grey-lighten-5" fluid>
    <OrdersList :orders="orders" />
  </v-container>
</template>

<script setup>
const auth = useAuthStore();

const { data: orders } = await useFetch("/api/user/orders", {
  params: { customerId: auth.user?.id },
});

useSeoMeta({
  title: "Order History | EMC Furniture & Engineering",
  description: "View your furniture order history and track delivery status.",
});
</script>
