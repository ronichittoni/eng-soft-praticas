<!--
TEXTO DO RELATÓRIO. Edite à vontade; a formatação ABNT é aplicada pelo gerador.
Depois de editar: tarefa "3. Só evidências + relatório" no VS Code (ou executar.ps1 -PularExecucao).

  # Título / ## Subtítulo / ### Sub-subtítulo   (uma linha cada)
  Parágrafo: texto corrido; uma linha em branco separa parágrafos.
  **negrito**   *itálico*   \*  = asterisco literal
  [[figura f1]]  [[codigo B3]]  [[saida B3]]  [[quebra]]  e os quadros/tabelas, ex.: [[quadro ambiente]]
  Lacunas preenchidas na geração: {ano} {data_acesso} {sistema} {pasta} {repositorio} {python} {python_curto} {vscode} {equipamento}

Se algo ficar errado (marcador ou lacuna inexistente, negrito não fechado), o gerador
para e informa a linha. Números citados no texto devem continuar iguais aos da execução.
-->

# 1 INTRODUÇÃO

A lógica nebulosa, ou lógica fuzzy, proposta por Zadeh (1965), substitui a pertinência binária dos conjuntos clássicos por graus de pertinência contínuos no intervalo [0, 1]. Um tempo de espera de 15 minutos não precisa ser classificado como rápido ou como médio: pode ser 0,5 rápido e 0,5 médio ao mesmo tempo. Essa representação aproxima o raciocínio computacional da forma como pessoas descrevem o mundo, em termos linguísticos imprecisos, e permite codificar conhecimento de especialistas em regras do tipo SE-ENTÃO que operam sobre esses graus (RUSSELL; NORVIG, 2022). Trata-se de uma solução da vertente simbólica da inteligência artificial: as regras são explícitas, legíveis e auditáveis.

O problema tratado nesta prática é a avaliação da qualidade de um atendimento a partir de duas medidas, o tempo de espera, de 0 a 60 minutos, e a cordialidade do atendente, de 0 a 10. A técnica empregada é um sistema de inferência fuzzy no estilo de Mamdani e Assilian (1975): fuzzificação das entradas por funções de pertinência triangulares e trapezoidais, avaliação de cinco regras com o operador MIN para o conectivo E e MAX para a agregação, e defuzzificação por média ponderada de valores representativos, forma simplificada que corresponde a um sistema de Takagi e Sugeno (1985) de ordem zero. A implementação é feita em Python puro, com NumPy para a grade de avaliação e Matplotlib para os gráficos.

Conforme o roteiro da aula, os objetivos são introduzir conceitos básicos de lógica nebulosa por exemplos práticos, implementar um sistema simples de decisão e comparar soluções tradicionais com soluções baseadas em lógica nebulosa, no experimento denominado "Sistema de Avaliação de Qualidade de Atendimento". Este relatório registra a execução integral do código do roteiro, acrescenta cinco análises que as questões do enunciado pedem e o código original não produz (cobertura das partições, sobreposição zero, limite fixo versus fuzzy, pertinências para clientes menos tolerantes e uma nova regra) e documenta duas ocorrências: uma inconsistência entre os comentários e o código das funções de pertinência e uma questão do roteiro cuja premissa a execução contradiz.

# 2 MATERIAIS E MÉTODOS

## 2.1 Ambiente de execução

[[quadro ambiente]]

O roteiro indica o Google Colab como solução digital. A execução registrada neste relatório ocorreu no notebook pessoal do autor, com {sistema}, no Visual Studio Code, com a extensão Jupyter, sobre um ambiente virtual Python local com as mesmas bibliotecas que o Colab disponibiliza, o que foi adotado como decisão metodológica por três razões: o arquivo .ipynb é o mesmo formato que o Colab abre, sem conversão; o código do roteiro é determinístico, sem qualquer componente aleatório, de modo que a saída é idêntica em qualquer ambiente com NumPy e Matplotlib; e as transcrições e figuras deste relatório foram extraídas diretamente das saídas gravadas no notebook executado, o que lhes dá fidelidade integral. O notebook, os scripts de execução e o gerador deste relatório estão versionados em repositório público no GitHub, na pasta {pasta} de {repositorio}, acessível sem login, o que permite reproduzir a execução e conferir cada evidência.

## 2.2 Estratégia

A prática foi conduzida em duas partes. Na Parte A, as seis células do roteiro foram reproduzidas exatamente como entregues e executadas, precedidas apenas de uma célula de registro do ambiente. Na Parte B, foram acrescentadas cinco células de análise, porque várias questões do enunciado pedem resultados que o código fornecido não produz: o que acontece com sobreposição zero entre pertinências adjacentes (Questão 1), como um sistema binário trataria 20 minutos de espera (Questão 6), como modificar as pertinências para clientes menos tolerantes e qual nova regra melhoraria o sistema (Questão 7). Em vez de responder a essas perguntas apenas em tese, cada uma foi transformada em experimento, com tabela e figura próprias.

Para isso, a função de inferência do roteiro foi reescrita na célula B2 em forma genérica (avaliar_generico), que recebe as seis funções de pertinência como parâmetros e aceita a regra 6 opcional, preservando as cinco regras e a defuzzificação originais. A equivalência entre a função genérica e a do roteiro foi verificada nos quatro casos de teste (Seção 3.2.5): com as pertinências originais e sem a regra extra, as duas produzem exatamente os mesmos valores.

## 2.3 Passo a passo da atividade

[[tabela passos]]

Os passos 2 a 7 correspondem às seis células numeradas do roteiro; os passos 8 a 12, às células B1 a B5 da Parte B. O código de cada célula da Parte B é apresentado na Seção 3.2, imediatamente antes da saída que produziu.

# 3 RESULTADOS E DISCUSSÃO

## 3.1 Parte A: execução do código do roteiro

A célula A0, acrescentada antes da Célula 1 do roteiro, registra o ambiente:

[[codigo A0]]

[[saida A0]]

A Célula 2 define as três funções de pertinência do tempo de espera. Cada uma é linear por partes: vale 1,0 no núcleo do termo, decai (ou sobe) linearmente na zona de transição e vale 0,0 fora dela.

[[codigo A2]]

A Célula 3 define, com a mesma estrutura, as três funções de cordialidade. O Quadro 2 resume os parâmetros efetivamente implementados nas duas células, lidos do código e não dos comentários, pelo motivo registrado na Ocorrência 1 (Seção 3.3.1).

[[quadro parametros]]

Os termos extremos (rápido, lento, baixa, alta) são trapezoidais, pois saturam em 1,0 nos limites do universo de discurso; os termos centrais (médio, média) são triangulares, com um único ponto de pertinência plena. As transições de termos adjacentes se sobrepõem (10 a 20 min entre rápido e médio; 3 a 5 entre baixa e média; 6 a 7 entre média e alta), e é essa sobreposição que produz a graduação do sistema, como a Seção 3.2.2 demonstra ao removê-la.

A Célula 4 concentra a inferência: calcula os seis graus de pertinência, avalia as cinco regras com MIN para o conectivo E, agrega as regras de mesma conclusão com MAX e defuzzifica por média ponderada dos valores representativos 9, 7, 5 e 2.

[[codigo A4]]

A Célula 5 executa quatro casos de teste. Transcrição integral da saída:

[[saida A5]]

Os quatro casos cobrem o comportamento essencial do sistema. No Caso 1 (8 min, cordialidade 9) apenas a regra 1 dispara, com força 1,0, porque 8 min está no núcleo de rápido e 9 está no núcleo de alta; a qualidade final é o próprio valor representativo de excelente, 9,0. No Caso 2 (15 min, cordialidade 6) o tempo é 0,5 rápido e 0,5 médio, e a cordialidade é 0,5 média e 0,0 alta; disparam a regra 2 (rápido E média) e a regra 4 (médio E média), ambas com força 0,5, e a defuzzificação dá (0,5 × 7 + 0,5 × 5) / 1,0 = 6,0. No Caso 3 (35 min, cordialidade 3), lento e baixa valem 1,0; apenas a regra 5 dispara e a saída é 2,0. No Caso 4 (12 min, cordialidade 8), o tempo é 0,8 rápido e 0,2 médio e a cordialidade é 1,0 alta; disparam a regra 1 com força 0,8 e a regra 3 com 0,2, e a saída é (0,8 × 9 + 0,2 × 7) / 1,0 = 8,6. O denominador max(soma, 0,001) protege a divisão quando nenhuma regra dispara.

A Célula 6 produz os três gráficos da Figura 1: as pertinências do tempo, as da cordialidade e a superfície de qualidade, avaliada em uma grade de 30 × 30 pontos. Na superfície, o canto superior esquerdo (tempo curto, cordialidade alta) é verde escuro, valor 9; a faixa à direita de 30 minutos e a faixa abaixo de cordialidade 3 são vermelhas, valor 2; entre elas, degraus suavizados correspondem às zonas de transição das pertinências.

[[figura f1]]

## 3.2 Parte B: análises adicionais

### 3.2.1 Cobertura das partições e varredura do Caso 1

A célula B1 tabula os graus de pertinência em pontos-chave, soma os graus de cada variável e varre o tempo do Caso 1 de 8 a 20 minutos mantendo a cordialidade em 9:

[[codigo B1]]

[[saida B1]]

A soma dos graus revela que as partições do roteiro não formam uma partição da unidade: entre 20 e 35 minutos a soma cai a 0,5 (em 25 min só médio está ativo, com 0,5; em 30 min só lento, com 0,5), e entre 6 e 7 de cordialidade também (média 0,5 e alta 0,0 em 6; média 0,0 e alta 0,5 em 7). Nessas zonas, poucas regras disparam e com força reduzida; como a defuzzificação normaliza pela soma das forças, a saída continua definida, mas tende ao valor representativo da única regra ativa, o que gera os patamares que a Figura 1 mostra. Entre 25 e 30 minutos, por exemplo, a qualidade com cordialidade 8 vai de 7,0 a 2,0 em cinco minutos, porque o sistema troca a regra 3 pela regra 5 sem nenhum termo intermediário.

A varredura do Caso 1 mostra que o grau de excelente permanece em 1,00 até 10 minutos e só cai abaixo disso a partir de 11 minutos (0,90), chegando a 0,00 em 20 minutos; a qualidade final acompanha, de 9,0 a 7,0. Esse resultado é a base da resposta à Questão 4 e da Ocorrência 2 (Seção 3.3.2).

### 3.2.2 Sobreposição zero entre pertinências adjacentes

A célula B2 define versões das seis funções com limites rígidos (sem sobreposição), reescreve a inferência em forma genérica e compara as duas superfícies:

[[codigo B2]]

[[saida B2]]

[[figura f2]]

Com sobreposição zero, cada par (tempo, cordialidade) ativa exatamente uma regra, com força 1,0, e a saída só pode assumir os quatro valores 9, 7, 5 e 2. A tabela mostra a consequência: com cordialidade 8, a qualidade é 9,0 em 15,0 min e 7,0 em 15,1 min, um salto de dois pontos por seis segundos de espera; e permanece em 7,0 de 15,1 a 30,0 min, quando salta a 2,0. O sistema do roteiro, no mesmo intervalo, desce de 9,0 (10 min) a 7,0 (20 min) em degraus de 0,2 por minuto. A Figura 2 torna a diferença visual: à direita, a superfície é um mosaico de blocos uniformes, indistinguível de uma tabela de decisão clássica; à esquerda, as bordas dos blocos são rampas. A sobreposição é, portanto, o que faz o sistema ser fuzzy; sem ela, resta um sistema de regras com limites fixos.

A figura também expõe uma limitação do próprio roteiro: a superfície da esquerda é menos suave do que o conceito sugere, porque a sobreposição só existe onde as rampas de dois termos se cruzam (10 a 20 min, 3 a 5 e 6 a 7 de cordialidade). Onde a cobertura cai a 0,5 (Seção 3.2.1), a transição volta a ser quase um degrau.

### 3.2.3 Limite fixo versus fuzzy em torno de 20 minutos

A célula B3 implementa um classificador binário com limites fixos (bom se tempo ≤ 20 min e cordialidade ≥ 6; ruim caso contrário) e o compara ao sistema fuzzy:

[[codigo B3]]

[[saida B3]]

[[figura f3]]

O classificador binário muda de "bom" para "ruim" entre 20,0 e 20,1 minutos, e entre cordialidade 6,0 e 5,9, sem que nada de relevante tenha mudado no atendimento. O sistema fuzzy atribui 7,0 a 19,9, 20,0 e 20,1 minutos (todos essencialmente no núcleo de médio, com cordialidade alta), e 5,0 a cordialidade 5,9 e 6,0 (ambas no termo média). A Figura 3 compara as duas funções ao longo de todo o eixo de tempo, com cordialidade 8: o binário é um degrau único em 20 minutos; o fuzzy desce em rampa de 10 a 20 minutos, mantém 7,0 até 25 e desce a 2,0 em 30. Vale notar que o fuzzy do roteiro também tem um trecho íngreme, entre 25 e 30 minutos, pela razão já discutida: ali não há termo intermediário entre médio e lento. Um sistema fuzzy não elimina transições; distribui-as por onde o projetista colocou sobreposição.

### 3.2.4 Pertinências para clientes menos tolerantes

A célula B4 redefine as pertinências do tempo de espera para um público que tolera menos espera (rápido só até 5 min, lento a partir de 15 min) e reavalia os quatro casos do roteiro:

[[codigo B4]]

[[saida B4]]

[[figura f4]]

A mudança desloca as três funções para a esquerda (Figura 4): o núcleo de rápido encolhe de 10 para 5 minutos, o pico de médio vai de 20 para 10 minutos e lento satura em 25 em vez de 35 minutos. O efeito sobre os casos é imediato: o Caso 1 (8 min) deixa de ser plenamente rápido (0,4 rápido, 0,6 médio) e cai de 9,0 para 7,8; o Caso 4 (12 min) passa a ser 0,8 médio e cai de 8,6 para 7,0; o Caso 2 cai de 6,0 para 5,0; o Caso 3 continua em 2,0, porque 35 minutos é lento em qualquer das duas versões. As regras não foram tocadas: a calibração do sistema a um público mais exigente foi feita apenas nas funções de pertinência, que é o lugar onde esse conhecimento pertence.

### 3.2.5 Nova regra: tempo lento E cordialidade alta → regular

A célula B5 acrescenta a regra 6, que reclassifica como regular (e não ruim) o atendimento lento mas cordial, e compara as duas bases de regras:

[[codigo B5]]

[[saida B5]]

[[figura f5]]

Nas cinco regras do roteiro, qualquer atendimento lento recebe 2,0, seja a cordialidade 2 ou 9: a regra 5 agrupa lento E baixa, lento E média e lento E alta sob a mesma conclusão. Isso descarta a informação de cordialidade em toda a faixa acima de 30 minutos, o que aparece na Figura 1 como uma faixa vermelha uniforme à direita. Com a regra 6, (40 min, cordialidade 9) sobe de 2,0 para 5,0 e (28 min, 9) de 4,0 para 5,8, enquanto (40, 5) e (40, 2) permanecem em 2,0 e os quatro casos do roteiro não se alteram, o que confirma que a função genérica reproduz exatamente a do roteiro quando a regra extra está desligada. Na Figura 5, o canto superior direito passa de vermelho a amarelo: o sistema volta a distinguir, entre os atendimentos lentos, os que ao menos foram cordiais.

## 3.3 Ocorrências

### 3.3.1 Ocorrência 1: comentários das funções de pertinência divergem do código

**Sintoma.** As docstrings de duas funções descrevem intervalos diferentes dos implementados. A de tempo_rapido diz "(0-15 min)", mas o código mantém 1,0 até 10 min e decai até 20 min; a de cordialidade_baixa diz "(0-4)", mas o código mantém 1,0 até 3 e decai até 5. As demais docstrings coincidem com o código.

**Causa-raiz.** Comentários escritos antes de um ajuste dos parâmetros e não atualizados depois, situação comum em código didático que passa por revisões.

**Correção adotada.** O código foi mantido como entregue, por fidelidade ao roteiro, e os parâmetros efetivos foram documentados no Quadro 2 a partir da leitura do código, não dos comentários. Todas as respostas da Seção 4 usam os valores do Quadro 2.

**Lição.** Comentários descrevem intenções; código descreve comportamento. Quando divergem, o comportamento observado é a referência, e a divergência deve ser registrada, não silenciosamente corrigida em um dos lados.

### 3.3.2 Ocorrência 2: a Questão 4 pressupõe um resultado que a execução contradiz

**Sintoma.** A Questão 4 do roteiro pergunta: "No Caso 1 (8 min, cordialidade 9), por que o grau de pertinência excelente não foi 1.0?". Na execução, o grau de excelente do Caso 1 foi exatamente 1,00 (transcrição da Célula 5), e a qualidade final foi 9,00.

**Causa-raiz.** Com os parâmetros do Quadro 2, 8 minutos está no núcleo de rápido (até 10 min) e cordialidade 9 está no núcleo de alta (a partir de 8), de modo que min(1,0; 1,0) = 1,0. A pergunta só faria sentido com um núcleo de rápido terminando antes de 8 minutos ou um núcleo de alta começando depois de 9, o que sugere que ela foi escrita para uma versão anterior das funções de pertinência, a mesma hipótese da Ocorrência 1.

**Correção adotada.** A pergunta é respondida na Seção 4.4 com o resultado observado e com a varredura da célula B1, que mostra a partir de que tempo o grau de excelente deixa de ser 1,0 (11 minutos). Nenhum valor foi ajustado para "fazer a pergunta dar certo".

**Lição.** Uma questão de avaliação também é um requisito, e pode estar errada. A resposta correta a uma pergunta com premissa falsa é demonstrar que a premissa é falsa e responder ao que a pergunta queria saber.

# 4 RESPOSTAS AOS QUESTIONAMENTOS

## 4.1 Questão 1: análise das funções de pertinência

**Quantas funções de pertinência foram definidas para cada variável de entrada?** Três para tempo de espera (rápido, médio e lento) e três para cordialidade (baixa, média e alta), seis no total, com os parâmetros do Quadro 2. Cada variável é, portanto, descrita por três termos linguísticos cujas pertinências se sobrepõem nas zonas de transição.

**Por que foi escolhido o formato triangular/trapezoidal?** Por simplicidade e legibilidade. Cada função é definida por dois a quatro números (início e fim do núcleo, início e fim da transição), é calculada com uma subtração e uma divisão, e tem interpretação direta: núcleo é onde o termo vale plenamente, rampa é onde ele cede ao termo vizinho. Os termos extremos são trapezoidais porque saturam nos limites do universo de discurso (não existe tempo "mais rápido" que 0 min nem cordialidade "mais alta" que 10); os centrais são triangulares porque têm um único ponto típico (20 min, cordialidade 5). Formas gaussianas ou sigmoides dariam transições mais suaves ao custo de parâmetros menos intuitivos e de mais cálculo, sem ganho perceptível para duas variáveis e cinco regras.

**O que aconteceria se houvesse sobreposição zero entre as funções de pertinência adjacentes?** Foi testado na célula B2. Cada entrada ativaria exatamente uma regra com força 1,0, a saída só assumiria os valores 9, 7, 5 e 2, e a superfície de qualidade viraria o mosaico de blocos da Figura 2 (direita). Com cordialidade 8, a qualidade saltaria de 9,0 em 15,0 min para 7,0 em 15,1 min, e de 7,0 em 30,0 para 2,0 em 30,1. O sistema deixaria de ser fuzzy e se tornaria uma tabela de decisão com limites fixos, exatamente o tipo de solução tradicional que a lógica nebulosa pretende substituir. Se, além de não se sobrepor, as funções deixassem lacunas, haveria entradas para as quais nenhuma regra dispara, e a defuzzificação retornaria 0 / 0,001 = 0, uma qualidade inexistente na escala.

## 4.2 Questão 2: sistema de regras fuzzy

**Quantas regras foram implementadas no sistema de inferência?** Cinco, conforme a docstring e o corpo de avaliar_atendimento: rápido E alta → excelente; rápido E média → boa; médio E alta → boa; médio E média → regular; e "caso contrário" → ruim, que no código é a agregação por MAX de cinco combinações (lento com qualquer cordialidade, rápido E baixa, médio E baixa). As cinco regras cobrem as nove combinações de termos, de modo que toda entrada do universo de discurso ativa ao menos uma regra.

**Qual operador lógico foi utilizado para implementar o conectivo "E" nas regras? Por quê?** O mínimo (MIN), como em excelente = min(t_rapido, c_alta). O MIN é a t-norma clássica de Zadeh para a conjunção: a verdade de "A e B" não pode superar a verdade da menos verdadeira das duas condições, e, quando A e B são binárias (0 ou 1), o MIN se reduz exatamente ao E booleano. No Caso 4, por exemplo, rápido valia 0,8 e alta valia 1,0, e a regra 1 disparou com força min(0,8; 1,0) = 0,8: o atendimento só é "excelente" na medida em que é rápido. A alternativa usual, o produto (0,8 × 1,0 = 0,8 aqui, mas 0,25 em vez de 0,5 para dois graus de 0,5), penaliza mais as condições parcialmente satisfeitas; o MIN foi a escolha do roteiro e é a mais comum em sistemas de Mamdani.

**Como o sistema trata casos onde múltiplas regras são ativadas simultaneamente?** Em duas etapas. Regras com a mesma conclusão são agregadas por MAX, o operador do conectivo OU: boa = max(min(rápido, média), min(médio, alta)). Em seguida, as quatro conclusões, cada uma com sua força agregada, entram na defuzzificação por média ponderada, de modo que a saída fica entre os valores representativos das conclusões ativas, proporcionalmente à força de cada uma. O Caso 2 é o exemplo: boa e regular ativas com 0,5 cada produzem (0,5 × 7 + 0,5 × 5) / 1,0 = 6,0, exatamente o meio do caminho; no Caso 4, excelente com 0,8 e boa com 0,2 produzem 8,6, mais perto de 9 do que de 7.

## 4.3 Questão 3: processo de defuzzificação

**Qual método de defuzzificação foi utilizado no código?** Média ponderada de valores representativos: qualidade_final = (excelente × 9 + boa × 7 + regular × 5 + ruim × 2) / soma das forças. É a forma mais simples de centroide, em que cada conclusão é um singleton (um único valor crisp em vez de um conjunto fuzzy de saída), o que caracteriza um sistema de Takagi e Sugeno (1985) de ordem zero. O denominador max(soma, 0,001) evita divisão por zero quando nenhuma regra dispara.

**Por que os valores 9, 7, 5 e 2 foram escolhidos para representar as qualidades?** São os valores crisp que cada classe linguística representa na escala de 0 a 10 que o sistema entrega ao usuário: excelente próximo do máximo, boa acima do meio, regular no meio, ruim próximo do mínimo. Dois detalhes são decisões de projeto. Primeiro, o espaçamento não é uniforme (9, 7, 5 e depois 2): o salto de 3 pontos entre regular e ruim penaliza o atendimento ruim mais do que premia o excelente. Segundo, os extremos 10 e 0 não são usados, de modo que a saída fica sempre entre 2,0 e 9,0; nenhum atendimento recebe nota máxima nem mínima, o que é coerente com um sistema que nunca afirma certeza absoluta.

**O que representa o valor final da qualidade calculada pelo sistema?** Uma nota crisp de qualidade na escala 0 a 10, obtida como centro de massa das classes ativadas, ponderado pelas forças de ativação. É o resultado que um gestor pode comparar entre atendimentos ou agregar em médias, coisa que os graus de pertinência isolados não permitem. No Caso 2, 6,0 significa "exatamente entre boa e regular"; no Caso 4, 8,6 significa "quase excelente, com uma fração de boa".

## 4.4 Questão 4: interpretação dos casos de teste

**No Caso 1 (8 min, cordialidade 9), por que o grau de pertinência "excelente" não foi 1,0?** A premissa da pergunta não se confirma: na execução, o grau de excelente do Caso 1 foi 1,00 e a qualidade final foi 9,00 (transcrição da Célula 5; Ocorrência 2, Seção 3.3.2). Isso ocorre porque 8 min está dentro do núcleo de rápido, que vai até 10 min, e cordialidade 9 está dentro do núcleo de alta, que começa em 8; min(1,0; 1,0) = 1,0. A varredura da célula B1 mostra quando a pergunta passaria a ter sentido: com cordialidade 9, o grau de excelente cai a 0,90 em 11 min, 0,80 em 12 min e 0,00 em 20 min, porque a partir de 10 min o tempo começa a ceder pertinência de rápido para médio, e a regra 1 só dispara com a força que rápido ainda tem.

**Compare os resultados dos Casos 2 e 4. Qual teve melhor avaliação e por quê?** O Caso 4 (12 min, cordialidade 8) obteve 8,6; o Caso 2 (15 min, cordialidade 6), 6,0. O Caso 4 é melhor nos dois critérios: três minutos mais rápido, o que o mantém 0,8 rápido, e dois pontos mais cordial, o que o coloca plenamente em alta. Com isso ele ativa as regras 1 (excelente, 0,8) e 3 (boa, 0,2). O Caso 2 fica na fronteira entre rápido e médio (0,5 cada) e no meio de média (0,5), sem nenhuma pertinência a alta, e ativa apenas boa e regular, ambas com 0,5. A diferença de 2,6 pontos vem sobretudo da cordialidade: se o Caso 2 tivesse cordialidade 8, ativaria excelente e boa e subiria a 8,0.

**Que tipo de atendimento receberia a pior avaliação segundo as regras implementadas?** Qualquer atendimento em que apenas a regra 5 dispare, o que produz a nota mínima 2,0. Isso acontece com tempo lento pleno (35 min ou mais) para qualquer cordialidade, e com cordialidade baixa plena (3 ou menos) para qualquer tempo até 20 min. O Caso 3 (35 min, cordialidade 3) é o exemplo do roteiro, mas (40 min, cordialidade 10) recebe exatamente a mesma nota, como a célula B5 confirma. Essa insensibilidade à cordialidade na faixa lenta é uma limitação da base de regras, tratada na Questão 7.

## 4.5 Questão 5: visualização e análise gráfica

**O que representa a "superfície de qualidade" mostrada no terceiro gráfico?** A qualidade final calculada pelo sistema para cada combinação de tempo (eixo horizontal, 0 a 60 min) e cordialidade (eixo vertical, 0 a 10), avaliada pela Célula 6 em uma grade de 30 × 30 pontos e representada por cores de vermelho (2) a verde escuro (9). É a função completa que o sistema implementa, da qual os quatro casos de teste são apenas quatro pontos.

**Identifique no gráfico as regiões que correspondem a atendimento "excelente" e "ruim".** Excelente é o retângulo verde escuro do canto superior esquerdo: tempo até 10 min e cordialidade de 8 a 10, onde apenas a regra 1 dispara e a nota é 9,0. Ruim é a região vermelha em forma de L: toda a faixa à direita de 30 minutos, qualquer que seja a cordialidade, e toda a faixa abaixo de cordialidade 3, qualquer que seja o tempo até 20 min, com nota 2,0. Entre as duas ficam as faixas de boa (verde médio) e regular (amarelo) e as rampas de transição.

**Como a sobreposição das funções de pertinência contribui para a suavidade das transições na superfície?** Onde dois termos se sobrepõem, duas regras disparam com forças complementares, e a média ponderada produz valores intermediários entre os dois representativos; a nota muda gradualmente ao longo da zona de sobreposição em vez de saltar na fronteira. Entre 10 e 20 min, por exemplo, a nota com cordialidade 8 desce de 9,0 a 7,0 em passos de 0,2 por minuto (célula B1). A Figura 2 mostra o contrafactual: sem sobreposição, as mesmas regras produzem blocos uniformes com saltos de dois pontos. A prática também mostrou o limite dessa suavidade: onde a sobreposição é pequena ou inexistente (25 a 30 min, cordialidade 6 a 7), a superfície do roteiro volta a ter degraus.

## 4.6 Questão 6: comparação com sistemas tradicionais

**Como um sistema de classificação binário (bom/ruim) trataria um atendimento com 20 minutos de espera?** Dependeria apenas de que lado do limite o projetista colocou o valor 20. No classificador da célula B3 (bom se tempo ≤ 20 e cordialidade ≥ 6), 20,0 min é "bom" e 20,1 min é "ruim"; com um limite "menor que 20", seria o contrário. Em qualquer dos casos, seis segundos de diferença mudam completamente a avaliação, e um atendimento de 20 min com cordialidade 10 recebe o mesmo rótulo que um de 1 min com cordialidade 6. O sistema fuzzy atribui 7,0 a 19,9, 20,0 e 20,1 minutos com cordialidade 8 (todos no núcleo de médio) e distingue, dentro de "bom", os 9,0 de um atendimento de 5 minutos.

**Quais são as principais vantagens da abordagem fuzzy em relação a um sistema de limites fixos?** Quatro, observadas na prática. Graduação: a saída é uma nota contínua, não um rótulo, e varia em rampa onde as pertinências se sobrepõem (Figura 3). Robustez a medições na fronteira: pequenas variações de entrada produzem pequenas variações de saída, sem o degrau de 20,0 para 20,1 min. Compensação entre critérios: cordialidade alta eleva a nota de um atendimento de tempo médio (regra 3), enquanto o binário exige que ambos os limites sejam satisfeitos. Legibilidade: as regras são frases em linguagem natural que um gestor de atendimento consegue ler, discutir e ajustar, como a Questão 7 demonstra ao modificar pertinências e acrescentar uma regra sem tocar no restante do sistema.

**Em que situações práticas esse tipo de sistema seria mais útil que uma avaliação puramente numérica?** Quando os critérios são linguísticos e o conhecimento vem de especialistas, não de dados rotulados: avaliação de qualidade de serviço, triagem de prioridade, controle de temperatura e velocidade, avaliação de desempenho com critérios como "atende às expectativas", diagnóstico com sintomas graduais. Russell e Norvig (2022) situam a lógica fuzzy como um tratamento de graus de verdade, distinto de probabilidade: ela não diz quão provável é que o atendimento seja bom, mas quão bom ele é. Uma avaliação puramente numérica (uma fórmula fechada, uma média de notas) é preferível quando a relação entre entradas e saída é bem definida e linear; e um modelo aprendido de dados, como as redes neurais da Unidade 3, é preferível quando há exemplos em quantidade e ninguém sabe escrever as regras.

## 4.7 Questão 7: melhorias e extensões

**Que outras variáveis poderiam ser incluídas para tornar a avaliação mais completa?** Resolução do problema na primeira interação (sim, parcial, não), que é o critério que mais pesa na satisfação real e está ausente do sistema; número de transferências entre atendentes; duração do próprio atendimento, distinta do tempo de espera; clareza da comunicação, avaliada pelo cliente; e a nota de satisfação declarada (NPS), que permitiria calibrar as pertinências e os valores representativos contra dados reais. Cada variável nova entra com seus próprios termos linguísticos e exige revisão da base de regras, que cresce combinatorialmente; com três variáveis de três termos já seriam 27 combinações a cobrir.

**Como você modificaria as funções de pertinência se os clientes tolerassem menos tempo de espera?** Deslocando as três funções do tempo para a esquerda, sem alterar as regras, como feito na célula B4: rápido com núcleo até 5 min e rampa até 10; médio com pico em 10 min e rampas de 5 a 10 e de 10 a 20; lento subindo de 15 a 25 min e saturado a partir de 25. A Figura 4 compara as duas versões e a tabela da célula B4 mostra o efeito: o Caso 1 cai de 9,0 para 7,8, o Caso 4 de 8,6 para 7,0 e o Caso 2 de 6,0 para 5,0, enquanto o Caso 3 permanece em 2,0. O sistema ficou mais exigente com o tempo exatamente na medida escolhida, e a alteração ficou confinada ao lugar onde esse conhecimento pertence, as funções de pertinência.

**Proponha uma nova regra que poderia melhorar a precisão do sistema.** Regra 6: SE tempo é lento E cordialidade é alta ENTÃO qualidade é regular, retirando essa combinação da regra 5. A motivação está na Questão 4: as cinco regras do roteiro dão 2,0 a qualquer atendimento lento, de modo que (40 min, cordialidade 10) e (40 min, cordialidade 2) recebem a mesma nota, e a informação de cordialidade é descartada em toda a faixa acima de 30 minutos. A célula B5 implementou e testou a regra: (40, 9) sobe de 2,0 para 5,0, (30, 9) de 2,0 para 5,0 e (28, 9) de 4,0 para 5,8, enquanto os atendimentos lentos e pouco cordiais e os quatro casos do roteiro não se alteram. Na Figura 5, o canto superior direito passa de vermelho a amarelo. A "precisão" ganha é poder discriminativo: o sistema passa a separar atendimentos que antes recebia como idênticos, sem perder a capacidade de punir o atendimento lento e frio.

# 5 CONCLUSÃO

Os três objetivos do roteiro foram atingidos. Os conceitos básicos de lógica nebulosa foram introduzidos por um exemplo executado e dissecado caso a caso: fuzzificação por funções triangulares e trapezoidais, inferência por regras SE-ENTÃO com MIN para E e MAX para OU, e defuzzificação por média ponderada. Um sistema de decisão com cinco regras foi implementado, testado em quatro casos e em varreduras adicionais, e visualizado em superfícies de qualidade. A comparação com soluções tradicionais foi feita experimentalmente, na célula B3, contra um classificador de limites fixos, e conceitualmente, na Seção 4.6, contra avaliações numéricas e modelos aprendidos de dados.

A prática ensinou que a sobreposição entre funções de pertinência adjacentes é o que torna um sistema fuzzy: removida, as mesmas cinco regras degeneram em uma tabela de decisão com saltos de dois pontos em seis segundos. Ensinou também que a suavidade não é automática: onde o roteiro deixou a cobertura das partições cair a 0,5, a superfície voltou a ter degraus, o que mostra que o projeto das pertinências é tão importante quanto o das regras. A Parte B mostrou, ainda, que o sistema é ajustável por partes: as pertinências foram recalibradas para clientes menos tolerantes sem tocar nas regras, e uma regra foi acrescentada sem tocar nas pertinências, com efeitos previsíveis e verificáveis em cada caso.

Em relação aos resultados de aprendizagem previstos no roteiro, a prática cobriu os conceitos fundamentais de graus de verdade parciais, a implementação completa de um sistema especialista fuzzy, o reconhecimento das vantagens em domínios imprecisos, o processo de inferência com os operadores MIN e MAX e a combinação de múltiplas regras, e a aplicabilidade a sistemas de controle, decisão e avaliação, com o acréscimo de ter delimitado experimentalmente onde essas vantagens terminam.

[[quebra]]

# REFERÊNCIAS

MAMDANI, Ebrahim H.; ASSILIAN, Sedrak. An experiment in linguistic synthesis with a fuzzy logic controller. International Journal of Man-Machine Studies, [s. l.], v. 7, n. 1, p. 1-13, 1975. DOI: https://doi.org/10.1016/S0020-7373(75)80002-2.

RUSSELL, Stuart J.; NORVIG, Peter. Inteligência artificial: uma abordagem moderna. 4. ed. Rio de Janeiro: LTC, 2022. E-book. ISBN 978-85-951-5949-5.

TAKAGI, Tomohiro; SUGENO, Michio. Fuzzy identification of systems and its applications to modeling and control. IEEE Transactions on Systems, Man, and Cybernetics, [s. l.], v. SMC-15, n. 1, p. 116-132, 1985. DOI: https://doi.org/10.1109/TSMC.1985.6313399.

ZADEH, Lotfi A. Fuzzy sets. Information and Control, [s. l.], v. 8, n. 3, p. 338-353, 1965. DOI: https://doi.org/10.1016/S0019-9958(65)90241-X.
