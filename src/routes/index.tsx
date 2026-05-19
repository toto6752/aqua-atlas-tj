import { lazy, Suspense, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "@/i18n";
import { useAppStore } from "@/store/useAppStore";
import { Navbar } from "@/components/layout/Navbar";
import { StatusBar } from "@/components/layout/StatusBar";
import { LeftPanel } from "@/components/panels/LeftPanel";
import { AquaMap } from "@/components/map/AquaMap";
import { AIAssistant } from "@/components/ai/AIAssistant";

const AnalyticsView = lazy(() => import("@/components/analytics/AnalyticsView"));
const EducationView = lazy(() => import("@/components/education/EducationView"));

export const Route = createFileRoute("/")({ component: Index });

function Loader() {
  return <div className="h-full flex items-center justify-center text-text-muted text-xs font-mono">Loading…</div>;
}

function Index() {
  const { activeView, language } = useAppStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language !== language) void i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <div className="app-shell h-screen flex flex-col bg-background text-text-primary overflow-hidden relative">
      <div className="relative z-10 flex flex-col h-full">
        <Navbar />
        <main className="flex-1 flex overflow-hidden">
          <AnimatePresence mode="wait">
            {activeView === "map" && (
              <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }} className="flex-1 flex overflow-hidden">
                <LeftPanel />
                <div className="flex-1 relative"><AquaMap /></div>
                <AIAssistant />
              </motion.div>
            )}
            {activeView === "analytics" && (
              <motion.div key="an" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }} className="flex-1 overflow-hidden">
                <Suspense fallback={<Loader />}><AnalyticsView /></Suspense>
              </motion.div>
            )}
            {activeView === "education" && (
              <motion.div key="ed" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }} className="flex-1 overflow-hidden">
                <Suspense fallback={<Loader />}><EducationView /></Suspense>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        <StatusBar />
      </div>
    </div>
  );
}
