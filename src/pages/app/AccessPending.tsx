import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { CorpoFalaIcon } from "@/components/lp2/CorpoFalaLogo";

const CAKTO_URL = "https://pay.cakto.com.br/z8n5fua_774989";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.15 },
  }),
};

const AccessPending = () => {
  const { refreshAccess, signOut, accessStatus } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (accessStatus === "active") {
      navigate("/app/dashboard", { replace: true });
    }
  }, [accessStatus, navigate]);

  const handleCheck = async () => {
    setChecking(true);
    setNotFound(false);
    await refreshAccess();
    if (isMounted.current) {
      setChecking(false);
      setNotFound(true);
    }
  };

  return (
    <div className="min-h-screen bg-corpo-dark flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 40% at 50% 30%, rgba(196,98,45,0.06), transparent)" }} />

      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      <div className="max-w-[460px] w-full text-center flex flex-col items-center relative z-10">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <CorpoFalaIcon size={40} className="mb-6" />
        </motion.div>

        <motion.h1
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="font-serif text-[32px] text-white/95 leading-tight mb-3"
        >
          Falta só um passo.
        </motion.h1>

        <motion.p
          variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="font-sans text-lg text-white/55 font-light leading-relaxed mb-8"
        >
          Sua conta foi criada com sucesso. Finalize o pagamento para liberar seu acesso completo.
        </motion.p>

        <motion.a
          variants={fadeUp} initial="hidden" animate="visible" custom={3}
          href={CAKTO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-block font-sans text-base font-semibold text-white px-9 py-4 rounded-xl bg-corpo-terra border-none cursor-pointer shadow-[0_4px_24px_rgba(196,98,45,0.40)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(196,98,45,0.50)] transition-all no-underline text-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Finalizar pagamento — R$47,90
        </motion.a>

        <motion.button
          variants={fadeUp} initial="hidden" animate="visible" custom={4}
          onClick={handleCheck}
          disabled={checking}
          className="mt-6 font-sans text-sm text-white/50 underline bg-transparent border-none cursor-pointer hover:text-white/80 transition-colors disabled:opacity-50"
        >
          {checking ? "Verificando..." : "Já paguei, verificar acesso →"}
        </motion.button>

        {notFound && !checking && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 font-sans text-sm text-white/60"
          >
            Pagamento ainda não confirmado. Aguarde alguns instantes e tente novamente.
          </motion.p>
        )}

        <motion.button
          variants={fadeUp} initial="hidden" animate="visible" custom={5}
          onClick={signOut}
          className="mt-4 font-sans text-xs text-white/30 bg-transparent border-none cursor-pointer hover:text-white/50 transition-colors"
        >
          Sair da conta
        </motion.button>
      </div>
    </div>
  );
};

export default AccessPending;
