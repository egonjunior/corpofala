import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Library, X } from "lucide-react";
import { DynamicInfo, DYNAMIC_ROUTES } from "@/data/dynamicsContent";
import { useNavigate } from "react-router-dom";

interface ScienceModalProps {
    dynamic: DynamicInfo | null;
    onClose: () => void;
    isDarkTheme?: boolean;
}

export const ScienceModal = ({ dynamic, onClose, isDarkTheme = false }: ScienceModalProps) => {
    const navigate = useNavigate();

    if (!dynamic) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center px-4 pb-4 sm:p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0"
                    style={{
                        background: isDarkTheme ? "rgba(0,0,0,0.6)" : "rgba(26,21,32,0.4)",
                        backdropFilter: "blur(4px)"
                    }}
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 100, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-sm overflow-hidden"
                    style={{
                        background: isDarkTheme ? "#1A1520" : "#F2EDE4",
                        borderRadius: 24,
                        boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
                        border: `1px solid ${isDarkTheme ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.4)"}`
                    }}
                >
                    {/* Colored Header Area */}
                    <div
                        className="px-6 pt-6 pb-4 relative"
                        style={{
                            background: isDarkTheme
                                ? `linear-gradient(135deg, ${dynamic.color}22, ${dynamic.color}11)`
                                : dynamic.bgColor
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                                style={{ background: isDarkTheme ? "rgba(255,255,255,0.05)" : "white" }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill={dynamic.color}>
                                    <path d={dynamic.icon} />
                                </svg>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                                style={{
                                    background: isDarkTheme ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                                    color: isDarkTheme ? "rgba(255,255,255,0.6)" : "rgba(26,21,32,0.6)"
                                }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: dynamic.color, fontWeight: 600 }}>
                            EMBASAMENTO CIENTÍFICO
                        </p>
                        <h3 style={{
                            fontFamily: "'DM Serif Display', serif",
                            fontSize: 24,
                            color: isDarkTheme ? "#FFF" : "#1A1520",
                            lineHeight: 1.2,
                            marginTop: 4
                        }}>
                            {dynamic.name}
                        </h3>
                    </div>

                    {/* Scrollable Content */}
                    <div className="px-6 py-5 max-h-[55vh] overflow-y-auto">
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <BookOpen size={16} color={dynamic.color} />
                                <h4 style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: isDarkTheme ? "#E0D0C0" : "#1A1520",
                                    letterSpacing: "0.02em"
                                }}>
                                    Mecanismo de Ação
                                </h4>
                            </div>
                            <p style={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: 15,
                                color: isDarkTheme ? "rgba(255,255,255,0.7)" : "#6A5A55",
                                lineHeight: 1.6
                            }}>
                                {dynamic.science?.mechanism}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Library size={16} color={dynamic.color} />
                                <h4 style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: isDarkTheme ? "#E0D0C0" : "#1A1520",
                                    letterSpacing: "0.02em"
                                }}>
                                    Fontes e Evidências
                                </h4>
                            </div>
                            <p style={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: 14,
                                color: isDarkTheme ? "rgba(255,255,255,0.4)" : "#9A8A85",
                                lineHeight: 1.6
                            }}>
                                {dynamic.science?.sources}
                            </p>
                        </div>
                    </div>

                    <div
                        className="p-4"
                        style={{
                            background: isDarkTheme ? "rgba(0,0,0,0.2)" : "rgba(26,21,32,0.02)",
                            borderTop: `1px solid ${isDarkTheme ? "rgba(255,255,255,0.05)" : "rgba(26,21,32,0.06)"}`
                        }}
                    >
                        <button
                            onClick={() => {
                                const targetId = dynamic.id;
                                onClose();
                                setTimeout(() => navigate(DYNAMIC_ROUTES[targetId]), 200);
                            }}
                            className="w-full py-3.5 rounded-xl font-medium transition-transform active:scale-95"
                            style={{
                                background: isDarkTheme ? dynamic.color : "#1A1520",
                                color: isDarkTheme ? "#1A1520" : "#FFF",
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: 15
                            }}
                        >
                            Iniciar esta dinâmica
                        </button>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
};
