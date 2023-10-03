<template>
    <ion-page>

        <ion-header> <ion-toolbar>
                <ion-title class="ion-text-center">
                    Crear Usuario
                </ion-title>
            </ion-toolbar></ion-header>
        <ion-content class="ion-padding">

            <ion-card class="login-card">
                <ion-card-header class="ion-text-center" style="font-size: 1.5rem;">Registrar</ion-card-header>
                <ion-card-content>

                    <ion-item class="input-item">
                        <ion-label position="floating" class="ion-text-center">Email:</ion-label>
                        <ion-input type="email" :value="registerUser.email"
                            @input="registerUser.email = $event.target.value"></ion-input>
                    </ion-item>
                    <ion-item class="input-item">
                        <ion-label position="floating" class="ion-text-center">Contraseña:</ion-label>
                        <ion-input type="password" :value="registerUser.password"
                            @input="registerUser.password = $event.target.value"></ion-input>
                    </ion-item>
                    <ion-list>
                        <ion-item>
                            <ion-label position="floating" class="ion-text-center">Tipo de usuario:</ion-label>
                            <ion-select aria-label="Tipo de usuario" :value="registerUser.userType"
                                @ionChange="registerUser.userType = $event.target.value">
                                <ion-select-option value="ADMINISTRADOR">Administrador</ion-select-option>
                                <ion-select-option value="CAJERO">Cajero</ion-select-option>
                            </ion-select>
                        </ion-item>
                    </ion-list>

                </ion-card-content>
                <ion-button color="mycolor" class="btn-edit-product" expand="full" @click="signin">Registrar</ion-button>
            </ion-card>
            <ion-button color="mycolor" class="btn-edit-product" expand="full" @click="goToLogin">Volver</ion-button>
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
    alertController,
    //   IonList,
    //   IonSearchbar,
    //   IonPopover,
    //   IonModal,
    //   IonText,
    //   IonCardTitle,
    IonInput,
    IonList, IonSelect, IonSelectOption,
} from "@ionic/vue";
import { SigninInterface } from "@/interfaces/conexion-user.interface";
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../../services/user.service'

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
        IonList, IonSelect, IonSelectOption,


    },
    data() {
        return {
            i: allIcons,
            registerUser: {} as SigninInterface
        }
    },
    methods: {
        goToLogin() {
            this.$router.push("/login");
        },
        async signin() {
            let email = this.registerUser.email;
            let password = this.registerUser.password
            if (email === '' || email === undefined) {
                const alert = await alertController.create({
                    cssClass: "my-custom-class",
                    header: "Atencion !!! ",
                    message: `¡Debe digitar el email !`,
                    buttons: ["ACEPTAR"],
                });
                await alert.present();
                return
            }
            if (password === '' || password === undefined) {
                const alert = await alertController.create({
                    cssClass: "my-custom-class",
                    header: "Atencion !!! ",
                    message: `¡Debe Ingresar una contraseña !`,
                    buttons: ["ACEPTAR"],
                });
                await alert.present();
                return
            }
            if (this.registerUser.userType === '' || this.registerUser.userType === undefined) {
                const alert = await alertController.create({
                    cssClass: "my-custom-class",
                    header: "Atencion !!! ",
                    message: `¡Debe seleccionar el tipo de usuario !`,
                    buttons: ["ACEPTAR"],
                });
                await alert.present();
                return

            }
            this.registerUser.uuid = uuidv4();
            const response = await UserService.saveUser(this.registerUser)
            if (response.status === 201) {
                const alert = await alertController.create({
                    cssClass: "my-custom-class",
                    header: "Confirmación !!! ",
                    message: `Usuario ${response.data.email} creado satisfactoriamente `,
                    buttons: ["ACEPTAR"],
                });
                await alert.present();
                this.$router.push("/login");
            }
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