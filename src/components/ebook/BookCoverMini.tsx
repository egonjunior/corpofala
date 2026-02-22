/**
 * BookCoverMini — miniatura fiel da capa oficial do livro.
 * Fundo bege/creme, tipografia em preto e terracota (#BE5B2A).
 */
const BookCoverMini = ({ height = 200, className = "" }: { height?: number; className?: string }) => {
  const w = height * (210 / 297); // A4 aspect ratio

  return (
    <div
      className={`relative flex flex-col items-center overflow-hidden rounded-lg shrink-0 ${className}`}
      style={{
        height,
        width: w,
        background: "linear-gradient(180deg, #faf6f1 0%, #f5efe6 40%, #f2ebe2 100%)",
        boxShadow: "0 6px 24px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.02,
          backgroundImage: `radial-gradient(circle at 25% 25%, #BE5B2A 1px, transparent 1px),
                            radial-gradient(circle at 75% 75%, #BE5B2A 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />

      {/* Top teaser */}
      <p
        className="relative z-10 text-center"
        style={{
          marginTop: height * 0.08,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: Math.max(4, height * 0.02),
          letterSpacing: "0.4em",
          color: "rgba(190,91,42,0.4)",
          textTransform: "uppercase" as const,
        }}
      >
        Um livro que pode mudar sua vida
      </p>

      {/* Decorative line */}
      <div
        className="relative z-10 mx-auto"
        style={{
          width: height * 0.1,
          height: "1px",
          background: "linear-gradient(90deg, transparent, #BE5B2A, transparent)",
          marginTop: height * 0.12,
          marginBottom: height * 0.04,
        }}
      />

      {/* "O Que Seu Corpo" */}
      <p
        className="relative z-10 text-center"
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: Math.max(9, height * 0.07),
          color: "#0d0906",
          lineHeight: 1.15,
          letterSpacing: "0.01em",
        }}
      >
        O Que Seu Corpo
      </p>

      {/* "Está Tentando Te Dizer" — hero line in terracotta italic */}
      <p
        className="relative z-10 text-center"
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontStyle: "italic",
          fontSize: Math.max(11, height * 0.09),
          color: "#BE5B2A",
          lineHeight: 1.1,
          letterSpacing: "0.01em",
          marginTop: height * 0.01,
        }}
      >
        Está Tentando
        <br />
        Te Dizer
      </p>

      {/* Decorative line below title */}
      <div
        className="relative z-10 mx-auto"
        style={{
          width: height * 0.14,
          height: "1px",
          background: "linear-gradient(90deg, transparent, #BE5B2A, transparent)",
          marginTop: height * 0.05,
          marginBottom: height * 0.03,
        }}
      />

      {/* Subtitle */}
      <p
        className="relative z-10 text-center"
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: Math.max(4, height * 0.023),
          color: "rgba(13,9,6,0.55)",
          letterSpacing: "0.05em",
          lineHeight: 1.8,
          maxWidth: "80%",
        }}
      >
        Um Mapa Científico Para Entender
        <br />
        a Origem Emocional de Seus Bloqueios e Doenças
      </p>

      {/* Author — bottom */}
      <div className="relative z-10 mt-auto" style={{ marginBottom: height * 0.06 }}>
        <div
          className="mx-auto"
          style={{
            width: height * 0.06,
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(13,9,6,0.15), transparent)",
            marginBottom: height * 0.025,
          }}
        />
        <p
          className="text-center"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: Math.max(4, height * 0.018),
            color: "rgba(13,9,6,0.3)",
            letterSpacing: "0.35em",
            textTransform: "uppercase" as const,
          }}
        >
          Egon Junior Gotchalk
        </p>
      </div>
    </div>
  );
};

export default BookCoverMini;
