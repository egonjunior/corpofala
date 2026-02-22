import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface GuidedPracticeInviteProps {
  dominantPattern: string | null;
  darkMode: boolean;
}

const PRACTICE_CONTENT: Record<string, { title: string; steps: string[] }> = {
  pattern1: {
    title: "Dinâmica: Reconhecer a Necessidade Real",
    steps: [
      "Feche os olhos. Respire 3 vezes profundamente.",
      "Pense no último sintoma que apareceu. Onde sentiu no corpo?",
      "Agora pergunte-se: 'O que eu precisava quando esse sintoma apareceu? Atenção? Cuidado? Ser ouvido?'",
      "Reconheça essa necessidade sem julgamento. Ela é legítima.",
      "Agora imagine atender essa necessidade SEM o sintoma. Como seria pedir atenção diretamente? Como seria dizer 'eu preciso de você'?",
      "Mão no coração. 3 respirações. Repita: 'Eu mereço atenção mesmo quando estou saudável.'",
    ],
  },
  pattern2: {
    title: "Dinâmica: Liberar a Raiva com Segurança",
    steps: [
      "Feche os olhos. Respire fundo 3 vezes.",
      "Identifique uma raiva que você está engolindo agora. De quem? Sobre o quê?",
      "Sinta onde essa raiva está no corpo. Mandíbula? Peito? Estômago? Punhos?",
      "Agora, em voz alta ou sussurrando, diga o que você gostaria de dizer à pessoa. Sem censura. Ninguém está ouvindo.",
      "Respire fundo. Solte os ombros. Relaxe a mandíbula.",
      "Repita: 'Eu tenho o direito de sentir raiva. E tenho o direito de expressá-la de forma saudável.'",
    ],
  },
  pattern3: {
    title: "Dinâmica: Soltar o Controle",
    steps: [
      "Feche os olhos. 3 respirações lentas.",
      "Pense em algo que você está tentando controlar agora. Uma situação. Uma pessoa. Um resultado.",
      "Sinta a tensão que o controle gera no corpo. Onde está?",
      "Agora imagine soltar. Literalmente abra as mãos. Palmas para cima.",
      "Diga: 'Eu confio que as coisas podem dar certo sem meu controle total.'",
      "Respire. Sinta a leveza de soltar. Mesmo que seja desconfortável. Isso é crescimento.",
    ],
  },
  pattern4: {
    title: "Dinâmica: Criar Segurança Interna",
    steps: [
      "Feche os olhos. Respiração lenta: 5 segundos inspira, 5 segundos expira. 5 ciclos.",
      "Imagine um lugar onde você se sente completamente seguro. Pode ser real ou imaginário.",
      "Veja os detalhes: cores, luz, temperatura, sons. Sinta-se ali.",
      "Coloque a mão no coração. Sinta o calor. Diga: 'Eu estou seguro agora. Aqui. Neste momento.'",
      "Se uma memória difícil aparecer, observe de longe — como assistindo uma tela. Você não está lá. Você está aqui, seguro.",
      "3 respirações finais. Abra os olhos lentamente. Você está seguro.",
    ],
  },
  pattern5: {
    title: "Dinâmica: Reconhecer a Sabotagem",
    steps: [
      "Feche os olhos. 3 respirações profundas.",
      "Pense na última vez que você sabotou algo bom na sua vida. O que aconteceu?",
      "Identifique o pensamento que veio antes da sabotagem. 'Eu não mereço.' 'Vai dar errado.' 'Sou uma fraude.'",
      "Agora reconheça: isso não é VOCÊ falando. É o padrão. É o circuito antigo.",
      "Diga em voz alta: 'Eu reconheço a sabotagem. E eu escolho diferente hoje.'",
      "Mão no coração. Repita: 'Eu mereço coisas boas. Eu posso aceitar coisas boas.'",
    ],
  },
};

const GuidedPracticeInvite = ({ dominantPattern, darkMode }: GuidedPracticeInviteProps) => {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const practice = PRACTICE_CONTENT[dominantPattern || "pattern1"];

  useEffect(() => {
    if (overlayOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [overlayOpen]);

  const handleClose = () => {
    setOverlayOpen(false);
    setCurrentStep(0);
  };

  return (
    <>
      {/* Invite Card */}
      <div
        style={{
          background: "#1A1520",
          borderRadius: 12,
          padding: 28,
          marginTop: 32,
          maxWidth: 680,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <h4
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 20,
            color: "white",
            marginBottom: 8,
          }}
        >
          Quer fazer o primeiro passo agora?
        </h4>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: "rgba(255,255,255,0.6)",
            marginBottom: 20,
            lineHeight: 1.6,
          }}
        >
          Uma das dinâmicas de crise{practice ? " adaptada para o seu padrão" : ""}. Leva 4 minutos.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={() => { setOverlayOpen(true); setCurrentStep(0); }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              padding: "12px 24px",
              borderRadius: 8,
              border: "none",
              background: "#C4622D",
              color: "white",
              cursor: "pointer",
            }}
          >
            Sim, quero tentar
          </button>
          <button
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              padding: "12px 24px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "transparent",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
            }}
          >
            Vou fazer depois
          </button>
        </div>
      </div>

      {/* Overlay */}
      {overlayOpen &&
        createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(26,21,32,0.96)",
              zIndex: 200,
              padding: 24,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              onClick={handleClose}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.5)",
                cursor: "pointer",
              }}
            >
              <X size={24} />
            </button>

            <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
              <h3
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 24,
                  color: "white",
                  marginBottom: 32,
                }}
              >
                {practice.title}
              </h3>

              {/* Current step */}
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 12,
                  padding: 28,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    color: "#00BCD4",
                    letterSpacing: "0.2em",
                    marginBottom: 16,
                  }}
                >
                  PASSO {currentStep + 1} DE {practice.steps.length}
                </div>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 18,
                    lineHeight: 1.8,
                    color: "rgba(255,255,255,0.85)",
                    margin: 0,
                  }}
                >
                  {practice.steps[currentStep]}
                </p>
              </div>

              {/* Navigation */}
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep((s) => s - 1)}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      padding: "10px 20px",
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.2)",
                      background: "transparent",
                      color: "rgba(255,255,255,0.6)",
                      cursor: "pointer",
                    }}
                  >
                    Anterior
                  </button>
                )}
                {currentStep < practice.steps.length - 1 ? (
                  <button
                    onClick={() => setCurrentStep((s) => s + 1)}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      fontWeight: 600,
                      padding: "10px 24px",
                      borderRadius: 8,
                      border: "none",
                      background: "#C4622D",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Próximo passo
                  </button>
                ) : (
                  <button
                    onClick={handleClose}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      fontWeight: 600,
                      padding: "10px 24px",
                      borderRadius: 8,
                      border: "none",
                      background: "#00BCD4",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Concluir ✓
                  </button>
                )}
              </div>

              {/* Progress dots */}
              <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 20 }}>
                {practice.steps.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: i <= currentStep ? "#C4622D" : "rgba(255,255,255,0.15)",
                      transition: "background 0.3s ease",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>,
          document.body
        )
      }
    </>
  );
};

export default GuidedPracticeInvite;
