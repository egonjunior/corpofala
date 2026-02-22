import { motion } from "framer-motion";
import { Clock, BookOpen, Lightbulb } from "lucide-react";

const milestones = [
  {
    icon: Clock,
    stat: "+10 anos",
    label: "de pesquisa contínua",
    detail:
      "Mais de uma década conectando neurociência, psicologia, epigenética e espiritualidade — para que você não precise de 10 anos pra chegar onde eu cheguei.",
  },
  {
    icon: BookOpen,
    stat: "+200",
    label: "referências científicas",
    detail:
      "Estudos de universidades como Harvard, Stanford e Johns Hopkins, reunidos e traduzidos em linguagem acessível.",
  },
  {
    icon: Lightbulb,
    stat: "1 objetivo",
    label: "que guiou tudo",
    detail:
      "Entender por que pessoas inteligentes, capazes e esforçadas continuam presas nos mesmos padrões — e como sair.",
  },
];

const ResearchJourneySection = () => {
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
            A jornada por trás do livro
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight text-balance">
            Mais de uma década de pesquisa condensada{" "}
            <span className="italic text-primary">em um único livro.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
            Cada capítulo, cada referência, cada ferramenta foi escolhida com um
            propósito: poupar você de anos de tentativa e erro para ir direto ao
            que funciona.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {milestones.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="h-8 w-8 text-primary" />
              </div>
              <p className="text-3xl font-bold font-sans text-foreground mb-1">
                {item.stat}
              </p>
              <p className="text-sm font-semibold text-primary/80 uppercase tracking-wider mb-3">
                {item.label}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResearchJourneySection;
