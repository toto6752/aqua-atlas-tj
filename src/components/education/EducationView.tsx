import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Mountains, Drop, Lightning, Thermometer, Waves, WarningCircle, CaretDown, Sparkle } from "@phosphor-icons/react";
import { useAppStore } from "@/store/useAppStore";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const CARDS = [
  { id: "glaciers", icon: Mountains, color: "#bcd9ea", category: "Cryosphere" },
  { id: "waterAccess", icon: Drop, color: "#6cc6e0", category: "Equity" },
  { id: "hydropower", icon: Lightning, color: "#e0b878", category: "Energy" },
  { id: "climateChange", icon: Thermometer, color: "#d76d80", category: "Climate" },
  { id: "rivers", icon: Waves, color: "#6dd0b4", category: "Hydrology" },
] as const;

export default function EducationView() {
  const { t } = useTranslation();
  const { setActiveView, addChatMessage } = useAppStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate"
      className="h-full overflow-y-auto scroll-thin p-8 max-w-[1400px] mx-auto">
      <motion.div variants={fadeInUp} className="mb-6">
        <div className="text-[11px] font-mono tracking-[0.18em] text-cyan-400/80 uppercase mb-1">Knowledge</div>
        <h1 className="text-[28px] font-semibold text-text-primary tracking-tight">{t("education.title")}</h1>
        <p className="text-[14px] text-text-secondary mt-1">{t("education.subtitle")}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {CARDS.map((c) => {
          const data = t(`education.cards.${c.id}`, { returnObjects: true }) as {
            title: string; body: string; stats: string[]; warning: string;
          };
          const isOpen = expanded === c.id;
          return (
            <motion.div key={c.id} variants={fadeInUp}
              className="panel p-6 flex flex-col gap-4 hover:border-border-normal/70 transition-colors">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${c.color}1a`, border: `1px solid ${c.color}3a`, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04)` }}>
                  <c.icon size={20} weight="duotone" style={{ color: c.color }} />
                </div>
                <div className="flex-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider mb-1.5"
                    style={{ background: `${c.color}10`, color: c.color, border: `1px solid ${c.color}28` }}>
                    {c.category}
                  </span>
                  <h3 className="font-semibold text-text-primary text-[16px] leading-tight tracking-tight">{data.title}</h3>
                </div>
              </div>

              <p className={`text-[13px] text-text-secondary leading-relaxed ${isOpen ? "" : "line-clamp-3"}`}>{data.body}</p>

              <div className="flex flex-wrap gap-1.5">
                {data.stats.map((s) => (
                  <span key={s} className="text-[11px] px-2.5 py-1 rounded-full bg-panel-mid/50 border border-border-subtle/70 text-text-primary data-num">
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-400/5 border border-amber-400/20">
                <WarningCircle size={15} weight="duotone" className="text-amber-400 mt-0.5 shrink-0" />
                <p className="text-[12px] text-amber-400/90 leading-relaxed">{data.warning}</p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button onClick={() => setExpanded(isOpen ? null : c.id)}
                  className="flex items-center gap-1.5 text-[11px] text-text-secondary hover:text-cyan-400 transition-colors font-mono tracking-wider">
                  {isOpen ? "LESS" : "MORE"}
                  <CaretDown size={11} weight="bold" className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <button onClick={() => {
                  setActiveView("map");
                  addChatMessage({ id: crypto.randomUUID(), role: "user", content: data.title });
                }}
                  className="flex items-center gap-1.5 text-[11.5px] text-cyan-400 hover:text-text-primary transition-colors font-medium">
                  <Sparkle size={12} weight="duotone" /> {t("education.askAI")}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
