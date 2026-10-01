const KW = /^(if|else|for|while|do|switch|case|default|break|continue|return|goto|sizeof|typedef|struct|union|enum|static|extern|register|auto|const|volatile)$/
const TY = /^(int|char|float|double|void|long|short|signed|unsigned|FILE|size_t|va_list|NULL|bool)$/
const RE = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(^[ \t]*#[^\n]*)|(\b0x[0-9a-fA-F]+\b|\b\d+(?:\.\d+)?[fFuUlL]*\b)|([A-Za-z_]\w*)/gm

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function highlightC(code: string): string {
  let out = ''
  let last = 0
  for (const m of code.matchAll(RE)) {
    out += esc(code.slice(last, m.index))
    const [txt, com, str, pre, num, id] = m
    const cls = com ? 'c' : str ? 's' : pre ? 'p' : num ? 'n' : KW.test(id!) ? 'k' : TY.test(id!) ? 't' : ''
    out += cls ? `<span class="tok-${cls}">${esc(txt)}</span>` : esc(txt)
    last = m.index! + txt.length
  }
  return out + esc(code.slice(last))
}
