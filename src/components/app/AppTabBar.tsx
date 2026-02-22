import { useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, Heart, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { haptic } from "@/lib/haptics";
import InboxBadge from "@/components/app/InboxBadge";

const tabs = [
  { label: "Início", icon: Home, path: "/app/dashboard" },
  { label: "Ebook", icon: BookOpen, path: "/app/ebook" },
  { label: "Dinâmicas", icon: Heart, path: "/app/dinamicas" },
  { label: "Caixa", icon: Mail, path: "/app/inbox" },
];

const AppTabBar = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();

  // Hide tab bar inside the ebook reader
  if (!isMobile || location.pathname.match(/^\/app\/ebook\/.+/)) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
      style={{
        height: 64,
        background: "rgba(242,237,228,0.96)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(26,21,32,0.08)",
      }}
    >
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path || location.pathname.startsWith(tab.path + "/");
        const color = isActive ? "#C4622D" : "#B0A090";
        const Icon = tab.icon;

        return (
          <button
            key={tab.path}
            onClick={() => {
              if (!isActive) {
                haptic("light");
                navigate(tab.path);
              }
            }}
            className="flex flex-col items-center gap-1 py-2 px-3 relative"
          >
            <motion.span
              className="relative"
              whileTap={{ scale: 0.85 }}
              transition={{ duration: 0.1 }}
            >
              <Icon size={20} color={tab.label === "Dinâmicas" && !isActive ? "#00BCD4" : color} />
              {tab.label === "Caixa" && <InboxBadge className="absolute -top-1.5 -right-2.5" />}
            </motion.span>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 9,
                color: tab.label === "Dinâmicas" && !isActive ? "#00BCD4" : color,
              }}
            >
              {tab.label}
            </span>
            {isActive && (
              <motion.div
                layoutId="tabIndicator"
                className="absolute rounded-full"
                style={{
                  bottom: 6,
                  width: 4,
                  height: 4,
                  background: tab.label === "Dinâmicas" ? "#00BCD4" : "#C4622D",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default AppTabBar;
