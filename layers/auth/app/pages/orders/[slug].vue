<template>
  <div>{{ slug }}</div>
</template>
<script setup>
// 1. Get Order Slug from Route Params
const route = useRoute();
const slug = route.params.slug;
</script>
