import { useEffect, useMemo, useRef, useState } from "react";
import Map, { Layer, Marker, NavigationControl, Source, type MapRef, type MapMouseEvent } from "react-map-gl/mapbox";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/store/useAppStore";
import {
  REGIONS_GEOJSON, RIVERS_GEOJSON, GLACIERS_GEOJSON, RISK_ZONES_GEOJSON,
  AGRI_ZONES_GEOJSON, POP_DENSITY_GEOJSON,
} from "@/data/tajikistanGeoJSON";
import { HYDROPOWER_PLANTS, RESERVOIRS, REGION_CENTROIDS, REGION_POP, type RegionId } from "@/data/environmentalData";
import { MapLegend } from "./MapLegend";
import { Zap, AlertTriangle, MapPin } from "lucide-react";

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

const STYLE_URLS: Record<string, string> = {
  dark: "mapbox://styles/mapbox/dark-v11",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  terrain: "mapbox://styles/mapbox/outdoors-v12",
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
    ref.current.flyTo({ center: c, zoom: 7.5, duration: 800 });
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

  if (!TOKEN) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="panel max-w-md p-6 text-center">
          <MapPin className="mx-auto mb-3 text-cyan-400" size={32} />
          <h3 className="font-semibold text-text-primary mb-1">{t("mapControls.missingToken")}</h3>
          <p className="text-xs text-text-secondary font-mono">{t("mapControls.missingTokenHint")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <Map
        ref={ref}
        mapboxAccessToken={TOKEN}
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
                  ["==", ["get", "id"], selectedRegion ?? ""], 0.45,
                  0.20,
                ],
              }}
            />
            <Layer
              id="region-outline"
              type="line"
              paint={{ "line-color": ["get", "color"], "line-width": 1.5, "line-opacity": 0.8 }}
            />
          </Source>
        )}

        {activeLayers.populationDensity && (
          <Source id="popdens" type="geojson" data={POP_DENSITY_GEOJSON}>
            <Layer id="popdens-fill" type="fill" paint={{ "fill-color": "#1a6bff", "fill-opacity": 0.35 }} />
            <Layer id="popdens-line" type="line" paint={{ "line-color": "#1a6bff", "line-width": 0.8, "line-opacity": 0.6 }} />
          </Source>
        )}

        {activeLayers.agriculturalZones && (
          <Source id="agri" type="geojson" data={AGRI_ZONES_GEOJSON}>
            <Layer id="agri-fill" type="fill" paint={{ "fill-color": "#00e5c0", "fill-opacity": 0.18 }} />
            <Layer id="agri-line" type="line" paint={{ "line-color": "#00e5c0", "line-width": 0.8, "line-dasharray": [3, 2], "line-opacity": 0.6 }} />
          </Source>
        )}

        {activeLayers.climateRisks && (
          <Source id="risks" type="geojson" data={RISK_ZONES_GEOJSON}>
            <Layer id="risks-fill" type="fill" paint={{ "fill-color": "#ff4d6a", "fill-opacity": 0.22 }} />
            <Layer id="risks-line" type="line" paint={{ "line-color": "#ff4d6a", "line-width": 1, "line-dasharray": [2, 2] }} />
          </Source>
        )}

        {activeLayers.glaciers && (
          <Source id="glaciers" type="geojson" data={GLACIERS_GEOJSON}>
            <Layer id="glaciers-fill" type="fill" paint={{ "fill-color": "#dcefff", "fill-opacity": 0.55 }} />
            <Layer id="glaciers-line" type="line" paint={{ "line-color": "#bfe2ff", "line-width": 0.8 }} />
          </Source>
        )}

        {activeLayers.rivers && (
          <Source id="rivers" type="geojson" data={RIVERS_GEOJSON}>
            <Layer id="rivers-line" type="line" paint={{ "line-color": "#00d4ff", "line-width": 1.8, "line-opacity": 0.85 }} />
            <Layer id="rivers-glow" type="line" paint={{ "line-color": "#00d4ff", "line-width": 6, "line-opacity": 0.10, "line-blur": 4 }} />
          </Source>
        )}

        {activeLayers.reservoirs && RESERVOIRS.map((r) => (
          <Marker key={r.id} longitude={r.coordinates[0]} latitude={r.coordinates[1]}>
            <div className="rounded-full border border-blue-500/60 bg-blue-500/30"
              style={{ width: 18 + r.area / 30, height: 12 + r.area / 50 }} />
          </Marker>
        ))}

        {activeLayers.hydropower && HYDROPOWER_PLANTS.map((p) => (
          <Marker key={p.id} longitude={p.coordinates[0]} latitude={p.coordinates[1]} anchor="center">
            <div className={`flex items-center justify-center rounded-md border ${
              p.status === "operational" ? "border-amber-400/70 bg-amber-400/20" : "border-amber-400/40 bg-amber-400/10 animate-pulse"
            }`} style={{ width: 22, height: 22, boxShadow: "0 0 12px -2px rgba(255,184,48,0.5)" }}
              title={`${p.name} · ${p.capacity} MW`}>
              <Zap size={12} className="text-amber-400" />
            </div>
          </Marker>
        ))}

        {activeLayers.waterAccess && (Object.keys(REGION_CENTROIDS) as RegionId[]).map((id) => {
          const c = REGION_CENTROIDS[id];
          const pop = REGION_POP[id];
          const size = Math.max(10, Math.min(30, Math.sqrt(pop) / 35));
          return (
            <Marker key={id} longitude={c[0]} latitude={c[1]}>
              <div className="rounded-full border border-cyan-400/60 bg-cyan-400/15"
                style={{ width: size, height: size }} />
            </Marker>
          );
        })}

        {activeLayers.climateRisks && (
          <Marker longitude={68.7} latitude={37.4}>
            <AlertTriangle size={16} className="text-risk-red drop-shadow" />
          </Marker>
        )}
      </Map>

      {hover && (
        <div
          className="pointer-events-none absolute z-20 glass border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary"
          style={{ left: hover.x + 12, top: hover.y + 12 }}
        >
          <div className="font-medium">{hover.name}</div>
          <div className="font-mono text-cyan-400">{hover.access}% access</div>
        </div>
      )}

      <div className="absolute top-4 left-4 z-10 panel !p-1 flex">
        {(["dark", "satellite", "terrain"] as const).map((s) => (
          <button key={s} onClick={() => setMapStyle(s)}
            className={`px-3 py-1.5 text-[11px] uppercase font-mono rounded-md transition-colors ${
              mapStyle === s ? "bg-cyan-400/15 text-cyan-400" : "text-text-secondary hover:text-text-primary"
            }`}>
            {t(`mapControls.${s}`)}
          </button>
        ))}
      </div>

      <MapLegend />
    </div>
  );
}
