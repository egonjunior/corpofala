import { useState, useRef } from "react";
import { Download, Share2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { PatternScores, CalendarProgress } from "@/hooks/useReaderState";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PATTERNS: Record<string, { name: string; description: string; symptoms: string[] }> = {
  pattern1: {
    name: "Doença = Atenção",
    description: "Este padrão opera quando a criança aprendeu que doença = amor e cuidado. Manifesta-se como adoecimentos recorrentes em momentos de carência emocional.",
    symptoms: ["Gripes e resfriados recorrentes", "Infecções frequentes", "Fadiga crônica sem causa"],
  },
  pattern2: {
    name: "Raiva Engolida",
    description: "Este padrão opera quando a pessoa nunca confronta e engole tudo. Manifesta-se como inflamação e sintomas que 'queimam' por dentro.",
    symptoms: ["Furúnculos recorrentes", "Gastrite e úlcera", "Pressão alta", "Dermatite/psoríase", "Bruxismo"],
  },
  pattern3: {
    name: "Hipercontrole",
    description: "Este padrão opera quando a pessoa carrega tudo sozinha ou precisa controlar tudo. Manifesta-se como tensão muscular crônica.",
    symptoms: ["Dor crônica nas costas/ombros", "Fibromialgia", "Síndrome do Intestino Irritável", "TOC", "Tensão muscular permanente"],
  },
  pattern4: {
    name: "Medo e Trauma Não Processado",
    description: "Este padrão opera quando há abandono emocional ou trauma não processado. Manifesta-se como sistema nervoso em alerta permanente.",
    symptoms: ["Síndrome do pânico", "Ansiedade generalizada", "Insônia crônica", "Hipervigilância", "Taquicardia"],
  },
  pattern5: {
    name: "Autossabotagem",
    description: "Este padrão opera quando há perfeccionismo destrutivo ou crença de 'não mereço'. Manifesta-se como burnout ou ciclos de sabotagem.",
    symptoms: ["Burnout recorrente", "Depressão após conquistas", "Bruxismo", "Insônia com mente acelerada", "Fadiga crônica"],
  },
};

const PATTERN_TO_DYNAMIC: Record<string, { name: string; id: string; desc: string }> = {
  pattern1: { name: "Âncora de Grounding 5-4-3-2-1", id: "anchor", desc: "Para voltar ao momento presente quando se sentir sobrecarregado" },
  pattern2: { name: "Soltar o Pensamento", id: "release", desc: "Para liberar raiva e frustração de forma saudável" },
  pattern3: { name: "Respiração Guiada 4-7-8", id: "breathing", desc: "Para acalmar o sistema nervoso em modo alerta" },
  pattern4: { name: "Âncora de Grounding 5-4-3-2-1", id: "anchor", desc: "Para interromper ciclos de pânico e hipervigilância" },
  pattern5: { name: "Inversão de Perspectiva", id: "inversion", desc: "Para quebrar padrões de pensamento destrutivo" },
};

interface Highlight {
  text: string;
  color: string;
  chapterId: string;
  paragraphIndex: number;
}

interface PersonalMapProps {
  introQuestion: string | null;
  dominantPattern: string | null;
  patternScores: PatternScores;
  calendarProgress: CalendarProgress;
  allHighlights: Highlight[];
  conclusionReflection: string | null;
  onOpenMarkings: () => void;
  onScrollToMirror: () => void;
  darkMode: boolean;
}

const PersonalMap = ({
  introQuestion,
  dominantPattern,
  patternScores,
  calendarProgress,
  allHighlights,
  conclusionReflection,
  onOpenMarkings,
  onScrollToMirror,
  darkMode,
}: PersonalMapProps) => {
  const [generating, setGenerating] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const cyanHighlights = allHighlights.filter((h) => h.color === "cyan").slice(0, 10);
  const completedDays = calendarProgress.weeks.flat().filter(Boolean).length;
  const totalProgress = Math.round((completedDays / 28) * 100);

  // Calculate streak
  const allDays = calendarProgress.weeks.flat();
  let streak = 0;
  for (let i = allDays.length - 1; i >= 0; i--) {
    if (allDays[i]) streak++;
    else break;
  }

  const otherPatterns = Object.entries(patternScores)
    .filter(([k, v]) => v > 50 && k !== dominantPattern)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const dominantScore = dominantPattern ? patternScores[dominantPattern as keyof PatternScores] : 0;
  const patternInfo = dominantPattern ? PATTERNS[dominantPattern] : null;
  const dynamicInfo = dominantPattern ? PATTERN_TO_DYNAMIC[dominantPattern] : null;

  const dateStr = new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });

  const handleDownloadPDF = async () => {
    if (!mapRef.current) return;
    setGenerating(true);
    try {
      const canvas = await html2canvas(mapRef.current, { scale: 2, backgroundColor: "#F2EDE4", logging: false });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfW = pdf.internal.pageSize.getWidth();
      const ratio = pdfW / canvas.width;
      const imgH = canvas.height * ratio;
      
      // Handle multi-page
      const pageH = pdf.internal.pageSize.getHeight();
      if (imgH <= pageH) {
        pdf.addImage(imgData, "PNG", 0, 0, pdfW, imgH);
      } else {
        let y = 0;
        while (y < imgH) {
          if (y > 0) pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, -y, pdfW, imgH);
          y += pageH;
        }
      }
      const date = new Date().toISOString().split("T")[0];
      pdf.save(`MeuMapa_${date}.pdf`);
    } catch (e) {
      console.error("PDF generation failed:", e);
    }
    setGenerating(false);
  };

  const labelStyle = {
    fontFamily: "'DM Mono', monospace",
    fontSize: 9,
    letterSpacing: "0.2em",
    color: "#C4622D",
    display: "block" as const,
    marginBottom: 16,
  };

  const sectionDivider = <div style={{ height: 1, background: "rgba(26,21,32,0.06)", margin: "32px 0" }} />;

  const actionButtons = (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
      <button
        onClick={handleDownloadPDF}
        disabled={generating}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "transparent", border: "1px solid #C4622D", borderRadius: 8,
          padding: "8px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: 13,
          color: "#C4622D", cursor: generating ? "wait" : "pointer",
        }}
      >
        <Download size={16} />
        {generating ? "Gerando..." : "Baixar como PDF"}
      </button>
    </div>
  );

  return (
    <>
      {generating && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: "rgba(26,21,32,0.8)" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "white" }}>Gerando seu mapa...</p>
        </div>
      )}

      <div
        ref={mapRef}
        id="personal-map"
        style={{
          width: "100%",
          background: "white",
          borderRadius: 12,
          border: "1px solid rgba(26,21,32,0.08)",
          boxShadow: "0 4px 24px rgba(26,21,32,0.08)",
          padding: isMobile ? "24px 20px" : "40px 32px",
          margin: "48px 0",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "#1A1520", margin: 0 }}>
              Meu Mapa Pessoal
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#8A7A70", marginTop: 4 }}>
              Gerado em {dateStr}
            </p>
          </div>
          {!isMobile && actionButtons}
        </div>

        <div style={{ height: 1, background: "rgba(26,21,32,0.08)", margin: "24px 0" }} />

        {/* Section 1: Journey Start */}
        <span style={labelStyle}>JORNADA · INÍCIO</span>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#6A5A55", marginBottom: 12 }}>
          O que você mais quer entender sobre o que sente no seu corpo?
        </p>
        {introQuestion ? (
          <div style={{ background: "rgba(0,188,212,0.05)", borderLeft: "2px solid #00BCD4", borderRadius: "0 8px 8px 0", padding: "14px 18px" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: "italic", fontSize: 15, color: "#2A2035", lineHeight: 1.7, margin: 0 }}>
              {introQuestion}
            </p>
          </div>
        ) : (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: "italic", fontSize: 14, color: "#B0A090" }}>
            Você pulou o Contrato de Leitura.
          </p>
        )}

        {sectionDivider}

        {/* Section 2: Dominant Pattern */}
        <span style={labelStyle}>PADRÃO IDENTIFICADO</span>
        {patternInfo ? (
          <>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#1A1520", marginBottom: 8 }}>
              {patternInfo.name}
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#6A5A55", lineHeight: 1.7, marginBottom: 16 }}>
              {patternInfo.description}
            </p>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#8A7A70", display: "block", marginBottom: 8 }}>
              INTENSIDADE
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 6, background: "#D4C9BF", borderRadius: 3, position: "relative" as const }}>
                <div style={{ width: `${dominantScore}%`, height: 6, background: "#C4622D", borderRadius: 3, transition: "width 1s ease" }} />
              </div>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#C4622D" }}>{dominantScore}%</span>
            </div>
            <div style={{ marginTop: 20 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#8A7A70", display: "block", marginBottom: 12 }}>
                SINTOMAS ASSOCIADOS
              </span>
              {patternInfo.symptoms.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 4, height: 4, background: "#C4622D", borderRadius: "50%", flexShrink: 0 }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6A5A55" }}>{s}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: "italic", fontSize: 14, color: "#B0A090" }}>
            Você não identificou um padrão dominante.
          </p>
        )}

        {/* Section 3: Other Patterns */}
        {otherPatterns.length > 0 && (
          <>
            {sectionDivider}
            <span style={labelStyle}>OUTROS PADRÕES IDENTIFICADOS</span>
            {otherPatterns.map(([key, score]) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(26,21,32,0.06)" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#2A2035" }}>
                  {PATTERNS[key]?.name || key}
                </span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#8A7A70" }}>{score}%</span>
              </div>
            ))}
          </>
        )}

        {sectionDivider}

        {/* Section 4: Highlights */}
        <span style={labelStyle}>TRECHOS QUE VOCÊ DESTACOU</span>
        {cyanHighlights.length > 0 ? (
          <>
            {cyanHighlights.map((h, i) => (
              <div key={i} style={{ background: "rgba(0,188,212,0.05)", borderLeft: "2px solid #00BCD4", borderRadius: "0 8px 8px 0", padding: "12px 16px", marginBottom: 12 }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#2A2035", lineHeight: 1.7, margin: 0 }}>{h.text}</p>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#B0A090" }}>Capítulo {h.chapterId}</span>
              </div>
            ))}
            {allHighlights.filter((h) => h.color === "cyan").length > 10 && (
              <button onClick={onOpenMarkings} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#00BCD4", background: "none", border: "none", cursor: "pointer" }}>
                Ver todos os destaques →
              </button>
            )}
          </>
        ) : (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: "italic", fontSize: 14, color: "#B0A090" }}>
            Você não salvou nenhum trecho como resumo.
          </p>
        )}

        {sectionDivider}

        {/* Section 5: Calendar */}
        <span style={labelStyle}>APLICAÇÃO · 4 SEMANAS</span>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { value: `${completedDays}/28`, label: "dias praticados", color: "#00BCD4" },
            { value: `${streak}`, label: "sequência atual", color: "#C4622D" },
            { value: `${totalProgress}%`, label: "progresso total", color: "#6A5A55" },
          ].map((card, i) => (
            <div key={i} style={{ background: `${card.color}0D`, borderRadius: 8, padding: 16, textAlign: "center" as const }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 32, color: card.color, lineHeight: 1, marginBottom: 4 }}>
                {card.value}
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#8A7A70" }}>{card.label}</div>
            </div>
          ))}
        </div>
        {/* Mini calendar grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 20px)", gap: 2, justifyContent: "center" }}>
          {calendarProgress.weeks.flat().map((done, i) => (
            <div key={i} style={{ width: 20, height: 20, borderRadius: 3, background: done ? "#C4622D" : "#D4C9BF" }} title={`Semana ${Math.floor(i / 7) + 1}, Dia ${(i % 7) + 1}`} />
          ))}
        </div>

        {/* Section 6: Recommended Dynamic */}
        {dynamicInfo && (
          <>
            {sectionDivider}
            <span style={labelStyle}>FERRAMENTA · MODO CRISE</span>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#2A2035", lineHeight: 1.7, marginBottom: 16 }}>
              Com base no padrão identificado ({patternInfo?.name}), a dinâmica mais efetiva para você é:
            </p>
            <h4 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "#1A1520", marginBottom: 8 }}>
              {dynamicInfo.name}
            </h4>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6A5A55", lineHeight: 1.7, marginBottom: 16 }}>
              {dynamicInfo.desc}
            </p>
            <button
              style={{
                background: "transparent", border: "1px solid #00BCD4", borderRadius: 8,
                padding: "10px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                fontWeight: 500, color: "#00BCD4", cursor: "pointer",
              }}
            >
              Experimentar agora →
            </button>
          </>
        )}

        {sectionDivider}

        {/* Section 7: Journey Conclusion */}
        <span style={labelStyle}>JORNADA · CONCLUSÃO</span>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#6A5A55", marginBottom: 12 }}>
          Como você responderia a pergunta inicial agora?
        </p>
        {conclusionReflection ? (
          <div style={{ background: "rgba(196,98,45,0.05)", borderLeft: "2px solid #C4622D", borderRadius: "0 8px 8px 0", padding: "14px 18px" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: "italic", fontSize: 15, color: "#2A2035", lineHeight: 1.7, margin: 0 }}>
              {conclusionReflection}
            </p>
          </div>
        ) : (
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: "italic", fontSize: 14, color: "#B0A090", marginBottom: 8 }}>
              Você ainda não finalizou sua reflexão.
            </p>
            <button onClick={onScrollToMirror} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#00BCD4", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
              Ir para a reflexão →
            </button>
          </div>
        )}

        {/* Mobile footer buttons */}
        {isMobile && (
          <div style={{ marginTop: 32, borderTop: "1px solid rgba(26,21,32,0.08)", paddingTop: 24 }}>
            {actionButtons}
          </div>
        )}
      </div>
    </>
  );
};

export default PersonalMap;
