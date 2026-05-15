import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/store/useAppStore";
import { Map as MapIcon, BarChart3, GraduationCap } from "lucide-react";
import type { ActiveView, Lang } from "@/types";

function Logo() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" className="shrink-0" aria-hidden>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#1a6bff" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14.5" fill="none" stroke="#243d5e" strokeWidth="1" />
      <path d="M16 4 C 22 12, 24 17, 22 22 A 7 7 0 0 1 10 22 C 8 17, 10 12, 16 4 Z"
            fill="url(#lg)" opacity="0.18" stroke="url(#lg)" strokeWidth="1.2" />
      <path d="M9 19 q 2 -2 4 0 t 4 0 t 4 0" fill="none" stroke="#00d4ff" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M9 22 q 2 -2 4 0 t 4 0 t 4 0" fill="none" stroke="#00e5c0" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

const TABS: { id: ActiveView; icon: typeof MapIcon }[] = [
  { id: "map", icon: MapIcon },
  { id: "analytics", icon: BarChart3 },
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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="h-14 px-4 flex items-center justify-between border-b border-border-subtle relative z-30"
      style={{ background: "rgba(4,9,26,0.92)", backdropFilter: "blur(12px)" }}
    >
      <div className="flex items-center gap-3">
        <Logo />
        <div className="leading-tight">
          <div className="font-semibold text-text-primary tracking-tight">{t("nav.brand")}</div>
          <div className="font-mono text-[10px] text-text-secondary uppercase tracking-wider">{t("nav.tagline")}</div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-1 panel !rounded-full !py-1 !px-1 !bg-panel-mid/60">
        {TABS.map(({ id, icon: Icon }) => {
          const active = activeView === id;
          return (
            <button
              key={id}
              onClick={() => setActiveView(id)}
              className={`relative px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
                active ? "text-cyan-400" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="activeTabBg"
                  className="absolute inset-0 rounded-full"
                  style={{ background: "rgba(0,212,255,0.10)", boxShadow: "0 0 0 1px rgba(0,212,255,0.35), 0 0 18px -4px rgba(0,212,255,0.45)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon size={14} className="relative" />
              <span className="relative">{t(`nav.tabs.${id}`)}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full border border-border-subtle bg-panel-mid/60">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-success-green opacity-75 animate-pulse-dot" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success-green" />
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">{t("nav.status.live")}</span>
        </div>
        <div className="flex panel !rounded-full !p-0.5 !bg-panel-mid/60">
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
