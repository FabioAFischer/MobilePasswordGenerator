import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import { useCallback, useEffect, useRef } from "react";

import { useSenhas } from "../context/SenhasContext";
import { BASE_URL } from "../services/api";
import { obterToken } from "../services/auth";

export default function useSyncSenhas() {
  const { senhasPendentes, marcarComoSincronizadas, setStatusConexao } =
    useSenhas();
  const sincronizandoRef = useRef(false);

  const sincronizar = useCallback(async () => {
    if (sincronizandoRef.current || senhasPendentes.length === 0) return;

    sincronizandoRef.current = true;
    const idsSincronizados = [];

    try {
      const token = await obterToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      for (const item of senhasPendentes) {
        try {
          await axios.post(
            `${BASE_URL}/senhas`,
            {
              nomeAplicativo: item.nomeAplicativo,
              senha: item.senha,
            },
            { headers },
          );
          idsSincronizados.push(item.id);
        } catch (error) {
          console.warn("Erro ao sincronizar senha pendente:", error.message || error);
        }
      }

      marcarComoSincronizadas(idsSincronizados);
    } finally {
      sincronizandoRef.current = false;
    }
  }, [marcarComoSincronizadas, senhasPendentes]);

  useEffect(() => {
    const atualizarStatus = (state) => {
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);
      setStatusConexao(online);

      if (online) {
        sincronizar();
      }
    };

    const unsubscribe = NetInfo.addEventListener(atualizarStatus);
    NetInfo.fetch().then(atualizarStatus);

    return unsubscribe;
  }, [setStatusConexao, sincronizar]);
}
