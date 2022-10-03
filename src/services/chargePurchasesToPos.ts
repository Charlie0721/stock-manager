import axios from './axios';
import { IHeaderPurchases } from '../interfaces/recordPurchases.interface'

export class Purchases {
    /**Metodo para obtener los proveedores */
    static getSuppliers = async () => await axios.get('/purchases/get-suppliers')
    /**Metodo para obtener los almacenes activos */
    static getWarehouses = async () => await axios.get('/purchases/get-warehouses')
    /**Metodo para obtener los productos activos */
    static getProductsByApp = async () => await axios.get('/purchases/get-products')
    /**obtener datos de iva en compras */
    static getTaxes = async () => await axios.get('/purchases/get-taxes')
    /**Guardar la compra */
    static setHeadertoPurchase = async (data: IHeaderPurchases) => await axios.post('/purchases/send-headers', data)
    /**Obtener el consecutivo de compra */
    static getNumberPurchase = async (idalmacen: number) => await axios.get('/purchases/get-number/' + idalmacen)
    /**Obtener id de compra */
    static getIdPurshable = async () => await axios.get('/purchases/get-id')

}



