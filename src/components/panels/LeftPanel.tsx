import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/store/useAppStore";
import { Waves, Mountains, Drop, WarningCircle, Lightning, Database, UsersThree, Plant } from "@phosphor-icons/react";
import type { LayerKey } from "@/types";
import { RegionDetailPanel } from "./RegionDetailPanel";

const LAYERS: { key: LayerKey; icon: typeof Waves; color: string }[] = [
  { key: "rivers", icon: Waves, color: "#6cc6e0" },
  { key: "glaciers", icon: Mountains, color: "#bcd9ea" },
  { key: "waterAccess", icon: Drop, color: "#6dd0b4" },
  { key: "climateRisks", icon: WarningCircle, color: "#d76d80" },
  { key: "hydropower", icon: Lightning, color: "#e0b878" },
  { key: "reservoirs", icon: Database, color: "#4a86d6" },
  { key: "populationDensity", icon: UsersThree, color: "#7a9bd4" },
  { key: "agriculturalZones", icon: Plant, color: "#6dd0b4" },
];

export function LeftPanel() {
  const { t } = useTranslation();
  const { activeLayers, toggleLayer, selectedRegion } = useAppStore();
  const activeCount = Object.values(activeLayers).filter(Boolean).length;

  return (
    <aside className="w-[288px] shrink-0 border-r border-border-subtle bg-navy-900/40 backdrop-blur-xl overflow-y-auto scroll-thin">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[13px] font-semibold text-text-primary tracking-tight">{t("layers.title")}</h3>
            <p className="text-[11px] text-text-muted mt-0.5">Toggle data overlays</p>
          </div>
          <span className="text-[10px] font-mono text-text-secondary bg-panel-mid/60 border border-border-subtle rounded-full px-2 py-0.5">
            {activeCount}/{LAYERS.length}
          </span>
        </div>
        <div className="space-y-1.5">
          {LAYERS.map(({ key, icon: Icon, color }) => {
            const on = activeLayers[key];
            return (
              <button
                key={key}
                onClick={() => toggleLayer(key)}
                className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left border ${
                  on
                    ? "bg-panel-mid/60 border-border-normal/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                    : "border-transparent hover:bg-panel-mid/30 hover:border-border-subtle/50"
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all`}
                  style={{
                    background: on ? `${color}1c` : "rgba(243,245,249,0.5)",
                    border: `1px solid ${on ? `${color}40` : "rgba(17,24,39,0.6)"}`,
                  }}>
                  <Icon size={14} weight="duotone" style={{ color: on ? color : "#5b6e8e" }} />
                </div>
                <span className={`text-[13px] flex-1 tracking-tight ${on ? "text-text-primary" : "text-text-secondary"}`}>
                  {t(`layers.${key}`)}
                </span>
                <motion.div
                  className={`w-8 h-4 rounded-full p-0.5 flex transition-colors ${on ? "justify-end" : "justify-start"}`}
                  style={{ background: on ? "rgba(79,125,243,0.4)" : "rgba(17,24,39,0.7)" }}
                  layout transition={{ type: "spring", stiffness: 500, damping: 32 }}
                >
                  <motion.span layout className="w-3 h-3 rounded-full bg-white/90 shadow-sm" />
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
              className="p-5 text-[12px] text-text-muted leading-relaxed">
              <div className="rounded-xl border border-dashed border-border-subtle/70 p-4 text-center">
                <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-panel-mid/60 flex items-center justify-center">
                  <Drop size={16} weight="duotone" className="text-text-muted" />
                </div>
                <div>{t("regionDetail.selectPrompt")}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
