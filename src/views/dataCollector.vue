<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title><img class="edit-image" src="../images/images_app/logo_header.png" />
          Recolector de Inventarios
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content className=".hideBg">
      <ion-card>
        <ion-card-title>
          <h4 class="letter-color" v-for="item in this.descriptions" :key="item.barcode">
            {{ item.descripcion }}
          </h4>
        </ion-card-title>
        <ion-card-subtitle>
          <ion-item>
            <ion-label position="floating">Codigo de Barras</ion-label>
            <ion-input type="text" :value="barcode" @input="barcodeScan.barcode = $event.target.value"></ion-input>
            <ion-label position="floating">Cantidad</ion-label>
            <ion-input type="number" :value="amount" @input="amount = $event.target.value"></ion-input>
          </ion-item>

          <ion-button color="mycolor" expand="full" class="btn-edit-product" @click="startScan()">Escanear Código
            barras</ion-button>

          <ion-button color="mycolor" class="btn-edit-product" expand="full" @click="searchProduct()">
            Busca Producto</ion-button>
          <h4 class="letter-color">
            {{ barcode }}
          </h4>
          <ion-button color="mycolor" expand="full" class="btn-edit-product" @click="stopScan()">
            Detener busqueda</ion-button>
          <ion-item>
            <ion-label position="floating">Cantidad</ion-label>
            <ion-input type="number" :value="amount" @input="amount = $event.target.value" disabled></ion-input>
          </ion-item>
        </ion-card-subtitle>
      </ion-card>
      <ion-list v-for="collector in dataCollector" :key="collector.collector">
        <ion-item>
          <ion-label>{{ collector.barcode }}{{ collector.coma
          }}{{ collector.amount }}</ion-label>
        </ion-item>
      </ion-list>
      <ion-button color="mycolor" class="btn-edit-product" expand="full" @click="writeFile()"><ion-icon
          :icon="i.document"></ion-icon> Generar Archivo
        txt</ion-button>
      <ion-button color="danger" expand="full" @click="returnProducts()"><ion-icon
          :icon="i.arrowBackSharp"></ion-icon>Volver</ion-button>
      <ion-button expand="full" color="mycolor" class="btn-edit-product" @click="newOrder()"><ion-icon
          :icon="i.refreshCircleSharp"></ion-icon> Iniciar
      </ion-button>
      <ion-button expand="full" color="mycolor" class="btn-edit-product" @click="goToCollectorTransfer()">
        Recolector de traslados
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as allIcons from "ionicons/icons";
import { BarcodeCollectorSearch } from "../services/dataRecolector";
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
    newOrder() {
      location.reload();
    },
    goToCollectorTransfer() {
      this.$router.push("/data-collector/transfers");
    },

    returnProducts() {
      this.$router.push("/tabs/tab1");
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
        this.barcodeScan.barcode = result.content;
        this.barcode = this.barcodeScan.barcode;
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

    async searchProduct() {
      try {
        this.barcode = this.barcodeScan.barcode;
        let amount = this.amount;
        if (
          this.barcode === "" ||
          this.barcode === "" ||
          this.barcode === undefined
        ) {
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

          const finalData = [
            {
              barcode: this.barcode,
              coma: this.coma,
              amount: amount,
            },
          ];
          const finalDataCollector = JSON.stringify(finalData);
          const finalDataParsed = JSON.parse(finalDataCollector);
          finalDataParsed.forEach((collector: any) => {
            this.dataCollector.push(collector);
          });
          this.barcode = "";
          this.amount = 1;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async writeFile() {
      try {
        let data = this.dataCollector;
        if (data.length > 0) {
          const createFile = await BarcodeCollectorSearch.generateTxtFile(data);
          console.log(createFile);
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "CONFIRMACIÓN !!!",
            subHeader: `SE DESCARGO ARCHIVO EN SERVIDOR POS `,
            message: `ARCHIVO GENERADO PARA SUBIR A CONEXION POS`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
          return false;
        } else {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "ATENCION !!!",
            subHeader: `NO PASA VALIDACIÓN `,
            message: `DEBE CARGAR DATOS PARA SUBIR A CONEXION POS`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
          return false;
        }
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

.hideBg::part(background) {
  display: none;
}
</style>