<template>
  <v-card flat rounded="xl" class="pa-8 pa-md-12 border shadow-sm">
    <h2 class="text-h4 font-weight-bold mb-2" :style="{ color: brandColor }">
      {{ title }}
    </h2>
    <p class="text-body-2 text-grey-darken-1 mb-8">
      {{ subtitle }}
    </p>

    <v-form ref="formRef" v-model="isValid" @submit.prevent="handleSubmit">
      <v-row>
        <!-- নাম -->
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="formData.name"
            label="Full Name"
            variant="outlined"
            rounded="lg"
            :rules="[(v) => !!v || 'Name is required']"
            prepend-inner-icon="mdi-account-outline"
            color="#3b2822"
          />
        </v-col>

        <!-- ফোন নম্বর -->
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="formData.phone"
            label="Phone Number"
            variant="outlined"
            rounded="lg"
            :rules="[(v) => !!v || 'Phone is required']"
            prepend-inner-icon="mdi-phone-outline"
            color="#3b2822"
          />
        </v-col>

        <!-- বিষয় -->
        <v-col cols="12">
          <v-text-field
            v-model="formData.subject"
            label="Subject (e.g. Interior Design, CNC Quote)"
            variant="outlined"
            rounded="lg"
            prepend-inner-icon="mdi-tag-outline"
            color="#3b2822"
          />
        </v-col>

        <!-- রিকোয়ারমেন্টস/মেসেজ -->
        <v-col cols="12">
          <v-textarea
            v-model="formData.message"
            label="Project Requirements (Furniture/CNC/PEB)"
            variant="outlined"
            rounded="lg"
            rows="4"
            :rules="[(v) => !!v || 'Message is required']"
            prepend-inner-icon="mdi-pencil-outline"
            color="#3b2822"
          />
        </v-col>

        <!-- সাবমিট বাটন -->
        <v-col cols="12">
          <v-btn
            block
            size="x-large"
            :color="brandColor"
            class="font-weight-bold text-white shadow-lg"
            rounded="lg"
            type="submit"
            :loading="isSending"
          >
            {{ buttonText }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <!-- সাকসেস স্নাকবার (ঐচ্ছিক) -->
    <v-snackbar v-model="successAlert" color="success" location="top">
      Your message has been sent successfully!
    </v-snackbar>
  </v-card>
</template>

<script setup>
// Props ডিফাইন করা যাতে অন্য জায়গায় ব্যবহারের সময় টাইটেল চেঞ্জ করা যায়
defineProps({
  title: { type: String, default: "Send a Message" },
  subtitle: {
    type: String,
    default: "Have a custom project or a furniture query? Drop us a line.",
  },
  buttonText: { type: String, default: "Submit Request" },
});

const brandColor = "#3b2822";
const formRef = ref(null);
const isValid = ref(false);
const isSending = ref(false);
const successAlert = ref(false);

const formData = reactive({
  name: "",
  phone: "",
  subject: "",
  message: "",
});

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  isSending.value = true;
  try {
    const response = await $fetch("/api/email/send-order-email", {
      method: "POST",
      body: {
        name: formData.name,
        phone: formData.phone,
        subject: formData.subject || "General Inquiry",
        address: "Direct Web Form",
        message: formData.message,
      },
    });

    if (response.success) {
      successAlert.value = true;
      formRef.value.reset();
    }
  } catch (error) {
    alert("Failed to send message. Please try again.");
    console.error(error);
  } finally {
    isSending.value = false;
  }
};
</script>
