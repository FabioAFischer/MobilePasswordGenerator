import { useEffect, useRef } from "react";
import NetInfo from "@react-native-community/netinfo";

import api from "../services/api";
import { useSenhasStore } from "../stores/senhasStore";

export function useSyncSenhas() {
  const sincronizandoRef = useRef(false);

  const sincronizar = async () => {
    if (sincronizandoRef.current) return;

    const pendentes = useSenhasStore.getState().getPendentes();
    if (!pendentes.length) return;

    sincronizandoRef.current = true;
    const sincronizadas = [];

    try {
      for (const item of pendentes) {
        try {
          await api.post("/senhas", {
            nomeAplicativo: item.nomeAplicativo,
            senha: item.senha,
          });

          sincronizadas.push(item.id);
        } catch (error) {
          console.warn("Falha ao sincronizar senha pendente:", error.message || error);
        }
      }

      if (sincronizadas.length > 0) {
        useSenhasStore.getState().marcarComoSincronizadas(sincronizadas);
      }
    } finally {
      sincronizandoRef.current = false;
    }
  };

  useEffect(() => {
    const tentarSincronizar = (state) => {
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);

      if (online) {
        sincronizar();
      }
    };

    const unsubNetInfo = NetInfo.addEventListener(tentarSincronizar);
    NetInfo.fetch().then(tentarSincronizar);

    return () => {
      unsubNetInfo();
    };
  }, []);
}
