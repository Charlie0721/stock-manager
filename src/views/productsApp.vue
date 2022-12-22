<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <img
            class="edit-image1"
            src="../images/images_app/logo_header.png"
          />Cargar Productos
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card>
        <ion-card-content>
          <ion-item>
            <ion-label>Actualizar Catalogo Productos</ion-label>
          </ion-item>
        </ion-card-content>
      </ion-card>

      <ion-button
        color="mycolor"
        class="btn-edit-product"
        expand="full"
        @click="loadProducts()"
      >
        <ion-icon :icon="i.refreshCircleSharp"> </ion-icon>
        Cargar</ion-button
      >
      <br />
      <br />
      <ion-progress-bar
        type="indeterminate"
        color="danger"
        v-if="changeProducts === true"
      ></ion-progress-bar>
      <br />
      <h2 class="letter-color" v-if="changeProducts === true">
        Cargando Productos
      </h2>
      <ion-progress-bar
        type="indeterminate"
        color="danger"
        v-if="changeProducts === true"
      ></ion-progress-bar>
      <br />
      <ion-progress-bar
        type="indeterminate"
        color="danger"
        v-if="changeProducts === true"
      ></ion-progress-bar>
      <br />
      <ion-progress-bar
        type="indeterminate"
        color="danger"
        v-if="changeProducts === true"
      ></ion-progress-bar>

      <ion-fab-list side="top" @click="fabToggled($event)">
        <ion-card>
          <ion-card-content> </ion-card-content>
        </ion-card>
      </ion-fab-list>
    </ion-content>
  </ion-page>
</template>
  
  
  <script lang="ts">
import { defineComponent } from "vue";
import * as allIcons from "ionicons/icons";
import { Products } from "@/services/Products";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  alertController,
  IonCard,
  IonCardContent,
  IonLabel,
  IonButton,
  IonItem,
  IonIcon,
  IonFabList,
  IonProgressBar,
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
    IonCardContent,
    IonLabel,
    IonButton,
    IonItem,
    IonProgressBar,
    IonIcon,

    IonFabList,
  },
  data() {
    return {
      i: allIcons,
      Allproducts: [] as any,
      changeProducts: false as boolean,
    };
  },

  methods: {
    fabToggled(e: any) {
      e.stopPropagation();
    },
    async loadProducts() {
      try {
        const getProduct = await Products.getAllProductsFromAplication();
        this.Allproducts = getProduct.data;

        localStorage.setItem("allProducts", JSON.stringify(this.Allproducts));
        this.changeProducts = true;
        this.sendProductsToApp();
        this.$router.push("/tabs/tab2");
      } catch (error) {
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "error !!!",
          message: error,
          buttons: ["OK"],
        });
        await alert.present();
      }
    },
    sendProductsToApp() {
      if (localStorage.getItem("allProducts")) {
        const products = localStorage.getItem("allProducts");
        let productsAll;
        if (typeof products == "string") {
          productsAll = JSON.parse(products);
        }
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
.letter-color {
  color: #82230d;
  text-shadow: 1px 1px #fff;
}
</style>