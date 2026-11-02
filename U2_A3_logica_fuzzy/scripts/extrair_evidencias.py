"""Extrai as evidências do notebook executado (saídas de texto, figuras PNG e ambiente)
e grava build/conteudo.json para o gerador do relatório.

Uso: python scripts/extrair_evidencias.py [caminho_do_ipynb]
Códigos de saída: 0 ok; 2 alguma célula terminou em erro; 3 resultados divergem do texto do relatório.
"""
import base64, json, re, struct, sys, textwrap
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
NB = Path(sys.argv[1]) if len(sys.argv) > 1 else RAIZ / "notebook" / "U2_A3_Avaliacao_Qualidade_Atendimento.ipynb"
EVID = RAIZ / "evidencias"
BUILD = RAIZ / "build"
LARG = 86
ANSI = re.compile(r"\x1b\[[0-9;]*m")

# Valores que o texto do relatório cita literalmente. Se mudarem, o texto precisa ser revisto.
ESPERADOS = {
    "A5": ["Qualidade final: 9.00/10", "Qualidade final: 6.00/10", "Qualidade final: 2.00/10", "Qualidade final: 8.60/10"],
    "B1": ["11 |   0.90 |      0.90", "25 |   0.00 |  0.50 |  0.00 | 0.50"],
    "B2": ["15.1 |             7.98 |             7.00"],
    "B3": ["20.1 |   8.0 |                     ruim |         7.00"],
    "B4": ["1 |     8 |     9 |                9.00 |                         7.80"],
    "B5": ["28 |     9 |               4.00 |                  5.80"],
}


def quebrar(linhas):
    out = []
    for l in linhas:
        l = l.rstrip("\r\n")
        if len(l) <= LARG:
            out.append(l)
            continue
        ind = len(l) - len(l.lstrip(" "))
        partes = textwrap.wrap(l, width=LARG, subsequent_indent=" " * (ind + 8),
                               break_long_words=False, break_on_hyphens=False, drop_whitespace=False)
        out.extend(partes or [l])
    return out


def tag_da_celula(src):
    m = re.match(r"#\s*(A0|B\d|Célula \d)", src.splitlines()[0] if src else "")
    return m.group(1).replace("Célula ", "A") if m else None


def dimensoes_png(dados):
    return struct.unpack(">II", dados[16:24])


def main():
    if not NB.exists():
        sys.exit(f"Notebook não encontrado: {NB}")
    EVID.mkdir(exist_ok=True)
    BUILD.mkdir(exist_ok=True)
    for f in EVID.glob("*"):
        f.unlink()

    nb = json.loads(NB.read_text(encoding="utf-8"))
    codigo, saidas, figuras, erros = {}, {}, {}, []
    executadas = 0

    for c in nb["cells"]:
        if c["cell_type"] != "code":
            continue
        src = "".join(c["source"]) if isinstance(c["source"], list) else c["source"]
        tag = tag_da_celula(src)
        if not tag:
            continue
        if c.get("execution_count"):
            executadas += 1
        codigo[tag] = quebrar(src.splitlines())
        texto, n_fig = [], 0
        for o in c.get("outputs", []):
            tipo = o.get("output_type")
            if tipo == "stream":
                t = o["text"]
                texto.append("".join(t) if isinstance(t, list) else t)
            elif tipo in ("execute_result", "display_data"):
                dados = o.get("data", {})
                if "image/png" in dados:
                    n_fig += 1
                    b = dados["image/png"]
                    png = base64.b64decode("".join(b) if isinstance(b, list) else b)
                    nome = f"{tag}_fig{n_fig}.png"
                    (EVID / nome).write_bytes(png)
                    figuras[nome] = dimensoes_png(png)
                elif tipo == "execute_result" and "text/plain" in dados:
                    t = dados["text/plain"]
                    texto.append(("".join(t) if isinstance(t, list) else t) + "\n")
            elif tipo == "error":
                erros.append(tag)
                texto.append(ANSI.sub("", "\n".join(o.get("traceback", []))) + "\n")
        bruto = "".join(texto).rstrip("\n")
        (EVID / f"{tag}_saida.txt").write_text(bruto + "\n", encoding="utf-8")
        saidas[tag] = quebrar(bruto.splitlines()) if bruto else []

    if executadas == 0:
        sys.exit("O notebook não tem células executadas. Rode-o (VS Code: Run All e salvar) ou use executar.ps1 sem -PularExecucao.")

    ambiente = {}
    for linha in saidas.get("A0", []):
        if ":" in linha:
            k, v = linha.split(":", 1)
            ambiente[k.strip()] = v.strip()
    host = BUILD / "ambiente_host.json"
    if host.exists():
        ambiente.update(json.loads(host.read_text(encoding="utf-8-sig")))

    faltando = sorted(set(["A0", "A5", "A6", "B1", "B2", "B3", "B4", "B5"]) - set(saidas))
    figs_necessarias = ["A6_fig1.png", "B2_fig1.png", "B3_fig1.png", "B4_fig1.png", "B5_fig1.png"]
    figs_faltando = [f for f in figs_necessarias if f not in figuras]

    divergencias = []
    for tag, trechos in ESPERADOS.items():
        texto = (EVID / f"{tag}_saida.txt").read_text(encoding="utf-8") if (EVID / f"{tag}_saida.txt").exists() else ""
        for t in trechos:
            if t not in texto:
                divergencias.append(f"{tag}: esperado '{t.strip()}'")

    json.dump({"codigo": codigo, "saidas": saidas, "figuras": figuras, "ambiente": ambiente},
              (BUILD / "conteudo.json").open("w", encoding="utf-8"), ensure_ascii=False, indent=1)

    print(f"Células com tag: {len(codigo)} | executadas: {executadas} | figuras: {len(figuras)}")
    for k, v in ambiente.items():
        print(f"  {k}: {v}")
    if faltando:
        print("AVISO: células sem saída registrada:", ", ".join(faltando))
    if figs_faltando:
        print("ERRO: figuras ausentes:", ", ".join(figs_faltando))
        sys.exit(2)
    if erros:
        print("ERRO: células terminaram em exceção:", ", ".join(erros), "(ver evidencias/<tag>_saida.txt)")
        sys.exit(2)
    if divergencias:
        print("ATENÇÃO: resultados diferentes dos citados no texto do relatório:")
        for d in divergencias:
            print("  ", d)
        sys.exit(3)
    print("Evidências conferidas contra o texto do relatório: OK")


if __name__ == "__main__":
    main()
