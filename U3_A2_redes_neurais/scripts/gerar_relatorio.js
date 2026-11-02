// Relatório de Aula Prática: Fundamentos da IA, U3 A2, Redes Neurais Artificiais (XOR)
// Gerado pelo pipeline local (VS Code no Windows). Uso: node scripts/gerar_relatorio.js
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, HeadingLevel, PageBreak, ShadingType
} = require('docx');

const RAIZ = path.resolve(__dirname, '..');
const CT = JSON.parse(fs.readFileSync(path.join(RAIZ, 'build', 'conteudo.json'), 'utf8'));
const AMB = CT.ambiente || {};

// ------------------------------ AMBIENTE -------------------------------------
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const MESES_ABNT = ['jan.', 'fev.', 'mar.', 'abr.', 'maio', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];
const hoje = AMB.data ? new Date(AMB.data + 'T12:00:00') : new Date();
const dataExtenso = `${hoje.getDate()} de ${MESES[hoje.getMonth()]} de ${hoje.getFullYear()}`;
const dataAcesso = `${hoje.getDate()} ${MESES_ABNT[hoje.getMonth()]} ${hoje.getFullYear()}`;
const pyVer = AMB.Python || '3.x';
const pyMinor = pyVer.split('.').slice(0, 2).join('.');
const soNome = AMB.windows || AMB.Sistema || 'Windows';
const vscode = AMB.vscode ? `Visual Studio Code ${AMB.vscode}` : 'Visual Studio Code';
const equip = [AMB.equipamento, AMB.cpu, AMB.ram_gb ? `${AMB.ram_gb} GB de RAM` : null].filter(Boolean).join(', ');
const REPO_URL = 'https://github.com/ronichittoni/eng-soft-praticas';
const PASTA = 'U3_A2_redes_neurais';
const repoLinha = `${REPO_URL}, pasta ${PASTA}${AMB.commit ? `, commit ${AMB.commit}` : ''}`;

// ------------------------------- CONFIG --------------------------------------
const CONFIG = {
  instituicao: 'CENTRO UNIVERSITÁRIO ANHANGUERA PITÁGORAS UNOPAR',
  curso: 'CURSO DE ENGENHARIA DE SOFTWARE – BACHARELADO',
  polo: 'POLO RIBEIRÃO PRETO/SP (EAD)',
  aluno: 'RONI CHITTONI',
  ra: '2025434866',
  poloLinha: 'Ribeirão Preto/SP – Centro Universitário Anhanguera Pitágoras Unopar (EAD)',
  cursoLinha: 'Engenharia de Software – Bacharelado',
  componente: 'Fundamentos da Inteligência Artificial',
  unidade: 'U3 – Introdução ao Deep Learning',
  aula: 'A2 – Redes Neurais Artificiais',
  experimento: 'Classificação simples com porta lógica (rede neural para a função XOR)',
  dataRealizacao: dataExtenso,
  ambienteResumo: `Notebook pessoal do autor com ${soNome} · ${vscode} com extensão Jupyter · Python ${pyVer} · NumPy ${AMB.NumPy || ''} · Matplotlib ${AMB.Matplotlib || ''}`,
  cidade: 'RIBEIRÃO PRETO – SP',
  ano: String(hoje.getFullYear()),
  saida: path.join(RAIZ, 'saida', 'Relatorio_Aula_Pratica_Redes_Neurais_XOR_U3A2_Roni_Chittoni.docx'),
};

const UP = path.join(RAIZ, 'evidencias') + path.sep;
const CONTENT_W = 9071;

// ------------------------------ HELPERS --------------------------------------
const P = (text, opts = {}) => new Paragraph({
  alignment: opts.align || AlignmentType.JUSTIFIED,
  spacing: { line: 360, after: opts.after ?? 160, before: opts.before ?? 0 },
  indent: opts.indent ? { left: opts.indent } : undefined,
  keepNext: !!opts.keepNext,
  children: (Array.isArray(text) ? text : [new TextRun({ text, bold: !!opts.bold, italics: !!opts.italics, size: opts.size || 24, font: 'Arial' })]),
});
const PK = (text, opts = {}) => P(text, { ...opts, keepNext: true });
const R = (text, opts = {}) => new TextRun({ text, bold: !!opts.bold, italics: !!opts.italics, size: opts.size || 24, font: 'Arial' });
const M = (text) => new TextRun({ text, font: 'Courier New', size: 20 });
const H1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, keepNext: true, spacing: { before: 360, after: 220, line: 360 }, children: [new TextRun({ text: t, bold: true, size: 28, font: 'Arial', color: '000000' })] });
const H2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, spacing: { before: 280, after: 180, line: 360 }, children: [new TextRun({ text: t, bold: true, size: 24, font: 'Arial', color: '000000' })] });
const H3 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_3, keepNext: true, spacing: { before: 240, after: 160, line: 360 }, children: [new TextRun({ text: t, bold: true, italics: true, size: 24, font: 'Arial', color: '000000' })] });
const caption = (t) => new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 200, after: 80 }, children: [new TextRun({ text: t, size: 20, bold: true, font: 'Arial' })] });
const fonte = (t = `Fonte: elaborada pelo autor (${CONFIG.ano}).`) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [new TextRun({ text: t, size: 18, color: '555555', font: 'Arial' })] });
const img = (file, w, h) => new Paragraph({
  alignment: AlignmentType.CENTER, keepNext: true, spacing: { after: 40 },
  children: [new ImageRun({ type: 'png', data: fs.readFileSync(UP + file), transformation: { width: w, height: h } })],
});
const mono = (lines) => lines.map((l, i) => new Paragraph({
  keepNext: i < lines.length - 1 && (i < 2 || i >= lines.length - 3),
  spacing: { line: 240, after: i === lines.length - 1 ? 200 : 0 },
  shading: { type: ShadingType.CLEAR, fill: 'F2F2F2' },
  children: [new TextRun({ text: l === '' ? ' ' : l, font: 'Courier New', size: 17 })],
}));
const cod = (tag) => mono(CT.codigo[tag]);
const rotulo = (t) => new Paragraph({ keepNext: true, spacing: { before: 120, after: 60, line: 276 }, children: [new TextRun({ text: t, italics: true, size: 20, font: 'Arial', color: '555555' })] });
const sai = (tag) => [rotulo('Saída da célula:'), ...mono(CT.saidas[tag])];
const cell = (text, w, opts = {}) => new TableCell({
  width: { size: w, type: WidthType.DXA },
  shading: opts.shade ? { type: ShadingType.CLEAR, fill: 'DDE5F0' } : undefined,
  margins: { top: 80, bottom: 80, left: 120, right: 120 },
  children: [new Paragraph({ alignment: opts.align || AlignmentType.LEFT, keepNext: !!opts.keepNext, spacing: { line: 276, after: 0 }, children: [new TextRun({ text, bold: !!opts.bold, size: opts.size || 21, font: opts.font || 'Arial' })] })],
});
const linha2 = (a, b) => new TableRow({ cantSplit: true, children: [cell(a, 2700, { bold: true, shade: true }), cell(b, 6371)] });
const linha2k = (a, b) => new TableRow({ cantSplit: true, children: [cell(a, 2700, { bold: true, shade: true, keepNext: true }), cell(b, 6371, { keepNext: true })] });
const cab = (cols) => new TableRow({ tableHeader: true, cantSplit: true, children: cols.map(([t, w]) => cell(t, w, { bold: true, shade: true, align: AlignmentType.CENTER })) });

// -------------------------------- FIGURAS ------------------------------------
// Dimensões lidas do PNG real (build/conteudo.json); largura alvo em px, altura proporcional.
const dim = (file, alvo) => {
  const d = CT.figuras[file];
  if (!d) throw new Error(`Figura ausente: ${file}. Rode extrair_evidencias.py.`);
  const w = Math.min(alvo, d[0]);
  return { file, w, h: Math.round(w * d[1] / d[0]) };
};
const FIG = {
  f1: { ...dim('A6_fig1.png', 600), cap: 'Figura 1 – Saída gráfica da Célula 6 do roteiro: funções de pertinência e superfície de qualidade do sistema fuzzy' },
  f2: { ...dim('B1_fig1.png', 560), cap: 'Figura 2 – Função de ativação sigmoid e sua derivada (célula B1)' },
  f3: { ...dim('B5_fig1.png', 600), cap: 'Figura 3 – Evolução do erro quadrático médio e da acurácia ao longo de 10.000 épocas (célula B5)' },
  f4: { ...dim('B6_fig1.png', 540), cap: 'Figura 4 – Superfície de decisão da rede [2, 4, 1] para XOR, com o limite de decisão em saída = 0,5 (célula B6)' },
  f5: { ...dim('B7_fig1.png', 600), cap: 'Figura 5 – Mapa de calor da matriz W1 (entrada → camada oculta) antes e depois do treinamento (célula B7)' },
  f6: { ...dim('B8_fig1.png', 600), cap: 'Figura 6 – Contraprova com um único neurônio: fronteira linear encontrada para AND e OR e ausência de fronteira para XOR (célula B8)' },
  f7: { ...dim('B9_fig1.png', 540), cap: 'Figura 7 – Teste com 200 amostras sintéticas sobre a superfície de decisão aprendida (célula B9)' },
};
const figBlock = (k) => [caption(FIG[k].cap), img(FIG[k].file, FIG[k].w, FIG[k].h), fonte()];

// --------------------------------- CAPA --------------------------------------
const capa = [
  P(CONFIG.instituicao, { align: AlignmentType.CENTER, bold: true, size: 26, after: 60 }),
  P(CONFIG.curso, { align: AlignmentType.CENTER, size: 24, after: 60 }),
  P(CONFIG.polo, { align: AlignmentType.CENTER, size: 24, after: 1400 }),
  P(CONFIG.aluno, { align: AlignmentType.CENTER, bold: true, size: 26, after: 1600 }),
  P('RELATÓRIO DE AULA PRÁTICA', { align: AlignmentType.CENTER, bold: true, size: 32, after: 120 }),
  P(CONFIG.componente.toUpperCase(), { align: AlignmentType.CENTER, bold: true, size: 28, after: 120 }),
  P(`Unidade ${CONFIG.unidade}`, { align: AlignmentType.CENTER, size: 24, after: 60 }),
  P(`Aula ${CONFIG.aula}`, { align: AlignmentType.CENTER, size: 24, after: 60 }),
  P(`Experimento: ${CONFIG.experimento}`, { align: AlignmentType.CENTER, italics: true, size: 24, after: 2400 }),
  P(CONFIG.cidade, { align: AlignmentType.CENTER, bold: true, size: 24, after: 60 }),
  P(CONFIG.ano, { align: AlignmentType.CENTER, bold: true, size: 24, after: 0 }),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---------------------------- IDENTIFICAÇÃO ----------------------------------
const folhaRosto = [
  P('IDENTIFICAÇÃO', { align: AlignmentType.CENTER, bold: true, size: 26, before: 200, after: 300 }),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2700, 6371],
    rows: [
      linha2('Aluno', CONFIG.aluno), linha2('RA', CONFIG.ra),
      linha2('Polo / Unidade', CONFIG.poloLinha), linha2('Curso', CONFIG.cursoLinha),
      linha2('Componente curricular', CONFIG.componente),
      linha2('Unidade', CONFIG.unidade), linha2('Aula', CONFIG.aula),
      linha2('Experimento', CONFIG.experimento),
      linha2('Data de realização', CONFIG.dataRealizacao),
      linha2('Ambiente de execução', CONFIG.ambienteResumo),
      linha2('Repositório', repoLinha),
    ],
  }),
  new Paragraph({ spacing: { before: 2000, after: 0, line: 360 }, indent: { left: 4200 }, alignment: AlignmentType.JUSTIFIED,
    children: [new TextRun({ text: `Relatório de aula prática apresentado ao componente curricular ${CONFIG.componente}, do curso de ${CONFIG.cursoLinha}, como requisito parcial de avaliação da Unidade 3, Aula A2.`, size: 22, font: 'Arial' })] }),
  new Paragraph({ children: [new PageBreak()] }),
];

// ------------------------------ 1 INTRODUÇÃO ---------------------------------
const intro = [
  H1('1 INTRODUÇÃO'),
  P('Redes neurais artificiais são modelos computacionais formados por unidades simples, os neurônios artificiais, que recebem entradas ponderadas, somam um termo de viés (bias) e aplicam uma função de ativação. Organizadas em camadas e ajustadas a partir de exemplos, essas unidades aprendem funções complexas sem que o programador precise descrever a regra explicitamente, o que as coloca na vertente conexionista da inteligência artificial, em contraste com a vertente simbólica, baseada em regras (RUSSELL; NORVIG, 2022).'),
  P('O problema clássico que separa os dois mundos é a função lógica XOR (ou exclusivo). Minsky e Papert (1969) demonstraram que um único neurônio, o perceptron, só consegue separar classes com uma reta e, portanto, não representa XOR, cujas saídas iguais ocupam vértices opostos do quadrado unitário. A solução, consolidada com o algoritmo de retropropagação do erro (RUMELHART; HINTON; WILLIAMS, 1986), consiste em acrescentar uma camada oculta com ativações não lineares, de modo que a rede componha várias fronteiras lineares em uma fronteira curva (HAYKIN, 2001). A técnica empregada nesta prática é exatamente essa: um perceptron multicamadas com arquitetura [2, 4, 1], ativação sigmoid e treinamento por descida do gradiente, implementado do zero em Python com a biblioteca NumPy (HARRIS et al., 2020) e visualizado com Matplotlib (HUNTER, 2007).'),
  P('O objetivo da prática, conforme o roteiro da aula (CENTRO UNIVERSITÁRIO ANHANGUERA PITÁGORAS UNOPAR, 2026), é compreender os fundamentos das redes neurais artificiais, implementar uma rede simples para classificação e visualizar o processo de treinamento e aprendizado, no experimento denominado "Classificação simples com porta lógica". Este relatório registra a execução integral do roteiro, inclusive do código de lógica fuzzy nele contido, documenta a contradição interna encontrada no enunciado como ocorrência metodológica e apresenta a rede neural que resolve a função XOR com 100% de acurácia.'),
];

// --------------------------- 2 MATERIAIS E MÉTODOS ---------------------------
const passos = [
  ['1', 'Leitura do roteiro e identificação da contradição entre o enunciado (rede neural XOR) e o código fornecido (sistema fuzzy); decisão de executar as duas partes.', 'Seção 3.1'],
  ['2', 'Registro do ambiente de execução: versões de Python, NumPy, Matplotlib e sistema operacional (célula A0).', 'Quadro 1; Seção 3.2'],
  ['3', 'Célula 1 do roteiro: importação de NumPy e Matplotlib e configuração dos gráficos.', 'Seção 3.2'],
  ['4', 'Células 2 e 3 do roteiro: funções de pertinência triangulares e trapezoidais para Tempo de Espera (rápido, médio, lento) e Cordialidade (baixa, média, alta).', 'Seção 3.2'],
  ['5', 'Célula 4 do roteiro: regras do sistema fuzzy com operador MIN para o conectivo E e defuzzificação por média ponderada.', 'Seção 3.2'],
  ['6', 'Célula 5 do roteiro: teste do sistema fuzzy com quatro casos de atendimento.', 'Transcrição na Seção 3.2'],
  ['7', 'Célula 6 do roteiro: gráficos das funções de pertinência e superfície de qualidade.', 'Figura 1'],
  ['8', 'Célula B1: definição das quatro entradas e saídas de XOR, da função sigmoid e de sua derivada.', 'Figura 2'],
  ['9', 'Célula B2: arquitetura [2, 4, 1], inicialização dos pesos com semente fixa (42) e contagem de parâmetros.', 'Transcrição na Seção 3.3.1'],
  ['10', 'Célula B3: propagação frontal, retropropagação e atualização dos pesos por 10.000 épocas com taxa de aprendizado 0,5.', 'Transcrição na Seção 3.3.2'],
  ['11', 'Célula B4: avaliação final da rede nas quatro entradas, com predição por limiar 0,5.', 'Tabela 2'],
  ['12', 'Célula B5: curvas de erro quadrático médio e de acurácia por época.', 'Figura 3'],
  ['13', 'Célula B6: superfície de decisão sobre o plano (x1, x2) e limite de decisão em 0,5.', 'Figura 4'],
  ['14', 'Célula B7: pesos e bias antes e depois do treinamento, ativações da camada oculta e mapa de calor de W1.', 'Figura 5; Seção 3.3.5'],
  ['15', 'Célula B8: contraprova com um único neurônio (sem camada oculta) treinado em AND, OR e XOR.', 'Figura 6'],
  ['16', 'Célula B9: teste com 200 amostras sintéticas com ruído gaussiano em torno das quatro entradas.', 'Figura 7'],
];

const metodos = [
  H1('2 MATERIAIS E MÉTODOS'),
  H2('2.1 Ambiente de execução'),
  caption('Quadro 1 – Ambiente de execução do experimento'),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2700, 6371],
    rows: [
      linha2k('Equipamento', `Notebook pessoal do autor${equip ? ` (${equip})` : ''}`),
      linha2k('Sistema operacional', soNome),
      linha2k('IDE', `${vscode}, extensões Python e Jupyter da Microsoft`),
      linha2k('Linguagem', `Python ${pyVer}, em ambiente virtual dedicado (.venv)`),
      linha2k('Bibliotecas', `NumPy ${AMB.NumPy || ''} (álgebra matricial e geração pseudoaleatória); Matplotlib ${AMB.Matplotlib || ''} (gráficos, backend inline do Jupyter)`),
      linha2k('Notebook', 'U3_A2_Redes_Neurais_XOR.ipynb, 16 células de código e 4 de texto, executadas em sequência no mesmo kernel'),
      linha2k('Registro de evidências', 'Saídas de texto e figuras PNG extraídas do próprio .ipynb executado, sem recaptura de tela'),
      linha2k('Repositório', repoLinha),
      linha2('Solução digital do roteiro', 'Google Colab (https://colab.google/)'),
    ],
  }),
  fonte(`Fonte: elaborado pelo autor (${CONFIG.ano}).`),
  P(`O roteiro indica o Google Colab (GOOGLE, ${CONFIG.ano}) como solução digital. A execução registrada neste relatório ocorreu no notebook pessoal do autor, com ${soNome}, no Visual Studio Code (MICROSOFT, ${CONFIG.ano}), com a extensão Jupyter, sobre um ambiente virtual Python local (PYTHON SOFTWARE FOUNDATION, ${CONFIG.ano}) com as mesmas bibliotecas que o Colab disponibiliza (NumPy e Matplotlib), o que foi adotado como decisão metodológica por três razões: o arquivo .ipynb é o mesmo formato que o Colab abre, sem conversão, e não depende de nada além das duas bibliotecas; a inicialização dos pesos usa semente fixa, de modo que o treinamento é reproduzível em qualquer ambiente, inclusive no Colab, com diferenças apenas na última casa decimal; e as transcrições e figuras deste relatório foram extraídas diretamente das saídas gravadas no notebook executado, o que lhes dá fidelidade integral. O notebook, os scripts de execução e o gerador deste relatório estão versionados no GitHub (CHITTONI, ${CONFIG.ano}), na pasta ${PASTA} do repositório ${REPO_URL}, o que permite reproduzir a execução e conferir cada evidência.`),
  H2('2.2 Estratégia'),
  P('A prática foi conduzida em três fases. Na primeira, o roteiro foi lido na íntegra e confrontado consigo mesmo: título, objetivos, questões, checklist e seção de resultados descrevem uma rede neural para XOR, mas o código das seis células implementa um sistema de lógica fuzzy. Essa contradição foi tratada como a Ocorrência 1 (Seção 3.1) e definiu o desenho do experimento em duas partes. Na segunda fase, a Parte A, o código do roteiro foi reproduzido exatamente como entregue e executado, para que o procedimento literal ficasse registrado. Na terceira fase, a Parte B, a rede neural que o roteiro avalia foi implementada do zero, sem frameworks de aprendizado de máquina, para que cada etapa (propagação frontal, cálculo do erro, retropropagação, atualização dos pesos) ficasse exposta e verificável.'),
  P('A validação da Parte B foi feita em três níveis crescentes de exigência: as quatro entradas da tabela-verdade, que a rede precisa classificar com 100% de acurácia; uma contraprova com um único neurônio, que precisa falhar em XOR e acertar AND e OR, confirmando a necessidade da camada oculta; e um conjunto de 200 amostras sintéticas com ruído, que mede se a fronteira aprendida tem margem e não apenas memoriza os quatro pontos. Todas as sementes pseudoaleatórias foram fixadas (42 para os pesos e 7 para o ruído), de modo que o experimento é reproduzível.'),
  H2('2.3 Passo a passo da atividade'),
  caption('Tabela 1 – Passo a passo da atividade e evidências correspondentes'),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [900, 6371, 1800],
    rows: [
      cab([['Passo', 900], ['Descrição do passo realizado', 6371], ['Evidência', 1800]]),
      ...passos.map(([n, d, e]) => new TableRow({ cantSplit: true, children: [cell(n, 900, { align: AlignmentType.CENTER }), cell(d, 6371), cell(e, 1800, { align: AlignmentType.CENTER })] })),
    ],
  }),
  fonte(`Fonte: elaborado pelo autor (${CONFIG.ano}), com base nos procedimentos do roteiro da aula prática.`),
  P('Os passos 3 a 7 correspondem às seis células numeradas do roteiro. Os passos 8 a 16 correspondem às células B1 a B9 do notebook, acrescentadas para atender aos objetivos, às questões e ao checklist do enunciado. O código completo de cada célula da Parte B é apresentado na Seção 3.3, imediatamente antes da saída que produziu.'),
];

// ------------------------- 3 RESULTADOS E DISCUSSÃO --------------------------
const resultados = [
  H1('3 RESULTADOS E DISCUSSÃO'),
  H2('3.1 Ocorrência 1: contradição entre o enunciado e o código do roteiro'),
  P([R('Sintoma. ', { bold: true }), R('O roteiro da aula A2 tem como objetivos "compreender os fundamentos de Redes Neurais Artificiais", "implementar uma rede neural simples para classificação" e "visualizar o processo de treinamento"; a atividade proposta é "implementar uma rede neural simples para aprender a função lógica XOR"; as sete questões da seção "Avaliando os resultados" tratam de neurônios por camada, camada oculta, função sigmoid, taxa de aprendizado, épocas, superfície de decisão e pesos; o checklist exige gráfico de erro de treinamento, superfície de decisão, teste com dados sintéticos e acurácia acima de 90%; e a seção "Resultados" descreve uma rede [2, 4, 1] com backpropagation. O código das seis células, porém, implementa um sistema de lógica fuzzy (ZADEH, 1965) para avaliação de qualidade de atendimento, com funções de pertinência para tempo de espera e cordialidade, cinco regras com operador MIN e defuzzificação por média ponderada. Não há no código nenhum neurônio, peso, época ou função de ativação. O roteiro ainda instrui a nomear o notebook "Avaliação de Qualidade de Atendimento", nome que pertence ao tema fuzzy.')]),
  P([R('Causa-raiz. ', { bold: true }), R('O código corresponde ao conteúdo efetivamente lecionado na Unidade 3 da disciplina, que, apesar do título "Introdução ao Deep Learning", ensina lógica fuzzy; redes neurais são o conteúdo da Unidade 4. O roteiro foi montado com a moldura textual de uma aula de redes neurais e o corpo de código de uma aula de lógica fuzzy, provavelmente por reaproveitamento de material entre unidades. Trata-se de um defeito do enunciado, não do ambiente nem da execução.')]),
  P([R('Correção adotada. ', { bold: true }), R('Executar as duas coisas. O código fuzzy foi reproduzido sem alteração e executado (Parte A, Seção 3.2), de modo que o procedimento literal do roteiro está documentado. Em seguida, foi implementada a rede neural que o roteiro avalia (Parte B, Seção 3.3), única forma de responder às questões com base em observações da prática e de cumprir o checklist. O notebook recebeu o nome U3_A2_Redes_Neurais_XOR, coerente com a aula.')]),
  P([R('Lição. ', { bold: true }), R('Um roteiro é um requisito, e requisitos contraditórios precisam ser detectados antes da execução, não depois. A verificação cruzada entre objetivos, procedimento e critérios de avaliação levou menos de dez minutos e evitou entregar um relatório sobre lógica fuzzy para uma aula cujas questões não poderiam ser respondidas com esse código. A mesma disciplina de leitura crítica vale para qualquer especificação de software.')]),

  H2('3.2 Parte A: execução literal do roteiro (sistema fuzzy)'),
  PK('A célula A0, acrescentada antes da Célula 1 do roteiro, registra o ambiente:'),
  ...cod('A0'),
  ...sai('A0'),
  P('As Células 1 a 4 do roteiro definem as importações, as funções de pertinência e as regras. A Célula 4, que concentra a lógica do sistema, é reproduzida abaixo; as funções de pertinência das Células 2 e 3 são funções lineares por partes que valem 1 no núcleo de cada termo (por exemplo, tempo rápido até 10 min, lento a partir de 35 min) e decaem linearmente na zona de transição.'),
  ...cod('A4'),
  PK('A Célula 5 executa quatro casos de teste. Transcrição integral da saída:'),
  ...sai('A5'),
  P('Três detalhes da saída merecem interpretação. No Caso 2 (15 min, cordialidade 6), o tempo pertence com grau 0,5 ao termo "rápido" e 0,5 ao termo "médio", e a cordialidade com grau 0,5 a "média" e 0 a "alta"; a regra 2 (rápido E média) e a regra 4 (médio E média) disparam ambas com força 0,5, o que gera qualidade final (0,5 × 7 + 0,5 × 5) / 1,0 = 6,0. No Caso 4 (12 min, cordialidade 8), o tempo é "rápido" com grau 0,8 e "médio" com 0,2, e a cordialidade é "alta" com grau 1,0; disparam a regra 1 com força 0,8 e a regra 3 com 0,2, resultando em (0,8 × 9 + 0,2 × 7) / 1,0 = 8,6. Nos Casos 1 e 3 apenas uma regra dispara, com força 1,0, e a saída coincide com o valor representativo da classe (9,0 e 2,0). O denominador max(soma, 0,001) da defuzzificação evita divisão por zero quando nenhuma regra dispara.'),
  P('A Célula 6 produz os três gráficos da Figura 1. As duas primeiras curvas mostram as funções de pertinência sobrepostas, com as zonas de transição em que dois termos coexistem; a terceira mostra a superfície de qualidade, em que a cor vai de vermelho (ruim) a verde (excelente) conforme tempo e cordialidade. A superfície tem patamares planos e degraus, assinatura de um sistema de regras discretas suavizado pelas transições lineares das pertinências. Esse comportamento será contrastado com a superfície contínua da rede neural na Seção 3.3.4.'),
  ...figBlock('f1'),
  P('A Parte A cumpre o procedimento do roteiro, mas não produz nenhuma das evidências que o checklist exige (gráfico de erro de treinamento, superfície de decisão, acurácia), o que confirma a Ocorrência 1 e justifica a Parte B.'),

  H2('3.3 Parte B: rede neural [2, 4, 1] para a função XOR'),
  H3('3.3.1 Dados, função de ativação e inicialização'),
  P('A célula B1 define as quatro entradas da tabela-verdade, as saídas esperadas de XOR e a função sigmoid com sua derivada, escrita em função da própria ativação (a × (1 − a)), forma que evita recalcular a exponencial durante a retropropagação.'),
  ...cod('B1'),
  ...sai('B1'),
  P('A Figura 2 mostra a sigmoid e sua derivada. A sigmoid comprime qualquer valor real para o intervalo aberto (0, 1) e cruza 0,5 em z = 0; a derivada é máxima nesse ponto (0,25) e tende a zero nas extremidades. Esse formato explica dois fenômenos observados no treinamento: a lentidão inicial, quando as saídas estão próximas de 0,5 e os gradientes ainda são moderados, e a saturação final, quando as saídas se aproximam de 0 ou 1 e o gradiente diminui.'),
  ...figBlock('f2'),
  P('A célula B2 fixa a arquitetura e inicializa os pesos com distribuição uniforme em [−1, 1] e semente 42; os bias começam em zero. A rede tem 17 parâmetros treináveis.'),
  ...cod('B2'),
  ...sai('B2'),

  H3('3.3.2 Treinamento por retropropagação'),
  P('A célula B3 implementa o ciclo completo: propagação frontal, cálculo do erro, retropropagação dos gradientes locais (delta) da saída para a camada oculta e atualização de pesos e bias na direção oposta ao gradiente. O treinamento é em lote (as quatro amostras a cada época), com taxa de aprendizado 0,5 por 10.000 épocas.'),
  ...cod('B3'),
  PK('Transcrição do registro de treinamento, impresso na primeira época e a cada mil épocas:'),
  ...sai('B3'),
  P('O registro mostra a rede partindo de MSE 0,2629 com 50% de acurácia (duas das quatro saídas corretas por acaso, pois todas valem aproximadamente 0,5) e atingindo 100% antes da época 1.000, com o erro caindo de forma monotônica até 0,000239 na época 10.000. A inspeção do histórico completo, guardado nas listas historico_erro e historico_acuracia, localiza os marcos com precisão: a acurácia sobe a 75% na época 208 e a 100% na época 260; o MSE, que fica praticamente estacionado em torno de 0,25 durante as primeiras 200 épocas (0,2498 na época 50, 0,2404 na época 200), desaba entre as épocas 300 e 500 (0,2084 → 0,1156 → 0,0457) e entra em regime de decaimento lento a partir da época 1.000 (0,0059). A Figura 3 torna visível esse perfil em dois tempos: um patamar inicial, em que a rede ainda responde 0,5 para tudo, seguido de uma queda abrupta quando os pesos da camada oculta se diferenciam, e de uma cauda longa de refinamento.'),
  ...figBlock('f3'),
  P('O patamar inicial não é um defeito, mas uma característica da combinação sigmoid com pesos pequenos: enquanto |z| é pequeno em todas as unidades, as ativações ficam perto de 0,5, a derivada perto de 0,25 e os gradientes de cada amostra se cancelam parcialmente entre si, porque metade das amostras pede saída 0 e metade pede saída 1. Só quando a assimetria dos pesos iniciais se amplifica o suficiente para que alguma unidade oculta distinga as entradas é que o erro passa a cair. A cauda longa, por sua vez, decorre da saturação da sigmoid: quanto mais as saídas se aproximam de 0 e 1, menor o fator a × (1 − a) e menor cada passo.'),

  H3('3.3.3 Resultado final nas quatro entradas'),
  PK('A célula B4 avalia a rede treinada:'),
  ...cod('B4'),
  ...sai('B4'),
  caption('Tabela 2 – Saída da rede treinada para cada entrada da tabela-verdade de XOR'),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [1700, 1700, 2071, 1800, 1800],
    rows: [
      cab([['Entrada (x1, x2)', 1700], ['Esperado', 1700], ['Saída da rede', 2071], ['Predição (≥ 0,5)', 1800], ['Correto', 1800]]),
      ...[['(0, 0)', '0', '0,0095', '0', 'sim'], ['(0, 1)', '1', '0,9839', '1', 'sim'], ['(1, 0)', '1', '0,9849', '1', 'sim'], ['(1, 1)', '0', '0,0195', '0', 'sim']].map((r) => new TableRow({
        cantSplit: true, children: r.map((t, i) => cell(t, [1700, 1700, 2071, 1800, 1800][i], { align: AlignmentType.CENTER })),
      })),
    ],
  }),
  fonte(`Fonte: elaborado pelo autor (${CONFIG.ano}).`),
  P('As quatro saídas ficam a menos de 0,02 do valor esperado e a predição por limiar 0,5 acerta todas, com MSE final de 0,000239. O critério do checklist (acurácia acima de 90%) é cumprido com folga. Nota-se a simetria das saídas: 0,9839 e 0,9849 para as duas entradas com um único 1, e 0,0095 e 0,0195 para as entradas iguais, o que indica que a rede tratou as duas ordens (0, 1) e (1, 0) de forma quase equivalente, ainda que por caminhos internos diferentes, como a Seção 3.3.5 mostra.'),

  H3('3.3.4 Superfície de decisão'),
  P('A célula B6 avalia a rede em uma grade de 200 × 200 pontos do plano (x1, x2) no intervalo [−0,5; 1,5] e desenha a saída como mapa de cores, com a curva de nível 0,5 em preto.'),
  ...cod('B6'),
  ...figBlock('f4'),
  P('A Figura 4 mostra a geometria aprendida: uma faixa vermelha (saída próxima de 0) atravessa o plano na diagonal, contendo os pontos (0, 0) e (1, 1), e duas regiões verdes (saída próxima de 1) ocupam os cantos superior esquerdo, com (0, 1), e inferior direito, com (1, 0). O limite de decisão é formado por duas curvas, não por uma reta. É a imagem direta da razão pela qual XOR não é linearmente separável: nenhuma reta deixa (0, 1) e (1, 0) de um lado e (0, 0) e (1, 1) do outro, mas duas fronteiras aproximadamente paralelas, compostas pela camada oculta, deixam. A transição entre as cores é suave, por causa da sigmoid, mas estreita, por causa dos pesos grandes que o treinamento produziu. Comparada à superfície fuzzy da Figura 1, feita de patamares e degraus definidos à mão pelas regras, a superfície da rede é contínua e foi inteiramente aprendida a partir de quatro exemplos.'),

  H3('3.3.5 Pesos, bias e ativações da camada oculta'),
  PK('A célula B7 compara pesos e bias antes e depois do treinamento e imprime as ativações da camada oculta para cada entrada:'),
  ...cod('B7'),
  ...sai('B7'),
  ...figBlock('f5'),
  P('A Figura 5 e a transcrição mostram que o treinamento levou os pesos de valores pequenos (|w| < 1) a magnitudes entre 4 e 9, com uma estrutura legível. O neurônio oculto 1 (segunda coluna) terminou com pesos 4,61 para x1 e −6,26 para x2 e bias −2,06: ele só se ativa quando x1 = 1 e x2 = 0 (ativação 0,93 para (1, 0) e no máximo 0,11 nas demais entradas), funcionando como um detector de "x1 e não x2". O neurônio 3 terminou com pesos 3,83 e 3,85, ambos positivos, e bias −0,60: ativa-se com qualquer entrada que tenha ao menos um 1 (0,96; 0,96; 0,999) e fica em 0,35 para (0, 0), comportando-se como um OR. O neurônio 2 (pesos 6,37 e −4,77, bias 2,09) ativa-se para tudo, exceto (0, 1), para a qual cai a 0,06. O neurônio 0 permaneceu com pesos pequenos (−0,40 e −1,20) e peso de saída modesto (1,51): a rede praticamente não o usa, sinal de que quatro unidades ocultas são mais do que o problema exige.'),
  P('A camada de saída combina esses detectores com pesos W2 = [1,51; 8,93; −9,09; 4,44] e bias −0,08. A leitura é a seguinte: o OR (neurônio 3, peso +4,44) tende a ligar a saída para qualquer entrada com um 1; o neurônio 2 (peso −9,09) desliga a saída para (0, 0), (1, 0) e (1, 1), as três entradas para as quais ele está ativo; e o detector "x1 e não x2" (neurônio 1, peso +8,93) religa a saída especificamente para (1, 0). O resultado é que (0, 1) passa pelo OR sem ser desligada, (1, 0) é desligada e religada, e (0, 0) e (1, 1) ficam desligadas. É uma decomposição de XOR diferente da forma canônica (OR E NÃO AND), mas logicamente equivalente, e foi encontrada pela rede sem qualquer instrução sobre lógica.'),
  P('Os bias têm papel indispensável nessa construção, e a entrada (0, 0) o demonstra: como todos os x são zero, o somatório ponderado de cada neurônio oculto vale exatamente o bias, e as ativações para (0, 0) são sigmoid(b1) = sigmoid([0,48; −2,06; 2,09; −0,60]) = [0,62; 0,11; 0,89; 0,35], que coincidem com a transcrição. Sem bias, (0, 0) produziria ativação 0,5 em todas as unidades ocultas, independentemente dos pesos, e a rede não teria como diferenciá-la. Geometricamente, o bias desloca a fronteira linear de cada neurônio para longe da origem; os pesos determinam sua inclinação.'),

  H3('3.3.6 Contraprova: um único neurônio em AND, OR e XOR'),
  PK('A célula B8 treina um neurônio isolado, sem camada oculta, com o mesmo algoritmo, a mesma taxa e o mesmo número de épocas, em três problemas:'),
  ...cod('B8'),
  ...sai('B8'),
  ...figBlock('f6'),
  P('O neurônio único resolve AND e OR com 100% de acurácia e saídas nítidas (0,972 para o único 1 de AND; 0,985 e 1,0 para os três 1 de OR), e a Figura 6 mostra a reta encontrada em cada caso, separando corretamente os pontos. Em XOR, o mesmo neurônio converge para a resposta 0,5 em todas as quatro entradas, acurácia 50%, e os pesos colapsam para valores próximos de zero, razão pela qual nenhuma fronteira é desenhada no terceiro painel: não há reta a traçar porque não há reta que resolva o problema. É a demonstração experimental do resultado de Minsky e Papert (1969) e a resposta direta à pergunta do roteiro sobre o que aconteceria sem a camada oculta.'),

  H3('3.3.7 Teste com dados sintéticos'),
  PK('A célula B9 gera 50 pontos em torno de cada uma das quatro entradas, com ruído gaussiano de desvio padrão 0,15, rotula cada ponto com o XOR do vértice de origem e avalia a rede treinada:'),
  ...cod('B9'),
  ...sai('B9'),
  ...figBlock('f7'),
  P('A rede classifica corretamente 199 das 200 amostras (99,5%), embora tenha sido treinada apenas nos quatro vértices. O único erro, marcado com um X na Figura 7, é um ponto gerado em torno de (1, 0) que o ruído deslocou para aproximadamente (0,73; 0,24), em cima da curva de decisão. Esse resultado mostra que a rede não memorizou quatro pontos: a fronteira aprendida tem margem, e as nuvens de amostras ficam inteiras dentro das regiões corretas. Com a figura também se vê por que a margem não é infinita: a faixa vermelha central tem largura finita, e qualquer amostra que o ruído empurre para a diagonal será classificada como 0.'),
];

// ---------------------- 4 RESPOSTAS AOS QUESTIONAMENTOS ----------------------
const questoes = [
  H1('4 RESPOSTAS AOS QUESTIONAMENTOS'),
  H2('4.1 Questão 1: arquitetura da rede neural'),
  P([R('Quantos neurônios foram utilizados em cada camada da rede? ', { bold: true }), R('Dois na camada de entrada (x1 e x2), quatro na camada oculta e um na camada de saída, arquitetura [2, 4, 1], com 17 parâmetros treináveis: 8 pesos e 4 bias na primeira camada, 4 pesos e 1 bias na segunda (célula B2). A camada de entrada não realiza cálculo; apenas apresenta os valores.')]),
  P([R('Por que foi necessária uma camada oculta para resolver o problema XOR? ', { bold: true }), R('Porque um neurônio com ativação sigmoid separa o plano com uma única reta (w1x1 + w2x2 + b = 0), e os pontos de XOR com saída 1, (0, 1) e (1, 0), estão em vértices opostos do quadrado, com os pontos de saída 0 nos outros dois vértices: não existe reta que os separe. A camada oculta cria vários neurônios, cada um com sua reta, e a camada de saída combina as regiões resultantes. Na prática, a Seção 3.3.5 mostrou que a rede construiu um detector de "x1 e não x2", um OR e um detector de "não (0, 1)", e os combinou com pesos de sinais opostos, formando a fronteira em duas curvas da Figura 4.')]),
  P([R('O que aconteceria se tentássemos resolver XOR com apenas um neurônio? ', { bold: true }), R('Foi testado na célula B8: com o mesmo algoritmo, a mesma taxa e 10.000 épocas, o neurônio único resolveu AND e OR com 100% e convergiu em XOR para saída 0,5 nas quatro entradas, com 50% de acurácia e pesos próximos de zero (Figura 6). O treinamento não diverge nem oscila; ele encontra o melhor que uma reta consegue, que é não decidir.')]),

  H2('4.2 Questão 2: função de ativação'),
  P([R('Qual função de ativação foi utilizada na rede? Por que essa escolha? ', { bold: true }), R('A sigmoid logística, σ(z) = 1 / (1 + e^(−z)), em ambas as camadas. Foi escolhida por três razões: é diferenciável em todo o domínio, requisito da retropropagação; produz saídas em (0, 1), o que permite ler a saída da rede como grau de pertinência à classe 1 e aplicar o limiar 0,5; e sua derivada tem a forma σ(z) × (1 − σ(z)), calculável a partir da própria ativação já computada na propagação frontal, sem nova exponencial (função sigmoid_derivada, célula B1). É também a ativação indicada no roteiro.')]),
  P([R('Como a função sigmoid transforma os valores de entrada? ', { bold: true }), R('Ela comprime a reta real inteira no intervalo (0, 1): valores muito negativos vão a quase 0, valores muito positivos a quase 1, e z = 0 vai a exatamente 0,5 (Figura 2). A transição é suave e concentrada em torno de zero; fora de |z| ≈ 4 a curva já está saturada. Na rede treinada, isso é visível nas ativações ocultas: z = 2,55 para o neurônio 1 na entrada (1, 0) vira 0,93, e z = −3,71 na entrada (1, 1) vira 0,024.')]),
  P([R('Por que é importante ter uma função de ativação não linear? ', { bold: true }), R('Porque a composição de transformações lineares é linear: se as camadas apenas multiplicassem por matrizes e somassem bias, a rede inteira, por mais camadas que tivesse, equivaleria a um único neurônio linear e herdaria sua limitação de traçar uma só reta. A não linearidade entre as camadas é o que permite que a segunda camada combine regiões, e não apenas retas, e é o que gera a fronteira curva da Figura 4.')]),

  H2('4.3 Questão 3: processo de treinamento'),
  P([R('Qual algoritmo foi usado para treinar a rede neural? ', { bold: true }), R('Retropropagação do erro (backpropagation) com descida do gradiente em lote. A cada época, a célula B3 propaga as quatro entradas, calcula o erro (y − a2) e o MSE, obtém o gradiente local da saída, delta2 = erro × σ\'(a2), retropropaga para a camada oculta, delta1 = (delta2 · W2ᵀ) × σ\'(a1), e atualiza cada matriz de pesos somando taxa × (ativação de entradaᵀ · delta), que é a direção oposta ao gradiente do MSE.')]),
  P([R('O que representa a "taxa de aprendizado" e como ela afeta o treinamento? ', { bold: true }), R('É o tamanho do passo dado a cada atualização na direção oposta ao gradiente; aqui, 0,5. Taxa pequena produz passos curtos e treinamento lento, com risco de parar em um patamar como o das primeiras 200 épocas; taxa grande produz passos longos, com risco de ultrapassar o mínimo e oscilar ou divergir. Com 0,5 e gradiente somado sobre as quatro amostras, a rede saiu do patamar na época 208, atingiu 100% na 260 e reduziu o erro de forma monotônica até o fim, sem oscilação visível na Figura 3, o que indica uma taxa adequada para este problema.')]),
  P([R('Por que o erro diminui ao longo das épocas de treinamento? ', { bold: true }), R('Porque cada atualização move os pesos no sentido que reduz o MSE para as amostras apresentadas, por construção da descida do gradiente. O registro de treinamento confirma: 0,2629 na época 1, 0,2404 na 200, 0,0457 na 500, 0,0059 na 1.000 e 0,000239 na 10.000, sem nenhuma subida. A diminuição não é uniforme, pelo formato da sigmoid: lenta enquanto todas as saídas valem cerca de 0,5 e os gradientes das amostras se cancelam, rápida quando a camada oculta se diferencia, e lenta de novo quando as saídas saturam perto de 0 e 1 e a derivada σ\'(a) tende a zero.')]),

  H2('4.4 Questão 4: análise dos resultados'),
  P([R('A rede conseguiu aprender perfeitamente a função XOR? Como você pode verificar isso? ', { bold: true }), R('Sim, no sentido operacional: as quatro predições por limiar 0,5 estão corretas (100% de acurácia) e o MSE final é 0,000239. A verificação é a da célula B4 e da Tabela 2: propagar cada entrada pela rede treinada e comparar a saída com o valor esperado. Verificou-se também, na célula B9, que a rede classifica corretamente 199 de 200 amostras ruidosas, prova de que a fronteira aprendida tem margem. "Perfeitamente" merece ressalva: as saídas valem 0,0095, 0,9839, 0,9849 e 0,0195, não exatamente 0 e 1, porque a sigmoid nunca atinge os extremos; o erro residual pode ser reduzido com mais épocas, mas não zerado.')]),
  P([R('Compare as saídas da rede com os valores esperados para cada entrada. ', { bold: true }), R('(0, 0): esperado 0, obtido 0,0095; (0, 1): esperado 1, obtido 0,9839; (1, 0): esperado 1, obtido 0,9849; (1, 1): esperado 0, obtido 0,0195. O maior desvio absoluto é 0,0195, na entrada (1, 1), e o menor é 0,0095, na entrada (0, 0).')]),
  P([R('O que indica que a rede "aprendeu" a função lógica? ', { bold: true }), R('Três evidências convergentes: a tabela-verdade reproduzida com erro menor que 0,02 em cada entrada; a superfície de decisão da Figura 4, que separa as classes com uma geometria coerente com a estrutura de XOR, e não com um ajuste arbitrário aos quatro pontos; e a generalização para amostras ruidosas que nunca foram apresentadas no treinamento (99,5%). Aprender, aqui, significa ter encontrado pesos que implementam a função, e a Seção 3.3.5 mostrou que esses pesos têm estrutura lógica interpretável.')]),

  H2('4.5 Questão 5: visualização e interpretação'),
  P([R('O que representa a "superfície de decisão" mostrada no gráfico? ', { bold: true }), R('A saída da rede para cada ponto do plano de entradas, não apenas para os quatro vértices da tabela-verdade. Na Figura 4, a cor de cada ponto (x1, x2) é o valor de a2 que a rede produz para ele, de vermelho (próximo de 0) a verde (próximo de 1). A superfície mostra como a rede interpolou e extrapolou a partir de quatro exemplos.')]),
  P([R('Como a linha de contorno (limite de decisão) separa as classes? ', { bold: true }), R('A linha preta é a curva de nível em que a saída vale exatamente 0,5, o limiar de classificação. Tudo de um lado da linha é classificado como 1 e tudo do outro, como 0. Em XOR, a linha é dupla: duas curvas aproximadamente paralelas isolam a faixa diagonal da classe 0, que contém (0, 0) e (1, 1), dos dois cantos da classe 1, com (0, 1) e (1, 0).')]),
  P([R('Por que a superfície de decisão não é uma linha reta? ', { bold: true }), R('Porque a saída é uma combinação não linear de várias fronteiras lineares. Cada neurônio oculto traça uma reta no plano e responde com uma sigmoid à distância do ponto a essa reta; a camada de saída soma essas respostas com pesos de sinais diferentes e aplica outra sigmoid. A curva de nível 0,5 dessa composição só seria uma reta se um único neurônio oculto dominasse, o que seria insuficiente para XOR. A contraprova da célula B8 mostra exatamente o que acontece quando apenas uma reta está disponível: nenhuma fronteira é encontrada.')]),

  H2('4.6 Questão 6: análise dos pesos'),
  P([R('Como os pesos da rede mudaram durante o treinamento? ', { bold: true }), R('Partiram de valores uniformes em [−1, 1] e cresceram em magnitude, chegando a 6,37 em W1 e a 9,09 em W2 (Figura 5 e transcrição da Seção 3.3.5). O crescimento não foi uniforme: três dos quatro neurônios ocultos se especializaram, com pesos de sinais opostos ou ambos positivos, e um (neurônio 0) permaneceu com pesos pequenos e pouco usado pela saída. Os bias, que começaram em zero, assumiram valores entre −2,06 e 2,09.')]),
  P([R('O que representam os pesos entre a camada de entrada e a camada oculta? ', { bold: true }), R('Cada coluna de W1, com seu bias, define a reta w1x1 + w2x2 + b = 0 que um neurônio oculto usa para dividir o plano, e o sinal de cada peso diz se a entrada correspondente aproxima ou afasta o neurônio da ativação. Na rede treinada, o neurônio 1 (4,61; −6,26) responde a x1 e é inibido por x2, atuando como detector de "x1 e não x2"; o neurônio 3 (3,83; 3,85) responde a qualquer entrada, como um OR; o neurônio 2 (6,37; −4,77, com bias 2,09) responde a tudo exceto (0, 1). Os pesos são, portanto, as regras parciais que a rede descobriu.')]),
  P([R('Como os bias influenciam o comportamento da rede? ', { bold: true }), R('O bias desloca o limiar de disparo de cada neurônio, movendo a reta de decisão para longe da origem sem alterar sua inclinação. A entrada (0, 0) deixa isso explícito: como todos os x são zero, a ativação oculta é sigmoid do próprio bias, [0,62; 0,11; 0,89; 0,35], exatamente o que a transcrição registra. Sem bias, essa entrada produziria 0,5 em todos os neurônios, qualquer que fosse o treinamento, e a rede perderia a capacidade de tratá-la de forma distinta. O bias de −2,06 do neurônio 1 é o que o impede de disparar para (0, 0) e (1, 1) e o reserva para (1, 0).')]),

  H2('4.7 Questão 7: comparação com outras abordagens'),
  P([R('Como uma rede neural resolve XOR diferentemente de portas lógicas básicas (AND, OR)? ', { bold: true }), R('AND e OR são linearmente separáveis e um único neurônio as implementa, como a célula B8 comprovou com 100% em ambas (Figura 6). XOR não é, e a rede a resolve compondo portas: a camada oculta aprendeu, sem instrução, detectores equivalentes a sub-funções lógicas (um OR, um "x1 e não x2", um "não (0, 1)") e a camada de saída os combinou com pesos de sinais opostos. É a mesma ideia de construir XOR com portas AND, OR e NOT em circuitos digitais, com a diferença de que a decomposição foi encontrada por descida do gradiente a partir de exemplos.')]),
  P([R('Quais são as vantagens das redes neurais sobre sistemas baseados em regras fixas? ', { bold: true }), R('A prática ofereceu a comparação direta: o sistema fuzzy da Parte A tem funções de pertinência e cinco regras escritas à mão pelo projetista, e produz a superfície em patamares da Figura 1; a rede da Parte B recebeu apenas quatro exemplos e aprendeu a superfície contínua da Figura 4. A vantagem da rede é aprender o mapeamento a partir de dados, inclusive mapeamentos que ninguém sabe escrever como regra, e adaptar-se quando os dados mudam. O preço é a perda de interpretabilidade: as regras do sistema fuzzy são legíveis por qualquer pessoa, enquanto os 17 pesos da rede só foram interpretados na Seção 3.3.5 com esforço, e em redes maiores essa leitura se torna impraticável.')]),
  P([R('Em que situações as redes neurais são mais adequadas que outros métodos de classificação? ', { bold: true }), R('Quando a relação entre entradas e saídas é não linear e desconhecida, quando há dados rotulados em quantidade suficiente para aprendê-la e quando o custo de uma decisão não exigir justificativa caso a caso, como em reconhecimento de imagens, voz e texto. Sistemas de regras, fuzzy ou especialistas, continuam mais adequados quando o conhecimento já está explícito, quando os dados são escassos e quando a decisão precisa ser auditável, como em avaliações com critérios definidos por política, caso do próprio exemplo de qualidade de atendimento do roteiro. A escolha é de engenharia, não de moda: a rede foi necessária para XOR porque nenhuma reta o resolve; o sistema fuzzy foi suficiente para o atendimento porque as regras eram conhecidas.')]),
];

// ------------------------------- 5 CONCLUSÃO ---------------------------------
const conclusao = [
  H1('5 CONCLUSÃO'),
  P('Os três objetivos do roteiro foram atingidos. Os fundamentos das redes neurais artificiais foram compreendidos na prática, por meio de uma implementação sem frameworks em que cada etapa do ciclo de aprendizado ficou visível no código e na saída; uma rede neural [2, 4, 1] foi implementada e resolveu a função XOR com 100% de acurácia nas quatro entradas e 99,5% em 200 amostras ruidosas; e o processo de treinamento foi visualizado pela curva de erro, pela curva de acurácia, pela superfície de decisão e pelo mapa de calor dos pesos. Todos os itens do checklist do roteiro foram cumpridos, com a ressalva de que o gráfico de erro, a superfície de decisão, o teste sintético e a acurácia exigidos não poderiam ter sido produzidos com o código fornecido no roteiro.'),
  P('A prática ensinou, em primeiro lugar, que a camada oculta não é um refinamento opcional, mas a condição de existência da solução: o mesmo algoritmo que resolve AND e OR com um neurônio converge, em XOR, para a não resposta 0,5. Ensinou também que os pesos aprendidos têm estrutura legível quando a rede é pequena, pois foi possível identificar na camada oculta detectores equivalentes a sub-funções lógicas e explicar, neurônio a neurônio, como a saída é composta; e que os bias são o que permite à rede tratar a entrada nula, demonstração que a álgebra deixa explícita. O comportamento do treinamento em dois tempos, com um patamar inicial seguido de queda abrupta e cauda longa, mostrou na prática como o formato da sigmoid governa a velocidade do aprendizado.'),
  P('O erro do roteiro, documentado como Ocorrência 1, foi o aprendizado mais inesperado. Um enunciado que avalia uma coisa e fornece código de outra é um requisito contraditório, e a decisão de executar o que foi fornecido e implementar o que foi pedido só foi possível porque a contradição foi detectada antes da execução. Em relação aos resultados de aprendizagem previstos no roteiro, a prática cobriu conceitos fundamentais, implementação completa com backpropagation, resolução de problema não linearmente separável, compreensão do processo de aprendizado, aplicabilidade comparada com sistemas de regras e interpretação de superfícies de decisão e pesos, com a vantagem adicional de ter colocado lado a lado, no mesmo experimento, um sistema de regras fuzzy e uma rede neural, exatamente o contraste entre a inteligência artificial simbólica e a conexionista que estrutura a disciplina.'),
];

// ------------------------------- REFERÊNCIAS ---------------------------------
const ref = (t) => new Paragraph({ alignment: AlignmentType.LEFT, spacing: { line: 240, after: 200 }, children: [new TextRun({ text: t, size: 24, font: 'Arial' })] });
const referencias = [
  new Paragraph({ children: [new PageBreak()] }),
  H1('REFERÊNCIAS'),
  ref('CENTRO UNIVERSITÁRIO ANHANGUERA PITÁGORAS UNOPAR. Roteiro de aula prática: Fundamentos da Inteligência Artificial. Unidade 3: Introdução ao Deep Learning. Aula 2: Redes Neurais Artificiais. [S. l.: s. n.], [2026]. Material didático da disciplina, distribuído no AVA.'),
  ref(`CHITTONI, Roni. eng-soft-praticas: aulas práticas de Engenharia de Software. [S. l.]: GitHub, ${CONFIG.ano}. Disponível em: ${REPO_URL}. Acesso em: ${dataAcesso}.`),
  ref(`GOOGLE. Colaboratory. Disponível em: https://colab.google/. Acesso em: ${dataAcesso}.`),
  ref('HARRIS, Charles R. et al. Array programming with NumPy. Nature, London, v. 585, p. 357-362, 2020. DOI: https://doi.org/10.1038/s41586-020-2649-2.'),
  ref('HAYKIN, Simon. Redes neurais: princípios e prática. Tradução: Paulo Martins Engel. 2. ed. Porto Alegre: Bookman, 2001.'),
  ref('HUNTER, John D. Matplotlib: a 2D graphics environment. Computing in Science & Engineering, [s. l.], v. 9, n. 3, p. 90-95, 2007. DOI: https://doi.org/10.1109/MCSE.2007.55.'),
  ref('MINSKY, Marvin; PAPERT, Seymour. Perceptrons: an introduction to computational geometry. Cambridge: MIT Press, 1969.'),
  ref(`MICROSOFT. Visual Studio Code: Jupyter Notebooks in VS Code. Disponível em: https://code.visualstudio.com/docs/datascience/jupyter-notebooks. Acesso em: ${dataAcesso}.`),
  ref(`PYTHON SOFTWARE FOUNDATION. Python ${pyMinor} documentation. Disponível em: https://docs.python.org/${pyMinor}/. Acesso em: ${dataAcesso}.`),
  ref('RUMELHART, David E.; HINTON, Geoffrey E.; WILLIAMS, Ronald J. Learning representations by back-propagating errors. Nature, London, v. 323, p. 533-536, 1986. DOI: https://doi.org/10.1038/323533a0.'),
  ref('RUSSELL, Stuart J.; NORVIG, Peter. Inteligência artificial: uma abordagem moderna. 4. ed. Rio de Janeiro: LTC, 2022. E-book. ISBN 978-85-951-5949-5.'),
  ref('ZADEH, Lotfi A. Fuzzy sets. Information and Control, [s. l.], v. 8, n. 3, p. 338-353, 1965. DOI: https://doi.org/10.1016/S0019-9958(65)90241-X.'),
];

// ------------------------------ DOCUMENTO ------------------------------------
const doc = new Document({
  styles: { default: {
    document: { run: { font: 'Arial', size: 24 } },
    heading1: { run: { font: 'Arial', size: 28, bold: true, color: '000000' } },
    heading2: { run: { font: 'Arial', size: 24, bold: true, color: '000000' } },
    heading3: { run: { font: 'Arial', size: 24, bold: true, italics: true, color: '000000' } },
  } },
  sections: [{
    properties: { page: { margin: { top: 1701, right: 1134, bottom: 1134, left: 1701 } } },
    children: [...capa, ...folhaRosto, ...intro, ...metodos, ...resultados, ...questoes, ...conclusao, ...referencias],
  }],
});

Packer.toBuffer(doc).then((buf) => { fs.mkdirSync(path.dirname(CONFIG.saida), { recursive: true }); fs.writeFileSync(CONFIG.saida, buf); console.log('OK:', CONFIG.saida); });
