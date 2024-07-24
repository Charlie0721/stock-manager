<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <img class="edit-image1" src="../images/images_app/logo_header.png" />Seleccionar almacén
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card>
        <ion-card-content>
          <ion-item>
            <ion-label>Datos predeterminados para pedidos</ion-label>
          </ion-item>
        </ion-card-content>
      </ion-card>
      <ion-button id="nested-button" color="mycolor" class="btn-edit-product" expand="full"
        @click="getCustomers()"><ion-icon :icon="i.peopleCircleOutline"></ion-icon> Seleccionar Cliente
      </ion-button>
      <ion-popover trigger="nested-button" :dismiss-on-select="false">
        <ion-searchbar animated debounce="500" placeholder="Buscar cliente" @ionChange="searchOneCustomer($event)"
          @keypress.enter="searchCustomerItem()">
        </ion-searchbar>
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
              <ion-list background-hover="92949c" v-for="customer in customers" :key="customer.idtercero">
                <ion-item>
                  <ion-label> NIT: {{ customer.nit }}</ion-label>
                </ion-item>
                <ion-item> {{ customer.nombres }} </ion-item>
                <ion-button color="mycolor" @click="
                  selectCustomer(
                    customer.idtercero,
                    customer.nit,
                    customer.nombres
                  )
                  ">Seleccionar</ion-button>
              </ion-list>
            </ion-card-content>
          </ion-card>
        </ion-content>
      </ion-popover>
      <ion-button id="nested-button1" expand="full" color="mycolor" class="btn-edit-product"><ion-icon
          :icon="i.personCircleOutline"></ion-icon>Seleccionar Vendedor
      </ion-button>
      <ion-popover trigger="nested-button1" :dismiss-on-select="false">
        <ion-searchbar animated debounce="500" placeholder="Buscar empleado" @ionChange="searchOneEmployee($event)">
        </ion-searchbar>
        <ion-content>
          <ion-list>
            <ion-label>
              <ion-list background-hover="92949c" v-for="employee in employees" :key="employee.idtercero">
                <ion-item :button="true" :detail="false">
                  NIT: {{ employee.nit }}. {{ employee.nombres }}
                </ion-item> <ion-button color="mycolor" @click="
                  selectEmployee(
                    employee.idtercero,
                    employee.nit,
                    employee.nombres
                  )
                  ">Seleccionar</ion-button></ion-list> </ion-label>
          </ion-list>
        </ion-content>
      </ion-popover>
      <ion-fab id="remote_controller" horizontal="center" vertical="center">
        <ion-fab-button color="danger">
          <ion-icon :icon="i.add"></ion-icon>
        </ion-fab-button>
        <ion-fab-list side="top" @click="fabToggled($event)">
          <ion-card>
            <ion-card-header>Seleccionar Almacén</ion-card-header>
            <ion-card-content>
              <ion-item>
                <ion-label>Almacen</ion-label>
                <ion-select :value="SelectIdalmacen" @ionChange="SelectIdalmacen = $event.target.value">
                  <ion-select-option :value="warehouse.idalmacen" v-for="warehouse in allWarehouses"
                    :key="warehouse.idalmacen">
                    {{ warehouse.nomalmacen }}
                  </ion-select-option>
                </ion-select>
              </ion-item>
            </ion-card-content>
          </ion-card>
        </ion-fab-list>
      </ion-fab>

    </ion-content>
    <ion-content>
      <ion-card class="login-card">

        <p v-if="this.customerName !== ''">CLIENTE: {{ this.customerName }}</p>
        <p v-if="this.employeeName !== ''">VENDEDOR: {{ this.employeeName }}</p>
      </ion-card>
      <ion-button color="mycolor" class="btn-edit-product" expand="full" @click="getIdalmacen()"> Grabar</ion-button>
    </ion-content>
  </ion-page>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import * as allIcons from "ionicons/icons";
import { TradeOrders } from "@/services/tradeOrder";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  alertController,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonLabel,
  IonButton,
  IonItem,
  IonSelectOption,
  IonSelect,
  IonFabButton,
  IonIcon,
  IonFab,
  IonFabList,
  IonPopover,
  IonSearchbar,
  IonList,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/vue";
import { StockManagerParamsService } from "@/services/stock_manager_params.service";
import { IStockManagerParams } from "@/interfaces/stock_manager_params.interface";
import router from "@/router";
const stockManagerParamsService = new StockManagerParamsService()
export default defineComponent({
  name: "Tab1Page",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonLabel,
    IonButton,
    IonItem,
    IonSelectOption,
    IonSelect,
    IonFabButton,
    IonIcon,
    IonFab,
    IonFabList,
    IonPopover,
    IonSearchbar,
    IonList,
    IonCardSubtitle,
    IonCardTitle,

  },
  data() {
    return {
      i: allIcons,
      SelectIdalmacen: 0 as number,
      allWarehouses: [] as any,
      idalmacen: 0 as number,
      customers: [] as any,
      employees: [] as any,
      idvendedor: 0 as number,
      employeeNit: "" as string,
      employeeName: "" as string,
      limit: 2 as number,
      page: 1 as number,
      offset: 0 as number,
      totalPages: 0 as number,
      nombres: "" as string,
      nit: "" as string,
      customerName: "" as string,
      stockManagerParams: {} as IStockManagerParams

    };
  },
  mounted() {
    this.getEmployee();
    this.getWarehouses();
    let uuid = localStorage.getItem("uuid");
    this.getParamsData(uuid)
    //  this.sendIdToOrders();
  },

  methods: {
    async getWarehouses() {
      try {
        const warehouses = await TradeOrders.getWarehouse();
        this.allWarehouses = warehouses.data;
      } catch (error) {
        console.log(error);
      }
    },
    prevPageCustomer() {
      if (this.page > 1) {
        this.page--;
        this.getCustomers();
      }
    },
    async searchOneCustomer(event: any) {
      try {
        this.searhCustomer = event.detail.value;
        this.nit = this.searhCustomer.toUpperCase();

        if (this.searhCustomer === "") {
          return await this.getCustomers();
        }
      } catch (error) {
        console.log(error);
      }
    },
    nextPageCustomer() {
      this.page++;
      this.getCustomers();
    },
    async searchCustomerItem() {
      await this.getCustomers(this.nit);
    },
    selectCustomer(id: number, nit: string, nombres: string) {
      this.idtercero = id;
      this.customerName = nombres;
      this.customerNit = nit;
    },
    async getCustomers() {
      try {
        const customers = await TradeOrders.getCustomers(
          this.limit,
          this.page,
          this.nombres,
          this.nit
        );
        this.customers = customers.data.customer;
      } catch (error) {
        console.log(error);
      }
    },

    async searchOneEmployee(event: any) {
      try {
        this.searchEmployees = event.detail.value;

        this.searchEmployees = this.searchEmployees.toUpperCase();
        if (this.searchEmployees === "") {
          return await this.getEmployee();
        }
        if (this.searchEmployees && this.searchEmployees.trim() != "") {
          this.employees = this.employees.filter((employee: any) => {
            return (
              employee.nombres.toUpperCase().indexOf(this.searchEmployees) >
              -1 || employee.nit.indexOf(this.searchEmployees) > -1
            );
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getEmployee() {
      const employees = await TradeOrders.getEmployee();
      this.employees = employees.data.employee;
    },
    selectEmployee(id: number, nit: string, nombres: string) {


      this.idvendedor = id;
      this.employeeName = nombres;
      this.employeeNit = nit;
    },

    fabToggled(e: any) {
      e.stopPropagation();
    },

    async getParamsData() {
      let uuid = localStorage.getItem("uuid");
      const responseParams = await stockManagerParamsService.findOne(uuid);
      
      if (responseParams.data.status === 404) {

        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "Atención !",
          subHeader: "Seleccione almacén, cliente y vendedor",
          message: "Guardar la configuración de la aplcación",
          buttons: ["OK"],
        });
        await alert.present();
        return
      } else if (responseParams.status === 200) {
        this.$router.push("/tabs/tab1");
      }
    },
    async getIdalmacen() {
      this.idalmacen = this.SelectIdalmacen;

      this.idtercero
      this.idvendedor

      if (this.idalmacen === 0) {
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "¡Atención !",
          subHeader: "Seleccione almacén !!",
          message: "Debe seleccionar almacén predeterminado para generar pedidos",
          buttons: ["OK"],
        });
        await alert.present();
        return
      }

      if (this.idvendedor === 0 || this.idvendedor === undefined) {
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "¡Atención !",
          subHeader: "Seleccione Vendedor !!",
          message: "Debe seleccionar un vendedor predeterminado para generar pedidos",
          buttons: ["OK"],
        });
        await alert.present();
        return
      }
      if (this.idtercero === 0 || this.idtercero === undefined) {
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "¡Atención !",
          subHeader: "Seleccione Cliente !!",
          message: "Debe seleccionar un cliente predeterminado para generar pedidos",
          buttons: ["OK"],
        });
        await alert.present();
        return
      }

      await this.saveParams(this.idvendedor, this.idtercero, this.idalmacen);
    },

    async saveParams(sellerId: number, customerId: number, warehouseId: number,) {

      try {

        let uuid = localStorage.getItem("uuid");
        this.stockManagerParams.Id_Vendedor = sellerId;
        this.stockManagerParams.Id_Cliente = customerId;
        this.stockManagerParams.Id_Almacen = warehouseId;

        const responseSaveParams = await stockManagerParamsService.create(uuid, this.stockManagerParams)


        if (responseSaveParams.status == 201) {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "¡Confirmación !",
            subHeader: "Aprobado !!",
            message: "Configuración guardada satisfactoriamente !",
            buttons: ["OK"],
          });
          await alert.present();


          this.$router.push("/tabs/tab1");
        }


      } catch (error) {
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "Error !",
          subHeader: "Seleccione almacén, cliente y vendedor",
          message: `Error: ${error}`,
          buttons: ["OK"],
        });
        await alert.present();
      }

    }
  },
});
</script>
<style scoped>
.btn-edit-product {
  border-radius: 30px;
}

ion-button {
  background-color: var(--ion-color-mycolor);
}

ion-card.login-card {
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.edit-image1 {
  width: 5%;
  max-height: 5%;
}
</style>