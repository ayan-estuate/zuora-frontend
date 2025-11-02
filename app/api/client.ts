// // app/api/client.ts
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios, { isAxiosError } from "axios";
// import { API_BASE } from "./config";
// import { notifyUnauthorized } from "../authSession";

// const api = axios.create({ baseURL: API_BASE, timeout: 15000 });

// api.interceptors.request.use(
//   async (cfg) => {
//     const token = await AsyncStorage.getItem("APP_TOKEN");
//     if (token && cfg.headers) cfg.headers.Authorization = `Bearer ${token}`;
//     return cfg;
//   },
//   (err) => Promise.reject(err)
// );

// export default api;

// export function handleAPIError(error: unknown) {
//   if (isAxiosError(error) && error.response?.data?.message) {
//     throw new Error(error.response.data.message);
//   }
//   throw new Error("Backend not available. Please try again later.");
// }

// // Handle 401 globally: clear stored session and notify app
// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     if (isAxiosError(error) && error.response?.status === 401) {
//       try {
//         await AsyncStorage.removeItem("APP_TOKEN");
//         await AsyncStorage.removeItem("APP_USER");
//       } catch {}
//       notifyUnauthorized();
//     }
//     return Promise.reject(error);
//   }
// );
// app/api/client.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { isAxiosError } from 'axios';
import { API_BASE } from './config';
import { notifyUnauthorized } from '../authSession';

const api = axios.create({ baseURL: API_BASE, timeout: 15000 });

// Inject JWT token automatically
api.interceptors.request.use(
  async (cfg) => {
    const token = await AsyncStorage.getItem('APP_TOKEN');
    if (token && cfg.headers) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
  },
  (err) => Promise.reject(err),
);

// Handle global unauthorized (401)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      try {
        await AsyncStorage.removeItem('APP_TOKEN');
        await AsyncStorage.removeItem('APP_USER');
      } catch {}
      notifyUnauthorized();
    }
    return Promise.reject(error);
  },
);

export default api;

export function handleAPIError(error: unknown) {
  if (isAxiosError(error) && error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error('Backend not available. Please try again later.');
}
