import { useState } from "react";
import { ChevronRight } from "lucide-react";

const CHAPTERS = [
  "A Ciência Que Prova Que Seu Corpo Fala",
  "Os 5 Padrões Universais",
  "Neuroplasticidade: Você Pode Mudar",
  "A 4ª Dimensão: Fé Que Cura",
  "O Arsenal Físico",
  "Onde Continuar Aprendendo",
];

const LPLivro = () => {
  const [openChapter, setOpenChapter] = useState<number | null>(null);

  return (
    <section id="livro" className="bg-corpo-warm" style={{ padding: "120px max(32px, calc((100vw - 1200px) / 2))" }}>
      <div className="flex flex-col lg:flex-row gap-20 max-w-[1200px] mx-auto">
        {/* Left — content */}
        <div className="flex-1 lg:max-w-[55%]">
          <span className="font-mono text-[10px] text-corpo-terra tracking-[0.2em] block mb-4">O LIVRO</span>
          <h2 className="font-serif text-[44px] text-corpo-dark leading-[1.2]">
            O que seu corpo
            <br />
            está tentando
            <br />
            te dizer.
          </h2>
          <p className="font-sans text-[17px] text-corpo-subtle leading-[1.8] mt-5 max-w-[480px]">
            A ciência que prova: mente e corpo são um sistema único. E os sintomas que você tem não são aleatórios — são mensagens.
          </p>

          {/* Chapters accordion */}
          <div className="mt-10">
            {CHAPTERS.map((ch, i) => (
              <button
                key={i}
                onClick={() => setOpenChapter(openChapter === i ? null : i)}
                className="w-full text-left border-t border-corpo-text/10 py-5 flex items-center justify-between group cursor-pointer bg-transparent hover:bg-corpo-terra/[0.03] transition-colors px-2"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[11px] text-corpo-text/25">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-sans text-[15px] text-corpo-text font-medium">{ch}</span>
                </div>
                <ChevronRight
                  size={14}
                  className={`text-corpo-terra transition-transform ${openChapter === i ? "rotate-90" : ""}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right — book visual (matches PDF cover) */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative" style={{ width: 320, height: 500 }}>
            {/* Book cover — real PDF cover aesthetic */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[400px] rounded-r-2xl rounded-l-sm flex flex-col items-center justify-between overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #faf6f1 0%, #f5efe6 40%, #f2ebe2 100%)",
                boxShadow: "-8px 8px 40px rgba(0,0,0,0.20), -2px 2px 8px rgba(0,0,0,0.12), 4px 0 12px rgba(0,0,0,0.06)",
              }}
            >
              {/* Subtle dot pattern */}
              <div
                className="absolute inset-0"
                style={{
                  opacity: 0.025,
                  backgroundImage: `radial-gradient(circle at 25% 25%, #BE5B2A 1px, transparent 1px),
                                    radial-gradient(circle at 75% 75%, #BE5B2A 1px, transparent 1px)`,
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Top teaser */}
              <p className="relative z-10 pt-8 font-mono text-[7px] tracking-[0.4em] text-corpo-terra/40 uppercase">
                Um livro que pode mudar sua vida
              </p>

              {/* Center title block */}
              <div className="relative z-10 text-center px-6" style={{ marginTop: -8 }}>
                <div className="mx-auto mb-4 w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, #BE5B2A, transparent)" }} />
                <p className="font-serif text-[28px] text-corpo-dark leading-[1.15] tracking-[0.01em]">
                  O Que Seu Corpo
                </p>
                <p
                  className="font-serif italic text-[36px] leading-[1.08] tracking-[0.01em]"
                  style={{ color: "#BE5B2A", textShadow: "0 1px 20px rgba(190,91,42,0.15)" }}
                >
                  Está Tentando
                  <br />
                  Te Dizer
                </p>
                <div className="mx-auto mt-4 mb-3 w-12 h-px" style={{ background: "linear-gradient(90deg, transparent, #BE5B2A, transparent)" }} />
                <p className="font-sans text-[8px] text-corpo-dark/50 tracking-[0.05em] leading-[2]">
                  Um Mapa Científico Para Entender
                  <br />
                  a Origem Emocional de Seus Bloqueios
                </p>
              </div>

              {/* Author */}
              <div className="relative z-10 pb-6 text-center">
                <div className="mx-auto mb-2 w-5 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(13,9,6,0.15), transparent)" }} />
                <p className="font-sans text-[7px] text-corpo-dark/25 tracking-[0.35em] uppercase">
                  Egon Junior Gotchalk
                </p>
              </div>
            </div>

            {/* Floating tag 1 */}
            <div className="absolute -bottom-2 -right-4 bg-white rounded-xl px-5 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.12)] animate-float">
              <span className="font-mono text-[9px] text-corpo-cyan block">5 PADRÕES</span>
              <span className="font-serif text-[15px] text-corpo-dark">Identificados na leitura</span>
            </div>

            {/* Floating tag 2 */}
            <div className="absolute -top-2 -left-4 bg-white rounded-xl px-5 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.12)] animate-float" style={{ animationDelay: "1.5s" }}>
              <span className="font-mono text-[9px] text-corpo-terra block">CIÊNCIA</span>
              <span className="font-sans text-[13px] text-corpo-text">Psiconeuroimunologia</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LPLivro;
