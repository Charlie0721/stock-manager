<template>
  <ion-page>
    <h1>paginador de ordenes</h1>
  </ion-page>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue";

import { IonPage } from "@ionic/vue";
import router from "@/router";
import {OrdersService  } from "@/services/orders";
import { useRoute } from "vue-router";
const ordersService = new OrdersService();
const route = useRoute();
let page = ref<number>(1);
let limit = ref<number>(10);
let  offset= ref<number>(0) ;
let warehouseId
// const getOrders = async () => {
//   try {
//     const response = await ordersService.paginateOrders({
//       page: page.value,
//       limit: limit.value,
    
//     });
//     console.log("Orders:", response);
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//   }
// };

</script>

