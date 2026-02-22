import { useState, useEffect, useRef, useCallback } from "react";
import { Eye, EyeOff, CheckCircle2, Mail } from "lucide-react";
import { CorpoFalaIcon } from "./CorpoFalaLogo";
import { supabase } from "@/integrations/supabase/client";
import { translateAuthError, isRateLimitError } from "@/lib/translateAuthError";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialTab?: "create" | "login";
}

const AuthModal = ({ open, onClose, initialTab = "create" }: AuthModalProps) => {
  const [tab, setTab] = useState<"create" | "login" | "forgot">(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successEmail, setSuccessEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [forgotSent, setForgotSent] = useState(false);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (open) { setTab(initialTab); setSuccess(false); setError(""); setForgotSent(false); }
  }, [open, initialTab]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  // Cooldown timer cleanup
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

  if (!open) return null;

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordStrength = password.length >= 12 ? 3 : password.length >= 8 ? 2 : password.length >= 4 ? 1 : 0;
  const isDisabled = loading || cooldown > 0;

  const handleError = (err: string) => {
    const translated = translateAuthError(err);
    setError(translated);
    if (isRateLimitError(err)) startCooldown();
  };

  const handleCreate = async () => {
    if (!email || !password) { setError("Preencha todos os campos."); return; }
    if (!emailValid) { setError("E-mail inválido."); return; }
    if (password.length < 8) { setError("Senha deve ter pelo menos 8 caracteres."); return; }

    setLoading(true);
    setError("");

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: {} },
    });

    setLoading(false);

    if (signUpError) {
      handleError(signUpError.message);
      return;
    }

    setSuccessEmail(email);
    setSuccess(true);

    // Send welcome email (fire-and-forget)
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    fetch(`https://${projectId}.supabase.co/functions/v1/send-welcome-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => { });
  };

  const handleLogin = async () => {
    if (!email || !password) { setError("Preencha todos os campos."); return; }
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setLoading(false);
      handleError(authError.message);
      return;
    }

    const redirect = sessionStorage.getItem("redirectAfterAuth");
    if (redirect) {
      sessionStorage.removeItem("redirectAfterAuth");
      window.location.href = redirect;
    } else {
      window.location.href = "/app/ebook";
    }
  };

  const handleConfirmedLogin = async () => {
    if (!password) return;
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: successEmail,
      password,
    });

    setLoading(false);

    if (authError) {
      handleError(authError.message);
      return;
    }

    const redirect = sessionStorage.getItem("redirectAfterAuth");
    if (redirect) {
      sessionStorage.removeItem("redirectAfterAuth");
      window.location.href = redirect;
    } else {
      window.location.href = "/app/welcome";
    }
  };

  const handleForgotPassword = async () => {
    if (!email) { setError("Informe seu e-mail."); return; }
    if (!emailValid) { setError("E-mail inválido."); return; }
    setLoading(true);
    setError("");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (resetError) { handleError(resetError.message); return; }
    setForgotSent(true);
  };

  // Success screen after signup — redirect to payment
  if (success) {
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
        style={{ background: "rgba(10,8,18,0.92)", backdropFilter: "blur(16px) saturate(1.2)" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="relative bg-corpo-warm rounded-[20px] w-full max-w-[460px] shadow-[0_24px_80px_rgba(0,0,0,0.40)] text-center" style={{ padding: "48px 40px" }}>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 size={36} className="text-green-600" />
            </div>
          </div>

          <h2 className="font-serif text-[26px] text-corpo-dark mb-2">Conta criada!</h2>

          <p className="font-sans text-sm text-corpo-subtle mt-1 mb-2 leading-relaxed">
            Agora finalize o pagamento para liberar seu acesso completo ao livro interativo e todas as dinâmicas.
          </p>

          <p className="font-mono text-[11px] text-corpo-terra/80 tracking-[0.06em] mb-6">
            Após o pagamento, seu acesso é liberado automaticamente.
          </p>

          <a
            href="https://pay.cakto.com.br/z8n5fua_774989"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 rounded-[10px] bg-corpo-terra font-sans text-base font-semibold text-white border-none cursor-pointer shadow-[0_4px_16px_rgba(196,98,45,0.30)] hover:bg-[#B5561F] hover:-translate-y-px transition-all no-underline text-center"
          >
            Finalizar pagamento — R$47,90
          </a>

          <span className="block font-mono text-[10px] text-corpo-subtle/50 tracking-[0.1em] mt-3">
            7 DIAS DE GARANTIA · ACESSO IMEDIATO APÓS CONFIRMAÇÃO
          </span>

          <button
            onClick={onClose}
            className="mt-4 font-sans text-sm text-corpo-subtle underline bg-transparent border-none cursor-pointer hover:text-corpo-dark transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
      style={{ background: "rgba(10,8,18,0.92)", backdropFilter: "blur(16px) saturate(1.2)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-corpo-warm rounded-[20px] w-full max-w-[460px] shadow-[0_24px_80px_rgba(0,0,0,0.40)]" style={{ padding: "48px 40px" }}>
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-corpo-text/[0.08] border-none cursor-pointer flex items-center justify-center font-sans text-lg text-corpo-subtle hover:bg-corpo-text/[0.16] transition-colors"
        >
          ✕
        </button>

        <CorpoFalaIcon size={28} className="mb-4" />
        <h2 className="font-serif text-[28px] text-corpo-dark">
          {tab === "forgot" ? "Recuperar senha" : tab === "create" ? "Criar sua conta" : "Entrar"}
        </h2>
        <p className="font-sans text-sm text-corpo-subtle mt-1">
          {tab === "forgot" ? "Enviaremos um link para redefinir sua senha." : tab === "create" ? "Crie sua conta para acessar." : "Bem-vindo de volta."}
        </p>

        {tab !== "forgot" && (
          <div className="flex w-full bg-corpo-text/[0.06] rounded-[10px] p-1 my-6">
            {(["create", "login"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 py-2.5 rounded-lg border-none cursor-pointer font-sans text-sm transition-all ${tab === t ? "bg-white text-corpo-dark font-semibold shadow-[0_2px_8px_rgba(42,32,53,0.10)]" : "bg-transparent text-corpo-subtle"
                  }`}
              >
                {t === "create" ? "Criar conta" : "Entrar"}
              </button>
            ))}
          </div>
        )}

        {tab === "forgot" && !forgotSent && (
          <div className="flex flex-col gap-4 mt-6">
            <div>
              <label className="font-mono text-[10px] text-corpo-subtle tracking-[0.1em] block mb-1.5">E-MAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-white border border-corpo-text/15 rounded-[10px] px-4 py-3.5 font-sans text-[15px] text-corpo-text outline-none focus:border-corpo-terra focus:shadow-[0_0_0_3px_rgba(196,98,45,0.10)] transition-all"
              />
            </div>
            {error && <p className="font-sans text-sm text-red-400 text-center">{error}</p>}
            <button
              onClick={handleForgotPassword}
              disabled={loading}
              className="w-full py-4 rounded-[10px] bg-corpo-terra font-sans text-base font-semibold text-white border-none cursor-pointer shadow-[0_4px_16px_rgba(196,98,45,0.30)] hover:bg-[#B5561F] hover:-translate-y-px transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </button>
            <button
              onClick={() => { setTab("login"); setError(""); }}
              className="font-sans text-sm text-corpo-subtle underline bg-transparent border-none cursor-pointer hover:text-corpo-dark transition-colors"
            >
              Voltar ao login
            </button>
          </div>
        )}

        {tab === "forgot" && forgotSent && (
          <div className="text-center mt-6">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Mail size={28} className="text-green-600" />
            </div>
            <p className="font-sans text-sm text-corpo-subtle leading-relaxed mb-4">
              Enviamos um link de recuperação para <strong className="text-corpo-dark">{email}</strong>. Verifique sua caixa de entrada.
            </p>
            <button
              onClick={() => { setTab("login"); setError(""); setForgotSent(false); }}
              className="font-sans text-sm text-corpo-terra underline bg-transparent border-none cursor-pointer"
            >
              Voltar ao login
            </button>
          </div>
        )}

        {(tab === "create" || tab === "login") && (
          <div className="flex flex-col gap-4">

            <div>
              <label className="font-mono text-[10px] text-corpo-subtle tracking-[0.1em] block mb-1.5">E-MAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className={`w-full bg-white border rounded-[10px] px-4 py-3.5 font-sans text-[15px] text-corpo-text outline-none transition-all ${email && !emailValid ? "border-red-400 bg-red-50/50" : "border-corpo-text/15 focus:border-corpo-terra focus:shadow-[0_0_0_3px_rgba(196,98,45,0.10)]"
                  }`}
              />
              {email && !emailValid && <span className="font-sans text-xs text-red-400 mt-1 block">E-mail inválido</span>}
            </div>

            <div className="relative">
              <label className="font-mono text-[10px] text-corpo-subtle tracking-[0.1em] block mb-1.5">SENHA</label>
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

              {tab === "create" && password.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className="h-1 flex-1 rounded-full transition-colors"
                      style={{
                        background: passwordStrength >= level
                          ? level === 1 ? "#FF6464" : level === 2 ? "#FF9A6C" : "#00BCD4"
                          : "rgba(42,32,53,0.10)",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {tab === "login" && (
              <button
                onClick={() => { setTab("forgot"); setError(""); }}
                className="font-sans text-xs text-corpo-subtle underline bg-transparent border-none cursor-pointer hover:text-corpo-dark transition-colors text-right -mt-2"
              >
                Esqueceu a senha?
              </button>
            )}

            {error && <p className="font-sans text-sm text-red-400 text-center">{error}</p>}
            {cooldown > 0 && (
              <p className="font-sans text-xs text-corpo-subtle text-center">
                Tente novamente em <strong>{cooldown}s</strong>
              </p>
            )}

            <button
              onClick={tab === "create" ? handleCreate : handleLogin}
              disabled={isDisabled}
              className="w-full py-4 rounded-[10px] bg-corpo-terra font-sans text-base font-semibold text-white border-none cursor-pointer shadow-[0_4px_16px_rgba(196,98,45,0.30)] hover:bg-[#B5561F] hover:-translate-y-px transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Aguarde..." : cooldown > 0 ? `Aguarde ${cooldown}s` : tab === "create" ? "Criar conta e pagar →" : "Entrar →"}
            </button>
          </div>
        )}

        {(tab === "create" || tab === "login") && (
          <p className="font-sans text-xs text-[#B0A090] text-center mt-6">
            Ao criar sua conta você concorda com os{" "}
            <a href="#" className="underline">Termos de Uso</a> e{" "}
            <a href="#" className="underline">Política de Privacidade</a>.
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
