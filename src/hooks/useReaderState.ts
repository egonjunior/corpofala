import { useState, useCallback, useEffect } from "react";

export interface EbookProgress {
  currentChapter: number;
  chapterProgress: Record<string, number>;
  lastPosition: {
    chapterId: string;
    scrollY: number;
    paragraphIndex: number;
    timestamp: string;
  } | null;
  totalProgress: number;
}

export interface PatternScores {
  pattern1: number;
  pattern2: number;
  pattern3: number;
  pattern4: number;
  pattern5: number;
}

export interface CalendarProgress {
  weeks: boolean[][];
}

const defaultCalendar: CalendarProgress = {
  weeks: [
    Array(7).fill(false),
    Array(7).fill(false),
    Array(7).fill(false),
    Array(7).fill(false),
  ],
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

const defaultProgress: EbookProgress = {
  currentChapter: 1,
  chapterProgress: {},
  lastPosition: null,
  totalProgress: 0,
};

export function useReaderState() {
  const [progress, setProgress] = useState<EbookProgress>(() => load("ebookProgress", defaultProgress));
  const [focusMode, setFocusMode] = useState(() => load("focusMode", false));
  const [darkMode, setDarkMode] = useState(() => load("darkMode", false));
  const [introContractDone, setIntroContractDone] = useState(() => load("introContractDone", false));
  const [chapter1FixationDone, setChapter1FixationDone] = useState(() => load("chapter1FixationDone", false));
  const [patternScores, setPatternScores] = useState<PatternScores>(() =>
    load("patternScores", { pattern1: 0, pattern2: 0, pattern3: 0, pattern4: 0, pattern5: 0 })
  );
  const [dominantPattern, setDominantPattern] = useState<string | null>(() => load("dominantPattern", null));
  const [introQuestion, setIntroQuestion] = useState<string | null>(() => load("introQuestion", null));
  const [calendarProgress, setCalendarProgress] = useState<CalendarProgress>(() => load("calendarProgress", defaultCalendar));
  const [conclusionReflection, setConclusionReflection] = useState<string | null>(() => load("conclusionReflection", null));
  const [reflectionSavedAt, setReflectionSavedAt] = useState<string | null>(() => load("reflectionSavedAt", null));
  const [finalMessage, setFinalMessage] = useState<string | null>(() => load("finalMessage", null));
  const [finalMessageSentAt, setFinalMessageSentAt] = useState<string | null>(() => load("finalMessageSentAt", null));

  // Persist all state changes
  useEffect(() => { save("ebookProgress", progress); }, [progress]);
  useEffect(() => { save("focusMode", focusMode); }, [focusMode]);
  useEffect(() => { save("darkMode", darkMode); }, [darkMode]);
  useEffect(() => { save("introContractDone", introContractDone); }, [introContractDone]);
  useEffect(() => { save("chapter1FixationDone", chapter1FixationDone); }, [chapter1FixationDone]);
  useEffect(() => { save("patternScores", patternScores); }, [patternScores]);
  useEffect(() => { save("dominantPattern", dominantPattern); }, [dominantPattern]);
  useEffect(() => { save("introQuestion", introQuestion); }, [introQuestion]);
  useEffect(() => { save("calendarProgress", calendarProgress); }, [calendarProgress]);
  useEffect(() => { save("conclusionReflection", conclusionReflection); }, [conclusionReflection]);
  useEffect(() => { save("reflectionSavedAt", reflectionSavedAt); }, [reflectionSavedAt]);
  useEffect(() => { save("finalMessage", finalMessage); }, [finalMessage]);
  useEffect(() => { save("finalMessageSentAt", finalMessageSentAt); }, [finalMessageSentAt]);

  const toggleFocus = useCallback(() => setFocusMode((p) => !p), []);
  const toggleDark = useCallback(() => setDarkMode((p) => !p), []);

  const updateChapterProgress = useCallback((chapterId: string, pct: number) => {
    setProgress((prev) => {
      const cp = { ...prev.chapterProgress, [chapterId]: Math.max(prev.chapterProgress[chapterId] || 0, pct) };
      const vals = Object.values(cp);
      const total = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / 8) : 0;
      return { ...prev, chapterProgress: cp, totalProgress: total };
    });
  }, []);

  const updateLastPosition = useCallback(
    (chapterId: string, scrollY: number, paragraphIndex: number) => {
      setProgress((prev) => ({
        ...prev,
        lastPosition: { chapterId, scrollY, paragraphIndex, timestamp: new Date().toISOString() },
      }));
    },
    []
  );

  const updatePatternScore = useCallback((key: keyof PatternScores, value: number) => {
    setPatternScores((prev) => ({ ...prev, [key]: value }));
  }, []);

  const completeIntroContract = useCallback((answer: string) => {
    setIntroQuestion(answer);
    setIntroContractDone(true);
  }, []);

  const completeFixation = useCallback(() => {
    setChapter1FixationDone(true);
  }, []);

  const revealDominantPattern = useCallback(() => {
    const scores = Object.entries(patternScores) as [string, number][];
    scores.sort((a, b) => b[1] - a[1]);
    const top = scores[0];
    if (top[1] > 0) {
      setDominantPattern(top[0]);
    }
  }, [patternScores]);

  const toggleCalendarDay = useCallback((week: number, day: number) => {
    setCalendarProgress((prev) => {
      const newWeeks = prev.weeks.map((w, wi) =>
        wi === week ? w.map((d, di) => (di === day ? !d : d)) : [...w]
      );
      return { weeks: newWeeks };
    });
  }, []);

  const resetCalendar = useCallback(() => {
    setCalendarProgress(defaultCalendar);
  }, []);

  const saveConclusionReflection = useCallback((text: string) => {
    setConclusionReflection(text);
    setReflectionSavedAt(new Date().toISOString());
  }, []);

  const saveFinalMessage = useCallback((text: string) => {
    setFinalMessage(text);
    setFinalMessageSentAt(new Date().toISOString());
  }, []);

  return {
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
    setDominantPattern,
    toggleCalendarDay,
    resetCalendar,
    saveConclusionReflection,
    saveFinalMessage,
  };
}
