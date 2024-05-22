import axios from "axios";
export const IMGURL = "http://localhost:8000/uploads";
// http://localhost:9090/
let utag = true;
const axiosInstance = axios.create({
  baseURL:
    utga === true
      ? "http://localhost:8000/api/v1"
      : "http://localhost:8000/api/v1",
  // baseURL: "http://localhost:5000",
  // timeout: 5000 // Set a timeout for requests (in milliseconds)
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
