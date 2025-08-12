<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <img class="edit-image1" src="../images/images_app/logo_header.png" />
          Editar Pedido con el id: {{ orderId }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card v-for="(prod, index) in products" :key="index">
        <ion-card-header>
          <ion-card-title>{{ prod.descripcion }}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-item>
            <ion-label position="stacked">Cantidad</ion-label>
            <ion-input type="number" v-model.number="prod.cantidad"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Valor</ion-label>
            <ion-input
              type="number"
              v-model.number="prod.valorprod"
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Descuento</ion-label>
            <ion-input
              type="number"
              v-model.number="prod.descuento"
            ></ion-input>
          </ion-item>

          <ion-button
           color="mycolor" expand="full"
            @click="removeProduct(index)"
          >
            Eliminar producto
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
    IonItem,
  IonLabel,
  IonInput,
  //   alertController,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
} from "@ionic/vue";
import router from "@/router";
import { useRoute } from "vue-router";
import { OrdersService } from "@/services/orders";
import {
  ItradeOrderDetail,
  ItradeOrderHeader,
} from "@/interfaces/traderOrder.interface";
const ordersService = new OrdersService();

const route = useRoute();
let orderId = ref<number>(0);
orderId.value = +route.params.idpedido;
let order = reactive<Partial<ItradeOrderHeader>>({});
let products = reactive([]);

onMounted(async () => {
  await findOne(orderId.value);
});

const findOne = async (orderId: number) => {
  const response = await ordersService.findOneOrder(orderId);
  order = response.data;
  console.log("Pedido:", order);
  products.splice(
    0,
    products.length,
    ...response.data.data.map((p: any) => ({
      idpedido: p.idpedido.toString(),
      idproducto: p.idproducto,
      descripcion: p.descripcion,
      cantidad: p.cantidad,
      valorprod: p.valorprod,
      descuento: p.descuento,
      porcdesc: p.porcdesc,
      codiva: "",
      porciva: 0,
      costoprod: 0,
      despachado: 0,
      base: 0,
      ivaprod: 0,
    }))
  );
  console.log("Productos:", products);
};
</script>
<style scoped>
ion-button {
  background-color: var(--ion-color-mycolor);
}
.edit-image1 {
  width: 5%;
  max-height: 5%;
}
</style>