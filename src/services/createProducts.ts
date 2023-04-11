import axios from './axios';
import { ProductsI } from '../interfaces/CreateProducts.interface'

export class CreateProduct {
    /**Metodo para obtener codigo del producto segun la linea  */
    static getCode = async (code: string) => await axios.get(`/products-get-code?codigo=${code}`)
    /**Metodo para obtener las unidades de medida  */
    static getLevels = async (limit: number, page: number, nombre: string) => await axios.get(`/products-levels?limit=${limit}&page=${page}&nombre=${nombre}`)
      /**Metodo para obtener el ultimo id del producto */
     static getProductId=async()=>await axios.get('/products-get-productid') 
    /**Metodo para obtener la estructura de productos  */
    static getStructure = async () => await axios.get(`/products-structure`)
    /**Metodo para obtener las unidades de medida  */
    static getUnitsOfMeasure = async () => await axios.get('/products-unit-of-measure')
    /**Metodo para obtener las tarifas de iva en compras */
    static getTaxShopping = async () => await axios.get('/products-tax-shopping')
    /**Metodo para obtener las tarifas de iva en venta */
    static getTaxSales = async () => await axios.get('/products-tax-sales')
    /**Metodo para crear el producto */
    static saveProduct = async (data: ProductsI) => await axios.post('/products-create-product', data)
}