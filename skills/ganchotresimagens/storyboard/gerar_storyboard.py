#!/usr/bin/env python3
"""Gera um storyboard visual (um único arquivo HTML, imagens embutidas) a partir de um JSON.

Uso: python3 gerar_storyboard.py storyboard.json storyboard.html

JSON:
{
  "titulo": "Storyboard: nome do vídeo",
  "resumo": ["Duração final: 0:21", "Começa em: ...", "Termina em: ..."],
  "partes": [
    {"nome": "Parte 1: notícia", "cenas": [
      {"imagem": "quadros/cena-01.jpg", "tempo": "0:00 – 0:04", "titulo": "Abertura",
       "texto": "O que se ouve ou a legenda", "nota": "opcional", "confira": false}
    ]}
  ],
  "cortes": [{"tempo": "0:00.0 → 0:05.9", "texto": "...", "confira": false}],
  "observacoes": ["..."]
}
"""
import base64, html, json, mimetypes, os, sys

def img_tag(caminho, base):
    p = caminho if os.path.isabs(caminho) else os.path.join(base, caminho)
    mime = mimetypes.guess_type(p)[0] or "image/jpeg"
    with open(p, "rb") as f:
        dados = base64.b64encode(f.read()).decode()
    return f'<img src="data:{mime};base64,{dados}" alt="">'

def e(t):
    return html.escape(str(t or ""))

def main(entrada, saida):
    base = os.path.dirname(os.path.abspath(entrada))
    d = json.load(open(entrada, encoding="utf-8"))
    n = 0
    partes = []
    for parte in d.get("partes", []):
        cards = []
        for c in parte.get("cenas", []):
            n += 1
            conf = ' <span class="conf">CONFIRA</span>' if c.get("confira") else ""
            nota = f'<p class="nota">{e(c.get("nota"))}</p>' if c.get("nota") else ""
            cards.append(
                f'<figure class="cena">{img_tag(c["imagem"], base)}'
                f'<figcaption><div class="topo"><span class="num">{n}</span><span class="tempo">{e(c.get("tempo"))}</span></div>'
                f'<strong>{e(c.get("titulo"))}</strong>{conf}<p>{e(c.get("texto"))}</p>{nota}</figcaption></figure>'
            )
        partes.append(f'<section><h2>{e(parte.get("nome"))}</h2><div class="grade">{"".join(cards)}</div></section>')
    cortes = "".join(
        f'<li><span class="tempo">{e(c.get("tempo"))}</span> {e(c.get("texto"))}'
        + (' <span class="conf">CONFIRA</span>' if c.get("confira") else "") + "</li>"
        for c in d.get("cortes", [])
    )
    obs = "".join(f"<li>{e(o)}</li>" for o in d.get("observacoes", []))
    resumo = "".join(f"<li>{e(r)}</li>" for r in d.get("resumo", []))
    pagina = f"""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>{e(d.get("titulo","Storyboard"))}</title>
<style>
body{{margin:0;background:#fff;color:#1d1d1f;font:16px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}}
main{{max-width:1200px;margin:0 auto;padding:24px 16px 64px}}
h1{{font-size:28px;margin:0 0 8px}} h2{{font-size:20px;margin:32px 0 12px;color:#7a1f3d}}
ul.resumo{{list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:8px 20px;color:#555}}
.grade{{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px}}
.cena{{margin:0;border:1px solid #e5e5ea;border-radius:12px;overflow:hidden;background:#fafafa}}
.cena img{{display:block;width:100%;aspect-ratio:9/16;object-fit:cover;background:#000}}
figcaption{{padding:10px 12px 12px;font-size:14px}} figcaption p{{margin:6px 0 0}}
.topo{{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}}
.num{{background:#7a1f3d;color:#fff;border-radius:999px;padding:1px 9px;font-weight:700;font-size:13px}}
.tempo{{font-variant-numeric:tabular-nums;color:#666;font-size:13px}}
.nota{{color:#666;font-size:13px}}
.conf{{background:#ffd60a;color:#000;font-weight:700;font-size:12px;border-radius:4px;padding:1px 6px}}
ol,ul.obs{{padding-left:20px}} li{{margin:6px 0}}
</style></head><body><main>
<h1>{e(d.get("titulo","Storyboard"))}</h1><ul class="resumo">{resumo}</ul>
{"".join(partes)}
{f'<section><h2>Cortes</h2><ol>{cortes}</ol></section>' if cortes else ''}
{f'<section><h2>Observações</h2><ul class="obs">{obs}</ul></section>' if obs else ''}
</main></body></html>"""
    with open(saida, "w", encoding="utf-8") as f:
        f.write(pagina)
    print(f"Storyboard com {n} cenas salvo em {saida}")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
