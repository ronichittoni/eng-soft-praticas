# Pipeline: executa o notebook, extrai as evidências, gera o relatório .docx e o PDF.
param(
    [switch]$PularExecucao,       # usa as saídas já gravadas no .ipynb (rodado no VS Code com Run All + salvar)
    [switch]$SomenteNotebook,     # só executa o notebook
    [switch]$IgnorarDivergencias, # gera o relatório mesmo se os números diferirem dos citados no texto
    [switch]$SemPdf
)
$ErrorActionPreference = 'Stop'
$Raiz = Split-Path -Parent $PSScriptRoot
Set-Location $Raiz
$env:PYTHONUTF8 = '1'
$env:PYTHONIOENCODING = 'utf-8'
[Console]::OutputEncoding = [Text.Encoding]::UTF8

$VPy = Join-Path $Raiz '.venv\Scripts\python.exe'
$Nb = 'notebook\U3_A2_Redes_Neurais_XOR.ipynb'
if (-not (Test-Path $VPy)) { throw 'Ambiente não preparado. Rode antes a tarefa "1. Preparar ambiente" (scripts\setup.ps1).' }
New-Item build -ItemType Directory -Force | Out-Null

# Etapa 1: ambiente do host (vai para o Quadro 1 e a folha de identificação)
$os = Get-CimInstance Win32_OperatingSystem
$cs = Get-CimInstance Win32_ComputerSystem
$cpu = (Get-CimInstance Win32_Processor | Select-Object -First 1).Name
$commit = $null
if (Get-Command git -ErrorAction SilentlyContinue) { $commit = (& git rev-parse --short HEAD 2>$null) }
$vs = $null
if ($env:TERM_PROGRAM -eq 'vscode' -and $env:TERM_PROGRAM_VERSION) { $vs = $env:TERM_PROGRAM_VERSION }
elseif (Get-Command code -ErrorAction SilentlyContinue) { $vs = (& code --version 2>$null | Select-Object -First 1) }
if (-not $vs) { $vs = $null }
[ordered]@{
    windows = ("$($os.Caption) $($os.Version)" -replace '^Microsoft ', '').Trim()
    vscode  = $vs
    data    = (Get-Date -Format 'yyyy-MM-dd')
    equipamento = ("$($cs.Manufacturer) $($cs.Model)").Trim()
    cpu     = if ($cpu) { $cpu.Trim() } else { $null }
    ram_gb  = [math]::Round($cs.TotalPhysicalMemory / 1GB)
    commit  = $commit
} | ConvertTo-Json | Set-Content 'build\ambiente_host.json' -Encoding UTF8

# Etapa 2: execução do notebook (as saídas ficam gravadas no próprio .ipynb, visíveis no VS Code)
if (-not $PularExecucao) {
    Write-Host '[1/4] Executando o notebook...' -ForegroundColor Cyan
    & $VPy -m nbconvert --to notebook --execute --inplace --allow-errors `
        --ExecutePreprocessor.kernel_name=u3a2 --ExecutePreprocessor.timeout=600 $Nb
    if ($LASTEXITCODE -ne 0) { throw "nbconvert falhou (código $LASTEXITCODE)" }
} else {
    Write-Host '[1/4] Execução pulada: usando as saídas gravadas no notebook' -ForegroundColor Yellow
}
if ($SomenteNotebook) { Write-Host "Notebook executado: $Nb"; exit 0 }

# Etapa 3: evidências
Write-Host '[2/4] Extraindo evidências...' -ForegroundColor Cyan
& $VPy 'scripts\extrair_evidencias.py' $Nb
switch ($LASTEXITCODE) {
    0 { }
    2 { throw 'Há células com erro ou figuras ausentes. Veja evidencias\<célula>_saida.txt; o erro deve virar Ocorrência no relatório antes de gerá-lo.' }
    3 { if (-not $IgnorarDivergencias) { throw 'Resultados diferentes dos citados no texto do relatório. Revise o texto (scripts\gerar_relatorio.js) ou rode com -IgnorarDivergencias.' } }
    default { throw "extrair_evidencias.py terminou com código $LASTEXITCODE" }
}

# Etapa 4: relatório Word
if (-not (Get-Command node -ErrorAction SilentlyContinue) -or -not (Test-Path 'node_modules\docx')) {
    Write-Warning 'Node.js ou a biblioteca docx ausentes: evidências prontas em .\evidencias, relatório não gerado. Rode a tarefa 1 após instalar o Node.'
    exit 0
}
Write-Host '[3/4] Gerando o relatório .docx...' -ForegroundColor Cyan
& node 'scripts\gerar_relatorio.js'
if ($LASTEXITCODE -ne 0) { throw "gerar_relatorio.js falhou (código $LASTEXITCODE)" }
$Docx = Join-Path $Raiz 'saida\Relatorio_Aula_Pratica_Redes_Neurais_XOR_U3A2_Roni_Chittoni.docx'

# Etapa 5: PDF
if ($SemPdf) { Write-Host "Relatório: $Docx"; exit 0 }
Write-Host '[4/4] Convertendo para PDF...' -ForegroundColor Cyan
& (Join-Path $PSScriptRoot 'docx_para_pdf.ps1') -Docx $Docx

Write-Host "`nConcluído. Arquivos em: $(Join-Path $Raiz 'saida')" -ForegroundColor Green
