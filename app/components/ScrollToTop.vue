<template>
  <v-fade-transition>
    <!-- বাটনটি তখনই দেখা যাবে যখন ইউজার ৩০০পিক্সেল স্ক্রল করবে -->
    <v-btn
      v-show="visible"
      class="scroll-btn elevation-6 mb-16"
      icon
      color="white"
      size="small"
      position="fixed"
      location="bottom right"
      @click="scrollToTop"
    >
      <!-- আইকনে আপনার ব্র্যান্ড কালার ব্যবহার করা হয়েছে -->
      <v-icon :color="brandColor" size="32">mdi-chevron-up</v-icon>

      <!-- টুলটিপ (ডেক্সটপের জন্য) -->
      <v-tooltip activator="parent" location="top"> Scroll to Top </v-tooltip>
    </v-btn>
  </v-fade-transition>
</template>

<script setup>
const brandColor = "#3b2822";
const visible = ref(false);

// স্ক্রল পজিশন চেক করার ফাংশন
const handleScroll = () => {
  visible.value = window.scrollY > 2048;
};

// স্মুথলি উপরে যাওয়ার ফাংশন
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.scroll-btn {
  /* হোয়্যাটসঅ্যাপ বাটনের সাথে যাতে সংঘর্ষ না হয় সেজন্য পজিশন অ্যাডজাস্টমেন্ট */
  bottom: 85px !important; /* সাধারণত নিচে চ্যাট বাটন থাকে, তাই এটি একটু উপরে রাখা হয়েছে */
  right: 25px !important;
  z-index: 99;
  border: 2px solid #3b2822 !important; /* আপনার ব্র্যান্ড কালারের বর্ডার */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.scroll-btn:hover {
  transform: translateY(-8px) scale(1.1); /* প্রিমিয়াম হোভার ইফেক্ট */
  background-color: #3b2822 !important; /* হোভার করলে ব্যাকগ্রাউন্ড ব্র্যান্ড কালার হবে */
}

.scroll-btn:hover .v-icon {
  color: white !important; /* হোভার করলে আইকন সাদা হবে */
}

/* মোবাইল ডিভাইসের জন্য সাইজ কিছুটা ছোট করা */
@media (max-width: 600px) {
  .scroll-btn {
    bottom: 90px !important;
    right: 20px !important;
    width: 45px !important;
    height: 45px !important;
  }
}
</style>
