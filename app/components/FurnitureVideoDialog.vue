<template>
  <div>
    <!-- ভিডিও ওপেন করার বাটন -->
    <v-btn
      color="#3b2822"
      prepend-icon="mdi-play-circle"
      class="text-white font-weight-bold"
      rounded="lg"
      size="large"
      elevation="2"
      @click="dialog = true"
    >
      Watch Factory Video
    </v-btn>

    <!-- ভিডিও ডায়ালগ -->
    <v-dialog
      v-model="dialog"
      max-width="900"
      transition="dialog-bottom-transition"
      class="video-dialog"
    >
      <v-card rounded="xl" class="bg-black overflow-hidden position-relative">
        <!-- ক্লোজ বাটন -->
        <v-btn
          icon="mdi-close"
          color="white"
          variant="tonal"
          size="small"
          class="position-absolute"
          style="top: 10px; right: 10px; z-index: 20"
          @click="dialog = false"
        />

        <v-responsive :aspect-ratio="16 / 9">
          <!-- ১. যদি ভিডিওটি ডিরেক্ট ফাইল (MP4) হয় -->

          <!-- ২. যদি ভিডিওটি YouTube থেকে হয় (এটি সবচেয়ে বেশি সাপোর্ট করে) -->
          <iframe
            v-if="dialog && isYoutube"
            src="https://youtu.be/VKnv9gsAa1M?list=TLGGpR1QGEpGKNAxNDAxMjAyNg"
            class="w-100 h-100 border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </v-responsive>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
const dialog = ref(true);
const videoPlayer = ref(null);

// ভিডিওটি ইউটিউব কি না তা ডিফাইন করুন (Toggle)
const isYoutube = ref(false);

// ডায়ালগ বন্ধ হলে ভিডিও পজ করার জন্য ওয়াচার
watch(dialog, (val) => {
  if (!val && videoPlayer.value) {
    videoPlayer.value.pause();
  }
});
</script>

<style scoped>
/* ভিডিওর কোয়ালিটি এবং মোবাইল ফিটিং */
video {
  object-fit: contain;
  background: #000;
}

.video-dialog :deep(.v-overlay__content) {
  margin: 12px;
}
</style>
