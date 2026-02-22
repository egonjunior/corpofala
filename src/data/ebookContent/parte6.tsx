import PullQuote from "@/components/ebook/PullQuote";
import SectionDivider from "@/components/ebook/SectionDivider";

export const parte6Content = (
  <div className="space-y-8 text-lg leading-relaxed">
    <section>
      <p>
        Você chegou ao final deste livro. Mas não ao final da sua <strong>JORNADA</strong>.
      </p>
      <p>
        Este livro foi um <strong>MAPA</strong>. Mostrou <strong>ONDE</strong> você está. Mostrou <strong>ONDE</strong> você quer chegar. E mostrou <strong>OS CAMINHOS</strong>. Mas agora você precisa <strong>CAMINHAR</strong>.
      </p>
      <p>
        Neste capítulo final, vou te dar:
      </p>
      <ul className="list-disc pl-6 space-y-1 my-4">
        <li><strong>Livros</strong> essenciais (para aprofundar cada tema)</li>
        <li><strong>Cursos e programas</strong> (online e presenciais)</li>
        <li><strong>Como encontrar terapeuta</strong> (e qual tipo buscar)</li>
        <li><strong>Comunidades</strong> (grupos de apoio)</li>
        <li><strong>Apps e ferramentas</strong> digitais</li>
      </ul>
    </section>

    <SectionDivider />

    {/* 6.1 LIVROS */}
    <section>
      <h2 className="text-3xl font-serif font-bold mb-6">6.1 Livros Essenciais (Por Tema)</h2>

      {/* Tema 1 */}
      <h3 className="text-xl font-semibold mt-8 mb-4 text-primary">TEMA 1: Mente-Corpo (Psiconeuroimunologia, Somatização)</h3>
      <div className="space-y-4">
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">"O Corpo Guarda o Registro" — Bessel van der Kolk</h4>
          <p className="text-muted-foreground text-sm">Por quê ler: referência mundial em trauma e como o corpo armazena memórias traumáticas.</p>
          <p className="text-sm">Melhor para: quem tem trauma não processado, TEPT, dor crônica sem causa. Nível: Intermediário.</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">"Quando o Corpo Diz Não" — Gabor Maté</h4>
          <p className="text-muted-foreground text-sm">Por quê ler: mostra como reprimir emoções cria doenças (câncer, autoimunes, etc).</p>
          <p className="text-sm">Melhor para: quem engole raiva, nunca confronta, é "boazinha(o)" demais. Nível: Fácil (histórias de pacientes reais).</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">"A Biologia da Crença" — Bruce Lipton</h4>
          <p className="text-muted-foreground text-sm">Por quê ler: explica epigenética de forma acessível (como crenças mudam genes).</p>
          <p className="text-sm">Melhor para: quem quer entender a base científica de "mente sobre matéria". Nível: Fácil.</p>
        </div>
      </div>

      {/* Tema 2 */}
      <h3 className="text-xl font-semibold mt-8 mb-4 text-primary">TEMA 2: Neuroplasticidade e Reprogramação Mental</h3>
      <div className="space-y-4">
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">"Quebrando o Hábito de Ser Você Mesmo" — Joe Dispenza</h4>
          <p className="text-muted-foreground text-sm">Por quê ler: melhor livro sobre como reprogramar cérebro através de meditação e visualização.</p>
          <p className="text-sm">Melhor para: quem quer protocolo prático de reprogramação. Nível: Intermediário.</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">"O Cérebro Que Se Transforma" — Norman Doidge</h4>
          <p className="text-muted-foreground text-sm">Por quê ler: histórias fascinantes de pessoas que "curaram" o cérebro através de neuroplasticidade.</p>
          <p className="text-sm">Melhor para: quem quer inspiração e ver que mudança é possível. Nível: Fácil (narrativa estilo jornalismo).</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">"Hábitos Atômicos" — James Clear</h4>
          <p className="text-muted-foreground text-sm">Por quê ler: sistema científico para criar bons hábitos e quebrar maus.</p>
          <p className="text-sm">Melhor para: quem quer consistência (exercício, dieta, meditação). Nível: Muito fácil.</p>
        </div>
      </div>

      {/* Tema 3 */}
      <h3 className="text-xl font-semibold mt-8 mb-4 text-primary">TEMA 3: Espiritualidade e Cura</h3>
      <div className="space-y-4">
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">"A Quarta Dimensão" — Paul Yonggi Cho</h4>
          <p className="text-muted-foreground text-sm">Por quê ler: explica como fé, visualização e oração criam realidade.</p>
          <p className="text-sm">Melhor para: cristãos que querem unir fé + ciência. Nível: Fácil.</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">"O Poder do Subconsciente" — Joseph Murphy</h4>
          <p className="text-muted-foreground text-sm">Por quê ler: clássico sobre como programar subconsciente para cura e prosperidade.</p>
          <p className="text-sm">Melhor para: qualquer pessoa (não é religioso). Nível: Muito fácil.</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">"Metafísica da Saúde" — Valcapelli & Gasparetto</h4>
          <p className="text-muted-foreground text-sm">Por quê ler: dicionário de sintomas e suas possíveis causas emocionais/espirituais.</p>
          <p className="text-sm">Melhor para: identificar padrão emocional por trás de sintoma específico. Nível: Muito fácil (consulta rápida).</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">"Cura Pelo Pensamento" — Hélio Couto</h4>
          <p className="text-muted-foreground text-sm">Por quê ler: explica mecânica quântica da cura, ressonância, consciência universal.</p>
          <p className="text-sm">Melhor para: quem quer aprofundar em física quântica + espiritualidade. Nível: Avançado.</p>
        </div>
      </div>

      {/* Tema 4 */}
      <h3 className="text-xl font-semibold mt-8 mb-4 text-primary">TEMA 4: Dieta e Nutrição</h3>
      <div className="space-y-4">
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">"Como Não Morrer" — Michael Greger</h4>
          <p className="text-muted-foreground text-sm">Por quê ler: baseado em centenas de estudos, mostra exatamente o que comer para prevenir/reverter doenças.</p>
          <p className="text-sm">Nível: Intermediário.</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">"Barriga de Trigo" — William Davis</h4>
          <p className="text-muted-foreground text-sm">Por quê ler: explica como trigo moderno inflama e causa doenças.</p>
          <p className="text-sm">Melhor para: quem tem problemas digestivos, autoimunes. Nível: Fácil.</p>
        </div>
      </div>

      {/* Tema 5 */}
      <h3 className="text-xl font-semibold mt-8 mb-4 text-primary">TEMA 5: Trauma e EMDR</h3>
      <div className="space-y-4">
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">"Getting Past Your Past" — Francine Shapiro</h4>
          <p className="text-muted-foreground text-sm">Por quê ler: escrito pela criadora do EMDR, explica como processar traumas.</p>
          <p className="text-sm">Nível: Fácil.</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">"Waking the Tiger" — Peter Levine</h4>
          <p className="text-muted-foreground text-sm">Por quê ler: explica Somatic Experiencing (terapia somática para trauma).</p>
          <p className="text-sm">Melhor para: quem tem trauma armazenado no corpo (dor crônica, tensão). Nível: Intermediário.</p>
        </div>
      </div>

      {/* Tema 6 */}
      <h3 className="text-xl font-semibold mt-8 mb-4 text-primary">TEMA 6: Mentalidade e Alta Performance</h3>
      <div className="space-y-4">
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">"Desperte Seu Gigante Interior" — Tony Robbins</h4>
          <p className="text-muted-foreground text-sm">Por quê ler: melhor livro sobre neuroassociação e reprogramação de comportamentos.</p>
          <p className="text-sm">Nível: Fácil (muito prático).</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">"Mindset" — Carol Dweck</h4>
          <p className="text-muted-foreground text-sm">Por quê ler: diferença entre mentalidade fixa vs. crescimento, e como mudar.</p>
          <p className="text-sm">Melhor para: quem se sabota, tem crenças limitantes. Nível: Fácil.</p>
        </div>
      </div>
    </section>

    <SectionDivider />

    {/* 6.2 CURSOS */}
    <section>
      <h2 className="text-3xl font-serif font-bold mb-6">6.2 Cursos e Programas Online</h2>

      <div className="space-y-6">
        <div className="p-6 bg-card border border-border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Joe Dispenza — Progressive Workshop (Online)</h3>
          <p>Workshop de 3 dias com meditações guiadas diárias. Foco: reprogramação cerebral, cura através de meditação.</p>
          <p className="mt-2 text-sm text-muted-foreground">Investimento: USD 500-800 · drjoedispenza.com</p>
        </div>
        <div className="p-6 bg-card border border-border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Tony Robbins — Unleash the Power Within</h3>
          <p>Evento de 4 dias de imersão total em reprogramação. Foco: neuroassociação, quebra de padrões, alta performance.</p>
          <p className="mt-2 text-sm text-muted-foreground">Investimento: USD 500-2.500 · tonyrobbins.com</p>
        </div>
        <div className="p-6 bg-card border border-border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Mindfulness-Based Stress Reduction (MBSR) — Jon Kabat-Zinn</h3>
          <p>Curso de 8 semanas de mindfulness (padrão-ouro mundial). Foco: redução de estresse, ansiedade, dor crônica.</p>
          <p className="mt-2 text-sm text-muted-foreground">Versão GRATUITA online: palousemindfulness.com</p>
        </div>
        <div className="p-6 bg-card border border-border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Wim Hof Method — Fundamentals (Online)</h3>
          <p>Curso de respiração + exposição ao frio. Foco: fortalecer sistema imunológico, energia, resiliência.</p>
          <p className="mt-2 text-sm text-muted-foreground">Investimento: USD 200-300 · wimhofmethod.com</p>
        </div>
      </div>
    </section>

    <SectionDivider />

    {/* 6.3 TERAPEUTAS */}
    <section>
      <h2 className="text-3xl font-serif font-bold mb-6">6.3 Como Encontrar o Terapeuta Certo</h2>

      <p className="mb-6">Nem todo terapeuta é igual. Dependendo do seu caso, você precisa de especialização específica.</p>

      <div className="space-y-4">
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">Trauma (Abuso, Acidente, TEPT)</h4>
          <p>Terapeuta ideal: especialista em EMDR ou Somatic Experiencing.</p>
          <p className="text-sm text-muted-foreground">Onde encontrar: emdr.org.br · traumahealing.org · Frequência: semanal, 8-20 sessões.</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">Ansiedade, Depressão, Padrões Destrutivos</h4>
          <p>Terapeuta ideal: TCC, Terapia de Esquema ou ACT.</p>
          <p className="text-sm text-muted-foreground">Plataformas: Zenklub, Vittude, Psicologia Viva · Frequência: semanal, 12-24 sessões.</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">Relacionamento, Comunicação</h4>
          <p>Terapeuta ideal: Terapia de Casal (EFT) ou Terapia Sistêmica.</p>
          <p className="text-sm text-muted-foreground">Frequência: semanal, 10-20 sessões.</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">Dor Crônica, Fibromialgia, Tensão Muscular</h4>
          <p>Terapeuta ideal: Fisioterapeuta especializado em Dor Crônica, Somatic Experiencing, TRE ou Acupuntura.</p>
          <p className="text-sm text-muted-foreground">Onde encontrar: tredobrasil.com.br</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">Vícios (Álcool, Drogas, Comida)</h4>
          <p className="text-sm text-muted-foreground">AA (aa.org.br), NA (na.org.br), DASA (dasabrasil.org) — todos gratuitos.</p>
        </div>
      </div>

      <div className="my-8 p-6 bg-muted border border-border rounded-lg">
        <h4 className="font-semibold mb-3">Sem Dinheiro Para Terapia?</h4>
        <ul className="space-y-2">
          <li><strong>Clínicas-escola de psicologia:</strong> R$0-50/sessão ("clínica-escola psicologia [sua cidade]")</li>
          <li><strong>CAPS:</strong> atendimento público gratuito (SUS)</li>
          <li><strong>Terapia online:</strong> Zenklub, Vittude (R$70-150/sessão)</li>
          <li><strong>Grupos de apoio:</strong> AA, NA, Emocionais Anônimos — completamente gratuitos</li>
        </ul>
      </div>
    </section>

    <SectionDivider />

    {/* 6.4 APPS */}
    <section>
      <h2 className="text-3xl font-serif font-bold mb-6">6.4 Apps e Ferramentas Digitais</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">🧘 Meditação</h3>
          <ul className="space-y-1 pl-4">
            <li><strong>Insight Timer</strong> (Grátis + Premium) — maior biblioteca de meditações (100.000+)</li>
            <li><strong>Headspace</strong> — ótimo para iniciantes</li>
            <li><strong>Calm</strong> — meditação + histórias para dormir</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">🌬️ Respiração</h3>
          <ul className="space-y-1 pl-4">
            <li><strong>Breathwrk</strong> (Grátis + Premium) — exercícios guiados (4-7-8, Box Breathing, Wim Hof)</li>
            <li><strong>Prana Breath</strong> (Grátis) — customizável</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">😴 Sono</h3>
          <ul className="space-y-1 pl-4">
            <li><strong>Sleep Cycle</strong> — rastreia sono, acorda no momento ideal do ciclo</li>
            <li><strong>Sleepio</strong> — programa de TCC para insônia (baseado em ciência)</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">📝 Journaling</h3>
          <ul className="space-y-1 pl-4">
            <li><strong>Day One</strong> (Grátis + Premium) — melhor app de journaling</li>
            <li><strong>Notion</strong> (Grátis) — crie seu template personalizado</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">📊 Rastreamento de Humor e Sintomas</h3>
          <ul className="space-y-1 pl-4">
            <li><strong>Daylio</strong> (Grátis + Premium) — rastreia humor, atividades, identifica padrões</li>
            <li><strong>Bearable</strong> (Grátis + Premium) — ótimo para condições crônicas</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">💬 Terapia Online</h3>
          <ul className="space-y-1 pl-4">
            <li><strong>Zenklub</strong> (Brasil) — R$70-150/sessão</li>
            <li><strong>BetterHelp</strong> (Global, inglês) — USD 60-90/semana</li>
          </ul>
        </div>
      </div>
    </section>

    <SectionDivider />

    {/* 6.5 EXAMES */}
    <section>
      <h2 className="text-3xl font-serif font-bold mb-6">6.5 Exames Laboratoriais Recomendados</h2>

      <p className="mb-6">Faça esses exames anualmente:</p>

      <div className="space-y-6">
        <div className="p-6 bg-muted border border-border rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Exames Básicos (Todo mundo deveria fazer)</h3>
          <ul className="space-y-1 pl-4 list-disc">
            <li>Hemograma completo</li>
            <li>Glicemia de jejum + Hemoglobina glicada (HbA1c)</li>
            <li>Perfil lipídico (Colesterol total, HDL, LDL, Triglicerídeos)</li>
            <li>TSH + T4 livre (Tireoide)</li>
            <li>Vitamina D (25-OH)</li>
            <li>Vitamina B12</li>
            <li>Ferritina (estoque de ferro)</li>
          </ul>
        </div>
        <div className="p-6 bg-muted border border-border rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Exames Avançados (Se tem ansiedade/depressão/fadiga)</h3>
          <ul className="space-y-1 pl-4 list-disc">
            <li>Magnésio sérico</li>
            <li>Zinco</li>
            <li>Homocisteína (marcador de inflamação)</li>
            <li>Proteína C Reativa (PCR — inflamação)</li>
            <li>Cortisol salivar (4 pontos ao longo do dia)</li>
          </ul>
        </div>
      </div>
    </section>

    <SectionDivider />

    {/* 6.6 PROTOCOLO */}
    <section>
      <h2 className="text-3xl font-serif font-bold mb-6">6.6 Protocolo: "E Agora, Por Onde Começo?"</h2>

      <div className="space-y-6">
        <div className="p-6 bg-card border border-border rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Semana 1 — Diagnóstico</h3>
          <ul className="space-y-2 pl-4 list-disc">
            <li>Releia o Capítulo 2 (Os 5 Padrões) — identifique qual(is) padrão(ões) você tem</li>
            <li>Faça o exercício escrito do final do Capítulo 2</li>
            <li>Agende exames laboratoriais (pelo menos os básicos)</li>
            <li>Pesquise terapeuta (tipo certo para o seu padrão)</li>
            <li>Escolha 2-3 livros da lista e compre/baixe</li>
            <li>Escolha 1 suplemento para começar (sugestão: Vitamina D3 + Magnésio)</li>
          </ul>
        </div>

        <div className="p-6 bg-card border border-border rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Semanas 2-4 — Implementação Gradual</h3>
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wide text-primary">Física</h4>
              <ul className="space-y-1 pl-4 list-disc text-sm">
                <li>Comece suplementação (D3 + Magnésio)</li>
                <li>Reduza 1 alimento inflamatório (açúcar OU óleos refinados)</li>
                <li>Adicione 1 porção de vegetais/dia</li>
                <li>Caminhada 15-20 min, 3x/semana</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wide text-primary">Mental</h4>
              <ul className="space-y-1 pl-4 list-disc text-sm">
                <li>Meditação/Mindfulness: 5-10 min/dia (use Insight Timer)</li>
                <li>Journaling: 5 min à noite (o que sentiu hoje?)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wide text-primary">Espiritual</h4>
              <ul className="space-y-1 pl-4 list-disc text-sm">
                <li>Oração/Gratidão: 5 min de manhã (liste 5 coisas pelas quais é grato)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wide text-primary">Terapia</h4>
              <ul className="space-y-1 pl-4 list-disc text-sm">
                <li>1ª sessão com terapeuta</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 bg-card border border-border rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Mês 2-3 — Intensificação</h3>
          <ul className="space-y-2 pl-4 list-disc">
            <li>Aumente exercício (30 min, 4-5x/semana)</li>
            <li>Adicione mais suplementos (Ômega-3, Probiótico)</li>
            <li>Meditação 10-20 min/dia</li>
            <li>Terapia semanal (continua)</li>
            <li>Leia 1 dos livros escolhidos</li>
          </ul>
        </div>

        <div className="p-6 bg-card border border-border rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Mês 4+ — Manutenção e Evolução</h3>
          <ul className="space-y-2 pl-4 list-disc">
            <li>Arsenal completo implementado</li>
            <li>Hábitos viraram rotina</li>
            <li>Reavalie: o que funcionou? O que não funcionou?</li>
            <li>Ajuste o protocolo conforme necessário</li>
          </ul>
        </div>

        <div className="p-6 bg-primary/10 border border-primary/20 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Meta de 6 Meses</h3>
          <ul className="space-y-2 pl-4 list-disc">
            <li>Padrão quebrado (ou significativamente reduzido)</li>
            <li>Sintomas físicos 50-80% melhores</li>
            <li>Clareza mental, paz, energia</li>
            <li><strong>Você é outra pessoa.</strong></li>
          </ul>
        </div>
      </div>
    </section>

    <SectionDivider />

    {/* RESUMO */}
    <section>
      <h2 className="text-3xl font-serif font-bold mb-6">Resumo do Capítulo 6</h2>
      <p>Você agora tem:</p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>16 livros organizados por tema</li>
        <li>4 cursos online de alto impacto</li>
        <li>Guia para encontrar o terapeuta certo para cada caso</li>
        <li>Apps e ferramentas digitais (maioria gratuita)</li>
        <li>Lista de exames laboratoriais anuais</li>
        <li>Protocolo claro de implementação semana a semana</li>
      </ul>

      <PullQuote>
        O mapa está completo. Agora é sua vez de caminhar.
      </PullQuote>
    </section>
  </div>
);
