import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  Pressable,
  Modal,
  TextInput,
  SafeAreaView,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import * as Clipboard from "expo-clipboard";

import { logoutUsuario } from "../services/auth";
import { useSenhasStore } from "../stores/senhasStore";

const SENHA_PADRAO = "Gere sua senha!";

export default function Home({ navigation }) {
  const [senha, setSenha] = useState(SENHA_PADRAO);
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeAplicativo, setNomeAplicativo] = useState("");
  const [saveError, setSaveError] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const adicionarSenha = useSenhasStore((state) => state.adicionarSenha);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
    });

    return unsubscribe;
  }, []);

  const senhaGerada = senha !== SENHA_PADRAO;

  const handleLogout = async () => {
    await logoutUsuario();
    navigation.reset({
      index: 0,
      routes: [{ name: "SignIn" }],
    });
  };

  const generatePassword = () => {
    let password = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*?";
    const passwordLength = 12;

    for (let i = 0; i < passwordLength; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }

    setSenha(password);
  };

  const copyToClipboard = async () => {
    if (!senhaGerada) return;
    await Clipboard.setStringAsync(senha);
  };

  const abrirModal = () => {
    if (!senhaGerada) return;
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setNomeAplicativo("");
    setSaveError(null);
  };

  const podeCriar = nomeAplicativo.trim() !== "" && senhaGerada;
  const textoConexao =
    isOnline ? "Online" : "Offline - dados salvos localmente";

  const criarSenha = () => {
    if (!podeCriar) {
      Alert.alert("Atencao", "Informe o nome do aplicativo.");
      return;
    }

    try {
      adicionarSenha({
        nomeAplicativo: nomeAplicativo.trim(),
        senha,
      });
      setSaveError(null);
      fecharModal();
    } catch (err) {
      const msg = err?.message || "Erro ao salvar senha localmente";
      setSaveError(msg);
      Alert.alert("Erro", msg);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center px-6 pb-8 pt-5">
        <StatusBar style="light" />

        <View className="absolute left-6 right-6 top-[18px]">
          <View className="flex-row items-center justify-between">
            <Text className="text-[28px] font-bold text-white">
              Gerador de senha
            </Text>
            <Pressable onPress={handleLogout}>
              <Text className="text-base font-bold text-primary">Sair</Text>
            </Pressable>
          </View>

          <Text
            className={`mt-2 text-[13px] font-semibold ${
              isOnline ? "text-muted" : "text-danger"
            }`}
          >
            {textoConexao}
          </Text>
        </View>

        <View className="mb-7 rounded-[20px] border border-border bg-surface px-5 py-7">
          <Text className="mb-2.5 text-center text-sm text-muted">
            Senha gerada
          </Text>
          <Text className="text-center text-[22px] font-bold text-white">
            {senha}
          </Text>
        </View>

        <View className="gap-3">
          <Pressable
            className="items-center rounded-[14px] bg-primary py-3.5"
            onPress={generatePassword}
          >
            <Text className="text-base font-bold text-white">Gerar senha</Text>
          </Pressable>

          <Pressable
            className={`items-center rounded-[14px] bg-primary py-3.5 ${
              !senhaGerada ? "opacity-[0.45]" : ""
            }`}
            onPress={abrirModal}
            disabled={!senhaGerada}
          >
            <Text className="text-base font-bold text-white">Salvar</Text>
          </Pressable>

          <Pressable
            className={`items-center rounded-[14px] bg-primary py-3.5 ${
              !senhaGerada ? "opacity-[0.45]" : ""
            }`}
            onPress={copyToClipboard}
            disabled={!senhaGerada}
          >
            <Text className="text-base font-bold text-white">Copiar senha</Text>
          </Pressable>

          <Pressable
            className="items-center rounded-[14px] border border-borderStrong bg-surfaceMuted py-3.5"
            onPress={() => navigation.navigate("Historico")}
          >
            <Text className="text-base font-bold text-white">
              Acessar historico
            </Text>
          </Pressable>
        </View>

        <Modal
          animationType="fade"
          transparent
          visible={modalVisible}
          onRequestClose={fecharModal}
        >
          <View className="flex-1 items-center justify-center bg-black/70 px-6">
            <View className="w-full max-w-[420px] rounded-[18px] bg-surface p-[22px]">
              <Text className="mb-[18px] text-center text-[22px] font-bold text-white">
                Salvar senha
              </Text>

              <Text className="mb-2 font-semibold text-muted">
                Nome do aplicativo
              </Text>
              <TextInput
                className="mb-3.5 rounded-[14px] border border-border bg-surfaceAlt px-3.5 py-3.5 text-[15px] text-white"
                placeholder="Ex.: Gmail, Steam, Instagram..."
                placeholderTextColor="#7A7A7A"
                value={nomeAplicativo}
                onChangeText={(text) => {
                  setNomeAplicativo(text);
                  if (saveError) setSaveError(null);
                }}
              />

              {saveError ? (
                <Text className="mb-2 text-[13px] font-semibold text-danger">
                  {saveError}
                </Text>
              ) : null}

              <Text className="mb-2 font-semibold text-muted">
                Senha gerada
              </Text>
              <TextInput
                className="mb-3.5 rounded-[14px] border border-border bg-background px-3.5 py-3.5 text-[15px] text-muted"
                value={senha}
                editable={false}
              />

              <Pressable
                className={`mt-1.5 items-center rounded-[14px] bg-primary py-3.5 ${
                  !podeCriar ? "opacity-[0.45]" : ""
                }`}
                onPress={criarSenha}
                disabled={!podeCriar}
              >
                <Text className="text-base font-bold text-white">Criar</Text>
              </Pressable>

              <Pressable
                className="mt-2 items-center py-3"
                onPress={fecharModal}
              >
                <Text className="text-[15px] font-semibold text-muted">
                  Cancelar
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
