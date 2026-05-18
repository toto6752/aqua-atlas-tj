import { useTranslation } from "react-i18next";
import { Drop, Mountains, WarningCircle, Lightning, UsersThree } from "@phosphor-icons/react";

const items = [
  { key: "waterAccess", icon: Drop, value: "74%", tone: "text-cyan-400" },
  { key: "glacierArea", icon: Mountains, value: "8,030 km²", tone: "text-text-primary" },
  { key: "riskDistricts", icon: WarningCircle, value: "18", tone: "text-risk-red" },
  { key: "hydroCapacity", icon: Lightning, value: "9.1 GW", tone: "text-amber-400" },
  { key: "population", icon: UsersThree, value: "10.1M", tone: "text-teal-400" },
];

export function StatusBar() {
  const { t } = useTranslation();
  return (
    <div className="h-10 border-t border-border-subtle flex items-center justify-between px-5 text-[11px] glass relative z-20">
      <div className="flex items-center gap-1 overflow-x-auto scroll-thin">
        {items.map(({ key, icon: Icon, value, tone }, i) => (
          <div key={key} className="flex items-center gap-2 shrink-0 px-3 py-1 rounded-md hover:bg-panel-mid/40 transition-colors">
            <Icon size={13} weight="duotone" className="text-text-muted" />
            <span className="text-text-secondary tracking-tight">{t(`statusBar.${key}`)}</span>
            <span className={`data-num font-medium ${tone}`}>{value}</span>
            {i < items.length - 1 && <span className="ml-2 w-px h-3 bg-border-subtle/70" />}
          </div>
        ))}
      </div>
      <div className="hidden md:flex items-center gap-2 text-text-muted font-mono text-[10px]">
        <span className="w-1 h-1 rounded-full bg-text-muted/60" />
        {t("nav.status.dataSource")}
      </div>
    </div>
  );
}
