import axios from "./axios"
import { ItradeOrderHeader } from '../interfaces/traderOrder.interface'
import { IcreateClient } from '../interfaces/createClient.interface';
export class tradeOrders {

    static getWarehouse = async () => await axios.get('/trade-order/warehouse')
    static getNumber = async (id: number) => await axios.get('/trade-order/number/' + id)
    static getCustomers = async () => await axios.get('/trade-order/customer')
    static getEmployee = async () => await axios.get('/trade-order/employee')
    static getProducts = async (id: number) => await axios.get('/trade-order/product/' + id)
    static getIdTradeOrder = async () => await axios.get('/trade-order/get-id')
    static saveOrder = async (data: ItradeOrderHeader) =>{
        this.getIdTradeOrder()
        await axios.post('/trade-order/header', data)
    } 
    static getOrderByNumberAndWarehouse = async (number: number, idalmacen: number) => await axios.get('/trade-order/get-order/' + number + '/' + idalmacen)
    static saveClientToOrder = async (client: IcreateClient) => await axios.post('/trade-order/create-client', client)
}
