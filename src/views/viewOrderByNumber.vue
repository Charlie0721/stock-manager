<template>
  <ion-page>
    <ion-content>
      <div id="content">
        <ion-card>
          <ion-card-header>
            <h5 class="letter-color">{{ warehouseName }}</h5>
            <h5 class="letter-color">Fecha: {{ date }} hora:{{ hour }}</h5>
            <h5 class="letter-color">Pedido Nro. {{ numb }}</h5>
            <h5 class="letter-color">{{ name }} {{ lastName }}</h5>
            <h5 class="letter-color">Nit/CC: {{ nit }}</h5>
            <ion-card-title class="letter-color"> </ion-card-title>
            <vue-qr :text="numb" :size="100"></vue-qr>
          </ion-card-header>

          <ion-card-content>
            <h3 class="letter-color">PRODUCTOS:</h3>

            <ion-list v-for="product in order" :key="product.id">
              <ion-item>
                <ion-label class="box">
                  <h4 class="letter-color">
                    {{ product.descripcion }}
                  </h4>
                  <ion-text color="medium">
                    <h4 class="letter-color">
                      Cant: {{ product.cantidad }} Vr Unit: $
                      {{
                        new Intl.NumberFormat("de-DE").format(product.valorprod)
                      }}
                      Vr Total: ${{
                        new Intl.NumberFormat("de-DE").format(
                          (totalValueProduct =
                            product.valorprod * product.cantidad)
                        )
                      }}
                    </h4>
                  </ion-text>
                </ion-label>
              </ion-item>
            </ion-list>
            <h4 class="letter-color">
              SUBTOTAL: $ {{ new Intl.NumberFormat("de-DE").format(subtotal) }}
            </h4>
            <h4 class="letter-color">
              IVA: $ {{ new Intl.NumberFormat("de-DE").format(taxValue) }}
            </h4>
            <h4 class="letter-color">
              TOTAL: $ {{ new Intl.NumberFormat("de-DE").format(totalValue) }}
            </h4>
          </ion-card-content>
        </ion-card>
        <div style="text-align: center">
          <h5 class="letter-color">software: https://conexionpos.com/</h5>
        </div>
        <br />
        <br />
      </div>
      <ion-button
        color="mycolor"
        class="btn-edit-product"
        expand="full"
        @click="printPdf()"
        ><ion-icon :icon="i.printOutline"></ion-icon>Generar PDF
      </ion-button>
    </ion-content>
    <ion-footer collapse="fade">
      <ion-toolbar>
        <ion-title>
          <a class="letter-color" href="/trade-orders">Volver</a>
        </ion-title>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>



<script lang="ts">
import { defineComponent } from "vue";
import * as allIcons from "ionicons/icons";
import {
  IonPage,
  //IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonContent,
  IonList,
  IonLabel,
  IonText,
  IonFooter,
  IonButton,
  IonIcon,
  alertController,
} from "@ionic/vue";
import { TradeOrders } from "../services/tradeOrder";
import vueQr from "vue-qr/src/packages/vue-qr.vue";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";
export default defineComponent({
  name: "viewOrder",

  components: {
    vueQr,
    IonPage,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonItem,
    IonContent,
    IonList,
    IonLabel,
    IonText,
    IonFooter,
    IonButton,
    IonIcon,
  },
  data() {
    return {
      i: allIcons,
      order: [] as any,
      idalm: "" as string,
      numb: "" as string,
      name: "" as string,
      lastName: "" as string,
      totalValue: 0 as number,
      subtotal: 0 as number,
      taxValue: 0 as number,
      urlWebPage: "" as string,
      state: true as boolean,
      hour: "" as string,
      date: "" as string,
      nit: "" as string,
      totalValueProduct: 0 as number,
      warehouseName: "" as string,
      seller: "" as string,
    };
  },
  mounted() {
    this.getOrderByNumber();
  },
  methods: {
    //     async pdfGenerator() {
    //       const dataProducts = [];
    //       const archivoNuevo = "pedido numero " + this.order[0].numero + ".txt";
    //       this.order.forEach((product: any) => {
    //         const products = [
    //           {
    //             Descripcion: product.descripcion,
    //             Vr_Unit: new Intl.NumberFormat("de-DE").format(product.valorprod),
    //             Cantidad: product.cantidad,
    //             Vr_Total: new Intl.NumberFormat("de-DE").format(
    //               product.valorprod * product.cantidad
    //             ),
    //           },
    //         ];
    //         dataProducts.push(products);
    //       });
    //       const directory = Directory.Documents;

    //       const dataStringProducts = JSON.stringify(dataProducts, null, 1).replace(
    //         /\n/g,
    //         "\n"
    //       );

    //       const cleanStr = dataStringProducts.replace(/[[\]{},"]/g, "");

    //       let stringDataOne = `
    //         Almacen: ${this.order[0].nomalmacen}
    //         Fecha: ${this.order[0].fecha} Hora:${this.order[0].hora}
    //         Pedido Nro: ${this.order[0].numero}
    //         Datos del Cliente
    //         ${this.order[0].nombres}
    //         Nit/CC:${this.order[0].nit}

    //         ${cleanStr}

    //         Total:$${new Intl.NumberFormat("de-DE").format(
    //         this.order[0].valortotal
    //       )}
    // Software: https://conexionpos.com/
    //         `;
    //       console.log(stringDataOne);

    //       Filesystem.writeFile({
    //         path: `${directory}/${archivoNuevo}`,
    //         data: stringDataOne,
    //         encoding: Encoding.UTF8,
    //         directory,
    //         recursive: true,
    //       })
    //         .then(async () => {
    //           const alert = await alertController.create({
    //             cssClass: "my-custom-class",
    //             header: "Atencion !!!",
    //             subHeader: `OK `,
    //             message: "Archivo generado con el nombre " + archivoNuevo,
    //             buttons: ["ACEPTAR"],
    //           });
    //           await alert.present();
    //           console.log("Archivo TXT generado correctamente");
    //         })
    //         .catch(async (error) => {
    //           console.error("Ocurrió un error al generar el archivo TXT:", error);
    //           const alert = await alertController.create({
    //             cssClass: "my-custom-class",
    //             header: "Atencion !!!",
    //             subHeader: `Error ${error}`,
    //             message: error,
    //             buttons: ["ACEPTAR"],
    //           });
    //           await alert.present();
    //         });

    //     },

    async printPdf() {
      this.idalm = this.$route.params.idalmacen.toString();
      this.numb = this.$route.params.number.toString();
      const response = await TradeOrders.printOrderToPdfByNumberAndWarehouse(
        this.numb,
        this.idalm
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      if (Capacitor.isNativePlatform()) {
        // 📱 MODO MÓVIL: Guardar y abrir el archivo
        const reader = new FileReader();
        reader.onloadend = async () => {
          let base64Data = "";

          if (typeof reader.result === "string") {
            base64Data = reader.result.split(",")[1]; // Extrae solo el Base64
          } else {
            console.error("Error al convertir el archivo a Base64");
            return;
          }

          const fileName = `pedido_${this.numb}.pdf`;

          // Guardar el archivo en el dispositivo
          await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Documents, // O Directory.Data para ocultarlo del usuario
          });

          // Abrir el archivo con la app del sistema
          const fileUri = await Filesystem.getUri({
            directory: Directory.Documents,
            path: fileName,
          });

          window.open(fileUri.uri, "_system"); // Abrir con la aplicación predeterminada
        };
        reader.readAsDataURL(blob);
      } else {
        // 🌐 MODO WEB: Descargar el archivo
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `pedido_${this.numb}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }
    },

    async getOrderByNumber() {
      try {
        this.idalm = this.$route.params.idalmacen.toString();
        this.numb = this.$route.params.number.toString();
        const responseOrder = await TradeOrders.getOrderByNumberAndWarehouse(
          this.numb,
          this.idalm
        );
        this.order = responseOrder.data;

        this.name = this.order[0].nombres;
        this.lastName = this.order[0].apellidos;
        this.totalValue = this.order[0].valortotal;
        this.subtotal = this.order[0].subtotal;
        this.taxValue = this.order[0].valimpuesto;
        this.hour = this.order[0].hora;
        this.date = this.order[0].fecha;
        this.nit = this.order[0].nit;
        this.warehouseName = this.order[0].nomalmacen;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
</script>
<style scoped>
ion-button {
  background-color: var(--ion-color-mycolor);
}

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

/* Estilos para la lista de productos */
ion-list {
  margin-top: 10px;
  border-top: 1px solid #ccc;
}

/* Estilos para los elementos de la lista de productos */
ion-item {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

/* Estilos para el pie de página */
ion-footer {
  background-color: var(--ion-color-mycolor);
  color: #fff;
  text-align: center;
}

/* Estilos para el enlace de "Volver" */
ion-footer a {
  color: #fff;
  text-decoration: none;
}

/* Estilos para el botón "Generar TXT" */
.btn-edit-product {
  margin: 20px auto;
  width: 80%;
}

/* Estilos para el ícono dentro del botón */
ion-button ion-icon {
  margin-right: 8px;
}

div[style="text-align: center"] h5 {
  margin-top: 20px;
}

/* Añadir sombra a la tarjeta */
ion-card {
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}

/* Añadir un fondo blanco al contenido principal */

/* Añadir margen inferior al último botón */
ion-button:last-child {
  margin-bottom: 20px;
}

.edit-image1 {
  width: 5%;
  max-height: 5%;
}

ion-button {
  background-color: var(--ion-color-mycolor);
  color: #fff;
  /* Cambiar el color del texto para que sea visible en el fondo corporativo */
  font-weight: bold;
  /* Hacer el texto más audaz */
  border-radius: 10px;
  /* Añadir esquinas redondeadas */
}
</style>