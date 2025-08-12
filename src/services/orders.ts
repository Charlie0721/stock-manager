import axios from "./axios";
export class OrdersService {
  public async paginateOrders(
    warehouseId: number,
    sellerId: number,
    page: number,
    limit: number,
    date?: string,
    number?: number
  ) {
    return await axios.get(
      `trade-order/paginate-orders/${warehouseId}/${sellerId}?page=${page}&limit=${limit}&date=${date}&number=${number}`
    );
  }

  public async findOneOrder(orderId:number){
    return await axios.get(`trade-order/${orderId}`);
  }
}
