<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="letter-color">
          <img class="edit-image1" src="../images/images_app/logo_header.png" />
          Pedido Comercial número {{ numb }}</ion-title
        >
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-card>
        <ion-card-header>
          <ion-card-subtitle class="letter-color"></ion-card-subtitle>
          <h2 class="letter-color">Pedido número {{ numb }}</h2>

          <ion-card-title class="letter-color"
            >CLIENTE: {{ name }} {{ lastName }}</ion-card-title
          >
          <vue-qr :text="numb" :size="120"></vue-qr>
        </ion-card-header>

        <ion-card-content>
          <h2 class="letter-color">PRODUCTOS:</h2>

          <ion-list v-for="product in order" :key="product.id">
            <ion-item>
              <ion-label>
                <h2 class="letter-color">
                  {{ product.descripcion }}
                </h2>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label>
                <h3 class="letter-color">Cantidad: {{ product.cantidad }}</h3>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label
                ><ion-text color="medium">
                  <h3 class="letter-color">
                    Precio: $
                    {{
                      new Intl.NumberFormat("de-DE").format(product.valorprod)
                    }}
                  </h3>
                </ion-text></ion-label
              >
            </ion-item>
          </ion-list>
        </ion-card-content>
        <ion-card-header>
          <ion-card-title>
            <h3 class="letter-color">
              TOTAL: $ {{ new Intl.NumberFormat("de-DE").format(totalValue) }}
            </h3></ion-card-title
          ></ion-card-header
        >
      </ion-card>
    </ion-content>
    <ion-footer collapse="fade">
      <ion-toolbar>
        <ion-title>
          <!-- <ion-router-link color="secondary" href="/trade-orders">Volver</ion-router-link> -->
          <!-- <ion-button expand="full" color="mycolor" @click="returnOrder()"
            ><ion-icon :icon="i.arrowBackSharp"></ion-icon>Volver
          </ion-button> -->
          <!-- <ion-button router-link="/trade-orders" router-direction="back" >Volver</ion-button> -->
          <a class="letter-color" href="/trade-orders">Volver</a>
          </ion-title
        >
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>



<script lang="ts">
import { defineComponent } from "vue";
import * as allIcons from "ionicons/icons";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonButton,
  IonContent,
  IonList,
  IonLabel,
  IonText,
  IonFooter,
 
} from "@ionic/vue";
import { tradeOrders } from "../services/tradeOrder";
import vueQr from "vue-qr/src/packages/vue-qr.vue";
//import { useIonRouter } from '@ionic/vue';
export default defineComponent({
  name: "viewOrder",

  components: {
    vueQr,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
   // IonIcon,
    IonItem,
   // IonButton,
    IonContent,
    IonList,
    IonLabel,
    IonText,
    IonFooter,
   
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
    };
  },
  mounted() {
    this.getOrderByNumber();
  },
  methods: {
    // returnOrder() {
    //   //this.$router.push("/trade-orders");
    //   const ionRouter = useIonRouter();
    //   ionRouter.navigate('/trade-orders', 'forward', 'replace')
    // },

    async getOrderByNumber() {
      try {
        this.idalm = this.$route.params.idalmacen.toString();
        this.numb = this.$route.params.number.toString();
        const responseOrder = await tradeOrders.getOrderByNumberAndWarehouse(
          this.numb,
          this.idalm
        );
        this.order = responseOrder.data;

        this.name = this.order[0].nombres;
        this.lastName = this.order[0].apellidos;
        this.totalValue = this.order[0].valortotal;
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