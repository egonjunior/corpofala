interface PDFPullQuoteProps {
  children: React.ReactNode;
  author?: string;
}

const PDFPullQuote = ({ children, author }: PDFPullQuoteProps) => (
  <blockquote
    style={{
      margin: "32px 0",
      borderLeft: "4px solid #BE5B2A",
      paddingLeft: "24px",
      paddingRight: "12px",
      paddingTop: "12px",
      paddingBottom: "12px",
      position: "relative",
    }}
  >
    <span
      style={{
        position: "absolute",
        top: "-16px",
        left: "-6px",
        fontSize: "48px",
        color: "rgba(190,91,42,0.2)",
        fontFamily: "Georgia, serif",
        userSelect: "none",
      }}
    >
      "
    </span>
    <p
      style={{
        fontSize: "18px",
        fontFamily: "Georgia, serif",
        fontStyle: "italic",
        lineHeight: "1.6",
        color: "#1a1a1a",
      }}
    >
      {children}
    </p>
    {author && (
      <cite
        style={{
          display: "block",
          marginTop: "12px",
          fontSize: "12px",
          color: "#888",
          fontStyle: "normal",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        — {author}
      </cite>
    )}
  </blockquote>
);

export default PDFPullQuote;
