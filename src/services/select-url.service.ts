import axios from "./axios";
export class SelectUrlService {
  public async findAll() {
    return await axios.get(`/connect-api`);
  }
}
