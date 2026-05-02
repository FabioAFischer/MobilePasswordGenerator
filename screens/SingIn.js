import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  Alert,
} from "react-native";
import { loginUsuario } from "../services/auth";

export default function SignIn({ navigation, route }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route?.params?.email) {
      setEmail(route.params.email);
    }
  }, [route?.params?.email]);

  const podeEntrar = email.trim() !== "" && senha.trim() !== "" && !loading;

  const handleEntrar = async () => {
    if (!podeEntrar) return;

    try {
      setLoading(true);

      await loginUsuario({
        email: email.trim(),
        senha: senha.trim(),
      });
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      Alert.alert("Erro no login", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center px-7">
        <View className="mb-9 items-center">
          <View className="mb-4 h-[88px] w-[88px] items-center justify-center rounded-full bg-primary">
            <Text className="text-[34px]">🔐</Text>
          </View>
          <Text className="text-[32px] font-bold text-white">Sign in</Text>
          <Text className="mt-1.5 text-[15px] text-muted">
            Entre para continuar
          </Text>
        </View>

        <View className="rounded-[20px] border border-border bg-surface p-[22px]">
          <Text className="mb-2 mt-1.5 text-sm font-semibold text-muted">
            E-mail
          </Text>
          <TextInput
            className="mb-3 rounded-[14px] border border-border bg-surfaceAlt px-3.5 py-3.5 text-[15px] text-white"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Digite seu e-mail"
          />

          <Text className="mb-2 mt-1.5 text-sm font-semibold text-muted">
            Senha
          </Text>
          <TextInput
            className="mb-3 rounded-[14px] border border-border bg-surfaceAlt px-3.5 py-3.5 text-[15px] text-white"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            placeholder="Digite sua senha"
          />

          <Pressable
            className={`mb-[18px] mt-2.5 items-center rounded-[14px] bg-primary py-[15px] ${
              !podeEntrar ? "opacity-[0.45]" : ""
            }`}
            onPress={handleEntrar}
            disabled={!podeEntrar}
          >
            <Text className="text-base font-bold text-white">
              {loading ? "Entrando..." : "Entrar"}
            </Text>
          </Pressable>

          <Text
            className="text-center text-sm text-muted"
            onPress={() => navigation.navigate("SignUp")}
          >
            Ainda não possui conta?{" "}
            <Text className="font-bold text-primary">Crie agora</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
