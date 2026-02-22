const PDFCover = () => (
  <div
    className="pdf-cover relative w-full flex flex-col items-center justify-between overflow-hidden"
    style={{
      height: "297mm",
      width: "210mm",
      background: "linear-gradient(180deg, #faf6f1 0%, #f5efe6 40%, #f2ebe2 100%)",
      pageBreakAfter: "always",
    }}
  >
    {/* Subtle geometric pattern overlay */}
    <div
      className="absolute inset-0"
      style={{
        opacity: 0.02,
        backgroundImage: `radial-gradient(circle at 25% 25%, #BE5B2A 1px, transparent 1px),
                          radial-gradient(circle at 75% 75%, #BE5B2A 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }}
    />

    {/* Warm radial glow behind title area */}
    <div
      className="absolute"
      style={{
        top: "28%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "600px",
        height: "350px",
        background: "radial-gradient(ellipse, rgba(190,91,42,0.04) 0%, transparent 70%)",
      }}
    />

    {/* Top teaser */}
    <div className="relative z-10 pt-24 text-center">
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "9px",
          letterSpacing: "0.45em",
          color: "rgba(190,91,42,0.45)",
          textTransform: "uppercase",
        }}
      >
        Um livro que pode mudar sua vida
      </p>
    </div>

    {/* Center title block */}
    <div className="relative z-10 text-center px-14" style={{ marginTop: "-30px" }}>
      {/* Decorative line above */}
      <div
        className="mx-auto mb-12"
        style={{
          width: "50px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, #BE5B2A, transparent)",
        }}
      />

      {/* "O Que Seu Corpo" */}
      <p
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "52px",
          color: "#0d0906",
          lineHeight: "1.15",
          letterSpacing: "0.01em",
          marginBottom: "14px",
        }}
      >
        O Que Seu Corpo
      </p>

      {/* "Está Tentando Te Dizer" - HERO LINE */}
      <p
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontStyle: "italic",
          fontSize: "68px",
          color: "#BE5B2A",
          lineHeight: "1.08",
          letterSpacing: "0.01em",
          textShadow: "0 2px 40px rgba(190,91,42,0.18)",
        }}
      >
        Está Tentando
        <br />
        Te Dizer
      </p>

      {/* Decorative line below title */}
      <div
        className="mx-auto mt-12 mb-12"
        style={{
          width: "80px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, #BE5B2A, transparent)",
        }}
      />

      {/* Subtitle */}
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "16px",
          color: "rgba(13,9,6,0.6)",
          letterSpacing: "0.06em",
          lineHeight: "2",
          maxWidth: "340px",
          margin: "0 auto",
        }}
      >
        Um Mapa Científico Para Entender
        <br />
        a Origem Emocional de Seus Bloqueios e Doenças
      </p>
    </div>

    {/* Bottom - Author */}
    <div className="relative z-10 pb-20 text-center">
      <div
        className="mx-auto mb-5"
        style={{
          width: "30px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(13,9,6,0.15), transparent)",
        }}
      />
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "10px",
          color: "rgba(13,9,6,0.3)",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
        }}
      >
        Egon Junior Gotchalk
      </p>
    </div>
  </div>
);

export default PDFCover;
