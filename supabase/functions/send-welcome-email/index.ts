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

    const firstName = name?.split(" ")[0] || "você";

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sua conta foi criada — O Corpo Fala</title>
</head>
<body style="margin:0;padding:0;background:#0F0D16;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0F0D16;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:540px;background:#1A1625;border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:36px 40px 28px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
              <div style="width:40px;height:40px;background:#C4622D;border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
                <span style="color:#fff;font-size:20px;line-height:40px;display:block;">✦</span>
              </div>
              <p style="margin:0;font-family:monospace;font-size:10px;letter-spacing:0.2em;color:rgba(255,255,255,0.25);text-transform:uppercase;">O Corpo Fala</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 20px;font-family:'Georgia',serif;font-size:28px;color:rgba(255,255,255,0.92);font-weight:normal;line-height:1.3;">
                Sua conta foi criada, ${firstName}.
              </h1>
              <p style="margin:0 0 28px;font-family:sans-serif;font-size:15px;color:rgba(255,255,255,0.50);line-height:1.7;">
                Falta só um passo: finalize o pagamento para liberar seu acesso completo ao livro interativo e todas as dinâmicas.
              </p>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://pay.cakto.com.br/z8n5fua_774989"
                       style="display:inline-block;background:#C4622D;color:#fff;font-family:sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:8px;letter-spacing:0.08em;text-transform:uppercase;">
                      FINALIZAR PAGAMENTO — R$47,90
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;font-family:sans-serif;font-size:12px;color:rgba(255,255,255,0.25);text-align:center;letter-spacing:0.08em;">
                7 DIAS DE GARANTIA · ACESSO IMEDIATO APÓS PAGAMENTO
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <p style="margin:0;font-family:sans-serif;font-size:11px;color:rgba(255,255,255,0.20);line-height:1.6;">
                Você recebeu este e-mail porque criou uma conta em ocorpofala.com.br.<br>
                Se não foi você, ignore esta mensagem.
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
        subject: "Sua conta foi criada — finalize o pagamento",
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

    console.log(`Welcome email sent to ${email}`, data.id);
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
