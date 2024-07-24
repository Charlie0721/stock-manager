import axios from "./axios";
import { IStockManagerParams } from "../interfaces/stock_manager_params.interface";

export class StockManagerParamsService {
  public async create(uuid: string, iStockManagerParams: IStockManagerParams) {
    return await axios.post(
      `/stock-manager-params/${uuid}`,
      iStockManagerParams
    );
  }

  public async findOne(Uuid_Usuario: string) {
    return await axios.get(`/stock-manager-params/${Uuid_Usuario}`);
  }
}
