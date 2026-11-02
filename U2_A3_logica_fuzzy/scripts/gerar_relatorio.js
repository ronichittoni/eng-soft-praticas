// Relatório de Aula Prática: Fundamentos da IA, U2 A3, Soluções em IA (sistema fuzzy)
// Gerado pelo pipeline local (VS Code no Windows). Uso: node scripts/gerar_relatorio.js
// O TEXTO do relatório fica em relatorio.md (pasta da aula). Este arquivo cuida da formatação.
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
const PASTA = 'U2_A3_logica_fuzzy';
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
  unidade: 'U2 – Métodos e Aplicações de Inteligência Artificial',
  aula: 'A3 – Soluções em Inteligência Artificial',
  experimento: 'Sistema de Avaliação de Qualidade de Atendimento (lógica nebulosa)',
  dataRealizacao: dataExtenso,
  ambienteResumo: `Notebook pessoal do autor com ${soNome} · ${vscode} com extensão Jupyter · Python ${pyVer} · NumPy ${AMB.NumPy || ''} · Matplotlib ${AMB.Matplotlib || ''}`,
  cidade: 'RIBEIRÃO PRETO – SP',
  ano: String(hoje.getFullYear()),
  saida: path.join(RAIZ, 'saida', 'Relatorio_Aula_Pratica_Logica_Fuzzy_U2A3_Roni_Chittoni.docx'),
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
  f1: { ...dim('A6_fig1.png', 600), cap: 'Figura 1 – Saída gráfica da Célula 6: funções de pertinência de Tempo de Espera e Cordialidade e superfície de qualidade' },
  f2: { ...dim('B2_fig1.png', 600), cap: 'Figura 2 – Superfície de qualidade com as pertinências do roteiro (esquerda) e com pertinências sem sobreposição (direita), célula B2' },
  f3: { ...dim('B3_fig1.png', 560), cap: 'Figura 3 – Qualidade em função do tempo de espera com cordialidade 8: sistema fuzzy versus limite fixo em 20 minutos (célula B3)' },
  f4: { ...dim('B4_fig1.png', 600), cap: 'Figura 4 – Pertinências de Tempo de Espera do roteiro (esquerda) e para clientes menos tolerantes (direita), célula B4' },
  f5: { ...dim('B5_fig1.png', 600), cap: 'Figura 5 – Superfície de qualidade com as cinco regras do roteiro (esquerda) e com a regra 6 proposta (direita), célula B5' },
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
    children: [new TextRun({ text: `Relatório de aula prática apresentado ao componente curricular ${CONFIG.componente}, do curso de ${CONFIG.cursoLinha}, como requisito parcial de avaliação da Unidade 2, Aula A3.`, size: 22, font: 'Arial' })] }),
  new Paragraph({ children: [new PageBreak()] }),
];

// ------------------------------ TABELAS E QUADROS ---------------------------
// Dados estruturados; no texto entram pelos marcadores [[...]] de relatorio.md.
const passos = [
  ['1', 'Registro do ambiente de execução: versões de Python, NumPy, Matplotlib e sistema operacional (célula A0).', 'Quadro 1; Seção 3.1'],
  ['2', 'Célula 1 do roteiro: importação de NumPy e Matplotlib e configuração dos gráficos.', 'Seção 3.1'],
  ['3', 'Célula 2 do roteiro: funções de pertinência rápido, médio e lento para Tempo de Espera.', 'Quadro 2; Seção 3.1'],
  ['4', 'Célula 3 do roteiro: funções de pertinência baixa, média e alta para Cordialidade.', 'Quadro 2; Seção 3.1'],
  ['5', 'Célula 4 do roteiro: cinco regras de inferência com operador MIN para E, MAX para agregação e defuzzificação por média ponderada.', 'Seção 3.1'],
  ['6', 'Célula 5 do roteiro: teste do sistema com quatro casos de atendimento.', 'Transcrição na Seção 3.1'],
  ['7', 'Célula 6 do roteiro: gráficos das funções de pertinência e superfície de qualidade.', 'Figura 1'],
  ['8', 'Célula B1: graus de pertinência em pontos-chave, soma dos graus (cobertura das partições) e varredura do Caso 1 entre 8 e 20 minutos.', 'Transcrição na Seção 3.2.1'],
  ['9', 'Célula B2: versão das pertinências sem sobreposição e comparação das superfícies de qualidade.', 'Figura 2'],
  ['10', 'Célula B3: classificador binário com limite fixo em 20 minutos comparado ao sistema fuzzy.', 'Figura 3'],
  ['11', 'Célula B4: pertinências de Tempo de Espera para clientes menos tolerantes e reavaliação dos quatro casos.', 'Figura 4'],
  ['12', 'Célula B5: regra 6 proposta (tempo lento E cordialidade alta → regular) e superfície comparada.', 'Figura 5'],
];

const quadro2 = [
  caption('Quadro 2 – Parâmetros das funções de pertinência implementadas nas Células 2 e 3 (conforme o código)'),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [1900, 1500, 1900, 2171, 1600],
    rows: [
      cab([['Variável', 1900], ['Termo', 1500], ['Formato', 1900], ['Grau 1,0 (núcleo)', 2171], ['Transição', 1600]]),
      ...[
        ['Tempo de espera', 'rápido', 'trapezoidal', '0 a 10 min', '10 a 20 min'],
        ['Tempo de espera', 'médio', 'triangular', 'pico em 20 min', '10 a 20 e 20 a 30 min'],
        ['Tempo de espera', 'lento', 'trapezoidal', '35 a 60 min', '25 a 35 min'],
        ['Cordialidade', 'baixa', 'trapezoidal', '0 a 3', '3 a 5'],
        ['Cordialidade', 'média', 'triangular', 'pico em 5', '3 a 5 e 5 a 7'],
        ['Cordialidade', 'alta', 'trapezoidal', '8 a 10', '6 a 8'],
      ].map((r) => new TableRow({ cantSplit: true, children: r.map((t, i) => cell(t, [1900, 1500, 1900, 2171, 1600][i], { align: i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER })) })),
    ],
  }),
  fonte(`Fonte: elaborado pelo autor (${CONFIG.ano}).`),
];

const BLOCOS = {
  'quadro ambiente': () => [
  caption('Quadro 1 – Ambiente de execução do experimento'),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2700, 6371],
    rows: [
      linha2k('Equipamento', `Notebook pessoal do autor${equip ? ` (${equip})` : ''}`),
      linha2k('Sistema operacional', soNome),
      linha2k('IDE', `${vscode}, extensões Python e Jupyter da Microsoft`),
      linha2k('Linguagem', `Python ${pyVer}, em ambiente virtual dedicado (.venv)`),
      linha2k('Bibliotecas', `NumPy ${AMB.NumPy || ''} (grades de avaliação); Matplotlib ${AMB.Matplotlib || ''} (gráficos, backend inline do Jupyter)`),
      linha2k('Notebook', 'U2_A3_Avaliacao_Qualidade_Atendimento.ipynb (nome do roteiro: Avaliação de Qualidade de Atendimento), 12 células de código, executadas em sequência no mesmo kernel'),
      linha2k('Registro de evidências', 'Saídas de texto e figuras PNG extraídas do próprio .ipynb executado, sem recaptura de tela'),
      linha2k('Repositório', repoLinha),
      linha2('Solução digital', `Visual Studio Code no notebook pessoal do autor (${soNome}) e repositório público no GitHub; o roteiro indicava o Google Colab (https://colab.google/)`),
    ],
  }),
  fonte(`Fonte: elaborado pelo autor (${CONFIG.ano}).`),
  ],
  'tabela passos': () => [
  caption('Tabela 1 – Passo a passo da atividade e evidências correspondentes'),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [900, 6371, 1800],
    rows: [
      cab([['Passo', 900], ['Descrição do passo realizado', 6371], ['Evidência', 1800]]),
      ...passos.map(([n, d, e]) => new TableRow({ cantSplit: true, children: [cell(n, 900, { align: AlignmentType.CENTER }), cell(d, 6371), cell(e, 1800, { align: AlignmentType.CENTER })] })),
    ],
  }),
  fonte(`Fonte: elaborado pelo autor (${CONFIG.ano}), com base nos procedimentos do roteiro da aula prática.`),
  ],
  'quadro parametros': () => [
  ...quadro2,
  ],
};

// ------------------------------ TEXTO (relatorio.md) -------------------------
// O texto do relatório fica em relatorio.md (pasta da aula). Este bloco o converte
// em parágrafos ABNT, substitui lacunas {chave} e marcadores [[...]] e valida tudo.
const TEXTO_MD = path.join(RAIZ, 'relatorio.md');
const VALORES = {
  ano: CONFIG.ano, data_acesso: dataAcesso, pasta: PASTA, repositorio: REPO_URL, sistema: soNome,
  python: pyVer, python_curto: pyMinor, vscode, equipamento: equip || 'notebook pessoal do autor',
};
const quebra = () => new Paragraph({ children: [new PageBreak()] });
const refP = (runs) => new Paragraph({ alignment: AlignmentType.LEFT, spacing: { line: 240, after: 200 }, children: runs });

function lerTexto() {
  const erros = [], avisos = [];
  const bruto = fs.readFileSync(TEXTO_MD, 'utf8').replace(/\r\n/g, '\n').replace(/^﻿/, '');
  // remove comentários <!-- ... --> preservando a contagem de linhas
  const texto = bruto.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ''));
  const linhas = texto.split('\n');

  // agrupa em blocos separados por linha em branco, guardando a linha inicial
  const blocos = [];
  let atual = null;
  linhas.forEach((l, i) => {
    if (l.trim() === '') { atual = null; return; }
    if (!atual) { atual = { linha: i + 1, partes: [] }; blocos.push(atual); }
    atual.partes.push(l.trim());
  });

  const lacunas = (t, ln) => t.replace(/\{([a-z_]+)\}/g, (m, k) => {
    if (!(k in VALORES)) { erros.push(`linha ${ln}: lacuna desconhecida ${m}`); return m; }
    return String(VALORES[k] ?? '');
  });

  // **negrito**, *itálico*, \* = asterisco literal
  const runs = (t, ln) => {
    const out = []; let buf = '', b = false, it = false;
    const flush = () => { if (buf) out.push(R(buf, { bold: b, italics: it })); buf = ''; };
    for (let i = 0; i < t.length; i++) {
      if (t[i] === '\\' && t[i + 1] === '*') { buf += '*'; i++; continue; }
      if (t[i] === '*' && t[i + 1] === '*') { flush(); b = !b; i++; continue; }
      if (t[i] === '*') { flush(); it = !it; continue; }
      buf += t[i];
    }
    flush();
    if (b || it) erros.push(`linha ${ln}: negrito ou itálico aberto e não fechado (** ou *)`);
    return out;
  };

  const usadas = {};
  const saida = [];
  let emReferencias = false;
  blocos.forEach((bl, idx) => {
    const ln = bl.linha;
    const t = lacunas(bl.partes.join(' '), ln);
    const h = t.match(/^(#{1,3})\s+(.*)$/);
    const d = t.match(/^\[\[\s*([a-z]+)(?:\s+([A-Za-z0-9 ]+?))?\s*\]\]$/);
    if (h && bl.partes.length === 1) {
      const nivel = h[1].length;
      saida.push((nivel === 1 ? H1 : nivel === 2 ? H2 : H3)(h[2]));
      emReferencias = nivel === 1 && /^REFER[ÊE]NCIAS$/i.test(h[2].trim());
      return;
    }
    if (d) {
      const [, tipo, arg] = d;
      if (tipo === 'figura') {
        if (!FIG[arg]) { erros.push(`linha ${ln}: figura inexistente "${arg}" (existentes: ${Object.keys(FIG).join(', ')})`); return; }
        usadas[arg] = (usadas[arg] || 0) + 1;
        saida.push(...figBlock(arg));
      } else if (tipo === 'codigo') {
        if (!CT.codigo[arg]) { erros.push(`linha ${ln}: célula inexistente "${arg}"`); return; }
        saida.push(...cod(arg));
      } else if (tipo === 'saida') {
        if (!CT.saidas[arg]) { erros.push(`linha ${ln}: célula inexistente "${arg}"`); return; }
        saida.push(...sai(arg));
      } else if (tipo === 'quebra') {
        saida.push(quebra());
      } else {
        const chave = `${tipo} ${arg || ''}`.trim();
        if (!BLOCOS[chave]) { erros.push(`linha ${ln}: marcador desconhecido [[${chave}]] (existentes: ${Object.keys(BLOCOS).join(', ')})`); return; }
        usadas[chave] = (usadas[chave] || 0) + 1;
        saida.push(...BLOCOS[chave]());
      }
      return;
    }
    if (/^\[\[|\]\]$/.test(t)) { erros.push(`linha ${ln}: marcador malformado "${t.slice(0, 60)}"`); return; }
    if (/^#/.test(t)) { erros.push(`linha ${ln}: título deve ocupar uma única linha`); return; }
    const r = runs(t, ln);
    if (emReferencias) { saida.push(refP(r)); return; }
    // parágrafo que termina em ":" e precede código ou saída fica na mesma página que eles
    const prox = blocos[idx + 1] ? blocos[idx + 1].partes.join(' ') : '';
    const junto = t.trim().endsWith(':') && /^\[\[\s*(codigo|saida)\b/.test(prox);
    saida.push(P(r, { keepNext: junto }));
  });

  Object.keys(FIG).forEach((k) => { if (!usadas[k]) avisos.push(`figura "${k}" não aparece no texto`); });
  Object.keys(BLOCOS).forEach((k) => { if (!usadas[k]) avisos.push(`[[${k}]] não aparece no texto`); });
  Object.entries(usadas).forEach(([k, n]) => { if (n > 1) avisos.push(`"${k}" aparece ${n} vezes`); });
  avisos.forEach((a) => console.warn('AVISO relatorio.md:', a));
  if (erros.length) {
    console.error('ERRO em relatorio.md:');
    erros.forEach((e) => console.error('  ' + e));
    process.exit(1);
  }
  return saida;
}

// ------------------------------ DOCUMENTO ------------------------------------
const corpo = lerTexto();
const doc = new Document({
  styles: { default: {
    document: { run: { font: 'Arial', size: 24 } },
    heading1: { run: { font: 'Arial', size: 28, bold: true, color: '000000' } },
    heading2: { run: { font: 'Arial', size: 24, bold: true, color: '000000' } },
    heading3: { run: { font: 'Arial', size: 24, bold: true, italics: true, color: '000000' } },
  } },
  sections: [{
    properties: { page: { margin: { top: 1701, right: 1134, bottom: 1134, left: 1701 } } },
    children: [...capa, ...folhaRosto, ...corpo],
  }],
});

Packer.toBuffer(doc).then((buf) => { fs.mkdirSync(path.dirname(CONFIG.saida), { recursive: true }); fs.writeFileSync(CONFIG.saida, buf); console.log('OK:', CONFIG.saida); });
