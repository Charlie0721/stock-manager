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
      <ion-button color="mycolor" expand="full" @click="router.back()"
        ><ion-icon :icon="icons.arrowBackSharp"></ion-icon>Volver</ion-button
      >
      <ion-list>
        <ion-card>
          <ion-card-content>
            <ion-item>
              <ion-label>
                <h5 class="ion-text-wrap">
                  Cliente: {{ orders.nombres }} {{ orders.apellidos }}
                </h5>
                <ion-label>Nit cliente: : {{ orders.nit }}</ion-label>
                <ion-label>Número de Pedido: {{ orders.numero }}</ion-label>
                <ion-label>Fecha: {{ orders.fecha }}</ion-label>
                <ion-label>Almacén: {{ orders.nomalmacen }}</ion-label>
                <ion-label
                  >Valor:$
                  {{
                    new Intl.NumberFormat("de-DE").format(orders.valortotal)
                  }}</ion-label
                >
              </ion-label>
            </ion-item>
          </ion-card-content>
        </ion-card>
      </ion-list>

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
            color="mycolor"
            expand="full"
            @click="removeProduct(index)"
          >
            Eliminar producto
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-button color="mycolor" expand="block" @click="saveChanges">
          Guardar cambios
        </ion-button>
      </ion-toolbar>
    </ion-footer>
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
  IonIcon,
  IonFooter,
  IonList,
} from "@ionic/vue";
import * as icons from "ionicons/icons";
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
let orders = ref([]);
let products = reactive([]);

onMounted(async () => {
  await findOne(orderId.value);
});

const findOne = async (orderId: number) => {
  const response = await ordersService.findOneOrder(orderId);
  orders.value = response.data.data[1];

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
};
const removeProduct = (index: number) => {
  products.splice(index, 1);
};

const saveChanges = async () => {
  await ordersService.updateOrder(orderId.value, {
    detpedidos: products,
  });
  router.push("/pedidos");
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