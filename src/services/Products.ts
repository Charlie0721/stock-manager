import axios from "./axios"

export class Products {


    static getAllProductsFromAplication = async (limit:number, page:number, descripcion:string, barcode:string ) => await axios.get(`/all-products?limit=${limit}&page=${page}&descripcion=${descripcion}&barcode=${barcode}`)


}