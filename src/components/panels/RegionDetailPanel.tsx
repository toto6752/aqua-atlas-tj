import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BarChart, Bar, ResponsiveContainer, XAxis, Cell } from "recharts";
import { Sparkle, Drop, UsersThree, WarningCircle, Mountains } from "@phosphor-icons/react";
import { useAppStore } from "@/store/useAppStore";
import { TIME_SERIES, REGION_COLORS, type RegionId } from "@/data/environmentalData";
import { slideInRight } from "@/lib/animations";

export function RegionDetailPanel({ regionId }: { regionId: string }) {
  const { t } = useTranslation();
  const { setActiveView, addChatMessage } = useAppStore();
  const region = t(`regions.${regionId}`, { returnObjects: true }) as {
    name: string; type: string; description: string;
    stats: { waterAccess: number; population: string; floodRisk: string; glaciers: string;
      sanitationCoverage: number; annualRainfall: string; infrastructureScore: number };
  };

  const chartData = (Object.keys(REGION_COLORS) as RegionId[]).map((id) => ({
    id,
    name: (t(`regions.${id}.name`) as string).slice(0, 6),
    val: TIME_SERIES.waterAccess[id][TIME_SERIES.waterAccess[id].length - 1],
    color: REGION_COLORS[id],
  }));

  const askAi = () => {
    setActiveView("map");
    addChatMessage({
      id: crypto.randomUUID(),
      role: "user",
      content: `Tell me about water and climate context for ${region.name}, Tajikistan.`,
    });
  };

  const stats = [
    { icon: Drop, label: t("regionDetail.waterAccess"), value: `${region.stats.waterAccess}%`, tone: "text-cyan-400" },
    { icon: UsersThree, label: t("regionDetail.population"), value: region.stats.population, tone: "text-text-primary" },
    { icon: WarningCircle, label: t("regionDetail.floodRisk"), value: region.stats.floodRisk, tone: "text-amber-400" },
    { icon: Mountains, label: t("regionDetail.glaciers"), value: region.stats.glaciers, tone: "text-text-primary" },
  ];

  return (
    <motion.div variants={slideInRight} initial="initial" animate="animate" className="p-5 space-y-5">
      <div>
        <div className="text-[10px] uppercase tracking-[0.14em] font-mono text-cyan-400/90">{region.type}</div>
        <h2 className="text-[18px] font-semibold text-text-primary leading-tight mt-0.5 tracking-tight">{region.name}</h2>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="panel-flat p-3">
            <div className="flex items-center gap-1.5 text-[10px] tracking-wide text-text-muted">
              <s.icon size={11} weight="duotone" /> {s.label}
            </div>
            <div className={`mt-1 data-num text-[15px] font-medium ${s.tone}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex justify-between text-[10px] font-mono tracking-wider text-text-muted mb-2">
          <span>{t("regionDetail.infrastructure")}</span>
          <span className="data-num text-text-secondary">{region.stats.infrastructureScore}/10</span>
        </div>
        <div className="h-1 bg-panel-mid/60 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${region.stats.infrastructureScore * 10}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #6cc6e0, #6dd0b4)" }} />
        </div>
      </div>

      <p className="text-[12.5px] text-text-secondary leading-relaxed">{region.description}</p>

      <div>
        <div className="text-[10px] font-mono tracking-wider text-text-muted mb-2">Water access by region</div>
        <div className="h-20">
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                {chartData.map((d) => (
                  <Cell key={d.id} fill={d.color} fillOpacity={d.id === regionId ? 0.95 : 0.3} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button onClick={askAi}
        className="group w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12.5px] font-medium transition-all"
        style={{ background: "linear-gradient(180deg, rgba(79,125,243,0.14), rgba(79,125,243,0.06))",
                 border: "1px solid rgba(79,125,243,0.32)",
                 color: "#a8dceb",
                 boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}>
        <Sparkle size={14} weight="duotone" /> {t("regionDetail.askAI")}
      </button>

      <div className="text-[10px] text-text-muted font-mono">WHO/UNICEF JMP · NASA GLIMS · World Bank GFDRR</div>
    </motion.div>
  );
}
