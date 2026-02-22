import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate webhook secret — headers only (no query params to avoid log exposure)
    const webhookSecret = Deno.env.get("CAKTO_WEBHOOK_SECRET");
    const authHeader = req.headers.get("x-webhook-secret") || req.headers.get("authorization");

    if (webhookSecret && authHeader !== webhookSecret) {
      console.error("Invalid webhook secret");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const email =
      body?.email ||
      body?.buyer_email ||
      body?.customer?.email ||
      body?.data?.buyer?.email ||
      body?.data?.customer?.email;

    if (!email) {
      console.error("No email found in webhook payload:", JSON.stringify(body));
      return new Response(
        JSON.stringify({ error: "No email in payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch profile before update to get name and user_id
    const { data: profileData } = await supabase
      .from("profiles")
      .select("name, access_status, user_id")
      .eq("email", normalizedEmail)
      .single();

    // Update access status
    const { error } = await supabase
      .from("profiles")
      .update({ access_status: "active" })
      .eq("email", normalizedEmail);

    if (error) {
      console.error("Error updating profile:", error);
      return new Response(
        JSON.stringify({ error: "Update failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Access activated for: ${normalizedEmail}`);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // ── Email 1: Disparar imediatamente (fire-and-forget) ──
    fetch(`${supabaseUrl}/functions/v1/send-payment-confirmed-email`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: profileData?.name || "", email: normalizedEmail }),
    }).catch((e) => console.error("Email 1 dispatch error:", e));

    // ── Emails 2–6: Inserir na fila com scheduled_at calculado ──
    const now = new Date();

    const emailsToQueue = [
      {
        email_number: 2,
        subject: "Eu entendo.",
        scheduled_at: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),   // +24h
      },
      {
        email_number: 3,
        subject: "Quando foi a última vez?",
        scheduled_at: new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString(),   // +72h
      },
      {
        email_number: 4,
        subject: "Você não tá sozinha nisso.",
        scheduled_at: new Date(now.getTime() + 120 * 60 * 60 * 1000).toISOString(),  // +120h
      },
      {
        email_number: 5,
        subject: "Uma semana.",
        scheduled_at: new Date(now.getTime() + 168 * 60 * 60 * 1000).toISOString(),  // +168h
      },
      {
        email_number: 6,
        subject: "Última conversa.",
        scheduled_at: new Date(now.getTime() + 336 * 60 * 60 * 1000).toISOString(),  // +336h (14 dias)
      },
    ].map((e) => ({
      ...e,
      email: normalizedEmail,
      user_id: profileData?.user_id || null,
      status: "pending",
    }));

    const { error: queueError } = await supabase
      .from("email_queue")
      .insert(emailsToQueue);

    if (queueError) {
      console.error("Error inserting email queue:", queueError);
      // Non-fatal: access was already granted, just log the error
    } else {
      console.log(`Queued emails 2–6 for: ${normalizedEmail}`);
    }

    return new Response(
      JSON.stringify({ success: true, email: normalizedEmail }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
