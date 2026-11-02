# Pipeline U2 A3: Avaliação de Qualidade de Atendimento (VS Code no Windows)

Executa o notebook da aula prática, extrai as evidências (saídas e figuras) do próprio .ipynb e regenera o relatório ABNT (.docx + PDF) com o ambiente Windows real no Quadro 1.

## Pré-requisitos

| Item | Para quê | Instalação |
|---|---|---|
| Python 3.10+ | notebook e evidências | `winget install Python.Python.3.12` |
| VS Code + extensões Python e Jupyter | executar e ver o notebook | o VS Code oferece as extensões ao abrir a pasta |
| Node.js LTS | gerar o .docx | `winget install OpenJS.NodeJS.LTS` |
| Microsoft Word ou LibreOffice | gerar o PDF | já instalado, em geral |

Depois de instalar Python ou Node, feche e reabra o VS Code para o PATH ser atualizado.

## Uso

1. Extraia a pasta e abra-a no VS Code (Arquivo > Abrir Pasta). Aceite as extensões recomendadas.
2. `Ctrl+Shift+P` > **Tasks: Run Task** > **1. Preparar ambiente**. Cria o `.venv`, instala as bibliotecas, registra o kernel "Python (.venv U2A3)" e instala o `docx`. Só precisa rodar uma vez.
3. Escolha um dos caminhos:
   - **Automático:** `Ctrl+Shift+B` (pipeline completo). Executa o notebook, extrai as evidências, gera o relatório e o PDF.
   - **Interativo:** abra `notebook\U2_A3_Avaliacao_Qualidade_Atendimento.ipynb`, clique em **Select Kernel** > "Python (.venv U2A3)", **Run All**, salve (`Ctrl+S`) e rode a tarefa **3. Só evidências + relatório**.
4. Resultado em `saida\`: `Relatorio_Aula_Pratica_Logica_Fuzzy_U2A3_Roni_Chittoni.docx` e `.pdf`. Evidências brutas em `evidencias\` (um `.txt` e um `.png` por célula).

## Como editar o texto do relatório

Todo o texto fica em `relatorio.md`, nesta pasta. O `scripts\gerar_relatorio.js` só cuida da formatação ABNT e não precisa ser aberto.

1. Abra `relatorio.md` no VS Code (`Ctrl+Shift+V` mostra a pré-visualização ao lado) ou no Obsidian.
2. Edite: `#`, `##` e `###` para títulos; parágrafos separados por linha em branco; `**negrito**` e `*itálico*`.
3. Os marcadores `[[figura f3]]`, `[[codigo B3]]`, `[[saida B3]]`, `[[quadro ambiente]]` etc. inserem figuras, código, saídas e tabelas; podem ser movidos, mas não renomeados.
4. As lacunas `{ano}`, `{sistema}`, `{repositorio}` etc. são preenchidas na geração.
5. Rode a tarefa **3. Só evidências + relatório** (segundos) e confira o PDF em `saida\`.
6. Faça commit no GitHub Desktop.

Se um marcador, lacuna ou negrito estiver errado, a geração para e informa a linha do `relatorio.md`. Números citados no texto devem continuar iguais aos da execução: a conferência automática verifica a execução, não o texto.

## Salvaguardas

- **Célula com erro ou figura ausente:** o pipeline para antes do relatório e aponta o arquivo em `evidencias\`. O erro deve ser documentado como Ocorrência, não escondido.
- **Números diferentes dos citados no texto:** o relatório cita resultados literais (9,00; 8,60; 7,80; 5,80...). O extrator confere esses valores na saída real; se divergirem, o pipeline para. Para gerar mesmo assim: `scripts\executar.ps1 -IgnorarDivergencias`.
- **Notebook entregue sem saídas:** o caminho interativo exige Run All e salvar antes da tarefa 3; o extrator recusa notebook não executado.

## Opções do `scripts\executar.ps1`

| Parâmetro | Efeito |
|---|---|
| `-PularExecucao` | usa as saídas já gravadas no .ipynb |
| `-SomenteNotebook` | só executa o notebook |
| `-IgnorarDivergencias` | gera o relatório mesmo com números diferentes do texto |
| `-SemPdf` | para no .docx |
