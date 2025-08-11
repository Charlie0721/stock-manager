<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <img class="edit-image1" src="../images/images_app/logo_header.png" />
          BUSCAR PEDIDOS
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card>
        <ion-card-content>
          <ion-item>
            <ion-label position="stacked" class="letter-color">Fecha</ion-label>
            <ion-input type="date" v-model="date"></ion-input>
            <ion-button
              color="mycolor"
              class="btn-edit-product"
              @click="searchOrderByDate(date)"
            >
              Consultar por fecha</ion-button
            >
          </ion-item>
          <ion-item>
            <ion-label position="stacked" class="letter-color"
              >Número de Pedido</ion-label
            >
            <ion-input
              type="number"
              v-model="orderNumber"
              @keypress.enter="searchOrderByNumber($event)"
            ></ion-input>
          </ion-item>
          <ion-button color="mycolor" @click="prevPage()" v-if="page > 1"
            >Anterior</ion-button
          >
          <ion-button color="mycolor" @click="nextPage()">Siguiente</ion-button>
        </ion-card-content>
        
        <ion-list v-for="order in orders" :key="order.idpedido">
          <ion-item>
            <ion-label>
              <h5 class="ion-text-wrap">
                Cliente: {{ order.nombres }} {{ order.apellidos }}
              </h5>
              <ion-label>Número de Pedido: {{ order.numero }}</ion-label>
              <ion-label>Fecha: {{ order.fecha }}</ion-label>
              <ion-label>Almacén: {{ order.nomalmacen }}</ion-label>
              <ion-label
              >Valor:$
              {{
                new Intl.NumberFormat("de-DE").format(order.valortotal)
              }}</ion-label
              >
              <ion-button color="mycolor" 
                >Editar</ion-button
              >
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue";
import {
  IonPage,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSearchbar,
  alertController,
  IonList,
} from "@ionic/vue";
import router from "@/router";
import { OrdersService } from "@/services/orders";
import { useRoute } from "vue-router";
import { TOrderType } from "@/interfaces/order.type";
const ordersService = new OrdersService();
const route = useRoute();
let page = ref<number>(1);
let limit = ref<number>(5);
let offset = ref<number>(0);
let warehouseId = ref<number>(0);
let sellerId = ref<number>(0);
let date = ref<string>("");
let orderNumber = ref<number>(0);
let orders = ref<Array<TOrderType>>([]);
warehouseId.value = +route.params.idalmacen;
sellerId.value = +route.params.idvendedor;

onMounted(async () => {
  await getOrders();
});

const prevPage = async () => {
  if (page.value > 1) {
    page.value--;
    await getOrders();
  }
};
const nextPage = async () => {
  page.value++;
  await getOrders();
};
const searchOrderByDate = async (dateParam: string) => {
  date.value = dateParam.replace(/-/gi, "");

  if (dateParam) {
    page.value = 1;
    await getOrders(date.value);
  }
};
const searchOrderByNumber = async (event: any) => {
  orderNumber.value = event.target.value;
  if (orderNumber.value) {
    page.value = 1;
    await getOrders(date.value, orderNumber.value);
  }
};

const getOrders = async (date?: string, number?: number) => {
  try {
    if (!date) {
      date = "";
    }
    if (!number) {
      number = 0;
    }
    const response = await ordersService.paginateOrders(
      warehouseId.value,
      sellerId.value,
      page.value,
      limit.value,
      date,
      number
    );
    if (response.status === 200) {
      orders.value = response.data.data;
    } else {
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "Atencion !!!",
        subHeader: `No hay información`,
        message: `No se encontraron pedidos`,
        buttons: ["ACEPTAR"],
      });
      await alert.present();
      orders.value = [];
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    orders.value = [];
  }
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

.btn-edit-product {
  border-radius: 30px;
}

.letter-color {
  color: #82230d;
  text-shadow: 1px 1px #fff;
}
</style>

