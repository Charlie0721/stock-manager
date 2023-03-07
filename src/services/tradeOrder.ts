import axios from "./axios"
import { ItradeOrderHeader } from '../interfaces/traderOrder.interface'
import { IcreateClient } from '../interfaces/createClient.interface';
export class TradeOrders {

    static getWarehouse = async () => await axios.get('/trade-order/warehouse')
    static getNumber = async (id: number) => await axios.get('/trade-order/number/' + id)
    static getCustomers = async (limit:number, page:number, nombres:string, nit:string) => await axios.get(`/trade-order/customer?limit=${limit}&page=${page}&nombres=${nombres}&nit=${nit}`)
    static getEmployee = async () => await axios.get('/trade-order/employee')
    static getProducts = async (id: number,limit:number, page:number, descripcion:string, barcode:string) => await axios.get(`/trade-order/product/${id}?limit=${limit}&page=${page}&descripcion=${descripcion}&barcode=${barcode}` )
    static getIdTradeOrder = async () => await axios.get('/trade-order/get-id')
    static saveOrder = async (data: ItradeOrderHeader) =>{
        this.getIdTradeOrder()
        await axios.post('/trade-order/header', data)
    } 
    static getOrderByNumberAndWarehouse = async (number: number, idalmacen: number) => await axios.get('/trade-order/get-order/' + number + '/' + idalmacen)
    static saveClientToOrder = async (client: IcreateClient) => await axios.post('/trade-order/create-client', client)
}
