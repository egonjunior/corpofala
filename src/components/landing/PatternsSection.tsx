import { motion } from "framer-motion";
import {
  TrendingDown,
  Zap,
  AlertCircle,
  Repeat2,
  Lock,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const PURCHASE_LINK = "#comprar";

const patterns = [
  {
    icon: TrendingDown,
    name: "O Sabotador",
    description:
      "Aquele que se sabota conscientemente. Você sabe exatamente o que vai destruir seus resultados — e faz mesmo assim.",
  },
  {
    icon: Zap,
    name: "O Travado",
    description:
      "Quando chega o momento decisivo, seu corpo entra em modo de sobrevivência. Você congela, adia, não consegue agir.",
  },
  {
    icon: AlertCircle,
    name: "O Repetidor",
    description:
      "Você quebra um padrão, fica bem por um tempo, e depois volta exatamente ao mesmo lugar. Um ciclo sem fim.",
  },
  {
    icon: Repeat2,
    name: "O Conhecedor Impotente",
    description:
      "Você sabe TUDO o que precisa fazer. Estuda, se prepara, tem informação. Mas o conhecimento nunca vira ação consistente.",
  },
  {
    icon: Lock,
    name: "O Prisioneiro Invisível",
    description:
      "Algo invisível te trava. Você não consegue explicar, mas sente que não merece, que vai dar errado, que não é o seu lugar.",
  },
  {
    icon: Heart,
    name: "O Contradito",
    description:
      "Cuida do corpo mas a saúde não melhora. Faz terapia mas o padrão volta. Tudo certo teoricamente, nada certo na prática.",
  },
];

const PatternsSection = () => {
  return (
    <section className="py-24 sm:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-4">
            Os padrões no livro
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight text-balance">
            Qual padrão é{" "}
            <span className="italic text-primary">o seu?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
            (Ou talvez você se identifique com mais de um. A maioria se identifica
            com todos.)
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {patterns.map((pattern, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <pattern.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold font-sans text-foreground mb-3">
                {pattern.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {pattern.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Summary and final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center p-12 rounded-3xl bg-card/50 border border-border/50"
        >
          <p className="text-foreground/80 text-lg leading-relaxed mb-2">
            Você reconhece um, alguns, ou todos esses padrões?
          </p>
          <p className="text-foreground text-xl font-semibold mb-8 text-balance">
            <span className="text-primary italic">O Sabotador, O Travado, O Repetidor, O Conhecedor Impotente, O Prisioneiro Invisível, O Contradito.</span>
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Todos eles têm uma origem. Todos eles têm um mecanismo. E todos eles
            podem ser reprogramados — com a informação certa.
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

export default PatternsSection;
