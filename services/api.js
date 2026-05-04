import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const isWeb = Platform.OS === "web";
const defaultURL = isWeb ? "http://localhost:8080/api" : "http://10.0.2.2:8080/api";
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || defaultURL;
const TOKEN_KEY = "@app_token";

export async function apiRequest(path, options = {}) {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const error = new Error(
      data?.mensagem ||
      data?.message ||
      data?.erro ||
      data?.error ||
      "Erro ao comunicar com o servidor"
    );

    error.details = data;
    throw error;
  }

  return data;
}
