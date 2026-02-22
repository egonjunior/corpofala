import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { translateAuthError, isRateLimitError } from "@/lib/translateAuthError";
import { useAuth } from "@/contexts/AuthContext";

const HeartWaveIcon = ({ size = 36, color = "#C4622D" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="3.2" fill={color} />
    <circle cx="16" cy="16" r="7.5" stroke={color} strokeWidth="1.2" opacity="0.30" />
    <circle cx="16" cy="16" r="12" stroke={color} strokeWidth="1" opacity="0.12" />
  </svg>
);

const AppLogin = () => {
  const navigate = useNavigate();
  const { user, accessStatus, accessLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Navega apenas quando o estado de auth estiver completamente resolvido
  useEffect(() => {
    if (!user || accessLoading) return;
    if (accessStatus === "active") {
      const welcomeSeen = localStorage.getItem("welcomeSeen") === "true";
      navigate(welcomeSeen ? "/app/dashboard" : "/app/bemvindo", { replace: true });
    } else if (accessStatus === "pending") {
      navigate("/app/acesso-pendente", { replace: true });
    }
  }, [user, accessStatus, accessLoading, navigate]);

  useEffect(() => {
    return () => { if (cooldownRef.current) clearInterval(cooldownRef.current); };
  }, []);

  const startCooldown = useCallback(() => {
    setCooldown(60);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); cooldownRef.current = null; return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const isDisabled = loading || cooldown > 0;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (authError) {
      setError(translateAuthError(authError.message));
      if (isRateLimitError(authError.message)) startCooldown();
      setLoading(false);
      return;
    }
    // Navegação tratada pelo useEffect acima — não navegar aqui
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    background: "#F2EDE4",
    border: "1px solid #D4C9BF",
    borderRadius: 8,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 15,
    color: "#1A1520",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#F2EDE4" }}>
      <div className="flex flex-col items-center mb-8">
        <HeartWaveIcon />
        <span className="mt-3" style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: "0.25em", color: "#8A7A70" }}>
          CORPOFALA
        </span>
      </div>

      <div className="w-full" style={{ maxWidth: 360, background: "#fff", borderRadius: 12, boxShadow: "0 2px 24px rgba(26,21,32,0.08)", padding: "40px 32px" }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "#1A1520", marginBottom: 8 }}>
          Bem-vindo de volta.
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, color: "#8A7A70", marginBottom: 28 }}>
          Entre com os dados usados na compra.
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "#8A7A70", display: "block", marginBottom: 6 }}>
              E-MAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "#C4622D"; e.target.style.boxShadow = "0 0 0 3px rgba(196,98,45,0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#D4C9BF"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          <div>
            <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "#8A7A70", display: "block", marginBottom: 6 }}>
              SENHA
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={(e) => { e.target.style.borderColor = "#C4622D"; e.target.style.boxShadow = "0 0 0 3px rgba(196,98,45,0.1)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#D4C9BF"; e.target.style.boxShadow = "none"; }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#8A7A70" }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          {cooldown > 0 && (
            <p className="text-xs text-center" style={{ color: "#8A7A70" }}>
              Tente novamente em <strong>{cooldown}s</strong>
            </p>
          )}

          <button
            type="submit"
            disabled={isDisabled}
            className="w-full transition-colors disabled:opacity-60"
            style={{ height: 48, background: "#C4622D", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#fff", border: "none", cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#B5561F")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#C4622D")}
          >
            {loading ? "ENTRANDO..." : cooldown > 0 ? `AGUARDE ${cooldown}S` : "ENTRAR"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{ background: "#D4C9BF" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#B0A090" }}>AINDA NÃO TEM ACESSO?</span>
          <div className="flex-1 h-px" style={{ background: "#D4C9BF" }} />
        </div>

        <a href="/experiencia" className="block text-center" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#C4622D", textDecoration: "underline" }}>
          Conhecer o produto →
        </a>

        <p className="text-center mt-8" style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#B0A090" }}>
          corpofala.com · @corpofala.oficial
        </p>
      </div>
    </div>
  );
};

export default AppLogin;
