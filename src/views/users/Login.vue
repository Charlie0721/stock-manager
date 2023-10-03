<template>
    <ion-page>

        <ion-header> <ion-toolbar>
                <ion-title class="ion-text-center"> 

                    <ion-button color="mycolor" class="btn-edit-product"  @click="registerUser">Registrar Usuario</ion-button>
                </ion-title>
            </ion-toolbar></ion-header>
        <ion-content class="ion-padding">

            <ion-card class="login-card">
                <ion-card-header class="ion-text-center" style="font-size: 1.5rem;">Iniciar Sesión</ion-card-header>
                <ion-card-content>

                    <ion-item class="input-item">
                        <ion-label position="floating" class="ion-text-center">Email:</ion-label>
                        <ion-input type="text"></ion-input>
                    </ion-item>
                    <ion-item class="input-item">
                        <ion-label position="floating" class="ion-text-center">Password:</ion-label>
                        <ion-input type="text"></ion-input>
                    </ion-item>

                </ion-card-content>
                <ion-button color="mycolor" class="btn-edit-product" expand="full">Entrar</ion-button>
            </ion-card>
        </ion-content>

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
    IonContent,
    //   IonCardSubtitle,
    //   IonIcon,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonLabel,
    IonItem,
    IonButton,
    //   alertController,
    //   IonList,
    //   IonSearchbar,
    //   IonPopover,
    //   IonModal,
    //   IonText,
    //   IonCardTitle,
    IonInput,
} from "@ionic/vue";


export default defineComponent({

    name: "Login-User",
    components: {
        IonPage,
        IonHeader,
        IonCard,
        IonCardContent,
        IonCardHeader,
        IonTitle,
        IonToolbar,
        IonContent,
        IonLabel,
        IonInput,
        IonItem,
        IonButton,


    },
    data() {
        return {
            i: allIcons,
        }
    },
    methods:{
        registerUser(){
            this.$router.push("/conexion-pos-user");
        }

    }

})

</script>
<style scoped>
ion-card.login-card {
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

ion-item.input-item {
    --highlight-height: 0;
    /* Elimina el resaltado al hacer clic en los campos de entrada */
    margin-bottom: 16px;
    /* Espaciado entre los campos de entrada */
}

ion-button.btn-edit-product {
    --border-radius: 30px;
    font-weight: bold;
    font-size: 1rem;
    margin-top: 16px;
    /* Espacio entre el último campo de entrada y el botón */
    background-color: var(--ion-color-mycolor);
    /* Usa el color mycolor en el botón */
    color: #fff;
    /* Cambia el color de texto del botón a blanco */
}

ion-card.login-card {
  border: 2px solid var(--ion-color-mycolor); /* Añade un borde de 2px sólido en el color mycolor */
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}
ion-card.login-card:focus-within {
  border-color: var(--ion-color-mynewcolor); /* Cambia el color del borde cuando la card se enfoca */
}
</style>