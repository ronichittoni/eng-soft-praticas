# Prepara o ambiente: .venv com as bibliotecas do notebook, kernel Jupyter dedicado e biblioteca docx (Node).
$ErrorActionPreference = 'Stop'
$Raiz = Split-Path -Parent $PSScriptRoot
Set-Location $Raiz

function Confere($etapa) { if ($LASTEXITCODE -ne 0) { throw "Falhou: $etapa (código $LASTEXITCODE)" } }

# 1. Python 3.10+ (ignora o atalho da Microsoft Store, que não é um Python instalado)
$py = $null
if (Get-Command py -ErrorAction SilentlyContinue) { $py = @{ Exe = 'py'; Args = @('-3') } }
else {
    $c = Get-Command python -ErrorAction SilentlyContinue
    if ($c -and $c.Source -notlike '*WindowsApps*') { $py = @{ Exe = 'python'; Args = @() } }
}
if (-not $py) { throw 'Python não encontrado. Instale o Python 3.12 (python.org ou: winget install Python.Python.3.12) e reabra o VS Code.' }
$ver = [int](& $py.Exe @($py.Args + @('-c', 'import sys; print(sys.version_info[0]*100+sys.version_info[1])')))
if ($ver -lt 310) { throw "Python $([math]::Floor($ver/100)).$($ver%100) encontrado; o pipeline exige 3.10 ou superior." }
Write-Host "Python OK ($([math]::Floor($ver/100)).$($ver%100))" -ForegroundColor Green

# 2. Ambiente virtual e bibliotecas
if (-not (Test-Path '.venv\Scripts\python.exe')) {
    Write-Host 'Criando .venv...'
    & $py.Exe @($py.Args + @('-m', 'venv', '.venv')); Confere 'criação do .venv'
}
$VPy = Join-Path $Raiz '.venv\Scripts\python.exe'
& $VPy -m pip install --upgrade pip --quiet; Confere 'atualização do pip'
& $VPy -m pip install -r requirements.txt --quiet; Confere 'instalação das bibliotecas'
& $VPy -m ipykernel install --sys-prefix --name u3a2 --display-name 'Python (.venv U3A2)' | Out-Null; Confere 'registro do kernel'
Write-Host 'Bibliotecas Python e kernel "Python (.venv U3A2)" OK' -ForegroundColor Green

# 3. Node.js + docx (só para gerar o relatório Word)
if (Get-Command node -ErrorAction SilentlyContinue) {
    & npm install --no-audit --no-fund --loglevel=error; Confere 'npm install'
    Write-Host "Node $(node --version) e docx OK" -ForegroundColor Green
} else {
    Write-Warning 'Node.js não encontrado: o notebook e as evidências funcionam, mas o relatório Word não será gerado. Instale com: winget install OpenJS.NodeJS.LTS (depois reabra o VS Code e rode esta tarefa de novo).'
}

# 4. Conversor de PDF
$temWord = $false
try { $w = New-Object -ComObject Word.Application; $w.Quit(); $temWord = $true } catch { }
if ($temWord) { Write-Host 'Microsoft Word disponível para gerar o PDF' -ForegroundColor Green }
elseif ((Get-Command soffice -ErrorAction SilentlyContinue) -or (Test-Path "$env:ProgramFiles\LibreOffice\program\soffice.exe")) { Write-Host 'LibreOffice disponível para gerar o PDF' -ForegroundColor Green }
else { Write-Warning 'Nem Word nem LibreOffice encontrados: o PDF terá de ser exportado manualmente a partir do .docx.' }

Write-Host "`nAmbiente pronto. Próximo passo: Ctrl+Shift+B (pipeline completo)." -ForegroundColor Cyan
