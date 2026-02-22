import { motion } from "framer-motion";
import { GraduationCap, FlaskConical, Users } from "lucide-react";

const painPoints = [
  "Você come bem, treina, cuida do corpo — mas a saúde não melhora.",
  "Você estuda, se prepara, tem conhecimento — mas os resultados travam.",
  "Você sabe exatamente o que precisa fazer — mas não consegue manter a consistência.",
  "Você melhora por um tempo — e depois volta ao mesmo padrão de sempre.",
];

const sources = [
  {
    icon: GraduationCap,
    name: "Dr. Bessel van der Kolk",
    institution: "Harvard Medical School",
    contribution:
      "Pesquisador líder em trauma e corpo. Seu trabalho provou que o corpo guarda o que a mente tenta esquecer.",
  },
  {
    icon: FlaskConical,
    name: "Dr. Bruce Lipton",
    institution: "Stanford University",
    contribution:
      "Biólogo celular que demonstrou como crenças e percepções controlam a expressão genética — a base da epigenética comportamental.",
  },
  {
    icon: Users,
    name: "Dr. Gabor Maté",
    institution: "Autor & Pesquisador Clínico",
    contribution:
      "Décadas de prática clínica conectando estresse emocional, trauma de infância e doenças crônicas em milhares de pacientes.",
  },
];

const ValidationSection = () => {
  return (
    <section className="py-24 sm:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Pain reconnection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-4">
            Se você ainda tem dúvidas
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight text-balance">
            Talvez você esteja vivendo{" "}
            <span className="italic text-primary">exatamente isso:</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 mb-20">
          {painPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-border/50 bg-card"
            >
              <p className="text-foreground/80 leading-relaxed">{point}</p>
            </motion.div>
          ))}
        </div>

        {/* Scientific validation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl sm:text-3xl text-foreground leading-tight text-balance">
            Não somos nós dizendo.{" "}
            <span className="text-primary font-semibold">
              A ciência já comprovou.
            </span>
          </h3>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">
            O conteúdo deste livro é baseado em pesquisas publicadas por algumas
            das maiores instituições de pesquisa do mundo.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {sources.map((source, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <source.icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-foreground font-bold font-sans mb-1">
                {source.name}
              </p>
              <p className="text-xs text-primary/70 font-semibold uppercase tracking-wider mb-3">
                {source.institution}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {source.contribution}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValidationSection;
