import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "./api";

const CHAVE_SENHA = "@historicoSenhas";

const getChaveUsuario = async () => {
  try {
    const usuario = await AsyncStorage.getItem("@app_user");
    if (usuario) {
      const dados = JSON.parse(usuario);
      return `${CHAVE_SENHA}_${dados.email}`;
    }
  } catch (e) {
    console.error("Erro ao obter chave de usuário", e);
  }
  return CHAVE_SENHA;
};

// Busca histórico do backend; em caso de erro, faz fallback para AsyncStorage local
export async function buscarHistorico() {
  try {
    const data = await apiRequest("/senhas", { method: "GET" });
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("buscarHistorico: erro na API, usando fallback local", err.message || err);
    const chave = await getChaveUsuario();
    const dados = await AsyncStorage.getItem(chave);
    return dados ? JSON.parse(dados) : [];
  }
}

// Salva uma senha no backend (obj = { nomeAplicativo, senha }).
// Em caso de erro, salva localmente como fallback.
export async function salvarSenha(obj) {
  if (!obj || typeof obj !== "object") {
    throw new Error("Objeto inválido para salvarSenha");
  }
  // Agora só salva no backend, sem fallback local
  return await apiRequest("/senhas", {
    method: "POST",
    body: JSON.stringify(obj),
  });
}

// Deleta senha por id no backend; fallback para remoção local
export async function deletarSenha(id) {
  try {
    await apiRequest(`/senhas/${id}`, { method: "DELETE" });
    return true;
  } catch (err) {
    console.warn("deletarSenha: erro na API, deletando localmente", err.message || err);
    const chave = await getChaveUsuario();
    const dados = await AsyncStorage.getItem(chave);
    const lista = dados ? JSON.parse(dados) : [];
    const novo = lista.filter((item) => item.id !== id);
    await AsyncStorage.setItem(chave, JSON.stringify(novo));
    return true;
  }
}
