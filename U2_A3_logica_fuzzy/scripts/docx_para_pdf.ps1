# Converte o .docx em PDF: Microsoft Word (preferencial) ou LibreOffice.
param([Parameter(Mandatory = $true)][string]$Docx)
$ErrorActionPreference = 'Stop'
$Docx = (Resolve-Path $Docx).Path
$Pdf = [IO.Path]::ChangeExtension($Docx, '.pdf')

$word = $null
try { $word = New-Object -ComObject Word.Application } catch { }
if ($word) {
    try {
        $word.Visible = $false
        $word.DisplayAlerts = 0
        $doc = $word.Documents.Open($Docx, $false, $true)
        $doc.SaveAs2($Pdf, 17)   # 17 = wdFormatPDF
        $doc.Close($false)
    } finally {
        $word.Quit()
        [void][Runtime.InteropServices.Marshal]::ReleaseComObject($word)
    }
    Write-Host "PDF gerado pelo Word: $Pdf" -ForegroundColor Green
    exit 0
}

$so = Get-Command soffice -ErrorAction SilentlyContinue
if (-not $so -and (Test-Path "$env:ProgramFiles\LibreOffice\program\soffice.exe")) { $so = "$env:ProgramFiles\LibreOffice\program\soffice.exe" }
if ($so) {
    & $so --headless --convert-to pdf --outdir (Split-Path $Docx) $Docx | Out-Null
    if (Test-Path $Pdf) { Write-Host "PDF gerado pelo LibreOffice: $Pdf" -ForegroundColor Green; exit 0 }
}
Write-Warning "Não foi possível gerar o PDF automaticamente. Abra $Docx no Word e use Arquivo > Exportar > PDF."
