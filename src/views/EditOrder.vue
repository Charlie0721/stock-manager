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
      <ion-button color="mycolor" expand="block" @click="getProducts()">
        <ion-icon :icon="icons.searchCircleSharp"></ion-icon>buscar producto
      </ion-button>
      <ion-list>
        <ion-card>
          <ion-card-content>
            <ion-item>
              <ion-label>
                <h5 class="ion-text-wrap">
                  Cliente: {{ orders?.nombres }} {{ orders?.apellidos }}
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
  alertController,
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
import { StockManagerParamsService } from "@/services/stock_manager_params.service";
import { TradeOrders } from "@/services/tradeOrder";
const stockManagerParamsService = new StockManagerParamsService();
const ordersService = new OrdersService();

const route = useRoute();
let orderId = ref<number>(0);
orderId.value = +route.params.idpedido;
let orders = ref<Array<any>>([]);
let products = reactive([]);
let productArray = reactive([]);
let uuid = ref<string>(localStorage.getItem("uuid"));
let page = ref<number>(1);
let limit = ref<number>(1);
let productDescription = ref<string>("");
let barcode = ref<string>("");
onMounted(async () => {
  await findOne(orderId.value);
  await loadParams();
});
const loadParams = async () => {
  const responseParams = await stockManagerParamsService.findOne(uuid.value);
};
const getProducts = async () => {
  try {
    const responseParams = await stockManagerParamsService.findOne(uuid.value);
    let warehouseId = responseParams.data.Id_Almacen;

    const response = await TradeOrders.getProducts(
      warehouseId,
      limit.value,
      page.value,
      productDescription.value,
      barcode.value
    );
    products=response.data.newProducts;
    console.log("Products fetched:", products);
    
    if (products.length === 0) {
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "ATENCIÓN !!!",
        subHeader: `NO SE ENCONTRARON PRODUCTOS`,
        message: `NO SE ENCONTRARON PRODUCTOS CON LOS CRITERIOS DE BÚSQUEDA`,
        buttons: ["ACEPTAR"],
      });
      await alert.present();
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    const alert = await alertController.create({
      cssClass: "my-custom-class",
      header: "ATENCIÓN !!!",
      subHeader: `${error} `,
      message: `Error ${error.message}`,
      buttons: ["ACEPTAR"],
    });
    await alert.present();
  }
};

const findOne = async (orderId: number) => {
  const response = await ordersService.findOneOrder(orderId);

  orders.value = {
    nombres: response.data.data[0]?.nombres || "",
    apellidos: response.data.data[0]?.apellidos || "",
    nit: response.data.data[0]?.nit || "",
    numero: response.data.data[0]?.numero || 0,
    fecha: response.data.data[0]?.fecha || "",
    nomalmacen: response.data.data[0]?.nomalmacen || "",
    valortotal: response.data.data[0]?.valortotal || 0,
    idalmacen: response.data.data[0]?.idalmacen || 0,
  } as any;

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
  const alert = await alertController.create({
    cssClass: "my-custom-class",
    header: "ATENCION !!!",
    subHeader: `PEDIDO ACTUALIZADO`,
    message: `SE HAN GUARDADO LOS CAMBIOS`,
    buttons: ["ACEPTAR"],
  });
  await alert.present();
  await viewOrder(orders.value[0]?.idalmacen, orders.value[0]?.numero);
};

const viewOrder = async (idalmacen: number, number: number) => {
  if (idalmacen == 0 || number == 0) {
    const alert = await alertController.create({
      cssClass: "my-custom-class",
      header: "ATENCION !!!",
      subHeader: `NO SE ENCUENTRA INFORMACION `,
      message: `DEBE CARGAR PEDIDO`,
      buttons: ["ACEPTAR"],
    });
    await alert.present();
    return false;
  } else {
    router.push(`/view-order/${number}/${idalmacen}`);
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
</style>