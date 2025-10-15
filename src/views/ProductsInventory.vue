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
  IonFooter,
  IonList,
  IonModal,
  IonButtons,
  IonSearchbar,
  IonText,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";
import * as icons from "ionicons/icons";
import { onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import router from "@/router";
import { ProductsInventoryService } from "@/services/products-inventory.service";
import { TradeOrders } from "@/services/tradeOrder";

const productsInventoryService = new ProductsInventoryService();
let allWarehouses = ref<Array<any>>([]);
let warehouseId = ref<number>(0);
let page = ref<number>(1);
let limit = ref<number>(5);
let productDescription = ref<string>("");
let barcode = ref<string>("");
let products = ref<Array<any>>([]);

onMounted(async () => {
  await getWarehouses();
});

const getWarehouses = async () => {
  const warehouses = await TradeOrders.getWarehouse();
  allWarehouses.value = warehouses.data;
  console.log(allWarehouses.value);
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
  console.log(products.value);
  
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