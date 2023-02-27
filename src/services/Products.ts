import axios from "./axios"

export class Products {

    /**Este metodo trae todos los productos activos de conexion POS */
    static getAllProductsFromAplication = async (limit:number, page:number, descripcion:string, barcode:string ) => await axios.get(`/all-products?limit=${limit}&page=${page}&descripcion=${descripcion}&barcode=${barcode}`)


}