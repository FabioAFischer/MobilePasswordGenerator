import { View, Text, Pressable, SafeAreaView } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { buscarHistorico, deletarSenha as deletarSenhaService } from "../services/storage.js";

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

  const handleDeletarSenha = async (id) => {
    try {
      await deletarSenhaService(id);
      setHistorico((prev) => prev.filter((item) => item.id !== id));
      setVisiveis((v) => {
        const copy = { ...v };
        delete copy[id];
        return copy;
      });
    } catch (err) {
      console.warn("Erro ao deletar senha:", err.message || err);
      setHistorico((prev) => prev.filter((item) => item.id !== id));
      setVisiveis((v) => {
        const copy = { ...v };
        delete copy[id];
        return copy;
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-5 pt-[18px]">
        <View className="mb-6 flex-row items-center justify-between">
          <Text className="text-[28px] font-bold text-white">
            Histórico de senhas
          </Text>

          <Pressable onPress={() => navigation.goBack()}>
            <Text className="text-base font-bold text-primary">Voltar</Text>
          </Pressable>
        </View>

        {historico.length === 0 ? (
          <Text className="mt-[30px] text-center text-[15px] text-muted">
            Você ainda não possui senhas salvas.
          </Text>
        ) : (
          <View className="w-full">
            {historico.map((item) => (
              <View
                key={item.id}
                className="mb-3.5 w-full flex-row items-center justify-between rounded-[18px] border border-border bg-surface px-[18px] py-[18px]"
              >
                <View className="flex-1 pr-2.5">
                  <Text className="mb-2 text-[17px] font-bold text-white">
                    {item.nomeAplicativo}
                  </Text>
                  <Text className="text-[15px] font-semibold tracking-[0.7px] text-muted">
                    {visiveis[item.id] ? item.senha : "••••••••••••"}
                  </Text>
                </View>

                <View className="flex-row items-center gap-1">
                  <Pressable
                    onPress={() => alternarVisibilidade(item.id)}
                    className="h-[42px] w-[42px] items-center justify-center"
                  >
                    <Text className="text-[21px]">
                      {visiveis[item.id] ? "🙈" : "👁️"}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => copiarSenha(item.senha)}
                    className="h-[42px] w-[42px] items-center justify-center"
                  >
                    <Text className="text-[21px]">📋</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleDeletarSenha(item.id)}
                    className="h-[42px] w-[42px] items-center justify-center"
                  >
                    <Text className="text-[21px]">🗑️</Text>
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
