import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE = "@historicoSenhas";

export async function buscarHistorico() {
  const dados = await AsyncStorage.getItem(CHAVE);
  return dados ? JSON.parse(dados) : [];
}

export async function salvarHistorico(lista) {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(lista));
}
