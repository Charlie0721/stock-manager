<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title
          ><img class="edit-image" src="../images/images_app/logo_header.png" />
          Listado de Productos</ion-title
        >
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-searchbar
        animated
        debounce="500"
        placeholder="Buscar Producto"
        @ionChange="searchOneProduct($event)"
        @keypress.enter="searchItem()"
      >
      </ion-searchbar>

      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 2</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-input
        type="text"
        :value="searchByBarcode"
        @input="searchByBarcode = $event.target.value"
        placeholder="Código de barras"
        :clear-input="true"
        @keypress.enter="searchByBarcodeItem()"
      ></ion-input>
      <ion-button
        color="mycolor"
        expand="full"
        class="btn-edit-product"
        @click="startScan()"
      >
        Buscar Código barras</ion-button
      >
      <ion-button color="mycolor" @click="prevPage()" v-if="page > 1"
        >Anterior</ion-button
      >
      <ion-button color="mycolor" @click="nextPage()">Siguiente</ion-button>
      <span> página {{ page }} </span>
      <ion-card>
        <ion-list>
          <ion-item>
            <ion-select
              placeholder="Items por página"
              :value="10"
              @ionChange="this.limit = $event.target.value"
            >
              <ion-select-option value="10">10</ion-select-option>
              <ion-select-option value="15">15</ion-select-option>
              <ion-select-option value="30">30</ion-select-option>
            </ion-select>
            <ion-button
              color="mycolor"
              class="btn-edit-product"
              @click="getAllProducts()"
            >
              Aceptar</ion-button
            >
          </ion-item>
        </ion-list>
      </ion-card>
      <ion-card v-for="product in allProducts" :key="product.idproducto">
        <ion-card-header>
          <ion-card-title>
            <h4 class="letter-color">
              {{ product.descripcion }}
            </h4>
          </ion-card-title>
          <ion-card-subtitle
            >Código Barras: {{ product.barcode }}
          </ion-card-subtitle>
          <ion-card-subtitle
            >Código Interno: {{ product.codigo }}</ion-card-subtitle
          >
        </ion-card-header>

        <ion-card-content>
          Precio: ${{
            new Intl.NumberFormat("de-DE").format(product.precioventa)
          }}
        </ion-card-content>
        <ion-card-content>
          Precio Especial 1: ${{
            new Intl.NumberFormat("de-DE").format(product.precioespecial1)
          }}
        </ion-card-content>
        <ion-card-content>
          Precio Especial 2: ${{
            new Intl.NumberFormat("de-DE").format(product.precioespecial2)
          }}
        </ion-card-content>

        <ion-button
          color="mycolor"
          expand="full"
          class="btn-edit-product"
          @click="editProduct(product.idproducto)"
          >Editar Producto</ion-button
        >
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  alertController,
  IonCardSubtitle,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
  IonButton,
  IonSearchbar,
  IonInput,
  IonSelectOption,
  IonSelect,
  IonList,
  IonItem,
} from "@ionic/vue";
import { Products } from "@/services/Products";
import * as allIcons from "ionicons/icons";
import {
  BarcodeScanner,
  SupportedFormat,
} from "@capacitor-community/barcode-scanner";
export default defineComponent({
  name: "Tab2Page",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonCardSubtitle,
    IonCard,
    IonCardTitle,
    IonCardHeader,
    IonSearchbar,
    IonCardContent,
    IonButton,
    IonInput,
    IonSelectOption,
    IonSelect,
    IonList,
    IonItem,
  },
  data() {
    return {
      i: allIcons,
      allProducts: [] as any,
      searchProduct: "" as string,
      productsToFilter: [] as any,
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
    this.getAllProducts();
  },

  methods: {
    reloadPage() {
      location.reload();
    },

    async getAllProducts() {
      try {
        const products = await Products.getAllProductsFromAplication(
          this.limit,
          this.page,
          this.descripcion,
          this.barcode
        );
        this.totalPages = products.data.totalPages;

        this.allProducts = products.data.products;

        this.searchOneProduct(event);
      } catch (error) {
        console.log(error);
      }
    },
    prevPage() {
      if (this.page > 1) {
        this.page--;
        this.getAllProducts();
      }
    },
    nextPage() {
      this.page++;
      this.getAllProducts();
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

    searchOneProduct(event: any) {
      try {
        this.searchProduct = event.detail.value;
        this.descripcion = this.searchProduct.toUpperCase();
        if (this.searchProduct === "") {
          return this.getAllProducts();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async searchByBarcodeItem() {
      this.barcode = this.searchByBarcode;
     await this.getAllProducts(this.barcode);
      setTimeout(async() => {
      this.barcode = "";
      await  this.getAllProducts();
      }, 5000);
    },

    searchItem() {
      this.getAllProducts(this.descripcion, this.barcode);
    },

    editProduct(id: number) {
      this.$router.push("/edit-product/" + id);
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
  border-radius: 30px;
}

ion-button {
  background-color: var(--ion-color-mycolor);
}
.letter-color {
  color: #82230d;
  text-shadow: 1px 1px #fff;
}
</style>