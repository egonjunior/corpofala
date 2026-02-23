import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'https://esm.sh/web-push@3.6.4'

const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY') || ''
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') || ''
const VAPID_SUBJECT = 'mailto:suporte@corpofala.com'

webpush.setVapidDetails(
    VAPID_SUBJECT,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
);

// Três mensagens diárias possíveis via argumento ?type=educativo|frase|dinamica
const getMessageByType = (type: string) => {
    switch (type) {
        case 'educativo':
            return {
                title: 'CorpoFala: Regulação Emocional',
                body: 'Lembrete: Você não é a sua ansiedade. Respirar profundamente ativa seu sistema parassimpático.',
                url: '/app/dashboard'
            };
        case 'frase':
            return {
                title: 'Respira.',
                body: 'O que o seu corpo está tentando te dizer hoje?',
                url: '/app/dashboard'
            };
        case 'dinamica':
            return {
                title: 'Precisa de um minuto?',
                body: 'Se o dia estiver pesado, venha fazer o Abraço da Borboleta conosco.',
                url: '/app/dinamicas'
            };
        default:
            return {
                title: 'CorpoFala',
                body: 'Um momento de pausa para você.',
                url: '/app/dashboard'
            };
    }
}

serve(async (req) => {
    try {
        const url = new URL(req.url);
        const type = url.searchParams.get('type') || 'frase';

        // Auth Supabase client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        // Apenas admin/cron jobs deveriam chamar essa rota em produção (validação de role/secret recomendada)
        // Buscando todos os assinantes
        const { data: subscriptions, error } = await supabaseClient
            .from('push_subscriptions')
            .select('*')

        if (error) throw error;
        if (!subscriptions || subscriptions.length === 0) {
            return new Response(JSON.stringify({ message: "No subscriptions found." }), {
                headers: { "Content-Type": "application/json" },
                status: 200,
            });
        }

        const messagePayload = getMessageByType(type);
        let successCount = 0;
        let failCount = 0;

        // Dispara via Web Push em paralelo
        const promises = subscriptions.map(async (sub) => {
            try {
                await webpush.sendNotification(
                    {
                        endpoint: sub.endpoint,
                        keys: {
                            auth: sub.auth_key,
                            p256dh: sub.p256dh_key
                        }
                    },
                    JSON.stringify(messagePayload)
                );
                successCount++;
            } catch (err: any) {
                console.error('Failed pushing to', sub.endpoint, err);
                // Clean up invalid subscriptions if statusCode is 410 (Gone) or 404 (Not Found)
                if (err.statusCode === 410 || err.statusCode === 404) {
                    await supabaseClient.from('push_subscriptions').delete().eq('id', sub.id);
                }
                failCount++;
            }
        });

        await Promise.all(promises);

        return new Response(JSON.stringify({
            message: `Push sent! Success: ${successCount}, Failed: ${failCount}`,
            payload: messagePayload
        }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        })

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { "Content-Type": "application/json" },
            status: 400,
        })
    }
})
