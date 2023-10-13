import axios from './axios';
import { IIngMovInvEntrada } from "@/interfaces/inventoryMovements.interface";


export class InventoryMovements {

    /**Metodo para obtener el ultimo ID insertado */
    static getIdInserted= async ()=> await axios.get('/mov-inventarios/id-movimiento')

    /**Metodo para obtener los terceros de la aplicación */
    static obtainThirdParties = async (limit:number, page:number, nombres:string, nit:string) => await axios.get(`/mov-inventarios/terceros?limit=${limit}&page=${page}&nombres=${nombres}&nit=${nit}`);

    /**Metodo para obtener los Almacenes de la aplicación */
    static obtainWarehouses = async () => await axios.get('/mov-inventarios/almacenes');

    /**Metodo para obtener el numero consecutivo segun la entrada de productos */
    static getConsecutive = async (id: string) => await axios.get('/mov-inventarios/numero-entradas/'+id);

    /**Metodo para guardar la cabecera de la entrada de productos*/
    static movementInventorySave = async (headerMovement: IIngMovInvEntrada) => await axios.post('/mov-inventarios/cabecera', headerMovement);

    /**Metodo para cargar productos y su respectiva cantidad segun el almacen */
    static getStockItem = async (id: number,limit:number, page:number, descripcion:string, barcode:string) => await axios.get(`/mov-inventarios/obetener-cantidades/${id}/stock?limit=${limit}&page=${page}&descripcion=${descripcion}&barcode=${barcode}`)
}













