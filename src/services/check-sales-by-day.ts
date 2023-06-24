import axios from './axios';
import { CheckSales } from '../interfaces/checkSales.interface'


export class CheckSalesOfTheDay {

    static checkSales = async (initialDate: CheckSales) => await axios.post(`/sales/search-sales-by-day`, initialDate)

}