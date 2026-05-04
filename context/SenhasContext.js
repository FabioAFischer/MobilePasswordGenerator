import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

const SenhasContext = createContext(null);
const CHAVE_SENHA = "@historicoSenhas";

const initialState = {
  senhas: [],
};

function senhasReducer(state, action) {
  switch (action.type) {
    case "LOAD":
      return { ...state, senhas: action.payload };
    case "ADD":
      return { ...state, senhas: [action.payload, ...state.senhas] };
    case "REMOVE":
      return {
        ...state,
        senhas: state.senhas.filter((senha) => senha.id !== action.payload),
      };
    case "MARK_SYNCED":
      return {
        ...state,
        senhas: state.senhas.map((senha) =>
          action.payload.includes(senha.id) ? { ...senha, pending: false } : senha,
        ),
      };
    default:
      return state;
  }
}

async function obterChaveUsuario() {
  try {
    const usuario = await AsyncStorage.getItem("@app_user");
    if (usuario) {
      const dados = JSON.parse(usuario);
      if (dados?.email) {
        return `${CHAVE_SENHA}_${dados.email}`;
      }
    }
  } catch (error) {
    console.warn("Erro ao obter chave de usuario:", error);
  }

  return CHAVE_SENHA;
}

function normalizarSenha(item) {
  const createdAt = Number(item?.createdAt) || Date.now();

  return {
    id: String(item?.id || `${createdAt}-${Math.random().toString(36).slice(2)}`),
    nomeAplicativo: item?.nomeAplicativo || "",
    senha: item?.senha || "",
    createdAt,
    pending: Boolean(item?.pending),
  };
}

export function SenhasProvider({ children }) {
  const [state, dispatch] = useReducer(senhasReducer, initialState);
  const [isOnline, setIsOnline] = useState(null);
  const [storageKey, setStorageKey] = useState(CHAVE_SENHA);
  const carregadoRef = useRef(false);

  const carregarSenhas = useCallback(async () => {
    const chave = await obterChaveUsuario();
    const dados = await AsyncStorage.getItem(chave);
    const senhas = dados ? JSON.parse(dados).map(normalizarSenha) : [];

    carregadoRef.current = true;
    setStorageKey(chave);
    dispatch({
      type: "LOAD",
      payload: senhas.sort((a, b) => b.createdAt - a.createdAt),
    });
  }, []);

  useEffect(() => {
    carregarSenhas();
  }, [carregarSenhas]);

  useEffect(() => {
    if (!carregadoRef.current) return;

    AsyncStorage.setItem(storageKey, JSON.stringify(state.senhas)).catch((error) => {
      console.warn("Erro ao persistir historico local:", error);
    });
  }, [state.senhas, storageKey]);

  const adicionarSenha = useCallback(
    async ({ nomeAplicativo, senha }) => {
      const novaSenha = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        nomeAplicativo,
        senha,
        createdAt: Date.now(),
        pending: true,
      };

      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify([novaSenha, ...state.senhas]),
      );

      dispatch({ type: "ADD", payload: novaSenha });
      return novaSenha;
    },
    [state.senhas, storageKey],
  );

  const removerSenha = useCallback((id) => {
    dispatch({ type: "REMOVE", payload: id });
  }, []);

  const marcarComoSincronizadas = useCallback((ids) => {
    if (!Array.isArray(ids) || ids.length === 0) return;
    dispatch({ type: "MARK_SYNCED", payload: ids });
  }, []);

  const senhasPendentes = useMemo(
    () => state.senhas.filter((senha) => senha.pending),
    [state.senhas],
  );

  const value = useMemo(
    () => ({
      senhas: state.senhas,
      senhasPendentes,
      isOnline,
      adicionarSenha,
      removerSenha,
      marcarComoSincronizadas,
      recarregarSenhas: carregarSenhas,
      setStatusConexao: setIsOnline,
    }),
    [
      adicionarSenha,
      carregarSenhas,
      isOnline,
      marcarComoSincronizadas,
      removerSenha,
      senhasPendentes,
      state.senhas,
    ],
  );

  return (
    <SenhasContext.Provider value={value}>{children}</SenhasContext.Provider>
  );
}

export function useSenhas() {
  const context = useContext(SenhasContext);

  if (!context) {
    throw new Error("useSenhas deve ser usado dentro de SenhasProvider");
  }

  return context;
}
