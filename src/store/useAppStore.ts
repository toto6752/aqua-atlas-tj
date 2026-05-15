import { create } from "zustand";
import type { ActiveView, ChatMessage, Lang, LayerKey, MapStyleKey } from "@/types";

interface AppState {
  language: Lang;
  setLanguage: (l: Lang) => void;
  activeLayers: Record<LayerKey, boolean>;
  toggleLayer: (l: LayerKey) => void;
  selectedRegion: string | null;
  setSelectedRegion: (id: string | null) => void;
  activeView: ActiveView;
  setActiveView: (v: ActiveView) => void;
  mapStyle: MapStyleKey;
  setMapStyle: (s: MapStyleKey) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (m: ChatMessage) => void;
  setChatMessages: (m: ChatMessage[]) => void;
  isAILoading: boolean;
  setAILoading: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: "en",
  setLanguage: (l) => set({ language: l }),
  activeLayers: {
    rivers: true,
    glaciers: true,
    waterAccess: true,
    climateRisks: false,
    hydropower: true,
    reservoirs: true,
    populationDensity: false,
    agriculturalZones: false,
  },
  toggleLayer: (l) =>
    set((s) => ({ activeLayers: { ...s.activeLayers, [l]: !s.activeLayers[l] } })),
  selectedRegion: null,
  setSelectedRegion: (id) => set({ selectedRegion: id }),
  activeView: "map",
  setActiveView: (v) => set({ activeView: v }),
  mapStyle: "dark",
  setMapStyle: (s) => set({ mapStyle: s }),
  chatMessages: [],
  addChatMessage: (m) => set((s) => ({ chatMessages: [...s.chatMessages, m] })),
  setChatMessages: (m) => set({ chatMessages: m }),
  isAILoading: false,
  setAILoading: (v) => set({ isAILoading: v }),
}));
