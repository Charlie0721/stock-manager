import { TUpdateProductsInventory } from "@/interfaces/update-products-inventory.type";
import axios from "./axios";

export class ProductsInventoryService {
  public async paginateProductsInventory(
    warehouseId: number,
    limit: number,
    page: number,
    descripcion: string,
    barcode: string
  ) {
    return await axios.get(
      `get-quantities-by-warehouse/${warehouseId}/stock?limit=${limit}&page=${page}&descripcion=${descripcion}&barcode=${barcode}`
    );
  }

  public async updateProductsInventory(
    warehouseId: number,
    updateProductsInventory: TUpdateProductsInventory
  ) {
    return await axios.put(
      `/set-quantities-by-warehouse/${warehouseId}/stock`,
      updateProductsInventory
    );
  }
}
