import { useRef, useState, useEffect } from "react";
import { X, Download, Copy, Share2 } from "lucide-react";
import html2canvas from "html2canvas";
import ShareCard from "./ShareCard";

interface ShareSnippetModalProps {
  text: string;
  onClose: () => void;
}

const ShareSnippetModal = ({ text, onClose }: ShareSnippetModalProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator !== "undefined" && !!navigator.share;

  useEffect(() => {
    const generate = async () => {
      if (!cardRef.current) return;
      try {
        const canvas = await html2canvas(cardRef.current, {
          scale: 1,
          backgroundColor: null,
          logging: false,
          width: 1080,
          height: 1920,
        });
        const url = canvas.toDataURL("image/png");
        setImageUrl(url);
        canvas.toBlob((b) => { if (b) setBlob(b); }, "image/png", 1.0);
      } catch (e) {
        console.error("Share card generation failed:", e);
      }
    };
    // Small delay to ensure card is rendered
    setTimeout(generate, 100);
  }, [text]);

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "corpofala-trecho.png";
    a.click();
  };

  const handleCopy = async () => {
    if (!blob) return;
    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Clipboard copy failed");
    }
  };

  const handleShare = async () => {
    if (!blob) return;
    try {
      await navigator.share({
        files: [new File([blob], "corpofala.png", { type: "image/png" })],
        title: "Trecho do livro",
        text: text.slice(0, 100),
      });
    } catch {
      // User cancelled or unsupported
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: "rgba(26,21,32,0.95)", backdropFilter: "blur(12px)" }}>
      {/* Offscreen card for capture */}
      <ShareCard ref={cardRef} text={text} />

      <div style={{ background: "white", borderRadius: 16, padding: 32, maxWidth: 420, width: "90%", position: "relative" }}>
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", cursor: "pointer" }}
        >
          <X size={20} color="#8A7A70" />
        </button>

        <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "#1A1520", marginBottom: 16 }}>
          Compartilhar trecho
        </h3>

        {/* Preview */}
        {imageUrl ? (
          <img src={imageUrl} alt="Preview" style={{ width: "100%", borderRadius: 8, marginBottom: 24 }} />
        ) : (
          <div style={{ width: "100%", height: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "#F2EDE4", borderRadius: 8, marginBottom: 24 }}>
            <span className="animate-pulse" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#8A7A70" }}>
              Gerando imagem...
            </span>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={handleDownload}
            disabled={!imageUrl}
            style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              background: "#F2EDE4", border: "none", borderRadius: 8, padding: "12px 16px",
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#2A2035", cursor: "pointer",
            }}
          >
            <Download size={18} /> Baixar imagem
          </button>

          <button
            onClick={handleCopy}
            disabled={!blob}
            style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              background: "#F2EDE4", border: "none", borderRadius: 8, padding: "12px 16px",
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#2A2035", cursor: "pointer",
            }}
          >
            <Copy size={18} /> {copied ? "Imagem copiada!" : "Copiar imagem"}
          </button>

          {canShare && (
            <button
              onClick={handleShare}
              disabled={!blob}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                background: "#00BCD4", border: "none", borderRadius: 8, padding: "12px 16px",
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "white", cursor: "pointer",
              }}
            >
              <Share2 size={18} /> Compartilhar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareSnippetModal;
