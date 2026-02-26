import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { PhoneStatusBar } from "../narrative/PhoneStatusBar";

type Msg = {
    id: number;
    type: "message" | "typing";
    text?: string;
    isLink?: boolean;
};

/* ── Pulso icon for WhatsApp avatar ── */
const PulsoAvatar = () => (
    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #005F73, #00BCD4)" }}>
        <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="3.2" fill="white" />
            <circle cx="16" cy="16" r="7.5" stroke="white" strokeWidth="1.2" opacity="0.4" />
            <circle cx="16" cy="16" r="12" stroke="white" strokeWidth="1" opacity="0.15" />
        </svg>
    </div>
);

/* ── Message sequence: each entry is [typingDuration, readingDelay, text] ── */
const messageSequence: [number, number, string][] = [
    [1500, 2000, "A ligação caiu, desculpa. Vou resumir por aqui."],
    [2000, 3500, "Nós reunimos mais de 200 estudos e 10 anos de pesquisa sobre como o seu corpo guarda o que você não processa."],
    [2000, 3500, "Criamos um mapa e um protocolo com dinâmicas somáticas pra você resolver isso. Não precisa de anos de terapia pra entender onde tá travado."],
    [1500, 2000, "Clica no link abaixo para acessar e ver como funciona:"],
    [1000, 1500, "LINK_PAGINA_VENDAS"],
];

interface FunnelWhatsAppShortProps {
    onNext?: () => void;
}

const FunnelWhatsAppShort = ({ onNext }: FunnelWhatsAppShortProps) => {
    const [messages, setMessages] = useState<Msg[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const cancelRef = useRef(false);

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

    // Play message sequence
    useEffect(() => {
        cancelRef.current = false;

        const sleep = (ms: number) => new Promise<void>((resolve) => {
            const id = setTimeout(resolve, ms);
            return () => clearTimeout(id);
        });

        const run = async () => {
            await sleep(600); // initial pause

            for (const [typingMs, readingMs, text] of messageSequence) {
                if (cancelRef.current) return;

                // Show typing
                addMsg({ type: "typing" });
                await sleep(typingMs);
                if (cancelRef.current) return;

                // Replace typing with message
                removeTyping();
                if (text === "LINK_PAGINA_VENDAS") {
                    addMsg({ type: "message", text, isLink: true });
                } else {
                    addMsg({ type: "message", text });
                }

                // Reading delay
                if (readingMs > 0) {
                    await sleep(readingMs);
                }
            }
        };

        run();
        return () => { cancelRef.current = true; };
    }, [addMsg, removeTyping]);

    const handleLinkClick = () => {
        if (onNext) {
            onNext();
        }
    };

    return (
        <div className="w-full h-screen flex flex-col" style={{ backgroundColor: "#ECE5DD" }}>
            <PhoneStatusBar />

            {/* WhatsApp Header */}
            <div className="flex items-center justify-between px-2 py-2" style={{ backgroundColor: "#075E54" }}>
                <div className="flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <PulsoAvatar />
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
                        <path d="M15.05 5A5 5 0 0119 8.95M15.05 1A9 9 0 0123 8.94M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.09 5.18 2 2 0 015.11 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 11.91a16 16 0 006 6l2.27-2.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M23 7l-7 5 7 5V7z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="1" y="5" width="15" height="14" rx="2" stroke="white" strokeWidth="1.5" />
                    </svg>
                </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
                {messages.map((msg) => (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                        {msg.type === "typing" && (
                            <div className="flex justify-start">
                                <div className="px-3 py-2 rounded-lg rounded-tl-sm" style={{ backgroundColor: "#FFFFFF" }}>
                                    <span className="text-xs text-gray-500">CORPO está digitando...</span>
                                </div>
                            </div>
                        )}

                        {msg.type === "message" && msg.text === "LINK_PAGINA_VENDAS" && (
                            <div className="flex justify-start">
                                <motion.button
                                    onClick={handleLinkClick}
                                    className="max-w-xs px-3 py-2 rounded-lg rounded-tl-sm text-sm text-left shadow-sm"
                                    style={{ backgroundColor: "#DCF8C6" }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="font-semibold underline" style={{ color: "#0066CC" }}>corpofala.com/acesso</span>
                                    <p className="text-xs opacity-60 mt-1">agora</p>
                                </motion.button>
                            </div>
                        )}

                        {msg.type === "message" && msg.text !== "LINK_PAGINA_VENDAS" && (
                            <div className="flex justify-start">
                                <div className="max-w-xs px-3 py-2 rounded-lg rounded-tl-sm text-sm whitespace-pre-wrap text-gray-800 shadow-sm" style={{ backgroundColor: "#FFFFFF" }}>
                                    {msg.text}
                                    <p className="text-xs opacity-60 mt-1">agora</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default FunnelWhatsAppShort;
