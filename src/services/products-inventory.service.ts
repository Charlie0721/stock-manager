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
}
