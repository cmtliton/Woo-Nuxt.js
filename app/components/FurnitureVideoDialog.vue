<template>
  <div>
    <!-- ভিডিও ওপেন করার বাটন -->
    <v-btn
      color="#3b2822"
      prepend-icon="mdi-play-circle-outline"
      class="text-white font-weight-bold"
      rounded="lg"
      size="large"
      @click="dialog = true"
    >
      Watch Factory Video
    </v-btn>

    <!-- ভিডিও ডায়ালগ -->
    <v-dialog v-model="dialog" max-width="800">
      <v-card rounded="xl" class="overflow-hidden bg-black">
        <v-toolbar
          flat
          color="transparent"
          class="position-absolute"
          style="z-index: 10; right: 0"
        >
          <v-spacer />
          <v-btn
            icon="mdi-close"
            color="white"
            variant="tonal"
            @click="dialog = false"
          />
        </v-toolbar>

        <v-responsive :aspect-ratio="16 / 9">
          <!-- ভিডিও ট্যাগ (সরাসরি ফাইলের জন্য) বা Iframe (ইউটিউবের জন্য) -->
          <video
            v-if="dialog"
            controls
            autoplay
            class="w-100 h-100"
            src="https://www.youtube.com/watch?v=dsABXMNu-cw"
          >
            Your browser does not support the video tag.
          </video>
        </v-responsive>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
const dialog = ref(true);
</script>
