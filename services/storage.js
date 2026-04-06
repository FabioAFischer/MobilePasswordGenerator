import AsyncStorage from "@react-native-async-storage/async-storage";

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

export async function buscarHistorico() {
  const chave = await getChaveUsuario();
  const dados = await AsyncStorage.getItem(chave);
  return dados ? JSON.parse(dados) : [];
}

export async function salvarHistorico(lista) {
  const chave = await getChaveUsuario();
  await AsyncStorage.setItem(chave, JSON.stringify(lista));
}
