import { View, Text, Pressable, StyleSheet, SafeAreaView } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { buscarHistorico, salvarHistorico } from "../services/storage";

export default function Historico({ navigation }) {
  const [historico, setHistorico] = useState([]);
  const [visiveis, setVisiveis] = useState({});

  const carregarHistorico = async () => {
    const dados = await buscarHistorico();
    setHistorico(dados);
    setVisiveis({});
  };

  useFocusEffect(
    useCallback(() => {
      carregarHistorico();
    }, []),
  );

  const alternarVisibilidade = (id) => {
    setVisiveis((estadoAnterior) => ({
      ...estadoAnterior,
      [id]: !estadoAnterior[id],
    }));
  };

  const copiarSenha = async (senha) => {
    await Clipboard.setStringAsync(senha);
  };

  const deletarSenha = async (id) => {
    const novoHistorico = historico.filter((item) => item.id !== id);
    setHistorico(novoHistorico);
    await salvarHistorico(novoHistorico);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.title}>Histórico de senhas</Text>

          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>Voltar</Text>
          </Pressable>
        </View>

        {historico.length === 0 ? (
          <Text style={styles.empty}>Você ainda não possui senhas salvas.</Text>
        ) : (
          <View style={styles.lista}>
            {historico.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.infoArea}>
                  <Text style={styles.appText}>{item.nomeAplicativo}</Text>
                  <Text style={styles.senhaText}>
                    {visiveis[item.id] ? item.senha : "••••••••••••"}
                  </Text>
                </View>

                <View style={styles.actions}>
                  <Pressable
                    onPress={() => alternarVisibilidade(item.id)}
                    style={styles.iconButton}
                  >
                    <Text style={styles.icon}>
                      {visiveis[item.id] ? "🙈" : "👁️"}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => copiarSenha(item.senha)}
                    style={styles.iconButton}
                  >
                    <Text style={styles.icon}>📋</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => deletarSenha(item.id)}
                    style={styles.iconButton}
                  >
                    <Text style={styles.icon}>🗑️</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
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
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f7275",
  },
  backText: {
    color: "#dd830e",
    fontSize: 16,
    fontWeight: "700",
  },
  lista: {
    width: "100%",
  },
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dff5e9",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoArea: {
    flex: 1,
    paddingRight: 10,
  },
  appText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f7275",
    marginBottom: 8,
  },
  senhaText: {
    fontSize: 15,
    color: "#537070",
    fontWeight: "600",
    letterSpacing: 0.7,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  iconButton: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 21,
  },
  empty: {
    color: "#537070",
    textAlign: "center",
    marginTop: 30,
    fontSize: 15,
  },
});
