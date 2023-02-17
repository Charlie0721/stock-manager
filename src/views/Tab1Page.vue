<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title
          ><img class="edit-image" src="../images/images_app/logo_header.png" />
          Consultar Inventarios
          <ion-button
            color="mycolor"
            class="btn-edit-product"
            @click="goToCollector()"
          >
            Recolector
          </ion-button>
        </ion-title>
      </ion-toolbar>
      <ion-searchbar
        animated
        debounce="500"
        placeholder="Buscar Producto"
        @ionChange="searchOneProduct($event)"
      >
      </ion-searchbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-input
        type="text"
        :value="searchByBarcode"
        @input="searchByBarcode = $event.target.value"
        placeholder="Código de barras"
        @ionChange="searchBarcode($event)"
        :clear-input="true" 
      ></ion-input>
      <ion-button
        color="mycolor"
        expand="full"
        class="btn-edit-product"
        @click="startScan()"
      >
        Buscar Código barras</ion-button
      >
      <ion-card v-for="product in products" :key="product.product">
        <ion-card-header>
          <ion-card-title>
            <h4 class="letter-color">
              {{ product.descripcion }}
            </h4></ion-card-title
          >
          <ion-card-title> Existencias: {{ product.cantidad }}</ion-card-title>
          <ion-card-subtitle
            >Código Barras: {{ product.barcode }}
          </ion-card-subtitle>

          <ion-card-subtitle
            >Código Interno: {{ product.codigo }}</ion-card-subtitle
          >
        </ion-card-header>

        <ion-card-content>
          {{ product.nomalmacen }}
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { productsQuantities } from "../services/searchPricesService";
import {
  BarcodeScanner,
  SupportedFormat,
} from "@capacitor-community/barcode-scanner";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  alertController,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
  IonCardSubtitle,
  IonSearchbar,
  IonButton,
  IonInput,
} from "@ionic/vue";
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
    IonCardTitle,
    IonCardHeader,
    IonCardContent,
    IonCardSubtitle,
    IonSearchbar,
    IonButton,
    IonInput,
  },

  data() {
    return {
      products: [] as any,
      searchProduct: "" as string,
      searchByBarcode: "" as string,
    };
  },
  mounted() {
    this.getProductsQuantities();
  },
  methods: {
    async getProductsQuantities() {
      try {
        const responseProducts = await productsQuantities();
        this.products = responseProducts.data[0];
      } catch (error) {
        console.error(error);
      }
    },
    async searchBarcode(e: any) {
      try {
        this.searchByBarcode = e.detail.value;
        this.searchByBarcode = this.searchByBarcode.toUpperCase();
        if (this.searchByBarcode === "") {
          return await this.getProductsQuantities();
        }
        if (this.searchByBarcode && this.searchByBarcode.trim() != "") {
          this.products = this.products.filter((product: any) => {
            return product.barcode.indexOf(this.searchByBarcode) > -1;
          });
        }
      } catch (error) {
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "ERROR !!!",
          subHeader: `${error.message} `,
          message: `Error: ${error.message}`,
          buttons: ["ACEPTAR"],
        });
        await alert.present();
      }
    },

    async startScan() {
      try {
        this.didUserGrantPermission();
        document.body.style.opacity = "0.2";
        document.body.style.background = "transparent";

        BarcodeScanner.hideBackground(); // make background of WebView transparent

        const result = await BarcodeScanner.startScan({
          targetedFormats: [
            SupportedFormat.QR_CODE,
            SupportedFormat.CODE_128,
            SupportedFormat.EAN_13,
            SupportedFormat.EAN_8,
          ],
        }); // start scanning and wait for a result

        // if the result has content
        if (result.hasContent) {
          document.body.style.background = "";
          document.body.style.opacity = "1";
          console.log(result.content); // log the raw scanned content
        }
        this.searchByBarcode = result.content;
      } catch (error) {
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "Error !!! ",
          message: `error: ${error.message}`,
          buttons: ["ACEPTAR"],
        });
        await alert.present();
        return false;
      }
    },
    stopScan() {
      BarcodeScanner.showBackground();
      BarcodeScanner.stopScan();
    },

    deactivated() {
      this.stopScan();
    },

    beforeDestroy() {
      this.stopScan();
    },
    async didUserGrantPermission() {
      try {
        const status = await BarcodeScanner.checkPermission({ force: false });

        if (status.granted) {
          // user granted permission
          return true;
        }

        if (status.denied) {
          // user denied permission
          return false;
        }

        if (status.asked) {
          // system requested the user for permission during this call
          // only possible when force set to true
        }

        if (status.neverAsked) {
          // user has not been requested this permission before
          // it is advised to show the user some sort of prompt
          // this way you will not waste your only chance to ask for the permission
          const c = confirm(
            "We need your permission to use your camera to be able to scan barcodes"
          );
          if (!c) {
            return false;
          }
        }

        if (status.restricted || status.unknown) {
          // ios only
          // probably means the permission has been denied
          return false;
        }

        const statusRequest = await BarcodeScanner.checkPermission({
          force: true,
        });

        if (statusRequest.asked) {
          // system requested the user for permission during this call
          // only possible when force set to true
        }

        if (statusRequest.granted) {
          // the user did grant the permission now
          return true;
        }

        // user did not grant the permission, so he must have declined the request
        return false;
      } catch (error) {
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "Error !!! " + error,
          message: `error: ${error.message}`,
          buttons: ["ACEPTAR"],
        });
        await alert.present();
        return false;
      }
    },

    async searchOneProduct(event: any) {
      try {
        this.searchProduct = event.detail.value;
        this.searchProduct = this.searchProduct.toUpperCase();
        if (this.searchProduct === "") {
          return this.getProductsQuantities();
        }
        if (this.searchProduct && this.searchProduct.trim() != "") {
          this.products = this.products.filter((product: any) => {
            return (
              product.descripcion.toUpperCase().indexOf(this.searchProduct) >
                -1 || product.barcode.indexOf(this.searchProduct) > -1
            );
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    goToCollector() {
      this.$router.push("/data-collector");
    },
  },
});
</script>

<style scoped>
.edit-image {
  width: 5%;
  max-height: 5%;
}
.btn-edit-product {
  border-radius: 10px;
}

ion-button {
  background-color: var(--ion-color-mycolor);
}
.letter-color {
  color: #82230d;
  text-shadow: 1px 1px #fff;
}
</style>
