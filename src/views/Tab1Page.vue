<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title
          ><img class="edit-image" src="../images/images_app/logo_header.png" />
          Consultar Inventarios
          <ion-button  color="mycolor" class="btn-edit-product" @click="goToCollector()">
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
  },

  data() {
    return {
      products: [] as any,
      searchProduct: "" as string,
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
