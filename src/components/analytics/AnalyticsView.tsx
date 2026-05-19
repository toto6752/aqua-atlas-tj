import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ComposedChart, Legend, Line,
  PolarAngleAxis, PolarGrid, Radar, RadarChart, ReferenceLine, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Cell,
} from "recharts";
import { TIME_SERIES, REGIONAL_WATER_QUALITY, HYDROPOWER_PLANTS, REGION_COLORS, type RegionId } from "@/data/environmentalData";
import { Drop, Mountains, WarningCircle, Lightning, TrendUp, TrendDown } from "@phosphor-icons/react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const tooltipStyle = {
  contentStyle: { background: "rgba(255,255,255,0.95)", border: "1px solid rgba(17,24,39,0.08)", borderRadius: 10, fontSize: 12, boxShadow: "0 12px 28px -10px rgba(0,0,0,0.5)" },
  labelStyle: { color: "#6B7280", fontFamily: "JetBrains Mono" },
  itemStyle: { color: "#111827" },
} as const;

function MetricCard({
  title, subtitle, value, unit, change, source, color, data, dataKey, trend,
}: {
  title: string; subtitle: string; value: string; unit: string; change: string; source: string;
  color: string; data: { y: number; v: number }[]; dataKey: string; trend: "up" | "down";
}) {
  const Icon = trend === "up" ? TrendUp : TrendDown;
  return (
    <motion.div variants={fadeInUp} className="panel p-5 flex flex-col gap-3 hover:border-border-normal/70 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-mono tracking-wider text-text-secondary">{title}</div>
          <div className="text-[10.5px] text-text-muted mt-0.5">{subtitle}</div>
        </div>
        <div className={`flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full ${
          trend === "up" ? "text-success-green bg-success-green/10" : "text-risk-red bg-risk-red/10"
        }`}>
          <Icon size={11} weight="bold" /> {change}
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="data-num text-[28px] font-medium tracking-tight" style={{ color }}>{value}</span>
        <span className="text-xs text-text-muted">{unit}</span>
      </div>
      <div className="h-14 -mx-1">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`g-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.45} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.6} fill={`url(#g-${dataKey})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="text-[10px] text-text-muted font-mono">{source}</div>
    </motion.div>
  );
}

export default function AnalyticsView() {
  const { t } = useTranslation();
  const years = TIME_SERIES.years;
  const [activeRegion, setActiveRegion] = useState<RegionId>("dushanbe");

  const yearMap = (vals: number[]) => years.map((y, i) => ({ y, v: vals[i] }));

  const regional = (Object.keys(REGION_COLORS) as RegionId[]).map((id) => ({
    id,
    name: t(`regions.${id}.name`) as string,
    val: TIME_SERIES.waterAccess[id][TIME_SERIES.waterAccess[id].length - 1],
    color: REGION_COLORS[id],
  }));

  const dischargeData = years.map((y, i) => ({
    y, discharge: TIME_SERIES.riverDischarge[i], temp: TIME_SERIES.temperatureAnomaly[i],
  }));

  const glacierData = years.map((y, i) => ({
    y, area: TIME_SERIES.glacierArea[i], loss: TIME_SERIES.glacierMassLossIndex[i],
  }));

  const precipData = years.map((y, i) => ({ y, v: TIME_SERIES.precipitationAnomaly[i] }));

  const wq = REGIONAL_WATER_QUALITY[activeRegion];
  const radarData = [
    { metric: "pH", v: (wq.ph / 9) * 10 },
    { metric: "Clarity", v: 10 - Math.min(10, wq.turbidity) },
    { metric: "Nitrates", v: 10 - Math.min(10, wq.nitrates / 5) },
    { metric: "Bacterial", v: 10 - Math.min(10, wq.coliform / 5) },
    { metric: "Coverage", v: wq.score },
  ];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate"
      className="h-full overflow-y-auto scroll-thin p-8 space-y-6 max-w-[1600px] mx-auto">
      <motion.div variants={fadeInUp}>
        <div className="text-[11px] font-mono tracking-[0.18em] text-cyan-400/80 uppercase mb-1">Insights</div>
        <h1 className="text-[28px] font-semibold text-text-primary tracking-tight">{t("analytics.title")}</h1>
        <p className="text-[14px] text-text-secondary mt-1">{t("analytics.subtitle")}</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard title={t("analytics.waterAccess.title")} subtitle={t("analytics.waterAccess.subtitle")}
          value="74" unit="%" change="+3.2%" trend="up" source={t("analytics.waterAccess.source")}
          color="#6cc6e0" dataKey="wa" data={yearMap(TIME_SERIES.waterAccess.national)} />
        <MetricCard title={t("analytics.glacierCoverage.title")} subtitle={t("analytics.glacierCoverage.subtitle")}
          value="8,030" unit="km²" change="-1.4%/yr" trend="down" source={t("analytics.glacierCoverage.source")}
          color="#bcd9ea" dataKey="gc" data={yearMap(TIME_SERIES.glacierArea)} />
        <MetricCard title={t("analytics.floodRiskZones.title")} subtitle={t("analytics.floodRiskZones.subtitle")}
          value="18" unit="" change="+2 since 2021" trend="up" source={t("analytics.floodRiskZones.source")}
          color="#d76d80" dataKey="fr" data={yearMap(TIME_SERIES.floodRiskDistricts)} />
        <MetricCard title={t("analytics.hydroCapacity.title")} subtitle={t("analytics.hydroCapacity.subtitle")}
          value="9.1" unit="GW" change="+0.8 GW" trend="up" source={t("analytics.hydroCapacity.source")}
          color="#e0b878" dataKey="hc" data={yearMap(TIME_SERIES.hydroCapacity)} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <motion.div variants={fadeInUp} className="panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <Drop size={15} weight="duotone" className="text-cyan-400" />
            <h3 className="text-[14px] font-semibold text-text-primary tracking-tight">{t("analytics.regionalComparison")}</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={regional} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <CartesianGrid stroke="rgba(17,24,39,0.06)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip {...tooltipStyle} cursor={{ fill: "rgba(79,125,243,0.04)" }} />
                <Bar dataKey="val" radius={[8, 8, 0, 0]}>
                  {regional.map((d) => <Cell key={d.id} fill={d.color} fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <WarningCircle size={15} weight="duotone" className="text-amber-400" />
            <h3 className="text-[14px] font-semibold text-text-primary tracking-tight">{t("analytics.climateDischarge")}</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <ComposedChart data={dischargeData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <defs>
                  <linearGradient id="dischargeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4a86d6" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#4a86d6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(17,24,39,0.06)" vertical={false} />
                <XAxis dataKey="y" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="l" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 11, fill: "#F59E0B" }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11, color: "#6B7280" }} />
                <Area yAxisId="l" type="monotone" dataKey="discharge" name="Discharge km³" stroke="#4a86d6" fill="url(#dischargeFill)" strokeWidth={2} />
                <Line yAxisId="r" type="monotone" dataKey="temp" name="Temp anomaly °C" stroke="#e0b878" strokeWidth={2} dot={{ r: 3 }} />
                <ReferenceLine yAxisId="r" y={0} stroke="rgba(17,24,39,0.10)" strokeDasharray="3 3" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <Mountains size={15} weight="duotone" className="text-cyan-400" />
            <h3 className="text-[14px] font-semibold text-text-primary tracking-tight">{t("analytics.glacierTimeline")}</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={glacierData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <defs>
                  <linearGradient id="glFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6cc6e0" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6cc6e0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(17,24,39,0.06)" vertical={false} />
                <XAxis dataKey="y" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="loss" stroke="#6cc6e0" fill="url(#glFill)" strokeWidth={2} name="Mass loss vs 2017" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <Drop size={15} weight="duotone" className="text-teal-400" />
            <h3 className="text-[14px] font-semibold text-text-primary tracking-tight">{t("analytics.precipitationTrend")}</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={precipData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <CartesianGrid stroke="rgba(17,24,39,0.06)" vertical={false} />
                <XAxis dataKey="y" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip {...tooltipStyle} cursor={{ fill: "rgba(79,125,243,0.04)" }} />
                <ReferenceLine y={0} stroke="rgba(17,24,39,0.10)" />
                <Bar dataKey="v" radius={[4, 4, 4, 4]}>
                  {precipData.map((d, i) => <Cell key={i} fill={d.v >= 0 ? "#6dd0b4" : "#d76d80"} fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div variants={fadeInUp} className="panel p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="text-[14px] font-semibold text-text-primary tracking-tight">{t("analytics.waterQuality")}</h3>
          <div className="flex gap-0.5 p-1 rounded-full bg-panel-mid/50 border border-border-subtle/70">
            {(Object.keys(REGION_COLORS) as RegionId[]).map((id) => (
              <button key={id} onClick={() => setActiveRegion(id)}
                className={`px-3 py-1 text-[11px] rounded-full transition-colors ${
                  activeRegion === id ? "bg-cyan-400/15 text-cyan-400" : "text-text-secondary hover:text-text-primary"
                }`}>
                {(t(`regions.${id}.name`) as string).slice(0, 8)}
              </button>
            ))}
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(17,24,39,0.10)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#6B7280" }} />
              <Radar dataKey="v" stroke={REGION_COLORS[activeRegion]} fill={REGION_COLORS[activeRegion]} fillOpacity={0.25} strokeWidth={1.5} />
              <Tooltip {...tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lightning size={15} weight="duotone" className="text-amber-400" />
          <h3 className="text-[14px] font-semibold text-text-primary tracking-tight">{t("analytics.hydroPlants")}</h3>
        </div>
        <div className="overflow-x-auto scroll-thin">
          <table className="w-full text-[12.5px] min-w-[640px]">
            <thead className="text-text-muted font-mono tracking-wider text-[10px]">
              <tr className="border-b border-border-subtle">
                <th className="text-left py-2.5 font-normal">Plant</th>
                <th className="text-left py-2.5 font-normal">River</th>
                <th className="text-right py-2.5 font-normal">Capacity (MW)</th>
                <th className="text-right py-2.5 font-normal">Height</th>
                <th className="text-right py-2.5 font-normal">Year</th>
                <th className="text-left py-2.5 pl-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {HYDROPOWER_PLANTS.sort((a, b) => b.capacity - a.capacity).map((p) => {
                const max = 3600;
                return (
                  <tr key={p.id} className="border-b border-border-subtle/40 hover:bg-panel-mid/30 transition-colors">
                    <td className="py-2.5 text-text-primary font-medium">{p.name}</td>
                    <td className="py-2.5 text-text-secondary">{p.river}</td>
                    <td className="py-2.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 h-1 bg-panel-mid/70 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${(p.capacity / max) * 100}%`, background: "linear-gradient(90deg, #e0b878, #c79a55)" }} />
                        </div>
                        <span className="data-num text-text-primary">{p.capacity.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-right data-num text-text-secondary">{p.height} m</td>
                    <td className="py-2.5 text-right data-num text-text-secondary">{p.yearBuilt ?? `→ ${p.expectedCompletion}`}</td>
                    <td className="py-2.5 pl-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono ${
                        p.status === "operational"
                          ? "bg-success-green/12 text-success-green border border-success-green/25"
                          : "bg-amber-400/12 text-amber-400 border border-amber-400/25"
                      }`}>
                        {p.status === "operational" ? "Operational" : "Building"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
