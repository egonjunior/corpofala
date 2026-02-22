import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowLeft } from "lucide-react";
import AppLayout from "@/components/app/AppLayout";

/* ── Platform detection ── */
const getPlat = () => {
  const ua = navigator.userAgent || "";
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) return "ios";
  if (/android/i.test(ua)) return "android";
  return "other";
};

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as any).standalone === true;

/* ── Phone Mockup ── */
const PhoneMockup = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.3 }}
    className="relative mx-auto"
    style={{ width: 160 }}
  >
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 160 310" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-2xl">
        {/* Phone body */}
        <rect x="4" y="4" width="152" height="302" rx="28" fill="#1A1520" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
        {/* Screen */}
        <rect x="10" y="14" width="140" height="282" rx="22" fill="#F2EDE4"/>
        {/* Dynamic Island */}
        <rect x="55" y="20" width="50" height="16" rx="8" fill="#1A1520"/>
        {/* App icon centered */}
        <g transform="translate(52, 100)">
          <rect width="56" height="56" rx="14" fill="hsl(16, 65%, 45%)" />
          <path d="M28 42s-1-0.7-2.3-1.8C22.5 37.6 19 35 19 31.2c0-2.4 1.9-4.3 4.3-4.3 1.3 0 2.6.7 3.7 1.8.7-1.1 2-1.8 3.7-1.8 2.4 0 4.3 1.9 4.3 4.3 0 1-.3 2-.9 2.9" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.9"/>
          <path d="M25 36h1.7l1-2 1.3 4 1.3-2h1.7" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9"/>
        </g>
        {/* App name */}
        <text x="80" y="174" textAnchor="middle" fill="#1A1520" fontFamily="'DM Sans', sans-serif" fontSize="10" fontWeight="600">CorpoFala</text>
        {/* Home indicator */}
        <rect x="55" y="284" width="50" height="4" rx="2" fill="rgba(26,21,32,0.15)"/>
      </svg>
    </motion.div>
    {/* Glow */}
    <div className="absolute -inset-8 -z-10 rounded-full" style={{
      background: "radial-gradient(circle, hsla(16, 65%, 45%, 0.12) 0%, transparent 70%)",
    }}/>
  </motion.div>
);

/* ── iOS Share Icon ── */
const IosShareIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(16, 65%, 45%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
    <polyline points="16,6 12,2 8,6"/>
    <line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
);

/* ── Android Menu Icon ── */
const AndroidMenuIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(16, 65%, 45%)" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="5" r="1.5" fill="hsl(16, 65%, 45%)" stroke="none"/>
    <circle cx="12" cy="12" r="1.5" fill="hsl(16, 65%, 45%)" stroke="none"/>
    <circle cx="12" cy="19" r="1.5" fill="hsl(16, 65%, 45%)" stroke="none"/>
  </svg>
);

/* ── Plus Square Icon ── */
const PlusSquareIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(16, 65%, 45%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="4"/>
    <line x1="12" y1="8" x2="12" y2="16"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);

/* ── Check Circle Icon ── */
const CheckCircleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(16, 65%, 45%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
);

/* ── Timeline Step ── */
const TimelineStep = ({ num, icon, title, desc, isLast, delay }: {
  num: number; icon: React.ReactNode; title: string; desc: string; isLast: boolean; delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    className="flex gap-4"
  >
    {/* Timeline line + dot */}
    <div className="flex flex-col items-center">
      <div
        className="shrink-0 flex items-center justify-center rounded-full"
        style={{
          width: 48,
          height: 48,
          background: "rgba(255,255,255,0.80)",
          backdropFilter: "blur(12px)",
          border: "2px solid hsla(16, 65%, 45%, 0.20)",
          boxShadow: "0 2px 12px hsla(16, 65%, 45%, 0.08)",
        }}
      >
        {icon}
      </div>
      {!isLast && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 0.4, delay: delay + 0.3 }}
          style={{
            width: 2,
            background: "linear-gradient(180deg, hsla(16, 65%, 45%, 0.20), hsla(16, 65%, 45%, 0.05))",
            flex: 1,
            minHeight: 24,
          }}
        />
      )}
    </div>

    {/* Content */}
    <div className="flex-1 pb-8">
      <p style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 10,
        letterSpacing: "0.12em",
        color: "hsl(16, 65%, 45%)",
        marginBottom: 4,
      }}>
        PASSO {num}
      </p>
      <p style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: 18,
        color: "hsl(30, 10%, 12%)",
        lineHeight: 1.3,
      }}>
        {title}
      </p>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        fontWeight: 300,
        color: "hsl(30, 8%, 50%)",
        lineHeight: 1.7,
        marginTop: 6,
      }}>
        {desc}
      </p>
    </div>
  </motion.div>
);

/* ── Main ── */
const AppInstall = () => {
  const navigate = useNavigate();
  const plat = getPlat();
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(isStandalone());
  const [tab, setTab] = useState<"ios" | "android">(plat === "android" ? "android" : "ios");

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const triggerInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setInstallPrompt(null);
  };

  const iosSteps = [
    {
      icon: <IosShareIcon />,
      title: "Toque no botão de compartilhar",
      desc: "Lá embaixo na tela, procure o quadradinho com uma setinha pra cima. Toque nele.",
    },
    {
      icon: <PlusSquareIcon />,
      title: "\"Adicionar à Tela de Início\"",
      desc: "Role as opções pra baixo até achar essa frase. Toque nela.",
    },
    {
      icon: <CheckCircleIcon />,
      title: "Pronto! É só confirmar",
      desc: "Toque em \"Adicionar\" no cantinho de cima. O CorpoFala aparece na sua tela como um app de verdade.",
    },
  ];

  const androidSteps = [
    {
      icon: <AndroidMenuIcon />,
      title: "Toque nos três pontinhos",
      desc: "Lá em cima, no cantinho direito da tela, tem três pontinhos (⋮). Toque neles.",
    },
    {
      icon: <PlusSquareIcon />,
      title: "\"Instalar aplicativo\"",
      desc: "Procure a opção \"Instalar aplicativo\" ou \"Adicionar à tela inicial\" e toque nela.",
    },
    {
      icon: <CheckCircleIcon />,
      title: "Pronto! É só confirmar",
      desc: "Toque em \"Instalar\". O CorpoFala vira um app na sua tela — abre rapidinho, sem navegador.",
    },
  ];

  const steps = tab === "ios" ? iosSteps : androidSteps;

  /* ── Installed state ── */
  if (installed) {
    return (
      <AppLayout>
        <div className="max-w-[520px] mx-auto px-6 pt-20 pb-12 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <div
              className="mx-auto flex items-center justify-center"
              style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                background: "linear-gradient(135deg, hsl(16, 65%, 45%), hsl(16, 55%, 55%))",
                boxShadow: "0 8px 32px hsla(16, 65%, 45%, 0.30)",
              }}
            >
              <Check size={40} color="#fff" strokeWidth={2.5} />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
            style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "hsl(30, 10%, 12%)" }}
          >
            Tudo pronto!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mt-3 mx-auto"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 300,
              color: "hsl(30, 8%, 50%)",
              lineHeight: 1.7,
              maxWidth: 320,
            }}
          >
            O CorpoFala já está na sua tela inicial. É só tocar pra abrir — sem navegador, sem complicação.
          </motion.p>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            onClick={() => navigate("/app/dashboard")}
            className="mt-10 btn-premium"
            style={{
              background: "hsl(16, 65%, 45%)",
              borderRadius: 12,
              padding: "14px 40px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              fontWeight: 600,
              color: "#fff",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 20px hsla(16, 65%, 45%, 0.25)",
            }}
          >
            Abrir o app →
          </motion.button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-[520px] mx-auto px-6 pt-6 pb-16">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: "hsl(30, 8%, 50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={16} /> Voltar
        </motion.button>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.15em",
            color: "hsl(16, 65%, 45%)",
            marginBottom: 12,
          }}>
            SEMPRE COM VOCÊ
          </p>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(28px, 6vw, 36px)",
            color: "hsl(30, 10%, 12%)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}>
            Tenha o CorpoFala<br />na sua tela
          </h1>
          <p className="mt-3 mx-auto" style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            fontWeight: 300,
            color: "hsl(30, 8%, 50%)",
            lineHeight: 1.7,
            maxWidth: 340,
          }}>
            Um toque e pronto. Sem abrir navegador, sem procurar link. Sempre ali, quando precisar.
          </p>
        </motion.div>

        {/* Phone Mockup */}
        <PhoneMockup />

        {/* Native install CTA */}
        <AnimatePresence>
          {installPrompt && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, height: 0 }}
              animate={{ opacity: 1, scale: 1, height: "auto" }}
              exit={{ opacity: 0, scale: 0.95, height: 0 }}
              className="mt-8"
            >
              <motion.button
                onClick={triggerInstall}
                className="w-full btn-premium"
                animate={{ boxShadow: [
                  "0 4px 20px hsla(16, 65%, 45%, 0.25)",
                  "0 4px 32px hsla(16, 65%, 45%, 0.40)",
                  "0 4px 20px hsla(16, 65%, 45%, 0.25)",
                ]}}
                transition={{ repeat: Infinity, duration: 2.5 }}
                style={{
                  background: "linear-gradient(135deg, hsl(16, 65%, 45%), hsl(16, 55%, 55%))",
                  borderRadius: 14,
                  padding: "16px 24px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 17,
                  fontWeight: 600,
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Instalar agora
              </motion.button>
              <p className="text-center mt-2" style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                fontWeight: 300,
                color: "hsl(30, 8%, 50%)",
              }}>
                Instalação direta — um toque
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="flex items-center gap-3 mt-10 mb-8">
          <div className="flex-1 h-px" style={{ background: "hsla(16, 65%, 45%, 0.10)" }} />
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            fontWeight: 500,
            color: "hsl(30, 8%, 50%)",
          }}>
            ou siga o passo a passo
          </p>
          <div className="flex-1 h-px" style={{ background: "hsla(16, 65%, 45%, 0.10)" }} />
        </div>

        {/* Platform toggle */}
        <div className="flex gap-1 p-1 mb-8 mx-auto" style={{
          maxWidth: 280,
          borderRadius: 12,
          background: "rgba(255,255,255,0.60)",
          backdropFilter: "blur(12px)",
          border: "1px solid hsla(16, 65%, 45%, 0.08)",
        }}>
          {(["ios", "android"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setTab(p)}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 10,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: tab === p ? 600 : 400,
                color: tab === p ? "#fff" : "hsl(30, 8%, 50%)",
                background: tab === p ? "hsl(16, 65%, 45%)" : "transparent",
                border: "none",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            >
              {p === "ios" ? "iPhone / iPad" : "Android"}
            </button>
          ))}
        </div>

        {/* Timeline steps */}
        <div className="pl-1">
          {steps.map((s, i) => (
            <TimelineStep
              key={`${tab}-${i}`}
              num={i + 1}
              icon={s.icon}
              title={s.title}
              desc={s.desc}
              isLast={i === steps.length - 1}
              delay={0.6 + i * 0.2}
            />
          ))}
        </div>

        {/* Contextual tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-4"
          style={{
            background: "rgba(255,255,255,0.60)",
            backdropFilter: "blur(12px)",
            borderRadius: 14,
            padding: "16px 20px",
            border: "1px solid hsla(16, 65%, 45%, 0.08)",
          }}
        >
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 300,
            color: "hsl(30, 8%, 50%)",
            lineHeight: 1.7,
          }}>
            {tab === "ios"
              ? "💡 Precisa ser no Safari. Se você abriu este link no Instagram ou WhatsApp, copie o endereço e cole no Safari primeiro."
              : "💡 Funciona melhor no Chrome. Em alguns celulares aparece como \"Instalar aplicativo\" em vez de \"Adicionar à tela inicial\"."}
          </p>
        </motion.div>

        {/* Final CTA */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          onClick={() => navigate("/app/dashboard")}
          className="w-full mt-8 btn-premium"
          style={{
            background: "hsl(16, 65%, 45%)",
            borderRadius: 12,
            padding: "14px 24px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            fontWeight: 600,
            color: "#fff",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 16px hsla(16, 65%, 45%, 0.20)",
          }}
        >
          Já instalei — ir para o app →
        </motion.button>
      </div>
    </AppLayout>
  );
};

export default AppInstall;
