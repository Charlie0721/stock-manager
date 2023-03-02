<template>
  <ion-page>
    <ion-content>
      <ion-card>
        <ion-card-header>
          <ion-card-subtitle ></ion-card-subtitle>
          <h5 class="letter-color">{{ warehouseName }}</h5>
          <h5 class="letter-color">Fecha: {{ date }} hora:{{ hour }}</h5>
          <h5 class="letter-color">Pedido Nro. {{ numb }}</h5>

          <ion-card-title class="letter-color"
            ><h5 class="letter-color">{{ name }} {{ lastName }}</h5>
            <h5 class="letter-color">Nit/CC: {{ nit }}</h5>
          </ion-card-title>
          <vue-qr :text="numb" :size="120"></vue-qr>
        </ion-card-header>

        <ion-card-content>
          <h3 class="letter-color">PRODUCTOS:</h3>

          <ion-list v-for="product in order" :key="product.id">
            <ion-item>
              <ion-label class="box">
                <h4 class="letter-color">
                  {{ product.descripcion }}
                </h4>
                <h4 class="letter-color">Cantidad: {{ product.cantidad }}</h4>
                <ion-text color="medium">
                  <h4 class="letter-color">
                    Vr Unit: $
                    {{
                      new Intl.NumberFormat("de-DE").format(product.valorprod)
                    }}
                  </h4>
                </ion-text>
                <ion-text color="medium">
                  <h4 class="letter-color">
                    Vr Total: ${{
                      new Intl.NumberFormat("de-DE").format(
                        (totalValueProduct =
                          product.valorprod * product.cantidad)
                      )
                    }}
                  </h4>
                </ion-text>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
        <ion-card-header>
          <ion-card-title>
            <h4 class="letter-color">
              TOTAL: $ {{ new Intl.NumberFormat("de-DE").format(totalValue) }}
            </h4></ion-card-title
          ></ion-card-header
        >
      </ion-card>

      <ion-button
        color="mycolor"
        class="btn-edit-product"
        expand="full"
        @click="print()"
        v-if="state === true"
        ><ion-icon :icon="i.printOutline"></ion-icon>Imprimir
      </ion-button>
    </ion-content>
    <ion-footer collapse="fade">
      <ion-toolbar>
        <ion-title>
          <a class="letter-color" href="/trade-orders">Volver</a>
        </ion-title>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>



<script lang="ts">
import { defineComponent } from "vue";
import * as allIcons from "ionicons/icons";

import {
  IonPage,
  //IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonContent,
  IonList,
  IonLabel,
  IonText,
  IonFooter,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { TradeOrders } from "../services/tradeOrder";
import vueQr from "vue-qr/src/packages/vue-qr.vue";
//import { useIonRouter } from '@ionic/vue';
export default defineComponent({
  name: "viewOrder",

  components: {
    vueQr,
    IonPage,
    //  IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonItem,
    IonContent,
    IonList,
    IonLabel,
    IonText,
    IonFooter,
    IonButton,
    IonIcon,
  },
  data() {
    return {
      i: allIcons,
      order: [] as any,
      idalm: "" as string,
      numb: "" as string,
      name: "" as string,
      lastName: "" as string,
      totalValue: 0 as number,
      urlWebPage: "" as string,
      state: true as boolean,
      hour: "" as string,
      date: "" as string,
      nit: "" as string,
      totalValueProduct: 0 as number,
      warehouseName: "" as string,
      seller: "" as string,
    };
  },
  mounted() {
    this.getOrderByNumber();
  },
  methods: {
    print() {
      let section = document.getElementById("printDocument");
      console.log(section);
      if (!section) {
        section = document.createElement("div");
        section.id = "print";
        document.body.appendChild(section);
      }

      section.innerHTML = "";
      //section.appendChild(cloned);
      window.print();
    },
    async getOrderByNumber() {
      try {
        this.idalm = this.$route.params.idalmacen.toString();
        this.numb = this.$route.params.number.toString();
        const responseOrder = await TradeOrders.getOrderByNumberAndWarehouse(
          this.numb,
          this.idalm
        );
        this.order = responseOrder.data;

        this.name = this.order[0].nombres;
        this.lastName = this.order[0].apellidos;
        this.totalValue = this.order[0].valortotal;
        this.hour = this.order[0].hora;
        this.date = this.order[0].fecha;
        this.nit = this.order[0].nit;
        this.warehouseName=this.order[0].nomalmacen
      } catch (error) {
        console.log(error);
      }
    },
  },
});
</script>
<style scoped>
ion-button {
  background-color: var(--ion-color-mycolor);
}
.letter-color {
  color: #82230d;
  text-shadow: 1px 1px #fff;
}
.edit-image1 {
  width: 5%;
  max-height: 5%;
}
</style>