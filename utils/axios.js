import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const IMGURL = "http://localhost:8000/uploads";

let utga = true;

const axiosInstance = axios.create({
  baseURL:
    utga === true
      ? "http://localhost:8000/api/v1"
      : "http://localhost:8000/api/v1",
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error retrieving token from AsyncStorage:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
