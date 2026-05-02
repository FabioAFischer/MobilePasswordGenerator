import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  Alert,
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
    return null;
  };

  const validarSenha = (senha) => {
    if (senha.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
    if (!/[A-Z]/.test(senha)) return "A senha deve conter pelo menos uma letra maiúscula.";
    if (!/[0-9]/.test(senha)) return "A senha deve conter pelo menos um número.";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) return "A senha deve conter pelo menos um caractere especial.";
    return null;
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
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center px-7">
        <Text className="mb-5 text-[32px] font-bold text-white">Cadastro</Text>

        <TextInput
          className="mb-3 rounded-[14px] border border-border bg-surfaceAlt px-3.5 py-3.5 text-[15px] text-white"
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          className="mb-3 rounded-[14px] border border-border bg-surfaceAlt px-3.5 py-3.5 text-[15px] text-white"
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {emailErro ? (
          <Text className="mb-2.5 text-[13px] text-primary">{emailErro}</Text>
        ) : null}

        <TextInput
          className="mb-3 rounded-[14px] border border-border bg-surfaceAlt px-3.5 py-3.5 text-[15px] text-white"
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        {senhaErro ? (
          <Text className="mb-2.5 text-[13px] text-primary">{senhaErro}</Text>
        ) : null}

        <TextInput
          className="mb-3 rounded-[14px] border border-border bg-surfaceAlt px-3.5 py-3.5 text-[15px] text-white"
          placeholder="Confirmar senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
        />
        {confirmarSenhaErro ? (
          <Text className="mb-2.5 text-[13px] text-primary">
            {confirmarSenhaErro}
          </Text>
        ) : null}

        <Pressable
          className="mb-[18px] mt-2.5 items-center rounded-[14px] bg-primary py-[15px]"
          onPress={handleRegistrar}
          disabled={loading}
        >
          <Text className="text-base font-bold text-white">
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("SignIn")}>
          <Text className="text-center text-sm text-muted">
            Já tem conta? <Text className="font-bold text-primary">Entrar</Text>
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
