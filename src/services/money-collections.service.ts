import axios from "./axios";
import { MoneyCollectionsInterface } from "../interfaces/money-collections.interface";
export class MoneyCollectionsService {
  async create(moneyCollectionsInterface: MoneyCollectionsInterface) {
    return await axios.post(`/money-collections`, moneyCollectionsInterface);
  }
}
