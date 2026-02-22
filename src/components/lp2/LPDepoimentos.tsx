import { useState, useEffect, useCallback } from "react";

const TESTIMONIALS = [
  { text: "Comecei usando a Dinâmica Âncora durante crises de pânico. Em três semanas, a frequência das crises caiu pela metade.", name: "M.S.", detail: "Psicóloga, 34 anos", initial: "M" },
  { text: "O Mapa do Corpo me ajudou a perceber que eu nem sabia o que estava sentindo. Agora eu sei nomear antes de reagir.", name: "R.P.", detail: "Empresário, 42 anos", initial: "R" },
  { text: "A Dinâmica Inverter foi o que nenhuma terapia conseguiu fazer em 3 anos: me fazer falar comigo mesmo como eu falo com quem eu amo.", name: "L.A.", detail: "Designer, 29 anos", initial: "L" },
];

const LPDepoimentos = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % TESTIMONIALS.length), []);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section className="bg-corpo-warm" style={{ padding: "120px max(32px, calc((100vw - 1200px) / 2))" }}>
      <div className="max-w-[1100px] mx-auto">
        <span className="font-mono text-[10px] text-corpo-terra tracking-[0.2em] block mb-5">QUEM JÁ USOU</span>
        <h2 className="font-serif text-[40px] text-corpo-dark leading-[1.2] mb-14">
          O que as pessoas
          <br />
          estão sentindo.
        </h2>

        {/* Desktop: all 3 */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="lg:hidden">
          <TestimonialCard {...TESTIMONIALS[current]} />
          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="w-2 h-2 rounded-full border-none cursor-pointer transition-colors"
                style={{ background: i === current ? "#C4622D" : "rgba(42,32,53,0.15)" }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ text, name, detail, initial }: typeof TESTIMONIALS[0]) => (
  <div className="relative bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(42,32,53,0.08)]">
    <span className="font-serif text-[80px] text-corpo-terra/10 absolute -top-2.5 left-5 leading-none select-none">"</span>
    <p className="font-serif italic text-base text-corpo-text leading-[1.7] mt-4">{text}</p>
    <div className="flex items-center gap-3 mt-6">
      <div className="w-10 h-10 rounded-full bg-corpo-terra/15 flex items-center justify-center">
        <span className="font-mono text-sm text-corpo-terra">{initial}</span>
      </div>
      <div>
        <span className="font-sans text-sm font-semibold text-corpo-text block">{name}</span>
        <span className="font-sans text-xs text-corpo-subtle">{detail}</span>
      </div>
    </div>
  </div>
);

export default LPDepoimentos;
