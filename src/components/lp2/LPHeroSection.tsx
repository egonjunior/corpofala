import { motion } from "framer-motion";

interface LPHeroSectionProps {
  onOpenAuth: () => void;
}

const LPHeroSection = ({ onOpenAuth }: LPHeroSectionProps) => {
  const scrollToLayers = () => {
    document.getElementById("camadas")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen py-16 sm:py-24 flex flex-col items-center justify-center bg-corpo-dark overflow-hidden">
      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Radial gradients */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 70% 40%, rgba(196,98,45,0.12), transparent)" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 40% 40% at 20% 80%, rgba(0,188,212,0.06), transparent)" }} />

      {/* Content — single vertical flow */}
      <div className="relative z-10 w-full max-w-[900px] mx-auto px-6 flex flex-col items-center text-center">

        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-mono text-[11px] text-corpo-terra tracking-[0.25em] mb-8"
        >
          AUTOCONHECIMENTO SOMÁTICO
        </motion.span>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-[40px] sm:text-[56px] md:text-[72px] leading-[1.1] tracking-[-0.02em]"
        >
          <span className="text-white/95">Seu corpo guarda</span>
          <br />
          <span className="text-corpo-terra">memórias que sua</span>
          <br />
          <span className="text-white/95">mente esqueceu.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="font-sans text-base sm:text-lg text-white/60 font-light leading-[1.7] max-w-[520px] mt-6 px-2 sm:px-0"
        >
          Padrões que se repetem. Reações que não fazem sentido. Tensões sem origem.
          Tudo isso tem uma lógica — e ela pode ser decifrada.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 mt-10"
        >
          <button
            onClick={onOpenAuth}
            className="font-sans text-base font-semibold text-white px-9 py-4 rounded-xl bg-corpo-terra border-none cursor-pointer shadow-[0_4px_24px_rgba(196,98,45,0.40)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(196,98,45,0.50)] transition-all tracking-[0.01em]"
          >
            Quero decifrar o meu corpo
          </button>
          <button
            onClick={scrollToLayers}
            className="font-sans text-base text-white/70 px-9 py-4 rounded-xl bg-transparent border border-white/20 cursor-pointer hover:border-white/50 hover:text-white transition-all"
          >
            Ver como funciona ↓
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="mt-12 w-full max-w-xs sm:max-w-sm flex justify-center items-stretch"
        >
          {[
            { num: "3", color: "#C4622D", label: "camadas\nintegradas" },
            { num: "5", color: "#00BCD4", label: "dinâmicas\nde crise" },
            { num: "28", color: "rgba(255,255,255,0.80)", label: "dias de\ntransformação" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center text-center flex-1 py-2 gap-2">
                <span
                  className="font-mono text-[28px] sm:text-[34px] leading-none"
                  style={{ color: stat.color }}
                >
                  {stat.num}
                </span>
                <span className="font-sans text-[10px] sm:text-[11px] text-white/40 leading-snug whitespace-pre-line">
                  {stat.label}
                </span>
              </div>
              {i < 2 && <div className="w-px h-10 bg-white/10 self-center mx-1" />}
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="mt-8 flex flex-col items-center gap-1.5"
        >
          <span className="font-mono text-[10px] text-white/30 tracking-[0.2em]">ROLAR PARA DESCOBRIR</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-white/40 text-sm"
          >
            ↓
          </motion.span>
        </motion.div>

      </div>
    </section>
  );
};

export default LPHeroSection;
