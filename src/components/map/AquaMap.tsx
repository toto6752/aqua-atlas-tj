import { useEffect, useMemo, useRef, useState } from "react";
import Map, { Layer, Marker, NavigationControl, Source, type MapRef, type MapMouseEvent } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/store/useAppStore";
import {
  REGIONS_GEOJSON, RIVERS_GEOJSON, GLACIERS_GEOJSON, RISK_ZONES_GEOJSON,
  AGRI_ZONES_GEOJSON, POP_DENSITY_GEOJSON,
} from "@/data/tajikistanGeoJSON";
import { HYDROPOWER_PLANTS, RESERVOIRS, REGION_CENTROIDS, REGION_POP, type RegionId } from "@/data/environmentalData";
import { MapLegend } from "./MapLegend";
import { Lightning, WarningCircle } from "@phosphor-icons/react";

// Free, token-less raster tile styles — softer, calmer aesthetics
const STYLE_URLS: Record<string, any> = {
  dark: {
    version: 8,
    sources: {
      "carto-voyager-dark": {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png",
          "https://b.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png",
          "https://c.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
        attribution: "© OpenStreetMap contributors © CARTO",
      },
      "carto-labels": {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/rastertiles/dark_only_labels/{z}/{x}/{y}.png",
          "https://b.basemaps.cartocdn.com/rastertiles/dark_only_labels/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
      },
    },
    layers: [
      { id: "carto-voyager-dark", type: "raster", source: "carto-voyager-dark", paint: { "raster-saturation": -0.25, "raster-brightness-min": 0.05 } },
      { id: "carto-labels", type: "raster", source: "carto-labels", paint: { "raster-opacity": 0.55 } },
    ],
  },
  satellite: {
    version: 8,
    sources: {
      esri: {
        type: "raster",
        tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
        tileSize: 256,
        attribution: "Tiles © Esri",
      },
      "carto-labels": {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/rastertiles/dark_only_labels/{z}/{x}/{y}.png",
          "https://b.basemaps.cartocdn.com/rastertiles/dark_only_labels/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
      },
    },
    layers: [
      { id: "esri", type: "raster", source: "esri", paint: { "raster-brightness-min": 0.05 } },
      { id: "carto-labels", type: "raster", source: "carto-labels", paint: { "raster-opacity": 0.65 } },
    ],
  },
  terrain: {
    version: 8,
    sources: {
      voyager: {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
          "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
          "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
        attribution: "© OpenStreetMap contributors © CARTO",
      },
    },
    layers: [{ id: "voyager", type: "raster", source: "voyager", paint: { "raster-saturation": -0.15 } }],
  },
};

export function AquaMap() {
  const { t } = useTranslation();
  const ref = useRef<MapRef>(null);
  const { activeLayers, setSelectedRegion, selectedRegion, mapStyle, setMapStyle } = useAppStore();
  const [hover, setHover] = useState<{ x: number; y: number; name: string; access: number } | null>(null);

  useEffect(() => {
    if (!ref.current || !selectedRegion) return;
    const c = REGION_CENTROIDS[selectedRegion as RegionId];
    if (!c) return;
    ref.current.flyTo({ center: c, zoom: 7.5, duration: 1000, essential: true });
  }, [selectedRegion]);

  const onClick = (e: MapMouseEvent) => {
    const features = e.features ?? [];
    const region = features.find((f) => f.layer?.id === "region-fill");
    if (region?.properties?.id) setSelectedRegion(region.properties.id as string);
  };

  const onMove = (e: MapMouseEvent) => {
    const f = (e.features ?? []).find((x) => x.layer?.id === "region-fill");
    if (f?.properties) {
      setHover({
        x: e.point.x, y: e.point.y,
        name: f.properties.name as string,
        access: f.properties.waterAccess as number,
      });
    } else setHover(null);
  };

  const interactiveLayers = useMemo(() => ["region-fill"], []);

  return (
    <div className="relative h-full w-full">
      {/* Soft vignette overlay over the map */}
      <div className="pointer-events-none absolute inset-0 z-[5]"
        style={{ background: "radial-gradient(120% 90% at 50% 0%, transparent 60%, rgba(247,249,252,0.45) 100%)" }} />

      <Map
        ref={ref}
        initialViewState={{ longitude: 70.8, latitude: 38.8, zoom: 6.2 }}
        minZoom={5}
        maxZoom={12}
        mapStyle={STYLE_URLS[mapStyle]}
        interactiveLayerIds={interactiveLayers}
        onClick={onClick}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        cursor="default"
      >
        <NavigationControl position="top-right" showCompass={false} />

        {activeLayers.waterAccess && (
          <Source id="regions" type="geojson" data={REGIONS_GEOJSON}>
            <Layer
              id="region-fill"
              type="fill"
              paint={{
                "fill-color": ["get", "color"],
                "fill-opacity": [
                  "case",
                  ["==", ["get", "id"], selectedRegion ?? ""], 0.32,
                  0.14,
                ],
              }}
            />
            <Layer
              id="region-outline"
              type="line"
              paint={{
                "line-color": ["get", "color"],
                "line-width": [
                  "case",
                  ["==", ["get", "id"], selectedRegion ?? ""], 2,
                  1.2,
                ],
                "line-opacity": 0.7,
                "line-blur": 0.4,
              }}
            />
          </Source>
        )}

        {activeLayers.populationDensity && (
          <Source id="popdens" type="geojson" data={POP_DENSITY_GEOJSON}>
            <Layer id="popdens-fill" type="fill" paint={{ "fill-color": "#4a86d6", "fill-opacity": 0.22 }} />
            <Layer id="popdens-line" type="line" paint={{ "line-color": "#4a86d6", "line-width": 0.8, "line-opacity": 0.5 }} />
          </Source>
        )}

        {activeLayers.agriculturalZones && (
          <Source id="agri" type="geojson" data={AGRI_ZONES_GEOJSON}>
            <Layer id="agri-fill" type="fill" paint={{ "fill-color": "#6dd0b4", "fill-opacity": 0.14 }} />
            <Layer id="agri-line" type="line" paint={{ "line-color": "#6dd0b4", "line-width": 0.8, "line-dasharray": [3, 3], "line-opacity": 0.5 }} />
          </Source>
        )}

        {activeLayers.climateRisks && (
          <Source id="risks" type="geojson" data={RISK_ZONES_GEOJSON}>
            <Layer id="risks-fill" type="fill" paint={{ "fill-color": "#d76d80", "fill-opacity": 0.16 }} />
            <Layer id="risks-line" type="line" paint={{ "line-color": "#d76d80", "line-width": 1, "line-dasharray": [2, 3], "line-opacity": 0.65 }} />
          </Source>
        )}

        {activeLayers.glaciers && (
          <Source id="glaciers" type="geojson" data={GLACIERS_GEOJSON}>
            <Layer id="glaciers-fill" type="fill" paint={{ "fill-color": "#dcebf6", "fill-opacity": 0.42 }} />
            <Layer id="glaciers-line" type="line" paint={{ "line-color": "#bcd9ea", "line-width": 0.7, "line-opacity": 0.65 }} />
          </Source>
        )}

        {activeLayers.rivers && (
          <Source id="rivers" type="geojson" data={RIVERS_GEOJSON}>
            <Layer id="rivers-glow" type="line" paint={{ "line-color": "#6cc6e0", "line-width": 5, "line-opacity": 0.10, "line-blur": 3 }} />
            <Layer id="rivers-line" type="line" paint={{ "line-color": "#8ad7eb", "line-width": 1.6, "line-opacity": 0.85 }} />
          </Source>
        )}

        {activeLayers.reservoirs && RESERVOIRS.map((r) => (
          <Marker key={r.id} longitude={r.coordinates[0]} latitude={r.coordinates[1]}>
            <div className="rounded-full"
              style={{
                width: 16 + r.area / 30, height: 12 + r.area / 50,
                background: "radial-gradient(circle, rgba(79,125,243,0.55), rgba(79,125,243,0.15))",
                border: "1px solid rgba(79,125,243,0.55)",
              }} />
          </Marker>
        ))}

        {activeLayers.hydropower && HYDROPOWER_PLANTS.map((p) => (
          <Marker key={p.id} longitude={p.coordinates[0]} latitude={p.coordinates[1]} anchor="center">
            <div className={`flex items-center justify-center rounded-lg ${p.status !== "operational" ? "animate-pulse-dot" : ""}`}
              style={{
                width: 22, height: 22,
                background: "linear-gradient(135deg, rgba(245,158,11,0.30), rgba(245,158,11,0.12))",
                border: "1px solid rgba(245,158,11,0.6)",
                boxShadow: "0 4px 12px -4px rgba(245,158,11,0.4)",
              }}
              title={`${p.name} · ${p.capacity} MW`}>
              <Lightning size={12} weight="fill" className="text-amber-400" />
            </div>
          </Marker>
        ))}

        {activeLayers.waterAccess && (Object.keys(REGION_CENTROIDS) as RegionId[]).map((id) => {
          const c = REGION_CENTROIDS[id];
          const pop = REGION_POP[id];
          const size = Math.max(10, Math.min(28, Math.sqrt(pop) / 38));
          return (
            <Marker key={id} longitude={c[0]} latitude={c[1]}>
              <div className="rounded-full"
                style={{
                  width: size, height: size,
                  background: "radial-gradient(circle, rgba(79,125,243,0.35), rgba(79,125,243,0.05))",
                  border: "1px solid rgba(79,125,243,0.5)",
                }} />
            </Marker>
          );
        })}

        {activeLayers.climateRisks && (
          <Marker longitude={68.7} latitude={37.4}>
            <WarningCircle size={18} weight="duotone" className="text-risk-red drop-shadow" />
          </Marker>
        )}
      </Map>

      {hover && (
        <div
          className="pointer-events-none absolute z-20 glass border border-border-subtle rounded-xl px-3.5 py-2.5 text-[12px] text-text-primary shadow-[var(--shadow-elevated)]"
          style={{ left: hover.x + 14, top: hover.y + 14 }}
        >
          <div className="font-medium tracking-tight">{hover.name}</div>
          <div className="font-mono text-cyan-400 text-[11px] mt-0.5">{hover.access}% water access</div>
        </div>
      )}

      <div className="absolute top-5 left-5 z-10 flex rounded-2xl p-1 glass border border-border-subtle shadow-[var(--shadow-soft)]">
        {(["dark", "satellite", "terrain"] as const).map((s) => (
          <button key={s} onClick={() => setMapStyle(s)}
            className={`px-3.5 py-1.5 text-[11px] font-mono tracking-wide rounded-xl transition-all ${
              mapStyle === s
                ? "bg-cyan-400/15 text-cyan-400 shadow-[inset_0_0_0_1px_rgba(79,125,243,0.30)]"
                : "text-text-secondary hover:text-text-primary"
            }`}>
            {t(`mapControls.${s}`)}
          </button>
        ))}
      </div>

      <MapLegend />
    </div>
  );
}
