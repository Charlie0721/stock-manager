
import axios from './axios';
import { ISearchByBarcodeToCollector } from '../interfaces/barcode.interface'


export class BarcodeCollectorSearch {

    static searchProductBarcode = async (barcode: ISearchByBarcodeToCollector) => await axios.post('/data-collector', barcode);
    static generateTxtFile = async (data: any) => await axios.post('/data-collector/create-file', data)
    static getWarehouses = async () => await axios.get('/data-collector/transfers');
    static generateTxtFileTransfers=async(data:any)=>axios.post('/data-collector/transfers', data)

}

