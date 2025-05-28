import axios, { AxiosInstance } from "axios";

// let baseURL = "";
// const connection = localStorage.getItem("connection");

// if (connection) {
//   try {
//     baseURL = JSON.parse(connection);
//   } catch {
//     baseURL = "";
//   }
// }

// const axiosInstance: AxiosInstance = axios.create({
//   baseURL,
//   withCredentials: false,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default axiosInstance;

const endPoint = localStorage.getItem("connection");
let endPoint1;
if (typeof endPoint === "string") {
  endPoint1 = JSON.parse(endPoint);
}
const axiosIntance: AxiosInstance = axios.create({
  baseURL: `${endPoint1}`,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosIntance;
