import { CorpoFalaIcon } from "./CorpoFalaLogo";

interface LPCTAFinalProps {
  onOpenAuth: () => void;
}

const LPCTAFinal = ({ onOpenAuth }: LPCTAFinalProps) => (
  <section className="relative bg-corpo-dark overflow-hidden" style={{ padding: "140px 32px" }}>
    {/* Grain */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity: 0.05,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }}
    />
    <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 50% at center, rgba(196,98,45,0.10), transparent)" }} />

    <div className="relative z-10 max-w-[600px] mx-auto text-center flex flex-col items-center">
      {/* Icon */}
      <CorpoFalaIcon size={40} className="mb-6" />

      <h2 className="font-serif text-[52px] text-white/95 leading-[1.1]">
        Seu corpo já está
        <br />
        esperando por isso.
      </h2>

      <p className="font-sans text-lg text-white/55 font-light leading-[1.7] mt-5">
        Acesso imediato após o pagamento.
        <br />
        Livro interativo e todas as dinâmicas quando e onde precisar.
      </p>

      <button
        onClick={onOpenAuth}
        className="inline-block font-sans text-lg font-semibold text-white px-12 py-5 rounded-[14px] bg-corpo-terra border-none cursor-pointer shadow-[0_4px_40px_rgba(196,98,45,0.45)] hover:bg-[#B5561F] hover:-translate-y-0.5 hover:shadow-[0_8px_48px_rgba(196,98,45,0.55)] transition-all mt-12 tracking-[0.01em]"
      >
        Acessar agora — R$47,90
      </button>

      <span className="font-mono text-[10px] text-white/30 tracking-[0.1em] mt-4">
        7 DIAS DE GARANTIA · ACESSO IMEDIATO
      </span>

      <div className="flex justify-center gap-10 mt-12">
        {[
          { icon: "🔒", label: "Dados seguros" },
          { icon: "📱", label: "Funciona no celular" },
          { icon: "✨", label: "Acesso imediato" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <span className="text-xl opacity-30">{item.icon}</span>
            <span className="font-sans text-xs text-white/40">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default LPCTAFinal;
