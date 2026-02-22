interface PDFScientificReferenceProps {
  title: string;
  children: React.ReactNode;
}

const PDFScientificReference = ({ title, children }: PDFScientificReferenceProps) => (
  <div
    style={{
      margin: "20px 0",
      borderRadius: "8px",
      border: "1px solid #e5e5e5",
      backgroundColor: "#f9f9f9",
      padding: "16px 20px",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "12px",
      }}
    >
      <span
        style={{
          fontSize: "10px",
          fontWeight: "bold",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#BE5B2A",
        }}
      >
        Ref
      </span>
      <span style={{ fontSize: "13px", fontWeight: 500, color: "#444" }}>
        {title}
      </span>
    </div>
    <div style={{ fontSize: "13px", color: "#555", lineHeight: "1.7" }}>
      {children}
    </div>
  </div>
);

export default PDFScientificReference;
