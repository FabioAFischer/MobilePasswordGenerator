import { View, Text, Pressable, SafeAreaView, ScrollView } from "react-native";
import { useState } from "react";
import * as Clipboard from "expo-clipboard";

import { useSenhas } from "../context/SenhasContext";
import CopyIcon from "../components/icons/CopyIcon";
import ShowIcon from "../components/icons/ShowIcon";

export default function Historico({ navigation }) {
  const [visiveis, setVisiveis] = useState({});
  const { senhas, removerSenha, isOnline } = useSenhas();

  const alternarVisibilidade = (id) => {
    setVisiveis((estadoAnterior) => ({
      ...estadoAnterior,
      [id]: !estadoAnterior[id],
    }));
  };

  const copiarSenha = async (senha) => {
    await Clipboard.setStringAsync(senha);
  };

  const handleDeletarSenha = (id) => {
    removerSenha(id);
    setVisiveis((v) => {
      const copy = { ...v };
      delete copy[id];
      return copy;
    });
  };

  const textoConexao =
    isOnline === false ? "Offline - dados salvos localmente" : "Online";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-5 pt-[18px]">
        <View className="mb-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-[28px] font-bold text-white">
              Historico de senhas
            </Text>

            <Pressable onPress={() => navigation.goBack()}>
              <Text className="text-base font-bold text-primary">Voltar</Text>
            </Pressable>
          </View>

          <Text
            className={`mt-2 text-[13px] font-semibold ${
              isOnline === false ? "text-danger" : "text-muted"
            }`}
          >
            {textoConexao}
          </Text>
        </View>

        {senhas.length === 0 ? (
          <Text className="mt-[30px] text-center text-[15px] text-muted">
            Voce ainda nao possui senhas salvas.
          </Text>
        ) : (
          <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
            {senhas.map((item) => (
              <View
                key={item.id}
                className="mb-3.5 w-full rounded-[18px] border border-border bg-surface px-[18px] py-[18px]"
              >
                <View className="mb-3 flex-row items-start justify-between gap-3">
                  <View className="flex-1">
                    <Text className="mb-2 text-[17px] font-bold text-white">
                      {item.nomeAplicativo}
                    </Text>
                    <Text className="text-[15px] font-semibold tracking-[0.7px] text-muted">
                      {visiveis[item.id] ? item.senha : "************"}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-1">
                    <Pressable
                      onPress={() => alternarVisibilidade(item.id)}
                      className="h-[42px] w-[42px] items-center justify-center"
                    >
                      <ShowIcon color="#FF7A00" />
                    </Pressable>

                    <Pressable
                      onPress={() => copiarSenha(item.senha)}
                      className="h-[42px] w-[42px] items-center justify-center"
                    >
                      <CopyIcon color="#FF7A00" />
                    </Pressable>

                    <Pressable
                      onPress={() => handleDeletarSenha(item.id)}
                      className="h-[42px] w-[42px] items-center justify-center"
                    >
                      <Text className="text-[22px] font-bold text-danger">X</Text>
                    </Pressable>
                  </View>
                </View>

                <View className="flex-row flex-wrap items-center justify-between gap-2">
                  <Text className="text-[12px] font-semibold text-muted">
                    {new Date(item.createdAt).toLocaleString("pt-BR")}
                  </Text>

                  <Text
                    className={`rounded-[12px] px-3 py-1 text-[12px] font-bold ${
                      item.pending
                        ? "bg-surfaceMuted text-primary"
                        : "bg-surfaceAlt text-muted"
                    }`}
                  >
                    {item.pending ? "Pendente" : "Sincronizado"}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
