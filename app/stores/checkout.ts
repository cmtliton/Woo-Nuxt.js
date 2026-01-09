// app/stores/checkout.ts
import { defineStore } from 'pinia';
export const useCheckoutStore = defineStore('checkout', () => {
  const step = ref(1);
  const shippingAddress = ref({
    first_name: '', last_name: '', address_1: '', city: '', state: '', postcode: '', country: '', email: '', phone: ''
  });
  const billingAddress = ref({ ...shippingAddress.value });
  const sameAsShipping = ref(true);
  const paymentMethod = ref('stripe');

  return { step, shippingAddress, billingAddress, sameAsShipping, paymentMethod };
}, { persist: true });