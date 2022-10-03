import axios from './axios';
import { IIngMovInvEntrada } from "@/interfaces/inventoryMovements.interface";


export class InventoryMovements {

    /**Metodo para obtener el ultimo ID insertado */
    static getIdInserted= async ()=> await axios.get('/mov-inventarios/id-movimiento')

    /**Metodo para obtener los terceros de la aplicación */
    static obtainThirdParties = async () => await axios.get('/mov-inventarios/terceros');

    /**Metodo para obtener los Almacenes de la aplicación */
    static obtainWarehouses = async () => await axios.get('/mov-inventarios/almacenes');

    /**Metodo para obtener el numero consecutivo segun la entrada de productos */
    static getConsecutive = async (id: string) => await axios.get('/mov-inventarios/numero-entradas/'+id);

    /**Metodo para guardar la cabecera de la entrada de productos*/
    static movementInventorySave = async (headerMovement: IIngMovInvEntrada) => await axios.post('/mov-inventarios/cabecera', headerMovement);

    /**Metodo para cargar productos y su respectiva cantidad segun el almacen */
    static getStockItem = async (id: number) => await axios.get('/mov-inventarios/obetener-cantidades/' + id)

}













