import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useNarrativeAudio } from "@/contexts/NarrativeAudioContext";
import { PhoneStatusBar } from "./PhoneStatusBar";
import WhatsAppAudioPlayer from "./WhatsAppAudioPlayer";

interface Screen4Props {
  onNext: () => void;
}

type Msg = {
  id: number;
  type: "message" | "typing" | "audio" | "link";
  text?: string;
};

const Screen4_WhatsApp = ({ onNext }: Screen4Props) => {
  const audio = useNarrativeAudio();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [phase, setPhase] = useState<"pre" | "waiting" | "post">("pre");
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addMsg = useCallback((msg: Omit<Msg, "id">) => {
    setMessages((prev) => [...prev, { ...msg, id: Date.now() + Math.random() }]);
  }, []);

  const removeTyping = useCallback(() => {
    setMessages((prev) => prev.filter((m) => m.type !== "typing"));
  }, []);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Phase 1: pre-audio messages
  useEffect(() => {
    audio.stopAll();

    const timeline = [
      { delay: 800, action: () => addMsg({ type: "typing" }) },
      {
        delay: 2500,
        action: () => { removeTyping(); addMsg({ type: "message", text: "Chegou.\nSabia que ia vir." }); },
      },
      { delay: 4000, action: () => addMsg({ type: "typing" }) },
      {
        delay: 6500,
        action: () => {
          removeTyping();
          addMsg({ type: "message", text: "Existe um padrão que se repete na sua vida.\nVocê já percebeu.\nMas ainda não sabe o que é.\n\nEu sei." });
        },
      },
      { delay: 8500, action: () => addMsg({ type: "typing" }) },
      {
        delay: 10000,
        action: () => { removeTyping(); addMsg({ type: "message", text: "Escuta esse áudio." }); },
      },
      {
        delay: 11500,
        action: () => { addMsg({ type: "audio" }); setPhase("waiting"); },
      },
    ];

    const ids = timeline.map((t) => setTimeout(t.action, t.delay));
    timeoutsRef.current = ids;
    return () => ids.forEach(clearTimeout);
  }, [audio, addMsg, removeTyping]);

  // Phase 3: post-audio messages (triggered when audio ends)
  const startPostAudio = useCallback(() => {
    setPhase("post");

    const postTimeline = [
      { delay: 2000, action: () => addMsg({ type: "typing" }) },
      {
        delay: 4000,
        action: () => {
          removeTyping();
          addMsg({ type: "message", text: "Juntei tudo.\nOs padrões. Os estudos. Os protocolos.\nTudo verificável.\n\nTá num lugar só." });
        },
      },
      { delay: 6000, action: () => addMsg({ type: "typing" }) },
      {
        delay: 8000,
        action: () => {
          removeTyping();
          addMsg({ type: "message", text: "A conexão tá instável. Não consigo ficar muito tempo." });
        },
      },
      { delay: 10000, action: () => addMsg({ type: "typing" }) },
      {
        delay: 12000,
        action: () => {
          removeTyping();
          addMsg({ type: "message", text: "Mas o intermediário... ele criou um lugar.\nUm lugar onde eu e ele reunimos tudo." });
        },
      },
      {
        delay: 14000,
        action: () => addMsg({ type: "message", text: "Colocamos onde vocês mais acessam.\nNas redes." }),
      },
      {
        delay: 16000,
        action: () => addMsg({ type: "message", text: "Lá tem informações que validam tudo o que estou dizendo." }),
      },
      {
        delay: 17500,
        action: () => addMsg({ type: "message", text: "Abre. Veja com seus próprios olhos." }),
      },
      { delay: 19000, action: () => addMsg({ type: "link" }) },
    ];

    const ids = postTimeline.map((t) => setTimeout(t.action, t.delay));
    timeoutsRef.current.push(...ids);
  }, [addMsg, removeTyping]);

  // Cleanup
  useEffect(() => {
    return () => timeoutsRef.current.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col" style={{ backgroundColor: "#ECE5DD" }}>
      <PhoneStatusBar />

      {/* WhatsApp Header */}
      <div className="flex items-center justify-between px-2 py-2" style={{ backgroundColor: "#075E54" }}>
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #005F73, #00BCD4)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 21s-7-5-7-11a7 7 0 0114 0c0 6-7 11-7 11z" fill="rgba(255,255,255,0.3)" stroke="white" strokeWidth="1.5"/>
              <path d="M6 12h3l1.5-3 2 6 2-4 1.5 1h2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-tight">CORPO</p>
            <p className="text-xs leading-tight" style={{ color: "rgba(255,255,255,0.7)" }}>
              online{" "}
              <span className="inline-block w-1.5 h-1.5 rounded-full ml-0.5" style={{ backgroundColor: "#25D366", verticalAlign: "middle" }} />
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 pr-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15.05 5A5 5 0 0119 8.95M15.05 1A9 9 0 0123 8.94M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.09 5.18 2 2 0 015.11 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 11.91a16 16 0 006 6l2.27-2.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M23 7l-7 5 7 5V7z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="1" y="5" width="15" height="14" rx="2" stroke="white" strokeWidth="1.5"/>
          </svg>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {msg.type === "message" && (
              <div className="flex justify-start">
                <div className="max-w-xs px-3 py-2 rounded-lg rounded-tl-sm text-sm whitespace-pre-wrap text-gray-800" style={{ backgroundColor: "#FFFFFF" }}>
                  {msg.text}
                  <p className="text-xs opacity-60 mt-1">agora</p>
                </div>
              </div>
            )}

            {msg.type === "typing" && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-lg rounded-tl-sm" style={{ backgroundColor: "#FFFFFF" }}>
                  <span className="text-xs text-gray-500">CORPO está digitando...</span>
                </div>
              </div>
            )}

            {msg.type === "audio" && (
              <WhatsAppAudioPlayer onEnded={startPostAudio} />
            )}

            {msg.type === "link" && (
              <div className="flex justify-start">
                <motion.button
                  onClick={onNext}
                  className="max-w-xs px-3 py-2 rounded-lg rounded-tl-sm text-sm font-semibold text-green-700"
                  style={{ backgroundColor: "#FFFFFF" }}
                  whileHover={{ scale: 1.05 }}
                >
                  ▶ instagram.com/reel/corpofala.oficial
                  <p className="text-xs opacity-60 mt-1">agora</p>
                </motion.button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Screen4_WhatsApp;
