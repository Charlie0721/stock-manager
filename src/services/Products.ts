import axios from "./axios"

export class Products {


    static getAllProductsFromAplication = async () => await axios.get('/all-products')


}