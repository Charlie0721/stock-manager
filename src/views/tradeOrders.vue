<template>
  <ion-page>
    <ion-header>
      <ion-button color="mycolor" expand="block" class="btn-edit-product" @click="checkSales">Consultar ventas del Día
      </ion-button>
      <ion-toolbar>
        <ion-title>
          <img class="edit-image1" src="../images/images_app/logo_header.png" />
          Pedido Comercial

          <ion-button color="mycolor" class="btn-edit-product" @click="newOrder()"><ion-icon
              :icon="i.refreshCircleSharp"></ion-icon> Nuevo Pedido
          </ion-button>
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-button id="open-modal1" expand="block" color="mycolor" class="btn-edit-product">
        <ion-icon :icon="i.personAddOutline"></ion-icon>Crear
        Cliente</ion-button>
      <ion-modal ref="modal" trigger="open-modal1" :initial-breakpoint="0.25" :breakpoints="[0, 0.25, 0.5, 0.75]">
        <ion-content class="ion-padding">
          <div class="ion-text-center">
            <h4>Crear Cliente</h4>
          </div>
          <ion-item>
            <ion-label position="floating">NIT:</ion-label>
            <ion-input type="text" :value="saveClient.nit" @input="saveClient.nit = $event.target.value"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">NOMBRES:</ion-label>
            <ion-input type="text" :value="saveClient.nombres"
              @input="saveClient.nombres = $event.target.value"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">DIRECCION:</ion-label>
            <ion-input type="text" :value="saveClient.direccion"
              @input="saveClient.direccion = $event.target.value"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">TELEFONO:</ion-label>
            <ion-input type="text" :value="saveClient.telefono"
              @input="saveClient.telefono = $event.target.value"></ion-input>
          </ion-item>
          <ion-button color="mycolor" class="btn-edit-product" expand="full" @click="createClient()"><ion-icon
              :icon="i.saveSharp"></ion-icon> GUARDAR
            CLIENTE</ion-button>
        </ion-content>
      </ion-modal>
      <ion-button id="nested-button" color="mycolor" class="btn-edit-product" expand="full"
        @click="getCustomers()"><ion-icon :icon="i.peopleCircleOutline"></ion-icon> Seleccionar Cliente
      </ion-button>
      <ion-popover trigger="nested-button" :dismiss-on-select="false">
        <ion-searchbar animated debounce="500" placeholder="Buscar cliente" @ionChange="searchOneCustomer($event)"
          @keypress.enter="searchCustomerItem()">
        </ion-searchbar>
        <ion-content>
          <ion-card>
            <ion-card-header>
              <ion-button color="mycolor" @click="prevPageCustomer()" v-if="page > 1">Anterior</ion-button>
              <ion-button color="mycolor" @click="nextPageCustomer()">Siguiente</ion-button>
              <span> página {{ page }} </span>
              <ion-card-title>Seleccionar Cliente</ion-card-title>
              <ion-card-subtitle>Click sobre el cliente</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <ion-list background-hover="92949c" v-for="customer in customers" :key="customer.idtercero" @click="
                selectCustomer(
                  customer.idtercero,
                  customer.nit,
                  customer.nombres
                )
                ">
                <ion-item>
                  <ion-label> NIT: {{ customer.nit }}</ion-label>
                </ion-item>
                <ion-item> {{ customer.nombres }} </ion-item>
              </ion-list>
            </ion-card-content>
          </ion-card>
        </ion-content>
      </ion-popover>
      <ion-button id="nested-button1" expand="full" color="mycolor" class="btn-edit-product"><ion-icon
          :icon="i.personCircleOutline"></ion-icon>Seleccionar Vendedor
      </ion-button>
      <ion-popover trigger="nested-button1" :dismiss-on-select="false">
        <ion-searchbar animated debounce="500" placeholder="Buscar empleado" @ionChange="searchOneEmployee($event)">
        </ion-searchbar>
        <ion-content>
          <ion-list>
            <ion-label>
              <ion-list background-hover="92949c" v-for="employee in employees" :key="employee.idtercero" @click="
                selectEmployee(
                  employee.idtercero,
                  employee.nit,
                  employee.nombres
                )
                ">
                <ion-item :button="true" :detail="false">
                  NIT: {{ employee.nit }}. {{ employee.nombres }}
                </ion-item></ion-list></ion-label>
          </ion-list>
        </ion-content>
      </ion-popover>
      <ion-text color="medium" v-if="customerName">
        <h3>
          {{ customerName }}
        </h3>

        <h3>
          {{ customerNit }}
        </h3>
      </ion-text>

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
          <h5 text="dark">Cantidad: {{ product.cantidad }}</h5>
          <h5 text="dark">Base: {{ new Intl.NumberFormat("de-DE").format(base = (product.valorprod - product.ivaprod) *
            product.cantidad) }}
          </h5>
          <h5 text="dark" v-if="product.ivaprod > 0">IVA: {{ new
            Intl.NumberFormat("de-DE").format(taxValue = (product.valorprod - product.base) * product.cantidad) }}
          </h5>
          <ion-label position="floating">Valor Unitario $:</ion-label>
          <ion-input type="number" :value="product.valorprod"
            @input="updateValorProd(product, $event.target.value)"></ion-input>
          Total: $
          {{
            new Intl.NumberFormat("de-DE").format(
              (TotalProduct = product.valorprod * product.cantidad)
            )
          }}

        </ion-card-content>
      </ion-card>
      <ion-card>
        <ion-card-content>
          <ion-text color="dark" v-if="subtotal > 0">
            <h3>
              SUBTOTAL: $
              {{ new Intl.NumberFormat("de-DE").format(subtotal) }}
            </h3>
          </ion-text>
          <ion-text color="dark" v-if="valimpuesto > 0">
            <h3>
              IVA: $
              {{ new Intl.NumberFormat("de-DE").format(valimpuesto) }}
            </h3>
          </ion-text>
          <ion-text color="dark" v-if="total > 0">
            <h1>
              TOTAL: $
              {{ new Intl.NumberFormat("de-DE").format(total) }}
            </h1>
          </ion-text>
        </ion-card-content>
      </ion-card>
      <ion-content class="ion-padding">
        <ion-button id="open-modal" expand="block" color="mycolor" class="btn-edit-product" @click="getProducts()">
          <ion-icon :icon="i.searchCircleSharp"></ion-icon>Seleccionar
          Productos</ion-button>
        <ion-button color="mycolor" class="btn-edit-product" expand="full" @click="saveCompleteTradeOrder()"><ion-icon
            :icon="i.saveSharp"></ion-icon> Grabar Pedido</ion-button>
        <ion-modal ref="modal" trigger="open-modal" :initial-breakpoint="0.25" :breakpoints="[0, 0.25, 0.5, 0.75]">
          <ion-content class="ion-padding custom-modal-content">
            <ion-searchbar @click="$refs.modal.$el.setCurrentBreakpoint(0.75)" placeholder="Buscar Producto"
              @ionChange="searchOneProduct($event)" @keypress.enter="searchItem()"></ion-searchbar>
            <ion-input type="text" :value="searchByBarcode" @input="searchByBarcode = $event.target.value"
              placeholder="Código de barras" @keypress.enter="searchByBarcodeItem()" :clear-input="true"></ion-input>
            <ion-button color="mycolor" expand="full" class="btn-edit-product" @click="startScan()">
              Buscar Código barras</ion-button>
            <ion-button color="mycolor" @click="prevPage()" v-if="page > 1">Anterior</ion-button>
            <ion-button color="mycolor" @click="nextPage()">Siguiente</ion-button>
            <span> página {{ page }} </span>
            <ion-list v-for="product in products" :key="product.idproduct">
              <ion-item>
                <ion-label>{{ product.codigo }} | {{ product.descripcion }}
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label> Cantidad:{{ product.cantidad }} </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  $
                  {{
                    new Intl.NumberFormat("de-DE").format(product.precioventa)
                  }}

                  <ion-button color="mycolor" class="btn-edit-product" expand="full" @click="
                  selectProduct(
                    product.idproducto,
                    product.descripcion,
                    product.precioventa,
                    product.ultcosto,
                    product.codiva,
                    product.baseValue,
                    product.taxValue,
                    product.porcentaje
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
import { TradeOrders } from "@/services/tradeOrder";
import {
  BarcodeScanner,
  SupportedFormat,
} from "@capacitor-community/barcode-scanner";
import { ItradeOrderHeader } from "@/interfaces/traderOrder.interface";
import { IcreateClient } from "@/interfaces/createClient.interface";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCardSubtitle,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonLabel,
  IonItem,
  IonButton,
  alertController,
  IonList,
  IonSearchbar,
  IonPopover,
  IonModal,
  IonText,
  IonCardTitle,
  IonInput,
} from "@ionic/vue";

export default defineComponent({
  name: "Tab1Page",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonCardSubtitle,
    IonIcon,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonLabel,
    IonItem,
    IonButton,
    IonList,
    IonSearchbar,
    IonPopover,
    IonModal,
    IonText,
    IonCardTitle,
    IonInput,
  },
  data() {
    return {
      i: allIcons,
      SelectIdalmacen: 0 as number,
      allWarehouses: [] as any,
      idalmacen: "" as string,
      finalNumber: 0 as number,
      customers: [] as any,
      searhCustomer: "" as string,
      employees: [] as any,
      searchEmployees: "" as string,
      date: "" as string,
      currentTime: "" as string,
      products: [] as any,
      searchProduct: "" as string,
      productArray: [] as any,
      saveTradeOrder: {} as ItradeOrderHeader,
      employeeName: "" as string,
      employeeNit: "" as string,
      customerName: "" as string,
      customerNit: "" as string,
      despachado: 0 as number,
      idTradeOrder: "" as string,
      descuentoProd: 0 as number,
      finalAmount: 0 as number,
      finalSalePrice: 0 as number,
      totalProduct: 0,
      idvendedor: 0 as number,
      idtercero: 0 as number,
      multiplyTotalsAndAmounts: 0 as number,
      finalValue: 0 as number,
      saveClient: {} as IcreateClient,
      shoppingCart: {} as any,
      finalCant: 0 as number,
      TotalProduct: 0 as number,
      idsoftware: 0 as number,
      detalle: "" as string,
      plazo: 0 as number,
      searchByBarcode: "" as string,
      limit: 2 as number,
      page: 1 as number,
      offset: 0 as number,
      codigo: "" as string,
      descripcion: "" as string,
      barcode: "" as string,
      totalPages: 0 as number,
      nombres: "" as string,
      nit: "" as string,
      base: 0 as number,
      taxValue: 0 as number
    };
  },
  mounted() {
    this.getEmployee();
    this.getDate();
  },
  methods: {
    fabToggled(e: any) {
      e.stopPropagation();
    },
    checkSales() {
      this.$router.push("/check-sales-by-day");
    },


    newOrder() {
      location.reload();
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
    async createClient() {
      try {
        let nit = this.saveClient.nit;
        this.saveClient.nit = nit;
        let name = this.saveClient.nombres;
        let phone = this.saveClient.telefono;
        this.saveClient.telefono = phone;
        this.saveClient.nombres = name.toUpperCase();
        let address = this.saveClient.direccion;
        this.saveClient.direccion = address.toUpperCase();
        this.saveClient.cliente = 1;
        this.saveClient.tipopersona = 1;
        this.saveClient.idregimen = 2;
        this.saveClient.tipofactura = 1;
        this.saveClient.TipoId = 13;
        this.saveClient.idpais = 1;

        if (nit === "") {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "ATENCION !!!",
            subHeader: `NO PASA VALIDACIÓN !!! `,
            message: `EL NIT NO PUEDE ESTAR VACIO !!`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
          return false;
        }
        if (name === "") {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "ATENCION !!!",
            subHeader: `NO PASA VALIDACIÓN !!! `,
            message: `EL NOMBRE NO PUEDE ESTAR VACIO !!`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
          return false;
        }
        if (address === "") {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "ATENCION !!!",
            subHeader: `NO PASA VALIDACIÓN !!! `,
            message: `DEBE INGRESAR DIRECCION`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
          return false;
        }
        if (phone === "") {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "ATENCION !!!",
            subHeader: `NO PASA VALIDACIÓN !!! `,
            message: `EL TELEFONO NO PUEDE ESTAR VACIO!!!`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
          return false;
        } else {
          const newClient = await TradeOrders.saveClientToOrder(
            this.saveClient
          );
          console.log(newClient);
          this.saveClient.nit = "";
          this.saveClient.nombres = "";
          this.saveClient.telefono = "";
          this.saveClient.direccion = "";
        }
      } catch (error) {
        console.log(error);
      }
    },
    async viewOrder(idalmacen: number, number: number) {
      if (idalmacen == 0 || number == 0) {
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "ATENCION !!!",
          subHeader: `NO SE ENCUENTRA INFORMACION `,
          message: `DEBE CARGAR PEDIDO`,
          buttons: ["ACEPTAR"],
        });
        await alert.present();
        return false;
      } else {
        this.$router.push(`/view-order/${number}/${idalmacen}`);
      }
    },
    subtractAmount(idproducto: number) {
      const producto = this.productArray.filter((r) => {
        return r.idproducto === idproducto;
      })[0];
      if (producto) {
        producto.cantidad--;
        this.finalAmount = producto.cantidad;
        this.total = this.productArray.reduce(
          (total, { cantidad, valorprod }) => total + cantidad * valorprod,
          0
        );
      }
    },

    async saveCompleteTradeOrder() {
      try {

        if (this.total === 0 || this.total < 0) {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "ATENCION !!!",
            subHeader: `NO PASA VALIDACION `,
            message: `NO PUEDE ENVIAR PEDIDO CON VALOR EN 0 Ó NEGATIVO !!!`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
          return false;
        } else {
          await this.getNumbers(this.idalmacen);
          if (this.idtercero === 0) {
            let idCustom = localStorage.getItem("idCustomer");
            this.idtercero = JSON.parse(idCustom);
            this.saveTradeOrder.idtercero = this.idtercero;

          } else {
            this.saveTradeOrder.idtercero = this.idtercero;

          }
          if (this.idvendedor === 0) {
            let idEmploy = localStorage.getItem("idEmployee");
            this.idvendedor = JSON.parse(idEmploy);
            this.saveTradeOrder.idvendedor = this.idvendedor;
          } else {
            this.saveTradeOrder.idvendedor = this.idvendedor;
          }
          this.saveTradeOrder.numero = this.finalNumber;
          this.saveTradeOrder.fecha = this.date;
          this.saveTradeOrder.subtotal = this.subtotal;
          this.saveTradeOrder.valortotal = this.total;
          this.saveTradeOrder.valimpuesto = this.valimpuesto;
          this.saveTradeOrder.valdescuentos = 0;
          this.saveTradeOrder.valretenciones = 0;
          this.saveTradeOrder.idalmacen = this.idalmacen;
          this.saveTradeOrder.estado = 3;
          this.saveTradeOrder.idsoftware = 2;
          this.saveTradeOrder.detalle = "Pedido desde app movil";
          this.saveTradeOrder.fechacrea = this.date;
          this.saveTradeOrder.hora = this.currentTime;
          this.saveTradeOrder.plazo = this.plazo;
          const idTrade = await TradeOrders.getIdTradeOrder();
          this.idTradeOrder = idTrade.data.length + 1;
          const finalProduct = this.productArray;
          finalProduct.forEach((product) => {
            const newProducts = finalProduct.find(
              (item) => item.idproducto === product.idproducto
            );
            newProducts.idpedido = this.idTradeOrder;
          });

          this.saveTradeOrder.detpedidos = finalProduct;
          const saveOrder1 = await TradeOrders.saveOrder(this.saveTradeOrder);
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "CONFIRMACION !!!",
            subHeader: `PEDIDO GENERADO `,
            message: `SE HA GENERADO EL PEDIDO COMERCIAL `,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
          console.log(saveOrder1);
        }

        this.viewOrder(this.idalmacen, this.finalNumber);
      } catch (error) {
        console.log(error);
      }
    },
    deleteProduct(id: number) {
      try {
        const productIndex = this.productArray.findIndex((p) => p.idproducto === id);
        if (productIndex !== -1) {
          const deletedProduct = this.productArray[productIndex];
          this.total -= deletedProduct.valorprod;
          const deletedTaxValue = deletedProduct.cantidad * deletedProduct.taxValue;
          deletedProduct.valorprod -= deletedTaxValue;
          this.valimpuesto -= deletedTaxValue;
          this.productArray.splice(productIndex, 1);
        }
      } catch (error) {
        console.log(error);
      }
    },
    selectProduct(
      idproducto: number,
      descripcion: string,
      precioventa: number,
      costoprod: number,
      codiva: string,
      baseValue: number,
      taxValue: number,
      porcentaje: number
    ) {
      try {

        const product = {
          idproducto: idproducto,
          descripcion: descripcion,
          valorprod: precioventa,
          costoprod: costoprod,
          codiva: codiva,
          cantidad: 1,
          despachado: this.despachado,
          descuento: this.descuentoProd,
          base: baseValue,
          ivaprod: taxValue,
          porciva: porcentaje
        };

        this.productArray.push(product);
        this.searchByBarcode = "";
      } catch (error) {
        console.log(error);
      }
    },
    addAmount(idproducto) {
      const producto = this.productArray.find((r) => r.idproducto === idproducto);
      if (producto) {
        producto.cantidad++;
      }
    },
    async searchOneProduct(e: any) {
      try {
        this.searchProduct = e.detail.value;
        this.descripcion = this.searchProduct.toUpperCase();
        if (this.searchProduct === "") {
          return await this.getProducts(this.idalmacen);
        }
      } catch (error) {
        console.log(error);
      }
    },
    updateValorProd(producto, nuevoValor) {
      producto.valorprod = parseFloat(nuevoValor);
      this.recalcularPropiedadesComputadas();

    },

    recalcularPropiedadesComputadas() {
      this.subtotal;
      this.valimpuesto;
      this.total;
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
    searchItem() {
      this.getProducts(this.descripcion);
    },
    async searchByBarcodeItem() {
      this.barcode = this.searchByBarcode;
      await this.getProducts(this.barcode);
      setTimeout(async () => {
        this.barcode = "";
        await this.getProducts();
      }, 5000);
    },
    async getProducts() {
      try {
        let idAlm = localStorage.getItem("idAlmacen");
        this.idalmacen = JSON.parse(idAlm);
        const response = await TradeOrders.getProducts(
          this.idalmacen,
          this.limit,
          this.page,
          this.descripcion,
          this.barcode
        );
        this.products = response.data.newProducts;

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
    selectEmployee(id: number, nit: string, nombres: string) {
      this.idvendedor = id;
      this.employeeName = nombres;
      this.employeeNit = nit;
    },
    async searchOneEmployee(event: any) {
      try {
        this.searchEmployees = event.detail.value;

        this.searchEmployees = this.searchEmployees.toUpperCase();
        if (this.searchEmployees === "") {
          return await this.getEmployee();
        }
        if (this.searchEmployees && this.searchEmployees.trim() != "") {
          this.employees = this.employees.filter((employee: any) => {
            return (
              employee.nombres.toUpperCase().indexOf(this.searchEmployees) >
              -1 || employee.nit.indexOf(this.searchEmployees) > -1
            );
          });
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getEmployee() {
      const employees = await TradeOrders.getEmployee();
      this.employees = employees.data.employee;
    },
    selectCustomer(id: number, nit: string, nombres: string) {
      this.idtercero = id;
      this.customerName = nombres;
      this.customerNit = nit;
    },
    async searchOneCustomer(event: any) {
      try {
        this.searhCustomer = event.detail.value;
        this.nit = this.searhCustomer.toUpperCase();

        if (this.searhCustomer === "") {
          return await this.getCustomers();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async searchCustomerItem() {
      await this.getCustomers(this.nit);
    },

    prevPageCustomer() {
      if (this.page > 1) {
        this.page--;
        this.getCustomers();
      }
    },
    nextPageCustomer() {
      this.page++;
      this.getCustomers();
    },
    async getCustomers() {
      try {
        const customers = await TradeOrders.getCustomers(
          this.limit,
          this.page,
          this.nombres,
          this.nit
        );
        this.customers = customers.data.customer;
      } catch (error) {
        console.log(error);
      }
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
          const consecutiveNumber = await TradeOrders.getNumber(id);
          this.finalNumber = consecutiveNumber.data.length + 1;
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "CONFIRMACIÓN !!!",
            subHeader: `NÚMERO ENCONTRADO `,
            message: `EL NÚMERO DE PEDIDO ES ${this.finalNumber}`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    subtotal() {
      return this.productArray.reduce(
        (total, { cantidad, valorprod, ivaprod }) => total + (valorprod - ivaprod) * cantidad,
        0
      );
    },
    valimpuesto() {
      return this.productArray.reduce(
        (total, { cantidad, valorprod, base }) => total + (valorprod - base) * cantidad,
        0
      );
    },
    total() {
      return this.productArray.reduce(
        (total, { cantidad, valorprod }) => total + cantidad * valorprod,
        0
      )
    },
  }


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