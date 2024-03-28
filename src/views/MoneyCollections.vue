
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <img class="edit-image1" src="../images/images_app/logo_header.png" />
          Recaudos
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-card>
        <ion-item>
          <ion-label position="floating">Valor a recaudar</ion-label>
          <ion-input
            type="text"
            :value="data.Valor"
            @input="data.Valor = $event.target.value"
          >
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating"
            >Descripción y/o observaciones</ion-label
          >
          <ion-textarea
            rows="5"
            :value="data.Descripcion"
            @input="data.Descripcion = $event.target.value"
          ></ion-textarea>
        </ion-item>
        <ion-button
          color="mycolor"
          class="btn-edit-product"
          expand="block"
          @click="create"
          >Agregar</ion-button
        >
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script lang="ts" setup>
import {
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonContent,
  IonCard,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonTextarea,
  alertController,
} from "@ionic/vue";
import { MoneyCollectionsService } from "@/services/money-collections.service";
import { MoneyCollectionsInterface } from "@/interfaces/money-collections.interface";
import { ref } from "vue";

const moneyCollectionService = new MoneyCollectionsService();

const data = ref<MoneyCollectionsInterface>({
  Valor: 0,
  Descripcion: "",
});

const create = async () => {
  try {
    const response = await moneyCollectionService.create(data.value);
    const alert = await alertController.create({
      cssClass: "my-custom-class",
      header: "CONFIRMACION !!!!",
      message: `Se ha generado el recaudo número ${response.data.response[0].IdRecaudo}  por valor de  $${response.data.response[0].Valor} `,
      buttons: ["OK"],
    });
    await alert.present();
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped>
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
</style>