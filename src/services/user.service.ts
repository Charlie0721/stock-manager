import axios from "./axios"
import { SigninInterface, LoginInterface } from '../interfaces/conexion-user.interface'
export class UserService {
    static saveUser = async (user: SigninInterface) => await axios.post(`/users/signin`, user)
    static loginUser = async (user: LoginInterface) => await axios.post(`/users/login`, user)
}
