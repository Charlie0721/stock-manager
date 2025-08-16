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
      <ion-button
        color="mycolor"
        id="open-modal"
        expand="block"
        @click="getProducts()"
      >
        <ion-icon :icon="icons.searchCircleSharp"></ion-icon>buscar
        producto</ion-button
      >
      <ion-modal
        ref="modal"
        trigger="open-modal"
        :can-dismiss="canDismiss"
        :presenting-element="presentingElement"
      >
        <ion-header>
          <ion-toolbar>
            <ion-title>Productos </ion-title>
            <ion-buttons slot="end">
              <ion-button @click="dismiss()">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
          <ion-item>
            <ion-label position="stacked">Código de barras</ion-label>
            <ion-input
              type="search"
              :value="searchByBarcode"
              @input="searchByBarcode = $event.target.value"
              placeholder="Código de barras"
              @keypress.enter="searchByBarcodeItem()"
            ></ion-input>
          </ion-item>

          <ion-searchbar
            @click="$refs.modal.$el.setCurrentBreakpoint(0.75)"
            placeholder="Buscar Producto"
            @ionChange="searchOneProduct($event)"
            @keypress.enter="searchItem()"
          ></ion-searchbar>
          <ion-button color="mycolor" @click="prevPage()" v-if="page > 1"
            >Anterior</ion-button
          >
          <ion-button color="mycolor" @click="nextPage()">Siguiente</ion-button>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-list>
            <ion-label>página {{ page }} </ion-label>
          </ion-list>
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
              <div v-if="orders">
                <h5 class="ion-text-wrap">
                  Cliente: {{ orders.nombres }} {{ orders.apellidos }}
                </h5>
                <ion-label>Nit cliente: {{ orders.nit }}</ion-label>
                <ion-label>Número de Pedido: {{ orders.numero }}</ion-label>
                <ion-label>Fecha: {{ orders.fecha }}</ion-label>
                <ion-label>Almacén: {{ orders.nomalmacen }}</ion-label>
                <ion-label>
                  Valor: ${{
                    new Intl.NumberFormat("de-DE").format(orders.valortotal)
                  }}
                </ion-label>
              </div>
              <div v-else>
                <ion-text color="warning"
                  >No se encontraron datos del pedido</ion-text
                >
              </div>
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
           <ion-icon :icon="icons.saveSharp"></ion-icon>
           GUARDAR CAMBIOS
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
  IonSearchbar,
  IonText,
} from "@ionic/vue";
import * as icons from "ionicons/icons";
import router from "@/router";
import { useRoute } from "vue-router";
import { OrdersService } from "@/services/orders";
import { StockManagerParamsService } from "@/services/stock_manager_params.service";
import { TradeOrders } from "@/services/tradeOrder";
interface IOrder {
  nombres: string;
  apellidos: string;
  nit: string;
  numero: number;
  fecha: string;
  nomalmacen: string;
  valortotal: number;
  idalmacen: number;
}

const stockManagerParamsService = new StockManagerParamsService();
const ordersService = new OrdersService();
let presentingElement = ref(undefined);
const route = useRoute();
let orderId = ref<number>(0);
orderId.value = +route.params.idpedido;
let orders = ref<IOrder | null>(null);
let products = ref<Array<any>>([]);
let _products = reactive([]);
let productsArray = reactive([]);
let uuid = ref<string>(localStorage.getItem("uuid"));
let page = ref<number>(1);
let limit = ref<number>(2);
let productDescription = ref<string>("");
let barcode = ref<string>("");
let searchByBarcode = ref<string>("");
const modal = ref(null);
let finalPrice = ref<number>(0);
onMounted(async () => {
  await findOne(orderId.value);
  await loadParams();
});
const loadParams = async () => {
  const responseParams = await stockManagerParamsService.findOne(uuid.value);
};
const getProducts = async (description?: string, bacode?: string) => {
  try {
    const responseParams = await stockManagerParamsService.findOne(uuid.value);
    let warehouseId = responseParams.data.Id_Almacen;
    productDescription.value = description || productDescription.value;
    barcode.value = bacode || barcode.value;
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
  if (response.data.data && response.data.data.length > 0) {
    const firstItem = response.data.data[0];

    orders.value = {
      nombres: firstItem?.nombres || "",
      apellidos: firstItem?.apellidos || "",
      nit: firstItem?.nit || "",
      numero: firstItem?.numero || 0,
      fecha: firstItem?.fecha || "",
      nomalmacen: firstItem?.nomalmacen || "",
      valortotal: firstItem?.valortotal || 0,
      idalmacen: firstItem?.idalmacen || 0,
    };
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
        codiva: p.codiva || "",
        porciva: p.porciva || 0,
        costoprod: p.costoprod || 0,
        despachado: p.despachado || 0,
        base: p.base || 0,
        ivaprod: p.ivaprod || 0,
      }))
    );
  } else {
    console.warn("No se encontraron datos para el pedido");
    orders.value = null;
    _products.splice(0, _products.length);
  }
};

const removeProduct = async (index: number) => {
  if (_products.length <= 1) {
    const alert = await alertController.create({
      header: "Advertencia",
      message: "El pedido debe contener al menos un producto",
      buttons: ["Entendido"],
    });
    await alert.present();
    return;
  }

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
  const responseParams = await stockManagerParamsService.findOne(uuid.value);
  let warehouseId = responseParams.data.Id_Almacen;
  await viewOrder(warehouseId, orders.value.numero);
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

const prevPage = async () => {
  if (page.value > 1) {
    page.value--;
    await getProducts();
  }
};
const nextPage = async () => {
  page.value++;
  await getProducts();
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
  selectPrice(finalPrice.value);

  if (finalPrice.value <= 0) {
    const alert = await alertController.create({
      cssClass: "my-custom-class",
      header: "ATENCIÓN !!!",
      subHeader: `NO PASA VALIDACIÓN `,
      message: `DEBE SELECCIONAR PRECIO`,
      buttons: ["ACEPTAR"],
    });
    await alert.present();
    return;
  }

  const product = {
    idproducto: idproducto,
    descripcion: descripcion,
    valorprod: finalPrice.value,
    costoprod: costoprod,
    codiva: codiva,
    cantidad: 1,
    despachado: 0,
    descuento: 0,
    porcdesc: 0,
    base: baseValue,
    ivaprod: taxValue,
    porciva: porcentaje,
    barcode,
  };

  productsArray.push(product);
  _products.push(product);

  finalPrice.value = 0;
};

const searchOneProduct = async (event: any) => {
  let searchProduct = event.target.value;
  productDescription.value = searchProduct.toUpperCase();
  if (searchProduct === "") {
    page.value = 1;
    await getProducts();
  }
};
const searchItem = async () => {
  await getProducts(productDescription.value);
};
const searchByBarcodeItem = async () => {
  barcode.value = searchByBarcode.value;
  if (barcode.value === "") {
    page.value = 1;
    await getProducts();
  } else {
    await getProducts(productDescription.value, barcode.value);
    setTimeout(async () => {
      barcode.value = "";
      await getProducts();
    }, 13000);
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

.custom-modal-content {
  --overflow: auto;
  --overflow-scroll-behavior: smooth;
}

.btn-edit-product {
  border-radius: 30px;
}
</style>