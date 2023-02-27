import { IAddBarcodes } from "@/interfaces/barcode.interface";
import { IEditProduct } from "@/interfaces/editproduct.interface";

import axios from "./axios"


//**Funcion para obtener los productos con sus respectivas cantidades */

export const productsQuantities = async (limit: number, page: number, descripcion: string, barcode: string) => await axios.get(`/products/get-quantities?limit=${limit}&page=${page}&descripcion=${descripcion}&barcode=${barcode}`)

/**Busca el listado de productos editados en compras*/
export const searchPriceByDate = async (data: any) => await axios.post('/search-prices', data);

/**este metodo, edita un producto, solicita dos parametros id del articulo y el cuerpo del mismo  */
export const updateProduct = async (id: string, data: IEditProduct) => await axios.put('/update-products/' + id, data);

/**La siguiente función adiciona multiples codigos de barras al producto  */
export const addBarcodes = async (id: string, barcode:IAddBarcodes ) => await axios.post(`/product/add-barcodes/${id}`, barcode);

/**Funcion para obtener un producto por su ID */
export const getProductById = async (id: string) => await axios.get('/product/' + id);




