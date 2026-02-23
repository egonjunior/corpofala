import { ReactNode, forwardRef, useEffect, useRef, useState, useCallback } from "react";
import { ReaderChapter, estimateReadingTime } from "@/data/readerContent";
import { Clock } from "lucide-react";

import { Highlight } from "@/hooks/useHighlights";

interface ReaderContentProps {
  chapter: ReaderChapter;
  darkMode: boolean;
  focusMode: boolean;
  activeParagraphIndex: number | null;
  onParagraphClick: (index: number) => void;
  chapterHighlights: Highlight[];
  children?: ReactNode;
  renderParagraph?: (text: string, index: number, type?: string) => ReactNode;
  renderAfter?: (index: number) => ReactNode | null;
}

/* ── Scroll-reveal wrapper ────────────────────────────── */
const RevealOnScroll = ({ children, delay = 0 }: { children: ReactNode; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};

const ReaderContent = forwardRef<HTMLDivElement, ReaderContentProps>(
  ({ chapter, darkMode, focusMode, activeParagraphIndex, onParagraphClick, chapterHighlights, lastStoppedParagraph, renderAfter }, ref) => {
    const readingTime = estimateReadingTime(chapter);
    const bg = focusMode ? "#F8F5F0" : darkMode ? "#1A1520" : "#F2EDE4";
    const textColor = darkMode ? "rgba(255,255,255,0.75)" : "#2A2035";
    const titleColor = darkMode ? "rgba(255,255,255,0.9)" : "#1A1520";
    const subtitleColor = darkMode ? "rgba(255,255,255,0.6)" : "#3A2A35";
    const mutedColor = darkMode ? "rgba(255,255,255,0.3)" : "#B0A090";
    const fontSize = darkMode ? 18 : 17;

    // Custom paragraph render with "stopped here" marker and "block selection" logic
    const renderParagraph = (text: string, index: number, type?: string) => {
      const isStoppedHere = lastStoppedParagraph === index;
      const isActive = activeParagraphIndex === index;
      const highlight = chapterHighlights.find(h => h.paragraphIndex === index);

      const titleColor = darkMode ? "rgba(255,255,255,0.9)" : "#1A1520";
      const subtitleColor = darkMode ? "rgba(255,255,255,0.6)" : "#3A2A35";
      const textColor = darkMode ? "rgba(255,255,255,0.75)" : "#2A2035";
      const fontSize = darkMode ? 18 : 17;

      let bgStyle = "transparent";
      let borderStyle = "none";
      let cursorStyle = "pointer";

      if (isActive) {
        bgStyle = darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
        borderStyle = `1px dashed ${darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}`;
      } else if (highlight) {
        const colors = { yellow: "#F5D54730", red: "#C4622D25", cyan: "#00BCD420" };
        bgStyle = colors[highlight.color];
      }

      const wrapper = (children: React.ReactNode) => (
        <div
          style={{ position: "relative" }}
          onClick={(e) => {
            e.stopPropagation();
            onParagraphClick(index);
          }}
          data-paragraph-index={index}
          className="transition-colors duration-200"
        >
          {isStoppedHere && (
            <div
              style={{
                position: "absolute",
                left: -16,
                top: 0,
                bottom: 0,
                width: 2,
                background: "rgba(196,98,45,0.4)",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: -16,
                  left: 6,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  color: "rgba(196,98,45,0.6)",
                  whiteSpace: "nowrap",
                }}
              >
                você parou aqui
              </span>
            </div>
          )}
          <div
            style={{
              background: bgStyle,
              border: borderStyle,
              borderRadius: 6,
              padding: isActive || highlight ? "8px 12px" : "0 8px",
              margin: isActive || highlight ? "-8px -12px" : "0",
              cursor: cursorStyle,
            }}
          >
            {children}
          </div>
        </div>
      );

      if (type === "heading") {
        return wrapper(
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 24,
              color: titleColor,
              marginTop: 40,
              marginBottom: 16,
              lineHeight: 1.3,
              transition: "color 0.4s ease",
            }}
          >
            {text}
          </h2>
        );
      }

      if (type === "subheading") {
        return wrapper(
          <h3
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontStyle: "italic",
              fontSize: 20,
              color: subtitleColor,
              marginTop: 32,
              marginBottom: 12,
              transition: "color 0.4s ease",
            }}
          >
            {text}
          </h3>
        );
      }

      return wrapper(
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize,
            lineHeight: 1.85,
            color: textColor,
            marginBottom: 24,
            transition: "color 0.4s ease, font-size 0.4s ease",
          }}
        >
          {text}
        </p>
      );
    };

    return (
      <div
        ref={ref}
        style={{
          background: bg,
          minHeight: "100vh",
          transition: "background 0.4s ease, color 0.4s ease",
        }}
      >
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            padding: "48px 24px 120px",
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 32,
              color: titleColor,
              lineHeight: 1.2,
              marginBottom: 8,
              transition: "color 0.4s ease",
              letterSpacing: "-0.01em",
            }}
          >
            {chapter.title}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontStyle: "italic",
              fontSize: 20,
              color: subtitleColor,
              marginBottom: 16,
              transition: "color 0.4s ease",
            }}
          >
            {chapter.subtitle}
          </p>

          {/* Apple-style decorative line */}
          <div
            style={{
              width: 32,
              height: 2,
              background: "#C4622D",
              borderRadius: 1,
              marginBottom: 16,
              opacity: 0.6,
            }}
          />

          {/* Reading time */}
          <div
            className="flex items-center gap-2"
            style={{ marginBottom: 40, color: mutedColor }}
          >
            <Clock size={14} />
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
              }}
            >
              Leitura: ~{readingTime} min
            </span>
          </div>

          {/* Paragraphs with scroll-reveal */}
          {chapter.paragraphs.map((para, idx) => (
            <RevealOnScroll key={idx}>
              {para.type === "divider" ? (
                <div
                  style={{
                    margin: "40px auto",
                    width: 60,
                    height: 1,
                    background: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                  }}
                />
              ) : renderParagraph && para.type !== "quote" && para.type !== "list-item" && para.type !== "reference-title" && para.type !== "reference-text" ? (
                renderParagraph(para.text, idx, para.type)
              ) : para.type === "heading" ? (
                <h2
                  data-paragraph-index={idx}
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 24,
                    color: titleColor,
                    marginTop: 40,
                    marginBottom: 16,
                    lineHeight: 1.3,
                    transition: "color 0.4s ease",
                  }}
                >
                  {para.text}
                </h2>
              ) : para.type === "subheading" ? (
                <h3
                  data-paragraph-index={idx}
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontStyle: "italic",
                    fontSize: 20,
                    color: subtitleColor,
                    marginTop: 32,
                    marginBottom: 12,
                    transition: "color 0.4s ease",
                  }}
                >
                  {para.text}
                </h3>
              ) : para.type === "quote" ? (
                <blockquote
                  data-paragraph-index={idx}
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontStyle: "italic",
                    fontSize: 20,
                    lineHeight: 1.6,
                    color: darkMode ? "rgba(196,98,45,0.9)" : "#C4622D",
                    borderLeft: `3px solid ${darkMode ? "rgba(196,98,45,0.4)" : "rgba(196,98,45,0.3)"}`,
                    paddingLeft: 20,
                    margin: "32px 0",
                    transition: "color 0.4s ease",
                  }}
                >
                  {para.text}
                </blockquote>
              ) : para.type === "list-item" ? (
                <p
                  data-paragraph-index={idx}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 300,
                    fontSize,
                    lineHeight: 1.85,
                    color: textColor,
                    marginBottom: 8,
                    paddingLeft: 16,
                    transition: "color 0.4s ease",
                  }}
                >
                  {para.text}
                </p>
              ) : para.type === "reference-title" ? (
                <div
                  data-paragraph-index={idx}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    color: darkMode ? "rgba(82,182,154,0.8)" : "#52B69A",
                    marginTop: 28,
                    marginBottom: 8,
                    textTransform: "uppercase" as const,
                    transition: "color 0.4s ease",
                  }}
                >
                  📎 {para.text}
                </div>
              ) : para.type === "reference-text" ? (
                <div
                  data-paragraph-index={idx}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: darkMode ? "rgba(255,255,255,0.6)" : "rgba(42,32,53,0.7)",
                    background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                    borderRadius: 8,
                    padding: "16px 20px",
                    marginBottom: 24,
                    border: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                    transition: "all 0.4s ease",
                  }}
                >
                  {para.text}
                </div>
              ) : (
                <p
                  data-paragraph-index={idx}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 300,
                    fontSize,
                    lineHeight: 1.85,
                    color: textColor,
                    marginBottom: 24,
                    transition: "color 0.4s ease, font-size 0.4s ease",
                  }}
                >
                  {para.text}
                </p>
              )}
              {renderAfter?.(idx)}
            </RevealOnScroll>
          ))}
        </div>
      </div>
    );
  }
);

ReaderContent.displayName = "ReaderContent";

export default ReaderContent;
