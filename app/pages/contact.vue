<template>
  <v-main class="bg-grey-lighten-5 mt-n16">
    <!-- ১. হিরো সেকশন (Banner) -->
    <v-sheet
      color="#3b2822"
      class="d-flex align-center justify-center text-center py-0"
      height="300"
      flat
    >
      <v-container>
        <h1 class="text-h3 text-md-h2 font-weight-bold text-white mb-4">
          Contact Us
        </h1>
        <p class="text-h6 text-grey-lighten-2 font-weight-light">
          Let's build something beautiful together. Reach out for a
          consultation.
        </p>
      </v-container>
    </v-sheet>

    <v-container class="mt-n16 pb-16">
      <v-row>
        <!-- ২. ডিরেক্ট কন্টাক্ট কার্ডস (Mobile Responsive) -->
        <v-col cols="12">
          <v-row>
            <v-col
              v-for="item in contactInfo"
              :key="item.title"
              cols="12"
              md="4"
            >
              <v-card
                height="100%"
                class="pa-6 text-center shadow-hover transition-swing"
                rounded="xl"
                border
              >
                <v-avatar
                  :color="brandColor"
                  size="70"
                  class="mb-4 elevation-2"
                >
                  <v-icon :icon="item.icon" color="white" size="32" />
                </v-avatar>
                <h3 class="text-h6 font-weight-bold mb-2">{{ item.title }}</h3>
                <p class="text-body-2 text-grey-darken-1 mb-4">
                  {{ item.desc }}
                </p>
                <v-btn
                  :href="item.link"
                  target="_blank"
                  variant="text"
                  class="font-weight-bold"
                  :color="brandColor"
                >
                  {{ item.action }}
                  <v-icon icon="mdi-arrow-right" class="ml-2" />
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-col>

        <!-- ৩. কন্টাক্ট ফর্ম এবং ম্যাপ সেকশন -->
        <v-col cols="12" md="7" class="mt-10">
          <v-card flat rounded="xl" class="pa-8 pa-md-12 border">
            <h2
              class="text-h4 font-weight-bold mb-6"
              :style="{ color: brandColor }"
            >
              Send a Message
            </h2>
            <v-form @submit.prevent="submitForm">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Full Name"
                    variant="outlined"
                    rounded="lg"
                    hide-details
                    class="mb-4"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Phone Number"
                    variant="outlined"
                    rounded="lg"
                    hide-details
                    class="mb-4"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Subject"
                    variant="outlined"
                    rounded="lg"
                    hide-details
                    class="mb-4"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    label="Project Requirements (Furniture/CNC/PEB)"
                    variant="outlined"
                    rounded="lg"
                    rows="4"
                  />
                </v-col>
                <v-col cols="12">
                  <v-btn
                    block
                    size="x-large"
                    :color="brandColor"
                    class="font-weight-bold text-white"
                    rounded="lg"
                    type="submit"
                  >
                    Submit Request
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-col>

        <!-- ৪. সোশ্যাল এবং লোকেশন ডিটেইলস -->
        <v-col cols="12" md="5" class="mt-10">
          <v-card
            flat
            rounded="xl"
            color="white"
            class="pa-8 border h-100 d-flex flex-column"
          >
            <h2 class="text-h5 font-weight-bold mb-6">Connect With Us</h2>

            <v-list class="bg-transparent pa-0">
              <v-list-item
                class="px-0 mb-4"
                prepend-icon="mdi-map-marker-outline"
              >
                <template #prepend>
                  <v-icon :color="brandColor" size="30" class="mr-4" />
                </template>
                <v-list-item-title class="font-weight-bold"
                  >Our Factory</v-list-item-title
                >
                <v-list-item-subtitle class="text-wrap"
                  >Kond Mollahbari, Boliarpur, Savar,
                  Dhaka.</v-list-item-subtitle
                >
              </v-list-item>

              <v-list-item class="px-0 mb-4" prepend-icon="mdi-facebook">
                <template #prepend>
                  <v-icon color="#1877F2" size="30" class="mr-4" />
                </template>
                <v-list-item-title class="font-weight-bold"
                  >Facebook Page</v-list-item-title
                >
                <v-list-item-subtitle>
                  <a
                    href="https://www.facebook.com/emcfurnitureandengineering/"
                    target="_blank"
                    class="text-decoration-none"
                    >emcfurnitureandengineering</a
                  >
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item class="px-0" prepend-icon="mdi-facebook-messenger">
                <template #prepend>
                  <v-icon color="#0084FF" size="30" class="mr-4" />
                </template>
                <v-list-item-title class="font-weight-bold"
                  >Messenger</v-list-item-title
                >
                <v-list-item-subtitle>
                  <a
                    href="http://m.me/emcfurnitureandengineering"
                    target="_blank"
                    class="text-decoration-none"
                    >Chat with our team</a
                  >
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <v-spacer />

            <!-- Decorative Image or Map Placeholder -->
            <NuxtImg
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
              height="200"
              cover
              rounded="lg"
              fit="cover"
              format="webp"
              loading="lazy"
              class="mt-6 w-100 h-100 transition-swing"
            />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
const brandColor = "#3b2822";

const contactInfo = [
  {
    title: "WhatsApp Support",
    desc: "Quick support for any furniture or CNC queries.",
    icon: "mdi-whatsapp",
    action: "Chat on WhatsApp",
    link: "https://wa.link/4yd33h",
  },
  {
    title: "Direct Call",
    desc: "Available from Sat - Thu (10 AM - 8 PM)",
    icon: "mdi-phone-in-talk",
    action: "Call +8801301648832",
    link: "tel:+8801301648832",
  },
  {
    title: "Visit Factory",
    desc: "Located at Mollahbari, Savar, Dhaka.",
    icon: "mdi-factory",
    action: "Get Directions",
    link: "https://www.google.com/maps/search/Kond+Mollahbari,+Boliarpur,+Savar,+Dhaka",
  },
];

const submitForm = () => {
  alert("Your message has been sent to EMC Furniture & Engineering!");
};

useSeoMeta({
  title: "Contact Us | EMC Furniture & Engineering",
  description:
    "Connect with EMC Furniture for CNC cutting, PEB structures, and luxury furniture solutions.",
});
</script>

<style scoped>
.shadow-hover {
  transition: all 0.3s ease;
}
.shadow-hover:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
  border-color: #3b2822 !important;
}

.text-wrap {
  white-space: normal;
}

/* Customizing V-Btn text-white manually */
.v-btn--variant-flat {
  color: white !important;
}

@media (max-width: 600px) {
  .text-h3 {
    font-size: 2.2rem !important;
  }
}
</style>
