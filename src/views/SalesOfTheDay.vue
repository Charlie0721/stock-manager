<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Consultar la ventas por día </ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-item>
                <ion-label position="floating" class="letter-color">Fecha
                </ion-label>
                <ion-input type="date" :value="initialDate.initialDate"
                    @input="initialDate.initialDate = $event.target.value"></ion-input>
            </ion-item>
            <ion-button color="mycolor" class="btn-edit-product" expand="block " @click="chekSales"> Consultar</ion-button>

            <ion-card v-for="sale in sales" :key="sale.idalmacen">

                <ion-card-header>
                    <ion-card-title>
                        <h4 class="letter-color">
                            {{ sale.nomalmacen }}
                        </h4>
                    </ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    subtotal:$ {{ new Intl.NumberFormat("de-DE").format(sale.subtot) }} <br>
                    iva:$ {{ new Intl.NumberFormat("de-DE").format(sale.ivaimp) }} <br>
                    retenciones:$ {{ new Intl.NumberFormat("de-DE").format(sale.retencion) }} <br>
                    total:$ {{ new Intl.NumberFormat("de-DE").format(sale.total) }}<br><br>
                    Cant Facturas:{{ sale.cantfact }} <br>
                    Cant Productos Vendidos:{{ sale.prodvendid }}

                </ion-card-content>

            </ion-card>
        </ion-content>
    </ion-page>
</template>


<script lang="ts">

import { defineComponent } from "vue";
import { CheckSalesOfTheDay } from '../services/check-sales-by-day';
import { CheckSales } from '../interfaces/checkSales.interface'
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonItem,
    IonButton,
    IonLabel,
    alertController,
    IonInput,
    IonContent,
    IonCardTitle,

} from "@ionic/vue";

export default defineComponent({

    name: "CheckSales",
    components: {
        IonPage,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonItem,
        IonButton,
        IonLabel,
        IonInput,
        IonContent,
        IonCard,
        IonCardContent,
        IonCardHeader,
        IonCardTitle,
    },
    data() {

        return {
            initialDate: {} as CheckSales,
            sales: [] as any
        }

    },
    methods: {

        async chekSales() {

            try {
                this.initialDate = this.initialDate.initialDate.replace(/-/gi, "");
                let dataToSearch = {
                    initialDate: this.initialDate
                }

                const responseSales = await CheckSalesOfTheDay.checkSales(dataToSearch)
                this.sales = responseSales.data.sales
                console.log(this.sales)
                if (responseSales) {
                    const alert = await alertController.create({
                        cssClass: "my-custom-class",
                        header: "Confirmación !!! ",
                        message: `${responseSales.data.message}`,
                        buttons: ["ACEPTAR"],
                    });
                    await alert.present();

                }

            } catch (error) {
                console.log(error)
                if (error.code === "ERR_BAD_REQUEST") {
                    const alert = await alertController.create({
                        cssClass: "my-custom-class",
                        header: "Atención !!! ",
                        message: `${error.response.data.message}`,
                        buttons: ["ACEPTAR"],
                    });
                    await alert.present();
                    return
                }

            }

        }

    }

})

</script>
<style scoped>
.text-custom-botones {
    padding-left: 100px !important;
    padding-right: 100px !important;
}

.edit-image {
    width: 10%;
    max-height: 10%;
    float: right;
}

.edit-image1 {
    width: 5%;
    max-height: 5%;
}

.btn-edit-product {
    border-radius: 30px;
}

ion-button {
    background-color: var(--ion-color-mycolor);
}

.letter-color {
    color: #82230d;
    text-shadow: 1px 1px #fff;
}

.custom-modal-content {
    --overflow: auto;
    --overflow-scroll-behavior: smooth;
}
</style>