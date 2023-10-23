<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <img class="edit-image1" src="../images/images_app/logo_header.png" />
          Traslados

          <ion-button color="mycolor" class="btn-edit-product" @click="newOrder()"><ion-icon
              :icon="i.refreshCircleSharp"></ion-icon> Nuevo Traslado
          </ion-button>
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item>
          <ion-select placeholder="Seleccionar Origen" @ionChange="SelectOrigin = $event.target.value"
            :value="SelectOrigin">
            <ion-select-option :value="warehouse.idalmacen" v-for="warehouse in allWarehouses"
              :key="warehouse.idalmacen">{{ warehouse.nomalmacen }}</ion-select-option>
          </ion-select>
        </ion-item>

      </ion-list>
      <ion-list>
        <ion-item>
          <ion-select placeholder="Seleccionar Destino" @ionChange="SelectDestination = $event.target.value"
            :value="SelectDestination">
            <ion-select-option :value="warehouse.idalmacen" v-for="warehouse in allWarehouses"
              :key="warehouse.idalmacen">{{ warehouse.nomalmacen }}</ion-select-option>
          </ion-select>
        </ion-item>

      </ion-list>
      <ion-content class="ion-padding">
        <ion-item>
          <ion-label position="floating">Documento:</ion-label>
          <ion-input type="text" :value="transfer.documento"
            @input="transfer.documento = $event.target.value"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Detalle:</ion-label>
          <ion-input type="text" :value="transfer.detalle" @input="transfer.detalle = $event.target.value"></ion-input>
        </ion-item>
        <ion-card v-for="(product, index) in productArray" :key="product.id">
          <ion-card-header>
            <ion-card-title>
              <h4 class="letter-color">
                {{ index + 1 }}. {{ product.descripcion }}
              </h4>
            </ion-card-title>

            <ion-card-subtitle>
              <ion-button color="mycolor" class="btn-edit-product" @click="addAmount(product.idproducto)"><ion-icon
                  :icon="i.addSharp"></ion-icon>
              </ion-button>
              <ion-button color="mycolor" class="btn-edit-product" @click="subtractAmount(product.idproducto)"><ion-icon
                  :icon="i.removeSharp"></ion-icon>
              </ion-button>
              <ion-button color="mycolor" class="btn-edit-product" @click="deleteProduct(product.idproducto)"><ion-icon
                  :icon="i.trashOutline"></ion-icon>
              </ion-button>
            </ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <h5 text="dark">Cantidad En Origén: {{ product.cantidadAct }}</h5>
            <h2 text="dark">
              Valor Unitario $
              {{ new Intl.NumberFormat("de-DE").format(product.precio) }}
            </h2>
            <h2 text="dark">
              Costo Unitario $
              {{ new Intl.NumberFormat("de-DE").format(product.costo) }}
            </h2>
            <h2 text="dark">
              Traslado
              {{ new Intl.NumberFormat("de-DE").format(product.cantidad) }}
            </h2>

          </ion-card-content>
        </ion-card>

        <ion-button id="open-modal" expand="block" color="mycolor" class="btn-edit-product" @click="getProducts()">
          <ion-icon :icon="i.searchCircleSharp"></ion-icon>Seleccionar
          Productos</ion-button>
        <ion-button color="mycolor" class="btn-edit-product" expand="full" @click="sendTransfer()"><ion-icon
            :icon="i.saveSharp"></ion-icon>Enviar
        </ion-button>
        <ion-button color="mycolor" class="btn-edit-product" expand="full" @click="goToInventoyMovements()"><ion-icon
            :icon="i.arrowBackSharp"></ion-icon>Movimientos de
          inventario
        </ion-button>

        <ion-modal ref="modal" trigger="open-modal" :initial-breakpoint="0.25" :breakpoints="[0, 0.25, 0.5, 0.75]">
          <ion-content class="ion-padding custom-modal-content">
            <ion-searchbar @click="$refs.modal.$el.setCurrentBreakpoint(0.75)" placeholder="Buscar Producto"
              @ionChange="searchOneProduct($event)" @keypress.enter="searchItem()"></ion-searchbar>
            <ion-input type="search" :value="searchByBarcode" @input="searchByBarcode = $event.target.value"
              placeholder="Código de barras" :clear-input="true" @keypress.enter="searchByBarcodeItem()"></ion-input>
            <ion-button color="mycolor" expand="full" class="btn-edit-product" @click="startScan()">
              Buscar Código barras</ion-button>
            <ion-button color="mycolor" expand="full" class="btn-edit-product" @click="stopScan()">
              Detener busqueda</ion-button>
            <ion-button color="mycolor" @click="prevPage()" v-if="page > 1">Anterior</ion-button>
            <ion-button color="mycolor" @click="nextPage()">Siguiente</ion-button>
            <span> página {{ page }} </span>
            <ion-list v-for="product in products" :key="product.idproduct">
              <ion-item>
                <ion-label>{{ product.descripcion }}
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>Cantidad Actual : {{ product.cantidadAct }}
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>Precio Venta :
                  {{ new Intl.NumberFormat("de-DE").format(product.precio) }}
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>Costo: $
                  {{ new Intl.NumberFormat("de-DE").format(product.costo) }}

                  <ion-button color="mycolor" class="btn-edit-product" expand="full" @click="
                    selectProduct(
                      product.idproducto,
                      product.descripcion,
                      product.costo,
                      product.cantidadAct,
                      product.precio
                    )
                    ">Agregar<ion-icon :icon="i.checkmarkCircleOutline"></ion-icon>
                  </ion-button>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-content>
        </ion-modal>
      </ion-content>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as allIcons from "ionicons/icons";
import { TransfersToApp } from "../services/transfers";
import { ITransfer } from "../interfaces/transfers.interface";
import {
  BarcodeScanner,
  SupportedFormat,
} from "@capacitor-community/barcode-scanner";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonContent,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonList,
  IonCardSubtitle,
  //   IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonLabel,
  //   IonItem,
  IonButton,
  alertController,
  //   IonList,
  IonSearchbar,
  //   IonPopover,
  IonModal,
  //   IonText,
  IonCardTitle,
  IonInput,
} from "@ionic/vue";
export default defineComponent({
  name: "tranfers-trasnsactions",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonList,
    IonLabel,
    IonInput,
    IonModal,
    IonSearchbar,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
  },
  data() {
    return {
      i: allIcons,
      allWarehouses: [] as any,
      numberTransferOrigin: 0 as number,
      finalNumber: 0 as number,
      date: "" as string,
      currenTime: "" as string,
      transfer: {} as ITransfer,
      origin: 0 as number,
      destination: 0 as number,
      SelectOrigin: 0 as number,
      SelectDestination: 0 as number,
      products: [] as any,
      searchByBarcode: "" as string,
      limit: 2 as number,
      page: 1 as number,
      offset: 0 as number,
      codigo: "" as string,
      descripcion: "" as string,
      barcode: "" as string,
      totalPages: 0 as number,
      productArray: [] as any,
      idTransfer: "" as string,
      finalAmount: 0 as number,
      state: 2 as number,
      transferType: 1 as number,
    };
  },
  mounted() {
    this.getWarehouses();
    this.getDate();
  },
  methods: {
    newOrder() {
      location.reload();
    },
    async getWarehouses() {
      try {
        const responseWarehouses = await TransfersToApp.getWarehouses();
        this.allWarehouses = responseWarehouses.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getNumberTransfer() {
      try {
        const numberTransfer = await TransfersToApp.getNumberTransfer();
        this.numberTransfer = numberTransfer.data[0].result;
        this.finalNumber = this.numberTransfer + 1;
        console.log("numero: ", this.finalNumber);

      } catch (error) {
        console.log(error);
      }
    },
    getDate() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let hour = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      let updatedMonth = month.toString();
      if (updatedMonth.length == 1) {
        updatedMonth = `0${updatedMonth}`;
      }
      let day = date.getDate().toString();
      if (day.length == 1) {
        day = `0${day}`;
      }
      this.date = `${year}${updatedMonth}${day}`;
      this.currentTime = `${hour}:${minutes}:${seconds}`;
    },
    prevPage() {
      if (this.page > 1) {
        this.page--;
        this.getProducts();
      }
    },
    nextPage() {
      this.page++;
      this.getProducts();
    },
    async searchByBarcodeItem() {
      this.barcode = this.searchByBarcode;
      await this.getProducts(this.barcode);
      setTimeout(async () => {
        this.barcode = "";
        await this.getProducts();
      }, 5000);
    },
    searchItem() {
      this.getProducts(this.descripcion);
    },
    async searchOneProduct(e: any) {
      try {
        this.searchProduct = e.detail.value;
        this.descripcion = this.searchProduct.toUpperCase();
        if (this.searchProduct === "") {
          return await this.getProducts(this.origin);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getProducts(id: number) {
      try {
        id = this.SelectOrigin;
        if (id === 0) {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "INFORMACION !!!",
            subHeader: `PARA CONTINUAR `,
            message: `DEBE SELECCIONAR ALMACEN DE ORIGEN`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
        } else {
          const getProduct = await TransfersToApp.getAllProducts(
            id,
            this.limit,
            this.page,
            this.descripcion,
            this.barcode
          );

          this.products = getProduct.data.stock;
        }
      } catch (error) {
        console.log(error);
      }
    },
    selectProduct(
      idproducto: number,
      descripcion: string,
      costo: number,
      cantidadAct: number,
      precio: number
    ) {
      try {
        const product = {
          idproducto: idproducto,
          descripcion: descripcion,
          costo: costo,
          cantidad: this.finalAmount,
          cantidadAct: cantidadAct,
          precio: precio,
          idalmacendest: this.SelectDestination,
        };
        const newProduct = { ...product, cantidad: 1 };
        this.productArray.push(newProduct);
        this.searchByBarcode = "";
      } catch (error) {
        console.log(error);
      }
    },
    addAmount(idproducto: number) {
      const producto = this.productArray.filter((r) => {
        return r.idproducto === idproducto;
      })[0];
      if (producto) {
        producto.cantidad++;
        this.finalAmount = producto.cantidad;
      }
    },
    subtractAmount(idproducto: number) {
      const producto = this.productArray.filter((r) => {
        return r.idproducto === idproducto;
      })[0];
      if (producto) {
        producto.cantidad--;
        this.finalAmount = producto.cantidad;
      }
    },
    deleteProduct(idproducto: number) {
      try {
        this.productArray.forEach((p: any) => {
          if (p.idproducto === idproducto) {
            this.productArray.splice(p, 1);
          }
        });
      } catch (error) {
        console.log(error);
      }
    },

    async sendTransfer() {
      try {
        if (this.SelectOrigin === 0) {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "ATENCIÓN !!!",
            subHeader: `NO PASA VALIDACIÓN `,
            message: `DEBE SELECCIONAR ALMACÉN DE ORIGÉN !!`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
          return;
        }
        if (this.SelectDestination === 0) {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "ATENCIÓN !!!",
            subHeader: `NO PASA VALIDACIÓN `,
            message: `DEBE SELECCIONAR ALMACÉN DESTINO !!`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
          return;
        }
        if (this.transfer.documento === "") {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "ATENCIÓN !!!",
            subHeader: `NO PASA VALIDACIÓN `,
            message: `DEBE DIGITAR EL DOCUMENTO !!`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
          return;
        }
        else {
          await this.getNumberTransfer()
          this.transfer.documento = this.transfer.documento.toUpperCase();
          this.transfer.detalle = this.transfer.detalle.toUpperCase();
          this.transfer.hora = this.currentTime;
          this.transfer.fecha = this.date;
          this.transfer.idalmacen = this.SelectOrigin;
          this.transfer.idalmdest = this.SelectDestination;
          this.transfer.estado = this.state;
          this.transfer.numtrasladoorigen = this.finalNumber;
          this.transfer.tipotraslado = this.transferType;
          const idTransfer = await TransfersToApp.getIdTransfer();
          this.idTransfer = idTransfer.data.length + 1;
          const finalProduct = this.productArray;
          finalProduct.forEach((product) => {
            const newProducts = finalProduct.find(
              (item) => item.idproducto === product.idproducto
            );
            newProducts.idtraslado = this.idTransfer;
          });

          this.transfer.dettraslado = finalProduct;
          console.log(this.transfer.dettraslado.length);

          if (this.transfer.dettraslado.length === 0) {
            const alert = await alertController.create({
              cssClass: "my-custom-class",
              header: "ATENCIÓN !!!",
              subHeader: `NO PASA VALIDACIÓN `,
              message: `DEBE CARGAR PRODUCTOS !!`,
              buttons: ["ACEPTAR"],
            });
            await alert.present();
            return;
          }
          const saveTransfer = await TransfersToApp.sendTransfers(
            this.transfer
          );
          console.log(saveTransfer)
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "ATENCIÓN !!!",
            subHeader: `Traslado Generado `,
            message: `SE HA GENERADO TRASLADO PARA CONEXION POS CON EL NUMERO ${this.finalNumber}`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
        }
      } catch (error) {
        console.log(error);
      }
    },
    goToInventoyMovements() {
      this.$router.push("/tabs/tab3");
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

.custom-modal-content {
  --overflow: auto;
  --overflow-scroll-behavior: smooth;
}
</style>