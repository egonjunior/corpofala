import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { usePDFMode } from "@/contexts/PDFModeContext";

interface ScientificReferenceProps {
  title: string;
  children: React.ReactNode;
}

const ScientificReference = ({ title, children }: ScientificReferenceProps) => {
  const isPDFMode = usePDFMode();
  const [open, setOpen] = useState(isPDFMode);

  // In PDF mode, render fully expanded without animation
  if (isPDFMode) {
    return (
      <div className="my-6 rounded-lg border border-border bg-card/50" data-pdf-ref="true">
        <div className="w-full flex items-center gap-2 px-5 py-4 text-left text-sm font-medium text-muted-foreground">
          <span className="text-primary text-xs font-bold tracking-widest uppercase">Ref</span>
          <span>{title}</span>
        </div>
        <div className="overflow-visible">
          <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-6 rounded-lg border border-border bg-card/50">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className="text-primary text-xs font-bold tracking-widest uppercase">Ref</span>
          {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScientificReference;
