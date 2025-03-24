import axios from "./axios"
import { ItradeOrderHeader } from '../interfaces/traderOrder.interface'
import { IcreateClient,INeighborhoodsInterface} from '../interfaces/createClient.interface';
export class TradeOrders {

    static getWarehouse = async () => await axios.get('/trade-order/warehouse')
    static getNumber = async (id: number): Promise<number> => {
        try {
            const response = await axios.get(`/trade-order/number/${id}`);
            return response.data.numero;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    static getCustomers = async (limit: number, page: number, nombres: string, nit: string) => await axios.get(`/trade-order/customer?limit=${limit}&page=${page}&nombres=${nombres}&nit=${nit}`)
    static getEmployee = async () => await axios.get('/trade-order/employee')
    static getProducts = async (id: number, limit: number, page: number, descripcion: string, barcode: string) => await axios.get(`/trade-order/product/${id}?limit=${limit}&page=${page}&descripcion=${descripcion}&barcode=${barcode}`)
    static getIdTradeOrder = async () => await axios.get('/trade-order/get-id')
    static saveOrder = async (data: ItradeOrderHeader) => {
        try {
          const response = await axios.post('/trade-order/header', data);
          return response.data; 
        } catch (error) {
          console.error(error);
          throw error; 
        }
      }
    static getAllCountries = async () => await axios.get('/orders/countries')
    static getAlldepartments = async () => await axios.get('/orders/departments')
    static getAllNeighborhoods = async () => await axios.get('/orders/neighborhoods')
    static getAllMunicipalities = async () => await axios.get('/orders/municpalities')
    static getOrderByNumberAndWarehouse = async (number: number, idalmacen: number) => await axios.get('/trade-order/get-order/' + number + '/' + idalmacen)
    static printOrderToPdfByNumberAndWarehouse = async (number, idalmacen) => {
      return await axios.get(`/trade-order/get-order/send-pdf/${number}/${idalmacen}`, {
        responseType: 'blob', // Importante: indica que es un archivo binario
      });
    };
    
    static saveClientToOrder = async (client: IcreateClient) => await axios.post('/trade-order/create-client', client)
    static createNeighborhoods=async(data: INeighborhoodsInterface) => await axios.post('/orders/neighborhoods', data)
}
