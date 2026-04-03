import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from "react-native";

export default function SignUp({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const camposPreenchidos =
    nome.trim() !== "" &&
    email.trim() !== "" &&
    senha.trim() !== "" &&
    confirmarSenha.trim() !== "";

  const senhasIguais = senha === confirmarSenha;
  const podeRegistrar = camposPreenchidos && senhasIguais;

  const handleRegistrar = () => {
    if (!podeRegistrar) return;

    navigation.navigate("SignIn", { email });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>✨</Text>
          </View>
          <Text style={styles.title}>Sign up</Text>
          <Text style={styles.subtitle}>Crie sua conta</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            placeholder="Digite seu nome"
            placeholderTextColor="#7a7a7a"
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            placeholder="Digite seu e-mail"
            placeholderTextColor="#7a7a7a"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            placeholder="Digite sua senha"
            placeholderTextColor="#7a7a7a"
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <Text style={styles.label}>Confirmar senha</Text>
          <TextInput
            placeholder="Confirme sua senha"
            placeholderTextColor="#7a7a7a"
            style={styles.input}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
          />

          {!senhasIguais && confirmarSenha !== "" && (
            <Text style={styles.errorText}>
              As senhas precisam ser idênticas.
            </Text>
          )}

          <Pressable
            style={[
              styles.primaryButton,
              !podeRegistrar && styles.buttonDisabled,
            ]}
            onPress={handleRegistrar}
            disabled={!podeRegistrar}
          >
            <Text style={styles.primaryButtonText}>Registrar</Text>
          </Pressable>

          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>
              <Text style={styles.linkStrong}>Voltar</Text>
            </Text>
          </Pressable>
        </View>
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
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  logoArea: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#39e092",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0f7275",
  },
  subtitle: {
    fontSize: 15,
    color: "#537070",
    marginTop: 6,
  },
  form: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "#dff5e9",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f7275",
    marginBottom: 8,
    marginTop: 6,
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
    marginBottom: 12,
  },
  errorText: {
    color: "#d64f4f",
    fontSize: 13,
    marginBottom: 10,
    marginTop: -2,
  },
  primaryButton: {
    backgroundColor: "#39e092",
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
    color: "#0f7275",
    fontSize: 16,
    fontWeight: "700",
  },
  linkText: {
    textAlign: "center",
    color: "#537070",
    fontSize: 14,
  },
  linkStrong: {
    color: "#0f7275",
    fontWeight: "700",
  },
});
