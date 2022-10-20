<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title
          ><img class="edit-image" src="../images/images_app/logo_header.png" />
          Recolector de Inventarios
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card>
        <ion-card-title>
          <h4
            class="letter-color"
            v-for="item in this.descriptions"
            :key="item.barcode"
          >
            {{ item.descripcion }}
          </h4>
        </ion-card-title>
        <ion-card-subtitle>
          <ion-item>
            <ion-label position="floating">Codigo de Barras</ion-label>
            <ion-input
              type="text"
              :value="barcodeScan.barcode"
              @input="barcodeScan.barcode = $event.target.value"
            ></ion-input>
          </ion-item>
          <ion-button
            color="mycolor"
            class="btn-edit-product"
            expand="full"
            @click="searchProduct()"
          >
            Busca Producto</ion-button
          >
          <ion-item>
            <ion-label position="floating">Cantidad</ion-label>
            <ion-input
              type="number"
              :value="amount"
              @input="amount = $event.target.value"
              disabled
            ></ion-input>
          </ion-item>
        </ion-card-subtitle>
      </ion-card>
      <ion-list v-for="collector in dataCollector" :key="collector.collector">
        <ion-item>
          <ion-label
            >{{ collector.barcode }}{{ collector.coma
            }}{{ collector.amount }}</ion-label
          >
        </ion-item>
      </ion-list>
      <ion-button
        color="mycolor"
        class="btn-edit-product"
        expand="full"
        @click="createFile()"
        ><ion-icon :icon="i.document"></ion-icon> Generar Archivo
        txt</ion-button
      >
      <ion-button color="danger" expand="full" @click="returnProducts()"
        ><ion-icon :icon="i.arrowBackSharp"></ion-icon>Volver</ion-button
      >
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as allIcons from "ionicons/icons";
import { BarcodeCollectorSearch } from "../services/dataRecolector";
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
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonIcon,
  IonList,
} from "@ionic/vue";
import { ISearchByBarcodeToCollector } from "../interfaces/barcode.interface";
import FileSaver, { saveAs } from "file-saver";
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
    IonList,
    IonButton,
    IonItem,
    IonLabel,
    IonInput,
    IonIcon,
  },
  data() {
    return {
      i: allIcons,
      barcodeScan: {} as ISearchByBarcodeToCollector,
      amount: 1 as number,
      descriptions: [] as any,
      dataCollector: [] as any,
      barcode: "" as string,
      coma: "," as string,
    };
  },

  methods: {
    returnProducts() {
      this.$router.push("/tabs/tab1");
    },
    async searchProduct() {
      try {
        let scanB = this.barcodeScan.barcode;
        if (scanB === "" || scanB ==='' || scanB === undefined) {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "ATENCIÓN !!!",
            subHeader: `NO PASA VALIDACIÓN `,
            message: `DEBE INGRESAR CODIGO DE BARRAS !!`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
          return false;
        } else {
          const response = await BarcodeCollectorSearch.searchProductBarcode(
            this.barcodeScan
          );
          this.descriptions = response.data;
          this.barcode = response.data[0].barcode;
          this.barcodeScan.barcode = "";

          const finalData = [
            {
              barcode: this.barcode,
              coma: this.coma,
              amount: this.amount,
            },
          ];

          const finalDataCollector = JSON.stringify(finalData);
          const finalDataParsed = JSON.parse(finalDataCollector);

          finalDataParsed.forEach((collector: any) => {
            this.dataCollector.push(collector);
          });
        }
      } catch (error) {
        console.log(error);
      }
    },

    createFile() {
      try {
        const dataParsed = JSON.stringify(this.dataCollector);
        let barcode: any = [];

        const finalDataParsed = JSON.parse(dataParsed);
        finalDataParsed.forEach((collector: any) => {
          barcode.push(
            collector.barcode + collector.coma + collector.amount + "\n"
          );
        });

        const blob = new Blob([barcode.join("")], {
          type: "text/plain;charset=utf-8",
        });
        FileSaver.saveAs(blob, "inventario.txt");
      } catch (error) {
        console.log(error);
      }
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