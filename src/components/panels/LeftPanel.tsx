import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/store/useAppStore";
import { Waves, Mountain, Droplet, AlertTriangle, Zap, Database, Users, Sprout } from "lucide-react";
import type { LayerKey } from "@/types";
import { RegionDetailPanel } from "./RegionDetailPanel";

const LAYERS: { key: LayerKey; icon: typeof Waves; color: string }[] = [
  { key: "rivers", icon: Waves, color: "#00d4ff" },
  { key: "glaciers", icon: Mountain, color: "#dcefff" },
  { key: "waterAccess", icon: Droplet, color: "#00e07a" },
  { key: "climateRisks", icon: AlertTriangle, color: "#ff4d6a" },
  { key: "hydropower", icon: Zap, color: "#ffb830" },
  { key: "reservoirs", icon: Database, color: "#1a6bff" },
  { key: "populationDensity", icon: Users, color: "#1a6bff" },
  { key: "agriculturalZones", icon: Sprout, color: "#00e5c0" },
];

export function LeftPanel() {
  const { t } = useTranslation();
  const { activeLayers, toggleLayer, selectedRegion } = useAppStore();
  const activeCount = Object.values(activeLayers).filter(Boolean).length;

  return (
    <aside className="w-[268px] shrink-0 border-r border-border-subtle bg-navy-900/60 overflow-y-auto scroll-thin">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-text-secondary">{t("layers.title")}</h3>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-400/10 border border-cyan-400/30 rounded-full px-2 py-0.5">
            {activeCount}/{LAYERS.length}
          </span>
        </div>
        <div className="space-y-1">
          {LAYERS.map(({ key, icon: Icon, color }) => {
            const on = activeLayers[key];
            return (
              <button
                key={key}
                onClick={() => toggleLayer(key)}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all duration-200 text-left ${
                  on ? "bg-cyan-400/5 border border-cyan-400/25" : "border border-transparent hover:bg-panel-mid/50"
                }`}
              >
                <Icon size={14} style={{ color: on ? color : "#4a6080" }} />
                <span className={`text-[13px] flex-1 ${on ? "text-text-primary" : "text-text-secondary"}`}>
                  {t(`layers.${key}`)}
                </span>
                <motion.div
                  className={`w-7 h-3.5 rounded-full p-0.5 flex ${on ? "bg-cyan-400/40 justify-end" : "bg-panel-mid justify-start"}`}
                  layout transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <motion.span layout className={`w-2.5 h-2.5 rounded-full ${on ? "bg-cyan-400" : "bg-text-muted"}`} />
                </motion.div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border-subtle">
        <AnimatePresence mode="wait">
          {selectedRegion ? (
            <RegionDetailPanel key={selectedRegion} regionId={selectedRegion} />
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="p-4 text-xs text-text-muted leading-relaxed">
              {t("regionDetail.selectPrompt")}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
