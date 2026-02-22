const STUDIES = [
  { journal: "PNAS, 2014", title: "701 pessoas. 5 culturas.\nEmoções têm endereço\nno corpo.", desc: "Nummenmaa et al. — As emoções ativam áreas específicas e consistentes do corpo em todas as culturas." },
  { journal: "UCLA, 2007", title: "Nomear uma emoção\nreduz sua intensidade\nem até 40%.", desc: "Lieberman et al. — A linguagem ativa o pré-frontal, que regula a amígdala. Dizer o que sente é medicina." },
  { journal: "PSYCHOSOMATIC MED, 2005", title: "Respiração lenta sincroniza\ncoração e cérebro\nem 90 segundos.", desc: "Russo et al. — Coerência cardíaca ativada pela respiração controlada. Mensurável. Reproduzível." },
];

const REFERENCES = [
  { name: "Dr. Bessel van der Kolk", institution: "Harvard Medical School", work: "O Corpo Guarda as Marcas — trauma e sistema nervoso" },
  { name: "Dr. Gabor Maté", institution: "Universidade de British Columbia", work: "Quando o Corpo Diz Não — stress e doença" },
  { name: "Dr. Joe Dispenza", institution: "Neurocientista e pesquisador", work: "Quebrando o Hábito de Ser Você Mesmo — neuroplasticidade aplicada" },
  { name: "Dr. Bruce Lipton", institution: "Stanford University", work: "A Biologia da Crença — epigenética e ambiente celular" },
  { name: "Tony Robbins", institution: "Robbins Research International", work: "Estratégias de pico de performance e mudança de estado" },
  { name: "Dr. Robert Ader", institution: "University of Rochester", work: "Fundador da Psiconeuroimunologia" },
];

const LPCiencia = () => (
  <section className="bg-corpo-dark" style={{ padding: "120px max(32px, calc((100vw - 1200px) / 2))" }}>
    <div className="max-w-[1100px] mx-auto">
      <span className="font-mono text-[10px] text-corpo-cyan tracking-[0.2em] block mb-5">A CIÊNCIA POR TRÁS</span>
      <h2 className="font-serif text-[40px] text-white/95 leading-[1.2]">
        Não é autoajuda.
        <br />
        É neurociência.
      </h2>

      {/* Studies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-14">
        {STUDIES.map((s, i) => (
          <div
            key={i}
            className="scroll-reveal rounded-xl p-7"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <span className="font-mono text-[11px] text-corpo-cyan block mb-4">{s.journal}</span>
            <h3 className="font-serif text-[17px] text-white/90 leading-[1.5] mb-4 whitespace-pre-line">{s.title}</h3>
            <p className="font-sans text-[13px] text-white/45 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* References — researchers & institutions */}
      <div className="mt-20">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
          <span className="font-mono text-[10px] text-corpo-terra tracking-[0.2em]">BASEADO NO TRABALHO DE</span>
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REFERENCES.map((r, i) => (
            <div
              key={i}
              className="scroll-reveal group rounded-lg px-5 py-4 transition-colors hover:bg-white/[0.04]"
              style={{ border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <p className="font-serif text-[15px] text-white/85">{r.name}</p>
              <p className="font-mono text-[9px] text-corpo-cyan/70 tracking-[0.1em] mt-1">{r.institution.toUpperCase()}</p>
              <p className="font-sans text-[12px] text-white/35 leading-relaxed mt-2">{r.work}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="font-sans italic text-[15px] text-white/40 text-center mt-16">
        Mais de 10 anos de pesquisa condensados em um sistema prático.
        <br />
        As dinâmicas foram desenvolvidas com base nestas e em outras pesquisas de neurociência, psiconeuroimunologia e terapia somática.
      </p>
    </div>
  </section>
);

export default LPCiencia;
