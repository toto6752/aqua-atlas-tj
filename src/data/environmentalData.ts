export const TIME_SERIES = {
  years: [2017, 2018, 2019, 2020, 2021, 2022, 2023],
  waterAccess: {
    national: [58, 61, 64, 67, 69, 71, 74],
    dushanbe: [88, 89, 90, 91, 92, 93, 94],
    sughd: [72, 74, 75, 77, 78, 79, 81],
    gbao: [38, 39, 40, 41, 42, 43, 45],
    khatlon: [54, 56, 57, 59, 60, 61, 63],
    drs: [62, 64, 65, 67, 68, 69, 70],
  },
  glacierArea: [8450, 8380, 8310, 8250, 8180, 8100, 8030],
  glacierMassLossIndex: [0, -2.1, -4.3, -6.2, -8.8, -11.2, -13.9],
  riverDischarge: [64.2, 63.1, 62.8, 61.4, 60.9, 59.2, 57.4],
  floodRiskDistricts: [10, 11, 12, 13, 15, 16, 18],
  hydroCapacity: [5.2, 6.0, 6.8, 7.5, 8.0, 8.6, 9.1],
  precipitationAnomaly: [-0.8, 1.2, -2.1, -3.4, 0.9, -1.8, -2.9],
  temperatureAnomaly: [0.6, 0.8, 0.9, 1.1, 1.2, 1.3, 1.4],
};

export const REGIONAL_WATER_QUALITY = {
  dushanbe: { ph: 7.2, turbidity: 1.2, nitrates: 8.4, coliform: 0, score: 8.2 },
  sughd: { ph: 7.4, turbidity: 3.8, nitrates: 18.2, coliform: 12, score: 6.7 },
  gbao: { ph: 7.8, turbidity: 6.1, nitrates: 4.2, coliform: 28, score: 3.1 },
  khatlon: { ph: 7.6, turbidity: 8.4, nitrates: 24.6, coliform: 45, score: 4.8 },
  drs: { ph: 7.3, turbidity: 4.2, nitrates: 12.8, coliform: 18, score: 6.1 },
} as const;

export interface HydroPlant {
  id: string;
  name: string;
  nameRu: string;
  capacity: number;
  height: number;
  river: string;
  status: "operational" | "under_construction";
  yearBuilt: number | null;
  expectedCompletion?: number;
  coordinates: [number, number];
  annualGeneration: number;
}

export const HYDROPOWER_PLANTS: HydroPlant[] = [
  { id: "nurek", name: "Nurek HPP", nameRu: "Нурекская ГЭС", capacity: 3000, height: 300, river: "Vakhsh", status: "operational", yearBuilt: 1980, coordinates: [69.41, 38.38], annualGeneration: 11200 },
  { id: "sangtuda1", name: "Sangtuda-1 HPP", nameRu: "Сангтудинская ГЭС-1", capacity: 670, height: 75, river: "Vakhsh", status: "operational", yearBuilt: 2009, coordinates: [69.76, 38.21], annualGeneration: 2700 },
  { id: "sangtuda2", name: "Sangtuda-2 HPP", nameRu: "Сангтудинская ГЭС-2", capacity: 220, height: 40, river: "Vakhsh", status: "operational", yearBuilt: 2011, coordinates: [69.82, 38.15], annualGeneration: 1200 },
  { id: "rogun", name: "Rogun HPP", nameRu: "Рогунская ГЭС", capacity: 3600, height: 335, river: "Vakhsh", status: "under_construction", yearBuilt: null, expectedCompletion: 2028, coordinates: [69.80, 38.74], annualGeneration: 13100 },
  { id: "kayrakkum", name: "Kayrakkum HPP", nameRu: "Кайраккумская ГЭС", capacity: 126, height: 36, river: "Syr Darya", status: "operational", yearBuilt: 1956, coordinates: [70.02, 40.28], annualGeneration: 680 },
];

export interface ReservoirItem {
  id: string;
  name: string;
  coordinates: [number, number];
  area: number;
}

export const RESERVOIRS: ReservoirItem[] = [
  { id: "nurek-res", name: "Nurek Reservoir", coordinates: [69.35, 38.45], area: 98 },
  { id: "kayrakkum-res", name: "Kayrakkum Reservoir", coordinates: [69.80, 40.27], area: 513 },
  { id: "rogun-res", name: "Rogun Reservoir", coordinates: [69.85, 38.78], area: 170 },
];

export const REGION_IDS = ["dushanbe", "sughd", "gbao", "khatlon", "drs"] as const;
export type RegionId = (typeof REGION_IDS)[number];

export const REGION_COLORS: Record<RegionId, string> = {
  dushanbe: "#00e07a",
  sughd: "#1a6bff",
  gbao: "#ff4d6a",
  khatlon: "#ffb830",
  drs: "#00a8cc",
};

export const REGION_CENTROIDS: Record<RegionId, [number, number]> = {
  dushanbe: [68.78, 38.56],
  sughd: [69.62, 40.05],
  gbao: [73.10, 38.55],
  khatlon: [68.85, 37.85],
  drs: [69.80, 38.85],
};

export const REGION_POP: Record<RegionId, number> = {
  dushanbe: 860000,
  sughd: 2850000,
  gbao: 220000,
  khatlon: 3150000,
  drs: 1800000,
};
