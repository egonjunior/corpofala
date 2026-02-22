import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const PURCHASE_LINK = "https://pay.cakto.com.br/z8n5fua_774989";

const CTASection = () => {
  return (
    <section id="comprar" className="py-24 sm:py-32 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight mb-6 text-balance">
            A cura está em você.{" "}
            <span className="italic text-primary">Sempre esteve.</span>
            <br />
            Você só nunca teve o mapa.
          </h2>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed">
            Este livro é o mapa. Baseado em ciência, construído com empatia, 
            e escrito para quem está cansado de viver no piloto automático da dor.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex flex-col items-center gap-6"
        >
          <div className="p-8 rounded-3xl bg-card border border-border/50 shadow-xl">
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
              Ebook completo
            </p>
            <p className="text-4xl font-bold font-sans text-foreground mb-1">
              O Que Seu Corpo Está Tentando Te Dizer
            </p>
            <p className="text-muted-foreground text-sm mb-8">
              6 partes · +200 referências científicas · Ferramentas práticas
            </p>
            <Button
              asChild
              size="lg"
              className="w-full rounded-full py-7 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
            >
               <a href={PURCHASE_LINK}>
                 Garantir Meu Ebook
                 <ArrowRight className="ml-2 h-5 w-5" />
               </a>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Acesso imediato após a confirmação do pagamento
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
