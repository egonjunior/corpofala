import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DynamicShellProps {
  children: ReactNode;
  background?: string;
  currentStep?: number;
  totalSteps?: number;
  showClose?: boolean;
  onClose?: () => void;
  screenKey?: string | number;
  isDark?: boolean;
}

const DynamicShell = ({
  children,
  background = "#0A0A12",
  currentStep,
  totalSteps,
  showClose = true,
  onClose,
  screenKey,
  isDark = true,
}: DynamicShellProps) => {
  const navigate = useNavigate();

  const handleClose = () => {
    if (onClose) onClose();
    else navigate("/app/dinamicas");
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
      style={{
        background,
        transition: "background 1.2s ease-in-out",
      }}
    >
      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-3 pb-2">
        {/* Progress bar */}
        {currentStep !== undefined && totalSteps !== undefined && totalSteps > 0 ? (
          <div className="flex-1 mr-4">
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "#00BCD4" }}
                initial={false}
                animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {showClose && (
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(26,21,32,0.08)" }}
            aria-label="Fechar dinâmica"
          >
            <X size={16} color={isDark ? "rgba(255,255,255,0.5)" : "rgba(26,21,32,0.5)"} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={screenKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col min-h-0 overflow-hidden"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DynamicShell;
