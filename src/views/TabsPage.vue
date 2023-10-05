<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1" v-if="canAccessTab4">
          <img class="edit-image" src="../images/images_app/inventarios.png" />

        </ion-tab-button>
        <ion-tab-button tab="tab2" href="/tabs/tab2" v-if="canAccessTab2">
          <img class="edit-image" src="../images/images_app/productos.png" />
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/tab3" v-if="canAccessTab2">
          <img class="edit-image" src="../images/images_app/entrada_prod.png" />

        </ion-tab-button>
        <ion-tab-button tab="tab4" href="/enter-purchases" v-if="canAccessTab2">
          <img class="edit-image" src="../images/images_app/compras.png" />

        </ion-tab-button>
        <ion-tab-button tab="tab5" href="/trade-orders" v-if="canAccessTab4">
          <img class="edit-image" src="../images/images_app/pedidos.png" />

        </ion-tab-button>
      </ion-tab-bar>
      <ion-button color="mycolor" class="close-sesion" @click="closeSesion">
        <ion-icon class="close-sesion" :icon="i.close"></ion-icon>Cerrar Sesión {{ userType }}
      </ion-button>
      <h5>{{ email }}</h5>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as allIcons from "ionicons/icons";
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonPage,
  IonRouterOutlet,
  IonButton,
  IonIcon,

} from "@ionic/vue";

export default defineComponent({
  name: "TabsPage",
  components: {
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonPage,
    IonRouterOutlet,
    IonButton,
    IonIcon,
  },
  data() {
    return {
      i: allIcons,
      uuid: localStorage.getItem("uuid"),
      userType:localStorage.getItem("userType"),
      email: localStorage.getItem("email"),
    }
  },
  computed: {
    canAccessTab2() {
      return this.userType === "ADMINISTRADOR";
    },
    canAccessTab4() {
      return this.userType === "ADMINISTRADOR" || this.userType === "CAJERO";
    },
    canAccessTab5() {
      return this.userType === "ADMINISTRADOR";
    },
  },
  methods: {
    closeSesion() {
      localStorage.removeItem("uuid")
      localStorage.removeItem("userType")
      localStorage.removeItem("email")
      this.$router.push("/login");
    },
    reloadPage() {
      location.reload();
    },
  
  }

});
</script>
<style scoped>
.edit-image {
  max-width: 50px;
  /* Ajusta el ancho máximo según tus preferencias */
  margin: 0 auto;
  /* Centra la imagen horizontalmente en el botón de pestaña */
  display: block;
  /* Elimina cualquier espacio adicional alrededor de la imagen */
  transition: transform 0.3s ease-in-out;
  border-radius: 8px;
}

.edit-image:hover {
  transform: scale(1.1);
  /* Ajusta el factor de escala según tus preferencias */
}
h5{
  background-color: var(--ion-color-mycolor);
  margin: 0 auto;
}
.ion-tab-button {
  box-shadow: 0 2px 4px rgba(228, 18, 18, 0.1);
  /* Ajusta la sombra según tus preferencias */
}

.close-sesion {
  background-color: var(--ion-color-mycolor);
  border-radius: 40px;
}
</style>
