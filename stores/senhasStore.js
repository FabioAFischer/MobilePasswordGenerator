import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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

export const useSenhasStore = create(
  persist(
    (set, get) => ({
      senhas: [],

      adicionarSenha: ({ nomeAplicativo, senha }) => {
        const createdAt = Date.now();
        const novaSenha = {
          id: `${createdAt}-${Math.random().toString(36).slice(2)}`,
          nomeAplicativo,
          senha,
          createdAt,
          pending: true,
        };

        set(
          (state) => ({
            senhas: [novaSenha, ...state.senhas],
          }),
          false,
          "senhas/adicionarSenha",
        );

        return novaSenha;
      },

      removerSenha: (id) => {
        set(
          (state) => ({
            senhas: state.senhas.filter((item) => item.id !== id),
          }),
          false,
          "senhas/removerSenha",
        );
      },

      marcarComoSincronizadas: (ids) => {
        if (!Array.isArray(ids) || ids.length === 0) return;

        set(
          (state) => ({
            senhas: state.senhas.map((item) =>
              ids.includes(item.id) ? { ...item, pending: false } : item,
            ),
          }),
          false,
          "senhas/marcarComoSincronizadas",
        );
      },

      marcarComoPendente: (id) => {
        set(
          (state) => ({
            senhas: state.senhas.map((item) =>
              item.id === id ? { ...item, pending: true } : item,
            ),
          }),
          false,
          "senhas/marcarComoPendente",
        );
      },

      limparHistoricoLocal: () => {
        set({ senhas: [] }, false, "senhas/limparHistoricoLocal");
      },

      getPendentes: () => get().senhas.filter((item) => item.pending),
    }),
    {
      name: "@mobile-password-generator/senhas",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        senhas: state.senhas,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
        senhas: Array.isArray(persistedState?.senhas)
          ? persistedState.senhas.map(normalizarSenha).sort((a, b) => b.createdAt - a.createdAt)
          : currentState.senhas,
      }),
    },
  ),
);
