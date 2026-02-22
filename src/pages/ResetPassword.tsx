import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CorpoFalaIcon } from "@/components/lp2/CorpoFalaLogo";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    // Check if hash contains type=recovery
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async () => {
    if (password.length < 8) { setError("Senha deve ter pelo menos 8 caracteres."); return; }
    if (password !== confirm) { setError("As senhas não coincidem."); return; }

    setLoading(true);
    setError("");

    const { error: updateError } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
  };

  if (!isRecovery && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#F2EDE4" }}>
        <div className="text-center max-w-sm">
          <CorpoFalaIcon size={28} className="mx-auto mb-4" />
          <h1 className="font-serif text-2xl text-corpo-dark mb-2">Link inválido</h1>
          <p className="font-sans text-sm text-corpo-subtle">
            Este link de recuperação expirou ou é inválido. Solicite um novo na página de login.
          </p>
          <a href="/" className="inline-block mt-6 font-sans text-sm text-corpo-terra underline">
            Voltar ao início
          </a>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#F2EDE4" }}>
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={36} className="text-green-600" />
          </div>
          <h1 className="font-serif text-2xl text-corpo-dark mb-2">Senha atualizada!</h1>
          <p className="font-sans text-sm text-corpo-subtle mb-6">Sua senha foi alterada com sucesso.</p>
          <a
            href="/app/ebook"
            className="inline-block px-8 py-3 rounded-lg bg-corpo-terra text-white font-sans font-semibold text-sm no-underline"
          >
            Acessar a plataforma
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#F2EDE4" }}>
      <div className="bg-corpo-warm rounded-[20px] w-full max-w-[460px] shadow-[0_24px_80px_rgba(0,0,0,0.15)]" style={{ padding: "48px 40px" }}>
        <CorpoFalaIcon size={28} className="mb-4" />
        <h1 className="font-serif text-[28px] text-corpo-dark mb-1">Nova senha</h1>
        <p className="font-sans text-sm text-corpo-subtle mb-6">Escolha uma nova senha para sua conta.</p>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <label className="font-mono text-[10px] text-corpo-subtle tracking-[0.1em] block mb-1.5">NOVA SENHA</label>
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className="w-full bg-white border border-corpo-text/15 rounded-[10px] px-4 py-3.5 pr-12 font-sans text-[15px] text-corpo-text outline-none focus:border-corpo-terra focus:shadow-[0_0_0_3px_rgba(196,98,45,0.10)] transition-all"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-[38px] bg-transparent border-none cursor-pointer">
              {showPw ? <EyeOff size={16} color="#B0A090" /> : <Eye size={16} color="#B0A090" />}
            </button>
          </div>

          <div>
            <label className="font-mono text-[10px] text-corpo-subtle tracking-[0.1em] block mb-1.5">CONFIRMAR SENHA</label>
            <input
              type={showPw ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repita a senha"
              className="w-full bg-white border border-corpo-text/15 rounded-[10px] px-4 py-3.5 font-sans text-[15px] text-corpo-text outline-none focus:border-corpo-terra focus:shadow-[0_0_0_3px_rgba(196,98,45,0.10)] transition-all"
            />
          </div>

          {error && <p className="font-sans text-sm text-red-400 text-center">{error}</p>}

          <button
            onClick={handleReset}
            disabled={loading}
            className="w-full py-4 rounded-[10px] bg-corpo-terra font-sans text-base font-semibold text-white border-none cursor-pointer shadow-[0_4px_16px_rgba(196,98,45,0.30)] hover:bg-[#B5561F] hover:-translate-y-px transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Atualizando..." : "Atualizar senha"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
