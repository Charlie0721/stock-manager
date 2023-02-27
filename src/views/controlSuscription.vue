<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="letter-color">
          <img class="edit-image1" src="../images/images_app/logo_header.png" />
          Mensaje
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <h1 class="letter-color">Fin de la suscripción</h1>

      <h3 class="letter-color">
        Pongase en contacto con el departamento técnico de Conexion POS
      </h3>

      <ion-button
        expand="full"
        color="mycolor"
        class="btn-edit-product"
        @click="newOrder()"
        ><ion-icon :icon="i.arrowForwardOutline"></ion-icon> Continuar con la suscripción
      </ion-button>
    </ion-content>
  </ion-page>
</template>



<script lang="ts">
import { defineComponent } from "vue";
import { ControlTime } from "../services/controlTime";
import * as allIcons from "ionicons/icons";
import {
  IonPage,
  alertController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
} from "@ionic/vue";
export default defineComponent({
  name: "Tab1Page",
  components: {
    IonButton,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
  },

  data() {
    return {
      i: allIcons,
      mesagge: "" as string,
    };
  },
  mounted() {
    this.sendMessage();
  },
  methods: {
    async sendMessage() {
      const response = await ControlTime.controlTime();
      this.message = response.data.message;

      if (this.message === "Ha finalizado la suscripción") {
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "Atención !!! ",
          message: `Finalizo el tiempo de suscripción  a la aplicación... pongase en contacto con el departamento de soporte técnico de Conexion POS`,
          buttons: ["ACEPTAR"],
        });
        await alert.present();
      }
      if (this.message === "continua con la suscripción") {
        this.$router.push("/warehouse-for-orders");
      }
    },
    newOrder() {
      location.reload();
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

