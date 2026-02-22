export interface PulseCard {
  id: string;
  category: 'corpo' | 'mente' | 'alma' | 'poder' | 'relacoes' | 'presenca';
  quote: string;
  author: string;
  authorRole?: string;
  context: string;
  reflection: string;
  intensity: 'leve' | 'medio' | 'profundo';
  tags: string[];
}

export type PulseCategory = PulseCard['category'];

export interface PulseCategoryTheme {
  label: string;
  color: string;
  background: string;
  textColor: string;
  contextColor: string;
}

export const PULSE_THEMES: Record<PulseCategory, PulseCategoryTheme> = {
  corpo: {
    label: 'CORPO',
    color: '#C4622D',
    background: '#2A1510',
    textColor: 'rgba(255,255,255,0.92)',
    contextColor: 'rgba(255,255,255,0.55)',
  },
  mente: {
    label: 'MENTE',
    color: '#6B7FF5',
    background: '#0D0F24',
    textColor: 'rgba(255,255,255,0.92)',
    contextColor: 'rgba(255,255,255,0.55)',
  },
  alma: {
    label: 'ALMA',
    color: '#8A7FF5',
    background: '#08060F',
    textColor: 'rgba(255,255,255,0.92)',
    contextColor: 'rgba(255,255,255,0.55)',
  },
  poder: {
    label: 'PODER',
    color: '#00BCD4',
    background: '#04151A',
    textColor: 'rgba(255,255,255,0.92)',
    contextColor: 'rgba(255,255,255,0.55)',
  },
  relacoes: {
    label: 'RELAÇÕES',
    color: '#FF9A6C',
    background: '#1E0E06',
    textColor: 'rgba(255,255,255,0.92)',
    contextColor: 'rgba(255,255,255,0.55)',
  },
  presenca: {
    label: 'PRESENÇA',
    color: 'rgba(42,32,53,0.60)',
    background: '#F5EDE4',
    textColor: '#1A1520',
    contextColor: 'rgba(42,32,53,0.55)',
  },
};

export const pulseCards: PulseCard[] = [
  // ── CORPO ──
  { id: 'corpo-001', category: 'corpo', quote: "O trauma não é o que aconteceu com você. É o que acontece dentro de você como resultado do que aconteceu.", author: "Gabor Maté", authorRole: "Médico e pesquisador", context: "Isso muda tudo. Você não é o que te aconteceu — você é o que ficou dentro depois.", reflection: "O que ainda pulsa dentro de você de algo que deveria ter passado?", intensity: 'profundo', tags: ['trauma', 'cura', 'padroes'] },
  { id: 'corpo-002', category: 'corpo', quote: "O corpo lembra o que a mente esqueceu.", author: "Bessel van der Kolk", authorRole: "Psiquiatra, autor de O Corpo Guarda as Marcas", context: "Cada tensão crônica é uma memória armazenada em músculo. Não em pensamento.", reflection: "Onde no seu corpo você sente algo que não sabe nomear com palavras?", intensity: 'profundo', tags: ['corpo', 'memoria', 'somatico'] },
  { id: 'corpo-003', category: 'corpo', quote: "Sintomas são mensagens, não inimigos.", author: "CorpoFala", context: "A dor de cabeça antes da reunião. A gastrite quando nega o que sente. O corpo fala o que você cala.", reflection: "Qual sintoma seu corpo repete que você ainda não parou para ouvir?", intensity: 'medio', tags: ['sintomas', 'mensagem', 'escuta'] },
  { id: 'corpo-004', category: 'corpo', quote: "O nervo vago é a autoestrada entre o que você sente e quem você é.", author: "Stephen Porges", authorRole: "Neurocientista, Teoria Polivagal", context: "Sua capacidade de se conectar, de se regular, de confiar — tudo passa pelo nervo vago.", reflection: "O que você faz hoje que ativa sua segurança interna — ou a sabota?", intensity: 'medio', tags: ['nervovago', 'regulacao', 'seguranca'] },
  { id: 'corpo-005', category: 'corpo', quote: "Você não tem um corpo. Você é um corpo.", author: "C.S. Lewis", context: "Tratar o corpo como veículo é o primeiro erro. Ele não te carrega — ele é você.", reflection: "Se seu corpo fosse um amigo, como você o trata comparado a como trata amigos?", intensity: 'leve', tags: ['corpo', 'identidade', 'cuidado'] },
  { id: 'corpo-006', category: 'corpo', quote: "A respiração é a única função autônoma que você também controla conscientemente. Use esse poder.", author: "CorpoFala", context: "Em 4 segundos de expiração longa, você muda o estado do seu sistema nervoso. Isso é poder real.", reflection: "Quando foi a última vez que você respirou de propósito — não por necessidade?", intensity: 'leve', tags: ['respiracao', 'nervovago', 'poder'] },
  { id: 'corpo-007', category: 'corpo', quote: "Raiva não expressa tem endereço: o seu estômago.", author: "CorpoFala", context: "Psiconeuroimunologia prova: emoções suprimidas ativam inflamação. Não é metáfora.", reflection: "O que você tem engolido que seu estômago está tentando expulsar?", intensity: 'profundo', tags: ['raiva', 'gastrite', 'expressao'] },
  { id: 'corpo-008', category: 'corpo', quote: "O movimento cura o que as palavras não alcançam.", author: "Peter Levine", authorRole: "Criador do Somatic Experiencing", context: "Trauma fica preso no corpo quando o impulso de movimento foi bloqueado. Mover é liberar.", reflection: "Que movimento seu corpo pede que você tem ignorado?", intensity: 'medio', tags: ['movimento', 'trauma', 'liberacao'] },
  { id: 'corpo-009', category: 'corpo', quote: "Tensão nos ombros é o peso de tudo que você carrega sozinho.", author: "CorpoFala", context: "Hiperresponsabilidade tem endereço no corpo: trapézio contraído. Não é coincidência.", reflection: "O que você está carregando sozinho que nunca pediu ajuda para dividir?", intensity: 'medio', tags: ['tensao', 'responsabilidade', 'ombros'] },
  { id: 'corpo-010', category: 'corpo', quote: "Insônia é o sistema nervoso que não recebeu permissão para parar.", author: "Matthew Walker", authorRole: "Neurocientista do sono", context: "Seu cérebro não desliga quando o ambiente diz que é seguro. Só quando você sente que é seguro.", reflection: "O que você precisa resolver internamente para seu sistema nervoso confiar na noite?", intensity: 'profundo', tags: ['insonia', 'nervoso', 'seguranca'] },
  { id: 'corpo-011', category: 'corpo', quote: "A pele é o maior órgão e o mais social. Ela quer contato — e sofre sem ele.", author: "Tiffany Field", authorRole: "Pesquisadora de toque, Universidade de Miami", context: "Privação de toque eleva cortisol, reduz oxitocina, enfraquece imunidade. O corpo precisa de presença.", reflection: "Quando foi a última vez que você foi tocado de forma que se sentiu realmente visto?", intensity: 'profundo', tags: ['toque', 'conexao', 'solidao'] },
  { id: 'corpo-012', category: 'corpo', quote: "Seu intestino tem 100 milhões de neurônios. É literalmente seu segundo cérebro.", author: "Michael Gershon", authorRole: "Neurogastroenterologista", context: "95% da serotonina é produzida no intestino. Sua alegria começa no que você come e sente.", reflection: "Como você cuida do ambiente onde 95% do seu bem-estar é fabricado?", intensity: 'leve', tags: ['intestino', 'serotonina', 'cuidado'] },
  { id: 'corpo-013', category: 'corpo', quote: "Dor crônica não é fraqueza. É o sistema nervoso preso num alarme que esqueceu de desligar.", author: "John Sarno", authorRole: "Médico, especialista em dor psicossomática", context: "Quando a dor não tem causa estrutural clara, o sistema nervoso está comunicando algo emocional.", reflection: "Qual dor você carrega que os exames não encontram — mas que é completamente real?", intensity: 'profundo', tags: ['dor', 'somatico', 'nervoso'] },
  { id: 'corpo-014', category: 'corpo', quote: "Você pode mudar sua biologia pensando de forma diferente.", author: "Joe Dispenza", authorRole: "Neurocientista e pesquisador", context: "Neuroplasticidade não é conceito abstrato. Cada novo pensamento literalmente reconecta neurônios.", reflection: "Qual pensamento repetitivo está moldando sua biologia hoje — e você escolheria ele conscientemente?", intensity: 'medio', tags: ['neuroplasticidade', 'biologia', 'pensamento'] },
  { id: 'corpo-015', category: 'corpo', quote: "A garganta é onde a verdade fica presa.", author: "CorpoFala", context: "Nó na garganta antes de falar. Rouquidão que aparece sob pressão. O corpo retém o que a voz não diz.", reflection: "O que você precisaria dizer — a quem — que ainda está preso na garganta?", intensity: 'profundo', tags: ['expressao', 'voz', 'garganta'] },
  { id: 'corpo-016', category: 'corpo', quote: "Cansaço que o descanso não resolve é espiritual, não físico.", author: "CorpoFala", context: "Quando você está exausto mas dormiu 8 horas — algo dentro de você está sem sentido.", reflection: "Qual parte da sua vida está sugando energia sem devolver nada em troca?", intensity: 'profundo', tags: ['cansaco', 'sentido', 'burnout'] },
  { id: 'corpo-017', category: 'corpo', quote: "O sistema imunológico escuta cada pensamento.", author: "Candace Pert", authorRole: "Neurocientista, descobridora dos receptores de opioides", context: "Moléculas de emoção — neuropeptídeos — ativam ou suprimem a imunidade. Mente e corpo são um.", reflection: "Como estaria sua imunidade se ela refletisse exatamente seu estado emocional dos últimos 30 dias?", intensity: 'medio', tags: ['imunidade', 'emocoes', 'psiconeuro'] },
  { id: 'corpo-018', category: 'corpo', quote: "Prazer não é luxo. É regulação do sistema nervoso.", author: "CorpoFala", context: "Momentos de prazer genuíno ativam o sistema parassimpático — o estado de cura e regeneração.", reflection: "O que te dá prazer genuíno que você está adiando para quando 'merecer'?", intensity: 'leve', tags: ['prazer', 'regulacao', 'merecimento'] },
  { id: 'corpo-019', category: 'corpo', quote: "Gravar a memória traumática no músculo é um mecanismo de sobrevivência, não uma falha.", author: "Babette Rothschild", authorRole: "Terapeuta somática", context: "Seu corpo não está errado por guardar tensão. Ele está protegendo você do jeito que aprendeu.", reflection: "Que defesa do seu corpo você poderia agradecer hoje, mesmo querendo liberá-la?", intensity: 'profundo', tags: ['trauma', 'compaixao', 'protecao'] },
  { id: 'corpo-020', category: 'corpo', quote: "Seu coração bate 100 mil vezes por dia sem que você peça. Que outra coisa te é tão fiel?", author: "CorpoFala", context: "O corpo trabalha por você ininterruptamente. E ainda assim é o primeiro a ser ignorado quando algo dói.", reflection: "O que mudaria se você tratasse seu corpo com a mesma fidelidade que ele tem com você?", intensity: 'leve', tags: ['corpo', 'gratidao', 'fidelidade'] },
  { id: 'corpo-021', category: 'corpo', quote: "Medo é uma emoção no corpo antes de ser um pensamento na cabeça.", author: "Antonio Damasio", authorRole: "Neurocientista", context: "O corpo sente o perigo 200ms antes do cérebro racional processar. Confie nisso.", reflection: "Quando foi a última vez que seu corpo sentiu medo que sua mente racionalizou como exagero?", intensity: 'medio', tags: ['medo', 'intuicao', 'corpo'] },
  { id: 'corpo-022', category: 'corpo', quote: "Você não pode curar o corpo sem curar a história que ele carrega.", author: "CorpoFala", context: "Terapias físicas são incompletas sem integrar a dimensão emocional. Corpo e história são inseparáveis.", reflection: "Qual história do passado ainda se expressa como sintoma no seu presente?", intensity: 'profundo', tags: ['cura', 'historia', 'integracao'] },
  { id: 'corpo-023', category: 'corpo', quote: "A postura que você assume muda os hormônios que seu corpo produz em 2 minutos.", author: "Amy Cuddy", authorRole: "Pesquisadora de Harvard", context: "Corpo aberto e ereto aumenta testosterona em 20% e reduz cortisol em 25%. Em 2 minutos.", reflection: "Que postura seu corpo assume automaticamente quando você se sente ameaçado — e você poderia mudar agora?", intensity: 'leve', tags: ['postura', 'hormonios', 'poder'] },
  { id: 'corpo-024', category: 'corpo', quote: "Chorar é o sistema nervoso se autorregulando. Não é fraqueza — é inteligência.", author: "CorpoFala", context: "Lágrimas de emoção têm composição química diferente de lágrimas de irritação. O corpo sabe o que precisa liberar.", reflection: "Quando foi a última vez que você deixou as lágrimas irem até o fim — sem se desculpar por elas?", intensity: 'medio', tags: ['choro', 'regulacao', 'liberacao'] },
  { id: 'corpo-025', category: 'corpo', quote: "Adoecer sempre em momentos de stress não é coincidência. É o custo do não sentir.", author: "Gabor Maté", context: "O sistema imunológico suprimido pela repressão emocional crônica cobra seu preço nas transições.", reflection: "Em que momentos de vida você mais adoece — e o que sempre estava acontecendo em volta?", intensity: 'profundo', tags: ['doenca', 'stress', 'emocoes'] },

  // ── MENTE ──
  { id: 'mente-001', category: 'mente', quote: "Se você sempre faz o que sempre fez, sempre terá o que sempre teve.", author: "Tony Robbins", authorRole: "Coach e autor", context: "O loop não para sozinho. Precisa de interrupção consciente, não de vontade maior.", reflection: "Qual comportamento você repete esperando um resultado diferente?", intensity: 'medio', tags: ['mudanca', 'padrao', 'habito'] },
  { id: 'mente-002', category: 'mente', quote: "O pensamento é a sombra do sentimento — sempre mais escuro, mais vazio, mais simplificado.", author: "Carl Jung", context: "O que você pensa sobre si mesmo é sempre a versão empobrecida do que você realmente é.", reflection: "Qual pensamento sobre você mesmo é na verdade uma sombra de uma emoção não processada?", intensity: 'profundo', tags: ['jung', 'sombra', 'pensamento'] },
  { id: 'mente-003', category: 'mente', quote: "Não é o que acontece com você. É o que você faz com o que acontece.", author: "Epicteto", context: "Estoicismo não é frieza — é a distinção precisa entre o que está e o que não está no seu controle.", reflection: "O que você está sofrendo agora que está fora do seu controle — e ainda assim tratando como se estivesse dentro?", intensity: 'medio', tags: ['estoicismo', 'controle', 'resposta'] },
  { id: 'mente-004', category: 'mente', quote: "Suas crenças se tornam seus pensamentos. Seus pensamentos se tornam suas palavras. Suas palavras se tornam suas ações.", author: "Mahatma Gandhi", context: "A cadeia começa numa crença que você provavelmente nunca escolheu conscientemente.", reflection: "Qual crença fundamental você carrega que, se mudasse, mudaria tudo abaixo dela?", intensity: 'profundo', tags: ['crencas', 'pensamento', 'acao'] },
  { id: 'mente-005', category: 'mente', quote: "O inconsciente é o maior banco de dados do universo — e está dentro de você.", author: "Joe Dispenza", context: "95% das suas decisões vêm de programas inconscientes. Mudar o consciente é só 5% do trabalho.", reflection: "Qual decisão automática você tomou hoje que não foi realmente sua?", intensity: 'profundo', tags: ['inconsciente', 'decisao', 'dispenza'] },
  { id: 'mente-006', category: 'mente', quote: "A mente que se expande para uma nova ideia jamais volta ao tamanho original.", author: "Oliver Wendell Holmes", context: "Cada insight genuíno é irreversível. Você não pode des-perceber algo que percebeu.", reflection: "Qual insight dos últimos meses mudou permanentemente como você vê algo?", intensity: 'leve', tags: ['aprendizado', 'crescimento', 'percepcao'] },
  { id: 'mente-007', category: 'mente', quote: "Preocupação é juros pagos em dívidas que talvez você nunca deva.", author: "Mark Twain", context: "85% das coisas que você antecipa negativamente nunca acontecem. O custo emocional é real. O evento, não.", reflection: "O que você pagou em energia de preocupação esta semana que ainda não aconteceu?", intensity: 'medio', tags: ['ansiedade', 'preocupacao', 'presente'] },
  { id: 'mente-008', category: 'mente', quote: "A mente em loop não está procurando uma solução. Está procurando segurança.", author: "CorpoFala", context: "Quando o pensamento gira no mesmo lugar, ele não quer resolver — quer se sentir no controle.", reflection: "Qual pensamento recorrente é na verdade uma tentativa de se sentir seguro?", intensity: 'profundo', tags: ['loop', 'seguranca', 'ansiedade'] },
  { id: 'mente-009', category: 'mente', quote: "Você não é seus pensamentos. Você é o que os observa.", author: "Eckhart Tolle", context: "O observador não julga, não tem medo dos pensamentos. Ele apenas vê. Isso é liberdade.", reflection: "Nos últimos 5 minutos, qual pensamento passou que você confundiu com verdade?", intensity: 'medio', tags: ['observador', 'mindfulness', 'pensamento'] },
  { id: 'mente-010', category: 'mente', quote: "Disciplina é lembrar o que você quer.", author: "David Campbell", context: "Não é força de vontade. É clareza de visão. Quem sabe exatamente o que quer não precisa se forçar.", reflection: "O que você quer com tanta clareza que se forçar seria desnecessário?", intensity: 'medio', tags: ['disciplina', 'clareza', 'foco'] },
  { id: 'mente-011', category: 'mente', quote: "Toda vez que você pensa num problema sem resolvê-lo, você o fortalece.", author: "Joe Dispenza", context: "Neurônios que disparam juntos se conectam juntos. Ruminar é criar rodovias para o sofrimento.", reflection: "Qual problema você pensa repetidamente mas raramente age para transformar?", intensity: 'profundo', tags: ['ruminacao', 'acao', 'neuroplasticidade'] },
  { id: 'mente-012', category: 'mente', quote: "Entre o estímulo e a resposta existe um espaço. Nesse espaço está nosso poder.", author: "Viktor Frankl", authorRole: "Psiquiatra e sobrevivente do Holocausto", context: "Você não é determinado pelo que te acontece. Você é determinado pelo que escolhe naquele espaço.", reflection: "Em qual situação desta semana você perdeu o espaço entre estímulo e resposta?", intensity: 'profundo', tags: ['frankl', 'liberdade', 'resposta'] },
  { id: 'mente-013', category: 'mente', quote: "A comparação é o ladrão da alegria.", author: "Theodore Roosevelt", context: "Comparar seu interior com o exterior dos outros é sempre uma conta impossível — e cruel.", reflection: "Com quem você se compara que, no fundo, você sabe que é uma comparação injusta?", intensity: 'leve', tags: ['comparacao', 'alegria', 'autovalor'] },
  { id: 'mente-014', category: 'mente', quote: "Suas maiores limitações não são suas capacidades. São as histórias que você conta sobre elas.", author: "Tony Robbins", context: "Toda crença limitante começou como uma história que alguém contou — ou que você contou para sobreviver.", reflection: "Qual história sobre você mesmo você contou tantas vezes que confundiu com fato?", intensity: 'profundo', tags: ['crencas', 'limitacao', 'historia'] },
  { id: 'mente-015', category: 'mente', quote: "Você tem 60.000 pensamentos por dia. 95% são os mesmos de ontem.", author: "Joe Dispenza", context: "A mente padrão não pensa — recita. Liberdade real começa com um pensamento genuinamente novo.", reflection: "Qual pensamento você teve hoje que foi genuinamente novo — não uma repetição?", intensity: 'medio', tags: ['habito', 'pensamento', 'novidade'] },

  // ── ALMA ──
  { id: 'alma-001', category: 'alma', quote: "Quem olha para fora, sonha. Quem olha para dentro, desperta.", author: "Carl Jung", context: "A jornada interior é a única que leva a algum lugar que importa de verdade.", reflection: "O que você tem procurado fora de você que sempre foi uma questão interna?", intensity: 'profundo', tags: ['jung', 'interior', 'despertar'] },
  { id: 'alma-002', category: 'alma', quote: "A ferida é o lugar por onde a luz entra em você.", author: "Rumi", context: "Suas maiores dores são também seus maiores portais de transformação — se você não as fechar.", reflection: "Qual ferida você tem tentado apressar curar — em vez de deixar que ela te abra?", intensity: 'profundo', tags: ['rumi', 'ferida', 'luz'] },
  { id: 'alma-003', category: 'alma', quote: "O propósito não é encontrado. É construído — no cruzamento do que você ama e do que o mundo precisa.", author: "Viktor Frankl", context: "Propósito não vem de dentro nem de fora — nasce no encontro entre os dois.", reflection: "Onde o que você ama fazer se encontra com o que alguém genuinamente precisa?", intensity: 'medio', tags: ['proposito', 'sentido', 'frankl'] },
  { id: 'alma-004', category: 'alma', quote: "Você não tem uma alma. Você é uma alma. Você tem um corpo.", author: "C.S. Lewis", context: "Inverter essa equação muda tudo. O corpo é temporário. O que você é, não.", reflection: "Se você fosse sua alma e não seu corpo, o que julgaria menos — e o que valorizaria mais?", intensity: 'profundo', tags: ['alma', 'identidade', 'espiritualidade'] },
  { id: 'alma-005', category: 'alma', quote: "Não é o peso que quebra você. É como você o carrega.", author: "Lou Holtz", context: "Duas pessoas com o mesmo peso — uma dobra, outra cresce. A diferença está no sentido que dão.", reflection: "Qual peso você carrega que poderia transformar em algo que te fortalece?", intensity: 'medio', tags: ['peso', 'sentido', 'resiliencia'] },
  { id: 'alma-006', category: 'alma', quote: "A escuridão não pode expulsar escuridão; só a luz pode. O ódio não pode expulsar ódio; só o amor pode.", author: "Martin Luther King Jr.", context: "A resposta ao que te machuca raramente é mais do mesmo. É o oposto que transforma.", reflection: "Onde você tem respondido dor com mais dor — e o que seria a resposta oposta?", intensity: 'profundo', tags: ['amor', 'transformacao', 'cura'] },
  { id: 'alma-007', category: 'alma', quote: "Gratidão não é sentir que tudo está bem. É perceber que mesmo o difícil tem valor.", author: "CorpoFala", context: "Gratidão de superfície é performática. Gratidão real é gerada no contato com a dificuldade.", reflection: "Qual situação difícil atual, olhando de longe, provavelmente vai te agradecer no futuro?", intensity: 'medio', tags: ['gratidao', 'perspectiva', 'dificuldade'] },
  { id: 'alma-008', category: 'alma', quote: "O perdão não é para o outro. É para você parar de carregar o peso do rancor.", author: "Lewis Smedes", context: "Guardar rancor é beber veneno esperando que o outro morra. O custo é inteiramente seu.", reflection: "O que você ainda carrega de alguém que — independente deles — está te pesando?", intensity: 'profundo', tags: ['perdao', 'rancor', 'liberdade'] },
  { id: 'alma-009', category: 'alma', quote: "O silêncio não é ausência. É a presença de tudo que importa.", author: "CorpoFala", context: "Em silêncio, você ouve o que o barulho do dia inteiro mascarou.", reflection: "Quando foi a última vez que você ficou em silêncio verdadeiro — sem tela, sem música, sem distração?", intensity: 'leve', tags: ['silencio', 'presenca', 'escuta'] },
  { id: 'alma-010', category: 'alma', quote: "Você não precisa ser bom. Só precisa continuar andando.", author: "Mary Oliver", authorRole: "Poetisa americana", context: "Perfeição paralisa. Movimento gera. A única condição para chegar é continuar.", reflection: "Em que parte da sua vida você parou de andar porque achou que não estava sendo bom o suficiente?", intensity: 'leve', tags: ['perfeicao', 'movimento', 'continuidade'] },

  // ── PODER ──
  { id: 'poder-001', category: 'poder', quote: "O único limite para o seu impacto é sua imaginação e seu comprometimento.", author: "Tony Robbins", context: "Não é talento. Não é sorte. É o encontro entre visão clara e comprometimento inabalável.", reflection: "Qual comprometimento você faz a si mesmo constantemente — e quebra no primeiro obstáculo?", intensity: 'medio', tags: ['robbins', 'comprometimento', 'impacto'] },
  { id: 'poder-002', category: 'poder', quote: "Faça o difícil quando é fácil e faça o grande quando é pequeno.", author: "Lao Tzu", context: "A hora certa para começar sempre foi antes. A segunda melhor hora é agora.", reflection: "O que ficou pequeno enquanto você adiava — e agora parece grande demais para começar?", intensity: 'medio', tags: ['acao', 'inicio', 'adiamento'] },
  { id: 'poder-003', category: 'poder', quote: "Não se meça pela vitória. Meça-se pelo quanto você se levanta depois de cair.", author: "Vince Lombardi", context: "Resiliência não é não cair. É o que você decide depois da queda.", reflection: "Da última vez que você caiu — quanto tempo levou para se levantar, e o que fez a diferença?", intensity: 'medio', tags: ['resiliencia', 'queda', 'levantamento'] },
  { id: 'poder-004', category: 'poder', quote: "A maioria das pessoas sobrestima o que pode fazer em um ano e subestima o que pode fazer em dez.", author: "Bill Gates", context: "Impaciência de curto prazo destrói potencial de longo prazo. Consistência bate intensidade.", reflection: "O que você desistiu nos últimos anos que, se tivesse continuado, estaria colhendo agora?", intensity: 'profundo', tags: ['consistencia', 'longoprazo', 'paciencia'] },
  { id: 'poder-005', category: 'poder', quote: "A mente que não domina a si mesma é sempre dominada por outra coisa.", author: "CorpoFala", context: "Algoritmos, opiniões alheias, urgências fabricadas — alguém sempre vai preencher o vácuo de liderança interna.", reflection: "O que está gerenciando seu foco agora — você ou algo externo?", intensity: 'profundo', tags: ['foco', 'autodisciplina', 'lideranca'] },
  { id: 'poder-006', category: 'poder', quote: "Energia vai onde a atenção flui.", author: "Tony Robbins", context: "Não é o que você quer que determina sua vida. É no que você foca — consciente ou não.", reflection: "Nos últimos 7 dias, onde foi a maior parte da sua atenção — e você escolheu isso?", intensity: 'medio', tags: ['atencao', 'energia', 'foco'] },
  { id: 'poder-007', category: 'poder', quote: "Não conte seus dias. Faça seus dias contarem.", author: "Muhammad Ali", context: "Presença e propósito transformam qualquer dia em algo que vale a pena ter vivido.", reflection: "O que tornaria hoje um dia que valeria a pena ter vivido — e você ainda pode fazer isso?", intensity: 'leve', tags: ['presenca', 'proposito', 'acao'] },
  { id: 'poder-008', category: 'poder', quote: "Seja mais duro com você mesmo agora para ter uma vida mais fácil depois.", author: "Epicteto", context: "Desconforto escolhido agora evita sofrimento imposto depois. Essa equação nunca falha.", reflection: "Qual desconforto você está evitando agora que está acumulando juros para o futuro?", intensity: 'profundo', tags: ['disciplina', 'estoicismo', 'futuro'] },
  { id: 'poder-009', category: 'poder', quote: "A vida se expande ou se contrai em proporção à sua coragem.", author: "Anaïs Nin", context: "Não é um discurso motivacional. É uma equação: mais coragem = mais vida. Menos coragem = menos vida.", reflection: "Qual decisão corajosa, se tomada, expandiria sua vida de forma irreversível?", intensity: 'profundo', tags: ['coragem', 'expansao', 'decisao'] },
  { id: 'poder-010', category: 'poder', quote: "O sucesso deixa pistas. Mas só quem está procurando as vê.", author: "Tony Robbins", context: "Modelagem é a forma mais rápida de aprendizado. Quem chegou onde você quer chegar já mapeou o caminho.", reflection: "Quem tem o resultado que você quer — e o que especificamente você ainda não estudou sobre o que eles fazem?", intensity: 'medio', tags: ['aprendizado', 'modelagem', 'sucesso'] },

  // ── RELAÇÕES ──
  { id: 'relacoes-001', category: 'relacoes', quote: "O amor não é um sentimento. É uma decisão que você renova a cada dia.", author: "M. Scott Peck", authorRole: "Psiquiatra, A Estrada Menos Percorrida", context: "Sentimentos vêm e vão. A decisão de permanecer presente é o que constrói algo real.", reflection: "Em que relacionamento você está esperando sentir amor em vez de escolher expressá-lo?", intensity: 'profundo', tags: ['amor', 'decisao', 'relacionamento'] },
  { id: 'relacoes-002', category: 'relacoes', quote: "O limite saudável não é uma parede. É uma porta com fechadura que só você tem a chave.", author: "CorpoFala", context: "Limite não é rejeição. É a condição para que o amor possa entrar com segurança.", reflection: "Qual limite você precisaria estabelecer para que um relacionamento importante se tornasse mais seguro?", intensity: 'profundo', tags: ['limites', 'seguranca', 'amor'] },
  { id: 'relacoes-003', category: 'relacoes', quote: "Você ensina as pessoas como te tratar.", author: "Dr. Phil McGraw", context: "O que você tolera repetidamente se torna o padrão. O que você não aceita de volta não retorna.", reflection: "O que você tem tolerado num relacionamento que está ensinando o outro a continuar fazendo?", intensity: 'profundo', tags: ['limites', 'padrao', 'responsabilidade'] },
  { id: 'relacoes-004', category: 'relacoes', quote: "Conexão é o oposto da adição.", author: "Johann Hari", authorRole: "Jornalista, Conexão Perdida", context: "A raiz de muitas dependências não é a substância — é a desconexão humana que ela temporariamente preenche.", reflection: "Onde você usa algo externo para preencher uma necessidade de conexão que poderia ser pedida diretamente?", intensity: 'profundo', tags: ['conexao', 'adicao', 'relacionamento'] },
  { id: 'relacoes-005', category: 'relacoes', quote: "A intimidade é o risco de ser visto completamente — e permanecer.", author: "Brené Brown", context: "Vulnerabilidade não é fraqueza. É o único portal para conexão real. Sem ela, a relação é performance.", reflection: "Qual parte de você você ainda não mostrou a quem mais ama — por medo de não permanecerem?", intensity: 'profundo', tags: ['intimidade', 'vulnerabilidade', 'brown'] },
  { id: 'relacoes-006', category: 'relacoes', quote: "Amor que exige que você mude para merecê-lo não é amor. É condição.", author: "CorpoFala", context: "Amor real diz: 'Eu te aceito e quero crescer com você.' Condição diz: 'Quando você for diferente, eu te amo.'", reflection: "Onde você está mudando para ser amado — em vez de crescer porque quer?", intensity: 'profundo', tags: ['amor', 'condicao', 'autovalor'] },
  { id: 'relacoes-007', category: 'relacoes', quote: "Silêncio não é paz. Às vezes é o som do que não foi dito acumulando.", author: "CorpoFala", context: "O maior perigo nos relacionamentos não é a briga. É o silêncio sobre o que importa.", reflection: "O que você está em silêncio sobre num relacionamento que, se falado, poderia transformar tudo?", intensity: 'profundo', tags: ['comunicacao', 'silencio', 'relacao'] },
  { id: 'relacoes-008', category: 'relacoes', quote: "As pessoas mais difíceis de amar geralmente são as que mais precisam de amor.", author: "Thich Nhat Hanh", context: "Comportamento difícil é quase sempre uma linguagem distorcida de necessidade não atendida.", reflection: "Qual pessoa difícil na sua vida estaria pedindo o quê — se você tradusse o comportamento?", intensity: 'medio', tags: ['compaixao', 'dificuldade', 'necessidade'] },

  // ── PRESENÇA ──
  { id: 'presenca-001', category: 'presenca', quote: "O momento presente sempre será. Ele é o único que sempre existiu.", author: "Eckhart Tolle", context: "Passado é memória. Futuro é imaginação. Agora é o único lugar onde a vida realmente acontece.", reflection: "Quanto da sua energia hoje foi para algo que já passou ou ainda não chegou?", intensity: 'medio', tags: ['tolle', 'agora', 'presenca'] },
  { id: 'presenca-002', category: 'presenca', quote: "Antes de falar, pergunte: é verdadeiro? É necessário? É gentil?", author: "Sócrates", context: "Três filtros. Se uma fala passa pelos três, vale dizer. Se não, talvez o silêncio seja mais sábio.", reflection: "Qual coisa você disse recentemente que não passaria nos três filtros — e como teria sido diferente?", intensity: 'leve', tags: ['comunicacao', 'sabedoria', 'fala'] },
  { id: 'presenca-003', category: 'presenca', quote: "Você não precisa controlar seus pensamentos. Só precisa parar de deixá-los controlar você.", author: "Dan Millman", context: "A liberdade não é ausência de pensamentos difíceis — é a capacidade de observá-los sem ser arrastado.", reflection: "Qual pensamento te controlou hoje — e você poderia ter apenas observado?", intensity: 'medio', tags: ['mindfulness', 'pensamento', 'liberdade'] },
  { id: 'presenca-004', category: 'presenca', quote: "O chá é quente. Beba-o.", author: "Thich Nhat Hanh", context: "Tão simples que parece óbvio. Tão raro que muda tudo. Estar inteiramente em uma coisa.", reflection: "Quando foi a última vez que você fez algo com 100% da sua atenção — sem dividir com mais nada?", intensity: 'leve', tags: ['atencao', 'simplicidade', 'presenca'] },
  { id: 'presenca-005', category: 'presenca', quote: "Felicidade não é a ausência de problemas. É a habilidade de lidar com eles.", author: "Steve Maraboli", context: "Esperar a vida sem problemas é esperar uma vida que não existe. Lidar bem é a habilidade real.", reflection: "Qual habilidade de lidar com dificuldades você notou que cresceu em você nos últimos anos?", intensity: 'leve', tags: ['felicidade', 'habilidade', 'dificuldade'] },
  { id: 'presenca-006', category: 'presenca', quote: "Simplificar é eliminar o desnecessário para que o necessário possa falar.", author: "Hans Hofmann", context: "Complexidade é muitas vezes procrastinação disfarçada. O que importa costuma ser simples.", reflection: "O que você poderia simplificar hoje que tornaria tudo o resto mais claro?", intensity: 'leve', tags: ['simplicidade', 'clareza', 'foco'] },
  { id: 'presenca-007', category: 'presenca', quote: "Não é o que você olha que importa. É o que você vê.", author: "Henry David Thoreau", context: "A percepção cria a realidade tanto quanto a realidade cria a percepção.", reflection: "O que você tem olhado todo dia sem realmente ver — que, se visto com atenção, mudaria algo?", intensity: 'medio', tags: ['percepcao', 'atencao', 'consciencia'] },
  { id: 'presenca-008', category: 'presenca', quote: "Cada manhã renascemos. O que fazemos hoje é o que mais importa.", author: "Buda", context: "O passado está encerrado. Hoje é o único dia onde qualquer coisa pode ser diferente.", reflection: "Se hoje fosse um recomeço completo, o que você escolheria fazer de forma diferente?", intensity: 'leve', tags: ['recomeco', 'hoje', 'escolha'] },
];

// Seeded pseudo-random shuffle (Fisher-Yates with seed)
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed;
  const next = () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Get a session-based seed that changes every visit
function getSessionSeed(): number {
  const KEY = 'pulso_session_seed';
  const stored = sessionStorage.getItem(KEY);
  if (stored) return parseInt(stored, 10);
  const seed = Date.now() % 2147483647;
  sessionStorage.setItem(KEY, seed.toString());
  return seed;
}

// Helper to get today's card deterministically
export function getDailyCardIndex(userId?: string): number {
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  const seed = userId ? userId.charCodeAt(0) : 42;
  return (dayOfYear + seed) % pulseCards.length;
}

// Shuffled deck — new order every session visit
export function getShuffledCards(category: PulseCategory | 'todos'): PulseCard[] {
  const base = category === 'todos' ? pulseCards : pulseCards.filter(c => c.category === category);
  const seed = getSessionSeed() + (category === 'todos' ? 0 : category.charCodeAt(0));
  return seededShuffle(base, seed);
}

export function getCardsByCategory(category: PulseCategory | 'todos'): PulseCard[] {
  if (category === 'todos') return pulseCards;
  return pulseCards.filter(c => c.category === category);
}
