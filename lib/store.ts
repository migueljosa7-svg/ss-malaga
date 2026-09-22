"use client";

import { create } from "zustand";

interface UIState {
  buscador: string;
  setBuscador: (v: string) => void;
  hermandadFavoritaIds: string[];
  toggleFavorita: (id: string) => void;
  capasMapa: { pasos: boolean; callesCortadas: boolean; itinerarios: boolean };
  toggleCapa: (capa: "pasos" | "callesCortadas" | "itinerarios") => void;
  /** Modo ahorro de datos / aglomeración: desactiva animaciones y reduce red */
  modoAhorro: boolean;
  toggleModoAhorro: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  buscador: "",
  setBuscador: (v) => set({ buscador: v }),
  hermandadFavoritaIds: [],
  toggleFavorita: (id) =>
    set((s) => ({
      hermandadFavoritaIds: s.hermandadFavoritaIds.includes(id)
        ? s.hermandadFavoritaIds.filter((f) => f !== id)
        : [...s.hermandadFavoritaIds, id],
    })),
  capasMapa: { pasos: true, callesCortadas: true, itinerarios: true },
  toggleCapa: (capa) =>
    set((s) => ({ capasMapa: { ...s.capasMapa, [capa]: !s.capasMapa[capa] } })),
  modoAhorro: false,
  toggleModoAhorro: () => set((s) => ({ modoAhorro: !s.modoAhorro })),
}));

