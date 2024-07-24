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
      <ion-modal ref="modal" trigger="open-modal1" :initial-breakpoint="0.25" :breakpoints="[0, 0.25, 0.7, 0.97]">
        <ion-content class="ion-padding">
          <div class="ion-text-center">
            <h4>Crear Cliente</h4>
          </div>
          <ion-item>
            <ion-label position="stacked">NIT:</ion-label>
            <ion-input type="text" :value="saveClient.nit" @input="saveClient.nit = $event.target.value"></ion-input>
            <ion-label position="stacked">NOMBRES:</ion-label>
            <ion-input type="text" :value="saveClient.nombres"
              @input="saveClient.nombres = $event.target.value"></ion-input>
            <ion-label position="stacked">NOMBRE COMERCIAL:</ion-label>
            <ion-input type="text" :value="saveClient.nomcomercial"
              @input="saveClient.nomcomercial = $event.target.value"></ion-input>
            <ion-label position="stacked">EMAIL:</ion-label>
            <ion-input type="text" :value="saveClient.email"
              @input="saveClient.email = $event.target.value"></ion-input>
            <ion-label position="stacked">DIRECCION:</ion-label>
            <ion-input type="text" :value="saveClient.direccion"
              @input="saveClient.direccion = $event.target.value"></ion-input>
            <ion-label position="stacked">TELEFONO:</ion-label>
            <ion-input type="text" :value="saveClient.telefono"
              @input="saveClient.telefono = $event.target.value"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label>PAIS</ion-label>
            <ion-select :value="countryId" @ionChange="countryId = $event.target.value">
              <ion-select-option :value="country.idpais" v-for="country in countries" :key="country.idpais">
                {{ country.nompais }}
              </ion-select-option>
            </ion-select>
            <ion-label>DEPTO</ion-label>
            <ion-select :value="departmentId" @ionChange="departmentId = $event.target.value">
              <ion-select-option :value="department.iddepto" v-for="department in departmens" :key="department.iddepto">
                {{ department.nomdepartamento }}
              </ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label>MUNICIPIO</ion-label>
            <ion-select :value="municipalityId" @ionChange="municipalityId = $event.target.value">
              <ion-select-option :value="municipality.idmunicipio" v-for="municipality in municipalities"
                :key="municipality.idmunicipio">
                {{ municipality.nommunicipio }}
              </ion-select-option>
            </ion-select>
            <ion-label>BARRIO</ion-label>
            <ion-select :value="neighborhoodId" @ionChange="neighborhoodId = $event.target.value">
              <ion-select-option :value="neighborhood.idbarrio" v-for="neighborhood in neighborhoods"
                :key="neighborhood.idpais">
                {{ neighborhood.nombarrio }}
              </ion-select-option>
            </ion-select>
          </ion-item>
          <ion-card> <ion-item>
              <ion-label position="floating">Nombre Barrio:</ion-label>
              <ion-input type="text" :value="newNeighborhood.nombarrio"
                @input="newNeighborhood.nombarrio = $event.target.value"></ion-input>
            </ion-item>
            <ion-button color="mycolor" class="btn-edit-product" expand="full" @click="createNeighborhoods()"><ion-icon
                :icon="i.peopleCircleOutline"></ion-icon> Crear Barrio
            </ion-button>
          </ion-card>
          <ion-button color="mycolor" class="btn-edit-product" expand="full" @click="createClient()"><ion-icon
              :icon="i.saveSharp"></ion-icon> GUARDAR
            CLIENTE</ion-button>
        </ion-content>
      </ion-modal>
      <ion-button id="nested-button" color="mycolor" class="btn-edit-product" expand="full"
        @click="getCustomers()"><ion-icon :icon="i.peopleCircleOutline"></ion-icon> Seleccionar Cliente
      </ion-button>
      <ion-popover trigger="nested-button" :dismiss-on-select="false">
        <ion-card>
          <ion-searchbar animated debounce="500" placeholder="Buscar Nit" @ionChange="searchOneCustomer($event)"
            @keypress.enter="searchCustomerItem()">
          </ion-searchbar>
        </ion-card>
        <ion-card>
          <ion-searchbar animated debounce="500" placeholder="Buscar Nombres"
            @ionChange="searchOneCustomerByName($event)" @keypress.enter="searchCustomerItem()">
          </ion-searchbar>
        </ion-card>
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
              <ion-list background-hover="92949c" v-for="customer in customers" :key="customer.idtercero">
                <ion-item>
                  <ion-label> NIT: {{ customer.nit }}</ion-label>
                </ion-item>
                <ion-item> {{ customer.nombres }} {{ customer.apellidos }}</ion-item>
                <ion-button color="mycolor" @click="
                  selectCustomer(
                    customer.idtercero,
                    customer.nit,
                    customer.nombres,
                  )
                  ">Seleccionar</ion-button>
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
        <ion-card>
          <ion-card-content>
            <h3>
              CLIENTE: {{ customerNit }} {{ customerName }}
            </h3>
          </ion-card-content>
        </ion-card>
      </ion-text>
      <ion-item>
        <ion-label position="stacked">Observación:</ion-label>
        <ion-input type="text" :value="detalle" @input="detalle = $event.target.value"></ion-input></ion-item>

      <ion-card v-for="(product, index) in productArray" :key="product.idproducto">
        <ion-card-header>
          <ion-card-title>
            <h4 class="letter-color">
              {{ index + 1 }}. {{ product.descripcion }}
            </h4>
            <h5 class="letter-color" v-if="product.barcode !== null && product.barcode !== ''">
              Barcode: {{ product.barcode }}
            </h5>
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
          <h5 text="dark">Cantidad:
          </h5>
          <ion-input type="number" v-model="product.cantidad"
            @input="updateAmount(product, $event.target.value)"></ion-input>
          <h5 text="dark">Base: {{ new Intl.NumberFormat("de-DE").format(base = (product.valorprod - product.ivaprod) *
            product.cantidad) }}
          </h5>
          <h5 text="dark" v-if="product.ivaprod > 0">IVA: {{ new
            Intl.NumberFormat("de-DE").format(taxValue = (product.valorprod - product.base) * product.cantidad) }}
          </h5>

          <ion-label position="floating">% Descuento :</ion-label>
          <ion-input type="number" :value="product.porcdesc" @input="product.porcdesc = $event.target.value"><ion-button
              color="mycolor" class="btn-edit-product" @click="updateDiscount(product, product.porcdesc)"
              v-if="product.porcdesc > 0">%</ion-button></ion-input>
          <ion-label position="floating">Valor Unitario $:</ion-label>
          <ion-input type="number" :value="computedValorProd(product)"
            @input="updateValorProd(index, $event.target.value)"></ion-input>

          Total: ${{ new Intl.NumberFormat("de-DE").format(computedTotal(product)) }}

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
          <ion-text color="dark" v-if="valdescuentos > 0">
            <h3>
              DESCUENTOS: $
              {{ new Intl.NumberFormat("de-DE").format(valdescuentos) }}
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
        <ion-button color="mycolor" class="btn-edit-product" expand="full" @click="goToMoneyCollections()"><ion-icon
            :icon="i.cashSharp"></ion-icon> Recaudos</ion-button>
        <ion-modal ref="modal" trigger="open-modal" :initial-breakpoint="0.25" :breakpoints="[0, 0.25, 0.5, 0.75]">
          <ion-content class="ion-padding custom-modal-content">
            <ion-searchbar @click="$refs.modal.$el.setCurrentBreakpoint(0.75)" placeholder="Buscar Producto"
              @ionChange="searchOneProduct($event)" @keypress.enter="searchItem()"></ion-searchbar>
            <ion-input type="search" :value="searchByBarcode" @input="searchByBarcode = $event.target.value"
              placeholder="Código de barras" @keypress.enter="searchByBarcodeItem()" :clear-input="true"></ion-input>
            <ion-button color="mycolor" expand="full" class="btn-edit-product" @click="startScan()">
              Buscar Código barras</ion-button>
            <ion-button color="mycolor" expand="full" class="btn-edit-product" @click="stopScan()">
              Detener busqueda</ion-button>
            <ion-button color="mycolor" @click="prevPage()" v-if="page > 1">Anterior</ion-button>
            <ion-button color="mycolor" @click="nextPage()">Siguiente</ion-button>
            <span> página {{ page }} </span>
            <ion-list v-for="product in products" :key="product.idproduct">
              <ion-item>
                <ion-label>{{ product.codigo }} | {{ product.descripcion }}
                  <ion-label> Cantidad:{{ product.cantidad }} </ion-label>
                  <ion-label>Cod.Barras:{{ product.barcode }} </ion-label>
                  <ion-button color="mycolor" @click="selectPrice(product.precioventa)"> $
                    {{
                      new Intl.NumberFormat("de-DE").format(product.precioventa)
                    }} </ion-button>
                  <ion-button color="mycolor" @click="selectPrice(product.precioespecial1)"
                    v-if="product.precioespecial1 > 0"> $
                    {{
                      new Intl.NumberFormat("de-DE").format(product.precioespecial1)
                    }} </ion-button>
                  <ion-button color="mycolor" @click="selectPrice(product.precioespecial2)"
                    v-if="product.precioespecial2 > 0"> $
                    {{
                      new Intl.NumberFormat("de-DE").format(product.precioespecial2)
                    }}
                  </ion-button>

                  <ion-button color="mycolor" class="btn-edit-product" expand="full" @click="
                    selectProduct(
                      product.idproducto,
                      product.descripcion,
                      product.ultcosto,
                      product.codiva,
                      product.baseValue,
                      product.taxValue,
                      product.porcentaje,
                      product.barcode
                    )
                    ">
                    Agregar<ion-icon :icon="i.checkmarkCircleOutline"></ion-icon>
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
import { ItradeOrderDetail, ItradeOrderHeader } from "@/interfaces/traderOrder.interface";
import { IcreateClient, INeighborhoodsInterface } from "@/interfaces/createClient.interface";
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
  IonSelectOption,
  IonSelect,
} from "@ionic/vue";
import router from "@/router";
import { StockManagerParamsService } from "@/services/stock_manager_params.service";
const stockManagerParamsService = new StockManagerParamsService();
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
    IonSelectOption,
    IonSelect,
  },
  data() {
    return {
      i: allIcons,
      countryId: 0 as number | undefined,
      departmentId: 0 as number | undefined,
      municipalityId: 0 as number | undefined,
      neighborhoodId: 0 as number,
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
      taxValue: 0 as number,
      finalPrice: 0 as number,
      discount: 0 as number,
      discountPercentage: 0 as number,
      countries: [] as any,
      municipalities: [] as any,
      departmens: [] as any,
      neighborhoods: [] as any,
      newNeighborhood: {} as INeighborhoodsInterface,
      lastname: "" as string
    };
  },
  mounted() {
    this.getEmployee();
    this.getDate();
    this.getCountries();
    this.getDepartments();
    this.getMunicipalities();
    this.getNeighborhoods();
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
    async getNeighborhoods() {
      const responseNeighborhoods = await TradeOrders.getAllNeighborhoods();
      this.neighborhoods = responseNeighborhoods.data
    },
    async getMunicipalities() {
      const responseMunicipalities = await TradeOrders.getAllMunicipalities()
      this.municipalities = responseMunicipalities.data
    },
    async getDepartments() {

      const responseDepartments = await TradeOrders.getAlldepartments()
      this.departmens = responseDepartments.data
    },
    async getCountries() {
      const responseCountries = await TradeOrders.getAllCountries()
      this.countries = responseCountries.data;

    },
    async startScan() {
      try {
        this.didUserGrantPermission();
        document.body.style.opacity = "0.2";
        document.body.style.background = "transparent";

        BarcodeScanner.hideBackground();

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
    async createNeighborhoods() {
      this.newNeighborhood.idmunicipio = this.municipalityId
      this.newNeighborhood.codzona = 0
      let name = this.newNeighborhood.nombarrio.toUpperCase();
      this.newNeighborhood.nombarrio = name;
      const newNeighborhood = await TradeOrders.createNeighborhoods(this.newNeighborhood)
      this.neighborhoodId = newNeighborhood.data.insertId
      setTimeout(() => {
        this.getNeighborhoods()
        console.log(this.neighborhoodId);
      }, 1500)
      this.newNeighborhood.nombarrio = '';
    },

    async createClient() {
      try {
        let nit = this.saveClient.nit;
        this.saveClient.nit = nit;
        let name = this.saveClient.nombres;
        let phone = this.saveClient.telefono;
        let tradename = this.saveClient.nomcomercial;
        let email = this.saveClient.email ? this.saveClient.email : "";
        this.saveClient.telefono = phone;
        this.saveClient.nombres = name.toUpperCase();
        this.saveClient.apellidos = this.lastname ? this.lastname : ""
        this.saveClient.nomcomercial = tradename ? tradename.toUpperCase() : "";
        let address = this.saveClient.direccion;
        this.saveClient.direccion = address.toUpperCase();
        this.saveClient.email = email;
        this.saveClient.cliente = 1;
        this.saveClient.tipopersona = 1;
        this.saveClient.idregimen = 2;
        this.saveClient.tipofactura = 1;
        this.saveClient.TipoId = 13;
        this.saveClient.idpais = this.countryId ? this.countryId : 1;
        this.saveClient.iddepto = this.departmentId ? this.departmentId : 1;
        this.saveClient.idmunicipio = this.municipalityId ? this.municipalityId : 151;
        this.saveClient.idbarrio = this.neighborhoodId ? this.neighborhood : 1;

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
          if (newClient.data.message === '¡Customer already exist!') {
            const alert = await alertController.create({
              cssClass: "my-custom-class",
              header: "ATENCION !!!",
              message: `Cliente ya existe en la base de datos`,
              buttons: ["ACEPTAR"],
            });
            await alert.present();
            return false;
          }

          let customerId = newClient.data.data[0].insertId
          this.selectCustomer(customerId, this.saveClient.nit, this.saveClient.nombres, this.saveClient.apellidos)

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
      const producto = this.productArray.find((r) => r.idproducto === idproducto);
      if (producto) {
        if (producto.cantidad > 1) {
          producto.cantidad--;
          this.recalcularDescuentos();
        } else {
          this.deleteProduct(producto.idproducto);
        }
      }
    },
    async getNumbers(id: number): Promise<number> {
      try {
        if (id === 0) {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "ATENCIÓN !!!",
            subHeader: `NO PASA VALIDACIÓN `,
            message: `DEBE SELECCIONAR ALMACÉN`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
        } else {
          const consecutiveNumber = await TradeOrders.getNumber(id);
          this.finalNumber = consecutiveNumber + 1;
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "CONFIRMACIÓN !!!",
            subHeader: `NÚMERO ENCONTRADO `,
            message: `EL NÚMERO DE PEDIDO ES ${this.finalNumber}`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
          return this.finalNumber;
        }
      } catch (error) {
        console.log(error);
      }
      return 0;
    },
    async saveCompleteTradeOrder() {
      try {
        let uuid = localStorage.getItem("uuid");
        const responseParams = await stockManagerParamsService.findOne(uuid);

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
          if (this.idtercero === 0) {
            this.idtercero = responseParams.data.Id_Cliente
            this.saveTradeOrder.idtercero = this.idtercero;
          } else {
            this.saveTradeOrder.idtercero = this.idtercero;
          }

          if (this.idvendedor === 0) {
            this.idvendedor = responseParams.data.Id_Vendedor
            this.saveTradeOrder.idvendedor = this.idvendedor;
          } else {
            this.saveTradeOrder.idvendedor = this.idvendedor;
          }

          const number = await this.getNumbers(this.idalmacen);
          this.saveTradeOrder.numero = number;
          this.saveTradeOrder.fecha = this.date;
          this.saveTradeOrder.subtotal = this.subtotal;
          this.saveTradeOrder.valortotal = this.total;
          this.saveTradeOrder.valimpuesto = this.valimpuesto;
          this.saveTradeOrder.valiva = this.valimpuesto;
          this.saveTradeOrder.valdescuentos = this.valdescuentos;
          this.saveTradeOrder.valretenciones = 0;
          this.saveTradeOrder.idalmacen = this.idalmacen;
          this.saveTradeOrder.estado = 0;
          this.saveTradeOrder.idsoftware = 2;
          this.saveTradeOrder.detalle = this.detalle ? this.detalle : "Pedido desde app movil";
          this.saveTradeOrder.fechacrea = this.date;
          this.saveTradeOrder.fechavenc = this.date;
          this.saveTradeOrder.hora = this.currentTime;
          this.saveTradeOrder.plazo = this.plazo;

          const finalProduct = this.productArray.map((product) => ({
            ...product,
            idpedido: this.idTradeOrder,
          }));

          this.saveTradeOrder.detpedidos = finalProduct;


          const saveOrder1 = await TradeOrders.saveOrder(this.saveTradeOrder);

          if (saveOrder1.id) {
            const idpedido = saveOrder1.id;
            this.idTradeOrder = idpedido;
            this.viewOrder(this.idalmacen, this.finalNumber);
          } else {
            const errorMessage = saveOrder1.message || 'Error desconocido';
            console.error(errorMessage);

            const alert = await alertController.create({
              cssClass: "my-custom-class",
              header: "ERROR !!!",
              subHeader: `Error al generar el pedido`,
              message: errorMessage,
              buttons: ["ACEPTAR"],
            });
            await alert.present();
          }
        }
      } catch (error) {
        console.log(error);
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "ERROR !!!",
          subHeader: `${error} `,
          message: `${error.message} `,
          buttons: ["ACEPTAR"],
        });
        await alert.present();
      }
    }
    ,
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

          this.recalcularDescuentos();
        }
      } catch (error) {
        console.log(error);
      }
    },

    selectPrice(price: number) {
      this.finalPrice = price;
    },
    async updateDiscount(product: ItradeOrderDetail, discountPercentage: number) {
      let discount = Number(discountPercentage)
      if (discount < 0 || discount > 100) {
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "ERROR !!!",
          subHeader: "No valido",
          message: `El descuento no puede se superio a 100% o menor a 0 `,
          buttons: ["ACEPTAR"],
        });
        await alert.present();
        return
      }
      this.valdescuentos -= product.descuento;
      product.porcdesc = discount;
      this.discount = (product.porcdesc / 100) * product.valorprod;
      product.descuento = this.discount;
      this.valdescuentos += product.descuento;
      this.recalcularPropiedadesComputadas();
    },
    async selectProduct(
      idproducto: number,
      descripcion: string,
      costoprod: number,
      codiva: string,
      baseValue: number,
      taxValue: number,
      porcentaje: number,
      barcode: string
    ) {
      try {
        this.selectPrice(this.finalPrice)
        if (this.finalPrice === 0) {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "ATENCIÓN !!!",
            subHeader: `NO PASA VALIDACIÓN `,
            message: `DEBE SELECCIONAR PRECIO`,
            buttons: ["ACEPTAR"],
          });
          await alert.present();
          return
        }
        const product = {
          idproducto: idproducto,
          descripcion: descripcion,
          valorprod: this.finalPrice,
          costoprod: costoprod,
          codiva: codiva,
          cantidad: 1,
          despachado: this.despachado,
          descuento: this.discount,
          porcdesc: 0,
          base: baseValue,
          ivaprod: taxValue,
          porciva: porcentaje,
          barcode
        };
        this.productArray.push(product);
        this.searchByBarcode = "";
        this.finalPrice = 0;
      } catch (error) {
        console.log(error);
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "ATENCIÓN !!!",
          subHeader: `${error} `,
          message: `Error ${error.message}`,
          buttons: ["ACEPTAR"],
        });
        await alert.present();
      }
    },
    addAmount(idproducto: number) {
      const producto = this.productArray.find((r) => r.idproducto === idproducto);
      if (producto) {
        producto.cantidad++;
        this.recalcularDescuentos();
      }
    },
    recalcularDescuentos() {
      this.valdescuentos = this.productArray.reduce(
        (total, { cantidad, descuento }) => total + (descuento * cantidad), 0
      );
    },
    updateValorProd(index, newValue) {
      const newPrice = parseFloat(newValue);

      if (!isNaN(newPrice)) {
        this.productArray[index].valorprod = newPrice;

        this.recalcularPropiedadesComputadas();
      }
    },

    recalcularPropiedadesComputadas() {
      this.subtotal;
      this.valimpuesto;
      this.total;
      this.valdescuentos
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
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "ATENCIÓN !!!",
          subHeader: `${error} `,
          message: `Error ${error.message}`,
          buttons: ["ACEPTAR"],
        });
        await alert.present();
      }
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
      }, 10000);
    },
    async getProducts() {
      try {

        let uuid = localStorage.getItem("uuid");
        const responseParams = await stockManagerParamsService.findOne(uuid);
        this.idalmacen = responseParams.data.Id_Almacen

        console.log(this.idalmacen);

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
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "ATENCIÓN !!!",
          subHeader: `${error} `,
          message: `Error ${error.message}`,
          buttons: ["ACEPTAR"],
        });
        await alert.present();
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
    async searchOneCustomerByName(event: any) {
      try {
        this.searhCustomer = event.detail.value;
        this.nombres = this.searhCustomer.toUpperCase();

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
    async searchCustomerNombres() {
      await this.getCustomers(this.name);
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
    updateAmount(product, newValue) {
      const newQuantity = parseInt(newValue);
      if (!isNaN(newQuantity) && newQuantity > 0) {
        product.cantidad = newQuantity;
        this.recalcularDescuentos();
      }
    },
    goToMoneyCollections() {
      router.push(`/money-collections`)
    }

  },
  computed: {
    subtotal() {
      return this.productArray.reduce(
        (total, { cantidad, valorprod, ivaprod, descuento }) => total + (valorprod - ivaprod - descuento) * cantidad,
        0
      );
    },
    valimpuesto() {
      return this.productArray.reduce(
        (total, { cantidad, valorprod, base, }) => total + (valorprod - base) * cantidad,
        0
      );
    },
    total() {
      return this.productArray.reduce(
        (total, { cantidad, valorprod, descuento }) => total + (valorprod - descuento) * cantidad,
        0
      )
    },
    valdescuentos() {
      return this.productArray.reduce(
        (total, { cantidad, descuento }) => total + (descuento * cantidad), 0
      );
    },
    computedValorProd(product) {
      return (product) => product.valorprod - (product.valorprod * product.porcdesc / 100);
    },
    computedTotal() {
      return (product) => product.cantidad * this.computedValorProd(product);
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
  border-radius: 30px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  font-weight: bold;
  font-size: 1rem;
  margin: 5px;
}

ion-button:hover {
  transform: scale(1.05);
}

ion-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

ion-header {
  padding: 10px;
}

ion-card {
  border: 0.5px solid #ccc;
  border-radius: 10px;
  margin: 10px 0;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

ion-card-title {
  font-size: 1.2rem;
}

ion-title {
  font-size: 1.2rem;
  margin: 0;
  text-align: center;
}

ion-text {
  font-size: 1rem;
}

h3 {
  margin: 5px 0;
}

h4 {
  margin: 0;
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