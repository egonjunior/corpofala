import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AppHeader from "@/components/app/AppHeader";
import AppTabBar from "@/components/app/AppTabBar";
import PulseLoader from "@/components/app/PulseLoader";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Instagram } from "lucide-react";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.08 },
  }),
};

const AppProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [instagram, setInstagram] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("name, email, phone, birthday, instagram")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone((data as any).phone || "");
        setBirthday(data.birthday || "");
        setInstagram(data.instagram || "");
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        name: name || null,
        phone: (phone || null) as any,
        birthday: birthday || null,
        instagram: instagram || null,
      })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Erro ao salvar. Tente novamente.");
    } else {
      toast.success("Perfil atualizado!");
    }
  };

  const labelStyle = {
    fontFamily: "'Space Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.12em",
    color: "#8A7A70",
    marginBottom: 6,
    display: "block" as const,
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(26,21,32,0.10)",
    background: "rgba(255,255,255,0.70)",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 15,
    color: "#1A1520",
    outline: "none",
  };

  const readOnlyStyle = {
    ...inputStyle,
    background: "rgba(26,21,32,0.04)",
    color: "#8A7A70",
    cursor: "not-allowed" as const,
  };

  const ebookProgress = parseInt(localStorage.getItem("ebookProgress") || "0", 10);
  const dynamicsSessions = JSON.parse(localStorage.getItem("dynamicsHistory") || "[]").length;
  const calRaw = localStorage.getItem("calendarProgress");
  const calDone = calRaw ? JSON.parse(calRaw).weeks?.flat().filter(Boolean).length || 0 : 0;
  const initial = (name || email || "U").charAt(0).toUpperCase();
  const avatarHue = (name || email || "U").charCodeAt(0) * 7 % 360;

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "#F2EDE4" }}>
        <AppHeader />
        <div className="pt-[72px] pb-24 px-5 max-w-lg mx-auto flex items-center justify-center min-h-[60vh]">
          <PulseLoader text="Carregando perfil..." />
        </div>
        <AppTabBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F2EDE4" }}>
      <AppHeader />
      <div className="pt-[72px] pb-24 px-5 max-w-lg mx-auto">
        <motion.button
          variants={fadeUp} initial="hidden" animate="visible" custom={0}
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 mb-6 text-sm"
          style={{ color: "#8A7A70", fontFamily: "'DM Sans', sans-serif", background: "none", border: "none", cursor: "pointer" }}
        >
          <ArrowLeft size={16} /> Voltar
        </motion.button>

        {/* Avatar + Name Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="flex flex-col items-center mb-8">
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: 80, height: 80,
              background: `linear-gradient(135deg, hsl(${avatarHue}, 45%, 40%), hsl(${avatarHue + 40}, 50%, 50%))`,
              boxShadow: `0 4px 20px hsla(${avatarHue}, 45%, 40%, 0.25)`,
            }}
          >
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: "#fff" }}>{initial}</span>
          </div>
          <h1 className="mt-3" style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "#1A1520" }}>
            {name || "Seu perfil"}
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#8A7A70", marginTop: 2 }}>
            {email}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="grid grid-cols-3 gap-3 mb-8">
          {[
            { num: `${ebookProgress}%`, label: "ebook" },
            { num: String(dynamicsSessions), label: "práticas" },
            { num: `${calDone}/28`, label: "dias" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(26,21,32,0.06)" }}>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#C4622D" }}>{s.num}</p>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.12em", color: "#8A7A70", marginTop: 2 }}>{s.label.toUpperCase()}</p>
            </div>
          ))}
        </motion.div>

        <div className="space-y-5">
          {/* Name - editable */}
          <div>
            <label style={labelStyle}>NOME</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              style={inputStyle}
            />
          </div>

          {/* Email - read only */}
          <div>
            <label style={labelStyle}>E-MAIL</label>
            <input value={email} readOnly style={readOnlyStyle} />
          </div>

          {/* Phone - editable */}
          <div>
            <label style={labelStyle}>TELEFONE / WHATSAPP</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              style={inputStyle}
            />
          </div>

          {/* Birthday - editable */}
          <div>
            <label style={labelStyle}>DATA DE NASCIMENTO</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              style={inputStyle}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Instagram - editable */}
          <div>
            <label style={labelStyle}>INSTAGRAM</label>
            <div className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#8A7A70", fontFamily: "'DM Sans', sans-serif", fontSize: 15 }}
              >
                @
              </span>
              <input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value.replace(/^@/, "").slice(0, 30))}
                placeholder="seu.usuario"
                style={{ ...inputStyle, paddingLeft: 28 }}
                maxLength={30}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-8 flex items-center justify-center gap-2"
          style={{
            padding: "14px 24px",
            borderRadius: 12,
            background: "#C4622D",
            color: "#FFFFFF",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            fontWeight: 600,
            border: "none",
            cursor: saving ? "wait" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Salvando..." : (
            <>
              <Check size={18} />
              Salvar alterações
            </>
          )}
        </button>
      </div>
      <AppTabBar />
    </div>
  );
};

export default AppProfile;
