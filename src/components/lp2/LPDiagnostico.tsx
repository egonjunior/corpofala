const SYMPTOM_CARDS = [
  { pattern: "HIPERCONTROLE", color: "#C4622D", title: "Tensão nos ombros que não passa", desc: "Seu corpo carrega o que você não consegue delegar. A tensão é literal." },
  { pattern: "RAIVA ENGOLIDA", color: "#FF9A6C", title: "Gastrite que volta sempre", desc: "Raiva não expressa tem endereço certo: o estômago. O corpo sabe o que a mente evita." },
  { pattern: "MEDO NÃO PROCESSADO", color: "#6B7FF5", title: "Pânico sem motivo aparente", desc: "O sistema nervoso em alerta permanente não distingue ameaça real de memória antiga." },
  { pattern: "AUTOSSABOTAGEM", color: "#8A7FF5", title: "Cansaço que o descanso não resolve", desc: "Quando o esgotamento vem de dentro, dormir mais não é a solução." },
  { pattern: "ATENÇÃO COMO NECESSIDADE", color: "#00BCD4", title: "Gripes que aparecem nas piores horas", desc: "O corpo aprende: adoecer traz o cuidado que você não sabe pedir de outra forma." },
];

const LPDiagnostico = () => (
  <section className="bg-corpo-warm" style={{ padding: "120px max(32px, calc((100vw - 1200px) / 2))" }}>
    <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">
      {/* Left column */}
      <div className="lg:max-w-[400px] lg:sticky lg:top-32 lg:self-start">
        <span className="font-mono text-[10px] text-corpo-terra tracking-[0.2em] block mb-6">O QUE SEU CORPO SENTE</span>
        <h2 className="font-serif text-[40px] text-corpo-dark leading-[1.2]">
          Você trata os sintomas.
          <br />
          Mas o corpo está tentando
          <br />
          te dizer outra coisa.
        </h2>
        <p className="font-sans text-[17px] text-corpo-subtle leading-[1.8] mt-6 max-w-[360px]">
          Dor de cabeça frequente. Tensão nos ombros.
          Gastrite. Insônia. Ansiedade sem motivo claro.
          A medicina trata cada um separado.
          Mas o corpo fala em sistema.
        </p>
      </div>

      {/* Right column — cards */}
      <div className="flex-1 flex flex-col gap-4">
        {SYMPTOM_CARDS.map((card, i) => (
          <div
            key={i}
            className={`scroll-reveal delay-${i + 1} bg-white rounded-xl p-6 shadow-[0_2px_16px_rgba(42,32,53,0.06)] hover:-translate-y-0.5 transition-transform`}
            style={{ borderLeft: `3px solid ${card.color}` }}
          >
            <span className="font-mono text-[9px] tracking-[0.2em] block mb-2" style={{ color: card.color }}>
              {card.pattern}
            </span>
            <h3 className="font-serif text-[17px] text-corpo-dark mb-2">{card.title}</h3>
            <p className="font-sans text-sm text-corpo-subtle leading-relaxed">{card.desc}</p>
          </div>
        ))}

        <p className="font-serif italic text-xl text-corpo-terra text-center mt-10 scroll-reveal">
          Há um padrão por trás de cada sintoma.
          <br />
          E ele tem nome.
        </p>
      </div>
    </div>
  </section>
);

export default LPDiagnostico;
