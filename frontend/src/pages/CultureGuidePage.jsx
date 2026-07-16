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

  useEffect(() => {
    return () => clearInterval(timer.current);
  }, []);

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

      <div className="flex flex-wrap gap-3 mt-5">
        <select
          className="input-base max-w-56"
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

        <Link
          className="btn-ghost border border-surface-700/60"
          to="/compare"
        >
          Compare {country} cities →
        </Link>
      </div>

      <Card className="mt-5 p-5 min-h-80">
        <div className="space-y-4">
          {messages.length ? (
            messages.map((entry, i) => (
              <div
                key={i}
                className={`max-w-[85%] p-3 rounded-lg ${
                  entry.role === "user"
                    ? "ml-auto bg-brand-800/60"
                    : "bg-surface-800 text-surface-300"
                }`}
              >
                {entry.content}
              </div>
            ))
          ) : (
            <p className="text-surface-500">
              Ask about your move to {country}. This guide focuses on
              day-to-day relocation realities.
            </p>
          )}
        </div>
      </Card>

      <div className="flex flex-wrap gap-2 mt-4">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            className="btn-ghost text-xs border border-surface-700/60"
            onClick={() => send(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={`Ask about life in ${country}`}
        />

        <Button
          onClick={() => send()}
          disabled={busy}
        >
          {busy ? "Thinking…" : "Send"}
        </Button>
      </div>
    </main>
  );
}