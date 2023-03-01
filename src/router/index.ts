import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [

  {
    path: '/',
    //redirect: '/tabs/tab1'
    name: 'connectApi',
    component: () => import('@/views/connectApi.vue'),

  },
  {
    path: '/warehouse-for-orders',
    name: 'warehouse',
    component: () => import('@/views/warehouseForOrders.vue'),

  },

  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      },
      {
        path: '/enter-purchases',
        name: 'send-purshable',
        component: () => import('@/views/send-purshable.vue')

      },
      {
        path: '/trade-orders',
        name: 'TradeOrde',
        component: () => import('@/views/tradeOrders.vue'),
      },
    ]
  },
  {
    path: '/edit-product/:id',
    name: 'EditP',
    component: () => import('@/views/EditProduct.vue'),
  },
  {

    path: '/view-order/:number/:idalmacen',
    name: 'viewOrder',
    component: () => import('@/views/viewOrderByNumber.vue'),

  },
  {

    path: '/data-collector',
    name: 'dataCollector',
    component: () => import('@/views/dataCollector.vue'),

  },
  {

    path: '/data-collector/transfers',
    name: 'dataCollector-transfers',
    component: () => import('@/views/data-collector-transfers.vue'),

  },

  {

    path: '/control-suscription',
    name: 'control-suscription',
    component: () => import('@/views/controlSuscription.vue'),

  },
  {
    path: '/transfers',
    name: 'transfers',
    component: () => import('@/views/transfers.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
