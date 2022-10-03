import axios, { AxiosInstance } from "axios";


const endPoint = localStorage.getItem("connection");
let endPoint1;
if (typeof endPoint === "string") {
    endPoint1 = JSON.parse(endPoint);
}


const axiosIntance: AxiosInstance = axios.create({

    baseURL: `${endPoint1}`,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',

    },
});


export default axiosIntance