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
  /** v10.0: foco del Command Palette — objetivo de `map.flyTo` en el mapa */
  focoBusqueda: { lat: number; lng: number; zoom: number; nonce: number } | null;
  /** v10.0: centra el mapa en una búsqueda (hermandad o calle emblemática) */
  centrarFoco: (f: { lat: number; lng: number; zoom?: number }) => void;
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
  focoBusqueda: null,
  // nonce: contador para que repetir la misma búsqueda vuelva a disparar flyTo
  centrarFoco: (f) =>
    set((s) => ({
      focoBusqueda: {
        lat: f.lat,
        lng: f.lng,
        zoom: f.zoom ?? 17,
        nonce: (s.focoBusqueda?.nonce ?? 0) + 1,
      },
    })),
}));

