import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "./api";

const TOKEN_KEY = "@app_token";
const USER_KEY = "@app_user";

export async function registrarUsuario({ nome, email, senha }) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      nome,
      email,
      senha,
    }),
  });
}

export async function loginUsuario({ email, senha }) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      senha,
    }),
  });

  if (data.token) {
    await AsyncStorage.setItem(TOKEN_KEY, data.token);
  }

  const user = data.user || data.usuario;
  if (user) {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  return data;
}

export async function logoutUsuario() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}

export async function obterToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function obterUsuarioLogado() {
  const user = await AsyncStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}