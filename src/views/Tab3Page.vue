<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <img class="edit-image1" src="../images/images_app/logo_header.png" />
          Movimientos de inventario
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-fab id="remote_controller" vertical="start" horizontal="start" slot="fixed">
        <ion-fab-button color="danger">
          <ion-icon :icon="i.add"></ion-icon>
        </ion-fab-button>
        <ion-fab-list side="bottom" @click="fabToggled($event)">
          <ion-card>
            <ion-card-header>Seleccionar Almacén</ion-card-header>
            <ion-card-content>
              <ion-item>
                <ion-label>Almacen</ion-label>
                <ion-select :value="SelectIdalmacen" @ionChange="SelectIdalmacen = $event.target.value">
                  <ion-select-option :value="warehouse.idalmacen" v-for="warehouse in allWarehouses"
                    :key="warehouse.idalmacen">
                    {{ warehouse.nomalmacen }}
                  </ion-select-option>
                </ion-select>
              </ion-item>

            </ion-card-content>
          </ion-card>
        </ion-fab-list>
      </ion-fab>
      <ion-card>
        <ion-card-content>
          <ion-item>
            <ion-label position="floating" class="letter-color">Fecha
            </ion-label>
            <ion-input type="date" :value="fecha" @input="fecha = $event.target.value"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating" class="letter-color">Detalle</ion-label>
            <ion-input type="text" :value="detail" @input="detail = $event.target.value"></ion-input>
          </ion-item>
          <ion-button id="nested-button" color="mycolor" class="btn-edit-product" expand="full"
            @click="getSuppliersApp()"><ion-icon :icon="i.peopleCircleOutline"></ion-icon> Seleccionar
            Tercero
          </ion-button>
          <ion-popover trigger="nested-button" :dismiss-on-select="false">
            <ion-searchbar animated debounce="500" placeholder="Buscar Proveedor" @ionChange="searchSupplier($event)"
              @keypress.enter="searchSupplierItem()">
            </ion-searchbar>
            <ion-content>
              <ion-button color="mycolor" @click="prevPageSupplier()" v-if="page > 1">Anterior</ion-button>
              <ion-button color="mycolor" @click="nextPageSupplier()">Siguiente</ion-button>
              <span> página {{ page }} </span>
              <ion-list>
                <ion-label>
                  <ion-list background-hover="92949c" v-for="supplier in suppliers" :key="supplier.idtercero" @click="
                    selectSupplier(
                      supplier.idtercero,
                      supplier.nit,
                      supplier.nombres
                    )
                    ">
                    <ion-item :button="true" :detail="false">
                      NIT: {{ supplier.nit }}. {{ supplier.nombres }}
                    </ion-item></ion-list></ion-label>
              </ion-list>
            </ion-content>
          </ion-popover>
          <h4 class="letter-color">{{ supplierNit }}{{ supplierName }}</h4>
        </ion-card-content>
      </ion-card>
      <ion-card v-for="(product, index) in productArray" :key="product.id">
        <ion-card-header>
          <ion-card-title>
            <h4 class="letter-color">
              {{ index + 1 }}. {{ product.descripcion }}
            </h4>
          </ion-card-title>

          <ion-card-subtitle>
            <ion-item>
              <ion-label position="floating">Costo</ion-label>
              <ion-input type="number" :value="product.costo" @input="product.costo = $event.target.value"
                disabled></ion-input>
            </ion-item>

            <ion-button color="mycolor" class="btn-edit-product" @click="addAmount(product.idproducto)"><ion-icon
                :icon="i.addSharp"></ion-icon>
            </ion-button>
            <ion-button color="mycolor" class="btn-edit-product" @click="subtractAmount(product.idproducto)"><ion-icon
                :icon="i.removeSharp"></ion-icon>
            </ion-button>
            <ion-button color="mycolor" class="btn-edit-product" @click="deleteProduct(product.idproducto)"><ion-icon
                :icon="i.trashOutline"></ion-icon>
            </ion-button>
            <ion-item>
              <ion-label position="floating">Cantidad Actual</ion-label>
              <ion-input type="number" :value="product.cantidadAct" disabled></ion-input>
            </ion-item>
          </ion-card-subtitle>
        </ion-card-header>
        <h5 text="dark">Cantidad: {{ product.entrada }}</h5>
      </ion-card>
      <ion-content class="ion-padding">
        <ion-button id="open-modal" expand="block" color="mycolor" class="btn-edit-product"
          @click="getProducts(this.SelectIdalmacen)">
          <ion-icon :icon="i.searchCircleSharp"></ion-icon>Seleccionar
          Productos</ion-button>
        <ion-button color="mycolor" class="btn-edit-product" expand="full" @click="saveInventory()"><ion-icon
            :icon="i.saveSharp"></ion-icon> Guardar Entrada de
          productos</ion-button>
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
                <ion-label>
                  <h5 class="ion-text-wrap">{{ product.descripcion }}</h5>
                  <ion-label>Cod. Interno: {{ product.codigo }} </ion-label>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>Cantidad Actual : {{ product.cantidadAct }}
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
                      product.cantidadAct
                    )
                    ">Agregar<ion-icon :icon="i.checkmarkCircleOutline"></ion-icon>
                  </ion-button>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-content>
        </ion-modal>
        <ion-button expand="full" color="mycolor" class="btn-edit-product" @click="newOrder()"><ion-icon
            :icon="i.refreshCircleSharp"></ion-icon> Nuevo Movimiento
        </ion-button>
        <ion-button expand="full" color="mycolor" class="btn-edit-product" @click="goToTransfers()"><ion-icon
            :icon="i.arrowForwardSharp"></ion-icon>Traslados
        </ion-button>
      </ion-content>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as allIcons from "ionicons/icons";
import { InventoryMovements } from "@/services/movementInventory";
import { IIngMovInvEntrada } from "@/interfaces/inventoryMovements.interface";
import {
  BarcodeScanner,
  SupportedFormat,
} from "@capacitor-community/barcode-scanner";
import {
  IonPage,
  IonHeader,
  alertController,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonItem,
  IonButton,
  IonContent,
  IonCardSubtitle,
  IonCardTitle,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonFabButton,
  IonFab,
  IonFabList,
  IonLabel,
  IonSelectOption,
  IonSelect,
  IonInput,
  IonList,
  IonSearchbar,
  IonPopover,
  IonModal,
} from "@ionic/vue";

export default defineComponent({
  name: "Puchases-Enter",
  components: {
    IonPage,
    IonHeader,
    IonCard,
    IonCardContent,
    IonItem,
    IonContent,
    IonCardSubtitle,
    IonCardTitle,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonFabButton,
    IonCardHeader,
    IonFab,
    IonFabList,
    IonLabel,
    IonSelectOption,
    IonSelect,
    IonButton,
    IonInput,
    IonList,
    IonSearchbar,
    IonPopover,
    IonModal,
  },
  data() {
    return {
      i: allIcons,
      saveInventoryMovements: {} as IIngMovInvEntrada,
      SelectIdalmacen: 0 as number,
      allWarehouses: [] as any,
      finalNumber: 0 as number,
      fechadocprov: "" as string,
      fecha: "" as string,
      suppliers: [] as any,
      searchSuppliers: "" as string,
      supplierName: "" as string,
      supplierNit: "" as string,
      idtercero: 0 as number,
      products: [] as any,
      searchProduct: "" as string,
      productArray: [] as any,
      finalAmount: 1 as number,
      cost: 0 as number,
      detail: "" as string,
      idMovement: 0 as number,
      salida: 0 as number,
      searchByBarcode: "" as string,
      limit: 1 as number,
      page: 1 as number,
      offset: 0 as number,
      codigo: "" as string,
      descripcion: "" as string,
      barcode: "" as string,
      totalPages: 0 as number,
      nombres: "" as string,
      nit: "" as string,
    };
  },
  mounted() {
    this.getWarehouses();
    this.getId();
  },
  methods: {
    fabToggled(e: any) {
      e.stopPropagation();
    },
    goToTransfers() {
      this.$router.push("/transfers");
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

    newOrder() {
      location.reload();
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

    async getProducts(id: number) {
      try {
        id = this.SelectIdalmacen;

        if (id === 0) {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "INFORMACION !!!",
            subHeader: `PARA CONTINUAR `,
            message: `DEBE SELECCIONAR ALMACEN`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
        } else {
          const getProduct = await InventoryMovements.getStockItem(
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
    async searchOneProduct(e: any) {
      try {
        this.searchProduct = e.detail.value;
        this.descripcion = this.searchProduct.toUpperCase();
        if (this.searchProduct === "") {
          return await this.getProducts(this.SelectIdalmacen);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getId() {
      try {
        const id_Movement = await InventoryMovements.getIdInserted();
        this.idMovement = id_Movement.data.length + 1;
      } catch (error) {
        console.log(error);
      }
    },
    selectProduct(
      idproducto: number,
      descripcion: string,
      costo: number,
      cantidadAct: number
    ) {
      try {
        const product = {
          idajuste: this.idMovement,
          idproducto: idproducto,
          descripcion: descripcion,
          entrada: 1,
          costo: costo,
          cantidadAct: cantidadAct,
          salida: 0,
          idalmacen: this.SelectIdalmacen,
        };
        this.productArray.push(product);
        this.searchByBarcode = "";
      } catch (error) {
        console.log(error);
      }
    },
    addAmount(idproducto: number) {
      const producto = this.productArray.find((r) => r.idproducto === idproducto);
      if (producto) {
        producto.entrada++;

      }

    },

    subtractAmount(idproducto: number) {
      const producto = this.productArray.filter((r) => {
        return r.idproducto === idproducto;
      })[0];
      if (producto) {
        producto.entrada--;
      }
    },
    async deleteProduct(id: number) {
      try {
        this.productArray.forEach(async (p: any) => {
          if (p.idproducto === id) {
            await this.productArray.splice(p, 1);
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
    async searchSupplier(event: any) {
      try {
        this.searchSuppliers = event.detail.value;

        this.nit = this.searchSuppliers.toUpperCase();
        if (this.searchSuppliers === "") {
          return await this.getSuppliersApp();
        }
      } catch (error) {
        console.log(error);
      }
    },
    prevPageSupplier() {
      if (this.page > 1) {
        this.page--;
        this.getSuppliersApp();
      }
    },
    nextPageSupplier() {
      this.page++;
      this.getSuppliersApp();
    },
    searchSupplierItem() {
      this.getSuppliersApp(this.nit);
    },
    selectSupplier(idTercero: number, nit: string, nombres: string) {
      this.supplierNit = nit;
      this.supplierName = nombres;
      this.idtercero = idTercero;
    },
    async getSuppliersApp() {
      try {
        const suppliers = await InventoryMovements.obtainThirdParties(
          this.limit,
          this.page,
          this.nombres,
          this.nit
        );
        this.suppliers = suppliers.data.third;
      } catch (error) {
        console.log(error);
      }
    },
    async getWarehouses() {
      try {
        const warehouses = await InventoryMovements.obtainWarehouses();

        this.allWarehouses = warehouses.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getNumbers(id: number) {
      try {
        id = this.SelectIdalmacen;
        if (id === 0) {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "ATENCIÓN !!!",
            subHeader: `NO PASA VALIDACIÓN `,
            message: `DEBE SELECCIONAR ALMACEN`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
        } else {
          const consecutiveNumber = await InventoryMovements.getConsecutive(
            this.SelectIdalmacen
          );
          this.finalNumber = consecutiveNumber.data.number.length + 1;
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "CONFIRMACIÓN !!!",
            subHeader: `NÚMERO ENCONTRADO `,
            message: `EL NÚMERO DE ENTRADA ES ${this.finalNumber}`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async saveInventory() {
      if (this.SelectIdalmacen === 0) {
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "ATENCIÓN !!!",
          subHeader: `NO PASA VALIDACIÓN `,
          message: `DEBE SELECCIONAR ALMACÉN !!`,
          buttons: ["ACEPTAR"],
        });
        await alert.present();
        return false;
      } else if (this.idtercero === 0) {
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "ATENCIÓN !!!",
          subHeader: `NO PASA VALIDACIÓN `,
          message: `DEBE SELECCIONAR PROVEEDOR !!`,
          buttons: ["ACEPTAR"],
        });
        await alert.present();
        return false;
      } else if (this.idMovement === 0) {
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "ATENCIÓN !!!",
          subHeader: `NO PASA VALIDACIÓN `,
          message: `DEBE CARGAR LOS DATOS DE LO PRODUCTOS !!`,
          buttons: ["ACEPTAR"],
        });
        await alert.present();
        return false;
      } else {
        await this.getNumbers(this.SelectIdalmacen)
        this.saveInventoryMovements.idalmacen = this.SelectIdalmacen;
        this.saveInventoryMovements.idusuario = 1;
        this.saveInventoryMovements.idconceptajuste = 1;
        this.saveInventoryMovements.numero = this.finalNumber;
        this.saveInventoryMovements.fecha = this.fecha.replace(/-/gi, "");
        this.saveInventoryMovements.detalle = this.detail;
        this.saveInventoryMovements.ajustesinv = this.productArray;
        this.saveInventoryMovements.idtercero = this.idtercero;
        this.saveInventoryMovements.estado = 0;
        const saveInventoryMovementsToPos =
          await InventoryMovements.movementInventorySave(
            this.saveInventoryMovements
          );
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: `CONFIRMACION !!! ${saveInventoryMovementsToPos.statusText}`,
          subHeader: `MOVIMIENTO ${this.finalNumber} GUARDADO SATISFACTORIAMENTE `,
          message: `APROBAR LA ENTRADA DE PRODUCTOS EN CONEXION POS CON EL NUMERO ${this.finalNumber}`,
          buttons: ["ACEPTAR"],
        });
        await alert.present();
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
  margin: 8px 0;
}

ion-button {
  background-color: var(--ion-color-mycolor);
  border-radius: 30px;
  /* Bordes redondeados */
  text-transform: uppercase;
  /* Texto en mayúsculas */
  font-weight: bold;
  /* Texto en negrita */
  margin-top: 10px;
  /* Espacio superior */

}

ion-icon {
  margin-right: 8px;
  /* Espacio entre el icono y el texto */
}

ion-header {
  background-color: #fff;
  /* Fondo blanco */
  border-bottom: 1px solid #ccc;
  /* Borde inferior gris */
}

ion-title {
  color: #d6d5d5;
  /* Color de texto */
  font-weight: bold;
  /* Texto en negrita */
}

ion-content {
  background-color: #f4f5f8;
  /* Fondo gris claro */
  padding: 10px;
  /* Espaciado interior */
}

ion-list {
  background-color: transparent;
  /* Fondo transparente */
  margin-top: 0;
  /* Sin margen superior */
  margin-bottom: 0;
  /* Sin margen inferior */
}

ion-item {
  border-bottom: 1px solid #ccc;
  /* Borde inferior gris */
  padding: 10px;
  /* Espaciado interior */
}

ion-label {
  color: #333;
  /* Color de texto */
}

ion-button.button-in-item {
  --border-radius: 5px;
  /* Bordes redondeados */
  --background: #3880ff;
  /* Fondo azul */
  --color: #fff;
  /* Texto blanco */
  --padding-end: 10px;
  /* Espaciado derecho */
  --padding-start: 10px;
  /* Espaciado izquierdo */
  margin-left: auto;
  /* Margen izquierdo automático */
}

.letter-color {
  color: #82230d;
  text-shadow: 1px 1px #fff;
}

.custom-modal-content {
  --overflow: auto;
  --overflow-scroll-behavior: smooth;
}

ion-label h5 {
  white-space: normal;
  /* Permite que el texto se ajuste a múltiples líneas */
  word-wrap: break-word;
  /* Permite que el texto se ajuste y rompa palabras si es necesario */
}
</style>