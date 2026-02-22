import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ─── HTML builders para cada email ───────────────────────────────────────────

function buildEmail2Html(): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Eu entendo.</title>
</head>
<body style="margin:0;padding:0;background:#0F0D16;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0F0D16;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:540px;background:#1A1625;border-radius:16px;overflow:hidden;">
        <tr>
          <td style="padding:36px 40px 28px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
            <p style="margin:0;font-family:monospace;font-size:10px;letter-spacing:0.2em;color:rgba(255,255,255,0.25);text-transform:uppercase;">Seu Corpo</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 16px;">
            <h1 style="margin:0 0 28px;font-family:'Georgia',serif;font-size:32px;color:rgba(255,255,255,0.92);font-weight:normal;line-height:1.2;">Eu entendo.</h1>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Abrir o mapa pode dar medo. Porque você já sabe que vai encontrar algo.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">E às vezes é mais fácil continuar sem saber do que encarar o que tá guardado ali.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Eu vivi nisso durante anos. Sentindo mas não querendo ver. Sabendo mas não querendo nomear.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Até que o próprio corpo me forçou. E aí não teve escolha.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Mas você tem escolha agora.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Você pode abrir quando estiver pronta. Sem pressa. Sem julgamento.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Só queria te lembrar de uma coisa.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Enquanto você não olha, eu continuo falando. Do jeito que eu sempre falei.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Dor. Tensão. Ansiedade. Insônia.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Não porque eu quero te machucar. Mas porque é a única forma que eu tenho de te alcançar.</p>
            <p style="margin:0 0 32px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Quando você abre o mapa, a gente para de gritar. E começa a conversar.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr><td align="center">
                <a href="https://corpofala.com/app/ebook" style="display:inline-block;background:#C4622D;color:#fff;font-family:sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:8px;letter-spacing:0.08em;text-transform:uppercase;">COMEÇAR A CONVERSA</a>
              </td></tr>
            </table>
            <p style="margin:0 0 8px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Estarei aqui quando você estiver pronta.</p>
            <p style="margin:0;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.50);line-height:1.8;font-style:italic;">— Seu corpo</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
            <p style="margin:0;font-family:sans-serif;font-size:11px;color:rgba(255,255,255,0.20);line-height:1.6;">Você recebeu este e-mail porque adquiriu O Corpo Fala. Dúvidas? Responda este e-mail.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildEmail3Html(): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quando foi a última vez?</title>
</head>
<body style="margin:0;padding:0;background:#0F0D16;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0F0D16;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:540px;background:#1A1625;border-radius:16px;overflow:hidden;">
        <tr>
          <td style="padding:36px 40px 28px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
            <p style="margin:0;font-family:monospace;font-size:10px;letter-spacing:0.2em;color:rgba(255,255,255,0.25);text-transform:uppercase;">Seu Corpo</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 16px;">
            <h1 style="margin:0 0 28px;font-family:'Georgia',serif;font-size:28px;color:rgba(255,255,255,0.92);font-weight:normal;line-height:1.3;">Quando foi a última vez que você parou pra me ouvir de verdade?</h1>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Não estou falando de perceber a dor. Você já faz isso todo dia.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Estou falando de PERGUNTAR por que a dor tá ali.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">A maioria das pessoas passa a vida inteira me sentindo. Mas nunca me ouvindo.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Sentir é passivo. Ouvir é ativo.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">E eu sei que é difícil. Porque ouvir de verdade significa aceitar que tem algo que você não quer aceitar.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Mas eu queria te dizer uma coisa que ninguém te disse ainda.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Você não precisa resolver tudo de uma vez.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Não precisa "curar" tudo hoje.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Só precisa OUVIR. Nomear. Reconhecer.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;font-style:italic;">"Ah, então é isso que eu guardo aqui. Então é por isso que dói desse jeito."</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Esse reconhecimento já muda algo. Pequeno. Mas real.</p>
            <p style="margin:0 0 32px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">E se você fizer isso por três dias seguidos, vai sentir que o corpo relaxa. Mesmo que seja só um pouco. Porque finalmente alguém tá prestando atenção.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr><td align="center">
                <a href="https://corpofala.com/app/ebook" style="display:inline-block;background:#C4622D;color:#fff;font-family:sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:8px;letter-spacing:0.08em;text-transform:uppercase;">COMEÇAR OS 3 DIAS</a>
              </td></tr>
            </table>
            <p style="margin:0 0 8px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Eu posso esperar quanto tempo for.</p>
            <p style="margin:0 0 8px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Mas sei que você não quer esperar mais.</p>
            <p style="margin:0;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.50);line-height:1.8;font-style:italic;">— Seu corpo</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
            <p style="margin:0;font-family:sans-serif;font-size:11px;color:rgba(255,255,255,0.20);line-height:1.6;">Você recebeu este e-mail porque adquiriu O Corpo Fala. Dúvidas? Responda este e-mail.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildEmail4Html(): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Você não tá sozinha nisso.</title>
</head>
<body style="margin:0;padding:0;background:#0F0D16;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0F0D16;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:540px;background:#1A1625;border-radius:16px;overflow:hidden;">
        <tr>
          <td style="padding:36px 40px 28px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
            <p style="margin:0;font-family:monospace;font-size:10px;letter-spacing:0.2em;color:rgba(255,255,255,0.25);text-transform:uppercase;">Seu Corpo</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 16px;">
            <h1 style="margin:0 0 28px;font-family:'Georgia',serif;font-size:32px;color:rgba(255,255,255,0.92);font-weight:normal;line-height:1.2;">Você não tá sozinha nisso.</h1>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Eu sei que parece que tá. Que todo mundo consegue menos você. Que todo mundo funciona normal e você não.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Mas não é verdade.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">A diferença não é que eles não sentem. É que eles aprenderam a NUMBAR.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Trabalho, distração, álcool, comida, tela, correria.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Tudo pra não sentir o que eu tô tentando dizer.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Você não consegue numbar. E isso não é fraqueza.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">É SENSIBILIDADE.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Você sente mais porque você ESTÁ mais conectada comigo.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">O problema nunca foi sentir demais.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Foi não saber traduzir o que você sente.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">E é por isso que o mapa existe.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Não pra te ensinar a sentir menos.</p>
            <p style="margin:0 0 32px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Mas pra te ensinar a ENTENDER o que você já sente. Aí a sensibilidade vira superpoder. Não maldição.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr><td align="center">
                <a href="https://corpofala.com/app/ebook" style="display:inline-block;background:#C4622D;color:#fff;font-family:sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:8px;letter-spacing:0.08em;text-transform:uppercase;">ENTENDER O QUE EU SINTO</a>
              </td></tr>
            </table>
            <p style="margin:0 0 8px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Você já tem tudo que precisa.</p>
            <p style="margin:0;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.50);line-height:1.8;font-style:italic;">Só falta o mapa.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
            <p style="margin:0;font-family:sans-serif;font-size:11px;color:rgba(255,255,255,0.20);line-height:1.6;">Você recebeu este e-mail porque adquiriu O Corpo Fala. Dúvidas? Responda este e-mail.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildEmail5Html(): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Uma semana.</title>
</head>
<body style="margin:0;padding:0;background:#0F0D16;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0F0D16;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:540px;background:#1A1625;border-radius:16px;overflow:hidden;">
        <tr>
          <td style="padding:36px 40px 28px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
            <p style="margin:0;font-family:monospace;font-size:10px;letter-spacing:0.2em;color:rgba(255,255,255,0.25);text-transform:uppercase;">Seu Corpo</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 16px;">
            <h1 style="margin:0 0 28px;font-family:'Georgia',serif;font-size:32px;color:rgba(255,255,255,0.92);font-weight:normal;line-height:1.2;">Uma semana.</h1>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">E eu ainda tô aqui. Sempre vou estar.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Mas queria te dizer algo importante.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Não importa se você abriu o mapa todo dia ou se ainda não abriu.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Não importa se você fez as dinâmicas ou se só leu.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">O que importa é que você TENTOU.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Você comprou. Você recebeu esses e-mails. Você considerou.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">E isso já é mais do que você fazia antes.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Antes, você ignorava. Empurrava. Fingia que não existia.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Agora você tá aqui. Lendo. Pensando.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Isso já é um passo.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">E se você quiser dar o próximo, eu tô aqui.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Se não quiser agora, eu vou continuar aqui.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Mas tem uma coisa que eu preciso te perguntar.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">O que você tá esperando?</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Não de mim. De você mesma.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Que sinal você tá esperando pra começar de verdade?</p>
            <p style="margin:0 0 32px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Porque eu já dei todos os sinais que eu podia dar. Agora é com você.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr><td align="center">
                <a href="https://corpofala.com/app/ebook" style="display:inline-block;background:#C4622D;color:#fff;font-family:sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:8px;letter-spacing:0.08em;text-transform:uppercase;">COMEÇAR DE VERDADE</a>
              </td></tr>
            </table>
            <p style="margin:0;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.50);line-height:1.8;font-style:italic;">Sem pressa. Sem julgamento. Mas sem adiamento eterno também.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
            <p style="margin:0;font-family:sans-serif;font-size:11px;color:rgba(255,255,255,0.20);line-height:1.6;">Você recebeu este e-mail porque adquiriu O Corpo Fala. Dúvidas? Responda este e-mail.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildEmail6Html(): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Última conversa.</title>
</head>
<body style="margin:0;padding:0;background:#0F0D16;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0F0D16;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:540px;background:#1A1625;border-radius:16px;overflow:hidden;">
        <tr>
          <td style="padding:36px 40px 28px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
            <p style="margin:0;font-family:monospace;font-size:10px;letter-spacing:0.2em;color:rgba(255,255,255,0.25);text-transform:uppercase;">Seu Corpo</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 16px;">
            <h1 style="margin:0 0 28px;font-family:'Georgia',serif;font-size:32px;color:rgba(255,255,255,0.92);font-weight:normal;line-height:1.2;">Última conversa.</h1>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Pelo menos por enquanto.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Eu não vou mais enviar e-mails depois desse.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Não porque eu desisti de você. Mas porque respeito seu tempo.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Se você não tá pronta agora, tudo bem. De verdade.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Às vezes a gente precisa ficar mais tempo na dor antes de decidir sair dela.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Não é julgamento. É processo.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Mas queria te oferecer uma última coisa.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Se você quiser tentar — de verdade, sem pressão — eu te dou uma garantia.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Três dias. Uma dinâmica por dia. Cinco minutos cada.</p>
            <p style="margin:0 0 32px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Se depois de três dias você não sentir NADA, você me responde esse e-mail e eu te devolvo o dinheiro. Sem perguntas. Sem burocracia. Mas você tem que fazer. Não só olhar.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr><td align="center">
                <a href="https://corpofala.com/app/ebook" style="display:inline-block;background:#C4622D;color:#fff;font-family:sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:8px;letter-spacing:0.08em;text-transform:uppercase;">ACEITAR OS 3 DIAS</a>
              </td></tr>
            </table>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Se você não aceitar, eu vou entender.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">E vou continuar aqui, dentro de você, esperando.</p>
            <p style="margin:0 0 18px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Quando você estiver pronta, o mapa vai estar lá.</p>
            <p style="margin:0 0 8px;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.8;">Até lá, cuida de você.</p>
            <p style="margin:0;font-family:'Georgia',serif;font-size:16px;color:rgba(255,255,255,0.50);line-height:1.8;font-style:italic;">— Seu corpo</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
            <p style="margin:0;font-family:sans-serif;font-size:11px;color:rgba(255,255,255,0.20);line-height:1.6;">Você recebeu este e-mail porque adquiriu O Corpo Fala. Dúvidas? Responda este e-mail.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Email metadata ───────────────────────────────────────────────────────────

const EMAIL_CONFIG: Record<number, { subject: string; preview: string; buildHtml: () => string }> = {
  2: {
    subject: "Eu entendo.",
    preview: "Se você ainda não começou, eu entendo.",
    buildHtml: buildEmail2Html,
  },
  3: {
    subject: "Quando foi a última vez?",
    preview: "Que você parou pra me ouvir de verdade.",
    buildHtml: buildEmail3Html,
  },
  4: {
    subject: "Você não tá sozinha nisso.",
    preview: "Eu sei que parece que tá.",
    buildHtml: buildEmail4Html,
  },
  5: {
    subject: "Uma semana.",
    preview: "E eu ainda tô aqui.",
    buildHtml: buildEmail5Html,
  },
  6: {
    subject: "Última conversa.",
    preview: "Pelo menos por enquanto.",
    buildHtml: buildEmail6Html,
  },
};

// ─── Main handler ─────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch all pending emails that are due
    const { data: pendingEmails, error: fetchError } = await supabase
      .from("email_queue")
      .select("*")
      .eq("status", "pending")
      .lte("scheduled_at", new Date().toISOString())
      .limit(50);

    if (fetchError) {
      throw new Error(`Failed to fetch queue: ${fetchError.message}`);
    }

    if (!pendingEmails || pendingEmails.length === 0) {
      console.log("No pending emails to process");
      return new Response(
        JSON.stringify({ success: true, processed: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing ${pendingEmails.length} pending emails`);

    let sent = 0;
    let failed = 0;

    for (const item of pendingEmails) {
      const config = EMAIL_CONFIG[item.email_number];
      if (!config) {
        console.error(`Unknown email_number: ${item.email_number}`);
        continue;
      }

      try {
        const html = config.buildHtml();

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Seu Corpo <gestao@corpofala.com>",
            to: [item.email],
            subject: config.subject,
            html,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error(`Failed to send email ${item.email_number} to ${item.email}:`, data);
          await supabase
            .from("email_queue")
            .update({ status: "failed" })
            .eq("id", item.id);
          failed++;
        } else {
          console.log(`Email ${item.email_number} sent to ${item.email}`, data.id);
          await supabase
            .from("email_queue")
            .update({ status: "sent", sent_at: new Date().toISOString() })
            .eq("id", item.id);
          sent++;
        }
      } catch (emailErr) {
        console.error(`Error sending email ${item.email_number} to ${item.email}:`, emailErr);
        await supabase
          .from("email_queue")
          .update({ status: "failed" })
          .eq("id", item.id);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({ success: true, processed: pendingEmails.length, sent, failed }),
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
