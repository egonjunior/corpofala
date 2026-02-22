import { motion } from "framer-motion";
import { Microscope, Repeat, Sparkles, Sun, Wrench, BookOpen } from "lucide-react";

const parts = [
  {
    icon: Microscope,
    title: "A Ciência",
    subtitle: "Psiconeuroimunologia",
    description:
      "Como suas emoções alteram seu sistema imunológico, seus genes e até a estrutura do seu cérebro.",
  },
  {
    icon: Repeat,
    title: "Os Padrões",
    subtitle: "O Mapa Invisível",
    description:
      "Por que você repete os mesmos erros — e a ciência que explica como seu corpo armazena memórias emocionais.",
  },
  {
    icon: Sparkles,
    title: "A Reprogramação",
    subtitle: "Neuroplasticidade",
    description:
      "O passo a passo para reescrever as crenças e padrões que mantêm você preso no mesmo ciclo.",
  },
  {
    icon: Sun,
    title: "A Espiritualidade",
    subtitle: "Além da Ciência",
    description:
      "A integração entre ciência e espiritualidade — como diferentes tradições confirmam o que os laboratórios descobriram.",
  },
  {
    icon: Wrench,
    title: "As Ferramentas",
    subtitle: "Prática Diária",
    description:
      "Técnicas práticas e protocolos que você pode aplicar hoje para começar a mudar sua relação com seu corpo.",
  },
  {
    icon: BookOpen,
    title: "Os Recursos",
    subtitle: "Indo Além",
    description:
      "Referências, autores e caminhos para quem quer aprofundar ainda mais nessa jornada de autoconhecimento.",
  },
];

const DiscoverySection = () => {
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
            O que você vai descobrir
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight text-balance">
            Uma jornada em 6 partes que conecta ciência, corpo e alma
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {parts.map((part, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-5 transition-colors duration-300">
                <part.icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-1">
                {part.subtitle}
              </p>
              <h3 className="text-xl text-foreground mb-3 font-sans font-bold">
                {part.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {part.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground text-sm">
            Baseado nas pesquisas de{" "}
            <span className="text-foreground font-medium">Dr. Bessel van der Kolk</span>,{" "}
            <span className="text-foreground font-medium">Dr. Joe Dispenza</span>,{" "}
            <span className="text-foreground font-medium">Dr. Gabor Maté</span>,{" "}
            <span className="text-foreground font-medium">Dr. Bruce Lipton</span> e outros.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default DiscoverySection;
