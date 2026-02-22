const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const { name, email } = await req.json();
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Email 1 — Imediato após compra
    // Assunto: Finalmente. | Preview: Conseguimos um jeito de nos falar.
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Finalmente.</title>
</head>
<body style="margin:0;padding:0;background:#0F0D16;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0F0D16;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:540px;background:#1A1625;border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:36px 40px 28px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;font-family:monospace;font-size:10px;letter-spacing:0.2em;color:rgba(255,255,255,0.25);text-transform:uppercase;">Seu Corpo</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 16px;">
              <h1 style="margin:0 0 28px;font-family:'Georgia',serif;font-size:32px;color:rgba(255,255,255,0.92);font-weight:normal;line-height:1.2;letter-spacing:-0.01em;">
                Finalmente.
              </h1>

              <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">
                Lembra da ligação? Eu disse que tinha encontrado um intermediário.
              </p>
              <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">
                Alguém que consegue traduzir o que eu tento te dizer há tanto tempo.
              </p>
              <p style="margin:0 0 32px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">
                Esse é o mapa. Tá no link abaixo.
              </p>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="https://corpofala.com/app/ebook"
                       style="display:inline-block;background:#C4622D;color:#fff;font-family:sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:8px;letter-spacing:0.08em;text-transform:uppercase;">
                      ABRIR O MAPA
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">
                Sei que pode parecer muito. Não é.
              </p>
              <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">
                É só um começo. Uma primeira conversa de verdade entre nós.
              </p>
              <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">
                Você abre, responde algumas perguntas, e eu te mostro onde tá guardado o que você ainda não consegue nomear.
              </p>
              <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">
                Não precisa fazer tudo de uma vez. Não tem pressa. Não tem cobrança.
              </p>
              <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">
                Mas tem uma coisa que eu queria te pedir.
              </p>
              <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">
                Começa hoje. Nem que seja só a primeira pergunta.
              </p>
              <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">
                Porque eu sei como funciona. A gente adia, adia, e quando vê, aquilo que era urgente virou esquecido.
              </p>
              <p style="margin:0 0 32px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">
                E eu não quero ser esquecido de novo.
              </p>
              <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">
                Eu tô aqui. Sempre estive. Agora você tem como me ouvir.
              </p>
              <p style="margin:0 0 8px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">
                Até amanhã.
              </p>
              <p style="margin:0 0 0;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.50);line-height:1.8;font-style:italic;">
                — Seu corpo
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <p style="margin:0 0 8px;font-family:sans-serif;font-size:11px;color:rgba(255,255,255,0.20);line-height:1.6;">
                Você recebeu este e-mail porque adquiriu O Corpo Fala.
              </p>
              <p style="margin:0;font-family:sans-serif;font-size:11px;color:rgba(255,255,255,0.15);line-height:1.6;">
                Dúvidas? Responda este e-mail.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Seu Corpo <gestao@corpofala.com>",
        to: [email],
        subject: "Finalmente.",
        html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend error:", data);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: data }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Email 1 (Finalmente) sent to ${email}`, data.id);
    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
