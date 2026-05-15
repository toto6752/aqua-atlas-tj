import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BarChart, Bar, ResponsiveContainer, XAxis, Cell } from "recharts";
import { Sparkles, Droplet, Users, AlertTriangle, Mountain } from "lucide-react";
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
    { icon: Droplet, label: t("regionDetail.waterAccess"), value: `${region.stats.waterAccess}%`, color: "text-cyan-400" },
    { icon: Users, label: t("regionDetail.population"), value: region.stats.population, color: "text-text-primary" },
    { icon: AlertTriangle, label: t("regionDetail.floodRisk"), value: region.stats.floodRisk, color: "text-amber-400" },
    { icon: Mountain, label: t("regionDetail.glaciers"), value: region.stats.glaciers, color: "text-text-primary" },
  ];

  return (
    <motion.div variants={slideInRight} initial="initial" animate="animate" className="p-4 space-y-4">
      <div>
        <div className="text-[10px] uppercase tracking-wider font-mono text-cyan-400">{region.type}</div>
        <h2 className="text-lg font-semibold text-text-primary leading-tight">{region.name}</h2>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="panel !p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-text-muted">
              <s.icon size={10} /> {s.label}
            </div>
            <div className={`mt-0.5 data-num text-sm font-medium ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-text-muted mb-1.5">
          <span>{t("regionDetail.infrastructure")}</span>
          <span className="data-num text-cyan-400">{region.stats.infrastructureScore}/10</span>
        </div>
        <div className="h-1.5 bg-panel-mid rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${region.stats.infrastructureScore * 10}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-cyan-400 to-teal-400" />
        </div>
      </div>

      <p className="text-xs text-text-secondary leading-relaxed">{region.description}</p>

      <div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-text-muted mb-1.5">Water access by region</div>
        <div className="h-20">
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Bar dataKey="val" radius={[3, 3, 0, 0]}>
                {chartData.map((d) => (
                  <Cell key={d.id} fill={d.color} fillOpacity={d.id === regionId ? 1 : 0.35} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button onClick={askAi}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-400 text-xs font-medium transition-colors">
        <Sparkles size={13} /> {t("regionDetail.askAI")}
      </button>

      <div className="text-[10px] text-text-muted font-mono">WHO/UNICEF JMP · NASA GLIMS · World Bank GFDRR</div>
    </motion.div>
  );
}
