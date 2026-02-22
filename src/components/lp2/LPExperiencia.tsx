import { useState } from "react";

interface LPExperienciaProps {
  onOpenAuth: () => void;
}

const getReactiveText = (val: number) => {
  if (val <= 30) return "Este padrão opera pouco em você";
  if (val <= 60) return "Você reconhece alguns aspectos";
  if (val <= 85) return "Este padrão está presente na sua vida";
  return "Este padrão é central para você";
};

const FEATURES = [
  { icon: "🗺️", color: "#C4622D", title: "Mapa Pessoal Gerado", desc: "Ao terminar o livro, você recebe um mapa único com tudo que marcou e descobriu." },
  { icon: "📊", color: "#00BCD4", title: "Visualizações Científicas", desc: "3 animações que mostram o que acontece no seu sistema nervoso em tempo real." },
  { icon: "📅", color: "#C4622D", title: "28 Dias de Prática", desc: "Calendário integrado com micro-ações diárias para reescrever os circuitos." },
  { icon: "📝", color: "#00BCD4", title: "Marcações e Notas", desc: "Destaque trechos, salve reflexões, retome de onde parou. O livro lembra você." },
];

const LPExperiencia = ({ onOpenAuth }: LPExperienciaProps) => {
  const [sliderValue, setSliderValue] = useState(45);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleSlider = (val: number) => {
    setSliderValue(val);
    if (!hasInteracted) setHasInteracted(true);
  };

  return (
    <section className="bg-[#0F0C16]" style={{ padding: "120px max(32px, calc((100vw - 1200px) / 2))" }}>
      <div className="max-w-[1100px] mx-auto">
        <span className="font-mono text-[10px] text-corpo-terra tracking-[0.2em] block mb-5">A EXPERIÊNCIA VIVA</span>
        <h2 className="font-serif text-[48px] text-white/95 leading-[1.15]">
          O livro que
          <br />
          responde a você.
        </h2>
        <p className="font-sans text-[17px] text-white/50 font-light leading-[1.7] mt-5 max-w-[520px]">
          Enquanto você lê, a experiência aprende quem você é e adapta cada elemento para o seu padrão específico.
        </p>

        {/* Demo card */}
        <div
          className="scroll-reveal max-w-[680px] mx-auto mt-14 rounded-2xl p-10"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <span className="font-mono text-[9px] text-white/30 tracking-[0.2em] block mb-6">EXPERIMENTE AGORA — É REAL</span>

          <h3 className="font-serif italic text-lg text-white/85 mb-4">Você se identifica com este padrão?</h3>

          {/* Pattern block */}
          <div className="rounded-r-lg p-5 mb-6" style={{ background: "rgba(255,255,255,0.03)", borderLeft: "3px solid #C4622D" }}>
            <span className="font-mono text-[9px] text-corpo-terra tracking-[0.15em] block mb-2">HIPERCONTROLE</span>
            <p className="font-sans text-[15px] text-white/75 leading-[1.7]">
              Cresceu tendo que ser adulto cedo, ou em ambiente caótico. Hoje carrega tudo sozinho. Não delega. Sente tensão crônica nos ombros e dores nas costas.
            </p>
          </div>

          {/* Slider */}
          <div className="mt-6">
            <div className="flex justify-between mb-3">
              <span className="font-mono text-[10px] text-white/30">Não me identifico</span>
              <span className="font-mono text-[10px] text-white/30">Sou eu completamente</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={sliderValue}
              onChange={(e) => handleSlider(parseInt(e.target.value))}
              className="demo-range w-full"
              style={{
                background: `linear-gradient(to right, #C4622D ${sliderValue}%, rgba(255,255,255,0.10) ${sliderValue}%)`,
              }}
            />

            <div className="rounded-lg p-4 mt-4 transition-all duration-400" style={{ background: "rgba(196,98,45,0.08)" }}>
              <p className="font-serif italic text-[15px] text-corpo-terra">{getReactiveText(sliderValue)}</p>
            </div>
          </div>

          {/* CTA after interaction */}
          {hasInteracted && (
            <div className="mt-6 text-center">
              <p className="font-sans text-sm text-white/50 mb-4">
                No livro interativo, você faz isso para os 5 padrões e descobre qual domina sua vida.
              </p>
              <button
                onClick={onOpenAuth}
                className="font-sans text-sm font-semibold text-white px-6 py-3 rounded-lg bg-corpo-terra border-none cursor-pointer hover:bg-[#B5561F] transition-colors"
              >
                Ver meu padrão completo →
              </button>
            </div>
          )}
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[680px] mx-auto mt-10">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="scroll-reveal rounded-xl p-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="text-xl mb-3 block">{f.icon}</span>
              <h4 className="font-serif text-base text-white/85 mb-2">{f.title}</h4>
              <p className="font-sans text-[13px] text-white/45 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LPExperiencia;
