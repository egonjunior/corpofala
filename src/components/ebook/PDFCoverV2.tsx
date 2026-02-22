/**
 * PDFCoverV2 — "The Axis"
 *
 * Apple/Nike philosophy: one idea, perfect execution, nothing else.
 * A single luminous vertical line (the body's axis/spine) with a
 * subtle crown of light at the top (consciousness). Typography
 * does the rest. 60%+ negative space = luxury.
 */
const PDFCoverV2 = () => (
  <div
    className="pdf-cover relative w-full flex flex-col items-center overflow-hidden"
    style={{
      height: "297mm",
      width: "210mm",
      background: "#000000",
      pageBreakAfter: "always",
    }}
  >
    {/* Subtle radial warmth — barely perceptible */}
    <div
      className="absolute pointer-events-none"
      style={{
        top: "30%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "400px",
        height: "600px",
        background: "radial-gradient(ellipse at 50% 30%, rgba(218,165,32,0.06) 0%, transparent 70%)",
      }}
    />

    {/* ── THE AXIS: single vertical luminous line ── */}
    <div
      className="absolute"
      style={{
        top: "38%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "1.5px",
        height: "280px",
        background: "linear-gradient(180deg, rgba(218,165,32,0.7) 0%, rgba(218,165,32,0.35) 40%, rgba(218,165,32,0.08) 100%)",
      }}
    />

    {/* Axis glow — soft spread */}
    <div
      className="absolute"
      style={{
        top: "38%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "60px",
        height: "280px",
        background: "linear-gradient(180deg, rgba(218,165,32,0.08) 0%, rgba(218,165,32,0.03) 50%, transparent 100%)",
        filter: "blur(20px)",
      }}
    />

    {/* Crown of light — consciousness point at top of axis */}
    <div
      className="absolute"
      style={{
        top: "36.5%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "#D4A530",
        boxShadow: "0 0 20px 8px rgba(218,165,32,0.25), 0 0 60px 20px rgba(218,165,32,0.08)",
      }}
    />

    {/* ── TYPOGRAPHY ── */}

    {/* Title group — positioned with absolute precision */}
    <div
      className="relative z-10 text-center w-full"
      style={{ marginTop: "110px" }}
    >
      {/* Pre-title — whisper */}
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "7.5px",
          letterSpacing: "0.55em",
          color: "rgba(218,165,32,0.3)",
          textTransform: "uppercase",
          marginBottom: "48px",
        }}
      >
        Egon Junior Gotchalk
      </p>

      {/* Main title — one size, clean, commanding */}
      <h1
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "48px",
          color: "#D4A530",
          lineHeight: "1.25",
          letterSpacing: "0.02em",
          fontWeight: 400,
          margin: "0 auto",
          maxWidth: "420px",
          textShadow: "0 0 80px rgba(218,165,32,0.15)",
        }}
      >
        O Que Seu Corpo
        <br />
        Está Tentando
        <br />
        Te Dizer
      </h1>
    </div>

    {/* Bottom block — anchored to base */}
    <div
      className="relative z-10 text-center mt-auto"
      style={{ marginBottom: "100px" }}
    >
      {/* Thin gold line */}
      <div
        className="mx-auto"
        style={{
          width: "40px",
          height: "0.5px",
          background: "rgba(218,165,32,0.35)",
          marginBottom: "28px",
        }}
      />

      {/* Subtitle */}
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "11px",
          color: "rgba(218,165,32,0.45)",
          letterSpacing: "0.08em",
          lineHeight: "2.2",
          fontWeight: 300,
        }}
      >
        Um Mapa Científico Para Entender
        <br />
        a Origem Emocional de Suas Doenças
      </p>
    </div>
  </div>
);

export default PDFCoverV2;
