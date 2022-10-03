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
      >
      </ion-searchbar>

      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 2</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-card v-for="product in allProducts" :key="product.idproducto">
        <ion-card-header>
          <ion-card-title>
            <h4 class="letter-color">
              {{ product.descripcion }}
            </h4>
          </ion-card-title>
          <ion-card-subtitle
            >Código Barras: {{ product.barcode }}
            <vue-qr :text="product.barcode" :size="100"></vue-qr>
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
  //IonInput,
  IonButton,
  IonSearchbar,
} from "@ionic/vue";
import { getAllProductsFromAplication } from "@/services/searchPricesService";
import * as allIcons from "ionicons/icons";
import vueQr from "vue-qr/src/packages/vue-qr.vue";
export default defineComponent({
  name: "Tab2Page",
  components: {
    vueQr,
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
  },
  data() {
    return {
      i: allIcons,
      allProducts: [] as any,
      searchProduct: "" as string,
      allProductstoSearch: [] as any,
      productsToFilter: [] as any,
    };
  },
  mounted() {
    this.getAllProducts();
  },
  methods: {
    async getAllProducts() {
      try {
        const resProducts = await getAllProductsFromAplication();
        this.allProducts = resProducts.data;

        if (resProducts.data.length > 0) {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "CONFIRMACIÓN !!!!",
            subHeader: `Se encontraron: ${this.allProducts.length} Productos`,
            message: "Información encontrada satisfactoriamente",
            buttons: ["OK"],
          });
          await alert.present();
        } else {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "ATENCIÓN !!!",
            subHeader: "No hay datos encontrados",
            message: "No se encontro información para mostrar",
            buttons: ["OK"],
          });
          await alert.present();
        }
        this.searchOneProduct(event);
      } catch (error) {
        console.log(error);
      }
    },
    async searchOneProduct(event: any) {
      try {
        this.searchProduct = event.detail.value;
        this.searchProduct = this.searchProduct.toUpperCase();
        if (this.searchProduct === "") {
          return this.getAllProducts();
        }
        if (this.searchProduct && this.searchProduct.trim() != "") {
          this.allProducts = this.allProducts.filter((product: any) => {
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