import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_SENHA = "@historicoSenhas";

export async function getChaveUsuario() {
  try {
    const usuario = await AsyncStorage.getItem("@app_user");
    if (usuario) {
      const dados = JSON.parse(usuario);
      if (dados?.email) {
        return `${CHAVE_SENHA}_${dados.email}`;
      }
    }
  } catch (error) {
    console.warn("Erro ao obter chave de usuario:", error);
  }

  return CHAVE_SENHA;
}

export async function buscarHistorico() {
  const chave = await getChaveUsuario();
  const dados = await AsyncStorage.getItem(chave);
  return dados ? JSON.parse(dados) : [];
}

export async function salvarSenha(obj) {
  if (!obj || typeof obj !== "object") {
    throw new Error("Objeto invalido para salvarSenha");
  }

  const chave = await getChaveUsuario();
  const historico = await buscarHistorico();
  const novaSenha = {
    id: String(obj.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`),
    nomeAplicativo: obj.nomeAplicativo,
    senha: obj.senha,
    createdAt: Number(obj.createdAt) || Date.now(),
    pending: obj.pending ?? true,
  };

  await AsyncStorage.setItem(chave, JSON.stringify([novaSenha, ...historico]));
  return novaSenha;
}

export async function deletarSenha(id) {
  const chave = await getChaveUsuario();
  const lista = await buscarHistorico();
  const novo = lista.filter((item) => item.id !== id);
  await AsyncStorage.setItem(chave, JSON.stringify(novo));
  return true;
}
