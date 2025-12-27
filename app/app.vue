<template>
  <v-app>
    <GlobalLoader />
    <transition name="page" mode="out-in" />
    <NuxtLayout>
      <!-- :key="route.fullPath" যোগ করার ফলে ইউআরএল চেঞ্জ হলে পেজ রিলোড হবে -->
      <NuxtPage :key="$route.fullPath" />
    </NuxtLayout>
  </v-app>
</template>
<script setup></script>
