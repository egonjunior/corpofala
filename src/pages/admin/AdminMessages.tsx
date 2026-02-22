import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mail, Users, User, X, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  title: string;
  body: string;
  recipient_id: string | null;
  created_at: string;
}

interface Profile {
  user_id: string;
  name: string | null;
  email: string | null;
}

const AdminMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [recipientId, setRecipientId] = useState<string>("all");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages(data || []);
    setLoading(false);
  };

  const fetchProfiles = async () => {
    const { data } = await supabase.from("profiles").select("user_id, name, email");
    setProfiles(data || []);
  };

  useEffect(() => {
    fetchMessages();
    fetchProfiles();
  }, []);

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error("Preencha título e mensagem.");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("messages").insert({
      sender_id: user!.id,
      recipient_id: recipientId === "all" ? null : recipientId,
      title: title.trim(),
      body: body.trim(),
    });
    if (error) {
      toast.error("Erro ao enviar: " + error.message);
    } else {
      toast.success("Mensagem enviada!");
      setComposing(false);
      setTitle("");
      setBody("");
      setRecipientId("all");
      fetchMessages();
    }
    setSending(false);
  };

  const getRecipientLabel = (rid: string | null) => {
    if (!rid) return "Todos os usuários";
    const p = profiles.find((pr) => pr.user_id === rid);
    return p?.name || p?.email || rid.slice(0, 8);
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mensagens</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Envie comunicados para os usuários
          </p>
        </div>
        <Button onClick={() => setComposing(true)} className="gap-2">
          <Send size={16} />
          Nova Mensagem
        </Button>
      </div>

      {/* Compose modal */}
      {composing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-xl border border-border shadow-xl w-full max-w-lg mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Nova Mensagem</h2>
              <button onClick={() => setComposing(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Recipient */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Destinatário</label>
                <div className="relative">
                  <select
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 pr-8 text-sm appearance-none"
                  >
                    <option value="all">📢 Todos os usuários</option>
                    {profiles.map((p) => (
                      <option key={p.user_id} value={p.user_id}>
                        {p.name || p.email || p.user_id.slice(0, 8)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-3 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Assunto</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Novo conteúdo disponível"
                />
              </div>

              {/* Body */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Mensagem</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Escreva sua mensagem..."
                  rows={5}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <Button onClick={handleSend} disabled={sending} className="w-full gap-2">
                <Send size={16} />
                {sending ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Messages list */}
      <div className="space-y-2">
        {loading ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Carregando...</p>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Mail size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">Nenhuma mensagem enviada ainda.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
            >
              <div className="mt-0.5">
                {msg.recipient_id ? (
                  <User size={16} className="text-muted-foreground" />
                ) : (
                  <Users size={16} className="text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground truncate">{msg.title}</span>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                    {new Date(msg.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{msg.body}</p>
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  Para: {getRecipientLabel(msg.recipient_id)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
