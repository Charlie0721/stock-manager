<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Conectarse a la API </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <ion-label>Seleccionar IP del Almacén</ion-label>
        <ion-select :value="selectedConnection" @ionChange="changeConnection">
          <ion-select-option
            v-for="conn in connections"
            :key="conn"
            :value="conn"
          >
            {{ conn }}
          </ion-select-option>
        </ion-select>
      </ion-item>
      <ion-button
        color="mycolor"
        expand="full"
        @click="confirmSelectedConnection"
      >
        Conectar {{ selectedConnection }}
      </ion-button>
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
            >Grabar</ion-button
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
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";
import { urlAPiI } from "@/interfaces/connectioApi.interface";
import { GetUrlType } from "@/interfaces/get-url.type";
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
    IonSelect,
    IonSelectOption,
  },
  data() {
    return {
      dataConnections: {} as urlAPiI,
      connections: [] as any,
      selectedConnection: "",
      urls: [] as GetUrlType[],
    };
  },
  async mounted() {
    await this.loadConnections();
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
      let connections = JSON.parse(localStorage.getItem("connections") || "[]");
      if (!connections.includes(api1)) {
        connections.push(api1);
        localStorage.setItem("connections", JSON.stringify(connections));
      }

      // await axios
      //   .post(`${api1}/connect-api`, this.dataConnections)
      //   .then((data) => {
      //     localStorage.setItem("connection", JSON.stringify(api1));
      //   })
      //   .catch(async (err) => {
      //     const alert = await alertController.create({
      //       cssClass: "my-custom-class",
      //       header: "Error !!!",
      //       subHeader: `${err}`,
      //       message: `${err.message}`,
      //       buttons: ["OK"],
      //     });
      //     await alert.present();
      //   });
      this.reload();
    },
    async getConnectionstoApi() {
      if (localStorage.getItem("connection")) {
        const conn = localStorage.getItem("connection");
        const connections = localStorage.getItem("connections");
        if (!conn || !connections) {
          const alert = await alertController.create({
            cssClass: "my-custom-class",
            header: "Atención !!!",
            subHeader: "No hay conexión guardada !!!!",
            message: "Ingrese la dirección IP del servidor !!!!",
            buttons: ["OK"],
          });
          await alert.present();
        }

        console.log("Selected Connection:", this.selectedConnection);
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
    async syncConnections() {
      this.connections = JSON.parse(
        localStorage.getItem("connections") || "[]"
      );

      if (this.connections.length > 0) {
        this.selectedConnection = this.connections[0];
        localStorage.setItem(
          "connection",
          JSON.stringify(this.selectedConnection)
        );
      } else {
        this.selectedConnection = "";
      }
    },
    async loadConnections() {
      this.connections = JSON.parse(
        localStorage.getItem("connections") || "[]"
      );

      if (this.connections.length > 0) {
        this.selectedConnection = this.connections[0];
        localStorage.setItem(
          "connection",
          JSON.stringify(this.selectedConnection)
        );
      } else {
        this.selectedConnection = "";
      }
    },
    changeConnection(event: CustomEvent) {
      const selected = event.detail.value;
      this.selectedConnection = selected;
      localStorage.setItem("connection", JSON.stringify(selected));
    },
   async confirmSelectedConnection() {
      if (this.selectedConnection) {
        localStorage.setItem(
          "connection",
          JSON.stringify(this.selectedConnection)
        );
        const alert = await alertController.create({
          header: "Conectado",
          message: `Conectado a IP ${this.selectedConnection}`,
          buttons: ["OK"],
        });
        await alert.present();
        this.getConnectionstoApi();
      }
    },
    reload() {
      location.reload();
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