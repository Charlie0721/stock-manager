import axios from "./axios";
import { MoneyCollectionsInterface } from "../interfaces/money-collections.interface";
export class MoneyCollectionsService {
  async create(moneyCollectionsInterface: MoneyCollectionsInterface) {
    return await axios.post(`/money-collections`, moneyCollectionsInterface);
  }
  async findOne(moneyCollectionId: number) {
    return await axios.get(`/money-collections/${moneyCollectionId}`);
  }

  async checkAccountsReceivableByCustomer(customerId: number) {
    return await axios.get(`/money-collections/customer/${customerId}`);
  }
}
