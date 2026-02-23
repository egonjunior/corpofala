import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// IMPORTANT: This is a placeholder VAPID key. Must be replaced with the actual generated key.
const PUBLIC_VAPID_KEY = "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U";

function urlB64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const PushNotificationManager = () => {
    const [showBanner, setShowBanner] = useState(false);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        // Check if browser supports service workers and push messages
        if ("serviceWorker" in navigator && "PushManager" in window) {
            setIsSupported(true);

            // Delay check slightly so it doesn't pop up immediately on load
            const t = setTimeout(() => {
                if (Notification.permission === "default") {
                    // Verify user is logged in
                    supabase.auth.getUser().then(({ data: { user } }) => {
                        if (user && !localStorage.getItem("dismissed_push_banner")) {
                            setShowBanner(true);
                        }
                    });
                }
            }, 3000);

            return () => clearTimeout(t);
        }
    }, []);

    const subscribeToPush = async () => {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setShowBanner(false);

                const registration = await navigator.serviceWorker.ready;
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlB64ToUint8Array(PUBLIC_VAPID_KEY),
                });

                // Save to Supabase
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const subData = JSON.parse(JSON.stringify(subscription));

                    // @ts-ignore: Tabela a ser criada no banco e atualizar os tipos posteriormente.
                    await supabase.from("push_subscriptions").upsert({
                        user_id: user.id,
                        endpoint: subData.endpoint,
                        auth_key: subData.keys.auth,
                        p256dh_key: subData.keys.p256dh,
                        updated_at: new Date().toISOString(),
                    }, { onConflict: "user_id, endpoint" });
                }
            } else {
                setShowBanner(false);
                localStorage.setItem("dismissed_push_banner", "true");
            }
        } catch (error) {
            console.error("Error subscribing to push notifications:", error);
            setShowBanner(false);
        }
    };

    const handleDismiss = () => {
        setShowBanner(false);
        localStorage.setItem("dismissed_push_banner", "true");
    };

    if (!isSupported) return null;

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed top-4 left-4 right-4 z-[200] md:left-1/2 md:w-[400px] md:-ml-[200px]"
                >
                    <div
                        className="flex items-start gap-3 p-4 rounded-2xl shadow-lg"
                        style={{
                            background: "#F2EDE4",
                            border: "1px solid rgba(0,0,0,0.05)",
                            boxShadow: "0 12px 32px rgba(26,21,32,0.12)"
                        }}
                    >
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: "rgba(124,77,255,0.1)" }}
                        >
                            <Bell size={18} color="#7C4DFF" />
                        </div>

                        <div className="flex-1 min-w-0 pr-2">
                            <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#1A1520" }}>
                                3 Mensagens Diárias
                            </h4>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#6A5A55", lineHeight: 1.4, marginTop: 2, marginBottom: 12 }}>
                                Receba um lembrete educativo, uma frase inspiradora e um convite para o Hub de Crise.
                            </p>

                            <div className="flex gap-2">
                                <button
                                    onClick={subscribeToPush}
                                    className="px-4 py-2 rounded-lg font-medium transition-colors"
                                    style={{ background: "#1A1520", color: "#FFF", fontSize: 13 }}
                                >
                                    Permitir avisos
                                </button>
                                <button
                                    onClick={handleDismiss}
                                    className="px-4 py-2 rounded-lg font-medium transition-colors hover:bg-black/5"
                                    style={{ color: "#6A5A55", fontSize: 13 }}
                                >
                                    Agora não
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleDismiss}
                            className="w-6 h-6 flex items-center justify-center rounded-full text-black/40 hover:bg-black/5 flex-shrink-0"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
