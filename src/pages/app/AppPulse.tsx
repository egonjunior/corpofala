import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Heart, PenLine, ChevronRight, Flame, Image, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/app/AppLayout";
import PulseCardView from "@/components/pulse/PulseCardView";
import PulseShareCard from "@/components/pulse/PulseShareCard";
import { pulseCards, getShuffledCards, PulseCategory, PULSE_THEMES } from "@/data/pulseCards";
import html2canvas from "html2canvas";

/* ── Persistence ── */
interface PulsoHistory {
  seenCards: string[];
  favorites: string[];
  reflections: { cardId: string; date: string; text: string; quote: string; author: string }[];
  streak: { current: number; longest: number; lastVisit: string; };
}

const STORAGE_KEY = "pulsoHistory";

function loadHistory(): PulsoHistory {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { seenCards: [], favorites: [], reflections: [], streak: { current: 0, longest: 0, lastVisit: "" } };
  } catch { return { seenCards: [], favorites: [], reflections: [], streak: { current: 0, longest: 0, lastVisit: "" } }; }
}

function saveHistory(h: PulsoHistory) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(h));
}

function updateStreak(h: PulsoHistory): PulsoHistory {
  const today = new Date().toISOString().slice(0, 10);
  if (h.streak.lastVisit === today) return h;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const current = h.streak.lastVisit === yesterday ? h.streak.current + 1 : 1;
  return { ...h, streak: { current, longest: Math.max(current, h.streak.longest), lastVisit: today } };
}

/* ── Category chips ── */
const CATEGORIES: { key: PulseCategory | 'todos'; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'corpo', label: 'Corpo' },
  { key: 'mente', label: 'Mente' },
  { key: 'alma', label: 'Alma' },
  { key: 'poder', label: 'Poder' },
  { key: 'relacoes', label: 'Relações' },
  { key: 'presenca', label: 'Presença' },
];

/* ── Animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.08 } }),
};

/* ── Weekday helper ── */
const WEEKDAYS = ['DOMINGO', 'SEGUNDA-FEIRA', 'TERÇA-FEIRA', 'QUARTA-FEIRA', 'QUINTA-FEIRA', 'SEXTA-FEIRA', 'SÁBADO'];
const MONTHS = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];

function getFormattedDate(): string {
  const d = new Date();
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

const AppPulse = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<PulsoHistory>(() => {
    const h = loadHistory();
    const updated = updateStreak(h);
    if (updated !== h) saveHistory(updated);
    return updated;
  });

  const [activeCategory, setActiveCategory] = useState<PulseCategory | 'todos'>('todos');

  // Shuffled deck — new order every session/visit
  const shuffledCards = useMemo(() => getShuffledCards(activeCategory), [activeCategory]);
  const [cardIndex, setCardIndex] = useState(0);

  const currentCard = shuffledCards[cardIndex] || shuffledCards[0];
  const isFavorited = history.favorites.includes(currentCard?.id || '');

  // Reset card index when category changes
  useEffect(() => {
    setCardIndex(0);
  }, [activeCategory]);

  // Swipe handling
  const touchStart = useRef(0);
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null);

  const nextCard = useCallback(() => {
    setSwipeDir('left');
    setCardIndex(prev => (prev + 1) % shuffledCards.length);
  }, [shuffledCards.length]);

  const prevCard = useCallback(() => {
    setSwipeDir('right');
    setCardIndex(prev => (prev - 1 + shuffledCards.length) % shuffledCards.length);
  }, [shuffledCards.length]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? nextCard() : prevCard(); }
  };

  // Double tap to favorite
  const lastTap = useRef(0);
  const [showHeart, setShowHeart] = useState(false);
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      toggleFavorite();
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
    lastTap.current = now;
  };

  const toggleFavorite = useCallback(() => {
    setHistory(prev => {
      const fav = prev.favorites.includes(currentCard.id)
        ? prev.favorites.filter(id => id !== currentCard.id)
        : [...prev.favorites, currentCard.id];
      const next = { ...prev, favorites: fav };
      saveHistory(next);
      return next;
    });
  }, [currentCard?.id]);

  // Reflection
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionText, setReflectionText] = useState('');

  const saveReflection = useCallback(() => {
    if (!reflectionText.trim()) return;
    setHistory(prev => {
      const next = {
        ...prev,
        reflections: [...prev.reflections, {
          cardId: currentCard.id,
          date: new Date().toISOString(),
          text: reflectionText.trim(),
          quote: currentCard.quote,
          author: currentCard.author,
        }],
      };
      saveHistory(next);
      return next;
    });
    setReflectionText('');
    setShowReflection(false);
  }, [reflectionText, currentCard]);

  // Share with format selection
  const [sharing, setSharing] = useState(false);
  const [showSharePicker, setShowSharePicker] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const handleShareFormat = async (format: 'square' | 'story') => {
    setShowSharePicker(false);
    if (sharing) return;
    setSharing(true);

    // Wait for share card to render
    await new Promise(r => setTimeout(r, 100));

    const targetRef = shareCardRef.current;
    if (!targetRef) { setSharing(false); return; }

    try {
      const canvas = await html2canvas(targetRef, {
        width: targetRef.offsetWidth,
        height: targetRef.offsetHeight,
        scale: 2,
        useCORS: true,
        backgroundColor: '#0a0a0a',
        logging: false,
        imageTimeout: 0,
        removeContainer: true,
      });
      canvas.toBlob(async (blob) => {
        if (!blob) { setSharing(false); return; }
        const file = new File([blob], `pulso-${format}.png`, { type: 'image/png' });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: 'Pulso — CorpoFala', text: `"${currentCard.quote}" — ${currentCard.author}` });
        } else {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `pulso-${format}.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
        setSharing(false);
      }, 'image/png', 1.0);
    } catch {
      setSharing(false);
    }
  };

  const [shareFormat, setShareFormat] = useState<'square' | 'story'>('story');

  return (
    <AppLayout>
      <div className="max-w-[720px] mx-auto px-5 sm:px-6 pt-6 pb-24">
        {/* Hidden share cards for capture */}
        <PulseShareCard ref={shareCardRef} card={currentCard} format={shareFormat} />

        {/* Back */}
        <motion.button variants={fadeUp} initial="hidden" animate="visible" custom={0}
          onClick={() => navigate("/app/dashboard")}
          className="flex items-center gap-2 mb-5"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#8A7A70", background: "none", border: "none", cursor: "pointer" }}
        >
          <ArrowLeft size={16} /> Voltar
        </motion.button>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <div className="flex items-center gap-2 mb-1">
            <motion.svg width="20" height="20" viewBox="0 0 32 32" fill="none"
              animate={{ scale: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <path d="M16 28s-1.5-1-3.5-2.8C8 21.2 4 17 4 12.5 4 8.9 6.9 6 10.5 6c2 0 3.9 1 5.5 2.8C17.6 7 19.5 6 21.5 6 25.1 6 28 8.9 28 12.5c0 1.5-.5 3-1.3 4.3" stroke="#C4622D" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M18 20h2.5l1.5-3 2 6 2-3h2.5" stroke="#C4622D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </motion.svg>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#1A1520" }}>Pulso</span>
          </div>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.2em", color: "rgba(42,32,53,0.40)" }}>
            SEU INSIGHT DE HOJE
          </span>
          <p className="mt-1" style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#C4622D" }}>
            {getFormattedDate()}
          </p>
        </motion.div>

        {/* Streak */}
        {history.streak.current >= 2 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="mt-4 flex items-center gap-2"
            style={{
              background: "rgba(196,98,45,0.08)",
              border: "1px solid rgba(196,98,45,0.18)",
              borderRadius: 12,
              padding: "10px 14px",
            }}
          >
            <Flame size={18} color="#C4622D" />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#C4622D", fontWeight: 500 }}>
              {history.streak.current} dias seguidos.
            </span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "rgba(196,98,45,0.60)", marginLeft: 'auto' }}>
              SEQUÊNCIA ATUAL
            </span>
          </motion.div>
        )}

        {/* Category filters */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="mt-5 flex gap-2 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className="shrink-0 transition-all duration-200"
              style={{
                background: activeCategory === cat.key ? '#C4622D' : 'rgba(42,32,53,0.06)',
                border: `1px solid ${activeCategory === cat.key ? '#C4622D' : 'rgba(42,32,53,0.10)'}`,
                borderRadius: 100,
                padding: '8px 16px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: activeCategory === cat.key ? '#fff' : '#6A5A55',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Card */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} className="mt-6">
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={handleDoubleTap}
            className="relative"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCard?.id}
                initial={{ opacity: 0, x: swipeDir === 'left' ? 60 : swipeDir === 'right' ? -60 : 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: swipeDir === 'left' ? -60 : 60 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div ref={cardRef}>
                  <PulseCardView card={currentCard} />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Double-tap heart */}
            <AnimatePresence>
              {showHeart && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  exit={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Heart size={64} fill="#C4622D" color="#C4622D" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Card counter */}
          <p className="text-center mt-3" style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#B0A090" }}>
            {cardIndex + 1} / {shuffledCards.length} · DESLIZE PARA NAVEGAR
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
          className="flex justify-center gap-3 mt-5"
        >
          {[
            { icon: <Share2 size={18} />, label: sharing ? 'Gerando...' : 'Compartilhar', onClick: () => setShowSharePicker(true), accent: false },
            { icon: <Heart size={18} fill={isFavorited ? '#C4622D' : 'none'} />, label: isFavorited ? 'Favoritado' : 'Favoritar', onClick: toggleFavorite, accent: false },
            { icon: <PenLine size={18} />, label: 'Refletir', onClick: () => setShowReflection(!showReflection), accent: true },
            { icon: <ChevronRight size={18} />, label: 'Próximo', onClick: nextCard, accent: false },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.onClick}
              className="flex flex-col items-center gap-1 transition-all duration-200 active:scale-95"
              style={{
                background: btn.accent ? 'rgba(196,98,45,0.08)' : 'rgba(255,255,255,0.90)',
                border: btn.accent ? '1px solid rgba(196,98,45,0.20)' : '1px solid rgba(26,21,32,0.06)',
                borderRadius: 12,
                padding: '12px 16px',
                color: btn.accent ? '#C4622D' : '#6A5A55',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                minWidth: 72,
              }}
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}
        </motion.div>

        {/* Share format picker */}
        <AnimatePresence>
          {showSharePicker && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="mt-4"
              style={{
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid rgba(26,21,32,0.08)',
                borderRadius: 16,
                padding: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              }}
            >
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.15em', color: '#8A7A70', marginBottom: 14 }}>
                ESCOLHA O FORMATO
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShareFormat('story'); handleShareFormat('story'); }}
                  className="flex-1 flex flex-col items-center gap-2 transition-all active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #1A1520, #2A1510)',
                    borderRadius: 14,
                    padding: '20px 16px',
                    border: '1px solid rgba(196,98,45,0.20)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: 32,
                    height: 52,
                    borderRadius: 6,
                    border: '1.5px solid rgba(196,98,45,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Image size={14} color="#C4622D" />
                  </div>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: '#fff' }}>
                    Story
                  </span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.40)' }}>
                    9:16
                  </span>
                </button>

                <button
                  onClick={() => { setShareFormat('square'); handleShareFormat('square'); }}
                  className="flex-1 flex flex-col items-center gap-2 transition-all active:scale-95"
                  style={{
                    background: 'rgba(42,32,53,0.04)',
                    borderRadius: 14,
                    padding: '20px 16px',
                    border: '1px solid rgba(42,32,53,0.08)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: 6,
                    border: '1.5px solid rgba(42,32,53,0.20)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Square size={14} color="#6A5A55" />
                  </div>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: '#1A1520' }}>
                    Feed
                  </span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: 'rgba(42,32,53,0.35)' }}>
                    1:1
                  </span>
                </button>
              </div>
              <button
                onClick={() => setShowSharePicker(false)}
                className="w-full mt-3 transition-all"
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: '#8A7A70',
                  cursor: 'pointer',
                  padding: '8px',
                }}
              >
                Cancelar
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reflection textarea */}
        <AnimatePresence>
          {showReflection && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-4"
            >
              <textarea
                value={reflectionText}
                onChange={e => setReflectionText(e.target.value)}
                placeholder="O que isso acende em mim?"
                className="w-full resize-none focus:outline-none"
                style={{
                  background: 'rgba(255,255,255,0.90)',
                  border: '1px solid rgba(196,98,45,0.20)',
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  fontStyle: 'italic',
                  color: '#2A2035',
                  minHeight: 100,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}
              />
              <button
                onClick={saveReflection}
                disabled={!reflectionText.trim()}
                className="mt-2 w-full transition-all"
                style={{
                  background: reflectionText.trim() ? '#C4622D' : 'rgba(196,98,45,0.20)',
                  borderRadius: 10,
                  padding: '10px 22px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#fff',
                  border: 'none',
                  cursor: reflectionText.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Salvar reflexão
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reflections history */}
        {history.reflections.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6} className="mt-10">
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#8A7A70", marginBottom: 12 }}>
              SUAS REFLEXÕES
            </p>
            <div className="flex flex-col gap-3">
              {history.reflections.slice(-5).reverse().map((r, i) => (
                <div
                  key={i}
                  className="glass-card"
                  style={{ borderRadius: 12, padding: '14px 16px' }}
                >
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#B0A090" }}>
                    {new Date(r.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </p>
                  <p className="mt-1" style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontSize: 13, color: "#6A5A55", lineHeight: 1.4 }}>
                    "{r.quote.slice(0, 60)}..."
                  </p>
                  <p className="mt-1" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#2A2035", lineHeight: 1.5 }}>
                    {r.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Favorites count */}
        {history.favorites.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7} className="mt-8">
            <div
              className="glass-card flex items-center gap-3 cursor-pointer"
              style={{ borderRadius: 14, padding: '16px 18px' }}
            >
              <Heart size={20} fill="#C4622D" color="#C4622D" />
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#1A1520" }}>
                  {history.favorites.length} cards favoritados
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#8A7A70" }}>
                  Sua coleção pessoal de insights
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default AppPulse;
