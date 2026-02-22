import PullQuote from "@/components/ebook/PullQuote";
import SectionDivider from "@/components/ebook/SectionDivider";
import ScientificReference from "@/components/ebook/ScientificReference";

export const parte5Content = (
  <div className="space-y-8 text-lg leading-relaxed">
    {/* Introdução do capítulo */}
    <section>
      <p>
        Nos capítulos anteriores você aprendeu as raízes emocionais dos sintomas e as ferramentas para reprogramar mente e espírito.
      </p>
      <p>
        Mas existe uma terceira camada: <strong>o corpo físico</strong>.
      </p>
      <p>
        Sua biologia precisa de suporte. Enquanto você faz o trabalho mental e espiritual, o corpo precisa de matéria-prima adequada para regenerar, equilibrar neurotransmissores, controlar inflamação e regular o sistema nervoso.
      </p>
      <p>
        Pensa assim: imagine tentar construir uma casa com ferramentas de qualidade, mas sem tijolos. O trabalho interno não se sustenta se a base física está comprometida.
      </p>
      <p>
        Este capítulo é o seu <strong>arsenal físico</strong> — 5 ferramentas que funcionam juntas como suporte para tudo que você aprendeu até aqui.
      </p>

      <PullQuote>
        Tríade completa: Corpo + Mente + Espírito. As três juntas são mais poderosas que qualquer uma isolada.
      </PullQuote>
    </section>

    <SectionDivider />

    {/* 5.1 SUPLEMENTOS */}
    <section>
      <h2 className="text-3xl font-serif font-bold mb-6">5.1 Suplementos: Os 10 Essenciais</h2>

      <p>
        Suplementos não substituem alimentação nem terapia. Mas podem acelerar significativamente a cura ao corrigir deficiências que a maioria das pessoas tem e que afetam diretamente humor, ansiedade, imunidade e inflamação.
      </p>

      <div className="my-4 p-4 bg-muted border border-border rounded-lg">
        <p className="text-sm font-semibold text-foreground">⚠️ Sempre consulte seu médico antes de iniciar suplementação, especialmente se usa medicamentos.</p>
      </div>

      <div className="space-y-6 my-8">
        <div className="border-l-4 border-primary pl-6">
          <h3 className="text-xl font-semibold mb-2">1. VITAMINA D3 (2.000-4.000 UI/dia)</h3>
          <p>
            Mais de 70% dos brasileiros têm deficiência. A vitamina D funciona como hormônio no corpo — regula sistema imunológico, humor e inflamação.
          </p>
          <p className="mt-3">
            Deficiência está associada a depressão, ansiedade, doenças autoimunes, baixa imunidade e fadiga crônica. Faça um exame (25-OH Vitamina D) antes de suplementar — ideal manter entre 50-80 ng/mL.
          </p>
        </div>

        <div className="border-l-4 border-primary pl-6">
          <h3 className="text-xl font-semibold mb-2">2. MAGNÉSIO (400-600 mg/dia)</h3>
          <p>
            O mineral mais deficiente na população moderna. Participa de mais de 300 reações enzimáticas no corpo. É relaxante muscular natural, regulador do sistema nervoso e modulador do estresse.
          </p>
          <p className="mt-3">
            Formas recomendadas: Magnésio Glicinato (melhor absorção, acalma) ou Magnésio L-Treonato (cruza a barreira hematoencefálica — ideal para ansiedade e sono). Tomar à noite potencializa o efeito relaxante.
          </p>
        </div>

        <div className="border-l-4 border-primary pl-6">
          <h3 className="text-xl font-semibold mb-2">3. ÔMEGA-3 (2-3 g/dia de EPA+DHA)</h3>
          <p>
            Ácidos graxos essenciais que o corpo não produz. Anti-inflamatório poderoso, suporte ao sistema nervoso e melhora de humor. Prefira óleo de peixe de alta qualidade (verificar o teor de EPA e DHA no rótulo, não apenas o total de óleo).
          </p>
        </div>

        <div className="border-l-4 border-primary pl-6">
          <h3 className="text-xl font-semibold mb-2">4. PROBIÓTICO (20-50 bilhões UFC/dia)</h3>
          <p>
            Repõe e diversifica a microbiota intestinal. Como vimos no Cap. 1, o eixo intestino-cérebro é fundamental — 95% da serotonina é produzida no intestino. Microbiota saudável = humor melhor, menos ansiedade, imunidade fortalecida.
          </p>
          <p className="mt-3">
            Procure fórmulas com múltiplas cepas (Lactobacillus + Bifidobacterium). Tome com o estômago relativamente vazio.
          </p>
        </div>

        <div className="border-l-4 border-primary pl-6">
          <h3 className="text-xl font-semibold mb-2">5. VITAMINA B-COMPLEX</h3>
          <p>
            As vitaminas do complexo B são cofatores essenciais para produção de neurotransmissores (serotonina, dopamina, GABA). Deficiências em B12, B6 e Folato estão diretamente associadas à depressão e ansiedade.
          </p>
          <p className="mt-3">
            Atenção especial ao B12 para vegetarianos e veganos — deficiência é quase universal nesse grupo sem suplementação.
          </p>
        </div>

        <div className="border-l-4 border-primary pl-6">
          <h3 className="text-xl font-semibold mb-2">6. ASHWAGANDHA (300-600 mg/dia)</h3>
          <p>
            Adaptógeno — planta que ajuda o corpo a adaptar ao estresse. Reduz cortisol (hormônio do estresse), melhora resistência ao estresse crônico, melhora sono e reduz ansiedade.
          </p>
          <ScientificReference title="Chandrasekhar et al. (2012)">
            Estudo demonstrou redução de 27,9% no cortisol após 60 dias de suplementação com Ashwagandha. Tomar à noite potencializa o efeito no sono.
          </ScientificReference>
        </div>

        <div className="border-l-4 border-primary pl-6">
          <h3 className="text-xl font-semibold mb-2">7. L-TEANINA (200 mg/dia)</h3>
          <p>
            Aminoácido encontrado naturalmente no chá verde. Promove relaxamento sem sonolência — aumenta ondas alfa cerebrais (estado de calma e foco). Combina bem com cafeína (reduz a agitação sem tirar o foco).
          </p>
          <p className="mt-3">
            Ideal para ansiedade diurna. Pode ser tomada antes de situações estressantes.
          </p>
        </div>

        <div className="border-l-4 border-primary pl-6">
          <h3 className="text-xl font-semibold mb-2">8. CÚRCUMA/CURCUMINA (500-1.000 mg/dia)</h3>
          <p>
            Potente anti-inflamatório natural. Como vimos ao longo do livro, inflamação crônica está na raiz de boa parte dos sintomas físicos e mentais. A curcumina inibe as mesmas vias inflamatórias que medicamentos anti-inflamatórios comuns.
          </p>
          <p className="mt-3">
            <strong>Importante:</strong> tome com pimenta-preta (piperina) — aumenta absorção em até 2.000%. Ou escolha fórmula com curcumina fitossomada (melhor biodisponibilidade).
          </p>
        </div>

        <div className="border-l-4 border-primary pl-6">
          <h3 className="text-xl font-semibold mb-2">9. ZINCO (15-30 mg/dia)</h3>
          <p>
            Mineral essencial para imunidade, cicatrização e produção de testosterona. Deficiência é comum e está associada a baixa imunidade, queda de cabelo e humor deprimido.
          </p>
          <p className="mt-3">
            Não tome em excesso (acima de 40 mg/dia por longos períodos pode interferir com absorção de cobre). Prefira formas queladas (zinco bisglicinato).
          </p>
        </div>

        <div className="border-l-4 border-primary pl-6">
          <h3 className="text-xl font-semibold mb-2">10. VITAMINA C (1.000-2.000 mg/dia)</h3>
          <p>
            Antioxidante, suporte imunológico e cofator para produção de colágeno e neurotransmissores. O organismo não produz vitamina C — é preciso obtê-la pela dieta ou suplementação.
          </p>
          <p className="mt-3">
            Em situações de estresse crônico, a demanda por vitamina C aumenta significativamente. Prefira formas tamponadas (menos ácidas, melhor toleradas pelo estômago).
          </p>
        </div>
      </div>

      {/* Por Onde Começar */}
      <div className="my-8 p-6 bg-muted border border-border rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Por Onde Começar?</h3>
        <p className="mb-4">Se você vai começar agora, escolha os 3 mais impactantes para o seu caso:</p>
        <ul className="space-y-2">
          <li><strong>Para ansiedade e estresse:</strong> Magnésio + Ashwagandha + L-Teanina</li>
          <li><strong>Para depressão e fadiga:</strong> Vitamina D3 + B-Complex + Ômega-3</li>
          <li><strong>Para imunidade baixa:</strong> Vitamina C + Zinco + Probiótico</li>
          <li><strong>Para inflamação crônica:</strong> Cúrcuma + Ômega-3 + Vitamina D3</li>
        </ul>
        <p className="mt-4 text-muted-foreground">Após 30 dias, avalie e adicione mais se necessário.</p>
      </div>

      <PullQuote>
        Suplementos não são magia. Não curam sozinhos. Mas quando combinados com mudança alimentar, movimento, sono e trabalho emocional — eles transformam.
      </PullQuote>
    </section>

    <SectionDivider />

    {/* 5.2 DIETA ANTI-INFLAMATÓRIA */}
    <section>
      <h2 className="text-3xl font-serif font-bold mb-6">5.2 Dieta Anti-Inflamatória</h2>

      <p>
        <strong>Alimentação não é só combustível. É informação.</strong>
      </p>
      <p>
        Cada refeição envia sinais para seus genes, seu sistema imunológico e seus neurotransmissores. Você pode comer de forma que AUMENTA inflamação e piora sintomas — ou de forma que REDUZ inflamação e acelera a cura.
      </p>

      <h3 className="text-2xl font-serif font-semibold mt-10 mb-4">O Que Evitar</h3>

      <div className="space-y-4">
        <p>
          <strong>Açúcar refinado e farinha branca</strong> disparam insulina, alimentam bactérias nocivas e aumentam inflamação. São os maiores vilões da dieta moderna.
        </p>
        <p>
          <strong>Óleos vegetais refinados</strong> (soja, milho, girassol, canola) são ricos em ômega-6 pró-inflamatório. Quando consumidos em excesso — como na maioria dos ultraprocessados — criam desequilíbrio no balanço ômega-6/ômega-3.
        </p>
        <p>
          <strong>Gorduras trans</strong> (margarina, biscoitos recheados, fast food frito) — aumentam inflamação sistêmica e risco cardiovascular. Evite completamente.
        </p>
        <p>
          <strong>Alimentos ultraprocessados</strong> são combinações de açúcar, gordura ruim, sódio e aditivos projetados para vício. Pouco nutrientes, muita inflamação.
        </p>
        <p>
          <strong>Álcool em excesso</strong> prejudica microbiota, fígado, sono e sistema nervoso. Se consumir, moderação total.
        </p>
      </div>

      <h3 className="text-2xl font-serif font-semibold mt-10 mb-4">O Que Comer</h3>

      <div className="space-y-4">
        <p>
          <strong>Vegetais coloridos</strong> (brócolis, espinafre, couve, pimentão, cenoura, beterraba): ricos em fitoquímicos anti-inflamatórios e fibras que alimentam a microbiota saudável. Meta: metade do prato em vegetais em cada refeição principal.
        </p>
        <p>
          <strong>Frutas vermelhas e berries</strong> (morango, mirtilo, amora, açaí): altíssimo teor de antioxidantes (antocianinas). Reduzem estresse oxidativo e inflamação.
        </p>
        <p>
          <strong>Peixes gordos</strong> (salmão, sardinha, atum, cavalinha): ricos em ômega-3 EPA e DHA. 2 a 3 porções por semana.
        </p>
        <p>
          <strong>Nozes e sementes</strong> (castanha-do-pará, nozes, amêndoas, chia, linhaça): gorduras saudáveis, magnésio, selênio.
        </p>
        <p>
          <strong>Azeite de oliva extravirgem:</strong> rico em oleocanthal, com ação anti-inflamatória comparável ao ibuprofeno em doses regulares.
        </p>
        <p>
          <strong>Especiarias</strong> (cúrcuma, gengibre, canela, alho): potentes anti-inflamatórios naturais. Use abundantemente.
        </p>
        <p>
          <strong>Fermentados</strong> (iogurte natural, kefir, chucrute, kombucha): fornecem probióticos naturais para o intestino.
        </p>
      </div>

      <h3 className="text-2xl font-serif font-semibold mt-10 mb-4">Cardápio Anti-Inflamatório (Exemplo de um Dia)</h3>

      <div className="space-y-3 my-6 p-6 bg-muted border border-border rounded-lg">
        <p><strong>Café da manhã:</strong> ovos mexidos com vegetais + abacate, ou smoothie (frutas + espinafre + proteína + chia), ou iogurte natural + berries + nozes.</p>
        <p><strong>Almoço:</strong> proteína magra ou peixe + legumes cozidos no azeite + salada colorida + azeite e limão.</p>
        <p><strong>Lanches:</strong> frutas + punhado de nozes, cenoura/pepino + hummus, chá verde.</p>
        <p><strong>Jantar:</strong> mais leve — sopa de legumes, ovo, peixe grelhado com salada.</p>
        <p><strong>Hidratação:</strong> 2 a 3 litros de água por dia, chá verde, chá de camomila, água com limão.</p>
      </div>

      <ScientificReference title="Giugliano et al. (2006) — Journal of the American College of Cardiology">
        Pesquisadores mediram marcadores inflamatórios no sangue de dois grupos 3 a 4 horas após uma refeição. O grupo que comeu fast food (burger, batata frita, refrigerante) teve inflamação aumentada, com IL-6 e TNF-alfa subindo. O grupo que comeu refeição mediterrânea (salmão, vegetais, azeite, frutas) teve inflamação reduzida. Uma única refeição já faz diferença. Imagine o efeito acumulado de anos comendo de cada forma.
      </ScientificReference>
    </section>

    <SectionDivider />

    {/* 5.3 EXERCÍCIO COMO MEDICINA */}
    <section>
      <h2 className="text-3xl font-serif font-bold mb-6">5.3 Exercício Como Medicina</h2>

      <h3 className="text-2xl font-serif font-semibold mb-4">Exercício é Antidepressivo</h3>

      <p>
        Estudos mostram que exercício é tão eficaz quanto antidepressivos para depressão leve a moderada — e sem efeitos colaterais.
      </p>

      <ScientificReference title="Blumenthal et al. (1999) — Archives of Internal Medicine">
        Pesquisadores da Duke University compararam exercício aeróbico vs. Zoloft (antidepressivo) vs. combinação dos dois em 156 pacientes com depressão. Após 16 semanas, todos os 3 grupos melhoraram igualmente (60-70% de redução de sintomas). Mas o acompanhamento 6 meses depois revelou algo surpreendente: o grupo que só se exercitou teve taxa de recaída de apenas 9%, contra 38% do grupo que só tomou remédio. O exercício foi mais eficaz a longo prazo.
      </ScientificReference>

      <h3 className="text-2xl font-serif font-semibold mt-10 mb-4">Por Que Funciona?</h3>

      <p>O exercício:</p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Libera <strong>endorfinas</strong> (analgésicos naturais e bem-estar)</li>
        <li>Aumenta <strong>BDNF</strong> (Brain-Derived Neurotrophic Factor — literalmente o "fertilizante do cérebro" que promove criação de novos neurônios)</li>
        <li>Reduz <strong>cortisol</strong></li>
        <li>Aumenta <strong>serotonina e dopamina</strong></li>
        <li>Melhora o <strong>sono</strong></li>
        <li>Reduz <strong>inflamação crônica</strong></li>
      </ul>

      <h3 className="text-2xl font-serif font-semibold mt-10 mb-4">Quanto e Que Tipo?</h3>

      <p>
        A OMS recomenda no mínimo <strong>150 min/semana</strong> de exercício moderado ou <strong>75 min/semana</strong> de exercício intenso.
      </p>

      <div className="space-y-4 my-6">
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">Aeróbico</h4>
          <p className="text-muted-foreground">(caminhada, corrida, natação, ciclismo)</p>
          <p>Melhora humor, reduz ansiedade e depressão, fortalece coração. 3-5x/semana, 30-45 min.</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">Musculação</h4>
          <p className="text-muted-foreground">(pesos livres, máquinas, peso corporal)</p>
          <p>Fortalece músculos e ossos, aumenta metabolismo, melhora autoestima. 2-4x/semana, 45-60 min.</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">Yoga/Pilates</h4>
          <p>Reduz estresse, melhora flexibilidade, conecta mente e corpo, trabalha respiração. 2-3x/semana, 45-60 min.</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">HIIT</h4>
          <p className="text-muted-foreground">(treino intervalado de alta intensidade)</p>
          <p>Máxima liberação de endorfinas, queima de gordura, melhora condicionamento. 2-3x/semana, 20-30 min.</p>
        </div>
      </div>

      <div className="my-6 p-6 bg-muted border border-border rounded-lg">
        <h4 className="font-semibold mb-2">Protocolo ideal (combinação):</h4>
        <p>Musculação 3x/semana + Cardio moderado 2x + Yoga ou alongamento 1x + 1 dia de descanso total.</p>
      </div>

      <h3 className="text-2xl font-serif font-semibold mt-10 mb-4">Se Você É Sedentário</h3>

      <p>Não comece com tudo de uma vez.</p>

      <div className="space-y-2 my-6 p-6 bg-muted border border-border rounded-lg">
        <p><strong>Semanas 1-2:</strong> caminhada leve, 15 min, 3x/semana.</p>
        <p><strong>Semanas 3-4:</strong> caminhada, 20 min, 4x/semana.</p>
        <p><strong>Semanas 5-6:</strong> caminhada moderada, 30 min, 5x/semana.</p>
        <p><strong>Semanas 7-8:</strong> adiciona musculação leve (peso corporal) 2x/semana.</p>
        <p><strong>Mês 3+:</strong> aumenta intensidade gradualmente.</p>
      </div>

      <PullQuote>
        Consistência supera intensidade. 15 min todo dia supera 2 horas uma vez por semana.
      </PullQuote>

      {/* Caso Fernando */}
      <div className="my-10 p-6 bg-card border border-border rounded-lg">
        <h4 className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4">Caso Real</h4>
        <h3 className="text-xl font-serif font-semibold mb-3">Fernando, 42 Anos — Depressão tratada com Corrida</h3>
        <p>
          Fernando tinha depressão moderada há 6 anos e tomava Fluoxetina 40mg/dia. Ajudava parcialmente, mas ele se sentia "entorpecido" — sem emoções.
        </p>
        <p className="mt-3">
          Psiquiatra sugeriu exercício como complemento. Fernando começou corrida 3x/semana, 30 min, iniciando leve e aumentando gradualmente.
        </p>
        <p className="mt-3">
          Após 12 semanas: depressão reduziu 60%, energia voltou, sono melhorou, começou a sentir emoções novamente. Após 6 meses: reduziu Fluoxetina para 20mg com acompanhamento médico.
        </p>
        <PullQuote author="Fernando">
          Correr me deu algo que o remédio nunca deu: sensação de controle. Quando corro, EU escolho. EU ativo meu corpo. EU produzo minha própria felicidade. O remédio me ajudou. Mas a corrida me curou.
        </PullQuote>
      </div>
    </section>

    <SectionDivider />

    {/* 5.4 SONO REPARADOR */}
    <section>
      <h2 className="text-3xl font-serif font-bold mb-6">5.4 Sono Reparador</h2>

      <h3 className="text-2xl font-serif font-semibold mb-4">Sono É Quando o Corpo Cura</h3>

      <p>
        Você pode comer perfeitamente, suplementar tudo, se exercitar com disciplina e meditar 1 hora por dia. Mas se dormir mal — menos de 6 horas, sono fragmentado, não profundo — a cura vai ser lenta.
      </p>
      <p>
        Por quê? Porque é durante o sono que:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>O corpo <strong>repara células</strong></li>
        <li>O hipocampo <strong>consolida memórias</strong></li>
        <li>O sistema glinfático <strong>limpa toxinas do cérebro</strong></li>
        <li>O sistema imunológico <strong>se fortalece</strong></li>
        <li>Os hormônios <strong>se regulam</strong></li>
      </ul>
      <p><strong>Sem sono adequado, nada funciona direito.</strong></p>

      <h3 className="text-2xl font-serif font-semibold mt-10 mb-4">Quanto Você Precisa?</h3>

      <p>
        <strong>Adultos (18-64 anos): 7-9 horas por noite.</strong> Menos de 6 horas de forma crônica é déficit com consequências reais.
      </p>
      <p className="mt-3">
        A médio prazo, privação de sono enfraquece o sistema imunológico, causa ganho de peso (desregula hormônios da fome), piora humor e intensifica ansiedade e depressão. A longo prazo, o risco de diabetes tipo 2 dobra, o risco de doenças cardíacas aumenta 48% e há evidências de aumento do risco de Alzheimer (o sistema glinfático limpa proteínas beta-amiloide durante o sono profundo).
      </p>

      <h3 className="text-2xl font-serif font-semibold mt-10 mb-4">Protocolo de Higiene do Sono</h3>

      <div className="space-y-4 my-6">
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">1. Horário fixo (o mais importante)</h4>
          <p>Dormir e acordar no mesmo horário todos os dias, inclusive fins de semana. Treina o relógio biológico.</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">2. Sem telas 1h antes de dormir</h4>
          <p>A luz azul de celulares, TVs e computadores bloqueia a produção de melatonina (o hormônio do sono). Alternativas: ler livro físico, ouvir podcast, conversar, meditar.</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">3. Quarto escuro, frio e silencioso</h4>
          <p>Use cortina blackout ou máscara de dormir. Temperatura ideal: 18-21°C — o corpo precisa esfriar para induzir o sono. Tampões de ouvido se necessário.</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">4. Cama só para dormir (e sexo)</h4>
          <p>Não trabalhe, não assista TV, não fique no celular na cama. O cérebro precisa associar cama = sono.</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">5. Sem cafeína após 14h</h4>
          <p>A cafeína tem meia-vida de 5-6 horas. Um café às 16h ainda tem metade da concentração às 22h, atrapalhando o sono profundo.</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">6. Sem álcool 3h antes de dormir</h4>
          <p>O álcool faz você adormecer mais rápido, mas fragmenta o sono — você acorda várias vezes sem perceber. Resultado: sono de baixa qualidade mesmo dormindo 8 horas.</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">7. Exercício de manhã ou tarde (não à noite)</h4>
          <p>O exercício melhora o sono, mas se feito 2-3h antes de dormir com o corpo ainda acelerado pode atrapalhar.</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">8. Rotina pré-sono (30-60 min)</h4>
          <p>Crie um ritual relaxante. Por exemplo: às 21h desliga as telas, às 21h15 banho quente (a queda de temperatura corporal depois induz o sono), às 21h30 leitura leve ou meditação, às 22h dorme.</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">9. Suplementos se necessário</h4>
          <p>Melatonina (1-3 mg, 30 min antes de dormir — uso pontual, não crônico), Magnésio Glicinato (400 mg à noite), L-Teanina (200 mg), Ashwagandha (300 mg).</p>
        </div>
      </div>

      {/* Caso Bruno */}
      <div className="my-10 p-6 bg-card border border-border rounded-lg">
        <h4 className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4">Caso Real</h4>
        <h3 className="text-xl font-serif font-semibold mb-3">Bruno, 38 Anos — Insônia Crônica tratada com Higiene do Sono</h3>
        <p>
          Bruno tinha insônia há 4 anos. Levava 2-3 horas para adormecer, acordava várias vezes por noite. Tomava Zolpidem.
        </p>
        <p className="mt-3">
          A terapeuta introduziu higiene do sono completa: horário fixo (22h-6h, todo dia), sem celular após 21h, quarto escuro com cortina blackout e ar-condicionado a 19°C, sem café após 14h, corrida às 7h (3x/semana), ritual pré-sono estruturado, Magnésio 400mg + Ashwagandha 300mg à noite.
        </p>
        <p className="mt-3">
          Após 8 semanas: adormece em 20-30 min (antes levava 2-3h), acorda 1x por noite (antes 4-5x), retirou o Zolpidem com acompanhamento médico.
        </p>
        <PullQuote author="Bruno">
          Eu achava que insônia era genética, algo que eu simplesmente tinha. Mas eram meus hábitos destruindo meu sono. Quando consertei os hábitos, o sono voltou. Simples assim.
        </PullQuote>
      </div>
    </section>

    <SectionDivider />

    {/* 5.5 RESPIRAÇÃO COMO FERRAMENTA */}
    <section>
      <h2 className="text-3xl font-serif font-bold mb-6">5.5 Respiração Como Ferramenta</h2>

      <h3 className="text-2xl font-serif font-semibold mb-4">Você Respira Errado</h3>

      <p>A maioria das pessoas respira de forma errada a vida toda e não percebe.</p>

      <div className="grid md:grid-cols-2 gap-4 my-6">
        <div className="p-5 bg-destructive/10 border border-destructive/20 rounded-lg">
          <h4 className="font-semibold text-destructive mb-2">❌ Respiração Torácica</h4>
          <p className="text-sm">Pelo peito, rápida, pela boca, 15-20 respirações/min. Ativa constantemente o sistema nervoso simpático — o sistema de "luta ou fuga". Mantém o corpo em estado de alerta, aumenta ansiedade, reduz oxigenação.</p>
        </div>
        <div className="p-5 bg-primary/10 border border-primary/20 rounded-lg">
          <h4 className="font-semibold text-primary mb-2">✅ Respiração Diafragmática</h4>
          <p className="text-sm">Pela barriga, lenta, pelo nariz, 6-10 respirações/min. Ativa o sistema nervoso parassimpático — o sistema de "descanso e cura". Acalma, oxigena melhor, reduz ansiedade.</p>
        </div>
      </div>

      <p>A boa notícia: você pode mudar isso conscientemente. E com prática, o padrão correto se torna automático.</p>

      <h3 className="text-2xl font-serif font-semibold mt-10 mb-4">Técnica 1: Respiração Diafragmática (Base)</h3>

      <div className="my-4 p-6 bg-muted border border-border rounded-lg space-y-3">
        <p>Deita ou senta confortavelmente.</p>
        <p>Coloca uma mão no peito e outra na barriga.</p>
        <p><strong>Inspira</strong> pelo nariz em 4 segundos — sente a barriga expandir (mão na barriga sobe). O peito quase não se move.</p>
        <p><strong>Expira</strong> pelo nariz em 6 segundos — sente a barriga contrair.</p>
      </div>

      <p><strong>Frequência:</strong> 5-10 min/dia ou sempre que sentir ansiedade surgindo.</p>
      <p><strong>Benefícios:</strong> ativa o nervo vago (principal nervo parassimpático), reduz frequência cardíaca, reduz pressão arterial, acalma a mente.</p>

      <h3 className="text-2xl font-serif font-semibold mt-10 mb-4">Técnica 2: Respiração 4-7-8 (Dr. Andrew Weil)</h3>

      <div className="my-4 p-6 bg-muted border border-border rounded-lg space-y-3">
        <p><strong>Inspira</strong> pelo nariz (4 seg)</p>
        <p><strong>Segura</strong> (7 seg)</p>
        <p><strong>Expira</strong> pela boca fazendo som "shhh" (8 seg)</p>
        <p>Repete 4 ciclos.</p>
      </div>

      <p>Use antes de dormir (induz sono), em crises de ansiedade (acalma em 2-3 minutos) ou antes de situações estressantes (reunião, apresentação, conversa difícil).</p>

      <h3 className="text-2xl font-serif font-semibold mt-10 mb-4">Técnica 3: Box Breathing (Respiração Quadrada)</h3>

      <p>Usada por Navy SEALs para controlar estresse em combate:</p>

      <div className="my-4 p-6 bg-muted border border-border rounded-lg space-y-3">
        <p><strong>Inspira</strong> (4 seg)</p>
        <p><strong>Segura</strong> (4 seg)</p>
        <p><strong>Expira</strong> (4 seg)</p>
        <p><strong>Segura</strong> (4 seg)</p>
        <p>Repete 5-10 ciclos.</p>
      </div>

      <p>Use em situações de alta pressão, antes de decisões importantes ou quando precisar de foco e calma simultâneos.</p>

      <h3 className="text-2xl font-serif font-semibold mt-10 mb-4">Técnica 4: Respiração Energizante (Método Wim Hof — adaptada)</h3>

      <div className="my-4 p-4 bg-muted border border-border rounded-lg">
        <p className="text-sm font-semibold text-foreground">⚠️ Faça apenas sentado ou deitado — pode causar tontura.</p>
      </div>

      <div className="my-4 p-6 bg-muted border border-border rounded-lg space-y-3">
        <p>30 respirações rápidas e profundas (inspira forte pelo nariz, expira pela boca).</p>
        <p>Após a 30ª, expira todo o ar e segura (meta: 1-2 min).</p>
        <p>Quando precisar respirar, inspira fundo e segura 15 seg.</p>
        <p>Expira. Respira normalmente por 1 min.</p>
        <p>Repete 2-3 rounds.</p>
      </div>

      <p>Use de manhã para energizar, antes de exercício ou quando precisar de energia e foco. <strong>Não use</strong> se tem pressão alta não controlada, epilepsia ou está grávida.</p>

      {/* Caso Paula */}
      <div className="my-10 p-6 bg-card border border-border rounded-lg">
        <h4 className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4">Caso Real</h4>
        <h3 className="text-xl font-serif font-semibold mb-3">Paula, 31 Anos — Pânico controlado com Respiração 4-7-8</h3>
        <p>
          Paula tinha crises de pânico 3-4 vezes por semana. A terapeuta ensinou a respiração 4-7-8 para usar no momento em que a crise começava a surgir.
        </p>
        <p className="mt-3">
          <strong>Protocolo:</strong> ao perceber os primeiros sinais (coração acelerando, falta de ar), parava tudo, sentava e fazia 4 ciclos de 4-7-8, seguidos de 2-3 min de respiração diafragmática.
        </p>
        <p className="mt-3">
          Primeiras semanas: crises ainda vinham, mas menos intensas e mais curtas (de 20 min para 5-10 min). Após 8 semanas: conseguia abortar a crise no início, antes de escalar. Frequência caiu de 3-4x/semana para 1x a cada 2 semanas.
        </p>
        <PullQuote author="Paula">
          Respiração me deu controle. Antes, a crise vinha e eu entrava em pânico porque achava que ia morrer. Agora a crise vem, eu respiro, e o corpo acalma. Em 2-3 minutos. Incrível como algo tão simples é tão poderoso.
        </PullQuote>
      </div>
    </section>

    <SectionDivider />

    {/* RESUMO DO CAPÍTULO 5 */}
    <section>
      <h2 className="text-3xl font-serif font-bold mb-6">Resumo do Capítulo 5</h2>

      <p>Você acabou de aprender as 5 ferramentas físicas do arsenal completo:</p>

      <div className="space-y-4 my-6">
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">1. SUPLEMENTOS</h4>
          <p>Os 10 essenciais: Vitamina D3, Magnésio, Ômega-3, Probiótico, B-Complex, Ashwagandha, L-Teanina, Cúrcuma, Zinco e Vitamina C. Comece pelos 3 mais relevantes para o seu caso.</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">2. DIETA ANTI-INFLAMATÓRIA</h4>
          <p>Evitar açúcar, óleos refinados, gordura trans, ultraprocessados. Priorizar vegetais, peixes gordos, nozes, azeite, especiarias, fermentados.</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">3. EXERCÍCIO</h4>
          <p>150 min/semana no mínimo. Combinação ideal: Musculação 3x + Cardio 2x + Yoga 1x. Tão eficaz quanto antidepressivo (Estudo Blumenthal, Duke University).</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">4. SONO</h4>
          <p>7-9h/noite com higiene do sono estruturada: horário fixo, sem telas 1h antes, quarto escuro/frio/silencioso, sem cafeína após 14h.</p>
        </div>
        <div className="border-l-4 border-primary pl-6">
          <h4 className="font-semibold">5. RESPIRAÇÃO</h4>
          <p>Diafragmática (base diária), 4-7-8 (ansiedade e sono), Box Breathing (foco e pressão), Wim Hof adaptada (energia).</p>
        </div>
      </div>

      <PullQuote>
        Você não precisa implementar tudo de uma vez. Comece com 2 ou 3 ferramentas e adicione gradualmente. Em 30 dias você já vai sentir diferença. Em 90 dias, o arsenal estará consolidado.
      </PullQuote>
    </section>
  </div>
);
