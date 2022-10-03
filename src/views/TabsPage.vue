<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <img class="edit-image" src="../images/images_app/inventarios.png" />
        
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/tab2">
          
          <img class="edit-image" src="../images/images_app/productos.png" />

       
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/tab3">
          <img class="edit-image" src="../images/images_app/entrada_prod.png" />
          
        </ion-tab-button>
        <ion-tab-button tab="tab4" href="/enter-purchases">
          <img class="edit-image" src="../images/images_app/compras.png" />
         
        </ion-tab-button>
        <ion-tab-button tab="tab5" href="/trade-orders">
          <img class="edit-image" src="../images/images_app/pedidos.png" />
         
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonPage,
  IonRouterOutlet,
} from "@ionic/vue";

export default defineComponent({
  name: "TabsPage",
  components: {
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonPage,
    IonRouterOutlet,
  },
 
});
</script>
<style scoped>
.edit-image {
  width: 100%;
  max-height: 100%;
}
</style>
