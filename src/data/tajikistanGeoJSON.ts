// Simplified approximate GeoJSON for Tajikistan regions, rivers, glaciers.
// Coordinates are stylized/approximate and intended for visualization, not survey use.
import type { FeatureCollection, Feature, Polygon, LineString } from "geojson";

type RegionProps = { id: string; name: string; waterAccess: number; color: string };

export const REGIONS_GEOJSON: FeatureCollection<Polygon, RegionProps> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { id: "sughd", name: "Sughd", waterAccess: 81, color: "#1a6bff" },
      geometry: { type: "Polygon", coordinates: [[
        [68.4, 39.5], [69.0, 40.4], [69.5, 40.6], [70.5, 40.4],
        [70.9, 40.05], [70.3, 39.6], [69.6, 39.4], [68.8, 39.3], [68.4, 39.5],
      ]]},
    },
    {
      type: "Feature",
      properties: { id: "gbao", name: "GBAO", waterAccess: 45, color: "#ff4d6a" },
      geometry: { type: "Polygon", coordinates: [[
        [70.9, 39.4], [71.6, 39.7], [72.6, 39.6], [74.0, 39.4], [74.9, 38.8],
        [74.7, 37.5], [73.9, 37.0], [72.5, 36.95], [71.5, 37.4], [71.0, 38.0],
        [70.7, 38.6], [70.9, 39.4],
      ]]},
    },
    {
      type: "Feature",
      properties: { id: "drs", name: "DRS", waterAccess: 70, color: "#00a8cc" },
      geometry: { type: "Polygon", coordinates: [[
        [68.4, 39.3], [68.8, 39.3], [69.6, 39.4], [70.3, 39.6], [70.9, 39.4],
        [70.7, 38.6], [70.5, 38.3], [69.8, 38.0], [69.0, 38.3], [68.5, 38.6],
        [68.3, 38.9], [68.4, 39.3],
      ]]},
    },
    {
      type: "Feature",
      properties: { id: "dushanbe", name: "Dushanbe", waterAccess: 94, color: "#00e07a" },
      geometry: { type: "Polygon", coordinates: [[
        [68.70, 38.52], [68.86, 38.52], [68.88, 38.62], [68.72, 38.63], [68.70, 38.52],
      ]]},
    },
    {
      type: "Feature",
      properties: { id: "khatlon", name: "Khatlon", waterAccess: 63, color: "#ffb830" },
      geometry: { type: "Polygon", coordinates: [[
        [67.6, 38.5], [68.3, 38.6], [68.5, 38.5], [69.0, 38.3], [69.8, 38.0],
        [70.2, 37.6], [70.1, 37.2], [69.4, 36.85], [68.6, 36.78], [67.8, 36.95],
        [67.45, 37.4], [67.45, 38.0], [67.6, 38.5],
      ]]},
    },
  ],
};

export const RIVERS_GEOJSON: FeatureCollection<LineString, { name: string }> = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "Vakhsh" }, geometry: { type: "LineString", coordinates: [
      [71.4, 39.0], [70.8, 38.7], [70.2, 38.5], [69.6, 38.3], [69.0, 38.0], [68.4, 37.6], [68.0, 37.2],
    ]}},
    { type: "Feature", properties: { name: "Panj" }, geometry: { type: "LineString", coordinates: [
      [73.6, 37.4], [72.8, 37.2], [72.0, 37.05], [71.0, 37.0], [70.0, 37.05], [69.0, 37.1], [68.2, 37.1], [67.5, 37.2],
    ]}},
    { type: "Feature", properties: { name: "Zeravshan" }, geometry: { type: "LineString", coordinates: [
      [70.5, 39.4], [69.8, 39.5], [69.0, 39.55], [68.4, 39.55],
    ]}},
    { type: "Feature", properties: { name: "Syr Darya" }, geometry: { type: "LineString", coordinates: [
      [70.6, 40.1], [70.2, 40.25], [69.6, 40.3], [69.0, 40.35], [68.4, 40.4],
    ]}},
    { type: "Feature", properties: { name: "Kofarnihon" }, geometry: { type: "LineString", coordinates: [
      [69.2, 39.0], [68.95, 38.7], [68.78, 38.55], [68.7, 38.0], [68.6, 37.4],
    ]}},
  ],
};

function ellipse(cx: number, cy: number, rx: number, ry: number): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  return pts;
}

export const GLACIERS_GEOJSON: FeatureCollection<Polygon, { name: string }> = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "Fedchenko" }, geometry: { type: "Polygon", coordinates: [ellipse(72.22, 38.72, 0.45, 0.18)] }},
    { type: "Feature", properties: { name: "Northern Pamir Cluster" }, geometry: { type: "Polygon", coordinates: [ellipse(72.6, 39.1, 0.55, 0.25)] }},
    { type: "Feature", properties: { name: "Central Pamir" }, geometry: { type: "Polygon", coordinates: [ellipse(73.4, 38.4, 0.6, 0.3)] }},
    { type: "Feature", properties: { name: "Western Pamir" }, geometry: { type: "Polygon", coordinates: [ellipse(71.6, 38.5, 0.35, 0.2)] }},
    { type: "Feature", properties: { name: "Alai Glaciers" }, geometry: { type: "Polygon", coordinates: [ellipse(70.4, 39.4, 0.4, 0.12)] }},
  ],
};

export const RISK_ZONES_GEOJSON: FeatureCollection<Polygon, { name: string; level: string }> = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "Khatlon Flood Belt", level: "high" }, geometry: { type: "Polygon", coordinates: [ellipse(68.7, 37.4, 0.7, 0.35)] }},
    { type: "Feature", properties: { name: "GBAO GLOF Zone", level: "high" }, geometry: { type: "Polygon", coordinates: [ellipse(72.7, 38.5, 0.9, 0.45)] }},
    { type: "Feature", properties: { name: "Vakhsh Corridor", level: "moderate" }, geometry: { type: "Polygon", coordinates: [ellipse(69.6, 38.4, 0.5, 0.25)] }},
  ],
};

export const AGRI_ZONES_GEOJSON: FeatureCollection<Polygon, { name: string }> = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "Sughd Cotton Belt" }, geometry: { type: "Polygon", coordinates: [ellipse(69.6, 40.1, 0.9, 0.25)] }},
    { type: "Feature", properties: { name: "Khatlon Plains" }, geometry: { type: "Polygon", coordinates: [ellipse(68.4, 37.6, 0.85, 0.4)] }},
  ],
};

export const POP_DENSITY_GEOJSON: FeatureCollection<Polygon, { name: string; density: number }> = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "Dushanbe core", density: 9000 }, geometry: { type: "Polygon", coordinates: [ellipse(68.78, 38.56, 0.12, 0.08)] }},
    { type: "Feature", properties: { name: "Khujand", density: 2400 }, geometry: { type: "Polygon", coordinates: [ellipse(69.62, 40.28, 0.18, 0.1)] }},
    { type: "Feature", properties: { name: "Kulob", density: 1200 }, geometry: { type: "Polygon", coordinates: [ellipse(69.78, 37.91, 0.15, 0.1)] }},
    { type: "Feature", properties: { name: "Bokhtar", density: 1600 }, geometry: { type: "Polygon", coordinates: [ellipse(68.78, 37.84, 0.2, 0.12)] }},
  ],
};

export type _F = Feature; // keep type used
