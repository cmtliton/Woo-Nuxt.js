<template>
  <v-footer class="bg-grey-darken-4 text-white pt-15 pb-5">
    <v-container>
      <v-row>
        <!-- ১. ব্র্যান্ড এবং বর্ণনা (Attractive Intro) -->
        <v-col cols="12" md="4" class="mb-8 mb-md-0">
          <div class="d-flex align-center mb-6">
            <v-img src="/Logo.png" max-width="60" class="mr-3" />
            <span class="text-h5 font-weight-black text-white"
              >EMC <span class="text-primary">FURNITURE</span></span
            >
          </div>
          <p class="text-body-2 text-grey-lighten-1 mb-6 pr-md-5 lh-lg">
            CNC Cutting, PEB, Metal Gate, Stair Design, Interior & Furniture
            Solutions under one roof! We work hard to create products that are
            beautiful, functional, and built to last. EMC Furniture &
            Engineering is the team you can trust.
          </p>
          <div class="d-flex gap-3">
            <v-btn
              v-for="social in socials"
              :key="social.icon"
              :icon="social.icon"
              :href="social.link"
              target="_blank"
              variant="tonal"
              color="white"
              size="small"
              class="social-btn"
            />
          </div>
        </v-col>

        <!-- ২. কুইক লিংক (Quick Links) -->
        <v-col cols="6" md="2" class="mb-8 mb-md-0">
          <h3 class="text-h6 font-weight-bold mb-6 text-primary">Services</h3>
          <v-list bg-color="transparent" density="compact" class="pa-0">
            <v-list-item
              v-for="s in services"
              :key="s"
              class="pa-0 min-height-0 mb-2"
            >
              <nuxt-link
                to="/shop"
                class="footer-link text-caption text-md-body-2"
                >{{ s }}</nuxt-link
              >
            </v-list-item>
          </v-list>
        </v-col>

        <!-- ৩. কাস্টমার সাপোর্ট (Support) -->
        <v-col cols="6" md="2" class="mb-8 mb-md-0">
          <h3 class="text-h6 font-weight-bold mb-6 text-primary">Explore</h3>
          <v-list bg-color="transparent" density="compact" class="pa-0">
            <v-list-item
              v-for="link in links"
              :key="link.title"
              class="pa-0 min-height-0 mb-2"
            >
              <nuxt-link
                :to="link.to"
                class="footer-link text-caption text-md-body-2"
                >{{ link.title }}</nuxt-link
              >
            </v-list-item>
          </v-list>
        </v-col>

        <!-- ৪. যোগাযোগ (Contact Details - Highly Lucrative) -->
        <v-col cols="12" md="4">
          <h3 class="text-h6 font-weight-bold mb-6 text-primary">
            Get In Touch
          </h3>

          <div class="d-flex align-start mb-4">
            <v-icon
              icon="mdi-map-marker-outline"
              color="primary"
              class="mr-3 mt-1"
            />
            <div>
              <div class="text-caption text-grey">Address</div>
              <div class="text-body-2 font-weight-medium">
                Kond Mollahbari, Boliarpur, Savar, Dhaka.
              </div>
            </div>
          </div>

          <div class="d-flex align-start mb-4">
            <v-icon
              icon="mdi-phone-outline"
              color="primary"
              class="mr-3 mt-1"
            />
            <div>
              <div class="text-caption text-grey">Call Us</div>
              <a
                href="tel:+8801301648832"
                class="text-body-2 font-weight-medium text-white text-decoration-none"
                >+880 1301-648832</a
              >
            </div>
          </div>

          <v-btn
            block
            color="success"
            prepend-icon="mdi-whatsapp"
            href="https://wa.link/4yd33h"
            target="_blank"
            class="mt-4 font-weight-bold"
            rounded="lg"
            size="large"
          >
            Chat on WhatsApp
          </v-btn>
        </v-col>
      </v-row>

      <v-divider class="my-10 border-opacity-25" color="white" />

      <!-- কপিরাইট অংশ -->
      <div
        class="d-flex flex-column flex-md-row justify-space-between align-center text-caption text-grey"
      >
        <div class="mb-2 mb-md-0">
          © {{ new Date().getFullYear() }}
          <strong>EMC Furniture & Engineering</strong>. All Rights Reserved.
        </div>
        <div class="d-flex gap-4">
          <nuxt-link to="/" class="text-grey text-decoration-none"
            >Privacy Policy</nuxt-link
          >
          <nuxt-link to="/" class="text-grey text-decoration-none"
            >Terms of Service</nuxt-link
          >
        </div>
      </div>
    </v-container>
  </v-footer>
</template>

<script setup>
const services = [
  "CNC Cutting",
  "PEB Structure",
  "Metal Gate",
  "Stair Design",
  "Furniture Solutions",
];
const links = [
  { title: "Home", to: "/" },
  { title: "Shop", to: "/shop" },
  { title: "All Chairs", to: "/shop" },
  { title: "Meeting Request", to: "/contact" },
  { title: "Contact Us", to: "/contact" },
];

const socials = [
  {
    icon: "mdi-facebook",
    link: "https://www.facebook.com/emcfurnitureandengineering/",
  },
  {
    icon: "mdi-facebook-messenger",
    link: "http://m.me/emcfurnitureandengineering",
  },
  { icon: "mdi-whatsapp", link: "https://wa.link/4yd33h" },
];
</script>

<style scoped>
.lh-lg {
  line-height: 1.8 !important;
}

.gap-3 {
  gap: 12px;
}
.gap-4 {
  gap: 20px;
}

.min-height-0 {
  min-height: unset !important;
}

.footer-link {
  text-decoration: none;
  color: #bdbdbd;
  transition: all 0.3s ease;
}

.footer-link:hover {
  color: rgb(var(--v-theme-primary));
  padding-left: 5px;
}

.social-btn {
  transition: transform 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-5px);
  background-color: rgb(var(--v-theme-primary)) !important;
  color: white !important;
}

/* মোবাইল রেসপন্সিভ অ্যাডজাস্টমেন্ট */
@media (max-width: 600px) {
  .v-footer {
    text-align: center;
  }
  .d-flex.align-start {
    justify-content: center;
    text-align: left;
  }
  .d-flex.gap-3 {
    justify-content: center;
  }
}
</style>
