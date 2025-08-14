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
      <ion-button
        color="mycolor"
        id="open-modal"
        expand="block"
        @click="getProducts()"
        >Open Products</ion-button
      >
      <ion-modal
        ref="modal"
        trigger="open-modal"
        :can-dismiss="canDismiss"
        :presenting-element="presentingElement"
      >
        <ion-header>
          <ion-toolbar>
            <ion-title>Productos</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="dismiss()">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-list v-for="product in products" :key="product.idproducto">
            <ion-item>
              <ion-label>
                <h5 class="ion-text-wrap">{{ product.descripcion }}</h5>
                <ion-label>Cod. Interno: {{ product.codigo }} </ion-label>
                <ion-label> Cantidad:{{ product.cantidad }} </ion-label>
                <ion-label>Cod.Barras:{{ product.barcode }} </ion-label>
                <ion-button
                  color="mycolor"
                  @click="selectPrice(product.precioventa)"
                >
                  $
                  {{
                    new Intl.NumberFormat("de-DE").format(product.precioventa)
                  }}
                </ion-button>
                <ion-button
                  color="mycolor"
                  @click="selectPrice(product.precioespecial1)"
                  v-if="product.precioespecial1 > 0"
                >
                  $
                  {{
                    new Intl.NumberFormat("de-DE").format(
                      product.precioespecial1
                    )
                  }}
                </ion-button>
                <ion-button
                  color="mycolor"
                  @click="selectPrice(product.precioespecial2)"
                  v-if="product.precioespecial2 > 0"
                >
                  $
                  {{
                    new Intl.NumberFormat("de-DE").format(
                      product.precioespecial2
                    )
                  }}
                </ion-button>

                <ion-button
                  color="mycolor"
                  class="btn-edit-product"
                  expand="full"
                  @click="
                    selectProduct(
                      product.idproducto,
                      product.descripcion,
                      product.ultcosto,
                      product.codiva,
                      product.baseValue,
                      product.taxValue,
                      product.porcentaje,
                      product.barcode
                    )
                  "
                >
                  Agregar<ion-icon
                    :icon="icons.checkmarkCircleOutline"
                  ></ion-icon>
                </ion-button>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-modal>
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

      <ion-card v-for="(prod, index) in _products" :key="index">
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
  IonModal,
  IonButtons,
} from "@ionic/vue";
import * as icons from "ionicons/icons";
import router from "@/router";
import { useRoute } from "vue-router";
import { OrdersService } from "@/services/orders";
import { StockManagerParamsService } from "@/services/stock_manager_params.service";
import { TradeOrders } from "@/services/tradeOrder";
const stockManagerParamsService = new StockManagerParamsService();
const ordersService = new OrdersService();
let presentingElement = ref(undefined);
const route = useRoute();
let orderId = ref<number>(0);
orderId.value = +route.params.idpedido;
let orders = ref<Array<any>>([]);
let products = ref<Array<any>>([]);
let _products = reactive([]);
let productArray = reactive([]);
let uuid = ref<string>(localStorage.getItem("uuid"));
let page = ref<number>(1);
let limit = ref<number>(2);
let productDescription = ref<string>("");
let barcode = ref<string>("");
const modal = ref(null);
let finalPrice = ref<number>(0);
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
    products.value = response.data.newProducts;

    if (products.value.length === 0) {
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
const selectPrice = (price: number) => {
  finalPrice.value = price;
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
  _products.splice(
    0,
    _products.length,
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
  _products.splice(index, 1);
};

const saveChanges = async () => {
  await ordersService.updateOrder(orderId.value, {
    detpedidos: _products,
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
const dismiss = () => {
  modal.value.$el.dismiss();
};
const canDismiss = async (data?: any, role?: string) => {
  return role !== "gesture";
};
const selectProduct = async (
  idproducto: number,
  descripcion: string,
  costoprod: number,
  codiva: string,
  baseValue: number,
  taxValue: number,
  porcentaje: number,
  barcode: string
) => {
  console.log(
    idproducto,
    descripcion,
    costoprod,
    codiva,
    baseValue,
    taxValue,
    porcentaje,
    barcode
  );
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

.custom-modal-content {
  --overflow: auto;
  --overflow-scroll-behavior: smooth;
}

.btn-edit-product {
  border-radius: 30px;
}
</style>