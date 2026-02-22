import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CorpoFalaLogoMark } from "@/components/lp2/CorpoFalaLogo";
import { useAuth } from "@/contexts/AuthContext";
import { Mail } from "lucide-react";
import InboxBadge from "@/components/app/InboxBadge";

const AppHeader = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Usuário";
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/app/login");
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 transition-all duration-500"
      style={{
        height: 56,
        background: scrolled ? "rgba(242,237,228,0.95)" : "rgba(242,237,228,0.75)",
        backdropFilter: "blur(20px) saturate(1.4)",
        WebkitBackdropFilter: "blur(20px) saturate(1.4)",
        borderBottom: scrolled ? "1px solid rgba(26,21,32,0.10)" : "1px solid rgba(26,21,32,0.04)",
      }}
    >
      <CorpoFalaLogoMark iconSize={20} textClass="text-[#1A1520]" className="text-sm" onClick={() => navigate("/app/dashboard")} />

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/app/inbox")}
          className="relative flex items-center justify-center"
          style={{ width: 34, height: 34 }}
        >
          <Mail size={20} color="#1A1520" />
          <InboxBadge className="absolute -top-1 -right-1" />
        </button>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center justify-center rounded-full transition-all duration-300"
          style={{
            width: 34, height: 34, background: "#C4622D",
            fontFamily: "'DM Serif Display', serif", fontSize: 14, color: "#fff",
            boxShadow: showDropdown ? "0 0 0 3px rgba(196,98,45,0.15), 0 2px 8px rgba(196,98,45,0.20)" : "0 0 0 2px rgba(196,98,45,0.08)",
          }}
        >
          {initial}
        </button>

        {showDropdown && (
          <div
            className="absolute right-0 mt-2 rounded-xl overflow-hidden glass-card"
            style={{ width: 170, background: "rgba(255,255,255,0.90)", border: "1px solid rgba(255,255,255,0.60)", boxShadow: "0 8px 32px rgba(26,21,32,0.12), 0 2px 8px rgba(26,21,32,0.06)" }}
          >
            <button
              onClick={() => { setShowDropdown(false); navigate("/app/perfil"); }}
              className="w-full text-left px-4 py-3 hover:bg-[rgba(196,98,45,0.05)] transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#1A1520" }}
            >
              Meu perfil
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 hover:bg-[rgba(196,98,45,0.05)] transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#8A7A70", borderTop: "1px solid rgba(26,21,32,0.06)" }}
            >
              Sair
            </button>
          </div>
        )}
      </div>
      </div>
    </header>
  );
};

export default AppHeader;
