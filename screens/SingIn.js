import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
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
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>🔐</Text>
          </View>
          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.subtitle}>Entre para continuar</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Digite seu e-mail"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            placeholder="Digite sua senha"
          />

          <Pressable
            style={[styles.primaryButton, !podeEntrar && styles.buttonDisabled]}
            onPress={handleEntrar}
            disabled={!podeEntrar}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? "Entrando..." : "Entrar"}
            </Text>
          </Pressable>

          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate("SignUp")}
          >
            Ainda não possui conta?{" "}
            <Text style={styles.linkStrong}>Crie agora</Text>
          </Text>
        </View>
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
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  logoArea: {
    alignItems: "center",
    marginBottom: 36,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#FF7A00",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 34,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 15,
    color: "#B3B3B3",
    marginTop: 6,
  },
  form: {
    backgroundColor: "#232323",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "#2C2C2C",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#B3B3B3",
    marginBottom: 8,
    marginTop: 6,
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
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#FF7A00",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 18,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  linkText: {
    textAlign: "center",
    color: "#B3B3B3",
    fontSize: 14,
  },
  linkStrong: {
    color: "#FF7A00",
    fontWeight: "700",
  },
});
