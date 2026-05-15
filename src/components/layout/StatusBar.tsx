import { useTranslation } from "react-i18next";
import { Droplet, Mountain, AlertTriangle, Zap, Users } from "lucide-react";

const items = [
  { key: "waterAccess", icon: Droplet, value: "74%", color: "text-cyan-400" },
  { key: "glacierArea", icon: Mountain, value: "8,030 km²", color: "text-text-primary" },
  { key: "riskDistricts", icon: AlertTriangle, value: "18", color: "text-risk-red" },
  { key: "hydroCapacity", icon: Zap, value: "9.1 GW", color: "text-amber-400" },
  { key: "population", icon: Users, value: "10.1M", color: "text-teal-400" },
];

export function StatusBar() {
  const { t } = useTranslation();
  return (
    <div className="h-9 border-t border-border-subtle flex items-center justify-between px-4 text-[11px] glass relative z-20">
      <div className="flex items-center gap-5 overflow-x-auto scroll-thin">
        {items.map(({ key, icon: Icon, value, color }, i) => (
          <div key={key} className="flex items-center gap-2 shrink-0">
            <Icon size={12} className="text-text-muted" />
            <span className="text-text-secondary uppercase tracking-wider">{t(`statusBar.${key}`)}</span>
            <span className={`data-num font-medium ${color}`}>{value}</span>
            {i < items.length - 1 && <span className="ml-3 w-px h-3 bg-border-subtle" />}
          </div>
        ))}
      </div>
      <div className="hidden md:block text-text-muted font-mono">{t("nav.status.dataSource")}</div>
    </div>
  );
}
