import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Mountain, Droplets, Zap, ThermometerSun, Waves, AlertTriangle, ChevronDown, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const CARDS = [
  { id: "glaciers", icon: Mountain, color: "#bfe2ff", category: "Cryosphere" },
  { id: "waterAccess", icon: Droplets, color: "#00d4ff", category: "Equity" },
  { id: "hydropower", icon: Zap, color: "#ffb830", category: "Energy" },
  { id: "climateChange", icon: ThermometerSun, color: "#ff4d6a", category: "Climate" },
  { id: "rivers", icon: Waves, color: "#00e5c0", category: "Hydrology" },
] as const;

export default function EducationView() {
  const { t } = useTranslation();
  const { setActiveView, addChatMessage } = useAppStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate"
      className="h-full overflow-y-auto scroll-thin p-6">
      <motion.div variants={fadeInUp} className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">{t("education.title")}</h1>
        <p className="text-sm text-text-secondary">{t("education.subtitle")}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-6xl">
        {CARDS.map((c) => {
          const data = t(`education.cards.${c.id}`, { returnObjects: true }) as {
            title: string; body: string; stats: string[]; warning: string;
          };
          const isOpen = expanded === c.id;
          return (
            <motion.div key={c.id} variants={fadeInUp}
              className="panel p-5 flex flex-col gap-3 hover:border-border-normal transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${c.color}15`, border: `1px solid ${c.color}40` }}>
                  <c.icon size={18} style={{ color: c.color }} />
                </div>
                <div className="flex-1">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider mb-1.5"
                    style={{ background: `${c.color}10`, color: c.color, border: `1px solid ${c.color}30` }}>
                    {c.category}
                  </span>
                  <h3 className="font-semibold text-text-primary leading-tight">{data.title}</h3>
                </div>
              </div>

              <p className={`text-sm text-text-secondary leading-relaxed ${isOpen ? "" : "line-clamp-3"}`}>{data.body}</p>

              <div className="flex flex-wrap gap-1.5">
                {data.stats.map((s) => (
                  <span key={s} className="text-[11px] px-2 py-1 rounded-md bg-panel-mid border border-border-subtle text-text-primary data-num">
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-400/5 border border-amber-400/25">
                <AlertTriangle size={14} className="text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-400/90 leading-relaxed">{data.warning}</p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button onClick={() => setExpanded(isOpen ? null : c.id)}
                  className="flex items-center gap-1 text-[11px] text-text-secondary hover:text-cyan-400 transition-colors font-mono uppercase tracking-wider">
                  {isOpen ? "Less" : "More"}
                  <ChevronDown size={12} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <button onClick={() => {
                  setActiveView("map");
                  addChatMessage({ id: crypto.randomUUID(), role: "user", content: data.title });
                }}
                  className="flex items-center gap-1.5 text-[11px] text-cyan-400 hover:text-cyan-400/80 transition-colors font-medium">
                  <Sparkles size={12} /> {t("education.askAI")}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
