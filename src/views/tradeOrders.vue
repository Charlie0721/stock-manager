<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <img class="edit-image1" src="../images/images_app/logo_header.png" />
          Pedido Comercial

          <ion-button
            color="mycolor"
            class="btn-edit-product"
            @click="newOrder()"
            ><ion-icon :icon="i.refreshCircleSharp"></ion-icon> Nuevo Pedido
          </ion-button>
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-button
        id="open-modal1"
        expand="block"
        color="mycolor"
        class="btn-edit-product"
      >
        <ion-icon :icon="i.personAddOutline"></ion-icon>Crear
        Cliente</ion-button
      >
      <ion-modal
        ref="modal"
        trigger="open-modal1"
        :initial-breakpoint="0.25"
        :breakpoints="[0, 0.25, 0.5, 0.75]"
      >
        <ion-content class="ion-padding">
          <div class="ion-text-center">
            <h4>Crear Cliente</h4>
          </div>
          <ion-item>
            <ion-label position="floating">NIT:</ion-label>
            <ion-input
              type="text"
              :value="saveClient.nit"
              @input="saveClient.nit = $event.target.value"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">NOMBRES:</ion-label>
            <ion-input
              type="text"
              :value="saveClient.nombres"
              @input="saveClient.nombres = $event.target.value"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">DIRECCION:</ion-label>
            <ion-input
              type="text"
              :value="saveClient.direccion"
              @input="saveClient.direccion = $event.target.value"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">TELEFONO:</ion-label>
            <ion-input
              type="text"
              :value="saveClient.telefono"
              @input="saveClient.telefono = $event.target.value"
            ></ion-input>
          </ion-item>
          <ion-button
            color="mycolor"
            class="btn-edit-product"
            expand="full"
            @click="createClient()"
            ><ion-icon :icon="i.saveSharp"></ion-icon> GUARDAR
            CLIENTE</ion-button
          >
        </ion-content>
      </ion-modal>
      <ion-button
        id="nested-button"
        color="mycolor"
        class="btn-edit-product"
        expand="full"
        @click="getCustomers()"
        ><ion-icon :icon="i.peopleCircleOutline"></ion-icon> Seleccionar Cliente
      </ion-button>
      <ion-popover trigger="nested-button" :dismiss-on-select="false">
        <ion-searchbar
          animated
          debounce="500"
          placeholder="Buscar cliente"
          @ionChange="searchOneCustomer($event)"
        >
        </ion-searchbar>
        <ion-content>
          <ion-card>
            <ion-card-header>
              <ion-card-title>Seleccionar Cliente</ion-card-title>
              <ion-card-subtitle>Click sobre el cliente</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <ion-list
                background-hover="92949c"
                v-for="customer in customers"
                :key="customer.idtercero"
                @click="
                  selectCustomer(
                    customer.idtercero,
                    customer.nit,
                    customer.nombres
                  )
                "
              >
                <ion-item>
                  <ion-label> NIT: {{ customer.nit }}</ion-label>
                </ion-item>
                <ion-item> {{ customer.nombres }} </ion-item>
              </ion-list>
            </ion-card-content>
          </ion-card>
        </ion-content>
      </ion-popover>
      <ion-button
        id="nested-button1"
        expand="full"
        color="mycolor"
        class="btn-edit-product"
        ><ion-icon :icon="i.personCircleOutline"></ion-icon>Seleccionar Vendedor
      </ion-button>
      <ion-popover trigger="nested-button1" :dismiss-on-select="false">
        <ion-searchbar
          animated
          debounce="500"
          placeholder="Buscar empleado"
          @ionChange="searchOneEmployee($event)"
        >
        </ion-searchbar>
        <ion-content>
          <ion-list>
            <ion-label>
              <ion-list
                background-hover="92949c"
                v-for="employee in employees"
                :key="employee.idtercero"
                @click="
                  selectEmployee(
                    employee.idtercero,
                    employee.nit,
                    employee.nombres
                  )
                "
              >
                <ion-item :button="true" :detail="false">
                  NIT: {{ employee.nit }}. {{ employee.nombres }}
                </ion-item></ion-list
              ></ion-label
            >
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
          </ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <h5 text="dark">Cantidad: {{ product.cantidad }}</h5>
          <h2 text="dark">
            Valor Unitario $
            {{ new Intl.NumberFormat("de-DE").format(product.valorprod) }} Valor
            Total: $
            {{
              new Intl.NumberFormat("de-DE").format(
                (TotalProduct = product.valorprod * product.cantidad)
              )
            }}
          </h2>
        </ion-card-content>
      </ion-card>

      <ion-text color="dark" v-if="addTotals">
        <h1>
          TOTAL: $
          {{ new Intl.NumberFormat("de-DE").format(addTotals) }}
        </h1>
      </ion-text>

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
          @click="saveCompleteTradeOrder()"
          ><ion-icon :icon="i.saveSharp"></ion-icon> Grabar Pedido</ion-button
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
            <ion-input
              type="text"
              :value="searchByBarcode"
              @input="searchByBarcode = $event.target.value"
              placeholder="Código de barras"
              @ionChange="searchBarcode($event)"
              :clear-input="true"
            ></ion-input>
            <ion-button
              color="mycolor"
              expand="full"
              class="btn-edit-product"
              @click="startScan()"
            >
              Buscar Código barras</ion-button
            >
            <ion-list v-for="product in products" :key="product.idproduct">
              <ion-item>
                <ion-label
                  >{{ product.codigo }} | {{ product.descripcion }}
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  $
                  {{
                    new Intl.NumberFormat("de-DE").format(product.precioventa)
                  }}
                 
                  <ion-button
                    color="mycolor"
                    class="btn-edit-product"
                    expand="full"
                    @click="
                      selectProduct(
                        product.idproducto,
                        product.descripcion,
                        product.precioventa,
                        product.ultcosto,
                        product.codiva
                      )
                    "
                    >Agregar<ion-icon
                      :icon="i.checkmarkCircleOutline"
                    ></ion-icon>
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
  IonListHeader,
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
    // ExploreContainer,
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
    // IonListHeader,
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
      addTotals: 0 as number,
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

    addAmount(idproducto: number) {
      const producto = this.productArray.filter((r) => {
        return r.idproducto === idproducto;
      })[0];
      if (producto) {
        producto.cantidad++;
        this.finalAmount = producto.cantidad;
        this.addTotals = this.productArray.reduce(
          (total, { cantidad, valorprod }) => total + cantidad * valorprod,
          0
        );
      }
    },

    subtractAmount(idproducto: number) {
      const producto = this.productArray.filter((r) => {
        return r.idproducto === idproducto;
      })[0];
      if (producto) {
        producto.cantidad--;
        this.finalAmount = producto.cantidad;
        this.addTotals = this.productArray.reduce(
          (total, { cantidad, valorprod }) => total + cantidad * valorprod,
          0
        );
      }
    },

    async saveCompleteTradeOrder() {
      try {
        if (this.idvendedor === 0) {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "ATENCION !!!",
            subHeader: `NO PASA VALIDACION `,
            message: `DEBE SELECCIONAR VENDEDOR`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
          return false;
        }
        if (this.idtercero === 0) {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "ATENCION !!!",
            subHeader: `NO PASA VALIDACION `,
            message: `DEBE SELECCIONAR CLIENTE`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
          return false;
        }

        if (this.addTotals === 0 || this.addTotals < 0) {
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
          await this.getNumbers();
          this.saveTradeOrder.numero = this.finalNumber;
          this.saveTradeOrder.fecha = this.date;
          this.saveTradeOrder.subtotal = this.addTotals;
          this.saveTradeOrder.valortotal = this.addTotals;
          this.saveTradeOrder.valdescuentos = 0;
          this.saveTradeOrder.valretenciones = 0;
          this.saveTradeOrder.idalmacen = this.idalmacen;
          this.saveTradeOrder.estado = 3;
          this.saveTradeOrder.idtercero = this.idtercero;
          this.saveTradeOrder.idvendedor = this.idvendedor;
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
          console.log(saveOrder1);
        }
        this.viewOrder(this.idalmacen, this.finalNumber);
      } catch (error) {
        console.log(error);
      }
    },

    deleteProduct(id: number) {
      try {
        this.productArray.forEach((p: any) => {
          if (p.idproducto === id) {
            this.addTotals -= p.valorprod;
            this.productArray.splice(p, 1);
          }
          console.log(this.productArray);
        });
      } catch (error) {
        console.log(error);
      }
    },

    async selectProduct(
      idproducto: number,
      descripcion: string,
      precioventa: number,
      costoprod: number,
      codiva: string
    ) {
      try {
        const product = [
          {
            idproducto: idproducto,
            descripcion: descripcion,
            valorprod: precioventa,
            costoprod: costoprod,
            codiva: codiva,
            cantidad: this.finalAmount,
            despachado: this.despachado,
            descuento: this.descuentoProd,
          },
        ];
        const productFinal = JSON.stringify(product);
        const finalProductParsed = JSON.parse(productFinal);

        finalProductParsed.forEach((product: any) => {
          this.productArray.push(product);
        });
        this.searchByBarcode = "";
      } catch (error) {
        console.log(error);
      }
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
    async searchBarcode(e: any) {
      try {
        this.searchByBarcode = e.detail.value;
        this.searchByBarcode = this.searchByBarcode.toUpperCase();
        if (this.searchByBarcode === "") {
          return await this.getProducts(this.idalmacen);
        }
        if (this.searchByBarcode && this.searchByBarcode.trim() != "") {
          this.products = this.products.filter((product: any) => {
            return product.barcode.indexOf(this.searchByBarcode) > -1;
          });
        }
      } catch (error) {
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "ERROR !!!",
          subHeader: `${error.message} `,
          message: `Error: ${error.message}`,
          buttons: ["ACEPTAR"],
        });
        await alert.present();
      }
    },
    async getProducts() {
      try {

        let idAlm = localStorage.getItem("idAlmacen");
        this.idalmacen = JSON.parse(idAlm);
        const response=await TradeOrders.getProducts(this.idalmacen)
        this.products = response.data
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
        this.searhCustomer = this.searhCustomer.toUpperCase();
        if (this.searhCustomer === "") {
          return await this.getCustomers();
        }
        if (this.searhCustomer && this.searhCustomer.trim() != "") {
          this.customers = this.customers.filter((customer: any) => {
            return (
              customer.nombres.toUpperCase().indexOf(this.searhCustomer) > -1 ||
              customer.nit.indexOf(this.searhCustomer) > -1
            );
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getCustomers() {
      try {
        const customers = await TradeOrders.getCustomers();
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