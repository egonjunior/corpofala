import { useState } from "react";
import PDFCover from "@/components/ebook/PDFCover";
import PDFCoverV2 from "@/components/ebook/PDFCoverV2";
import { LogoA, LogoB, LogoC, LogoD, LogoE, LogoF, LogoG, LogoH, LogoI, LogoJ, LogoK, LogoL, LogoM, LogoN, LogoO } from "@/components/logo/LogoVariations";

const LOGOS = [
  { id: "A", label: "Ultra-minimal", desc: "Sans-serif leve + coração pequeno à esquerda", Component: LogoA },
  { id: "B", label: "Heart-inline", desc: "Coração integrado entre 'corpo' e 'fala'", Component: LogoB },
  { id: "C", label: "Stacked", desc: "Coração em cima, texto embaixo em caps espaçado", Component: LogoC },
  { id: "D", label: "Monogram", desc: "Monograma 'cf' serifado + texto auxiliar", Component: LogoD },
  { id: "E", label: "Aesop", desc: "All-caps espaçado + coração trailing sutil", Component: LogoE },
  { id: "F", label: "Dot separator", desc: "corpo · fala — ponto terra separando", Component: LogoF },
  { id: "G", label: "Weight contrast", desc: "corpo light + fala bold, sem ícone", Component: LogoG },
  { id: "H", label: "Slash editorial", desc: "corpo/fala — barra sutil em terra", Component: LogoH },
  { id: "I", label: "Badge heart", desc: "Coração em badge circular + caps espaçado", Component: LogoI },
  { id: "J", label: "Serif elegant", desc: "Serifada lowercase + ponto terra como acento", Component: LogoJ },
  { id: "K", label: "Product Page", desc: "Estilo Apple SF Pro — tight, coração como ponto final", Component: LogoK },
  { id: "L", label: "The Row", desc: "Tracking ultra-aberto, corpo light + fala medium", Component: LogoL },
  { id: "M", label: "Pulse", desc: "Linha de batimento cardíaco conectando corpo→fala", Component: LogoM },
  { id: "N", label: "Google-tier", desc: "Zero ornamento, corpo bold + fala light, tracking negativo", Component: LogoN },
  { id: "O", label: "Iconic mark", desc: "Silhueta abstrata corpo/coração + wordmark restrained", Component: LogoO },
];

type Tab = "logos" | "covers";

const CoverCompare = () => {
  const [tab, setTab] = useState<Tab>("logos");

  return (
    <div className="min-h-screen py-16 px-6" style={{ background: "#1a1a1a" }}>
      <div className="max-w-6xl mx-auto">
        {/* Tabs */}
        <div className="flex justify-center gap-1 mb-12">
          {(["logos", "covers"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="border-none cursor-pointer px-6 py-2.5 rounded-full transition-all"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                background: tab === t ? "rgba(255,255,255,0.1)" : "transparent",
                color: tab === t ? "#fff" : "rgba(255,255,255,0.4)",
              }}
            >
              {t === "logos" ? "Logos" : "Capas"}
            </button>
          ))}
        </div>

        {tab === "logos" && (
          <>
            <h1 className="text-center mb-2" style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: "#fff" }}>
              Escolha a Logo
            </h1>
            <p className="text-center mb-16" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.45)" }}>
              5 variações minimalistas — clique na que mais combina
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {LOGOS.map(({ id, label, desc, Component }) => (
                <div
                  key={id}
                  className="group flex flex-col items-center gap-6 p-8 rounded-2xl transition-all cursor-pointer hover:scale-[1.02]"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {/* Label */}
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.25em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
                    Opção {id} — {label}
                  </span>

                  {/* Logo on light bg */}
                  <div className="flex items-center justify-center rounded-xl w-full" style={{ background: "#F2EDE4", padding: "32px 24px", minHeight: 80 }}>
                    <div style={{ color: "#1A1520" }}>
                      <Component scale={1.8} />
                    </div>
                  </div>

                  {/* Logo on dark bg */}
                  <div className="flex items-center justify-center rounded-xl w-full" style={{ background: "#0D0B12", padding: "32px 24px", minHeight: 80 }}>
                    <div style={{ color: "#ffffff" }}>
                      <Component scale={1.8} />
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center", lineHeight: 1.6 }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "covers" && (
          <>
            <h1 className="text-center mb-4" style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: "#ffffff" }}>
              Comparação de Capas
            </h1>
            <p className="text-center mb-16" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em" }}>
              Escolha a direção visual do ebook
            </p>
            <div className="flex flex-col lg:flex-row gap-12 items-start justify-center">
              <div className="flex flex-col items-center gap-4">
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.3em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
                  Opção A — Editorial Clara
                </span>
                <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", transform: "scale(0.55)", transformOrigin: "top center" }}>
                  <PDFCover />
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.3em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
                  Opção B — Cinematográfica Dark
                </span>
                <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(218,165,32,0.08)", transform: "scale(0.55)", transformOrigin: "top center" }}>
                  <PDFCoverV2 />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CoverCompare;
