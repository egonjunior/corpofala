import { motion } from "framer-motion";
import { Heart, Brain, RefreshCw, AlertCircle, Zap, Shield, TrendingDown, Target } from "lucide-react";

const symptoms = [
  {
    icon: RefreshCw,
    text: "Padrões repetitivos que você jura que vai quebrar... mas nunca quebra",
  },
  {
    icon: TrendingDown,
    text: "Sabota seus próprios resultados mesmo tendo conhecimento e preparo",
  },
  {
    icon: Target,
    text: "Trava nos momentos decisivos — da carreira, dos negócios, da vida",
  },
  {
    icon: Heart,
    text: "Cuida do corpo, come bem, se exercita — mas a saúde não responde",
  },
  {
    icon: Brain,
    text: "Ansiedade constante, como se algo terrível fosse acontecer",
  },
  {
    icon: AlertCircle,
    text: "Dores crônicas que nenhum médico consegue explicar",
  },
  {
    icon: Zap,
    text: "Exaustão que não melhora com descanso",
  },
  {
    icon: Shield,
    text: "A sensação de que precisa se proteger o tempo todo — sem saber de quê",
  },
];

const RecognitionSection = () => {
  return (
    <section id="reconhece" className="py-24 sm:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-4">
            Seja honesto consigo
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight text-balance">
            Você se reconhece em alguma dessas situações?
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {symptoms.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-foreground/80 leading-relaxed pt-1.5">{item.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12 text-lg text-muted-foreground italic"
        >
          Se você disse sim para pelo menos uma... este livro foi escrito para você.
        </motion.p>
      </div>
    </section>
  );
};

export default RecognitionSection;
