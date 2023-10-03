<template>
    <ion-page>

        <ion-header> <ion-toolbar>
                <ion-title class="ion-text-center">
                    Usuario Autorizado
                </ion-title>
            </ion-toolbar></ion-header>
        <ion-content class="ion-padding">

            <ion-card class="login-card">
                <ion-card-header class="ion-text-center" style="font-size: 1.5rem;">Credenciales</ion-card-header>
                <ion-card-content>

                    <ion-item class="input-item">
                        <ion-label position="floating" class="ion-text-center">Usuario:</ion-label>
                        <ion-input type="text" :value="user.user" @input="user.user = $event.target.value"></ion-input>
                    </ion-item>
                    <ion-item class="input-item">
                        <ion-label position="floating" class="ion-text-center">Contraseña:</ion-label>
                        <ion-input type="password" :value="user.password"
                            @input="user.password = $event.target.value"></ion-input>
                    </ion-item>

                </ion-card-content>
                <ion-button color="mycolor" class="btn-edit-product" expand="full"
                    @click="goToSingnin">Continuar</ion-button>
            </ion-card>
            <ion-button color="mycolor" class="btn-edit-product" expand="full" @click="goToLogin">Volver</ion-button>
        </ion-content>

    </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as allIcons from "ionicons/icons";
import { ConexionPosUserInterface } from "../../interfaces/conexion-user.interface";
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonLabel,
    IonItem,
    IonButton,
    alertController,

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
            user: {} as ConexionPosUserInterface
        }
    },
    methods: {
        goToLogin() {
            this.$router.push("/login");
        },
        async goToSingnin() {
            let username = ''
            username = this.user.user.toUpperCase();
            let password = this.user.password

            if (username === '' && password === '') {

                const alert = await alertController.create({
                    cssClass: "my-custom-class",
                    header: "Atencion !!! ",
                    message: `¡Debe digitar usuario y contraseña !`,
                    buttons: ["ACEPTAR"],
                });
                await alert.present();
                this.user.password = '';
                return
            }

            if (password != 'conexion1234') {
                const alert = await alertController.create({
                    cssClass: "my-custom-class",
                    header: "Atencion !!! ",
                    message: `¡Constraseña incorrecta !`,
                    buttons: ["ACEPTAR"],
                });
                await alert.present();
                this.user.password = '';
                return
            }

            if (username === "ADMINISTRADOR" && password === "conexion1234") {
                const alert = await alertController.create({
                    cssClass: "my-custom-class",
                    header: "Confirmación !!! ",
                    message: `Usuario Validado puede continuar con el registro`,
                    buttons: ["ACEPTAR"],
                });
                await alert.present();
                this.user.user = '';
                this.user.password = '';
                this.$router.push("/signin");
            } else {

                const alert = await alertController.create({
                    cssClass: "my-custom-class",
                    header: "Atencion !!! ",
                    message: `¡Usuario No valido para continuar !`,
                    buttons: ["ACEPTAR"],
                });
                await alert.present();
                this.user.user = '';
                this.user.password = '';
                return
            }
        },
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
    margin-bottom: 16px;
}

ion-button.btn-edit-product {
    --border-radius: 30px;
    font-weight: bold;
    font-size: 1rem;
    margin-top: 16px;
    background-color: var(--ion-color-mycolor);
    color: #fff;
}

ion-card.login-card {
    border: 2px solid var(--ion-color-mycolor);
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

ion-card.login-card:focus-within {
    border-color: var(--ion-color-mynewcolor);
}
</style>