import { Map, X } from "lucide-react";

interface MapNotReadyModalProps {
  onClose: () => void;
}

const MapNotReadyModal = ({ onClose }: MapNotReadyModalProps) => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: "rgba(26,21,32,0.6)", backdropFilter: "blur(4px)" }}>
    <div style={{ background: "white", borderRadius: 12, padding: 24, maxWidth: 360, width: "90%", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", textAlign: "center", position: "relative" }}>
      <button onClick={onClose} style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", cursor: "pointer" }}>
        <X size={18} color="#8A7A70" />
      </button>
      <Map size={32} color="#C4622D" style={{ margin: "0 auto 16px" }} />
      <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "#1A1520", marginBottom: 12 }}>
        Seu Mapa será gerado ao final
      </h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6A5A55", lineHeight: 1.7, marginBottom: 20 }}>
        Continue lendo. Seu Mapa Pessoal será gerado automaticamente quando você terminar a leitura da Conclusão.
      </p>
      <button
        onClick={onClose}
        style={{
          background: "#C4622D", border: "none", borderRadius: 8, padding: "10px 24px",
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "white", cursor: "pointer",
        }}
      >
        Continuar lendo
      </button>
    </div>
  </div>
);

export default MapNotReadyModal;
