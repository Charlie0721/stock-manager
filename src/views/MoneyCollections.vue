<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <img class="edit-image1" src="../images/images_app/logo_header.png" />
          Recaudos
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">

      <ion-card>
        <ion-button id="nested-button" color="mycolor" class="btn-edit-product" expand="full" @click="getCustomers()">
          Seleccionar Cliente
        </ion-button>
        <ion-popover trigger="nested-button" :dismiss-on-select="false">
          <ion-card>
            <ion-searchbar animated debounce="500" placeholder="Buscar Nit" @ionChange="searchOneCustomer($event)"
              @keypress.enter="searchCustomerItem()">
            </ion-searchbar>
          </ion-card>
          <ion-card>
            <ion-searchbar animated debounce="500" placeholder="Buscar Nombres"
              @ionChange="searchOneCustomerByName($event)" @keypress.enter="searchCustomerItem()">
            </ion-searchbar>
          </ion-card>
          <ion-content>
            <ion-card>
              <ion-card-header>
                <ion-button color="mycolor" @click="prevPageCustomer()" v-if="page > 1">Anterior</ion-button>
                <ion-button color="mycolor" @click="nextPageCustomer()">Siguiente</ion-button>
                <span> página {{ page }} </span>
                <ion-card-title>Seleccionar Cliente</ion-card-title>
                <ion-card-subtitle>Click sobre el cliente</ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
                <ion-list background-hover="92949c" v-for="customer in customers.value" :key="customer.idtercero">
                  <ion-item>
                    <ion-label> NIT: {{ customer.nit }}</ion-label>
                  </ion-item>
                  <ion-item> {{ customer.nombres }} {{ customer.apellidos }}</ion-item>
                  <ion-button color="mycolor" @click="
                    selectCustomer(
                      customer.idtercero,
                      customer.nit,
                      customer.nombres,
                    )
                    ">Seleccionar</ion-button>
                </ion-list>
              </ion-card-content>
            </ion-card>
          </ion-content>
        </ion-popover>
        <ion-item>
          <ion-label position="floating">Valor a recaudar</ion-label>
          <ion-input type="text" :value="data.Valor" @input="data.Valor = $event.target.value">
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Descripción y/o observaciones</ion-label>
          <ion-textarea rows="5" :value="data.Descripcion"
            @input="data.Descripcion = $event.target.value"></ion-textarea>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input type="email" :value="data.eMail" @input="data.eMail = $event.target.value"></ion-input>
        </ion-item>

        <ion-button color="mycolor" class="btn-edit-product" expand="block" @click="create">Agregar</ion-button>
        <ion-button color="mycolor" class="btn-edit-product" expand="block" @click="goToOrders">Volver</ion-button>
        <ion-button color="mycolor" class="btn-edit-product" expand="block" @click="newMoneyCollection()"> Nuevo recaudo
        </ion-button>
      </ion-card>

      <ion-text color="medium" v-if="customerName">
        <ion-card>
          <ion-card-content>
            <ion-card-title>Datos de recaudo</ion-card-title>
            <h3>
              Cliente: {{ customerName }}
            </h3>
            <h3>
              nit: {{ customerNit }}
            </h3>
            <h3>
              Valor:$ {{ new Intl.NumberFormat("de-DE").format(data.Valor) }}
            </h3>
            <h3>
              Descripción: {{ data.Descripcion }}
            </h3>
            <h3>
              email: {{ data.eMail }}
            </h3>
            <ion-card-title>Cuentas por Cobrar</ion-card-title>
            <h3 v-for="account in pendingPortfolio.accountsReceivable" :key="account.numero">

              Factura: {{ account.numero }} <br>
              Cartera:${{ new Intl.NumberFormat("de-DE").format(account.valcuota) }} <br>
              Abono:${{ new Intl.NumberFormat("de-DE").format(account.credito) }} <br>
              ----------------------------------------------
            </h3>
            ------------------------------------------------
            <h3 v-for="item in pendingPortfolio.portfolio" :key="item.numero">
              Cartera :$ {{ new Intl.NumberFormat("de-DE").format(item.totalPortfolio) }} <br>
              Abonos:$ {{ new Intl.NumberFormat("de-DE").format(item.balance) }} <br>
              Total cartera:$ {{ new Intl.NumberFormat("de-DE").format(item.quotaValue) }} <br>
            </h3>
          </ion-card-content>
        </ion-card>
      </ion-text>


    </ion-content>
  </ion-page>
</template>
<script lang="ts" setup>
import {
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonContent,
  IonCard,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonTextarea,
  alertController,
  IonPopover,
  IonSearchbar,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
  IonCardHeader,
  IonList,
  IonText
} from "@ionic/vue";
import { MoneyCollectionsService } from "@/services/money-collections.service";
import { MoneyCollectionsInterface } from "@/interfaces/money-collections.interface";
import { onMounted, reactive, ref, watch } from "vue";
import router from "../router/index";
import { TradeOrders } from "../services/tradeOrder";
import { StockManagerParamsService } from "@/services/stock_manager_params.service";
const moneyCollectionService = new MoneyCollectionsService();
const stockManagerParamsService = new StockManagerParamsService();
let idtercero = ref<number>(0);
let customerName = ref<string>("");
let customerNit = ref<string>("");
let limit = ref<number>(2);
let page = ref<number>(1);
let nombres = ref<string>("");
let nit = ref<string>("");
let searhCustomer = ref<string>("");
let customers = reactive<any>([]);
let pendingPortfolio = reactive({
  accountsReceivable: [],
  portfolio: []
});
let sellerId = ref<number>(0);
let uuid = localStorage.getItem("uuid");

onMounted(async () => {
  sellerId.value = await getParams();
  data.value.IdVendedor = sellerId.value;
});



const selectCustomer = async (id: number, nit: string, nombres: string) => {
  idtercero.value = id;
  customerName.value = nombres;
  customerNit.value = nit;

  const response = await moneyCollectionService.checkAccountsReceivableByCustomer(id);
  if (response.data.response.status === 404) {
    const alert = await alertController.create({
      cssClass: "my-custom-class",
      header: `Atención`,
      message: `Cliente ${customerName.value} no registra cartera !`,
      buttons: ["OK"],
    });
    return await alert.present();
  }

  const portfolioArray = [];
  portfolioArray.push(response.data.response.portfolio);

  pendingPortfolio.accountsReceivable = response.data.response.accountsReceivable;
  pendingPortfolio.portfolio = portfolioArray;

}

const getCustomers = async () => {
  try {
    const allCustomers = await TradeOrders.getCustomers(limit.value, page.value, nombres.value, nit.value);
    customers.value = allCustomers.data.customer;

  } catch (error) {
    console.log(error);
    const alert = await alertController.create({
      cssClass: "my-custom-class",
      header: `Error !!!! ${error}`,
      message: `${error.message}`,
      buttons: ["OK"],
    });
    return await alert.present();
  }
}
const searchOneCustomer = async (event: any) => {
  try {
    searhCustomer.value = event.detail.value;
    nit.value = searhCustomer.value.toUpperCase();

    if (searhCustomer.value === "") {
      return await getCustomers();
    }
  } catch (error) {
    console.log(error);
  }
}
const searchOneCustomerByName = async (event: any) => {
  try {
    searhCustomer.value = event.detail.value;
    nombres.value = searhCustomer.value.toUpperCase();

    if (searhCustomer.value === "") {
      return await getCustomers();
    }
  } catch (error) {
    console.log(error);
  }
}
const searchCustomerItem = async () => {
  await getCustomers();
}
const prevPageCustomer = () => {
  if (page.value > 1) {
    page.value--;
    getCustomers();
  }
}

const nextPageCustomer = () => {
  page.value++;
  getCustomers();
}

const getParams = async (): Promise<number> => {
  const response = await stockManagerParamsService.findOne(uuid)
  let sellerId = response.data.Id_Vendedor
  return sellerId
}

const data = ref<MoneyCollectionsInterface>({
  IdVendedor: sellerId.value,
  IdCliente: idtercero.value,
  Valor: 0,
  Descripcion: "",
  eMail: ''
});

const create = async () => {
  try {

    if (data.value.Valor === 0 || data.value.Valor === null) {
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "ATENCIÓN !!!!",
        message: `El valor del recaudo debe ser mayor a 0 `,
        buttons: ["OK"],
      });
      data.value.Descripcion = "";
      return await alert.present();
    }
    if (data.value.Descripcion === "" || data.value.Descripcion === null) {
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "ATENCIÓN !!!!",
        message: `Debe ingresar una descripción con el detalle de la transacción `,
        buttons: ["OK"],
      });
      data.value.Valor = 0;
      return await alert.present();
    }
    if (data.value.IdCliente === 0 || data.value.IdCliente === null) {

      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "ATENCIÓN !!!!",
        message: `Debe seleccionar un cliente`,
        buttons: ["OK"],
      });
      data.value.Valor = 0;
      data.value.Descripcion = '';
      return await alert.present();
    }

    const response = await moneyCollectionService.create(data.value);
    const idRecaudo = response.data.response[0].IdRecaudo;
    const value = response.data.response[0].Valor;
    const alert = await alertController.create({
      cssClass: "my-custom-class",
      header: "CONFIRMACION !!!!",
      message: `Se ha generado el recaudo número ${idRecaudo}  por valor de  $ ${value} `,
      buttons: ["OK"],
    });
    await alert.present();
    goToDetail(idRecaudo);
  } catch (error) {
    console.log(error);
  }
};
const goToDetail = (moneyCollectionId: number) => {
  router.push(`/money-collections/${moneyCollectionId}`);
};
const goToOrders = () => {
  router.push('/trade-orders')
}
const newMoneyCollection = () => {
  location.reload();
}

watch(idtercero, (newValue) => {
  data.value.IdCliente = newValue;
});
</script>

<style scoped>
.edit-image1 {
  width: 5%;
  max-height: 5%;
}

.btn-edit-product {
  border-radius: 30px;
}

ion-button {
  background-color: var(--ion-color-mycolor);
  border-radius: 30px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  font-weight: bold;
  font-size: 1rem;
  margin: 5px;
}

ion-text {
  font-size: 1rem;
}
</style>