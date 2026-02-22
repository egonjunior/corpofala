import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (authError) {
      setError("Credenciais inválidas.");
      setLoading(false);
      return;
    }

    // Check admin role
    const { data: isAdmin } = await supabase.rpc("is_admin");

    if (!isAdmin) {
      await supabase.auth.signOut();
      setError("Acesso restrito a administradores.");
      setLoading(false);
      return;
    }

    navigate("/admin");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 15,
    color: "#fff",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#0a0a0a" }}>
      <div className="flex flex-col items-center mb-8">
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 48, height: 48, background: "rgba(196,98,45,0.15)", border: "1px solid rgba(196,98,45,0.25)" }}
        >
          <Shield size={22} color="#C4622D" />
        </div>
        <span className="mt-3" style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,255,255,0.35)" }}>
          PAINEL ADMINISTRATIVO
        </span>
      </div>

      <div
        className="w-full"
        style={{
          maxWidth: 360,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: "40px 32px",
        }}
      >
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "#fff", marginBottom: 8 }}>
          Acesso restrito
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,0.45)", marginBottom: 28 }}>
          Área exclusiva para administração.
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", display: "block", marginBottom: 6 }}>
              E-MAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "#C4622D"; e.target.style.boxShadow = "0 0 0 3px rgba(196,98,45,0.15)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          <div>
            <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", display: "block", marginBottom: 6 }}>
              SENHA
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={(e) => { e.target.style.borderColor = "#C4622D"; e.target.style.boxShadow = "0 0 0 3px rgba(196,98,45,0.15)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.35)" }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-center" style={{ color: "#ef4444" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full transition-colors disabled:opacity-60"
            style={{ height: 48, background: "#C4622D", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#fff", border: "none", cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#B5561F")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#C4622D")}
          >
            {loading ? "VERIFICANDO..." : "ACESSAR PAINEL"}
          </button>
        </form>

        <p className="text-center mt-8" style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.2)" }}>
          corpofala.com · acesso restrito
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
