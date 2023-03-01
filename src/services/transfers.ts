import axios from "./axios"
import { ITransfer } from '../interfaces/transfers.interface'

export class TransfersToApp {

    /**Metodo para obtener los almacenes activos */
    static getWarehouses = async () => await axios.get('/transfers/warehouses')

    /**Metodo para obtener el numero de traslado */
    static getNumberTransfer = async () => await axios.get('/transfers/number-transfer-origin')

    /**Metodo para crear el traslado */
    static sendTransfers = async (data: ITransfer) => {
        await this.getIdTransfer()
        await axios.post('/transfers/send-transfer-origin', data)
    }

    /**Metodo para obtener el id del traslado*/
    static getIdTransfer = async () => await axios.get('/transfers/get-id')

    /**Metodo para obtener los  productos */
    static getAllProducts = async (id: number, limit: number, page: number, descripcion: string, barcode: string) => axios.get(`/transfers/products/${id}?limit=${limit}&page=${page}&descripcion=${descripcion}&barcode=${barcode} `)

}