<!-- app/components/checkout/OrderSummary.vue -->
 <template>
<v-card variant="outlined" class="pa-4 bg-grey-lighten-4">
  <div class="text-h6 mb-4">Order Summary</div>
  <div v-for="item in cart.items" :key="item.id" class="d-flex mb-2">
    <v-avatar rounded="0" size="60" :image="item.image" />
    <div class="ml-4">
      <div class="text-body-2">{{ item.name }}</div>
      <div class="text-caption">Qty: {{ item.quantity }}</div>
    </div>
    <v-spacer />
    <div class="text-body-2">${{ item.price * item.quantity }}</div>
  </div>
  <v-divider class="my-4" />
  <div class="d-flex justify-space-between font-weight-bold">
    <span>Total</span>
    <span>${{ cart.totalPrice }}</span>
  </div>
</v-card>

</template>
<script setup>
const cart = useCartStore();    
</script>