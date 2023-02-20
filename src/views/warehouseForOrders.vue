<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <img
            class="edit-image1"
            src="../images/images_app/logo_header.png"
          />Seleccionar almacén
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card>
        <ion-card-content>
          <ion-item>
            <ion-label>Almacén predeterminado para pedidos</ion-label>
          </ion-item>
        </ion-card-content>
      </ion-card>

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
                <ion-select
                  :value="SelectIdalmacen"
                  @ionChange="SelectIdalmacen = $event.target.value"
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
                class="btn-edit-product"
                expand="full"
                @click="getIdalmacen()"
              >
                Aceptar</ion-button
              >
            </ion-card-content>
          </ion-card>
        </ion-fab-list>
      </ion-fab>
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
} from "@ionic/vue";
import axios from "axios";

export default defineComponent({
  name: "Tab1Page",
  components: {
    // ExploreContainer,
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
  },
  data() {
    return {
      i: allIcons,
      SelectIdalmacen: 0 as number,
      allWarehouses: [] as any,
      idalmacen: 0 as number,
    };
  },
  mounted() {
    this.getWarehouses();
    this.sendIdToOrders();
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
    getIdalmacen() {
      this.idalmacen = this.SelectIdalmacen;
      localStorage.setItem("idAlmacen", JSON.stringify(this.idalmacen));
      this.$router.push("/tabs/tab1");
    },
    fabToggled(e: any) {
      e.stopPropagation();
    },
    async sendIdToOrders() {
      if (localStorage.getItem("idAlmacen")) {
        const id = localStorage.getItem("idAlmacen");
        let idAlm;
        if (typeof id == "string") {
          idAlm = JSON.parse(id);
        }
        this.$router.push("/products-for-app");
      } else {
        this.$router.push("/warehouse-for-orders");
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "Atención !!!",
          subHeader: "Selecicone almacén !!!!",
          message: "Debe seleccionar almacén para generar pedidos !!!!",
          buttons: ["OK"],
        });
        await alert.present();
      }
    },
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
.edit-image1 {
  width: 5%;
  max-height: 5%;
}
</style>