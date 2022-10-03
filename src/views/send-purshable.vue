<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <img class="edit-image1" src="../images/images_app/logo_header.png" />
          Compras a proveedores
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-fab
        id="remote_controller"
        vertical="start"
        horizontal="start"
        slot="fixed"
      >
        <ion-fab-button color="danger">
          <ion-icon :icon="i.add"></ion-icon>
        </ion-fab-button>
        <ion-fab-list side="bottom" @click="fabToggled($event)">
          <ion-card>
            <ion-card-header>Seleccionar Almacén</ion-card-header>
            <ion-card-content>
              <ion-item>
                <ion-label>Almacen</ion-label>
                <ion-select
                  :value="SelectIdalmacen"
                  @ionChange="SelectIdalmacen = $event.target.value"
                >
                  <ion-select-option
                    :value="warehouse.idalmacen"
                    v-for="warehouse in allWarehouses"
                    :key="warehouse.idalmacen"
                  >
                    {{ warehouse.nomalmacen }}
                  </ion-select-option>
                </ion-select>
              </ion-item>
              <ion-button
                color="mycolor"
                class="btn-edit-product"
                expand="full"
                @click="getIdalmacen()"
              >
                Aceptar</ion-button
              >
            </ion-card-content>
          </ion-card>
        </ion-fab-list>
      </ion-fab>
      <ion-button
        color="mycolor"
        class="btn-edit-product"
        expand="full"
        @click="getNumbers(idalmacen)"
        >Numero de Compra</ion-button
      >
      <ion-card>
        <ion-card-content>
          <ion-item>
            <ion-label position="floating" class="letter-color"
              >Prefijo:</ion-label
            >
            <ion-input
              type="text"
              :value="prefijo"
              @input="prefijo = $event.target.value"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating" class="letter-color"
              >Número de Documento:</ion-label
            >
            <ion-input
              type="number"
              :value="docprovee"
              @input="docprovee = $event.target.value"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating" class="letter-color"
              >Fecha Documento</ion-label
            >
            <ion-input
              type="date"
              :value="fechadocprov"
              @input="fechadocprov = $event.target.value"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating" class="letter-color"
              >Fecha
            </ion-label>
            <ion-input
              type="date"
              :value="fecha"
              @input="fecha = $event.target.value"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating" class="letter-color"
              >Detalle</ion-label
            >
            <ion-input
              type="text"
              :value="detail"
              @input="detail = $event.target.value"
            ></ion-input>
          </ion-item>
          <ion-button
            id="nested-button"
            color="mycolor"
            class="btn-edit-product"
            expand="full"
            @click="getSuppliersApp()"
            ><ion-icon :icon="i.peopleCircleOutline"></ion-icon> Seleccionar
            Proveedor
          </ion-button>
          <ion-popover trigger="nested-button" :dismiss-on-select="false">
            <ion-searchbar
              animated
              debounce="500"
              placeholder="Buscar Proveedor"
              @ionChange="searchSupplier($event)"
            >
            </ion-searchbar>
            <ion-content>
              <ion-list>
                <ion-label>
                  <ion-list
                    background-hover="92949c"
                    v-for="supplier in suppliers"
                    :key="supplier.idtercero"
                    @click="
                      selectSupplier(
                        supplier.idtercero,
                        supplier.nit,
                        supplier.nombres
                      )
                    "
                  >
                    <ion-item :button="true" :detail="false">
                      NIT: {{ supplier.nit }}. {{ supplier.nombres }}
                    </ion-item></ion-list
                  ></ion-label
                >
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
              <ion-input
                type="number"
                :value="product.valor"
                @input="product.valor = $event.target.value"
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-label>IVA</ion-label>
              <ion-select
                :value="porcentaje"
                @ionChange="porcentaje = $event.target.value"
              >
                <ion-select-option
                  :value="taxe.porcentaje"
                  v-for="taxe in this.taxes"
                  :key="taxe.codiva"
                >
                  {{ taxe.porcentaje }}
                </ion-select-option>
              </ion-select>
            </ion-item>

            <ion-button
              color="mycolor"
              class="btn-edit-product"
              @click="addAmount(product.idproducto)"
              ><ion-icon :icon="i.addSharp"></ion-icon>
            </ion-button>
            <ion-button
              color="mycolor"
              class="btn-edit-product"
              @click="subtractAmount(product.idproducto)"
              ><ion-icon :icon="i.removeSharp"></ion-icon>
            </ion-button>
            <ion-button
              color="mycolor"
              class="btn-edit-product"
              @click="deleteProduct(product.idproducto)"
              ><ion-icon :icon="i.trashOutline"></ion-icon>
            </ion-button>
            <ion-item>
              <ion-label position="floating">Precio de venta</ion-label>
              <ion-input
                type="number"
                :value="product.precioventa"
                @input="product.precioventa = $event.target.value"
              ></ion-input>
            </ion-item>
          </ion-card-subtitle>
        </ion-card-header>
        <h5 text="dark">Cantidad: {{ product.cantidad }}</h5>
      </ion-card>
      <ion-content class="ion-padding">
        <ion-button
          id="open-modal"
          expand="block"
          color="mycolor"
          class="btn-edit-product"
          @click="getProducts()"
        >
          <ion-icon :icon="i.searchCircleSharp"></ion-icon>Seleccionar
          Productos</ion-button
        >
        <ion-button
          color="mycolor"
          class="btn-edit-product"
          expand="full"
          @click="savePurshaseToPos()"
          ><ion-icon :icon="i.saveSharp"></ion-icon> Grabar Compra</ion-button
        >
        <ion-modal
          ref="modal"
          trigger="open-modal"
          :initial-breakpoint="0.25"
          :breakpoints="[0, 0.25, 0.5, 0.75]"
        >
          <ion-content class="ion-padding">
            <ion-searchbar
              @click="$refs.modal.$el.setCurrentBreakpoint(0.75)"
              placeholder="Buscar Producto"
              @ionChange="searchOneProduct($event)"
            ></ion-searchbar>
            <ion-list v-for="product in products" :key="product.idproduct">
              <ion-item>
                <ion-label
                  >{{ product.codigo }} | {{ product.descripcion }}
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  $
                  {{ new Intl.NumberFormat("de-DE").format(product.costo) }}

                  <ion-button
                    color="mycolor"
                    class="btn-edit-product"
                    expand="full"
                    @click="
                      selectProduct(
                        product.idproducto,
                        product.descripcion,
                        product.precioventa,
                        product.costo,
                        product.codiva
                      )
                    "
                    >Comprar<ion-icon
                      :icon="i.checkmarkCircleOutline"
                    ></ion-icon>
                  </ion-button>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-content>
        </ion-modal>
        <ion-button
          expand="full"
          color="mycolor"
          class="btn-edit-product"
          @click="newOrder()"
          ><ion-icon :icon="i.refreshCircleSharp"></ion-icon> Nueva Compra
        </ion-button>
      </ion-content>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as allIcons from "ionicons/icons";
import { Purchases } from "@/services/chargePurchasesToPos";
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
import { IHeaderPurchases } from "@/interfaces/recordPurchases.interface";
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
      savePurshable: {} as IHeaderPurchases,
      SelectIdalmacen: 0 as number,
      allWarehouses: [] as any,
      idalmacen: 0 as number,
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
      finalAmount: 0 as number,
      salePrice: 0 as number,
      cost: 0 as number,
      TotalProductCost: 0 as number,
      prefijo: "" as string,
      docprovee: 0 as number,
      detail: "" as string,
      idPurshable: 0 as number,
      taxes: [] as any,
      porcentaje: 0 as number
    };
  },
  mounted() {
    this.getWarehouses();
    this.getId();
    this.getTax();
  },
  methods: {
    fabToggled(e: any) {
      e.stopPropagation();
    },
    newOrder() {
      location.reload();
    },
    async getProducts() {
      try {
        const getProduct = await Purchases.getProductsByApp();

        this.products = getProduct.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getTax() {
      const getTaxCode = await Purchases.getTaxes();
      this.taxes = getTaxCode.data;
    },

    async searchOneProduct(e: any) {
      try {
        this.searchProduct = e.detail.value;
        this.searchProduct = this.searchProduct.toUpperCase();
        if (this.searchProduct === "") {
          return await this.getProducts(this.idalmacen);
        }
        if (this.searchProduct && this.searchProduct.trim() != "") {
          this.products = this.products.filter((product: any) => {
            return (
              product.descripcion.toUpperCase().indexOf(this.searchProduct) >
                -1 ||
              product.barcode.indexOf(this.searchProduct) > -1 ||
              product.codigo.indexOf(this.searchProduct) > -1
            );
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getId() {
      try {
        const id_Purshable = await Purchases.getIdPurshable();
        this.idPurshable = id_Purshable.data.length + 1;
      } catch (error) {
        console.log(error);
      }
    },
    selectProduct(
      idproducto: number,
      descripcion: string,
      precioventa: number,
      costo: number,
      codiva: string
    ) {
      try {

        const product = [
          {
            idcompra: this.idPurshable,
            idproducto: idproducto,
            descripcion: descripcion,
            precioventa: precioventa,
            valor: costo,
            codiva: codiva,
            cantidad: this.finalAmount,
            porciva: this.porcentaje,
          },
        ];
        const productFinal = JSON.stringify(product);
        const finalProductParsed = JSON.parse(productFinal);

        finalProductParsed.forEach((product: any) => {
          this.productArray.push(product);
        });
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

        this.searchSuppliers = this.searchSuppliers.toUpperCase();
        if (this.searchSuppliers === "") {
          return await this.getSuppliersApp();
        }
        if (this.searchSuppliers && this.searchSuppliers.trim() != "") {
          this.suppliers = this.suppliers.filter((supplier: any) => {
            return (
              supplier.nombres.toUpperCase().indexOf(this.searchSuppliers) >
                -1 || supplier.nit.indexOf(this.searchSuppliers) > -1
            );
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    selectSupplier(idTercero: number, nit: string, nombres: string) {
      this.supplierNit = nit;
      this.supplierName = nombres;
      this.idtercero = idTercero;
    },
    async getSuppliersApp() {
      try {
        const suppliers = await Purchases.getSuppliers();
        this.suppliers = suppliers.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getWarehouses() {
      try {
        const warehouses = await Purchases.getWarehouses();
        this.allWarehouses = warehouses.data;
      } catch (error) {
        console.log(error);
      }
    },
    getIdalmacen() {
      this.idalmacen = this.SelectIdalmacen;
    },
    async getNumbers(id: number) {
      try {
        id = this.idalmacen;
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
          const consecutiveNumber = await Purchases.getNumberPurchase(id);
          this.finalNumber = consecutiveNumber.data.length + 1;
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "CONFIRMACIÓN !!!",
            subHeader: `NÚMERO ENCONTRADO `,
            message: `EL NÚMERO DE COMPRA ES ${this.finalNumber}`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async savePurshaseToPos() {
      if (this.idalmacen === 0) {
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "ATENCIÓN !!!",
          subHeader: `NO PASA VALIDACIÓN `,
          message: `DEBE SELECCIONAR ALMACÉN !!`,
          buttons: ["ACEPTAR"],
        });
        await alert.present();
        return false;
      } else if (this.docprovee === 0) {
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "ATENCIÓN !!!",
          subHeader: `NO PASA VALIDACIÓN `,
          message: `DEBE DIGITAR EL NUMERO DE DOCUMENTO PROVEEDOR  !!`,
          buttons: ["ACEPTAR"],
        });
        await alert.present();
        return false;
      } else if (this.finalNumber === 0) {
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "ATENCIÓN !!!",
          subHeader: `NO PASA VALIDACIÓN `,
          message: `DEBE GENERAR EL NÚMERO DE COMPRA !!`,
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
      } else if (this.finalAmount===0  ||this.idPurshable ===0 ){
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "ATENCIÓN !!!",
          subHeader: `NO PASA VALIDACIÓN `,
          message: `DEBE CARGAR LOS DATOS DE LO PRODUCTOS !!`,
          buttons: ["ACEPTAR"],
        });
        await alert.present();
        return false;
      }     
      else {
        this.savePurshable.idalmacen = this.idalmacen;
        this.savePurshable.docprovee = this.docprovee;
        this.savePurshable.numero = this.finalNumber;
        this.savePurshable.fechadocprov = this.fechadocprov.replace(/-/gi, "");
        this.savePurshable.fecha = this.fecha.replace(/-/gi, "");
        this.savePurshable.prefijo = this.prefijo;
        this.savePurshable.detalle = this.detail;
        this.savePurshable.detcompras = this.productArray;
        this.savePurshable.idpago = 1;
        this.savePurshable.aprobada = 0;
        this.savePurshable.idtercero = this.idtercero;
        const savePurshaseToPos = await Purchases.setHeadertoPurchase(
          this.savePurshable
        );
        console.log(savePurshaseToPos);

        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "CONFIRMACION !!!",
          subHeader: `COMPRA ${this.finalNumber} GUARDADA SATISFACTORIAMENTE `,
          message: `APROBAR LA COMPRA EN CONEXION POS CON EL NUMERO ${this.finalNumber}`,
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
}

ion-button {
  background-color: var(--ion-color-mycolor);
}
.letter-color {
  color: #82230d;
  text-shadow: 1px 1px #fff;
}
</style>