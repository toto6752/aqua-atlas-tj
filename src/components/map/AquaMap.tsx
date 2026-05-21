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
      "carto-positron": {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png",
          "https://b.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png",
          "https://c.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
        attribution: "© OpenStreetMap contributors © CARTO",
      },
      "carto-labels": {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/rastertiles/light_only_labels/{z}/{x}/{y}.png",
          "https://b.basemaps.cartocdn.com/rastertiles/light_only_labels/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
      },
    },
    layers: [
      { id: "carto-positron", type: "raster", source: "carto-positron", paint: { "raster-saturation": -0.15 } },
      { id: "carto-labels", type: "raster", source: "carto-labels", paint: { "raster-opacity": 0.9 } },
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
          "https://a.basemaps.cartocdn.com/rastertiles/light_only_labels/{z}/{x}/{y}.png",
          "https://b.basemaps.cartocdn.com/rastertiles/light_only_labels/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
      },
    },
    layers: [
      { id: "esri", type: "raster", source: "esri" },
      { id: "carto-labels", type: "raster", source: "carto-labels", paint: { "raster-opacity": 0.9 } },
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
    layers: [{ id: "voyager", type: "raster", source: "voyager" }],
  },
};

export function AquaMap() {
  const { t } = useTranslation();
  const ref = useRef<MapRef>(null);
  const { activeLayers, setSelectedRegion, selectedRegion, mapStyle, setMapStyle } = useAppStore();
  const [hover, setHover] = useState<{ x: number; y: number; id: string; name: string; access: number } | null>(null);

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
        id: f.properties.id as string,
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

      {hover && (() => {
        const pop = REGION_POP[hover.id as RegionId];
        const tone = hover.access >= 80 ? "#10B981" : hover.access >= 60 ? "#F59E0B" : "#EF4444";
        const label = hover.access >= 80 ? "High access" : hover.access >= 60 ? "Moderate" : "Low access";
        return (
          <div
            className="pointer-events-none absolute z-20 bg-white border border-border-subtle rounded-lg px-3 py-2.5 text-[12px] text-text-primary shadow-[var(--shadow-soft)] min-w-[180px]"
            style={{ left: hover.x + 14, top: hover.y + 14 }}
          >
            <div className="font-medium tracking-tight text-[12.5px]">{hover.name}</div>
            <div className="mt-1.5 flex items-baseline justify-between gap-3">
              <span className="text-[10.5px] text-text-muted">Clean water access</span>
              <span className="data-num text-[13px] font-medium" style={{ color: tone }}>{hover.access}%</span>
            </div>
            {pop ? (
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[10.5px] text-text-muted">Population</span>
                <span className="data-num text-[11.5px] text-text-secondary">{pop.toLocaleString()}</span>
              </div>
            ) : null}
            <div className="mt-1.5 pt-1.5 border-t border-border-subtle/70 flex items-center justify-between">
              <span className="text-[10px]" style={{ color: tone }}>● {label}</span>
              <span className="text-[9.5px] text-text-muted">Click for details</span>
            </div>
          </div>
        );
      })()}

      <div className="absolute top-5 left-5 z-10 flex rounded-xl p-1 bg-white/95 backdrop-blur border border-border-subtle shadow-[var(--shadow-soft)]">
        {(["dark", "satellite", "terrain"] as const).map((s) => (
          <button key={s} onClick={() => setMapStyle(s)}
            className={`px-3.5 py-1.5 text-[11.5px] rounded-lg transition-all ${
              mapStyle === s
                ? "bg-primary/10 text-primary"
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
