<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title><img class="edit-image" src="../images/images_app/logo_header.png" />
          Consultar Inventarios
          <ion-button color="mycolor" class="btn-edit-product" @click="goToCollector()">
            Recolector
          </ion-button>
        </ion-title>
      </ion-toolbar>
      <ion-searchbar animated debounce="500" placeholder="Buscar Producto" @ionChange="searchOneProduct($event)"
        @keypress.enter="searchItem()">
      </ion-searchbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-input type="text" :value="searchByBarcode" @input="searchByBarcode = $event.target.value"
        placeholder="Código de barras" :clear-input="true" @keypress.enter="searchByBarcodeItem()"></ion-input>
      <ion-button color="mycolor" expand="full" class="btn-edit-product" @click="startScan()">
        Buscar Código barras</ion-button>
      <ion-button color="mycolor" expand="full" class="btn-edit-product" @click="stopScan()">
        Detener busqueda</ion-button>
      <ion-button color="mycolor" @click="prevPage()" v-if="page > 1">Anterior</ion-button>
      <ion-button color="mycolor" @click="nextPage()">Siguiente</ion-button>
      <span> página {{ page }} </span>
      <ion-card v-for="product in products" :key="product.product" class="product-card">
        <ion-card-header>
          <ion-card-title class="product-title">{{ product.descripcion }}</ion-card-title>
          <ion-card-subtitle class="product-subtitle">Existencias: {{ product.cantidad }}</ion-card-subtitle>
          <ion-card-subtitle class="product-subtitle">Código de Barras: {{ product.barcode }}</ion-card-subtitle>
          <ion-card-subtitle class="product-subtitle">Código Interno: {{ product.codigo }}</ion-card-subtitle>
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
      limit: 10 as number,
      page: 1 as number,
      offset: 0 as number,
      codigo: "" as string,
      descripcion: "" as string,
      barcode: "" as string,
      totalPages: 0 as number,
    };
  },
  mounted() {
    this.getProductsQuantities();
  },
  methods: {

    async getProductsQuantities() {
      try {
        const responseProducts = await productsQuantities(
          this.limit,
          this.page,
          this.descripcion,
          this.barcode
        );
        this.products = responseProducts.data.inventory;
        this.totalPages = responseProducts.data.totalPages;
      } catch (error) {
        console.error(error);
      }
    },
    prevPage() {
      if (this.page > 1) {
        this.page--;
        this.getProductsQuantities();
      }
    },
    nextPage() {
      this.page++;
      this.getProductsQuantities();
    },

    async startScan() {
      try {
        this.didUserGrantPermission();
        document.body.style.opacity = "0.2";
        document.body.style.background = "transparent";

        BarcodeScanner.hideBackground();

        const result = await BarcodeScanner.startScan({
          targetedFormats: [
            SupportedFormat.QR_CODE,
            SupportedFormat.CODE_128,
            SupportedFormat.EAN_13,
            SupportedFormat.EAN_8,
          ],
        });

        if (result.hasContent) {
          document.body.style.background = "";
          document.body.style.opacity = "1";
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
      setTimeout(() => {
        location.reload();
      }, 1000)

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

    searchOneProduct(event: any) {
      try {
        this.searchProduct = event.detail.value;
        this.descripcion = this.searchProduct.toUpperCase();
        if (this.searchProduct === "") {
          return this.getProductsQuantities();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async searchByBarcodeItem() {
      this.barcode = this.searchByBarcode;
      await this.getProductsQuantities(this.barcode);
      setTimeout(async () => {
        this.barcode = "";
        await this.getProductsQuantities();
      }, 5000);
    },
    searchItem() {
      this.getProductsQuantities(this.descripcion);
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
  background-color: var(--ion-color-mycolor);
  color: #fff;
  /* Texto en color blanco para resaltar en el botón */
}

ion-button {
  background-color: var(--ion-color-mycolor);
}

.product-card {
  border-radius: 8px;
  margin: 10px 0;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #2c2c2c;
  /* Color de fondo más oscuro */
}

/* Estilo para el título de la tarjeta */
.product-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  /* Color de texto en blanco */
}

/* Estilo para el subtítulo de la tarjeta */
.product-subtitle {
  font-size: 1rem;
  color: #bbb;
  /* Color de texto ligeramente más claro que el fondo */
}

/* Estilo mejorado para .letter-color */
.letter-color {
  color: #ff9900;
  /* Color más llamativo, en este caso, naranja */
  text-shadow: 1px 1px #333;
  /* Sombra de texto */
}
</style>
