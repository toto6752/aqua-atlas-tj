import { useTranslation } from "react-i18next";

export function MapLegend() {
  const { t } = useTranslation();
  const items = [
    { color: "#00e07a", label: t("legend.highAccess") },
    { color: "#ffb830", label: t("legend.moderateAccess") },
    { color: "#ff4d6a", label: t("legend.lowAccess") },
  ];
  return (
    <div className="absolute bottom-4 left-4 glass border border-border-subtle rounded-xl p-3 text-[11px] z-10 min-w-[200px]">
      <div className="font-mono uppercase tracking-wider text-[10px] text-text-secondary mb-2">{t("legend.title")}</div>
      <div className="space-y-1.5">
        {items.map((i) => (
          <div key={i.label} className="flex items-center gap-2 text-text-primary">
            <span className="inline-block h-2.5 w-4 rounded-sm" style={{ background: i.color, opacity: 0.85 }} />
            {i.label}
          </div>
        ))}
        <div className="h-px bg-border-subtle my-1.5" />
        <div className="flex items-center gap-2 text-text-secondary">
          <span className="inline-block h-0.5 w-4 bg-cyan-400" /> {t("legend.rivers")}
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <span className="inline-block h-2.5 w-4 rounded-sm" style={{ background: "rgba(220,240,255,0.8)" }} /> {t("legend.glaciers")}
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-400" /> {t("legend.hydropower")}
        </div>
      </div>
    </div>
  );
}
