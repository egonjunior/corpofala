import { useState } from "react";

const DYNAMICS = [
  { num: "01", name: "Âncora", tag: "GROUNDING", desc: "Para quando você sai do corpo. 5 sentidos. 5 toques. 3-5 minutos.", time: "3-5 min" },
  { num: "02", name: "Respiração", tag: "4-7-8", desc: "Para quando está acelerado. Biofeedback real.", time: "3-5 min" },
  { num: "03", name: "Mapa do Corpo", tag: "SOMÁTICO", desc: "Para quando não sabe o que sente. Cartografia.", time: "3-5 min" },
  { num: "04", name: "Soltar", tag: "DEFUSÃO", desc: "Para quando o pensamento não para. Ritual.", time: "3-5 min" },
  { num: "05", name: "Inverter", tag: "AUTOCOMPAIXÃO", desc: "Para quando a voz diz que não merece. Carta.", time: "5-8 min" },
];

interface LPDinamicasProps {
  onOpenAuth: () => void;
}

const LPDinamicas = ({ onOpenAuth }: LPDinamicasProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="dinamicas" className="bg-corpo-warm" style={{ padding: "120px max(32px, calc((100vw - 1200px) / 2))" }}>
      <div className="max-w-[1100px] mx-auto">
        <span className="font-mono text-[10px] text-corpo-terra tracking-[0.2em] block mb-5">PARA O DIA A DIA</span>
        <h2 className="font-serif text-[48px] text-corpo-dark leading-[1.15]">
          Quando você mais
          <br />
          precisa — elas
          <br />
          estão lá.
        </h2>
        <p className="font-sans text-[17px] text-corpo-subtle font-light leading-[1.7] mt-5 max-w-[480px]">
          Cinco ferramentas para os momentos difíceis. Cada uma desenvolvida com neurociência. Cada uma leva entre 3 e 5 minutos.
        </p>

        {/* Dynamics list */}
        <div className="max-w-[900px] mx-auto mt-14">
          {DYNAMICS.map((d, i) => (
            <div
              key={i}
              className="scroll-reveal border-t border-corpo-text/10 py-7 grid items-center gap-6 cursor-pointer transition-all duration-300 px-0 hover:px-4 hover:bg-corpo-terra/[0.04] hover:rounded-lg"
              style={{ gridTemplateColumns: "48px 200px 1fr auto" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="font-mono text-[13px] text-corpo-text/25">{d.num}</span>
              <div>
                <span className="font-serif text-lg text-corpo-dark block">{d.name}</span>
                <span className="font-mono text-[9px] text-corpo-terra tracking-[0.15em]">{d.tag}</span>
              </div>
              <p
                className="font-sans text-sm text-corpo-subtle leading-relaxed transition-opacity duration-300 hidden lg:block"
                style={{ opacity: hovered === i ? 1 : 0 }}
              >
                {d.desc}
              </p>
              <p className="font-sans text-sm text-corpo-subtle leading-relaxed lg:hidden">{d.desc}</p>
              <span className="font-mono text-[11px] text-corpo-text/35">{d.time}</span>
            </div>
          ))}
        </div>

        {/* Highlight bar */}
        <div className="scroll-reveal bg-corpo-terra/[0.06] rounded-xl p-7 mt-10 flex flex-col sm:flex-row items-center gap-6">
          <span className="text-2xl">⚡</span>
          <p className="font-serif italic text-base text-corpo-dark flex-1">
            Disponíveis a qualquer momento. Sem esperar o próximo capítulo. Sem precisar de contexto.
          </p>
          <button
            onClick={onOpenAuth}
            className="font-sans text-sm font-semibold text-white px-6 py-3 rounded-lg bg-corpo-terra border-none cursor-pointer hover:bg-[#B5561F] transition-colors whitespace-nowrap"
          >
            Acessar as dinâmicas →
          </button>
        </div>
      </div>
    </section>
  );
};

export default LPDinamicas;
