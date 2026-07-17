import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Button, Card, Input, useToast } from "../components/ui.jsx";
import { cultureChat } from "../api/tools.js";

const countries = [
  "Canada",
  "Germany",
  "Australia",
  "United Kingdom",
  "United States",
  "Netherlands",
  "Sweden",
  "New Zealand",
  "Singapore",
  "Japan",
];

const prompts = [
  "What is the work culture like?",
  "How does housing work?",
  "Tell me about the healthcare system",
  "What should I know about daily life?",
  "How is public transport?",
];

export default function CultureGuidePage() {
  const [country, setCountry] = useState("Canada");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);

  const toast = useToast();
  const timer = useRef();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(timer.current);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text = message) => {
    if (!text.trim() || busy) return;

    const next = [
      ...messages,
      {
        role: "user",
        content: text,
      },
    ];

    setMessages(next);
    setMessage("");
    setBusy(true);

    try {
      const { data } = await cultureChat({
        country,
        message: text,
        history: messages,
      });

      const final = data.data.response;

      setMessages([
        ...next,
        {
          role: "assistant",
          content: "",
        },
      ]);

      let at = 0;

      timer.current = setInterval(() => {
        at += 2;

        setMessages((list) => [
          ...list.slice(0, -1),
          {
            role: "assistant",
            content: final.slice(0, at),
          },
        ]);

        if (at >= final.length) {
          clearInterval(timer.current);
          setBusy(false);
        }
      }, 14);
    } catch (e) {
      setBusy(false);
      toast.error(e.message);
    }
  };

  return (
    <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-extrabold">
        Culture <span className="gradient-text">Guide</span>
      </h1>

      <div className="flex flex-wrap items-center gap-3 mt-5">
        <div className="select-wrapper max-w-56">
          <select
            value={country}
            onChange={(e) => {
              clearInterval(timer.current);
              setBusy(false);
              setCountry(e.target.value);
              setMessages([]);
            }}
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <Link
          className="btn-ghost border border-surface-700/60 rounded-xl px-4 text-xs font-semibold"
          to="/compare"
        >
          Compare {country} cities →
        </Link>
      </div>

      <div className="glow-card rounded-2xl mt-6 p-5 sm:p-6 min-h-[360px] flex flex-col justify-between">
        <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
          {messages.length ? (
            <>
              {messages.map((entry, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                    entry.role === "user"
                      ? "ml-auto chat-bubble-user rounded-tr-xs"
                      : "chat-bubble-assistant rounded-tl-xs"
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">
                    {entry.role === "user" ? "You" : `${country} Relocation Guide`}
                  </div>
                  {entry.content || (busy && i === messages.length - 1 ? <span className="animate-pulse">Thinking…</span> : "")}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="text-center py-16 text-surface-500 max-w-sm mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-3">
                💬
              </div>
              <p className="font-semibold text-surface-300 mb-1">Explore relocating to {country}</p>
              <p className="text-xs">Select a suggested topic below or type any question about daily life, housing, transport, or work culture.</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-surface-700/40">
          <div className="flex flex-wrap gap-2 mb-4">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                disabled={busy}
                className="btn-ghost text-xs border border-surface-700/50 bg-surface-900/30 hover:border-brand-500/50 py-1.5 px-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => send(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={`Ask about life in ${country}…`}
              disabled={busy}
              className="flex-1"
            />

            <Button
              onClick={() => send()}
              disabled={busy || !message.trim()}
              className="px-6 shadow-md"
            >
              {busy ? "Thinking…" : "Send"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}