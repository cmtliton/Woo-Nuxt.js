<template>
  <div class="help-desk-container">
    <!-- ১. ফ্লোটিং অ্যাকশন বাটন (Speed Dial) -->
    <v-speed-dial
      v-model="open"
      location="bottom end"
      transition="scale-transition"
      class="help-dial"
    >
      <!-- মেইন বাটন (হেডসেট আইকন) -->
      <template #activator="{ props: activatorProps }">
        <v-btn
          v-bind="activatorProps"
          color="#3b2822"
          icon="mdi-headset"
          size="large"
          elevation="4"
          class="main-fab"
        >
          <v-icon v-if="!open">mdi-headset</v-icon>
          <v-icon v-else>mdi-close</v-icon>
        </v-btn>
      </template>

      <!-- হোয়াটসঅ্যাপ বাটন -->
      <v-btn
        key="1"
        color="#25D366"
        icon
        elevation="2"
        class="text-white"
        title="WhatsApp Support"
        @click="openWhatsApp"
      >
        <v-icon size="24">mdi-whatsapp</v-icon>
        <v-tooltip activator="parent" location="left"
          >WhatsApp Support</v-tooltip
        >
      </v-btn>

      <!-- মেসেঞ্জার বাটন -->
      <v-btn
        key="2"
        color="#0084FF"
        icon
        elevation="2"
        class="text-white"
        title="Facebook Messenger"
        @click="openMessenger"
      >
        <v-icon size="24">mdi-facebook-messenger</v-icon>
        <v-tooltip activator="parent" location="left">Messenger</v-tooltip>
      </v-btn>

      <!-- কল বাটন -->
      <v-btn
        key="3"
        color="#FFC107"
        icon
        elevation="2"
        class="text-white"
        title="Call Now"
        @click="callNow"
      >
        <v-icon size="24">mdi-phone</v-icon>
        <v-tooltip activator="parent" location="left">Call Now</v-tooltip>
      </v-btn>

      <!-- ইন্টারনাল চ্যাট বাটন -->
      <v-btn
        key="4"
        color="black"
        icon
        elevation="2"
        class="text-white"
        title="Live Chat"
        @click="openChat"
      >
        <v-icon size="24">mdi-chat</v-icon>
        <v-tooltip activator="parent" location="left">Live Chat</v-tooltip>
      </v-btn>
    </v-speed-dial>

    <!-- ২. লাইভ চ্যাট ডায়ালগ (Luxury UI) -->
    <v-dialog
      v-model="chatDialog"
      max-width="400"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card rounded="xl" elevation="12">
        <v-card-title
          class="bg-primary-brown text-white py-4 px-6 d-flex align-center"
        >
          <v-avatar size="32" class="mr-3" color="white">
            <v-icon color="#3b2822">mdi-headset</v-icon>
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-bold">EMC Support</div>
            <div class="text-caption opacity-80">
              Usually replies in minutes
            </div>
          </div>
          <v-spacer />
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click="chatDialog = false"
          />
        </v-card-title>

        <v-card-text class="pa-6">
          <p class="text-body-2 text-grey-darken-1 mb-4">
            Hello! How can we help you with our furniture or engineering
            services today?
          </p>
          <v-textarea
            v-model="message"
            label="Type your message here..."
            variant="outlined"
            rounded="lg"
            rows="3"
            color="#3b2822"
            hide-details
          />
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-btn
            block
            color="#3b2822"
            variant="flat"
            size="large"
            rounded="lg"
            class="font-weight-bold text-white"
            @click="sendMessage"
          >
            Send Message
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";

const open = ref(false);
const chatDialog = ref(false);
const message = ref("");

// ১. হোয়াটসঅ্যাপ ওপেন করা
const openWhatsApp = () => {
  window.open("https://wa.link/4yd33h", "_blank");
};

// ২. মেসেঞ্জার ওপেন করা
const openMessenger = () => {
  window.open("http://m.me/emcfurnitureandengineering", "_blank");
};

// ৩. সরাসরি ফোন কল
const callNow = () => {
  window.location.href = "tel:+8801301648832";
};

// ৪. কাস্টম চ্যাট ডায়ালগ ওপেন
const openChat = () => {
  chatDialog.value = true;
};

// ৫. মেসেজ সেন্ড লজিক (ইমেইল বা এপিআই এর সাথে কানেক্ট করতে পারেন)
const sendMessage = () => {
  if (message.value.trim()) {
    // উদাহরণস্বরূপ: হোয়াটসঅ্যাপে মেসেজটি পাঠিয়ে দেওয়া
    const encodedMsg = encodeURIComponent(message.value);
    window.open(`https://wa.me/8801839886882?text=${encodedMsg}`, "_blank");

    message.value = "";
    chatDialog.value = false;
  } else {
    alert("Please type a message before sending.");
  }
};
</script>

<style scoped>
.help-desk-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

.help-dial {
  position: absolute;
  bottom: 0;
  right: 0;
}

.main-fab {
  transition: transform 0.3s ease;
}

.main-fab:hover {
  transform: rotate(15deg) scale(1.1);
}

.bg-primary-brown {
  background-color: #3b2822 !important;
}

/* বাটন অ্যানিমেশন */
:deep(.v-speed-dial__list) {
  gap: 12px;
  padding-bottom: 20px;
}
</style>
