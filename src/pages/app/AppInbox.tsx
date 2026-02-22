import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AppHeader from "@/components/app/AppHeader";
import AppTabBar from "@/components/app/AppTabBar";
import PulseLoader from "@/components/app/PulseLoader";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  title: string;
  body: string;
  created_at: string;
}

const AppInbox = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const [{ data: msgs }, { data: reads }] = await Promise.all([
          supabase
            .from("messages")
            .select("id, title, body, created_at")
            .order("created_at", { ascending: false }),
          supabase
            .from("message_reads")
            .select("message_id")
            .eq("user_id", user.id),
        ]);
        setMessages(msgs || []);
        setReadIds(new Set((reads || []).map((r) => r.message_id)));
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const openMessage = async (msg: Message) => {
    setSelected(msg);
    if (!readIds.has(msg.id) && user) {
      await supabase.from("message_reads").insert({ message_id: msg.id, user_id: user.id });
      setReadIds((prev) => new Set(prev).add(msg.id));
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#F2EDE4" }}>
      <AppHeader />
      <div className="pt-[72px] pb-24 px-5 max-w-lg mx-auto">
        {selected ? (
          <>
            <button
              onClick={() => setSelected(null)}
              className="flex items-center gap-1.5 mb-4 text-sm"
              style={{ color: "#8A7A70", fontFamily: "'DM Sans', sans-serif" }}
            >
              <ArrowLeft size={16} /> Voltar
            </button>
            <h1
              className="text-xl mb-2"
              style={{ fontFamily: "'DM Serif Display', serif", color: "#1A1520" }}
            >
              {selected.title}
            </h1>
            <span className="text-xs block mb-4" style={{ color: "#8A7A70", fontFamily: "'Space Mono', monospace" }}>
              {new Date(selected.created_at).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
            <p
              className="text-sm leading-relaxed whitespace-pre-wrap"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#1A1520" }}
            >
              {selected.body}
            </p>
          </>
        ) : (
          <>
            <h1
              className="text-xl mb-5"
              style={{ fontFamily: "'DM Serif Display', serif", color: "#1A1520" }}
            >
              Caixa de Entrada
            </h1>
            {loading ? (
              <PulseLoader text="Carregando mensagens..." />
            ) : messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16 flex flex-col items-center"
              >
                <motion.svg
                  width="48" height="48" viewBox="0 0 32 32" fill="none"
                  animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <circle cx="16" cy="16" r="3.2" fill="#B0A090" />
                  <circle cx="16" cy="16" r="7.5" stroke="#B0A090" strokeWidth="1.2" opacity="0.25" />
                  <circle cx="16" cy="16" r="12" stroke="#B0A090" strokeWidth="1" opacity="0.1" />
                </motion.svg>
                <p className="mt-4" style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "#1A1520" }}>
                  Silêncio por aqui.
                </p>
                <p className="mt-2" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#8A7A70", lineHeight: 1.6, maxWidth: 260 }}>
                  Quando o intermediário tiver algo pra você, aparece aqui.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-2">
                {messages.map((msg) => {
                  const isRead = readIds.has(msg.id);
                  return (
                    <button
                      key={msg.id}
                      onClick={() => openMessage(msg)}
                      className="w-full text-left flex items-center gap-3 p-4 rounded-xl transition-all"
                      style={{
                        background: isRead ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.85)",
                        border: isRead ? "1px solid rgba(26,21,32,0.05)" : "1px solid rgba(196,98,45,0.15)",
                        boxShadow: isRead ? "none" : "0 2px 8px rgba(196,98,45,0.06)",
                      }}
                    >
                      {!isRead && (
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: "#C4622D" }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <span
                          className="block text-sm truncate"
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: isRead ? 400 : 600,
                            color: "#1A1520",
                          }}
                        >
                          {msg.title}
                        </span>
                        <span
                          className="block text-xs truncate mt-0.5"
                          style={{ color: "#8A7A70", fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {msg.body}
                        </span>
                      </div>
                      <ChevronRight size={16} style={{ color: "#B0A090" }} className="flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
      <AppTabBar />
    </div>
  );
};

export default AppInbox;
