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
          <ion-input type="text" :value="data.Valor" @input="data.Valor = $event.target.value">
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Descripción y/o observaciones</ion-label>
          <ion-textarea rows="5" :value="data.Descripcion"
            @input="data.Descripcion = $event.target.value"></ion-textarea>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input type="email" :value="data.eMail" @input="data.eMail = $event.target.value"></ion-input>
        </ion-item>
        <ion-button color="mycolor" class="btn-edit-product" expand="block" @click="create">Agregar</ion-button>
        <ion-button color="mycolor" class="btn-edit-product" expand="block" @click="goToOrders">Volver</ion-button>
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
import router from "../router/index";
const moneyCollectionService = new MoneyCollectionsService();

const data = ref<MoneyCollectionsInterface>({
  Valor: 0,
  Descripcion: "",
  eMail: ''
});

const create = async () => {
  try {
    if (data.value.Valor === 0 || data.value.Valor === null) {
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "ATENCIÓN !!!!",
        message: `El valor del recaudo debe ser mayor a 0 `,
        buttons: ["OK"],
      });
      data.value.Descripcion = "";
      return await alert.present();
    }
    if (data.value.Descripcion === "" || data.value.Descripcion === null) {
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "ATENCIÓN !!!!",
        message: `Debe ingresar una descripción con el detalle de la transacción `,
        buttons: ["OK"],
      });
      data.value.Valor = 0;
      return await alert.present();
    }
    if (data.value.eMail === '') {

      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "ATENCIÓN !!!!",
        message: `Debe ingresar una dirección de correo eléctronico `,
        buttons: ["OK"],
      });
      data.value.Valor = 0;
      data.value.Descripcion = '';
      return await alert.present();
    }

    const response = await moneyCollectionService.create(data.value);
    const idRecaudo = response.data.response[0].IdRecaudo;
    const value = response.data.response[0].Valor;
    const alert = await alertController.create({
      cssClass: "my-custom-class",
      header: "CONFIRMACION !!!!",
      message: `Se ha generado el recaudo número ${idRecaudo}  por valor de  $ ${value} `,
      buttons: ["OK"],
    });
    await alert.present();
    goToDetail(idRecaudo);
  } catch (error) {
    console.log(error);
  }
};
const goToDetail = (moneyCollectionId: number) => {
  router.push(`/money-collections/${moneyCollectionId}`);
};
const goToOrders = () => {
  router.push('/trade-orders')
}
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