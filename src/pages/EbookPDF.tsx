import { useState, useRef, useCallback } from "react";
import { Loader2, Download } from "lucide-react";
import PDFCover from "@/components/ebook/PDFCover";
import { chapters } from "@/data/ebookChapters";
import { ebookParts } from "@/data/ebookContent/index";
import { renderChapterContent, PAGE_W, PAGE_H, MARGIN_SIDE } from "@/lib/pdfRenderer";
import { registerFonts } from "@/lib/pdfFontLoader";
import { PDFModeProvider } from "@/contexts/PDFModeContext";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const EbookPDF = () => {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  /**
   * Force-expand all interactive elements before text extraction.
   */
  const prepareDOM = useCallback(() => {
    if (!contentRef.current) return;
    const root = contentRef.current;

    // Open all Radix accordions
    root.querySelectorAll('[data-state="closed"]').forEach((el) => {
      el.setAttribute("data-state", "open");
    });

    // Force visibility on hidden elements
    const selectors = [
      '[style*="height: 0"]',
      '[style*="overflow: hidden"]',
      '[style*="display: none"]',
      '[style*="opacity: 0"]',
    ];
    selectors.forEach((sel) => {
      try {
        root.querySelectorAll(sel).forEach((el) => {
          const h = el as HTMLElement;
          if (h.style.opacity === "0") h.style.opacity = "1";
          if (h.style.height === "0px") h.style.height = "auto";
          if (h.style.maxHeight === "0px") h.style.maxHeight = "none";
          if (h.style.display === "none") h.style.display = "block";
          if (h.style.overflow === "hidden") h.style.overflow = "visible";
        });
      } catch {}
    });

    // Force open computed hidden elements
    root.querySelectorAll("[data-state='open']").forEach((el) => {
      const h = el as HTMLElement;
      const cs = window.getComputedStyle(h);
      if (cs.height === "0px") h.style.height = "auto";
      if (cs.overflow === "hidden") h.style.overflow = "visible";
    });
  }, []);

  const generatePDF = async () => {
    if (!contentRef.current) return;
    setGenerating(true);
    setProgress("Preparando o PDF...");

    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      // Register custom Unicode font
      setProgress("Carregando fontes...");
      await registerFonts(pdf);
      setProgress("Gerando capa...");
      const coverEl = contentRef.current.querySelector(".pdf-cover") as HTMLElement;
      if (coverEl) {
        const coverCanvas = await html2canvas(coverEl, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#faf6f1",
          logging: false,
        });
        pdf.addImage(coverCanvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, PAGE_W, PAGE_H);
      }

      // ── 2. TITLE PAGE ──
      pdf.addPage();
      pdf.setFont("PlusJakartaSans", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(190, 91, 42);
      pdf.text("EGON JUNIOR GOTCHALK", PAGE_W / 2, 80, { align: "center" });
      pdf.setFontSize(28);
      pdf.setTextColor(30, 30, 30);
      pdf.text("O Que Seu Corpo Está", PAGE_W / 2, 115, { align: "center" });
      pdf.text("Tentando Te Dizer", PAGE_W / 2, 130, { align: "center" });
      pdf.setFontSize(12);
      pdf.setTextColor(120, 120, 120);
      pdf.text("Um Mapa Científico Para Entender", PAGE_W / 2, 155, { align: "center" });
      pdf.text("a Origem Emocional de Seus Bloqueios e Doenças", PAGE_W / 2, 163, { align: "center" });
      pdf.setFontSize(10);
      pdf.setTextColor(160, 160, 160);
      pdf.text("© 2025 Egon Junior Gotchalk", PAGE_W / 2, 260, { align: "center" });
      pdf.text("Todos os direitos reservados", PAGE_W / 2, 267, { align: "center" });

      // ── 3. TABLE OF CONTENTS ──
      pdf.addPage();
      pdf.setFontSize(22);
      pdf.setTextColor(30, 30, 30);
      pdf.text("Sumário", PAGE_W / 2, 40, { align: "center" });
      pdf.setFontSize(12);
      let tocY = 70;
      chapters.forEach((ch, i) => {
        pdf.setTextColor(80, 80, 80);
        pdf.text(`${String(i + 1).padStart(2, "0")}`, 30, tocY);
        pdf.setTextColor(30, 30, 30);
        pdf.text(ch.title, 42, tocY);
        if (ch.subtitle) {
          pdf.setFontSize(10);
          pdf.setTextColor(140, 140, 140);
          pdf.text(ch.subtitle, 42, tocY + 6);
          pdf.setFontSize(12);
          tocY += 20;
        } else {
          tocY += 14;
        }
      });

      // ── 4. PREPARE DOM ──
      setProgress("Preparando conteúdo...");
      prepareDOM();
      await delay(300);

      // ── 5. RENDER CHAPTERS WITH NATIVE TEXT ──
      const chapterSections = contentRef.current.querySelectorAll(".pdf-chapter-section");
      let pageNum = 3; // cover + title + toc

      console.log(`[PDF] Found ${chapterSections.length} chapter sections`);
      for (let i = 0; i < chapterSections.length; i++) {
        const section = chapterSections[i] as HTMLElement;
        const chapterTitle = chapters[i]?.title || `Capítulo ${i + 1}`;
        const contentDiv = section.querySelector(".pdf-chapter-content");
        const childCount = contentDiv?.children?.length || 0;
        const firstChild = contentDiv?.children?.[0];
        console.log(`[PDF] Chapter ${i + 1}: "${chapterTitle}" | contentDiv children: ${childCount} | firstChild: <${firstChild?.tagName}> cls="${(firstChild as HTMLElement)?.className?.substring(0, 50) || ""}"`);
        setProgress(`Renderizando: ${chapterTitle} (${i + 1}/${chapterSections.length})...`);

        const prevPage = pageNum;
        pageNum = renderChapterContent(pdf, section, chapterTitle, pageNum);
        console.log(`[PDF] Chapter ${i + 1} done: pages ${prevPage} -> ${pageNum}`);
        await delay(50);
      }

      setProgress("Salvando PDF...");
      pdf.save("O-Que-Seu-Corpo-Esta-Tentando-Te-Dizer.pdf");
      setProgress("PDF gerado com sucesso! ✅");
    } catch (err) {
      console.error("PDF generation error:", err);
      setProgress("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Controls */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-serif font-bold text-foreground">
              Gerar PDF do Ebook
            </h1>
            {progress && (
              <p className="text-sm text-muted-foreground mt-1">{progress}</p>
            )}
          </div>
          <button
            onClick={generatePDF}
            disabled={generating}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Gerar PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hidden renderable content for DOM text extraction */}
      <PDFModeProvider>
        <div ref={contentRef} className="max-w-[210mm] mx-auto">
          <PDFCover />
          {chapters.map((ch) => {
            const part = ebookParts[ch.slug];
            if (!part) return null;
            return (
              <div
                key={ch.slug}
                className="pdf-chapter-section bg-white text-black px-12 py-16"
                style={{
                  fontFamily: "'Plus Jakarta Sans', Georgia, serif",
                  lineHeight: "1.8",
                  fontSize: "14px",
                  pageBreakBefore: "always",
                }}
              >
                <div className="mb-10 text-center">
                  <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-4">
                    {ch.slug === "intro"
                      ? "Introdução"
                      : ch.slug === "conclusao"
                      ? "Conclusão"
                      : ch.slug.replace("parte-", "Parte ")}
                  </p>
                  <h2
                    className="text-3xl font-bold mb-3"
                    style={{ fontFamily: "'DM Serif Display', serif", color: "#1a1a1a" }}
                  >
                    {part.title}
                  </h2>
                  {part.subtitle && (
                    <p className="text-sm text-gray-500">{part.subtitle}</p>
                  )}
                </div>
                <div className="pdf-chapter-content prose prose-sm max-w-none">
                  {part.content}
                </div>
              </div>
            );
          })}
        </div>
      </PDFModeProvider>
    </div>
  );
};

export default EbookPDF;
