import axios from "./axios"
import { SigninInterface } from '../interfaces/conexion-user.interface'
export class UserService {

    static saveUser = async (user: SigninInterface) => await axios.post(`/users/signin`, user)

}
