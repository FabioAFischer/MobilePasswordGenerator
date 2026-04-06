import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  Alert,
  StyleSheet,
} from "react-native";
import { registrarUsuario } from "../services/auth";

export default function SignUp({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const validarEmail = (email) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return "E-mail é obrigatório.";
    if (!trimmedEmail.includes("@")) return "E-mail deve conter '@'.";
    const parts = trimmedEmail.split("@");
    if (parts.length !== 2) return "E-mail deve ter apenas um '@'.";
    if (!parts[0]) return "Parte antes do '@' não pode estar vazia.";
    if (!parts[1] || !parts[1].includes(".")) return "E-mail deve ter um domínio válido (ex.: dominio.com).";
    const domainParts = parts[1].split(".");
    if (domainParts.length < 2 || !domainParts[1]) return "Domínio deve ter uma extensão válida (ex.: .com).";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) return "E-mail contém caracteres inválidos.";
    return null; // Válido
  };

  const validarSenha = (senha) => {
    if (senha.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
    if (!/[A-Z]/.test(senha)) return "A senha deve conter pelo menos uma letra maiúscula.";
    if (!/[0-9]/.test(senha)) return "A senha deve conter pelo menos um número.";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) return "A senha deve conter pelo menos um caractere especial.";
    return null; // Válida
  };

  const emailErro = email ? validarEmail(email) : null;
  const senhaErro = senha ? validarSenha(senha.trim()) : null;
  const confirmarSenhaErro = confirmarSenha
    ? senha !== confirmarSenha
      ? "As senhas não coincidem."
      : null
    : null;

  const handleRegistrar = async () => {
    console.log("handleRegistrar chamado");
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    if (emailErro) {
      console.log("Erro de email:", emailErro);
      Alert.alert("Atenção", emailErro);
      return;
    }

    if (senhaErro) {
      console.log("Erro de senha:", senhaErro);
      Alert.alert("Atenção", senhaErro);
      return;
    }

    if (confirmarSenhaErro) {
      Alert.alert("Atenção", confirmarSenhaErro);
      return;
    }

    try {
      setLoading(true);

      console.log("Iniciando cadastro com:", { nome: nome.trim(), email: email.trim(), senha: senha.trim() });

      await registrarUsuario({
        nome: nome.trim(),
        email: email.trim(),
        senha: senha.trim(),
      });

      console.log("Cadastro realizado com sucesso");

      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");

      navigation.navigate("SignIn", {
        email: email.trim(),
      });
    } catch (error) {
      console.log("ERRO CADASTRO COMPLETO:", error.details || error);

      const erros = error.details?.erros;
      const mensagemValidacao = erros
        ? Object.values(erros).join("\n")
        : error.message;

      Alert.alert("Erro no cadastro", mensagemValidacao);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Cadastro</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {emailErro ? <Text style={styles.errorText}>{emailErro}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        {senhaErro ? <Text style={styles.errorText}>{senhaErro}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
        />
        {confirmarSenhaErro ? <Text style={styles.errorText}>{confirmarSenhaErro}</Text> : null}

        <Pressable
          style={styles.primaryButton}
          onPress={handleRegistrar}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("SignIn")}>
          <Text style={styles.linkText}>
            Já tem conta? <Text style={styles.linkStrong}>Entrar</Text>
          </Text>
        </Pressable>
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
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 20,
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
  errorText: {
    color: "#FF7A00",
    marginBottom: 10,
    fontSize: 13,
  },
});
