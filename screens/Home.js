import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  TextInput,
  SafeAreaView,
} from "react-native";
import { useState } from "react";
import * as Clipboard from "expo-clipboard";
import { buscarHistorico, salvarHistorico } from "../services/storage";

const SENHA_PADRAO = "Gere sua senha!";

export default function Home({ navigation }) {
  const [senha, setSenha] = useState(SENHA_PADRAO);
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeAplicativo, setNomeAplicativo] = useState("");

  const senhaGerada = senha !== SENHA_PADRAO;

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
  };

  const podeCriar = nomeAplicativo.trim() !== "" && senhaGerada;

  const criarSenha = async () => {
    if (!podeCriar) return;

    const historicoAtual = await buscarHistorico();

    const novoItem = {
      id: Date.now().toString(),
      nomeAplicativo: nomeAplicativo.trim(),
      senha,
    };

    const novoHistorico = [novoItem, ...historicoAtual];
    await salvarHistorico(novoHistorico);

    fecharModal();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <StatusBar style="dark" />

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
                placeholderTextColor="#7a7a7a"
                value={nomeAplicativo}
                onChangeText={setNomeAplicativo}
              />

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
    backgroundColor: "#f5fff9",
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
    color: "#0f7275",
    fontSize: 28,
    fontWeight: "700",
  },
  logout: {
    color: "#dd830e",
    fontSize: 16,
    fontWeight: "700",
  },
  passwordBox: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#dff5e9",
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  passwordLabel: {
    color: "#537070",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  passwordText: {
    color: "#0f7275",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
  },
  buttonsArea: {
    gap: 12,
  },
  button: {
    backgroundColor: "#39e092",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  outlineButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#39e092",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#0f7275",
    fontWeight: "700",
    fontSize: 16,
  },
  outlineButtonText: {
    color: "#0f7275",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalBox: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 22,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f7275",
    textAlign: "center",
    marginBottom: 18,
  },
  label: {
    marginBottom: 8,
    fontWeight: "600",
    color: "#0f7275",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cfe7df",
    backgroundColor: "#f8fffb",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#183131",
    marginBottom: 14,
  },
  disabledInput: {
    backgroundColor: "#eef6f2",
    color: "#537070",
  },
  modalButton: {
    backgroundColor: "#39e092",
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
    color: "#537070",
    fontSize: 15,
    fontWeight: "600",
  },
});
