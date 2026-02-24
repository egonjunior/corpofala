import { useParams, useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect, useRef } from "react";
import { readerChapters, PATTERN_NAMES } from "@/data/readerContent";
import { useReaderState } from "@/hooks/useReaderState";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import { useReadingPosition } from "@/hooks/useReadingPosition";
import { useHighlights } from "@/hooks/useHighlights";
import ReaderHeader from "@/components/reader/ReaderHeader";
import ReaderProgressBar from "@/components/reader/ReaderProgressBar";
import ReaderNavBar from "@/components/reader/ReaderNavBar";
import ReaderContent from "@/components/reader/ReaderContent";
import ResumeBanner from "@/components/reader/ResumeBanner";
import HighlightToolbar from "@/components/reader/HighlightToolbar";
import MarkingsPanel from "@/components/reader/MarkingsPanel";
import ReadingContract from "@/components/reader/ReadingContract";
import IntegrationPause from "@/components/reader/IntegrationPause";
import FixationTest from "@/components/reader/FixationTest";
import PatternSlider from "@/components/reader/PatternSlider";
import PatternReveal from "@/components/reader/PatternReveal";
import CrisisButton from "@/components/app/CrisisButton";
import SignalPathViz from "@/components/reader/viz/SignalPathViz";
import CircuitFormationViz from "@/components/reader/viz/CircuitFormationViz";
import RecurrenceCycleViz from "@/components/reader/viz/RecurrenceCycleViz";
import PersonalizedProtocolBox from "@/components/reader/protocol/PersonalizedProtocolBox";
import WeeklyCalendar from "@/components/reader/calendar/WeeklyCalendar";
import GuidedPracticeInvite from "@/components/reader/calendar/GuidedPracticeInvite";
import MirrorCard from "@/components/reader/conclusion/MirrorCard";
import PersonalMap from "@/components/reader/conclusion/PersonalMap";
import FinalMessage from "@/components/reader/conclusion/FinalMessage";
import ShareSnippetModal from "@/components/reader/ShareSnippetModal";
import MapNotReadyModal from "@/components/reader/MapNotReadyModal";

const AppEbookReader = () => {
  const { parte } = useParams<{ parte: string }>();
  const navigate = useNavigate();
  const slug = parte || "intro";
  const chapter = readerChapters.find((c) => c.slug === slug);

  const {
    progress,
    focusMode,
    darkMode,
    introContractDone,
    chapter1FixationDone,
    patternScores,
    dominantPattern,
    introQuestion,
    calendarProgress,
    conclusionReflection,
    reflectionSavedAt,
    finalMessage,
    finalMessageSentAt,
    toggleFocus,
    toggleDark,
    updateChapterProgress,
    updateLastPosition,
    updatePatternScore,
    completeIntroContract,
    completeFixation,
    revealDominantPattern,
    toggleCalendarDay,
    resetCalendar,
    saveConclusionReflection,
    saveFinalMessage,
  } = useReaderState();

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number | null>(null);
  const [markingsOpen, setMarkingsOpen] = useState(false);
  const [completedSliders, setCompletedSliders] = useState<Set<string>>(new Set());
  const [shareText, setShareText] = useState<string | null>(null);
  const [mapNotReadyOpen, setMapNotReadyOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);

  // Auto-hide header on scroll down
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeaderVisibility = () => {
      const currentScrollY = window.scrollY;

      // If scrolling up or very close to top, show header
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setHeaderVisible(true);
      }
      // If scrolling down, hide header
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHeaderVisible(false);
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeaderVisibility);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { contentRef } = useReadingProgress({
    onProgress: useCallback(
      (pct: number) => {
        setScrollProgress(pct);
        updateChapterProgress(slug, pct);
      },
      [slug, updateChapterProgress]
    ),
    onParagraph: useCallback((idx: number) => setCurrentParagraph(idx), []),
  });

  useReadingPosition({
    chapterId: slug,
    onSave: updateLastPosition,
    currentParagraph,
  });

  const {
    highlights: chapterHighlights,
    allHighlights,
    summaries,
    notes,
    addHighlight,
    removeHighlight,
  } = useHighlights(slug);

  // Focus mode: exit on ESC or click outside
  useEffect(() => {
    if (!focusMode) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggleFocus();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [focusMode, toggleFocus]);

  // Show resume banner?
  const showResumeBanner =
    progress.lastPosition &&
    progress.lastPosition.chapterId !== slug &&
    (progress.chapterProgress[progress.lastPosition.chapterId] || 0) < 100;

  const handleResume = () => {
    if (progress.lastPosition) {
      navigate(`/app/ebook/${progress.lastPosition.chapterId}`);
    }
  };

  const handleHighlight = (color: "yellow" | "red" | "cyan") => {
    if (activeParagraphIndex === null || !chapter) return;
    const text = chapter.paragraphs[activeParagraphIndex]?.text;
    if (!text) return;

    addHighlight({ paragraphIndex: activeParagraphIndex, text, color, note: null });
    setActiveParagraphIndex(null);
  };

  const handleNote = (noteText: string) => {
    if (activeParagraphIndex === null || !chapter) return;
    const text = chapter.paragraphs[activeParagraphIndex]?.text;
    if (!text || !noteText.trim()) return;

    addHighlight({ paragraphIndex: activeParagraphIndex, text, color: "cyan", note: noteText });
    setActiveParagraphIndex(null);
  };

  const handleRemoveHighlight = () => {
    if (activeParagraphIndex !== null) {
      const highlight = chapterHighlights.find(h => h.paragraphIndex === activeParagraphIndex);
      if (highlight) {
        removeHighlight(highlight.id);
      }
      setActiveParagraphIndex(null);
    }
  };

  const handleNavigateToHighlight = (h: { chapterId: string; paragraphIndex: number }) => {
    if (h.chapterId !== slug) {
      navigate(`/app/ebook/${h.chapterId}`);
    }
    setTimeout(() => {
      const el = document.querySelector(`[data-paragraph-index="${h.paragraphIndex}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  // Pattern slider tracking
  const handlePatternSave = (key: string, value: number) => {
    updatePatternScore(key as any, value);
    setCompletedSliders((prev) => new Set([...prev, key]));
  };

  const allSlidersCompleted =
    completedSliders.size >= 5 ||
    Object.values(patternScores).every((v) => v > 0);

  if (!chapter) {
    return (
      <div style={{ background: "#F2EDE4", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#8A7A70" }}>Capítulo não encontrado.</p>
      </div>
    );
  }

  // Grain overlay
  const grainOpacity = darkMode ? 0.03 : 0.02;

  // Determine "last stopped here" paragraph
  const lastStoppedParagraph =
    progress.lastPosition?.chapterId === slug ? progress.lastPosition.paragraphIndex : null;

  // Render interactions between paragraphs
  const renderAfter = (paragraphIndex: number) => {
    const interactions: React.ReactNode[] = [];

    // Integration pause for parte-1
    if (slug === "parte-1" && chapter.interactionAfter?.[paragraphIndex] === "pause") {
      interactions.push(
        <IntegrationPause
          key="pause"
          darkMode={darkMode}
          onContinue={() => {
            const next = document.querySelector(`[data-paragraph-index="${paragraphIndex + 1}"]`);
            next?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />
      );
    }

    // Fixation test for parte-1 end
    if (slug === "parte-1" && chapter.interactionAfter?.[paragraphIndex] === "fixation") {
      interactions.push(
        <FixationTest key="fixation" done={chapter1FixationDone} onComplete={completeFixation} darkMode={darkMode} />
      );
    }

    // === VISUALIZATION A: Signal Path (Parte 1) ===
    if (slug === "parte-1") {
      const signalAnchorIdx = chapter.paragraphs.findIndex(p =>
        p.text.includes("Pensamentos") && p.text.includes("Emoções") && p.text.includes("Química corporal")
      );
      if (signalAnchorIdx >= 0 && paragraphIndex === signalAnchorIdx) {
        interactions.push(<SignalPathViz key="signal-path" darkMode={darkMode} />);
      }
    }

    // === VISUALIZATION B: Circuit Formation (Parte 3) ===
    if (slug === "parte-3") {
      const circuitAnchorIdx = chapter.paragraphs.findIndex(p =>
        p.text.includes("estradas pavimentadas") && p.text.includes("anos de repetição")
      );
      if (circuitAnchorIdx >= 0 && paragraphIndex === circuitAnchorIdx) {
        interactions.push(<CircuitFormationViz key="circuit-formation" darkMode={darkMode} />);
      }
    }

    // === VISUALIZATION C: Recurrence Cycle (Parte 4) ===
    if (slug === "parte-4") {
      const recurrenceAnchorIdx = chapter.paragraphs.findIndex(p =>
        p.text.includes("Não perdoar é como beber veneno")
      );
      if (recurrenceAnchorIdx >= 0 && paragraphIndex === recurrenceAnchorIdx) {
        interactions.push(<RecurrenceCycleViz key="recurrence-cycle" darkMode={darkMode} />);
      }
    }

    // Pattern sliders for parte-2
    if (slug === "parte-2" && chapter.patternSliders) {
      const patternKeys = ["pattern1", "pattern2", "pattern3", "pattern4", "pattern5"];
      const patternTitles = [
        '2.1 PADRÃO 1: "DOENÇA = ATENÇÃO"',
        '2.2 PADRÃO 2: "RAIVA ENGOLIDA"',
        '2.3 PADRÃO 3: "HIPERCONTROLE"',
        '2.4 PADRÃO 4: "MEDO E TRAUMA NÃO PROCESSADO"',
        '2.5 PADRÃO 5: "AUTOSSABOTAGEM"',
      ];

      for (let i = 0; i < patternTitles.length; i++) {
        const patternHeadingIdx = chapter.paragraphs.findIndex(p => p.text === patternTitles[i]);
        if (patternHeadingIdx < 0) continue;

        let endIdx = -1;
        for (let j = patternHeadingIdx + 1; j < chapter.paragraphs.length; j++) {
          if (chapter.paragraphs[j].type === "divider") {
            endIdx = j - 1;
            break;
          }
        }
        if (endIdx < 0) endIdx = chapter.paragraphs.length - 1;

        if (paragraphIndex === endIdx) {
          const key = patternKeys[i];
          interactions.push(
            <PatternSlider
              key={key}
              patternKey={key}
              patternIndex={i + 1}
              initialValue={patternScores[key as keyof typeof patternScores]}
              onSave={(val) => handlePatternSave(key, val)}
              darkMode={darkMode}
            />
          );
        }
      }

      if (paragraphIndex === chapter.paragraphs.length - 1 && chapter.patternReveal) {
        interactions.push(
          <PatternReveal
            key="reveal"
            patternScores={patternScores}
            onReveal={revealDominantPattern}
            darkMode={darkMode}
            allSlidersCompleted={allSlidersCompleted}
          />
        );
      }
    }

    // === PERSONALIZED PROTOCOL + CALENDAR (Parte 5) ===
    if (slug === "parte-5" && dominantPattern) {
      const sectionHeadings = [
        { anchor: "5.1 Suplementos", stepKey: "step1" },
        { anchor: "5.2 Dieta Anti-Inflamatória", stepKey: "step2" },
        { anchor: "5.3 Exercício Como Medicina", stepKey: "step3" },
        { anchor: "5.4 Sono Reparador", stepKey: "step4" },
        { anchor: "5.5 Respiração Como Ferramenta", stepKey: "step5" },
      ];

      for (const { anchor, stepKey } of sectionHeadings) {
        const headingIdx = chapter.paragraphs.findIndex(p => p.text.includes(anchor));
        if (headingIdx < 0) continue;

        // Find the divider after this section
        let sectionEndIdx = -1;
        for (let j = headingIdx + 1; j < chapter.paragraphs.length; j++) {
          if (chapter.paragraphs[j].type === "divider") {
            sectionEndIdx = j - 1;
            break;
          }
        }
        if (sectionEndIdx < 0) sectionEndIdx = chapter.paragraphs.length - 1;

        if (paragraphIndex === sectionEndIdx) {
          interactions.push(
            <PersonalizedProtocolBox
              key={`protocol-${stepKey}`}
              dominantPattern={dominantPattern}
              stepKey={stepKey}
              darkMode={darkMode}
            />
          );
        }
      }
    }

    // Calendar at end of parte-5
    if (slug === "parte-5" && paragraphIndex === chapter.paragraphs.length - 1) {
      interactions.push(
        <WeeklyCalendar
          key="calendar"
          progress={calendarProgress}
          onToggleDay={toggleCalendarDay}
          onReset={resetCalendar}
          darkMode={darkMode}
        />
      );
      interactions.push(
        <GuidedPracticeInvite
          key="guided-practice"
          dominantPattern={dominantPattern}
          darkMode={darkMode}
        />
      );
    }

    // === CONCLUSION: Mirror + Map + Final Message ===
    if (slug === "conclusao") {
      const mirrorAnchorIdx = chapter.paragraphs.findIndex(p =>
        p.text.includes("A jornada continua")
      );
      if (mirrorAnchorIdx >= 0 && paragraphIndex === mirrorAnchorIdx - 1) {
        interactions.push(
          <MirrorCard
            key="mirror"
            introQuestion={introQuestion}
            conclusionReflection={conclusionReflection}
            reflectionSavedAt={reflectionSavedAt}
            onSaveReflection={saveConclusionReflection}
            darkMode={darkMode}
          />
        );
        interactions.push(
          <PersonalMap
            key="personal-map"
            introQuestion={introQuestion}
            dominantPattern={dominantPattern}
            patternScores={patternScores}
            calendarProgress={calendarProgress}
            allHighlights={allHighlights}
            conclusionReflection={conclusionReflection}
            onOpenMarkings={() => setMarkingsOpen(true)}
            onScrollToMirror={() => {
              const mirrorEl = document.querySelector("[data-mirror-card]");
              mirrorEl?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
            darkMode={darkMode}
          />
        );
      }

      if (paragraphIndex === chapter.paragraphs.length - 1) {
        interactions.push(
          <FinalMessage
            key="final-message"
            finalMessage={finalMessage}
            finalMessageSentAt={finalMessageSentAt}
            onSendMessage={saveFinalMessage}
            darkMode={darkMode}
          />
        );
      }
    }

    return interactions.length > 0 ? <>{interactions}</> : null;
  };

  // Custom paragraph render with "stopped here" marker
  const renderParagraph = (text: string, index: number, type?: string) => {
    const isStoppedHere = lastStoppedParagraph === index;
    const titleColor = darkMode ? "rgba(255,255,255,0.9)" : "#1A1520";
    const subtitleColor = darkMode ? "rgba(255,255,255,0.6)" : "#3A2A35";
    const textColor = darkMode ? "rgba(255,255,255,0.75)" : "#2A2035";
    const fontSize = darkMode ? 18 : 17;

    const wrapper = (children: React.ReactNode) => (
      <div style={{ position: "relative" }}>
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
        {children}
      </div>
    );

    if (type === "heading") {
      return wrapper(
        <h2
          data-paragraph-index={index}
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
          data-paragraph-index={index}
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
        data-paragraph-index={index}
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
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[60]"
        style={{
          opacity: grainOpacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <ReaderHeader
        chapterTitle={chapter.title}
        focusMode={focusMode}
        darkMode={darkMode}
        isVisible={headerVisible}
        onToggleFocus={toggleFocus}
        onToggleDark={toggleDark}
        onOpenMarkings={() => setMarkingsOpen(true)}
        onOpenMap={() => {
          if (slug === "conclusao") {
            const el = document.getElementById("personal-map");
            el?.scrollIntoView({ behavior: "smooth", block: "start" });
          } else {
            setMapNotReadyOpen(true);
          }
        }}
      />

      <ReaderProgressBar progress={scrollProgress} darkMode={darkMode} />

      <div style={{ paddingTop: 55 }}>
        {/* Resume banner */}
        {showResumeBanner && progress.lastPosition && (
          <div style={{ padding: "16px 24px 0" }}>
            <ResumeBanner
              chapterTitle={
                readerChapters.find((c) => c.slug === progress.lastPosition!.chapterId)?.title || ""
              }
              progress={progress.chapterProgress[progress.lastPosition.chapterId] || 0}
              onResume={handleResume}
              darkMode={darkMode}
            />
          </div>
        )}

        {/* Reading contract for intro */}
        {slug === "intro" && (
          <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px" }}>
            <ReadingContract done={introContractDone} onComplete={completeIntroContract} darkMode={darkMode} />
          </div>
        )}

        <ReaderContent
          ref={contentRef}
          chapter={chapter}
          darkMode={darkMode}
          focusMode={focusMode}
          activeParagraphIndex={activeParagraphIndex}
          chapterHighlights={chapterHighlights}
          onParagraphClick={(index) => {
            if (activeParagraphIndex === index) setActiveParagraphIndex(null);
            else setActiveParagraphIndex(index);
          }}
          renderParagraph={renderParagraph}
          renderAfter={renderAfter}
        />
      </div>

      <ReaderNavBar currentSlug={slug} focusMode={focusMode} darkMode={darkMode} />

      {/* Highlight toolbar */}
      <HighlightToolbar
        darkMode={darkMode}
        focusMode={focusMode}
        activeParagraphIndex={activeParagraphIndex}
        chapter={chapter}
        chapterHighlights={chapterHighlights}
        onClose={() => setActiveParagraphIndex(null)}
        onHighlight={handleHighlight}
        onNote={handleNote}
        onRemove={handleRemoveHighlight}
        onShare={(text) => setShareText(text)}
      />

      {/* Markings panel */}
      <MarkingsPanel
        open={markingsOpen}
        onClose={() => setMarkingsOpen(false)}
        darkMode={darkMode}
        allHighlights={allHighlights}
        summaries={summaries}
        notes={notes}
        onNavigateToHighlight={handleNavigateToHighlight}
      />

      {/* Crisis button — hidden in focus mode */}
      {!focusMode && <CrisisButton />}

      {/* Share snippet modal */}
      {shareText && (
        <ShareSnippetModal text={shareText} onClose={() => setShareText(null)} />
      )}

      {/* Map not ready modal */}
      {mapNotReadyOpen && (
        <MapNotReadyModal onClose={() => setMapNotReadyOpen(false)} />
      )}
    </div>
  );
};

export default AppEbookReader;
