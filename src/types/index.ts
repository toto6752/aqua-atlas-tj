export type Lang = "en" | "ru";

export interface RegionStats {
  waterAccess: number;
  population: string;
  floodRisk: string;
  glaciers: string;
  drinkingWaterQuality: string;
  sanitationCoverage: number;
  annualRainfall: string;
  infrastructureScore: number;
}

export interface RegionInfo {
  id: string;
  name: string;
  type: string;
  description: string;
  stats: RegionStats;
  centroid: [number, number];
  color: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

export type LayerKey =
  | "rivers"
  | "glaciers"
  | "waterAccess"
  | "climateRisks"
  | "hydropower"
  | "reservoirs"
  | "populationDensity"
  | "agriculturalZones";

export type ActiveView = "map" | "analytics" | "education";
export type MapStyleKey = "satellite" | "terrain" | "dark";
