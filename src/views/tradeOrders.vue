<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <img class="edit-image1" src="../images/images_app/logo_header.png" />
          Pedido Comercial
          <!-- <img
            class="edit-image"
            src="../images/images_app/shopping_cart.png"
            @click="viewOrder(idalmacen, finalNumber)"
          /> -->
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
          <ion-list>
            <ion-label>
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
                <ion-item :button="true" :detail="false">
                  NIT: {{ customer.nit }}. {{ customer.nombres }}
                </ion-item></ion-list
              ></ion-label
            >
          </ion-list>
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
          @click="getProducts(idalmacen)"
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
                  | Cantidad: {{ product.cantidad }}
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
          ><ion-icon :icon="i.refreshCircleSharp"></ion-icon> Nuevo Pedido
        </ion-button>
      </ion-content>
    </ion-content>
  </ion-page>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import * as allIcons from "ionicons/icons";
import { tradeOrders } from "@/services/tradeOrder";
import {
  ItradeOrderDetail,
  ItradeOrderHeader,
} from "@/interfaces/traderOrder.interface";
import { IcreateClient } from "@/interfaces/createClient.interface";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCardSubtitle,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonLabel,
  IonSelectOption,
  IonSelect,
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
    IonFab,
    IonFabButton,
    IonCardSubtitle,
    IonFabList,
    IonIcon,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonLabel,
    IonSelectOption,
    IonSelect,
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
      idalmacen: 0 as number,
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
    };
  },
  mounted() {
    this.getWarehouses();
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
          const newClient = await tradeOrders.saveClientToOrder(
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

    //     async getId() {
    //       try {
    //         const idTrade = await tradeOrders.getIdTradeOrder();
    //         this.idTradeOrder = idTrade.data.length + 1;
    //         console.log(this.idTradeOrder);
    //       } catch (error) {
    //         console.log(error);
    //       }
    //  },
    async saveCompleteTradeOrder() {
      try {
        if (this.idalmacen === 0 || this.SelectIdalmacen == 0) {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "ATENCION !!!",
            subHeader: `NO PASA VALIDACION `,
            message: `DEBE SELECCIONAR ALMACEN`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
        }
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
          this.saveTradeOrder.hora=this.currentTime
          this.saveTradeOrder.plazo = this.plazo;
          console.log(this.currentTime)
          const idTrade = await tradeOrders.getIdTradeOrder();
          this.idTradeOrder = idTrade.data.length + 1;
          console.log(this.idTradeOrder);
          const finalProduct = this.productArray;
          finalProduct.forEach((product) => {
            const newProducts = finalProduct.find(
              (item) => item.idproducto === product.idproducto
            );
            newProducts.idpedido = this.idTradeOrder;
            console.log(newProducts);
          });

          this.saveTradeOrder.detpedidos = finalProduct;

          console.trace(this.saveTradeOrder);
          const saveOrder1 = await tradeOrders.saveOrder(this.saveTradeOrder);
          console.log(saveOrder1);
        }
        //  console.log(`${this.idTradeOrder}`);
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
    async getProducts(id: number) {
      try {
        id = this.idalmacen;
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
          const getProduct = await tradeOrders.getProducts(id);

          this.products = getProduct.data;
        }
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
      this.currentTime=`${hour}:${minutes}:${seconds}`;
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
      const employees = await tradeOrders.getEmployee();
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
        const customers = await tradeOrders.getCustomers();
        this.customers = customers.data.customer;
      } catch (error) {
        console.log(error);
      }
    },
    async getWarehouses() {
      try {
        const warehouses = await tradeOrders.getWarehouse();
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
          const consecutiveNumber = await tradeOrders.getNumber(id);
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
</style>