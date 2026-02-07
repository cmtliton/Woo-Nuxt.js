<template>
  <div>
    <v-divider class="my-4" />
    <div class="d-flex align-center flex-wrap gap-2">
      <span
        class="text-subtitle-2 font-weight-bold mr-2"
        style="color: #3b2822"
      >
        Share with friends:
      </span>

      <!-- সোশ্যাল বাটন লুপ -->
      <v-btn
        v-for="social in shareLinks"
        :key="social.name"
        :icon="social.icon"
        :color="social.color"
        variant="tonal"
        size="small"
        class="share-btn ma-1"
        @click="openShareWindow(social.url)"
      >
        <v-icon size="20">{{ social.icon }}</v-icon>
        <v-tooltip activator="parent" location="top">
          Share on {{ social.name }}
        </v-tooltip>
      </v-btn>

      <!-- কপি লিংক বাটন -->
      <v-btn
        icon
        variant="tonal"
        size="small"
        color="grey-darken-2"
        class="share-btn ma-1"
        @click="copyToClipboard"
      >
        <v-icon size="20">mdi-link-variant</v-icon>
        <v-tooltip activator="parent" location="top">Copy Link</v-tooltip>
      </v-btn>
    </div>

    <!-- কপি হওয়ার নোটিফিকেশন -->
    <v-snackbar
      v-model="snackbar"
      :timeout="2000"
      color="success"
      location="bottom"
    >
      Link copied to clipboard!
    </v-snackbar>
  </div>
</template>

<script setup>
// Props রিসিভ করা (যাতে যেকোনো পেজ থেকে ডাটা পাঠানো যায়)
const props = defineProps({
  title: {
    type: String,
    required: false,
    default: "EMC Furniture Product",
  },
  url: {
    type: String, // এটা ব্রাউজারের বর্তমান URL হতে পারে অথবা কাস্টম
    required: false,
    default: "",
  },
});

const snackbar = ref(false);

// বর্তমান URL পাওয়ার জন্য (যদি props এ না আসে)
const currentUrl = computed(() => {
  if (props.url) return props.url;
  if (import.meta.client) return window.location.href;
  return "";
});

// URL এনকোড করা
const encodedUrl = computed(() => encodeURIComponent(currentUrl.value));
const encodedTitle = computed(() => encodeURIComponent(props.title));

// শেয়ার লিংক জেনারেট করা
const shareLinks = computed(() => [
  {
    name: "WhatsApp",
    icon: "mdi-whatsapp",
    color: "green",
    // FIX: ডুপ্লিকেট টাইটেল রিমুভ করা হয়েছে। শুধু URL পাঠানো হচ্ছে।
    // প্রিভিউ কার্ড অটোমেটিক টাইটেল দেখাবে।
    url: `https://api.whatsapp.com/send?text=${encodedUrl.value}`,
  },
  {
    name: "Facebook",
    icon: "mdi-facebook",
    color: "blue-darken-2",
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl.value}`,
  },
  {
    name: "Messenger",
    icon: "mdi-facebook-messenger",
    color: "blue",
    url: `fb-messenger://share/?link=${encodedUrl.value}`,
  },
  {
    name: "Twitter (X)",
    icon: "mdi-twitter",
    color: "black",
    url: `https://twitter.com/intent/tweet?text=${encodedTitle.value}&url=${encodedUrl.value}`,
  },
]);

// উইন্ডো ওপেন করার ফাংশন
const openShareWindow = (url) => {
  if (!url) return;
  window.open(url, "_blank", "width=600,height=400");
};

// কপি লিংক ফাংশন
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(currentUrl.value);
    snackbar.value = true;
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};
</script>

<style scoped>
.share-btn:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}
</style>
