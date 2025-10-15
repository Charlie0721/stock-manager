<template>
  <ion-page>
    <ion-toolbar>
      <ion-title>
        <img class="edit-image1" src="../images/images_app/logo_header.png" />
        Editar Inventario
      </ion-title>
    </ion-toolbar>
    <ion-content>
      <ion-item style="--min-height: 40px">
        <ion-label position="stacked">Almacén</ion-label>
        <ion-select
          interface="popover"
          style="max-width: 100%"
          v-model="warehouseId"
        >
          <ion-select-option
            :value="warehouse.idalmacen"
            v-for="warehouse in allWarehouses"
            :key="warehouse.idalmacen"
          >
            {{ warehouse.nomalmacen }}
          </ion-select-option>
        </ion-select>
      </ion-item>
      <ion-button
        color="mycolor"
        expand="block"
        @click="getProductsInventory()"
      >
        <ion-icon :icon="icons.searchCircleSharp"></ion-icon>buscar
        producto</ion-button
      >
      <ion-button
        expand="full"
        color="mycolor"
        class="btn-edit-product"
        @click="goToInventory()"
        ><ion-icon :icon="icons.arrowForwardSharp"></ion-icon>Volver
      </ion-button>
      <ion-item>
        <ion-input
          type="search"
          :value="searchByBarcode"
          @input="searchByBarcode = $event.target.value"
          placeholder="Buscar Código de barras"
          @keypress.enter="searchByBarcodeItem()"
        ></ion-input>
      </ion-item>
      <ion-searchbar
        placeholder="Buscar Producto por descripción"
        @ionChange="searchOneProduct($event)"
        @keypress.enter="searchItem()"
      ></ion-searchbar>
      <ion-button color="mycolor" @click="prevPage()" v-if="page > 1"
        >Anterior</ion-button
      >
      <ion-label>página {{ page }} </ion-label>

      <ion-button color="mycolor" @click="nextPage()">Siguiente</ion-button>

      <ion-card v-for="prod in products" :key="prod.idproducto">
        <ion-card-header>
          <ion-card-title>
            {{ prod.idproducto }}. {{ prod.descripcion }}</ion-card-title
          >
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-label position="stacked">Barras: {{ prod.barcode }}</ion-label>
            <ion-label position="stacked"
              >Cod interno: {{ prod.codigo }}</ion-label
            >
          </ion-item>
          <ion-item>
            <ion-label position="stacked"
              >Cantidad Actual: {{ prod.cantidad }}</ion-label
            >
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Nueva Cantidad</ion-label>
            <ion-input type="number" v-model.number="newQuantity"></ion-input>
          </ion-item>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script lang="ts" setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  alertController,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonList,
  IonButtons,
  IonSearchbar,
  IonText,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";
import * as icons from "ionicons/icons";
import { onMounted, reactive, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import router from "@/router";
const route = useRoute();
import { ProductsInventoryService } from "@/services/products-inventory.service";
import { TradeOrders } from "@/services/tradeOrder";

const productsInventoryService = new ProductsInventoryService();
let allWarehouses = ref<Array<any>>([]);
let warehouseId = ref<number>(0);
let page = ref<number>(1);
let limit = ref<number>(2);
let productDescription = ref<string>("");
let barcode = ref<string>("");
let searchByBarcode = ref<string>("");
let products = ref<Array<any>>([]);
let newQuantity = ref<number>(0);

onMounted(async () => {
  await getWarehouses();
});
const goToInventory = () => {
  router.push("/tabs/tab3");
};

const getWarehouses = async () => {
  const warehouses = await TradeOrders.getWarehouse();
  allWarehouses.value = warehouses.data;
};

const getProductsInventory = async (description?: string, bacode?: string) => {
  productDescription.value = description || productDescription.value;
  barcode.value = bacode || barcode.value;
  if (warehouseId.value === 0) {
    const alert = await alertController.create({
      header: "Alerta",
      message: "Seleccione un almacén",
      buttons: ["OK"],
    });
    await alert.present();
    return;
  }
  const response = await productsInventoryService.paginateProductsInventory(
    warehouseId.value,
    limit.value,
    page.value,
    productDescription.value,
    barcode.value
  );
  products.value = response.data.data.stock;
};
const searchOneProduct = async (event: any) => {
  let searchProduct = event.target.value;
  productDescription.value = searchProduct.toUpperCase();
  if (searchProduct === "") {
    page.value = 1;
    await getProductsInventory();
  }
};
const searchItem = async () => {
  await getProductsInventory(productDescription.value);
};
const searchByBarcodeItem = async () => {
  barcode.value = searchByBarcode.value;
  if (barcode.value === "") {
    page.value = 1;
    await getProductsInventory();
  } else {
    await getProductsInventory(productDescription.value, barcode.value);
    setTimeout(async () => {
      barcode.value = "";
      await getProductsInventory();
    }, 15000);
  }
};
const prevPage = async () => {
  if (page.value > 1) {
    page.value--;
    await getProductsInventory();
  }
};
const nextPage = async () => {
  page.value++;
  await getProductsInventory();
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