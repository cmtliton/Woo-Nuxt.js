<template>
  <v-container class="py-2 bg-grey-lighten-5" fluid>
    <OrdersList :orders="orders" />
  </v-container>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});
const { user } = useAuth();
const { data: orders } = await useFetch("/api/user/orders", {
  params: { customerId: user?.value.id },
});

useSeoMeta({
  title: "Order History | EMC Furniture & Engineering",
  description: "View your furniture order history and track delivery status.",
});
</script>
