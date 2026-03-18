<template>
  <v-app>
    <GlobalSnackbar />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>
<script setup></script>
<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
