import type jsPDF from "jspdf";

/* ── Layout constants (mm) ── */
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_TOP = 22;
const MARGIN_BOTTOM = 18;
const MARGIN_SIDE = 20;
const CONTENT_W = PAGE_W - MARGIN_SIDE * 2; // 170mm
const MAX_Y = PAGE_H - MARGIN_BOTTOM;
const LINE_H = 5.5;
const PARA_GAP = 5;
const LIST_INDENT = 8;
const BULLET_CHAR = "\u2022";

/* ── Colors ── */
const COLOR_BODY = [30, 30, 30] as const;
const COLOR_HEADING = [20, 20, 20] as const;
const COLOR_MUTED = [120, 120, 120] as const;
const COLOR_PRIMARY = [190, 91, 42] as const;
const COLOR_HEADER = [190, 160, 130] as const;
const COLOR_REF_BG = [248, 245, 240] as const;
const COLOR_REF_BORDER = [220, 210, 200] as const;
const COLOR_QUOTE_BORDER = [190, 91, 42] as const;

interface RenderState {
  pdf: jsPDF;
  cursorY: number;
  pageNum: number;
  chapterTitle: string;
}

interface TextSegment {
  text: string;
  bold: boolean;
  italic: boolean;
}

/* ── Sanitize text (remove emojis jsPDF can't render) ── */
function sanitizeText(text: string): string {
  return text
    // Remove emoji ranges
    .replace(/[\u{1F600}-\u{1F64F}]/gu, "")
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, "")
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, "")
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, "")
    .replace(/[\u{2600}-\u{26FF}]/gu, "")
    .replace(/[\u{2700}-\u{27BF}]/gu, "")
    .replace(/[\u{FE00}-\u{FE0F}]/gu, "")
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, "")
    .replace(/[\u{1FA00}-\u{1FA6F}]/gu, "")
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, "")
    .replace(/[\u{200D}]/gu, "")
    .replace(/[\u{20E3}]/gu, "")
    .replace(/[\u{E0020}-\u{E007F}]/gu, "")
    // Replace common symbols that break
    .replace(/[\u{2013}]/gu, "-") // en-dash
    .replace(/[\u{2014}]/gu, " - ") // em-dash
    .replace(/[\u{201C}\u{201D}]/gu, '"') // smart quotes
    .replace(/[\u{2018}\u{2019}]/gu, "'") // smart single quotes
    .replace(/[\u{2026}]/gu, "...") // ellipsis
    .replace(/\s{2,}/g, " ")
    .trim();
}

/* ── Page chrome ── */
function addPageChrome(state: RenderState) {
  const { pdf, pageNum, chapterTitle } = state;
  pdf.setFontSize(8);
  pdf.setFont("PlusJakartaSans", "normal");
  pdf.setTextColor(...COLOR_HEADER);
  pdf.text(sanitizeText(chapterTitle), PAGE_W / 2, 12, { align: "center" });
  pdf.setDrawColor(230, 220, 210);
  pdf.setLineWidth(0.3);
  pdf.line(MARGIN_SIDE, 15, PAGE_W - MARGIN_SIDE, 15);
  pdf.setFontSize(9);
  pdf.setTextColor(180, 180, 180);
  pdf.text(String(pageNum), PAGE_W / 2, PAGE_H - 10, { align: "center" });
}

function newPage(state: RenderState): RenderState {
  state.pdf.addPage();
  state.pageNum++;
  state.cursorY = MARGIN_TOP;
  addPageChrome(state);
  return state;
}

function ensureSpace(state: RenderState, needed: number): RenderState {
  if (state.cursorY + needed > MAX_Y) {
    return newPage(state);
  }
  return state;
}

/* ── Extract inline segments from DOM ── */
function extractInlineSegments(el: Element | Node): TextSegment[] {
  const segments: TextSegment[] = [];
  const walk = (node: Node, bold: boolean, italic: boolean) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (text) segments.push({ text: sanitizeText(text), bold, italic });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = (node as Element).tagName;
      const isBold = bold || tag === "STRONG" || tag === "B";
      const isItalic = italic || tag === "EM" || tag === "I";
      node.childNodes.forEach(child => walk(child, isBold, isItalic));
    }
  };
  el.childNodes.forEach(child => walk(child, false, false));
  return segments;
}

/* ── Segment-based word-wrapped rendering ── */
function renderSegmentedText(
  state: RenderState,
  segments: TextSegment[],
  maxW: number,
  startX: number,
  fontSize: number
): RenderState {
  state.pdf.setFontSize(fontSize);

  // Break segments into words, preserving style
  interface Word { text: string; bold: boolean; italic: boolean; width: number }
  const words: Word[] = [];

  for (const seg of segments) {
    if (!seg.text.trim() && seg.text !== " ") continue;
    // Split by spaces but keep them as joiners
    const parts = seg.text.split(/(\s+)/);
    for (const p of parts) {
      if (!p) continue;
      const fontStyle = seg.bold && seg.italic ? "bolditalic" : seg.bold ? "bold" : seg.italic ? "italic" : "normal";
      state.pdf.setFont("PlusJakartaSans", fontStyle);
      const w = state.pdf.getTextWidth(p);
      words.push({ text: p, bold: seg.bold, italic: seg.italic, width: w });
    }
  }

  if (words.length === 0) return state;

  // Render words line by line
  let lineX = startX;
  state = ensureSpace(state, LINE_H);

  for (const word of words) {
    // If adding this word exceeds line width, wrap
    if (lineX + word.width > startX + maxW && lineX > startX) {
      // Only wrap on non-whitespace words
      if (word.text.trim()) {
        state.cursorY += LINE_H;
        state = ensureSpace(state, LINE_H);
        lineX = startX;
      }
    }

    const fontStyle = word.bold && word.italic ? "bolditalic" : word.bold ? "bold" : word.italic ? "italic" : "normal";
    state.pdf.setFont("PlusJakartaSans", fontStyle);
    state.pdf.setTextColor(...COLOR_BODY);
    state.pdf.text(word.text, lineX, state.cursorY);
    lineX += word.width;
  }

  state.cursorY += LINE_H;
  return state;
}

/* ── Element renderers ── */

function renderHeading(state: RenderState, text: string, level: number): RenderState {
  const config = {
    2: { size: 18, gap: 12, after: 6 },
    3: { size: 15, gap: 10, after: 5 },
    4: { size: 12.5, gap: 7, after: 4 },
  }[level] || { size: 12, gap: 6, after: 4 };

  state = ensureSpace(state, config.gap + 40);
  state.cursorY += config.gap;

  const cleaned = sanitizeText(text);
  state.pdf.setFontSize(config.size);
  state.pdf.setFont("PlusJakartaSans", "bold");
  state.pdf.setTextColor(...COLOR_HEADING);

  const lines = state.pdf.splitTextToSize(cleaned, CONTENT_W) as string[];
  for (const line of lines) {
    state = ensureSpace(state, LINE_H + 1);
    state.pdf.text(line, MARGIN_SIDE, state.cursorY);
    state.cursorY += config.size * 0.45;
  }
  state.cursorY += config.after;
  return state;
}

function renderParagraph(state: RenderState, el: Element): RenderState {
  const segments = extractInlineSegments(el);
  const fullText = segments.map(s => s.text).join("");
  if (!fullText.trim()) return state;

  state = renderSegmentedText(state, segments, CONTENT_W, MARGIN_SIDE, 10.5);
  state.cursorY += PARA_GAP;
  return state;
}

function renderList(state: RenderState, el: Element): RenderState {
  const items = el.querySelectorAll(":scope > li");

  for (const li of Array.from(items)) {
    const segments = extractInlineSegments(li);
    const fullText = segments.map(s => s.text).join("").trim();
    if (!fullText) continue;

    state = ensureSpace(state, LINE_H);

    // Draw bullet
    state.pdf.setFontSize(10.5);
    state.pdf.setFont("PlusJakartaSans", "normal");
    state.pdf.setTextColor(...COLOR_BODY);
    state.pdf.text(BULLET_CHAR, MARGIN_SIDE + LIST_INDENT - 4, state.cursorY);

    // Render text with segments (preserves bold/italic)
    state = renderSegmentedText(state, segments, CONTENT_W - LIST_INDENT, MARGIN_SIDE + LIST_INDENT, 10.5);
    state.cursorY += 1.5;
  }
  state.cursorY += PARA_GAP - 1;
  return state;
}

function renderPullQuote(state: RenderState, text: string): RenderState {
  const cleaned = sanitizeText(text);
  if (!cleaned) return state;

  state.pdf.setFontSize(12);
  state.pdf.setFont("PlusJakartaSans", "italic");
  const lines = state.pdf.splitTextToSize(cleaned, CONTENT_W - 20) as string[];
  const totalHeight = lines.length * 6.5 + 12;

  state = ensureSpace(state, totalHeight);
  state.cursorY += 4;

  const startY = state.cursorY - 2;
  state.pdf.setDrawColor(...COLOR_QUOTE_BORDER);
  state.pdf.setLineWidth(1.2);

  state.pdf.setTextColor(60, 50, 45);
  for (const line of lines) {
    state.pdf.text(line, MARGIN_SIDE + 10, state.cursorY);
    state.cursorY += 6.5;
  }

  state.pdf.line(MARGIN_SIDE + 4, startY, MARGIN_SIDE + 4, state.cursorY - 4);
  state.cursorY += 6;
  return state;
}

function renderScientificRef(state: RenderState, el: Element): RenderState {
  // Extract title - try button first (interactive mode), then span (PDF mode)
  const button = el.querySelector("button");
  let title = "";
  
  if (button) {
    const titleSpan = button.querySelector("span");
    title = sanitizeText((titleSpan?.textContent || "").replace(/^Ref\s*/i, "").trim());
  } else {
    // PDF mode: no button, title is in a span after the Ref badge
    const spans = el.querySelectorAll("span");
    for (const span of Array.from(spans)) {
      const text = span.textContent?.trim() || "";
      if (text && !text.match(/^Ref$/i)) {
        title = sanitizeText(text);
        break;
      }
    }
  }

  // Extract content from the content div
  let contentText = "";
  
  // Try PDF mode structure first (data-pdf-ref, no animation wrapper)
  const contentWrapper = el.querySelector('[class*="px-5"]');
  if (contentWrapper) {
    contentText = sanitizeText((contentWrapper.textContent || "").trim());
  }
  
  // Fallback: motion div with overflow-hidden
  if (!contentText) {
    const motionDiv = el.querySelector('[class*="overflow-hidden"]');
    if (motionDiv) {
      const innerWrapper = motionDiv.querySelector('[class*="px-5"]');
      if (innerWrapper) {
        contentText = sanitizeText((innerWrapper.textContent || "").trim());
      }
    }
  }

  // Fallback: extract from any div that's not the title area
  if (!contentText) {
    for (const div of Array.from(el.querySelectorAll("div"))) {
      if (button && div.contains(button)) continue;
      const text = sanitizeText((div.textContent || "").trim());
      if (text && text !== title && text.length > title.length) {
        contentText = text;
        break;
      }
    }
  }

  if (!title && !contentText) return state;

  // Measure content
  state.pdf.setFontSize(9);
  const titleLines = state.pdf.splitTextToSize(`REF  ${title}`, CONTENT_W - 12) as string[];
  state.pdf.setFontSize(9.5);
  const contentLines = contentText ? state.pdf.splitTextToSize(contentText, CONTENT_W - 16) as string[] : [];
  const totalH = titleLines.length * 4.5 + contentLines.length * 4.5 + 14;

  state = ensureSpace(state, totalH);
  state.cursorY += 3;

  const boxStartY = state.cursorY - 3;

  // REF badge
  state.pdf.setFontSize(8);
  state.pdf.setFont("PlusJakartaSans", "bold");
  state.pdf.setTextColor(...COLOR_PRIMARY);
  state.pdf.text("REF", MARGIN_SIDE + 6, state.cursorY + 1);

  // Title
  state.pdf.setFontSize(9);
  state.pdf.setFont("PlusJakartaSans", "bold");
  state.pdf.setTextColor(...COLOR_BODY);
  state.pdf.text(title, MARGIN_SIDE + 18, state.cursorY + 1);
  state.cursorY += 6;

  // Content
  if (contentText) {
    state.pdf.setFontSize(9.5);
    state.pdf.setFont("PlusJakartaSans", "normal");
    state.pdf.setTextColor(...COLOR_MUTED);
    for (const line of contentLines) {
      state = ensureSpace(state, 4.5);
      state.pdf.text(line, MARGIN_SIDE + 8, state.cursorY);
      state.cursorY += 4.5;
    }
  }

  state.cursorY += 3;

  // Border box
  const boxH = state.cursorY - boxStartY;
  state.pdf.setDrawColor(...COLOR_REF_BORDER);
  state.pdf.setLineWidth(0.4);
  state.pdf.setFillColor(...COLOR_REF_BG);
  state.pdf.roundedRect(MARGIN_SIDE + 1, boxStartY, CONTENT_W - 2, boxH, 2, 2, "S");

  state.cursorY += PARA_GAP;
  return state;
}

function renderDivider(state: RenderState): RenderState {
  state = ensureSpace(state, 12);
  state.cursorY += 6;
  state.pdf.setDrawColor(...COLOR_PRIMARY);
  state.pdf.setLineWidth(0.4);
  const cx = PAGE_W / 2;
  state.pdf.line(cx - 20, state.cursorY, cx + 20, state.cursorY);
  state.cursorY += 8;
  return state;
}

function renderStyledContainer(state: RenderState, el: Element): RenderState {
  state = ensureSpace(state, 20);
  state.cursorY += 3;
  const startY = state.cursorY;
  const classes = el.className || "";
  const hasSideBorder = classes.includes("border-l");

  for (const child of Array.from(el.children)) {
    state = renderElement(state, child);
  }

  if (hasSideBorder) {
    state.pdf.setDrawColor(...COLOR_PRIMARY);
    state.pdf.setLineWidth(1);
    state.pdf.line(MARGIN_SIDE + 1, startY - 1, MARGIN_SIDE + 1, state.cursorY - 2);
  }

  state.cursorY += 2;
  return state;
}

/* ── Detection helpers ── */

function isVisualContainer(el: Element): boolean {
  const cls = el.className || "";
  return /\b(border|bg-|rounded|shadow|p-\d|pl-\d|pr-\d|px-\d|py-\d)\b/.test(cls);
}

function isPullQuote(el: Element): boolean {
  const tag = el.tagName;
  const cls = el.className || "";
  return tag === "BLOCKQUOTE" || (cls.includes("border-l-4") && cls.includes("border-primary"));
}

function isScientificRef(el: Element): boolean {
  if (el.tagName !== "DIV") return false;
  const cls = el.className || "";
  // PDF mode refs have data-pdf-ref attribute
  if ((el as HTMLElement).dataset?.pdfRef === "true") return true;
  if (el.querySelector("button") && el.textContent?.includes("Ref")) return true;
  if (cls.includes("rounded-lg") && cls.includes("border") && cls.includes("bg-card")) return true;
  return false;
}

function isSectionDivider(el: Element): boolean {
  const cls = el.className || "";
  return (cls.includes("h-px") || cls.includes("h-[1px]")) && cls.includes("bg-primary");
}

function isStructuralWrapper(el: Element): boolean {
  const cls = el.className || "";
  return /\b(space-y|prose|pdf-chapter-content|gap-)\b/.test(cls) && !isVisualContainer(el);
}

/* ── Main element dispatcher ── */

export function renderElement(state: RenderState, el: Element): RenderState {
  const tag = el.tagName;
  const cls = (el as HTMLElement).className || "";
  console.log(`[PDF] renderElement: <${tag}> cls="${String(cls).substring(0, 60)}" text="${(el.textContent || "").substring(0, 40).replace(/\n/g, " ")}"`);

  if (!el.textContent?.trim() && !el.querySelector("img")) {
    console.log(`[PDF] SKIPPED (empty): <${tag}>`);
    return state;
  }

  if (tag === "H2") return renderHeading(state, (el.textContent || "").trim(), 2);
  if (tag === "H3") return renderHeading(state, (el.textContent || "").trim(), 3);
  if (tag === "H4") return renderHeading(state, (el.textContent || "").trim(), 4);
  if (tag === "P") return renderParagraph(state, el);
  if (tag === "UL" || tag === "OL") return renderList(state, el);

  // Structural wrappers MUST be checked before component detectors
  if (tag === "SECTION" || tag === "ARTICLE" || tag === "MAIN" || tag === "HEADER" || tag === "FOOTER" || tag === "NAV") {
    const children = Array.from(el.children);
    console.log(`[PDF-SECTION] <${tag}> childCount=${children.length} childTags=[${children.map(c => c.tagName).join(",")}] cursorY=${state.cursorY.toFixed(1)} page=${state.pageNum}`);
    for (const child of children) {
      const prevY = state.cursorY;
      const prevPage = state.pageNum;
      state = renderElement(state, child);
      if (state.cursorY === prevY && state.pageNum === prevPage) {
        console.log(`[PDF-SECTION] child <${child.tagName}> produced NO output. text="${(child.textContent || "").substring(0, 30)}"`);
      }
    }
    return state;
  }

  if (isPullQuote(el)) return renderPullQuote(state, (el.textContent || "").trim());
  if (isSectionDivider(el)) return renderDivider(state);
  if (isScientificRef(el)) return renderScientificRef(state, el);

  if (tag === "DIV") {
    const childTags = Array.from(el.children).map(c => c.tagName).join(", ");
    console.log(`[PDF] DIV handler: cls="${String(cls).substring(0, 60)}" children=${el.children.length} childTags=[${childTags}] isStructural=${isStructuralWrapper(el)} isVisual=${isVisualContainer(el)}`);
    if (isStructuralWrapper(el)) {
      for (const child of Array.from(el.children)) {
        state = renderElement(state, child);
      }
      return state;
    }
    if (isVisualContainer(el)) {
      return renderStyledContainer(state, el);
    }
    for (const child of Array.from(el.children)) {
      state = renderElement(state, child);
    }
    return state;
  }

  // Fallback
  if (el.textContent?.trim()) {
    const cleaned = sanitizeText(el.textContent.trim());
    state.pdf.setFontSize(10.5);
    state.pdf.setFont("PlusJakartaSans", "normal");
    state.pdf.setTextColor(...COLOR_BODY);
    const lines = state.pdf.splitTextToSize(cleaned, CONTENT_W) as string[];
    for (const line of lines) {
      state = ensureSpace(state, LINE_H);
      state.pdf.text(line, MARGIN_SIDE, state.cursorY);
      state.cursorY += LINE_H;
    }
    state.cursorY += PARA_GAP;
  }

  return state;
}

let _renderCallCount = 0;

export function renderChapterContent(pdf: jsPDF, contentEl: HTMLElement, chapterTitle: string, pageNum: number): number {
  let state: RenderState = { pdf, cursorY: MARGIN_TOP, pageNum, chapterTitle };
  _renderCallCount = 0;

  state = newPage(state);
  state.cursorY += 8;

  // Chapter label
  state.pdf.setFontSize(9);
  state.pdf.setFont("PlusJakartaSans", "normal");
  state.pdf.setTextColor(...COLOR_PRIMARY);
  state.pdf.text(sanitizeText(chapterTitle.toUpperCase()), PAGE_W / 2, state.cursorY, { align: "center" });
  state.cursorY += 10;

  // Title
  state.pdf.setFontSize(22);
  state.pdf.setFont("PlusJakartaSans", "bold");
  state.pdf.setTextColor(...COLOR_HEADING);
  const titleLines = state.pdf.splitTextToSize(sanitizeText(chapterTitle), CONTENT_W - 20) as string[];
  for (const line of titleLines) {
    state.pdf.text(line, PAGE_W / 2, state.cursorY, { align: "center" });
    state.cursorY += 9;
  }

  // Decorative line
  state.cursorY += 4;
  state.pdf.setDrawColor(...COLOR_PRIMARY);
  state.pdf.setLineWidth(0.5);
  state.pdf.line(PAGE_W / 2 - 15, state.cursorY, PAGE_W / 2 + 15, state.cursorY);
  state.cursorY += 10;

  // Walk content
  const contentDiv = contentEl.querySelector(".pdf-chapter-content");
  if (contentDiv) {
    const rootChild = contentDiv.children[0];
    if (rootChild) {
      console.log(`[PDF-CH] "${chapterTitle}" rootChild: <${rootChild.tagName}> cls="${(rootChild as HTMLElement).className?.substring(0, 60)}" children=${rootChild.children.length}`);
      const childrenInfo = Array.from(rootChild.children).map((c, i) => `${i}:<${c.tagName}> text=${(c.textContent || "").substring(0, 25).replace(/\n/g, " ")}`);
      console.log(`[PDF-CH] "${chapterTitle}" children: ${childrenInfo.join(" | ")}`);
    }
    for (const child of Array.from(contentDiv.children)) {
      state = renderElement(state, child);
    }
  }

  return state.pageNum;
}

export { PAGE_W, PAGE_H, MARGIN_SIDE, MARGIN_TOP, MAX_Y, CONTENT_W };
