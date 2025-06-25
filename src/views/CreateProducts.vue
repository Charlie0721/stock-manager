<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Crear Productos </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-card>
        <ion-button id="open-modal" expand="block" color="mycolor" class="btn-edit-product" @click="getLines()">
          <ion-icon :icon="i.searchCircleSharp"></ion-icon>Seleccionar
          Linea</ion-button>
      </ion-card>
      <ion-modal ref="modal" trigger="open-modal" :initial-breakpoint="0.25" :breakpoints="[0, 0.25, 0.5, 0.75]">
        <ion-content class="ion-padding">
          <ion-searchbar @click="$refs.modal.$el.setCurrentBreakpoint(0.75)" placeholder="Buscar Linea"
            @ionChange="searchOneLine($event)" @keypress.enter="searchLine()"></ion-searchbar>

          <ion-button color="mycolor" @click="prevPage()" v-if="page > 1">Anterior</ion-button>
          <ion-button color="mycolor" @click="nextPage()">Siguiente</ion-button>
          <span> página {{ page }} </span>
          <ion-list v-for="line in lines" :key="line.idregistro">
            <ion-item>
              <ion-label>{{ line.codigo }} {{ line.nombre }} </ion-label>
            </ion-item>

            <ion-item>
              <ion-label>
                <ion-button color="mycolor" class="btn-edit-product" expand="full" @click="
                  selectLine(
                    line.idregistro,
                    line.idnivel,
                    line.nombre,
                    line.codigo
                  )
                  ">Aceptar<ion-icon :icon="i.checkmarkCircleOutline"></ion-icon>
                </ion-button>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-modal>

      <ion-card>
        <ion-card-header>
          <ion-card-title>
            <h4 class="letter-color">{{ levelCode }} {{ levelName }}</h4>
          </ion-card-title>
          <ion-card-subtitle>
            <h4 class="letter-color" v-if="productCode != ''">
              Codigo del producto: {{ productCode }}
            </h4>
          </ion-card-subtitle>
          Solo se pueden crear productos cuya estructura se encuentre definida
          por: Linea y Producto
        </ion-card-header>

        <ion-card-content> </ion-card-content>
      </ion-card>
      <ion-card>
        <ion-item>
          <ion-label position="floating">Codigo de barras</ion-label>
          <ion-input type="text" :value="product.barcode" @input="product.barcode = $event.target.value">
          </ion-input>
        </ion-item>
        <!-- <ion-button color="mycolor" expand="full" class="btn-edit-product" @click="startScan()">
          Escanear Codigo barras</ion-button>
        <ion-button color="mycolor" expand="full" class="btn-edit-product" @click="stopScan()">
          Detener busqueda</ion-button> -->
        <ion-item>
          <ion-select placeholder="Unidad de medida" @ionChange="unitOfMeasureId = $event.target.value"
            :value="unitOfMeasureId">
            <ion-select-option :value="unit.idunmedida" v-for="unit in unitsOfMeasure" :key="unit.idunmedida">{{
              unit.nommedida }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Descripcion</ion-label>
          <ion-input type="text" :value="product.descripcion" @input="product.descripcion = $event.target.value">
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-select placeholder="I.V.A Compras" @ionChange="taxIdPurchases = $event.target.value"
            :value="taxIdPurchases">
            <ion-select-option :value="tax.codiva" v-for="tax in taxOnPurchases" :key="tax.codiva">{{ tax.nombre }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Costo Unitario UC</ion-label>
          <ion-input type="number" :value="product.costo" @input="product.costo = $event.target.value">
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-select placeholder="I.V.A Ventas Precio 1" @ionChange="taxIdSales = $event.target.value"
            :value="taxIdSales">
            <ion-select-option :value="tax.codiva" v-for="tax in taxOnSales" :key="tax.codiva">{{ tax.nombre }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Precio de Venta</ion-label>
          <ion-input type="number" :value="product.precioventa" @input="product.precioventa = $event.target.value">
          </ion-input>
        </ion-item>
        <ion-button color="mycolor" class="btn-edit-product" expand="full" @click="saveProduct()">
          Grabar</ion-button>
      </ion-card>
      <ion-card>
        <ion-button color="danger" expand="full" @click="returnProducts()"><ion-icon
            :icon="i.arrowBackSharp"></ion-icon>Volver</ion-button></ion-card>
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
  IonCard,
  IonLabel,
  IonInput,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonSearchbar,
  IonIcon,
  IonList,
  IonModal,
  alertController,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
} from "@ionic/vue";
import { CreateProduct } from "../services/createProducts";
import { ProductsI } from "../interfaces/CreateProducts.interface";
import * as allIcons from "ionicons/icons";
import {
  BarcodeScanner,
  SupportedFormat,
} from "@capacitor-community/barcode-scanner";
export default defineComponent({
  name: "Create-Product",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonLabel,
    IonInput,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonSearchbar,
    IonIcon,
    IonList,
    IonModal,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
  },
  data() {
    return {
      product: {} as ProductsI,
      i: allIcons,
      lines: [] as any,
      taxOnPurchases: [] as any,
      taxOnSales: [] as any,
      unitsOfMeasure: [] as any,
      taxIdSales: "01" as string,
      taxIdPurchases: "01" as string,
      unitOfMeasureId: 0 as number,
      selectUnitOfMeasure: 0 as number,
      limit: 10 as number,
      page: 1 as number,
      offset: 0 as number,
      nombre: "" as string,
      searchLines: "" as string,
      idRegistro: 0 as number,
      idNivel: 0 as number,
      levelName: "" as string,
      levelCode: "" as string,
      productCode: "" as string,
      codeProductStructure: [] as any,
      lastCode: [] as any,
      code: "" as string,
      estproductos: [] as any,
      responseProductId: [] as any,
      productId: 0 as number,
      barcodeFound: "" as string,
    };
  },
  mounted() {
    this.getTaxOnPurchases();
    this.getTaxSales();
    this.getUnitOfMeasure();
  },
  methods: {
    returnProducts() {
      this.$router.push("/tabs/tab2");
    },
    newProduct() {
      location.reload();
    },
    async getProductId() {
      const responseId = await CreateProduct.getProductId();
      this.responseProductId = responseId.data;
      this.responseProductId.forEach((id) => {
        this.productId = id.ultimo_id + 1;
      });
      const estProd = [
        {
          idproducto: this.productId,
          idregistro: this.idRegistro,
          idnivel: this.idNivel,
        },
      ];
      const estrFinal = JSON.stringify(estProd);
      const estFinalParsed = JSON.parse(estrFinal);
      estFinalParsed.forEach((est) => {
        this.estproductos.push(est);
      });
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
        });
        if (result.hasContent) {
          document.body.style.background = "";
          document.body.style.opacity = "1";
          console.log(result.content);
        }
        this.product.barcode = result.content;
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
    async saveProduct() {
      try {
        let description = this.product.descripcion;
        let lastCost: number = this.product.costo;
        if (description === " " || description === undefined) {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "Atención !!! ",
            message: `La descripción del producto es obligatoria`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
          return;
        }
        if (lastCost === 0 || lastCost === undefined) {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "Atención !!! ",
            message: `El costo del producto debe ser mayor a 0`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
          return;
        }
        if (this.unitOfMeasureId === 0 || this.unitOfMeasureId === undefined) {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "Atención !!! ",
            message: `Debe asignar la unidad de media`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
          return;
        }
        if (this.productCode === "") {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "Atención !!! ",
            message: `Debe asignar Linea de producto`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
          return;
        } else {
          this.getProductId();
          this.product.codigo = this.productCode;
          this.product.descripcion = description.toUpperCase();
          this.product.idunmedida = this.unitOfMeasureId;
          this.product.codiva = this.taxIdSales;
          this.product.codivacomp = this.taxIdPurchases;
          let lastCost = this.product.costo;
          this.product.ultcosto = lastCost;
          this.product.tipo = 1;
          this.product.estado = 1;
          this.product.compuesto = 0;
          this.product.idareaserv = 1;
          this.product.agruparalfacturar = 0;
          this.product.estproductos = this.estproductos;
          this.searchBarcode();
          setTimeout(async () => {

            if (this.barcodeFound === "barcode found") {
              const alert = await alertController.create({
                cssClass: "my-custom-class",
                header: "ATENCION !!!!",
                subHeader: `El Codigo de barras: ${this.product.barcode} Ya existe !!!!`,
                message: `${this.barcodeFound} !!!!`,
                buttons: ["OK"],
              });
              await alert.present();
              this.product.barcode = "";
              return false;
            } else {
              setTimeout(async () => {
                const newProductCreated = await CreateProduct.saveProduct(
                  this.product
                );
                const alert = await alertController.create({
                  cssClass: "my-custom-class",
                  header: "Confirmación !!! ",
                  message: `Se ha creado el producto: ${newProductCreated.data.descripcion}`,
                  buttons: ["ACEPTAR"],
                });
                await alert.present();
              }, 2000);
              setTimeout(() => {
                this.newProduct();
              }, 5000);
            }
          }, 2000)
        }
      } catch (error) {
        console.log(error);
      }
    },
    async searchBarcode() {
      try {
        let barcode = this.product.barcode;
        const barcodeFound = await CreateProduct.searchByBarcode(barcode);
        this.barcodeFound = barcodeFound.data.message;
      } catch (error) {
        console.log(error);
      }
    },
    async getStructure() {
      try {
        const responseStructure = await CreateProduct.getStructure();
        this.codeProductStructure = responseStructure.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getLastCode() {
      try {
        let newCode;
        const responseCode = await CreateProduct.getCode(this.levelCode);
        this.lastCode = responseCode.data.code;
        this.lastCode.forEach((code: any) => {
          newCode = code.ultimo_codigo;
        });
        let num = parseInt(newCode) + 1;
        let result = num.toString().padStart(newCode.length, "0");
        this.productCode = result;
      } catch (error) {
        console.log(error);
      }
    },

    selectLine(
      idRecord: number,
      idLevel: number,
      name: string,
      levelCode: string
    ) {
      this.idRegistro = idRecord;
      this.idNivel = idLevel;
      this.levelName = name;
      this.levelCode = levelCode;
      this.getLastCode();
    },
    async getLines() {
      try {
        const responseLines = await CreateProduct.getLevels(
          this.limit,
          this.page,
          this.nombre
        );
        this.lines = responseLines.data.productLevels;
      } catch (error) {
        console.log(error);
      }
    },
    async searchOneLine(e: any) {
      try {
        this.searchLines = e.detail.value;

        this.nombre = this.searchLines.toUpperCase();

        if (this.searchLines === "") {
          return await this.getLines();
        }
      } catch (error) {
        console.log(error);
      }
    },
    searchLine() {
      this.getLines(this.nombre);
    },
    prevPage() {
      if (this.page > 1) {
        this.page--;
        this.getLines();
      }
    },
    nextPage() {
      this.page++;
      this.getLines();
    },
    async getTaxOnPurchases() {
      try {
        const response = await CreateProduct.getTaxShopping();
        this.taxOnPurchases = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getTaxSales() {
      try {
        const responseTax = await CreateProduct.getTaxSales();
        this.taxOnSales = responseTax.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getUnitOfMeasure() {
      try {
        const responseUnit = await CreateProduct.getUnitsOfMeasure();
        this.unitsOfMeasure = responseUnit.data.unitsOfMeasure;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
</script>
<style scoped>
.text-custom-botones {
  padding-left: 100px !important;
  padding-right: 100px !important;
}

.edit-image {
  width: 10%;
  max-height: 10%;
  float: right;
}

.edit-image1 {
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