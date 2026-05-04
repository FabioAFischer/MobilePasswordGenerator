import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";

const isWeb = Platform.OS === "web";
const defaultURL = isWeb ? "http://localhost:8080/api" : "http://10.0.2.2:8080/api";
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || defaultURL;
const TOKEN_KEY = "@app_token";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function apiRequest(path, options = {}) {
  const method = options.method || "GET";
  const headers = options.headers || {};
  const body =
    typeof options.body === "string" ? JSON.parse(options.body) : options.body;

  try {
    const response = await api.request({
      url: path,
      method,
      headers,
      data: body,
    });

    return response.data;
  } catch (err) {
    const data = err.response?.data;
    const error = new Error(
      data?.mensagem ||
        data?.message ||
        data?.erro ||
        data?.error ||
        err.message ||
        "Erro ao comunicar com o servidor",
    );

    error.details = data;
    throw error;
  }
}

export default api;
