<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Editar Productos </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense"> </ion-header>
      <ion-card>
        <ion-item>
          <ion-label position="floating"
            >Agregar varios codigos de barras</ion-label
          >
          <ion-input
            type="text"
            :value="barcode.barcode"
            @input="barcode.barcode = $event.target.value"
          >
          </ion-input>
          <ion-button color="dark" @click="addBarcodes(idProducto)"
            ><ion-icon :icon="i.save"></ion-icon>Agregar</ion-button
          >
        </ion-item>
        <ion-item>
          <ion-label position="floating">Codigo de barras</ion-label>
          <ion-input
            type="text"
            :value="productEd.barcode"
            @input="productEd.barcode = $event.target.value"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Descripcion</ion-label>
          <ion-input
            type="text"
            :value="productEd.descripcion"
            @input="productEd.descripcion = $event.target.value"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">costo</ion-label>
          <ion-input
            type="number"
            :value="productEd.costo"
            @input="productEd.costo = $event.target.value"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Precio Venta</ion-label>
          <ion-input
            type="number"
            :value="productEd.precioventa"
            @input="productEd.precioventa = $event.target.value"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Precio Especial 1</ion-label>
          <ion-input
            type="number"
            :value="productEd.precioespecial1"
            @input="productEd.precioespecial1 = $event.target.value"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Precio Especial 2</ion-label>
          <ion-input
            type="number"
            :value="productEd.precioespecial2"
            @input="productEd.precioespecial2 = $event.target.value"
          ></ion-input>
        </ion-item>
        <ion-button
          color="dark"
          expand="full"
          @click="updateProduct(idProducto)"
          ><ion-icon :icon="i.createSharp"></ion-icon>Editar</ion-button
        >
        <ion-button color="danger" expand="full" @click="returnProducts()"
          ><ion-icon :icon="i.arrowBackSharp"></ion-icon>Volver</ion-button
        >
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  updateProduct,
  getProductById,
  addBarcodes,
} from "@/services/searchPricesService";
import { IEditProduct } from "@/interfaces/editproduct.interface";
import { defineComponent } from "vue";
import { IAddBarcodes } from "../interfaces/barcode.interface";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  alertController,
  IonLabel,
  IonInput,
  IonItem,
  IonButton,
  // IonCardSubtitle,
  IonCard,
  // IonCardTitle,
  IonIcon,
} from "@ionic/vue";
import * as allIcons from "ionicons/icons";
// import { useRoute } from 'vue-router';
export default defineComponent({
  name: "EditP",

  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonLabel,
    IonInput,
    IonItem,
    IonButton,
    // IonCardSubtitle,
    IonCard,
    //   IonCardTitle,
    IonIcon,
  },
  mounted() {
    this.getProduct(this.idProducto);
  },
  data() {
    return {
      i: allIcons,
      productEd: {} as IEditProduct,
      idProducto: "" as string,
      barcode: {} as IAddBarcodes,
    };
  },
  methods: {
    async updateProduct(id: string) {
      try {
        id = this.$route.params.id.toString();
        let description = this.productEd.descripcion;
        this.productEd.descripcion = description.toUpperCase();
        const productoEditado: any = this.productEd;
        const productUpdated = await updateProduct(id, productoEditado);
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "CONFIRMACIÓN !!!!",
          subHeader: `SE EDITO EL PRODUCTO: ${this.productEd.descripcion} SATISFACTORIAMENTE !!!!`,
          message: `${productUpdated.data.message} !!!!`,
          buttons: ["OK"],
        });
        await alert.present();
      } catch (error) {
        console.log(error);
      }
    },
    async addBarcodes(id: string) {
      try {
        id = this.$route.params.id.toString();

        const addBarcodesProduct = await addBarcodes(id, this.barcode);
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "CONFIRMACIÓN !!!!",
          subHeader: `Codigo de barras: ${this.barcode.barcode} Agregado !!!!`,
          message: `${addBarcodesProduct.data.message} !!!!`,
          buttons: ["OK"],
        });
        await alert.present();
        this.barcode.barcode = "";
      } catch (error) {
        console.log(error);
      }
    },
    async getProduct(id: string) {
      try {
        id = this.$route.params.id.toString();

        const getProductId = await getProductById(id);
        this.productEd.barcode = getProductId.data[0].barcode;
        this.productEd.descripcion =
          getProductId.data[0].descripcion.toUpperCase();
        this.productEd.costo = getProductId.data[0].costo;
        this.productEd.precioventa = getProductId.data[0].precioventa;
        this.productEd.precioespecial1 = getProductId.data[0].precioespecial1;
        this.productEd.precioespecial2 = getProductId.data[0].precioespecial2;
      } catch (error) {
        console.log(error);
      }
    },
    returnProducts() {
      this.$router.push("/tabs/tab2");
    },
  },
});
</script>