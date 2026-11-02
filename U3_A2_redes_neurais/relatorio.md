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

Redes neurais artificiais são modelos computacionais formados por unidades simples, os neurônios artificiais, que recebem entradas ponderadas, somam um termo de viés (bias) e aplicam uma função de ativação. Organizadas em camadas e ajustadas a partir de exemplos, essas unidades aprendem funções complexas sem que o programador precise descrever a regra explicitamente, o que as coloca na vertente conexionista da inteligência artificial, em contraste com a vertente simbólica, baseada em regras (RUSSELL; NORVIG, 2022).

O problema clássico que separa os dois mundos é a função lógica XOR (ou exclusivo). Minsky e Papert (1969) demonstraram que um único neurônio, o perceptron, só consegue separar classes com uma reta e, portanto, não representa XOR, cujas saídas iguais ocupam vértices opostos do quadrado unitário. A solução, consolidada com o algoritmo de retropropagação do erro (RUMELHART; HINTON; WILLIAMS, 1986), consiste em acrescentar uma camada oculta com ativações não lineares, de modo que a rede componha várias fronteiras lineares em uma fronteira curva (HAYKIN, 2001). A técnica empregada nesta prática é exatamente essa: um perceptron multicamadas com arquitetura [2, 4, 1], ativação sigmoid e treinamento por descida do gradiente, implementado do zero em Python com a biblioteca NumPy (HARRIS et al., 2020) e visualizado com Matplotlib (HUNTER, 2007).

O objetivo da prática, conforme o roteiro da aula (CENTRO UNIVERSITÁRIO ANHANGUERA PITÁGORAS UNOPAR, 2026), é compreender os fundamentos das redes neurais artificiais, implementar uma rede simples para classificação e visualizar o processo de treinamento e aprendizado, no experimento denominado "Classificação simples com porta lógica". Este relatório registra a execução integral do roteiro, inclusive do código de lógica fuzzy nele contido, documenta a contradição interna encontrada no enunciado como ocorrência metodológica e apresenta a rede neural que resolve a função XOR com 100% de acurácia.

# 2 MATERIAIS E MÉTODOS

## 2.1 Ambiente de execução

[[quadro ambiente]]

O roteiro indica o Google Colab (GOOGLE, {ano}) como solução digital. A execução registrada neste relatório ocorreu no notebook pessoal do autor, com {sistema}, no Visual Studio Code (MICROSOFT, {ano}), com a extensão Jupyter, sobre um ambiente virtual Python local (PYTHON SOFTWARE FOUNDATION, {ano}) com as mesmas bibliotecas que o Colab disponibiliza (NumPy e Matplotlib), o que foi adotado como decisão metodológica por três razões: o arquivo .ipynb é o mesmo formato que o Colab abre, sem conversão, e não depende de nada além das duas bibliotecas; a inicialização dos pesos usa semente fixa, de modo que o treinamento é reproduzível em qualquer ambiente, inclusive no Colab, com diferenças apenas na última casa decimal; e as transcrições e figuras deste relatório foram extraídas diretamente das saídas gravadas no notebook executado, o que lhes dá fidelidade integral. O notebook, os scripts de execução e o gerador deste relatório estão versionados em repositório público no GitHub (CHITTONI, {ano}), na pasta {pasta} de {repositorio}, acessível sem login, o que permite reproduzir a execução e conferir cada evidência.

## 2.2 Estratégia

A prática foi conduzida em três fases. Na primeira, o roteiro foi lido na íntegra e confrontado consigo mesmo: título, objetivos, questões, checklist e seção de resultados descrevem uma rede neural para XOR, mas o código das seis células implementa um sistema de lógica fuzzy. Essa contradição foi tratada como a Ocorrência 1 (Seção 3.1) e definiu o desenho do experimento em duas partes. Na segunda fase, a Parte A, o código do roteiro foi reproduzido exatamente como entregue e executado, para que o procedimento literal ficasse registrado. Na terceira fase, a Parte B, a rede neural que o roteiro avalia foi implementada do zero, sem frameworks de aprendizado de máquina, para que cada etapa (propagação frontal, cálculo do erro, retropropagação, atualização dos pesos) ficasse exposta e verificável.

A validação da Parte B foi feita em três níveis crescentes de exigência: as quatro entradas da tabela-verdade, que a rede precisa classificar com 100% de acurácia; uma contraprova com um único neurônio, que precisa falhar em XOR e acertar AND e OR, confirmando a necessidade da camada oculta; e um conjunto de 200 amostras sintéticas com ruído, que mede se a fronteira aprendida tem margem e não apenas memoriza os quatro pontos. Todas as sementes pseudoaleatórias foram fixadas (42 para os pesos e 7 para o ruído), de modo que o experimento é reproduzível.

## 2.3 Passo a passo da atividade

[[tabela passos]]

Os passos 3 a 7 correspondem às seis células numeradas do roteiro. Os passos 8 a 16 correspondem às células B1 a B9 do notebook, acrescentadas para atender aos objetivos, às questões e ao checklist do enunciado. O código completo de cada célula da Parte B é apresentado na Seção 3.3, imediatamente antes da saída que produziu.

# 3 RESULTADOS E DISCUSSÃO

## 3.1 Ocorrência 1: contradição entre o enunciado e o código do roteiro

**Sintoma.** O roteiro da aula A2 tem como objetivos "compreender os fundamentos de Redes Neurais Artificiais", "implementar uma rede neural simples para classificação" e "visualizar o processo de treinamento"; a atividade proposta é "implementar uma rede neural simples para aprender a função lógica XOR"; as sete questões da seção "Avaliando os resultados" tratam de neurônios por camada, camada oculta, função sigmoid, taxa de aprendizado, épocas, superfície de decisão e pesos; o checklist exige gráfico de erro de treinamento, superfície de decisão, teste com dados sintéticos e acurácia acima de 90%; e a seção "Resultados" descreve uma rede [2, 4, 1] com backpropagation. O código das seis células, porém, implementa um sistema de lógica fuzzy (ZADEH, 1965) para avaliação de qualidade de atendimento, com funções de pertinência para tempo de espera e cordialidade, cinco regras com operador MIN e defuzzificação por média ponderada. Não há no código nenhum neurônio, peso, época ou função de ativação. O roteiro ainda instrui a nomear o notebook "Avaliação de Qualidade de Atendimento", nome que pertence ao tema fuzzy.

**Causa-raiz.** O código corresponde ao conteúdo efetivamente lecionado na Unidade 3 da disciplina, que, apesar do título "Introdução ao Deep Learning", ensina lógica fuzzy; redes neurais são o conteúdo da Unidade 4. O roteiro foi montado com a moldura textual de uma aula de redes neurais e o corpo de código de uma aula de lógica fuzzy, provavelmente por reaproveitamento de material entre unidades. Trata-se de um defeito do enunciado, não do ambiente nem da execução.

**Correção adotada.** Executar as duas coisas. O código fuzzy foi reproduzido sem alteração e executado (Parte A, Seção 3.2), de modo que o procedimento literal do roteiro está documentado. Em seguida, foi implementada a rede neural que o roteiro avalia (Parte B, Seção 3.3), única forma de responder às questões com base em observações da prática e de cumprir o checklist. O notebook recebeu o nome U3_A2_Redes_Neurais_XOR, coerente com a aula.

**Lição.** Um roteiro é um requisito, e requisitos contraditórios precisam ser detectados antes da execução, não depois. A verificação cruzada entre objetivos, procedimento e critérios de avaliação levou menos de dez minutos e evitou entregar um relatório sobre lógica fuzzy para uma aula cujas questões não poderiam ser respondidas com esse código. A mesma disciplina de leitura crítica vale para qualquer especificação de software.

## 3.2 Parte A: execução literal do roteiro (sistema fuzzy)

A célula A0, acrescentada antes da Célula 1 do roteiro, registra o ambiente:

[[codigo A0]]

[[saida A0]]

As Células 1 a 4 do roteiro definem as importações, as funções de pertinência e as regras. A Célula 4, que concentra a lógica do sistema, é reproduzida abaixo; as funções de pertinência das Células 2 e 3 são funções lineares por partes que valem 1 no núcleo de cada termo (por exemplo, tempo rápido até 10 min, lento a partir de 35 min) e decaem linearmente na zona de transição.

[[codigo A4]]

A Célula 5 executa quatro casos de teste. Transcrição integral da saída:

[[saida A5]]

Três detalhes da saída merecem interpretação. No Caso 2 (15 min, cordialidade 6), o tempo pertence com grau 0,5 ao termo "rápido" e 0,5 ao termo "médio", e a cordialidade com grau 0,5 a "média" e 0 a "alta"; a regra 2 (rápido E média) e a regra 4 (médio E média) disparam ambas com força 0,5, o que gera qualidade final (0,5 × 7 + 0,5 × 5) / 1,0 = 6,0. No Caso 4 (12 min, cordialidade 8), o tempo é "rápido" com grau 0,8 e "médio" com 0,2, e a cordialidade é "alta" com grau 1,0; disparam a regra 1 com força 0,8 e a regra 3 com 0,2, resultando em (0,8 × 9 + 0,2 × 7) / 1,0 = 8,6. Nos Casos 1 e 3 apenas uma regra dispara, com força 1,0, e a saída coincide com o valor representativo da classe (9,0 e 2,0). O denominador max(soma, 0,001) da defuzzificação evita divisão por zero quando nenhuma regra dispara.

A Célula 6 produz os três gráficos da Figura 1. As duas primeiras curvas mostram as funções de pertinência sobrepostas, com as zonas de transição em que dois termos coexistem; a terceira mostra a superfície de qualidade, em que a cor vai de vermelho (ruim) a verde (excelente) conforme tempo e cordialidade. A superfície tem patamares planos e degraus, assinatura de um sistema de regras discretas suavizado pelas transições lineares das pertinências. Esse comportamento será contrastado com a superfície contínua da rede neural na Seção 3.3.4.

[[figura f1]]

A Parte A cumpre o procedimento do roteiro, mas não produz nenhuma das evidências que o checklist exige (gráfico de erro de treinamento, superfície de decisão, acurácia), o que confirma a Ocorrência 1 e justifica a Parte B.

## 3.3 Parte B: rede neural [2, 4, 1] para a função XOR

### 3.3.1 Dados, função de ativação e inicialização

A célula B1 define as quatro entradas da tabela-verdade, as saídas esperadas de XOR e a função sigmoid com sua derivada, escrita em função da própria ativação (a × (1 − a)), forma que evita recalcular a exponencial durante a retropropagação.

[[codigo B1]]

[[saida B1]]

A Figura 2 mostra a sigmoid e sua derivada. A sigmoid comprime qualquer valor real para o intervalo aberto (0, 1) e cruza 0,5 em z = 0; a derivada é máxima nesse ponto (0,25) e tende a zero nas extremidades. Esse formato explica dois fenômenos observados no treinamento: a lentidão inicial, quando as saídas estão próximas de 0,5 e os gradientes ainda são moderados, e a saturação final, quando as saídas se aproximam de 0 ou 1 e o gradiente diminui.

[[figura f2]]

A célula B2 fixa a arquitetura e inicializa os pesos com distribuição uniforme em [−1, 1] e semente 42; os bias começam em zero. A rede tem 17 parâmetros treináveis.

[[codigo B2]]

[[saida B2]]

### 3.3.2 Treinamento por retropropagação

A célula B3 implementa o ciclo completo: propagação frontal, cálculo do erro, retropropagação dos gradientes locais (delta) da saída para a camada oculta e atualização de pesos e bias na direção oposta ao gradiente. O treinamento é em lote (as quatro amostras a cada época), com taxa de aprendizado 0,5 por 10.000 épocas.

[[codigo B3]]

Transcrição do registro de treinamento, impresso na primeira época e a cada mil épocas:

[[saida B3]]

O registro mostra a rede partindo de MSE 0,2629 com 50% de acurácia (duas das quatro saídas corretas por acaso, pois todas valem aproximadamente 0,5) e atingindo 100% antes da época 1.000, com o erro caindo de forma monotônica até 0,000239 na época 10.000. A inspeção do histórico completo, guardado nas listas historico_erro e historico_acuracia, localiza os marcos com precisão: a acurácia sobe a 75% na época 208 e a 100% na época 260; o MSE, que fica praticamente estacionado em torno de 0,25 durante as primeiras 200 épocas (0,2498 na época 50, 0,2404 na época 200), desaba entre as épocas 300 e 500 (0,2084 → 0,1156 → 0,0457) e entra em regime de decaimento lento a partir da época 1.000 (0,0059). A Figura 3 torna visível esse perfil em dois tempos: um patamar inicial, em que a rede ainda responde 0,5 para tudo, seguido de uma queda abrupta quando os pesos da camada oculta se diferenciam, e de uma cauda longa de refinamento.

[[figura f3]]

O patamar inicial não é um defeito, mas uma característica da combinação sigmoid com pesos pequenos: enquanto |z| é pequeno em todas as unidades, as ativações ficam perto de 0,5, a derivada perto de 0,25 e os gradientes de cada amostra se cancelam parcialmente entre si, porque metade das amostras pede saída 0 e metade pede saída 1. Só quando a assimetria dos pesos iniciais se amplifica o suficiente para que alguma unidade oculta distinga as entradas é que o erro passa a cair. A cauda longa, por sua vez, decorre da saturação da sigmoid: quanto mais as saídas se aproximam de 0 e 1, menor o fator a × (1 − a) e menor cada passo.

### 3.3.3 Resultado final nas quatro entradas

A célula B4 avalia a rede treinada:

[[codigo B4]]

[[saida B4]]

[[tabela resultado]]

As quatro saídas ficam a menos de 0,02 do valor esperado e a predição por limiar 0,5 acerta todas, com MSE final de 0,000239. O critério do checklist (acurácia acima de 90%) é cumprido com folga. Nota-se a simetria das saídas: 0,9839 e 0,9849 para as duas entradas com um único 1, e 0,0095 e 0,0195 para as entradas iguais, o que indica que a rede tratou as duas ordens (0, 1) e (1, 0) de forma quase equivalente, ainda que por caminhos internos diferentes, como a Seção 3.3.5 mostra.

### 3.3.4 Superfície de decisão

A célula B6 avalia a rede em uma grade de 200 × 200 pontos do plano (x1, x2) no intervalo [−0,5; 1,5] e desenha a saída como mapa de cores, com a curva de nível 0,5 em preto.

[[codigo B6]]

[[figura f4]]

A Figura 4 mostra a geometria aprendida: uma faixa vermelha (saída próxima de 0) atravessa o plano na diagonal, contendo os pontos (0, 0) e (1, 1), e duas regiões verdes (saída próxima de 1) ocupam os cantos superior esquerdo, com (0, 1), e inferior direito, com (1, 0). O limite de decisão é formado por duas curvas, não por uma reta. É a imagem direta da razão pela qual XOR não é linearmente separável: nenhuma reta deixa (0, 1) e (1, 0) de um lado e (0, 0) e (1, 1) do outro, mas duas fronteiras aproximadamente paralelas, compostas pela camada oculta, deixam. A transição entre as cores é suave, por causa da sigmoid, mas estreita, por causa dos pesos grandes que o treinamento produziu. Comparada à superfície fuzzy da Figura 1, feita de patamares e degraus definidos à mão pelas regras, a superfície da rede é contínua e foi inteiramente aprendida a partir de quatro exemplos.

### 3.3.5 Pesos, bias e ativações da camada oculta

A célula B7 compara pesos e bias antes e depois do treinamento e imprime as ativações da camada oculta para cada entrada:

[[codigo B7]]

[[saida B7]]

[[figura f5]]

A Figura 5 e a transcrição mostram que o treinamento levou os pesos de valores pequenos (|w| < 1) a magnitudes entre 4 e 9, com uma estrutura legível. O neurônio oculto 1 (segunda coluna) terminou com pesos 4,61 para x1 e −6,26 para x2 e bias −2,06: ele só se ativa quando x1 = 1 e x2 = 0 (ativação 0,93 para (1, 0) e no máximo 0,11 nas demais entradas), funcionando como um detector de "x1 e não x2". O neurônio 3 terminou com pesos 3,83 e 3,85, ambos positivos, e bias −0,60: ativa-se com qualquer entrada que tenha ao menos um 1 (0,96; 0,96; 0,999) e fica em 0,35 para (0, 0), comportando-se como um OR. O neurônio 2 (pesos 6,37 e −4,77, bias 2,09) ativa-se para tudo, exceto (0, 1), para a qual cai a 0,06. O neurônio 0 permaneceu com pesos pequenos (−0,40 e −1,20) e peso de saída modesto (1,51): a rede praticamente não o usa, sinal de que quatro unidades ocultas são mais do que o problema exige.

A camada de saída combina esses detectores com pesos W2 = [1,51; 8,93; −9,09; 4,44] e bias −0,08. A leitura é a seguinte: o OR (neurônio 3, peso +4,44) tende a ligar a saída para qualquer entrada com um 1; o neurônio 2 (peso −9,09) desliga a saída para (0, 0), (1, 0) e (1, 1), as três entradas para as quais ele está ativo; e o detector "x1 e não x2" (neurônio 1, peso +8,93) religa a saída especificamente para (1, 0). O resultado é que (0, 1) passa pelo OR sem ser desligada, (1, 0) é desligada e religada, e (0, 0) e (1, 1) ficam desligadas. É uma decomposição de XOR diferente da forma canônica (OR E NÃO AND), mas logicamente equivalente, e foi encontrada pela rede sem qualquer instrução sobre lógica.

Os bias têm papel indispensável nessa construção, e a entrada (0, 0) o demonstra: como todos os x são zero, o somatório ponderado de cada neurônio oculto vale exatamente o bias, e as ativações para (0, 0) são sigmoid(b1) = sigmoid([0,48; −2,06; 2,09; −0,60]) = [0,62; 0,11; 0,89; 0,35], que coincidem com a transcrição. Sem bias, (0, 0) produziria ativação 0,5 em todas as unidades ocultas, independentemente dos pesos, e a rede não teria como diferenciá-la. Geometricamente, o bias desloca a fronteira linear de cada neurônio para longe da origem; os pesos determinam sua inclinação.

### 3.3.6 Contraprova: um único neurônio em AND, OR e XOR

A célula B8 treina um neurônio isolado, sem camada oculta, com o mesmo algoritmo, a mesma taxa e o mesmo número de épocas, em três problemas:

[[codigo B8]]

[[saida B8]]

[[figura f6]]

O neurônio único resolve AND e OR com 100% de acurácia e saídas nítidas (0,972 para o único 1 de AND; 0,985 e 1,0 para os três 1 de OR), e a Figura 6 mostra a reta encontrada em cada caso, separando corretamente os pontos. Em XOR, o mesmo neurônio converge para a resposta 0,5 em todas as quatro entradas, acurácia 50%, e os pesos colapsam para valores próximos de zero, razão pela qual nenhuma fronteira é desenhada no terceiro painel: não há reta a traçar porque não há reta que resolva o problema. É a demonstração experimental do resultado de Minsky e Papert (1969) e a resposta direta à pergunta do roteiro sobre o que aconteceria sem a camada oculta.

### 3.3.7 Teste com dados sintéticos

A célula B9 gera 50 pontos em torno de cada uma das quatro entradas, com ruído gaussiano de desvio padrão 0,15, rotula cada ponto com o XOR do vértice de origem e avalia a rede treinada:

[[codigo B9]]

[[saida B9]]

[[figura f7]]

A rede classifica corretamente 199 das 200 amostras (99,5%), embora tenha sido treinada apenas nos quatro vértices. O único erro, marcado com um X na Figura 7, é um ponto gerado em torno de (1, 0) que o ruído deslocou para aproximadamente (0,73; 0,24), em cima da curva de decisão. Esse resultado mostra que a rede não memorizou quatro pontos: a fronteira aprendida tem margem, e as nuvens de amostras ficam inteiras dentro das regiões corretas. Com a figura também se vê por que a margem não é infinita: a faixa vermelha central tem largura finita, e qualquer amostra que o ruído empurre para a diagonal será classificada como 0.

# 4 RESPOSTAS AOS QUESTIONAMENTOS

## 4.1 Questão 1: arquitetura da rede neural

**Quantos neurônios foram utilizados em cada camada da rede?** Dois na camada de entrada (x1 e x2), quatro na camada oculta e um na camada de saída, arquitetura [2, 4, 1], com 17 parâmetros treináveis: 8 pesos e 4 bias na primeira camada, 4 pesos e 1 bias na segunda (célula B2). A camada de entrada não realiza cálculo; apenas apresenta os valores.

**Por que foi necessária uma camada oculta para resolver o problema XOR?** Porque um neurônio com ativação sigmoid separa o plano com uma única reta (w1x1 + w2x2 + b = 0), e os pontos de XOR com saída 1, (0, 1) e (1, 0), estão em vértices opostos do quadrado, com os pontos de saída 0 nos outros dois vértices: não existe reta que os separe. A camada oculta cria vários neurônios, cada um com sua reta, e a camada de saída combina as regiões resultantes. Na prática, a Seção 3.3.5 mostrou que a rede construiu um detector de "x1 e não x2", um OR e um detector de "não (0, 1)", e os combinou com pesos de sinais opostos, formando a fronteira em duas curvas da Figura 4.

**O que aconteceria se tentássemos resolver XOR com apenas um neurônio?** Foi testado na célula B8: com o mesmo algoritmo, a mesma taxa e 10.000 épocas, o neurônio único resolveu AND e OR com 100% e convergiu em XOR para saída 0,5 nas quatro entradas, com 50% de acurácia e pesos próximos de zero (Figura 6). O treinamento não diverge nem oscila; ele encontra o melhor que uma reta consegue, que é não decidir.

## 4.2 Questão 2: função de ativação

**Qual função de ativação foi utilizada na rede? Por que essa escolha?** A sigmoid logística, σ(z) = 1 / (1 + e^(−z)), em ambas as camadas. Foi escolhida por três razões: é diferenciável em todo o domínio, requisito da retropropagação; produz saídas em (0, 1), o que permite ler a saída da rede como grau de pertinência à classe 1 e aplicar o limiar 0,5; e sua derivada tem a forma σ(z) × (1 − σ(z)), calculável a partir da própria ativação já computada na propagação frontal, sem nova exponencial (função sigmoid_derivada, célula B1). É também a ativação indicada no roteiro.

**Como a função sigmoid transforma os valores de entrada?** Ela comprime a reta real inteira no intervalo (0, 1): valores muito negativos vão a quase 0, valores muito positivos a quase 1, e z = 0 vai a exatamente 0,5 (Figura 2). A transição é suave e concentrada em torno de zero; fora de |z| ≈ 4 a curva já está saturada. Na rede treinada, isso é visível nas ativações ocultas: z = 2,55 para o neurônio 1 na entrada (1, 0) vira 0,93, e z = −3,71 na entrada (1, 1) vira 0,024.

**Por que é importante ter uma função de ativação não linear?** Porque a composição de transformações lineares é linear: se as camadas apenas multiplicassem por matrizes e somassem bias, a rede inteira, por mais camadas que tivesse, equivaleria a um único neurônio linear e herdaria sua limitação de traçar uma só reta. A não linearidade entre as camadas é o que permite que a segunda camada combine regiões, e não apenas retas, e é o que gera a fronteira curva da Figura 4.

## 4.3 Questão 3: processo de treinamento

**Qual algoritmo foi usado para treinar a rede neural?** Retropropagação do erro (backpropagation) com descida do gradiente em lote. A cada época, a célula B3 propaga as quatro entradas, calcula o erro (y − a2) e o MSE, obtém o gradiente local da saída, delta2 = erro × σ'(a2), retropropaga para a camada oculta, delta1 = (delta2 · W2ᵀ) × σ'(a1), e atualiza cada matriz de pesos somando taxa × (ativação de entradaᵀ · delta), que é a direção oposta ao gradiente do MSE.

**O que representa a "taxa de aprendizado" e como ela afeta o treinamento?** É o tamanho do passo dado a cada atualização na direção oposta ao gradiente; aqui, 0,5. Taxa pequena produz passos curtos e treinamento lento, com risco de parar em um patamar como o das primeiras 200 épocas; taxa grande produz passos longos, com risco de ultrapassar o mínimo e oscilar ou divergir. Com 0,5 e gradiente somado sobre as quatro amostras, a rede saiu do patamar na época 208, atingiu 100% na 260 e reduziu o erro de forma monotônica até o fim, sem oscilação visível na Figura 3, o que indica uma taxa adequada para este problema.

**Por que o erro diminui ao longo das épocas de treinamento?** Porque cada atualização move os pesos no sentido que reduz o MSE para as amostras apresentadas, por construção da descida do gradiente. O registro de treinamento confirma: 0,2629 na época 1, 0,2404 na 200, 0,0457 na 500, 0,0059 na 1.000 e 0,000239 na 10.000, sem nenhuma subida. A diminuição não é uniforme, pelo formato da sigmoid: lenta enquanto todas as saídas valem cerca de 0,5 e os gradientes das amostras se cancelam, rápida quando a camada oculta se diferencia, e lenta de novo quando as saídas saturam perto de 0 e 1 e a derivada σ'(a) tende a zero.

## 4.4 Questão 4: análise dos resultados

**A rede conseguiu aprender perfeitamente a função XOR? Como você pode verificar isso?** Sim, no sentido operacional: as quatro predições por limiar 0,5 estão corretas (100% de acurácia) e o MSE final é 0,000239. A verificação é a da célula B4 e da Tabela 2: propagar cada entrada pela rede treinada e comparar a saída com o valor esperado. Verificou-se também, na célula B9, que a rede classifica corretamente 199 de 200 amostras ruidosas, prova de que a fronteira aprendida tem margem. "Perfeitamente" merece ressalva: as saídas valem 0,0095, 0,9839, 0,9849 e 0,0195, não exatamente 0 e 1, porque a sigmoid nunca atinge os extremos; o erro residual pode ser reduzido com mais épocas, mas não zerado.

**Compare as saídas da rede com os valores esperados para cada entrada.** (0, 0): esperado 0, obtido 0,0095; (0, 1): esperado 1, obtido 0,9839; (1, 0): esperado 1, obtido 0,9849; (1, 1): esperado 0, obtido 0,0195. O maior desvio absoluto é 0,0195, na entrada (1, 1), e o menor é 0,0095, na entrada (0, 0).

**O que indica que a rede "aprendeu" a função lógica?** Três evidências convergentes: a tabela-verdade reproduzida com erro menor que 0,02 em cada entrada; a superfície de decisão da Figura 4, que separa as classes com uma geometria coerente com a estrutura de XOR, e não com um ajuste arbitrário aos quatro pontos; e a generalização para amostras ruidosas que nunca foram apresentadas no treinamento (99,5%). Aprender, aqui, significa ter encontrado pesos que implementam a função, e a Seção 3.3.5 mostrou que esses pesos têm estrutura lógica interpretável.

## 4.5 Questão 5: visualização e interpretação

**O que representa a "superfície de decisão" mostrada no gráfico?** A saída da rede para cada ponto do plano de entradas, não apenas para os quatro vértices da tabela-verdade. Na Figura 4, a cor de cada ponto (x1, x2) é o valor de a2 que a rede produz para ele, de vermelho (próximo de 0) a verde (próximo de 1). A superfície mostra como a rede interpolou e extrapolou a partir de quatro exemplos.

**Como a linha de contorno (limite de decisão) separa as classes?** A linha preta é a curva de nível em que a saída vale exatamente 0,5, o limiar de classificação. Tudo de um lado da linha é classificado como 1 e tudo do outro, como 0. Em XOR, a linha é dupla: duas curvas aproximadamente paralelas isolam a faixa diagonal da classe 0, que contém (0, 0) e (1, 1), dos dois cantos da classe 1, com (0, 1) e (1, 0).

**Por que a superfície de decisão não é uma linha reta?** Porque a saída é uma combinação não linear de várias fronteiras lineares. Cada neurônio oculto traça uma reta no plano e responde com uma sigmoid à distância do ponto a essa reta; a camada de saída soma essas respostas com pesos de sinais diferentes e aplica outra sigmoid. A curva de nível 0,5 dessa composição só seria uma reta se um único neurônio oculto dominasse, o que seria insuficiente para XOR. A contraprova da célula B8 mostra exatamente o que acontece quando apenas uma reta está disponível: nenhuma fronteira é encontrada.

## 4.6 Questão 6: análise dos pesos

**Como os pesos da rede mudaram durante o treinamento?** Partiram de valores uniformes em [−1, 1] e cresceram em magnitude, chegando a 6,37 em W1 e a 9,09 em W2 (Figura 5 e transcrição da Seção 3.3.5). O crescimento não foi uniforme: três dos quatro neurônios ocultos se especializaram, com pesos de sinais opostos ou ambos positivos, e um (neurônio 0) permaneceu com pesos pequenos e pouco usado pela saída. Os bias, que começaram em zero, assumiram valores entre −2,06 e 2,09.

**O que representam os pesos entre a camada de entrada e a camada oculta?** Cada coluna de W1, com seu bias, define a reta w1x1 + w2x2 + b = 0 que um neurônio oculto usa para dividir o plano, e o sinal de cada peso diz se a entrada correspondente aproxima ou afasta o neurônio da ativação. Na rede treinada, o neurônio 1 (4,61; −6,26) responde a x1 e é inibido por x2, atuando como detector de "x1 e não x2"; o neurônio 3 (3,83; 3,85) responde a qualquer entrada, como um OR; o neurônio 2 (6,37; −4,77, com bias 2,09) responde a tudo exceto (0, 1). Os pesos são, portanto, as regras parciais que a rede descobriu.

**Como os bias influenciam o comportamento da rede?** O bias desloca o limiar de disparo de cada neurônio, movendo a reta de decisão para longe da origem sem alterar sua inclinação. A entrada (0, 0) deixa isso explícito: como todos os x são zero, a ativação oculta é sigmoid do próprio bias, [0,62; 0,11; 0,89; 0,35], exatamente o que a transcrição registra. Sem bias, essa entrada produziria 0,5 em todos os neurônios, qualquer que fosse o treinamento, e a rede perderia a capacidade de tratá-la de forma distinta. O bias de −2,06 do neurônio 1 é o que o impede de disparar para (0, 0) e (1, 1) e o reserva para (1, 0).

## 4.7 Questão 7: comparação com outras abordagens

**Como uma rede neural resolve XOR diferentemente de portas lógicas básicas (AND, OR)?** AND e OR são linearmente separáveis e um único neurônio as implementa, como a célula B8 comprovou com 100% em ambas (Figura 6). XOR não é, e a rede a resolve compondo portas: a camada oculta aprendeu, sem instrução, detectores equivalentes a sub-funções lógicas (um OR, um "x1 e não x2", um "não (0, 1)") e a camada de saída os combinou com pesos de sinais opostos. É a mesma ideia de construir XOR com portas AND, OR e NOT em circuitos digitais, com a diferença de que a decomposição foi encontrada por descida do gradiente a partir de exemplos.

**Quais são as vantagens das redes neurais sobre sistemas baseados em regras fixas?** A prática ofereceu a comparação direta: o sistema fuzzy da Parte A tem funções de pertinência e cinco regras escritas à mão pelo projetista, e produz a superfície em patamares da Figura 1; a rede da Parte B recebeu apenas quatro exemplos e aprendeu a superfície contínua da Figura 4. A vantagem da rede é aprender o mapeamento a partir de dados, inclusive mapeamentos que ninguém sabe escrever como regra, e adaptar-se quando os dados mudam. O preço é a perda de interpretabilidade: as regras do sistema fuzzy são legíveis por qualquer pessoa, enquanto os 17 pesos da rede só foram interpretados na Seção 3.3.5 com esforço, e em redes maiores essa leitura se torna impraticável.

**Em que situações as redes neurais são mais adequadas que outros métodos de classificação?** Quando a relação entre entradas e saídas é não linear e desconhecida, quando há dados rotulados em quantidade suficiente para aprendê-la e quando o custo de uma decisão não exigir justificativa caso a caso, como em reconhecimento de imagens, voz e texto. Sistemas de regras, fuzzy ou especialistas, continuam mais adequados quando o conhecimento já está explícito, quando os dados são escassos e quando a decisão precisa ser auditável, como em avaliações com critérios definidos por política, caso do próprio exemplo de qualidade de atendimento do roteiro. A escolha é de engenharia, não de moda: a rede foi necessária para XOR porque nenhuma reta o resolve; o sistema fuzzy foi suficiente para o atendimento porque as regras eram conhecidas.

# 5 CONCLUSÃO

Os três objetivos do roteiro foram atingidos. Os fundamentos das redes neurais artificiais foram compreendidos na prática, por meio de uma implementação sem frameworks em que cada etapa do ciclo de aprendizado ficou visível no código e na saída; uma rede neural [2, 4, 1] foi implementada e resolveu a função XOR com 100% de acurácia nas quatro entradas e 99,5% em 200 amostras ruidosas; e o processo de treinamento foi visualizado pela curva de erro, pela curva de acurácia, pela superfície de decisão e pelo mapa de calor dos pesos. Todos os itens do checklist do roteiro foram cumpridos, com a ressalva de que o gráfico de erro, a superfície de decisão, o teste sintético e a acurácia exigidos não poderiam ter sido produzidos com o código fornecido no roteiro.

A prática ensinou, em primeiro lugar, que a camada oculta não é um refinamento opcional, mas a condição de existência da solução: o mesmo algoritmo que resolve AND e OR com um neurônio converge, em XOR, para a não resposta 0,5. Ensinou também que os pesos aprendidos têm estrutura legível quando a rede é pequena, pois foi possível identificar na camada oculta detectores equivalentes a sub-funções lógicas e explicar, neurônio a neurônio, como a saída é composta; e que os bias são o que permite à rede tratar a entrada nula, demonstração que a álgebra deixa explícita. O comportamento do treinamento em dois tempos, com um patamar inicial seguido de queda abrupta e cauda longa, mostrou na prática como o formato da sigmoid governa a velocidade do aprendizado.

O erro do roteiro, documentado como Ocorrência 1, foi o aprendizado mais inesperado. Um enunciado que avalia uma coisa e fornece código de outra é um requisito contraditório, e a decisão de executar o que foi fornecido e implementar o que foi pedido só foi possível porque a contradição foi detectada antes da execução. Em relação aos resultados de aprendizagem previstos no roteiro, a prática cobriu conceitos fundamentais, implementação completa com backpropagation, resolução de problema não linearmente separável, compreensão do processo de aprendizado, aplicabilidade comparada com sistemas de regras e interpretação de superfícies de decisão e pesos, com a vantagem adicional de ter colocado lado a lado, no mesmo experimento, um sistema de regras fuzzy e uma rede neural, exatamente o contraste entre a inteligência artificial simbólica e a conexionista que estrutura a disciplina.

[[quebra]]

# REFERÊNCIAS

CENTRO UNIVERSITÁRIO ANHANGUERA PITÁGORAS UNOPAR. Roteiro de aula prática: Fundamentos da Inteligência Artificial. Unidade 3: Introdução ao Deep Learning. Aula 2: Redes Neurais Artificiais. [S. l.: s. n.], [2026]. Material didático da disciplina, distribuído no AVA.

CHITTONI, Roni. eng-soft-praticas: aulas práticas de Engenharia de Software. [S. l.]: GitHub, {ano}. Disponível em: {repositorio}. Acesso em: {data_acesso}.

GOOGLE. Colaboratory. Disponível em: https://colab.google/. Acesso em: {data_acesso}.

HARRIS, Charles R. et al. Array programming with NumPy. Nature, London, v. 585, p. 357-362, 2020. DOI: https://doi.org/10.1038/s41586-020-2649-2.

HAYKIN, Simon. Redes neurais: princípios e prática. Tradução: Paulo Martins Engel. 2. ed. Porto Alegre: Bookman, 2001.

HUNTER, John D. Matplotlib: a 2D graphics environment. Computing in Science & Engineering, [s. l.], v. 9, n. 3, p. 90-95, 2007. DOI: https://doi.org/10.1109/MCSE.2007.55.

MINSKY, Marvin; PAPERT, Seymour. Perceptrons: an introduction to computational geometry. Cambridge: MIT Press, 1969.

MICROSOFT. Visual Studio Code: Jupyter Notebooks in VS Code. Disponível em: https://code.visualstudio.com/docs/datascience/jupyter-notebooks. Acesso em: {data_acesso}.

PYTHON SOFTWARE FOUNDATION. Python {python_curto} documentation. Disponível em: https://docs.python.org/{python_curto}/. Acesso em: {data_acesso}.

RUMELHART, David E.; HINTON, Geoffrey E.; WILLIAMS, Ronald J. Learning representations by back-propagating errors. Nature, London, v. 323, p. 533-536, 1986. DOI: https://doi.org/10.1038/323533a0.

RUSSELL, Stuart J.; NORVIG, Peter. Inteligência artificial: uma abordagem moderna. 4. ed. Rio de Janeiro: LTC, 2022. E-book. ISBN 978-85-951-5949-5.

ZADEH, Lotfi A. Fuzzy sets. Information and Control, [s. l.], v. 8, n. 3, p. 338-353, 1965. DOI: https://doi.org/10.1016/S0019-9958(65)90241-X.
