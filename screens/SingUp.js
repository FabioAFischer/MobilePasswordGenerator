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

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValido = regexEmail.test(email.trim());

  const podeRegistrar = camposPreenchidos && senhasIguais && emailValido;

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
            placeholderTextColor="#7A7A7A"
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            placeholder="Digite seu e-mail"
            placeholderTextColor="#7A7A7A"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {email !== "" && !emailValido && (
            <Text style={styles.errorText}>Digite um e-mail válido.</Text>
          )}

          <Text style={styles.label}>Senha</Text>
          <TextInput
            placeholder="Digite sua senha"
            placeholderTextColor="#7A7A7A"
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <Text style={styles.label}>Confirmar senha</Text>
          <TextInput
            placeholder="Confirme sua senha"
            placeholderTextColor="#7A7A7A"
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
    backgroundColor: "#121212",
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
    backgroundColor: "#FF7A00",
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
  errorText: {
    color: "#FF5252",
    fontSize: 13,
    marginBottom: 10,
    marginTop: -2,
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
