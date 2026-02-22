import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download } from "lucide-react";

export interface Chapter {
  slug: string;
  title: string;
  subtitle?: string;
}

interface ChapterNavProps {
  chapters: Chapter[];
}

const ChapterNav = ({ chapters }: ChapterNavProps) => {
  const [open, setOpen] = useState(false);
  const { parte } = useParams();

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-6 left-4 z-50 p-2 rounded-full bg-card/80 backdrop-blur border border-border shadow-md hover:shadow-lg transition-shadow"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-card border-r border-border shadow-xl p-6 pt-16 overflow-y-auto"
            >
              <Link
                to="/ebook"
                onClick={() => setOpen(false)}
                className="block text-xs font-bold tracking-widest uppercase text-primary mb-6"
              >
                ← Índice
              </Link>

              <ul className="space-y-1">
                {chapters.map((ch) => {
                  const isActive = parte === ch.slug;
                  return (
                    <li key={ch.slug}>
                      <Link
                        to={`/ebook/${ch.slug}`}
                        onClick={() => setOpen(false)}
                        className={`block px-3 py-2.5 rounded-md text-sm transition-colors ${
                          isActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {ch.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 pt-6 border-t border-border">
                <a
                  href="/ebook.pdf"
                  download
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Baixar PDF
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChapterNav;
