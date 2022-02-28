import axios, { AxiosInstance } from "axios";

const headers = {
  "Content-type": "application/json",
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
};
const axiosConfig = {
  baseURL: "https://wingi-api.herokuapp.com/",
  // baseURL: "http://wingi-api.test/api",
  headers: headers,
};
const apiClient: AxiosInstance = axios.create(axiosConfig);
// console.log(axiosConfig);
export default apiClient;