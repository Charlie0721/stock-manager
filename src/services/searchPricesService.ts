import { IEditProduct } from "@/interfaces/editproduct.interface";

import axios from "./axios"


//**Funcion para obtener los productos con sus respectivas cantidades */

export const productsQuantities= async ()=>await axios.get('/products/get-quantities')

/**Busca el listado de productos editados en compras*/
export const searchPriceByDate=async (data: any) =>await axios.post('/search-prices',data); 

/**Este metodo trae todos los productos activos de conexion POS */
export const getAllProductsFromAplication= async () => await axios.get('/all-products');

/**este metodo, edita un producto, solicita dos parametros id del articulo y el cuerpo del mismo  */
export const updateProduct=async (id: string, data:IEditProduct) =>await axios.put('/update-products/'+ id, data);

/**Funcion para obtener un producto por su ID */
export const getProductById= async (id: string) =>await axios.get('/product/'+ id);




