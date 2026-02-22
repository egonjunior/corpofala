import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const PURCHASE_LINK = "#comprar";

const cases = [
  {
    situation:
      "Uma mulher que cuidava da alimentação, fazia exercício e mesmo assim desenvolvia doenças autoimunes recorrentes.",
    insight:
      "A raiz não estava no corpo físico — estava em padrões emocionais de autoexigência e supressão que ativavam respostas inflamatórias crônicas.",
    result:
      "Ao entender e trabalhar a origem emocional, os marcadores inflamatórios começaram a mudar.",
  },
  {
    situation:
      "Um empreendedor que faturava bem durante o ano, mas em todo dezembro tomava decisões que destruíam seus resultados.",
    insight:
      "O padrão estava ligado a memórias emocionais da infância associadas a fim de ciclo e perda — gravadas no sistema nervoso, não na mente consciente.",
    result:
      "Quando identificou e reprogramou o gatilho, o ciclo de 14 anos se quebrou.",
  },
  {
    situation:
      "Uma profissional CLT com todas as qualificações para crescer, mas que travava em toda promoção, toda oportunidade decisiva.",
    insight:
      "Crenças de não-merecimento absorvidas na infância operavam como um freio invisível — seu corpo entrava em modo de sobrevivência exatamente quando precisava performar.",
    result:
      "Entender o mecanismo tirou o poder do padrão. A mudança veio com compreensão, não com esforço.",
  },
];

const CasesSection = () => {
  return (
    <section className="py-24 sm:py-32 px-6 bg-card/50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-4">
            Casos reais do livro
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight text-balance">
            Histórias que poderiam ser{" "}
            <span className="italic text-primary">a sua.</span>
          </h2>
        </motion.div>

        <div className="space-y-8">
          {cases.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="p-8 rounded-2xl border border-border/50 bg-background"
            >
              <Quote className="h-6 w-6 text-primary/40 mb-4" />
              <p className="text-foreground/80 leading-relaxed mb-4">
                {c.situation}
              </p>
              <p className="text-foreground leading-relaxed font-semibold mb-4">
                {c.insight}
              </p>
              <p className="text-primary/80 text-sm italic">{c.result}</p>
            </motion.div>
          ))}
        </div>

        {/* Final micro-CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-xl text-foreground/80 italic text-balance mb-8">
            "Você não precisa de mais força de vontade. Precisa entender o que
            está acontecendo por baixo da superfície."
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full px-10 py-7 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
          >
            <a href={PURCHASE_LINK}>
              Garantir Meu Ebook
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CasesSection;
