<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Crear Productos </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-button
        id="open-modal"
        expand="block"
        color="mycolor"
        class="btn-edit-product"
        @click="getLines()"
      >
        <ion-icon :icon="i.searchCircleSharp"></ion-icon>Seleccionar
        Linea</ion-button
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
            placeholder="Buscar Linea"
            @ionChange="searchOneLine($event)"
            @keypress.enter="searchLine()"
          ></ion-searchbar>

          <ion-button color="mycolor" @click="prevPage()" v-if="page > 1"
            >Anterior</ion-button
          >
          <ion-button color="mycolor" @click="nextPage()">Siguiente</ion-button>
          <span> página {{ page }} </span>
          <ion-list v-for="line in lines" :key="line.idregistro">
            <ion-item>
              <ion-label>{{ line.codigo }} {{ line.nombre }} </ion-label>
            </ion-item>

            <ion-item>
              <ion-label>
                <ion-button
                  color="mycolor"
                  class="btn-edit-product"
                  expand="full"
                  @click="
                    selectLine(
                      line.idregistro,
                      line.idnivel,
                      line.nombre,
                      line.codigo
                    )
                  "
                  >Aceptar<ion-icon :icon="i.checkmarkCircleOutline"></ion-icon>
                </ion-button>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-modal>
      <h4 class="letter-color">{{ levelCode }} {{ levelName }}</h4>
      <h4 class="letter-color" v-if="productCode != ''">
        Codigo del producto: {{ productCode }}
      </h4>

      <ion-card>
        <ion-item>
          <ion-label position="floating">Codigo de barras</ion-label>
          <ion-input
            type="text"
            :value="product.barcode"
            @input="product.barcode = $event.target.value"
          >
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-select
            placeholder="Unidad de medida"
            @ionChange="selectUnitOfMeasure = $event.target.value"
            :value="selectUnitOfMeasure"
          >
            <ion-select-option
              :value="unit.idunmedida"
              v-for="unit in unitsOfMeasure"
              :key="unit.idunmedida"
              >{{ unit.nommedida }}
            </ion-select-option>
          </ion-select>
        </ion-item>
        <ion-button
          v-if="selectUnitOfMeasure > 0"
          color="mycolor"
          class="btn-edit-product"
          expand="full"
          @click="getUnitMeasureID(selectUnitOfMeasure)"
        >
          Agregar Unidad de Medida</ion-button
        >
        <ion-item>
          <ion-label position="floating">Descripcion</ion-label>
          <ion-input
            type="text"
            :value="product.descripcion"
            @input="product.descripcion = $event.target.value"
          >
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-select
            placeholder="I.V.A Compras"
            @ionChange="taxIdPurchases = $event.target.value"
            :value="taxIdPurchases"
          >
            <ion-select-option
              :value="tax.codiva"
              v-for="tax in taxOnPurchases"
              :key="tax.codiva"
              >{{ tax.nombre }}
            </ion-select-option>
          </ion-select>
        </ion-item>
        <ion-button
          v-if="taxIdPurchases != ''"
          color="mycolor"
          class="btn-edit-product"
          expand="full"
          @click="getTaxIdPurshases(taxIdPurchases)"
        >
          Agregar Iva Compras</ion-button
        >
        <ion-item>
          <ion-label position="floating">Costo Unitario UC</ion-label>
          <ion-input
            type="number"
            :value="product.costo"
            @input="product.costo = $event.target.value"
          >
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-select
            placeholder="I.V.A Ventas Precio 1"
            @ionChange="taxIdSales = $event.target.value"
            :value="taxIdSales"
          >
            <ion-select-option
              :value="tax.codiva"
              v-for="tax in taxOnSales"
              :key="tax.codiva"
              >{{ tax.nombre }}
            </ion-select-option>
          </ion-select>
        </ion-item>
        <ion-button
          v-if="taxIdSales != ''"
          color="mycolor"
          class="btn-edit-product"
          expand="full"
          @click="getTaxIdSales(taxIdSales)"
        >
          Agregar Iva Ventas</ion-button
        >
        <ion-item>
          <ion-label position="floating">Precio de Venta</ion-label>
          <ion-input
            type="number"
            :value="product.precioventa"
            @input="product.precioventa = $event.target.value"
          >
          </ion-input>
        </ion-item>
        <ion-button
          color="mycolor"
          class="btn-edit-product"
          expand="full"
          @click="saveProduct()"
        >
          Grabar</ion-button
        >
      </ion-card>
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
} from "@ionic/vue";
import { CreateProduct } from "../services/createProducts";
import { ProductsI } from "../interfaces/CreateProducts.interface";
import * as allIcons from "ionicons/icons";
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
  },
  data() {
    return {
      product: {} as ProductsI,
      i: allIcons,
      lines: [] as any,
      taxOnPurchases: [] as any,
      taxOnSales: [] as any,
      unitsOfMeasure: [] as any,
      taxIdSales: "" as string,
      taxIdPurchases: "" as string,
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
    };
  },
  mounted() {
    this.getTaxOnPurchases();
    this.getTaxSales();
    this.getUnitOfMeasure();
  },
  methods: {
    async getProductId() {
      const responseId = await CreateProduct.getProductId();
      this.responseProductId = responseId.data;
      this.responseProductId.forEach((id) => {
        this.productId = id.ultimo_id + 1;
      });
      console.log(this.productId);
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
    saveProduct() {
      try {
        this.getProductId();
        this.product.codigo = this.productCode;
        let description = this.product.descripcion;
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
         console.log(this.product);
      } catch (error) {
        console.log(error);
      }
    },
    getTaxIdSales(codeIvaSale: string) {
      this.taxIdSales = codeIvaSale;
    },
    getTaxIdPurshases(codeIvaPursh: string) {
      this.taxIdPurchases = codeIvaPursh;
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
      idLevel: number,
      idRecord: number,
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
    getUnitMeasureID(id: number) {
      this.unitOfMeasureId = id;
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