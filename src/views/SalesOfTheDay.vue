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

            <ion-card v-for="(sale, index) in sales" :key="sale.idalmacen + index"
                @click="showSales(sale.fecha, sale.idalmacen)">

                <ion-card-header>
                    <ion-card-title>
                        <h4 class="letter-color">
                            {{ sale.nomalmacen }}
                        </h4>
                    </ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <h2>Subtotal: $ {{ new Intl.NumberFormat("de-DE").format(sale.subtot) }} </h2>
                    <h2>Iva: $ {{ new Intl.NumberFormat("de-DE").format(sale.ivaimp) }} </h2>
                    <h2>Retenciones: $ {{ new Intl.NumberFormat("de-DE").format(sale.retencion) }} </h2>
                    <h2>Total: $ {{ new Intl.NumberFormat("de-DE").format(sale.total) }}</h2>
                    <h2> Cant Facturas: {{ sale.cantfact }} </h2>
                    <h2> Cant Productos Vendidos: {{ sale.prodvendid }}</h2>
                </ion-card-content>
                <ion-button color="mycolor" class="btn-edit-product" expand="block "
                    @click="showSales(sale.fecha, sale.idalmacen)">Ver Facturas</ion-button>

            </ion-card>
            <ion-button color="mycolor" class="btn-edit-product" expand="block " @click="newCheck">Nueva
                Consulta</ion-button>
            <ion-button color="danger" expand="full" @click="goBack"><ion-icon
                    :icon="i.arrowBackSharp"></ion-icon>Volver</ion-button>
        </ion-content>
    </ion-page>
</template>


<script lang="ts">

import { defineComponent } from "vue";
import { CheckSalesOfTheDay } from '../services/check-sales-by-day';
import { CheckSales } from '../interfaces/checkSales.interface'
import * as allIcons from "ionicons/icons";
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
    IonIcon,

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
        IonIcon,
    },
    data() {

        return {
            i: allIcons,
            initialDate: {} as CheckSales,
            sales: [] as any
        }
    },
    methods: {
        showSales(date: string, warehouseId: string) {
            this.$router.push(`/check-sales-by-day/${date}/${warehouseId}`);
        },
        async chekSales() {

            try {
                this.initialDate = this.initialDate.initialDate.replace(/-/gi, "");
                let dataToSearch = {
                    initialDate: this.initialDate
                }

                const responseSales = await CheckSalesOfTheDay.checkSales(dataToSearch)
                this.sales = responseSales.data.sales
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

        },
        newCheck() {
            location.reload();
        },
        goBack() {
            this.$router.push("/trade-orders");
        },

    },

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