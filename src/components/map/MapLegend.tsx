import { useTranslation } from "react-i18next";

export function MapLegend() {
  const { t } = useTranslation();
  const items = [
    { color: "#6dd0b4", label: t("legend.highAccess") },
    { color: "#e0b878", label: t("legend.moderateAccess") },
    { color: "#d76d80", label: t("legend.lowAccess") },
  ];
  return (
    <div className="absolute bottom-5 left-5 glass border border-border-subtle rounded-2xl p-3.5 text-[11px] z-10 min-w-[210px] shadow-[var(--shadow-elevated)]">
      <div className="font-mono tracking-wider text-[10px] text-text-secondary mb-2.5">{t("legend.title")}</div>
      <div className="space-y-1.5">
        {items.map((i) => (
          <div key={i.label} className="flex items-center gap-2.5 text-text-primary">
            <span className="inline-block h-2.5 w-3.5 rounded-[3px]" style={{ background: i.color, opacity: 0.85 }} />
            <span className="text-[11.5px]">{i.label}</span>
          </div>
        ))}
        <div className="h-px bg-border-subtle/70 my-2" />
        <div className="flex items-center gap-2.5 text-text-secondary">
          <span className="inline-block h-0.5 w-3.5 rounded-full" style={{ background: "#6cc6e0" }} /> {t("legend.rivers")}
        </div>
        <div className="flex items-center gap-2.5 text-text-secondary">
          <span className="inline-block h-2.5 w-3.5 rounded-[3px]" style={{ background: "rgba(219,234,254,0.7)" }} /> {t("legend.glaciers")}
        </div>
        <div className="flex items-center gap-2.5 text-text-secondary">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#e0b878" }} /> {t("legend.hydropower")}
        </div>
      </div>
    </div>
  );
}
