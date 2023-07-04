<template>
    <ion-page>

        <ion-header>
            <ion-toolbar>
                <ion-title>Detalle de la factura {{ numberOfSale }}</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">


            <ion-card>


                <ion-card-title>
                    <ion-card-header>
                        <ion-list>
                            <ion-item>
                                <ion-label class="letter-color">

                                    <h2>fecha: {{ detailValues.fecha }} </h2>
                                    <h2>Total Productos: {{ quantityOfProducts }} </h2>
                                    <h2>SubTotal :$ {{ new Intl.NumberFormat("de-DE").format(detailValues.subtotal) }}</h2>
                                    <h2>Descuentos :$ {{ new Intl.NumberFormat("de-DE").format(detailValues.valdescuentos)
                                    }}</h2>
                                    <h2>Impuestos:$ {{ new Intl.NumberFormat("de-DE").format(detailValues.valimpuesto) }}
                                    </h2>
                                    <h2>Total :$ {{ new Intl.NumberFormat("de-DE").format(detailValues.valortotal) }}</h2>
                                    <h2>Cliente :{{ detailValues.nombres }} {{ detailValues.apellidos }}</h2>
                                </ion-label>
                            </ion-item>
                        </ion-list>
                    </ion-card-header>
                </ion-card-title>
                <ion-card-content>

                    <ion-list v-for="(detailSale, index ) in detailSales" :key="index">
                        <ion-item>
                            <ion-label class="letter-color">
                                <h4>{{ detailSale.descripcion }} </h4>
                                <h4>Precio:$ {{ new Intl.NumberFormat("de-DE").format(detailSale.valorprod) }} </h4>
                                <h4>% Descuento: {{ detailSale.porcdesc }} </h4>
                                <h4>Cantidad: {{ detailSale.cantidad }} </h4>
                            </ion-label>
                        </ion-item>
                    </ion-list>

                </ion-card-content>
                <ion-button color="danger" expand="full"
                    @click="goBack(detailValues.fecha, detailValues.idalmacen)"><ion-icon
                        :icon="i.arrowBackSharp"></ion-icon>Volver</ion-button>
            </ion-card>

        </ion-content>


    </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CheckSalesOfTheDay } from '../services/check-sales-by-day';
import * as allIcons from "ionicons/icons";
import {

    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonList,
    IonItem,
    IonLabel,
    alertController,
    IonButton,
    IonIcon,


} from "@ionic/vue";

export default defineComponent({

    name: "CheckSalesDetail",
    components: {
        IonPage,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonCard,
        IonCardContent,
        IonCardHeader,
        IonCardTitle,
        IonList,
        IonItem,
        IonLabel,
        IonButton,
        IonIcon,
    },
    mounted() {
        this.getDetailSales()
    },
    data() {

        return {
            i: allIcons,
            detailSales: [] as any,
            warehouseId: 0 as number,
            numberOfSale: 0 as number,
            quantityOfProducts: 0 as number,
            detailValues: [] as any

        }

    },
    methods: {
        async getDetailSales() {
            try {

                this.warehouseId = this.$route.params.idalmacen;
                this.numberOfSale = this.$route.params.numero;

                const response = await CheckSalesOfTheDay.detailOfSalesOfTheDay(this.warehouseId, this.numberOfSale)
                if (response.data.message === "Factura encontrada") {

                    this.detailSales = response.data.sales
                    this.detailValues = response.data.detailSale
                    const count = this.detailSales.length

                    for (let i = 0; i <= count; i++) {
                        this.quantityOfProducts += this.detailSales[i].cantidad;
                    }
                    const alert = await alertController.create({
                        cssClass: "my-custom-class",
                        header: "CONFIRMACIÓN !!!!",
                        subHeader: `${response.data.message}`,
                        message: `N° ${this.numberOfSale} `,
                        buttons: ["OK"],
                    });
                    await alert.present();
                }

            } catch (error) {
                console.log(error)
            }



        },
        goBack(date: string, warehouseId: string) {

            this.$router.push(`/check-sales-by-day/${date}/${warehouseId}`)

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