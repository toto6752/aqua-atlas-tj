import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { PaperPlaneTilt, Sparkle, WarningCircle, CircleNotch } from "@phosphor-icons/react";
import { useAppStore } from "@/store/useAppStore";

export function AIAssistant() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { chatMessages, setChatMessages } = useAppStore();

  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" }));
  const { messages, sendMessage, status } = useChat({
    transport: transport.current,
    onError: (e) => {
      const msg = e.message || "";
      if (msg.includes("429")) setError(t("ai.rateLimit"));
      else if (msg.includes("402")) setError(t("ai.credits"));
      else setError(t("ai.errorFallback"));
    },
  });

  useEffect(() => {
    const last = chatMessages[chatMessages.length - 1];
    if (last && last.role === "user" && status === "ready") {
      void sendMessage({ text: last.content });
      setChatMessages([]);
    }
  }, [chatMessages, status, sendMessage, setChatMessages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || status === "submitted" || status === "streaming") return;
    setError(null);
    setInput("");
    void sendMessage({ text });
  };

  const isLoading = status === "submitted" || status === "streaming";
  const isEmpty = messages.length === 0;
  const prompts = t("ai.suggestedPrompts", { returnObjects: true }) as string[];

  return (
    <aside className="w-[320px] shrink-0 border-l border-border-subtle flex flex-col bg-white/70 backdrop-blur-xl">
      <div className="p-4 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(79,125,243,0.18), rgba(16,185,129,0.10))",
                     border: "1px solid rgba(79,125,243,0.30)",
                     boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)" }}>
            <Sparkle size={15} weight="duotone" className="text-cyan-400" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-text-primary leading-tight tracking-tight">{t("ai.title")}</div>
            <div className="text-[10.5px] text-text-muted mt-0.5">{t("ai.modelLabel")}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-panel-mid/50 border border-border-subtle/70">
          <span className="w-1.5 h-1.5 rounded-full bg-success-green animate-pulse-dot" />
          <span className="text-[9px] font-mono text-text-secondary tracking-wider">READY</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-thin p-4 space-y-3">
        {isEmpty && (
          <div className="space-y-3">
            <div className="text-[12.5px] text-text-secondary leading-relaxed p-3.5 panel-flat">
              {t("ai.welcome")}
            </div>
            <div className="text-[10px] font-mono tracking-wider text-text-muted px-1">SUGGESTED</div>
            <div className="space-y-1.5">
              {prompts.map((p) => (
                <button key={p} onClick={() => { setInput(""); void sendMessage({ text: p }); }}
                  className="group w-full text-left text-[12px] text-text-secondary hover:text-text-primary px-3 py-2.5 rounded-xl bg-panel-mid/30 hover:bg-panel-mid/60 border border-border-subtle/50 hover:border-cyan-400/30 transition-all">
                  <div className="flex items-start gap-2">
                    <Sparkle size={11} weight="duotone" className="text-cyan-400/70 mt-1 shrink-0 group-hover:text-cyan-400 transition-colors" />
                    <span className="leading-snug">{p}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m) => {
            const text = m.parts.map((part) => (part.type === "text" ? part.text : "")).join("");
            const isUser = m.role === "user";
            return (
              <motion.div key={m.id}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 360, damping: 28 }}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[88%] text-[12.5px] leading-relaxed whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 ${
                  isUser
                    ? "text-text-primary rounded-br-md"
                    : "bg-panel-mid/60 border border-border-subtle/60 text-text-primary rounded-bl-md"
                }`}
                style={isUser ? {
                  background: "linear-gradient(180deg, rgba(79,125,243,0.16), rgba(79,125,243,0.08))",
                  border: "1px solid rgba(79,125,243,0.28)",
                } : undefined}>
                  {text}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {status === "submitted" && (
          <div className="flex justify-start">
            <div className="bg-panel-mid/60 border border-border-subtle/60 rounded-2xl rounded-bl-md px-3.5 py-2.5 flex items-center gap-2">
              <CircleNotch size={12} weight="bold" className="text-cyan-400 animate-spin" />
              <span className="text-[11px] text-text-muted">Thinking…</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-risk-red/8 border border-risk-red/25 text-[12px] text-risk-red">
            <WarningCircle size={14} weight="duotone" className="mt-0.5 shrink-0" /> {error}
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="p-3 border-t border-border-subtle">
        <div className="flex items-end gap-2 rounded-2xl p-1.5 bg-panel-mid/40 border border-border-subtle focus-within:border-cyan-400/40 focus-within:bg-panel-mid/60 transition-colors">
          <textarea
            value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmit(); } }}
            placeholder={t("ai.placeholder")} rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-[12.5px] text-text-primary placeholder:text-text-muted px-2.5 py-1.5 max-h-28"
          />
          <button type="submit" disabled={!input.trim() || isLoading}
            className="shrink-0 w-9 h-9 rounded-xl text-cyan-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all"
            style={{ background: input.trim() && !isLoading
              ? "linear-gradient(135deg, rgba(79,125,243,0.28), rgba(16,185,129,0.20))"
              : "rgba(243,245,249,0.6)",
              border: "1px solid rgba(79,125,243,0.30)" }}>
            <PaperPlaneTilt size={14} weight="fill" />
          </button>
        </div>
      </form>
    </aside>
  );
}
