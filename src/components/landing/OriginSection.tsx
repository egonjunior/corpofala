import { motion } from "framer-motion";

const OriginSection = () => {
  return (
    <section className="py-24 sm:py-32 px-6 bg-card/50">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-4">
            A história por trás do livro
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight text-balance">
            Eu sabia o que fazer. Mas não conseguia parar de me sabotar.
          </h2>
        </motion.div>

        <div className="space-y-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-lg leading-relaxed text-foreground/80"
          >
            Todo dezembro, o mesmo ciclo: decisões ruins, dinheiro perdido, oportunidades 
            desperdiçadas. Eu via acontecendo, sabia que estava me sabotando — e mesmo 
            assim, não conseguia parar. Era como assistir um filme que eu já conhecia o 
            final, sem poder mudar o roteiro.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg leading-relaxed text-foreground/80"
          >
            E não era falta de conhecimento. Eu estudava, me preparava, cuidava da 
            alimentação, tentava fazer tudo certo. Mas os resultados simplesmente não 
            vinham. O empreendedor que trava quando está prestes a crescer. O profissional 
            que tem todo o conhecimento mas não consegue avançar na carreira. A pessoa que 
            cuida do corpo mas a saúde não melhora.{" "}
            <span className="text-foreground font-semibold">
              O padrão é o mesmo — e a causa também.
            </span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg leading-relaxed text-foreground/80"
          >
            A virada não veio de "pensar positivo" ou de mais um curso. Veio quando 
            descobri que esses padrões não estavam na minha mente consciente —{" "}
            <span className="text-foreground font-semibold italic">
              estavam gravados no meu corpo.
            </span>{" "}
            Crenças enterradas tão fundo que nenhuma força de vontade alcançava. A 
            psiconeuroimunologia, a neuroplasticidade e a epigenética me mostraram 
            exatamente DE ONDE vinham esses padrões e COMO reprogramá-los.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="text-lg leading-relaxed text-foreground/80"
          >
            Quando entendi o mecanismo, o ciclo de 14 anos quebrou. Não com esforço — 
            com compreensão. Este livro é esse mapa.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-6 border-t border-border"
          >
            <p className="text-xl text-foreground italic text-center text-balance">
              "Não importa se você é empreendedor, CLT, ou autônomo. Se você sente que 
              algo invisível te trava — esse algo tem nome, tem origem, e tem solução."
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OriginSection;
