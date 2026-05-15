import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send, Sparkles, AlertCircle } from "lucide-react";
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

  // sync external trigger messages from store (e.g., region/edu cards)
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
    <aside className="w-[300px] shrink-0 border-l border-border-subtle flex flex-col bg-navy-900/60">
      <div className="p-3 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center">
            <Sparkles size={13} className="text-cyan-400" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-text-primary leading-tight">{t("ai.title")}</div>
            <div className="text-[10px] font-mono text-text-muted">{t("ai.modelLabel")}</div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-thin p-3 space-y-3">
        {isEmpty && (
          <div className="space-y-3">
            <div className="text-xs text-text-secondary leading-relaxed p-3 panel">{t("ai.welcome")}</div>
            <div className="space-y-1.5">
              {prompts.map((p) => (
                <button key={p} onClick={() => { setInput(""); void sendMessage({ text: p }); }}
                  className="w-full text-left text-[11px] text-text-secondary hover:text-cyan-400 px-2.5 py-1.5 rounded-md border border-border-subtle hover:border-cyan-400/40 transition-colors">
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m) => {
            const text = m.parts
              .map((part) => (part.type === "text" ? part.text : ""))
              .join("");
            const isUser = m.role === "user";
            return (
              <motion.div key={m.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] text-xs leading-relaxed whitespace-pre-wrap rounded-lg px-3 py-2 ${
                  isUser ? "bg-cyan-400/15 border border-cyan-400/30 text-text-primary"
                         : "bg-panel-mid border border-border-subtle text-text-primary"
                }`}>
                  {text}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {status === "submitted" && (
          <div className="flex justify-start">
            <div className="bg-panel-mid border border-border-subtle rounded-lg px-3 py-2 flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }} />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-risk-red/10 border border-risk-red/30 text-xs text-risk-red">
            <AlertCircle size={13} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="p-3 border-t border-border-subtle">
        <div className="flex items-end gap-2 panel !p-1.5 focus-within:border-cyan-400/40">
          <textarea
            value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmit(); } }}
            placeholder={t("ai.placeholder")} rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-xs text-text-primary placeholder:text-text-muted px-2 py-1.5 max-h-24"
          />
          <button type="submit" disabled={!input.trim() || isLoading}
            className="shrink-0 w-8 h-8 rounded-md bg-cyan-400/15 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/25 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors">
            <Send size={13} />
          </button>
        </div>
      </form>
    </aside>
  );
}
