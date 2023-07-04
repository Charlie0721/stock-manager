<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Detalles tributarios Facturas</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-card>
                <ion-card-title>
                    <ion-card-header>
                        <h5 class="letter-color">Subtotal: $ {{ new Intl.NumberFormat("de-DE").format(subTotal) }} </h5>
                    </ion-card-header>
                </ion-card-title>

                <ion-card-content>
                    <h5 class="letter-color">Total Impuestos: $ {{ new Intl.NumberFormat("de-DE").format(amounTax) }} </h5>
                    <h5 class="letter-color">Total Ventas: $ {{ new Intl.NumberFormat("de-DE").format(totalSales) }} </h5>

                </ion-card-content>
            </ion-card>

            <ion-list v-for="(sale, index) in sales" :key="sale.numero + '' + index">

                <ion-item>
                    <ion-label class="letter-color"> Factura N°
                        {{ sale.numero }}
                        <h4>Subtotal: $ {{ new Intl.NumberFormat("de-DE").format(sale.subtotal) }} </h4>
                        <h4>Val Impuesto: $ {{ new Intl.NumberFormat("de-DE").format(sale.valimpuesto) }} </h4>
                        <h4>Total: $ {{ new Intl.NumberFormat("de-DE").format(sale.valortotal) }} </h4>
                        <h4>Hora: {{ sale.hora }} </h4>
                        <h4>Almacén: {{ sale.nomalmacen }} </h4>
                    </ion-label>
                </ion-item>
                <ion-button color="mycolor" class="btn-edit-product" expand="block "
                    @click="getDetail(sale.idalmacen, sale.numero)">Ver Detalle </ion-button>

            </ion-list>
            <ion-button color="mycolor" class="btn-edit-product" expand="block " @click="reloaPage"><ion-icon
                    :icon="i.refreshCircle"></ion-icon>Recargar</ion-button>
            <ion-button color="danger" expand="full" @click="goBack"><ion-icon
                    :icon="i.arrowBackSharp"></ion-icon>Volver</ion-button>
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
    IonList,
    alertController,
    IonItem,
    IonLabel,
    IonContent,
    IonIcon,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,

} from "@ionic/vue";

export default defineComponent({

    name: "CheckSales",
    components: {
        IonPage,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonList,
        IonItem,
        IonLabel,
        IonContent,
        IonIcon,
        IonButton,
        IonCard,
        IonCardContent,
        IonCardHeader,
        IonCardTitle,
    },
    data() {

        return {
            i: allIcons,
            sales: [] as any,
            date: "" as string,
            warehouseId: "" as string,
            totalSales: 0 as number,
            amounTax: 0 as number,
            subTotal: 0 as number,

        }
    },
    mounted() {
        this.getData();
    },

    methods: {
        reloaPage() {
            location.reload();
        },

        async getData() {
            try {
                this.date = this.$route.params.fecha;
                this.warehouseId = this.$route.params.idalmacen;

                const response = await CheckSalesOfTheDay.getSalesByWarehouse(this.date, this.warehouseId)
                if (response.data.message === "Facturas encontradas") {

                    this.sales = response.data.sales
                    const count = this.sales.length
                    for (let i = 0; i <= count; i++) {
                        this.totalSales += this.sales[i].valortotal;
                        this.amounTax += this.sales[i].valimpuesto;
                        this.subTotal += this.sales[i].subtotal;
                    }
                    const alert = await alertController.create({
                        cssClass: "my-custom-class",
                        header: "CONFIRMACIÓN !!!!",
                        subHeader: `${response.data.message}: ${count}`,
                        message: `Total Ventas: $ ${new Intl.NumberFormat("de-DE").format(this.totalSales)}`,
                        buttons: ["OK"],
                    });
                    await alert.present();
                }


            } catch (error) {
                console.log(error);
            }
        },
        goBack() {
            this.$router.push("/check-sales-by-day/");
        },
        getDetail(warehouseId: number, number: number) {
            this.$router.push(`/check-sales-by-day/detail/${warehouseId}/${number}`);


        }

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