import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TabsPage from "../views/TabsPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "connectApi",
    component: () => import("@/views/connectApi.vue"),
  },

  {
    path: "/warehouse-for-orders",
    name: "warehouse",
    component: () => import("@/views/warehouseForOrders.vue"),
  },

  {
    path: "/tabs/",
    component: TabsPage,
    children: [
      {
        path: "",
        redirect: "/tabs/tab1",
      },
      {
        path: "tab1",
        component: () => import("@/views/Tab1Page.vue"),
      },
      {
        path: "tab2",
        component: () => import("@/views/Tab2Page.vue"),
      },
      {
        path: "tab3",
        component: () => import("@/views/Tab3Page.vue"),
      },
      {
        path: "/enter-purchases",
        name: "send-purshable",
        component: () => import("@/views/send-purshable.vue"),
      },
      {
        path: "/trade-orders",
        name: "TradeOrde",
        component: () => import("@/views/tradeOrders.vue"),
      },
    ],
  },
  {
    path: "/edit-product/:id",
    name: "EditP",
    component: () => import("@/views/EditProduct.vue"),
  },
  {
    path: "/view-order/:number/:idalmacen",
    name: "viewOrder",
    component: () => import("@/views/viewOrderByNumber.vue"),
  },
  {
    path: "/data-collector",
    name: "dataCollector",
    component: () => import("@/views/dataCollector.vue"),
  },
  {
    path: "/data-collector/transfers",
    name: "dataCollector-transfers",
    component: () => import("@/views/data-collector-transfers.vue"),
  },

  {
    path: "/control-suscription",
    name: "control-suscription",
    component: () => import("@/views/controlSuscription.vue"),
  },
  {
    path: "/transfers",
    name: "transfers",
    component: () => import("@/views/transfers.vue"),
  },
  {
    path: "/create-one-product",
    name: "product",
    component: () => import("@/views/CreateProducts.vue"),
  },
  {
    path: "/check-sales-by-day",
    name: "check-sales",
    component: () => import("@/views/SalesOfTheDay.vue"),
  },
  {
    path: "/check-sales-by-day/:fecha/:idalmacen",
    name: "check-sales-by-warehouse",
    component: () => import("@/views/AmountSalesday.vue"),
  },
  {
    path: "/check-sales-by-day/detail/:idalmacen/:numero",
    name: "check-sales-by-warehouse-detail",
    component: () => import("@/views/DetailSalesDay.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/users/Login.vue"),
  },
  {
    path: "/conexion-pos-user",
    name: "user-pos",
    component: () => import("@/views/users/ConexionPosUser.vue"),
  },
  {
    path: "/signin",
    name: "signinUser",
    component: () => import("@/views/users/Signin.vue"),
  },
  {
    path: "/money-collections",
    name: "MoneyCollections",
    component: () => import("@/views/MoneyCollections.vue"),
  },
  {
    path: "/money-collections/:IdRecaudo",
    name: "MoneyCollectionsData",
    component: () => import("@/views/ViewMoneyCollections.vue"),
  },
  {
    path: "/paginate-orders/:idalmacen/:idvendedor",
    name: "PaginateOrders",
    component: () => import("@/views/PaginateOrders.vue"),
  },
  {
    path: "/edit-order/:idpedido",
    name: "EditOrder",
    component: () => import("@/views/EditOrder.vue"),
  },
  {
    path: "/set-quantities-by-warehouse",
    name: "ProductsInventory",
    component: () => import("@/views/ProductsInventory.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
