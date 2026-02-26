import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FunnelCall from "@/components/funnel/FunnelCall";
import FunnelWhatsAppShort from "@/components/funnel/FunnelWhatsAppShort";

import LPHero from "@/components/lp/LPHero";
import LPRecognition from "@/components/lp/LPRecognition";
import LPOverDelivery from "@/components/lp/LPOverDelivery";
import LPPricing from "@/components/lp/LPPricing";
import LPGuarantee from "@/components/lp/LPGuarantee";
import LPClosing from "@/components/lp/LPClosing";
import LPFloatBar from "@/components/lp/LPFloatBar";
import AuthModal from "@/components/lp2/AuthModal";
import { useRef, useEffect } from "react";

const FunnelLPShort = () => {
    const [showFloatBar, setShowFloatBar] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleScroll = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;
        const progress = el.scrollTop / (el.scrollHeight - el.clientHeight);
        setShowFloatBar(progress > 0.25);
    }, []);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        el.addEventListener("scroll", handleScroll, { passive: true });
        return () => el.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    const openAuth = () => setAuthOpen(true);

    return (
        <div
            ref={containerRef}
            className="w-full h-screen overflow-y-auto relative"
            style={{ backgroundColor: "#080810" }}
        >
            <div
                className="fixed inset-0 pointer-events-none z-40"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat",
                }}
            />
            <LPHero />
            <LPRecognition />
            <LPOverDelivery />
            <LPPricing onOpenAuth={openAuth} />
            <LPGuarantee />
            <LPClosing onOpenAuth={openAuth} />
            <LPFloatBar visible={showFloatBar} onOpenAuth={openAuth} />
            <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialTab="create" />
        </div>
    );
};

const FunilLigacaoCurta = () => {
    const [screen, setScreen] = useState<"unlock" | "call" | "whatsapp" | "lp">("unlock");

    const handleUnlock = useCallback(() => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const buffer = ctx.createBuffer(1, 1, 22050);
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            source.start(0);
            ctx.close();
        } catch { }
        setScreen("call");
    }, []);

    return (
        <div className="w-full h-screen overflow-hidden bg-black">
            <AnimatePresence mode="wait">
                {screen === "unlock" && (
                    <motion.div
                        key="unlock"
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full flex flex-col items-center justify-center"
                        style={{
                            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, #000 70%)"
                        }}
                    >
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            style={{
                                color: "rgba(255,255,255,0.85)",
                                fontSize: 22,
                                fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
                                fontWeight: 300,
                                letterSpacing: "0.3px",
                                textAlign: "center",
                            }}
                        >
                            Alguém quer falar com você.
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2.0, duration: 0.8 }}
                            style={{
                                color: "rgba(255,255,255,0.5)",
                                fontSize: 16,
                                fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
                                fontWeight: 300,
                                letterSpacing: "0.5px",
                                marginTop: 8,
                                textAlign: "center",
                            }}
                        >
                            Há muito tempo.
                        </motion.p>

                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 3.5, duration: 0.6 }}
                            onClick={handleUnlock}
                            onTouchStart={(e) => { e.preventDefault(); handleUnlock(); }}
                            className="mt-12 relative"
                            style={{ outline: "none", border: "none", background: "none" }}
                        >
                            <motion.div
                                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 rounded-full"
                                style={{ background: "rgba(76, 217, 100, 0.4)", filter: "blur(12px)" }}
                            />
                            <div
                                className="relative w-16 h-16 rounded-full flex items-center justify-center"
                                style={{ background: "#4CD964" }}
                            >
                                <svg width="28" height="28" viewBox="0 0 32" fill="none">
                                    <circle cx="16" cy="16" r="3.2" fill="#fff" />
                                    <circle cx="16" cy="16" r="7.5" stroke="#fff" strokeWidth="1.2" opacity="0.7" />
                                    <circle cx="16" cy="16" r="12" stroke="#fff" strokeWidth="1" opacity="0.4" />
                                </svg>
                            </div>
                        </motion.button>

                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            transition={{ delay: 4.0, duration: 0.6 }}
                            style={{
                                color: "rgba(255,255,255,0.4)",
                                fontSize: 13,
                                fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
                                letterSpacing: "0.5px",
                                marginTop: 16,
                            }}
                        >
                            toque para receber a ligação
                        </motion.span>
                    </motion.div>
                )}
                {screen === "call" && (
                    <motion.div key="call" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="w-full h-full">
                        <FunnelCall onNext={() => setScreen("whatsapp")} />
                    </motion.div>
                )}
                {screen === "whatsapp" && (
                    <motion.div key="whatsapp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-full h-full">
                        <FunnelWhatsAppShort onNext={() => setScreen("lp")} />
                    </motion.div>
                )}
                {screen === "lp" && (
                    <motion.div key="lp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="w-full h-full">
                        <FunnelLPShort />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FunilLigacaoCurta;
