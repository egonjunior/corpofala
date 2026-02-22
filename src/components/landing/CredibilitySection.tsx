import { motion } from "framer-motion";
import { Dna, BrainCircuit, Atom } from "lucide-react";

const sciences = [
  {
    icon: BrainCircuit,
    name: "Psiconeuroimunologia",
    description:
      "A ciência que estuda como suas emoções afetam diretamente seu sistema imunológico e sua saúde física.",
  },
  {
    icon: Dna,
    name: "Epigenética",
    description:
      "Seus genes não são seu destino. Suas experiências e emoções podem ativar ou desativar genes específicos.",
  },
  {
    icon: Atom,
    name: "Neuroplasticidade",
    description:
      "Seu cérebro pode ser reprogramado. Novos padrões podem ser criados em qualquer idade.",
  },
];

const CredibilitySection = () => {
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
            Embasamento científico
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight text-balance">
            Não é autoajuda. É ciência.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {sciences.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <item.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold font-sans text-foreground mb-3">
                {item.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 p-8 rounded-2xl border border-border/50 bg-background text-center"
        >
          <p className="text-foreground/80 text-lg leading-relaxed italic text-balance">
            "Quando você muda sua mente, você muda sua biologia. E quando você muda 
            sua biologia, você muda sua vida."
          </p>
          <p className="text-muted-foreground text-sm mt-4">
            — Conceito central do livro, baseado em pesquisas de psiconeuroimunologia
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CredibilitySection;
