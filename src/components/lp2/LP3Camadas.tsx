const LAYERS = [
  {
    num: "01",
    tag: "CAMADA 1",
    tagColor: "rgba(255,255,255,0.35)",
    title: "O Livro",
    desc: "A ciência por trás de cada sintoma emocional. 6 capítulos. Os 5 padrões universais. O mapa que a medicina não te deu.",
    features: ["Psiconeuroimunologia aplicada", "Os 5 padrões identificados", "Arsenal físico e mental"],
    bg: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.08)",
    hoverBorder: "rgba(196,98,45,0.3)",
    hoverBg: "rgba(196,98,45,0.04)",
    dotColor: "#C4622D",
    iconColor: "#C4622D",
    badge: null,
  },
  {
    num: "02",
    tag: "CAMADA 2",
    tagColor: "#C4622D",
    title: "A Experiência Viva",
    desc: "O mesmo livro — mas que responde a você. Identifica seu padrão. Gera seu mapa pessoal. Acompanha seus 28 dias de mudança.",
    features: ["Identifica seu padrão dominante", "Visualizações científicas animadas", "Calendário de prática de 28 dias", "Mapa Pessoal exclusivo gerado para você"],
    bg: "rgba(196,98,45,0.08)",
    border: "rgba(196,98,45,0.25)",
    hoverBorder: "rgba(196,98,45,0.60)",
    hoverBg: "rgba(196,98,45,0.12)",
    dotColor: "#C4622D",
    iconColor: "#C4622D",
    badge: "EXCLUSIVO",
  },
  {
    num: "03",
    tag: "CAMADA 3",
    tagColor: "#00BCD4",
    title: "5 Dinâmicas de Crise",
    desc: "Ferramentas para quando você mais precisa. Pânico. Pensamento em loop. Corpo tenso. Voz crítica. 3 a 5 minutos. Funciona.",
    features: ["Âncora — quando sai do corpo", "Respiração — quando está acelerado", "Mapa do Corpo — quando não sabe o que sente", "Soltar — quando o pensamento não para", "Inverter — quando a voz diz que não merece"],
    bg: "rgba(0,188,212,0.05)",
    border: "rgba(0,188,212,0.15)",
    hoverBorder: "rgba(0,188,212,0.35)",
    hoverBg: "rgba(0,188,212,0.08)",
    dotColor: "#00BCD4",
    iconColor: "#00BCD4",
    badge: null,
  },
];

const LP3Camadas = () => (
  <section id="camadas" className="bg-corpo-dark" style={{ padding: "120px max(32px, calc((100vw - 1200px) / 2))" }}>
    {/* Header */}
    <div className="text-center max-w-[640px] mx-auto mb-20">
      <span className="font-mono text-[10px] text-corpo-cyan tracking-[0.2em] block mb-5">UM SISTEMA COMPLETO</span>
      <h2 className="font-serif text-[48px] text-white/95 leading-[1.15]">
        Três camadas.
        <br />
        Uma jornada.
      </h2>
      <p className="font-sans text-[17px] text-white/50 font-light leading-[1.7] mt-5">
        Cada camada aprofunda a anterior. Juntas, formam o sistema mais completo de autoconhecimento somático em português.
      </p>
    </div>

    {/* Cards */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
      {LAYERS.map((layer) => (
        <div
          key={layer.num}
          className="scroll-reveal relative rounded-2xl p-9 transition-all duration-300 group hover:-translate-y-1"
          style={{
            background: layer.bg,
            border: `1px solid ${layer.border}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = layer.hoverBorder;
            e.currentTarget.style.background = layer.hoverBg;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = layer.border;
            e.currentTarget.style.background = layer.bg;
          }}
        >
          {/* Decorative number */}
          <span className="absolute -top-5 right-5 font-mono text-[120px] text-white/[0.03] leading-none pointer-events-none select-none">
            {layer.num}
          </span>

          {layer.badge && (
            <span className="absolute top-5 right-5 bg-corpo-terra rounded-full px-3 py-1 font-mono text-[9px] text-white tracking-[0.1em]">
              {layer.badge}
            </span>
          )}

          <span className="font-mono text-[9px] tracking-[0.2em] block mb-3" style={{ color: layer.tagColor }}>
            {layer.tag}
          </span>
          <h3 className="font-serif text-[22px] text-white/95 mb-4">{layer.title}</h3>
          <p className="font-sans text-[15px] text-white/55 leading-[1.7] mb-6">{layer.desc}</p>

          <div className="h-px bg-white/[0.08] my-6" />

          <ul className="space-y-2.5">
            {layer.features.map((f, j) => (
              <li key={j} className="flex items-start gap-2.5 font-sans text-sm text-white/60">
                <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: layer.dotColor }} />
                {f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
);

export default LP3Camadas;
