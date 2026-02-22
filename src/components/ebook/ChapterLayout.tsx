import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import ReadingProgress from "./ReadingProgress";
import ChapterNav, { Chapter } from "./ChapterNav";

interface ChapterLayoutProps {
  chapters: Chapter[];
  currentSlug: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const ChapterLayout = ({ chapters, currentSlug, title, subtitle, children }: ChapterLayoutProps) => {
  const currentIndex = chapters.findIndex((c) => c.slug === currentSlug);
  const prev = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const next = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentSlug]);

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress />
      <ChapterNav chapters={chapters} />

      {/* Chapter header */}
      <header className="pt-24 pb-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl mx-auto text-center"
        >
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 block">
            {currentIndex + 1} de {chapters.length}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-foreground mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          )}
        </motion.div>
      </header>

      {/* Content */}
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-2xl mx-auto px-6 pb-24 prose-custom"
      >
        {children}
      </motion.article>

      {/* Navigation footer */}
      <footer className="border-t border-border">
        <div className="max-w-2xl mx-auto px-6 py-8 flex items-center justify-between">
          {prev ? (
            <Link
              to={`/ebook/${prev.slug}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{prev.title}</span>
              <span className="sm:hidden">Anterior</span>
            </Link>
          ) : (
            <Link
              to="/ebook"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Índice
            </Link>
          )}

          <a
            href="/ebook.pdf"
            download
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            PDF
          </a>

          {next ? (
            <Link
              to={`/ebook/${next.slug}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="hidden sm:inline">{next.title}</span>
              <span className="sm:hidden">Próximo</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="text-sm text-muted-foreground">Fim</span>
          )}
        </div>
      </footer>
    </div>
  );
};

export default ChapterLayout;
