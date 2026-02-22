import { useState } from "react";
import { X, Menu } from "lucide-react";
import { CorpoFalaLogoMark } from "./CorpoFalaLogo";

interface LPHeaderProps {
  onOpenAuth: (tab?: "create" | "login") => void;
}

const LPHeader = ({ onOpenAuth }: LPHeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[100] h-16 flex items-center justify-between"
        style={{
          background: "rgba(242,237,228,0.92)",
          backdropFilter: "blur(16px) saturate(1.2)",
          borderBottom: "1px solid rgba(42,32,53,0.06)",
          padding: "0 max(32px, calc((100vw - 1200px) / 2))",
        }}
      >
        {/* Logo */}
        <CorpoFalaLogoMark onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {[
            { label: "O Livro", id: "livro" },
            { label: "Dinâmicas", id: "dinamicas" },
            { label: "Como Funciona", id: "camadas" },
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="font-sans text-sm text-corpo-subtle hover:text-corpo-terra transition-colors cursor-pointer bg-transparent border-none"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Desktop buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => onOpenAuth("login")}
            className="font-sans text-sm text-corpo-text px-5 py-2 rounded-lg border border-corpo-text/20 hover:border-corpo-terra hover:text-corpo-terra transition-all cursor-pointer bg-transparent"
          >
            Entrar
          </button>
          <button
            onClick={() => onOpenAuth("create")}
            className="font-sans text-sm font-semibold text-white px-5 py-2 rounded-lg bg-corpo-terra hover:bg-[#B5561F] transition-all cursor-pointer border-none shadow-[0_2px_8px_rgba(196,98,45,0.25)] hover:-translate-y-px"
          >
            Começar
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden bg-transparent border-none cursor-pointer" onClick={() => setMobileOpen(true)}>
          <Menu size={24} color="#2A2035" />
        </button>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] bg-[#0D0B12] flex flex-col items-center justify-center gap-8">
          <button className="absolute top-5 right-5 bg-transparent border-none cursor-pointer" onClick={() => setMobileOpen(false)}>
            <X size={24} color="white" />
          </button>
          {[
            { label: "O Livro", id: "livro" },
            { label: "Dinâmicas", id: "dinamicas" },
            { label: "Como Funciona", id: "camadas" },
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="font-serif text-3xl text-white/80 bg-transparent border-none cursor-pointer hover:text-corpo-terra transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="flex flex-col gap-4 mt-8 w-64">
            <button
              onClick={() => { setMobileOpen(false); onOpenAuth("login"); }}
              className="font-sans text-base text-white/70 px-6 py-3 rounded-lg border border-white/20 bg-transparent cursor-pointer"
            >
              Entrar
            </button>
            <button
              onClick={() => { setMobileOpen(false); onOpenAuth("create"); }}
              className="font-sans text-base font-semibold text-white px-6 py-3 rounded-lg bg-corpo-terra cursor-pointer border-none text-center"
            >
              Começar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LPHeader;
