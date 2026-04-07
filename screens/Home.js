import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  TextInput,
  SafeAreaView,
  Alert,
} from "react-native";
import { useState } from "react";
import * as Clipboard from "expo-clipboard";
import { buscarHistorico, salvarSenha } from "../services/storage.js";
import { logoutUsuario } from "../services/auth";

const SENHA_PADRAO = "Gere sua senha!";

export default function Home({ navigation }) {
  const [senha, setSenha] = useState(SENHA_PADRAO);
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeAplicativo, setNomeAplicativo] = useState("");
  const [saveError, setSaveError] = useState(null);

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

  const criarSenha = async () => {
    if (!podeCriar) return;
    try {
      await salvarSenha({ nomeAplicativo: nomeAplicativo.trim(), senha });
  setSaveError(null);
  fecharModal();
    } catch (err) {
  const msg = err?.details?.mensagem || err?.message || "Erro ao salvar senha";
  // show inline error in modal
  setSaveError(msg);
  // also alert for visibility
  Alert.alert("Erro", msg);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.header}>
          <Text style={styles.title}>Gerador de senha</Text>
          <Pressable
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: "SignIn" }],
              })
            }
          >
            <Text style={styles.logout}>Sair</Text>
          </Pressable>
        </View>

        <View style={styles.passwordBox}>
          <Text style={styles.passwordLabel}>Senha gerada</Text>
          <Text style={styles.passwordText}>{senha}</Text>
        </View>

        <View style={styles.buttonsArea}>
          <Pressable style={styles.button} onPress={generatePassword}>
            <Text style={styles.buttonText}>Gerar senha</Text>
          </Pressable>

          <Pressable
            style={[styles.button, !senhaGerada && styles.buttonDisabled]}
            onPress={abrirModal}
            disabled={!senhaGerada}
          >
            <Text style={styles.buttonText}>Salvar</Text>
          </Pressable>

          <Pressable
            style={[styles.button, !senhaGerada && styles.buttonDisabled]}
            onPress={copyToClipboard}
            disabled={!senhaGerada}
          >
            <Text style={styles.buttonText}>Copiar senha</Text>
          </Pressable>

          <Pressable
            style={styles.outlineButton}
            onPress={() => navigation.navigate("Historico")}
          >
            <Text style={styles.outlineButtonText}>Acessar histórico</Text>
          </Pressable>
        </View>

        <Modal
          animationType="fade"
          transparent
          visible={modalVisible}
          onRequestClose={fecharModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Salvar senha</Text>

              <Text style={styles.label}>Nome do aplicativo</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex.: Gmail, Steam, Instagram..."
                placeholderTextColor="#7A7A7A"
                value={nomeAplicativo}
                onChangeText={(text) => {
                  setNomeAplicativo(text);
                  if (saveError) setSaveError(null);
                }}
              />

              {saveError ? (
                <Text style={styles.errorText}>{saveError}</Text>
              ) : null}

              <Text style={styles.label}>Senha gerada</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={senha}
                editable={false}
              />

              <Pressable
                style={[
                  styles.modalButton,
                  !podeCriar && styles.buttonDisabled,
                ]}
                onPress={criarSenha}
                disabled={!podeCriar}
              >
                <Text style={styles.buttonText}>Criar</Text>
              </Pressable>

              <Pressable style={styles.cancelButton} onPress={fecharModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#121212",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    justifyContent: "center",
  },
  header: {
    position: "absolute",
    top: 18,
    left: 24,
    right: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },
  logout: {
    color: "#FF7A00",
    fontSize: 16,
    fontWeight: "700",
  },
  passwordBox: {
    backgroundColor: "#232323",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2C2C2C",
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  passwordLabel: {
    color: "#B3B3B3",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  passwordText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
  },
  buttonsArea: {
    gap: 12,
  },
  button: {
    backgroundColor: "#FF7A00",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  outlineButton: {
    backgroundColor: "#2A2A2A",
    borderWidth: 1,
    borderColor: "#3A3A3A",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  outlineButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalBox: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#232323",
    borderRadius: 18,
    padding: 22,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 18,
  },
  label: {
    marginBottom: 8,
    fontWeight: "600",
    color: "#B3B3B3",
  },
  errorText: {
    color: "#FF6B6B",
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#2C2C2C",
    backgroundColor: "#1E1E1E",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#FFFFFF",
    marginBottom: 14,
  },
  disabledInput: {
    backgroundColor: "#121212",
    color: "#B3B3B3",
  },
  modalButton: {
    backgroundColor: "#FF7A00",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 6,
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  cancelButtonText: {
    color: "#B3B3B3",
    fontSize: 15,
    fontWeight: "600",
  },
});
