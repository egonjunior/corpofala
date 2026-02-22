import { motion } from "framer-motion";

interface PullQuoteProps {
  children: React.ReactNode;
  author?: string;
}

const PullQuote = ({ children, author }: PullQuoteProps) => (
  <motion.blockquote
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    className="my-12 border-l-4 border-primary pl-8 pr-4 py-4 relative"
  >
    <span className="absolute -top-6 -left-2 text-7xl text-primary/20 font-serif select-none">"</span>
    <p className="text-xl md:text-2xl font-serif italic leading-relaxed text-foreground/90">
      {children}
    </p>
    {author && (
      <cite className="block mt-4 text-sm text-muted-foreground not-italic tracking-wide uppercase">
        — {author}
      </cite>
    )}
  </motion.blockquote>
);

export default PullQuote;
