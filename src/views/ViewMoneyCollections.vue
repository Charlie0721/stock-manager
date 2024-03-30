<template>
  <ion-page>
    <ion-content>
      <div id="content">
        <ion-card>
          <ion-card-header>
            <h5 class="letter-color">Nit: {{ nit }}- {{ digito }}</h5>
            <h5 class="letter-color">Direccion: {{ address }}</h5>
            <h5 class="letter-color">Telefono: {{ phone }}</h5>
            <h5 class="letter-color">Número de recaudo: {{ number }}</h5>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item>
                <ion-label class="box">
                  <h2 class="letter-color">Detalle:</h2>
                  <h3 class="letter-color" style="white-space: pre-wrap;">{{ description }}</h3>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label class="box">
                  <h2 class="letter-color">Valor Recaudado:</h2>
                  <h2 class="letter-color">
                    $ {{ new Intl.NumberFormat("de-DE").format(value) }}
                  </h2>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>
        <div style="text-align: center">
          <h5 class="letter-color">software: https://conexionpos.com/</h5>
        </div>
      </div>
    </ion-content>
    <ion-footer collapse="fade">
      <ion-toolbar>
        <ion-title>
          <a class="letter-color" href="/money-collections">Volver</a>
        </ion-title>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts" setup>
import { MoneyCollectionsService } from "@/services/money-collections.service";
import {
  IonPage,
  IonTitle,
  IonToolbar,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonItem,
  IonLabel,
  IonButton,
  alertController,
  IonList,
  IonFooter,
} from "@ionic/vue";
import { reactive, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
const moneyCollectionService = new MoneyCollectionsService();
const route = useRoute();
const data = reactive([]);
const nit = ref<string>();
const digito = ref<number>();
const address = ref<string>();
const phone = ref<string>();
const number = ref<number>();
const value = ref<number>();
const description = ref<number>();
const date = ref<string>();

onMounted(async () => {
  await findOne();
});

const findOne = async () => {
  try {
    number.value = Number(route.params.IdRecaudo);
    const responseData = await moneyCollectionService.findOne(number.value);

    nit.value = responseData.data.response.nit;
    digito.value = responseData.data.response.digito;
    address.value = responseData.data.response.direccion;
    phone.value = responseData.data.response.telefono1;
    value.value = responseData.data.response.Valor;
    description.value = responseData.data.response.Descripcion;
    date.value = formatDate(responseData.data.response.Fecha_Tramite);
  } catch (error) {
    console.log(error);
  }
};

const formatDate = (dateString: string): string => {
  if (dateString && dateString.trim()) {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES");
  } else {
    return "Fecha no disponible";
  }
};
</script>

<style scoped>
.letter-color {
  color: #82230d;
  text-shadow: 1px 1px #fff;
}
ion-card-header {
  color: #fff;
  text-align: center;
  padding: 10px;
}

/* Estilos para los títulos dentro del encabezado de la tarjeta */
ion-card-header h5 {
  margin: 5px 0;
  font-weight: bold;
}

/* Estilos para el contenido de la tarjeta */
ion-card-content {
  padding: 10px;
}
ion-card {
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}
ion-footer a {
  color: #fff;
  text-decoration: none;
}
</style>