<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Conectarse a la API </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card class="login-card">
        <ion-card-header>
          <ion-card-title>Ingresar IP del servidor </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-item class="input-item">
            <ion-label position="floating">Http:</ion-label>
            <ion-input
              type="text"
              :value="dataConnections.header"
              disabled
            ></ion-input>
          </ion-item>
          <ion-item class="input-item">
            <ion-label position="floating">Primer Octeto</ion-label>
            <ion-input
              type="number"
              :min="1"
              :max="999"
              :value="dataConnections.iP1"
              @input="dataConnections.iP1 = $event.target.value"
            ></ion-input>
          </ion-item>
          <ion-item class="input-item">
            <ion-label position="floating">punto separador</ion-label>
            <ion-input
              type="text"
              :value="dataConnections.pointOne"
              disabled
            ></ion-input
          ></ion-item>

          <ion-item class="input-item">
            <ion-label position="floating">Segundo Octeto</ion-label>
            <ion-input
              type="number"
              :min="1"
              :max="999"
              :value="dataConnections.iP2"
              @input="dataConnections.iP2 = $event.target.value"
            ></ion-input>
          </ion-item>
          <ion-item class="input-item">
            <ion-label position="floating">punto separador</ion-label>
            <ion-input
              type="text"
              :min="1"
              :max="999"
              :value="dataConnections.pointTwo"
              disabled
            ></ion-input>
          </ion-item>
          <ion-item class="input-item">
            <ion-label position="floating">Tercer Octeto</ion-label>
            <ion-input
              type="number"
              :min="1"
              :max="999"
              :value="dataConnections.iP3"
              @input="dataConnections.iP3 = $event.target.value"
            ></ion-input>
          </ion-item>
          <ion-item class="input-item">
            <ion-label position="floating">punto separador</ion-label>
            <ion-input
              type="text"
              :min="1"
              :max="999"
              :value="dataConnections.pointThree"
              disabled
            ></ion-input>
          </ion-item>
          <ion-item class="input-item">
            <ion-label position="floating">Cuarto Octeto</ion-label>
            <ion-input
              type="number"
              :min="1"
              :max="999"
              :value="dataConnections.iP4"
              @input="dataConnections.iP4 = $event.target.value"
            ></ion-input>
          </ion-item>
          <ion-item class="input-item">
            <ion-input
              type="text"
              :min="1"
              :max="999"
              :value="dataConnections.twoPoints"
              disabled
            ></ion-input>
          </ion-item>
          <ion-item class="input-item">
            <ion-label position="floating">Puerto</ion-label>
            <ion-input
              type="number"
              :value="dataConnections.port"
              disabled
            ></ion-input>
          </ion-item>
          <ion-button color="mycolor" expand="full" @click="sendConnections()"
            >Conectar</ion-button
          >
        </ion-card-content>
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
  alertController,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
  IonLabel,
  IonButton,
  IonInput,
  IonItem,
  
} from "@ionic/vue";
import { urlAPiI } from "@/interfaces/connectioApi.interface";
import axios from "axios";
export default defineComponent({
  name: "Tab1Page",
  components: {
    // ExploreContainer,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonCard,
    IonCardTitle,
    IonCardHeader,
    IonCardContent,
    IonLabel,
    IonButton,
    IonInput,
    IonItem,
  },
  data() {
    return {
      dataConnections: {} as urlAPiI,
    };
  },
  mounted() {
    this.getConnectionstoApi();
  },

  methods: {
    async sendConnections() {
      this.dataConnections.header = "http://";
      const iP1 = this.dataConnections.iP1;
      this.dataConnections.pointOne = ".";
      const iP2 = this.dataConnections.iP2;
      this.dataConnections.pointTwo = ".";
      const iP3 = this.dataConnections.iP3;
      this.dataConnections.pointThree = ".";
      const iP4 = this.dataConnections.iP4;
      this.dataConnections.twoPoints = ":";
      this.dataConnections.port = "4000";
      const api1 = `${this.dataConnections.header}${iP1}${this.dataConnections.pointOne}${iP2}${this.dataConnections.pointTwo}${iP3}${this.dataConnections.pointThree}${iP4}${this.dataConnections.twoPoints}${this.dataConnections.port}`;
      await axios
        .post(`${api1}/connect-api`, this.dataConnections)
        .then((data) => {
          console.log(data.data);

          localStorage.setItem("connection", JSON.stringify(api1));

          this.getConnectionstoApi();
        })
        .catch(async (err) =>{
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "Error !!!",
            subHeader: `${err}`,
            message: `${err.message}`,
            buttons: ["OK"],
          });
          await alert.present(); 
          console.log(err)
        } );
    },
 async   getConnectionstoApi() {
      if (localStorage.getItem("connection")) {
        const conn = localStorage.getItem("connection");
      
     
        if (typeof conn == "string") {
          let connection = JSON.parse(conn);
          console.log(connection);
        }
        this.$router.push("/control-suscription");
      } else {
        this.$router.push("/");
             const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "Atención !!!",
            subHeader: "No esta conectado !!!!",
            message: "Ingrese la direccion IP del servidor !!!!",
            buttons: ["OK"],
          });
          await alert.present(); 
      }
    },
  },
});
</script>
<style scoped>
ion-button {
  background-color: var(--ion-color-mycolor);
  border-radius: 30px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  font-weight: bold;
  font-size: 1rem;
  margin: 5px;
}
ion-card.login-card {
    border: 2px solid var(--ion-color-mycolor);
    /* Añade un borde de 2px sólido en el color mycolor */
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

ion-card.login-card:focus-within {
    border-color: var(--ion-color-mynewcolor);
    /* Cambia el color del borde cuando la card se enfoca */
}
</style>