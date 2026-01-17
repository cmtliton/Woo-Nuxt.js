<!-- app/components/GlobalSnackbar.vue -->
<template>
  <v-snackbar
    v-model="snackbarStore.show"
    :color="snackbarStore.color"
    :timeout="snackbarStore.timeout"
    location="top right"
    elevation="24"
    rounded="lg"
  >
    <div class="d-flex align-center">
      <v-icon icon="mdi-check-circle" class="mr-3" />
      <span class="font-weight-medium">{{ snackbarStore.message }}</span>
    </div>

    <template #actions>
      <v-btn
        variant="text"
        icon="mdi-close"
        @click="snackbarStore.show = false"
      />
    </template>
  </v-snackbar>
</template>

<script setup>
const snackbarStore = useSnackbarStore();
</script>
