import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Download, ArrowLeft } from "lucide-react";
import { chapters } from "@/data/ebookChapters";

const EbookIndex = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Back to dashboard */}
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <button
          onClick={() => window.location.href = "/app/dashboard"}
          className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "#8A7A70", background: "none", border: "none", cursor: "pointer" }}
        >
          <ArrowLeft size={16} /> Voltar ao Dashboard
        </button>
      </div>
      {/* Hero */}
      <header className="relative pt-10 pb-16 px-6 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-2xl mx-auto relative z-10"
        >
          <span className="text-xs font-bold tracking-[0.4em] uppercase text-primary mb-6 block">
            Ebook Completo
          </span>
          <h1 className="text-5xl md:text-7xl font-serif leading-tight text-foreground mb-6">
            O Que Seu Corpo Está Tentando Te Dizer
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed">
            Um Mapa Científico Para Entender a Origem Emocional de Suas Doenças
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={`/ebook/${chapters[0].slug}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Começar a Leitura
            </Link>
            <a
              href="/ebook.pdf"
              download
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-muted transition-colors"
            >
              <Download className="h-4 w-4" />
              Baixar PDF
            </a>
          </div>
        </motion.div>

        {/* Decorative bg */}
        <div className="absolute inset-0 -z-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(var(--primary)),transparent_60%)]" />
        </div>
      </header>

      {/* Table of contents */}
      <section className="max-w-xl mx-auto px-6 pb-24">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs font-bold tracking-[0.3em] uppercase text-muted-foreground mb-8 text-center"
        >
          Sumário
        </motion.h2>

        <ul className="space-y-2">
          {chapters.map((ch, i) => (
            <motion.li
              key={ch.slug}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
            >
              <Link
                to={`/ebook/${ch.slug}`}
                className="group flex items-center justify-between px-5 py-4 rounded-lg hover:bg-card transition-colors border border-transparent hover:border-border"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-primary/60 w-6 text-right">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <span className="text-foreground font-medium group-hover:text-primary transition-colors">
                      {ch.title}
                    </span>
                    {ch.subtitle && (
                      <span className="block text-xs text-muted-foreground mt-0.5">
                        {ch.subtitle}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-muted-foreground group-hover:text-primary transition-colors text-sm">
                  →
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default EbookIndex;
