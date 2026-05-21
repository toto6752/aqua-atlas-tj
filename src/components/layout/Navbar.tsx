import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/store/useAppStore";
import { MapTrifold, ChartLineUp, GraduationCap, Drop } from "@phosphor-icons/react";
import type { ActiveView, Lang } from "@/types";

function Logo() {
  return (
    <div className="relative w-9 h-9 rounded-xl flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, rgba(79,125,243,0.18), rgba(16,185,129,0.12))",
               border: "1px solid rgba(79,125,243,0.28)",
               boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 12px -4px rgba(79,125,243,0.25)" }}>
      <Drop size={18} weight="duotone" className="text-cyan-400" />
    </div>
  );
}

const TABS: { id: ActiveView; icon: typeof MapTrifold }[] = [
  { id: "map", icon: MapTrifold },
  { id: "analytics", icon: ChartLineUp },
  { id: "education", icon: GraduationCap },
];

export function Navbar() {
  const { t, i18n } = useTranslation();
  const { activeView, setActiveView, language, setLanguage } = useAppStore();

  const setLang = (l: Lang) => {
    setLanguage(l);
    void i18n.changeLanguage(l);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="h-16 px-5 flex items-center justify-between relative z-30 glass border-b border-border-subtle"
    >
      <div className="flex items-center gap-3">
        <Logo />
        <div className="leading-tight">
          <div className="font-semibold text-text-primary tracking-tight text-[15px]">{t("nav.brand")}</div>
          <div className="text-[11px] text-text-secondary tracking-tight">{t("nav.tagline")}</div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-0.5 rounded-full p-1 bg-panel-mid/40 border border-border-subtle/70">
        {TABS.map(({ id, icon: Icon }) => {
          const active = activeView === id;
          return (
            <button
              key={id}
              onClick={() => setActiveView(id)}
              className={`relative px-4 py-1.5 rounded-full text-[13px] font-medium flex items-center gap-2 transition-colors duration-200 ${
                active ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="activeTabBg"
                  className="absolute inset-0 rounded-full"
                  style={{ background: "linear-gradient(180deg, rgba(79,125,243,0.16), rgba(79,125,243,0.08))",
                           boxShadow: "inset 0 0 0 1px rgba(79,125,243,0.30), 0 4px 14px -6px rgba(79,125,243,0.30)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon size={15} weight={active ? "duotone" : "regular"} className="relative" />
              <span className="relative">{t(`nav.tabs.${id}`)}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2.5">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-subtle bg-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-success-green" />
          <span className="text-[10.5px] text-text-secondary">{t("nav.status.live")}</span>
        </div>
        <div className="flex rounded-full p-0.5 bg-panel-mid/40 border border-border-subtle/70">
          {(["en", "ru"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-mono uppercase transition-colors ${
                language === l ? "bg-cyan-400/15 text-cyan-400" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
