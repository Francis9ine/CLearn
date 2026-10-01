import { EXEC_CONFIG } from '../config'

export interface RunResult {
  stdout: string
  stderr: string
  compileError: string
  mode: 'judge0' | 'mock'
}

let apiDown = false
const b64 = (s: string) => btoa(String.fromCharCode(...new TextEncoder().encode(s)))
const unb64 = (s: string | null) =>
  s ? new TextDecoder().decode(Uint8Array.from(atob(s), (c) => c.charCodeAt(0))) : ''

async function runJudge0(source: string, stdin: string): Promise<RunResult> {
  const ctl = new AbortController()
  const timer = setTimeout(() => ctl.abort(), EXEC_CONFIG.timeoutMs)
  try {
    const res = await fetch(
      `${EXEC_CONFIG.endpoint}/submissions?base64_encoded=true&wait=true&fields=stdout,stderr,compile_output,status,message`,
      {
        method: 'POST',
        signal: ctl.signal,
        headers: { 'Content-Type': 'application/json', ...EXEC_CONFIG.headers },
        body: JSON.stringify({
          language_id: EXEC_CONFIG.languageId,
          source_code: b64(source),
          stdin: b64(stdin),
        }),
      },
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const d = await res.json()
    const compileError = unb64(d.compile_output)
    const stderr = unb64(d.stderr) || unb64(d.message)
    const statusId = d.status?.id
    return {
      stdout: unb64(d.stdout),
      stderr: statusId === 6 ? '' : stderr || (statusId > 4 && statusId !== 6 ? d.status?.description : ''),
      compileError: statusId === 6 ? compileError : '',
      mode: 'judge0',
    }
  } finally {
    clearTimeout(timer)
  }
}

/* ---------- Mock mode: clearly labelled approximation ---------- */
export interface MockHint {
  tests: { input: string; output: string }[]
  keywords: string[]
}

function balanced(src: string) {
  const clean = src.replace(/\/\/.*|\/\*[\s\S]*?\*\/|"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/g, '')
  const stack: string[] = []
  const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' }
  const lines = clean.split('\n')
  for (let i = 0; i < lines.length; i++) {
    for (const ch of lines[i]) {
      if ('([{'.includes(ch)) stack.push(ch)
      else if (pairs[ch]) {
        if (stack.pop() !== pairs[ch]) return `main.c:${i + 1}: error: unexpected '${ch}'`
      }
    }
  }
  return stack.length ? `main.c: error: expected '${stack[stack.length - 1] === '{' ? '}' : stack[stack.length - 1] === '(' ? ')' : ']'}' before end of file` : ''
}

function literalPrintf(src: string) {
  const out: string[] = []
  const re = /printf\s*\(\s*"((?:\\.|[^"\\])*)"/g
  let m
  while ((m = re.exec(src))) {
    out.push(
      m[1]
        .replace(/%[-+ 0#]*\d*(?:\.\d+)?(?:l|ll|h)?[dicsfuxXp]/g, '?')
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\'),
    )
  }
  return out.join('')
}

function mockRun(source: string, stdin: string, hint?: MockHint): RunResult {
  const base = { stderr: '', mode: 'mock' as const }
  if (!/\bmain\s*\(/.test(source))
    return { ...base, stdout: '', compileError: "undefined reference to `main'\ncollect2: error: ld returned 1 exit status" }
  const bal = balanced(source)
  if (bal) return { ...base, stdout: '', compileError: bal }
  if (hint) {
    const ok = hint.keywords.every((k) => new RegExp(k).test(source))
    const t = hint.tests.find((x) => x.input.trim() === stdin.trim())
    if (ok && t) return { ...base, stdout: t.output, compileError: '' }
    return { ...base, stdout: ok ? '' : literalPrintf(source), compileError: '' }
  }
  return { ...base, stdout: literalPrintf(source), compileError: '' }
}

/**
 * Single entry point for compiling and running C.
 * `mockHint` is only used if the real API is unavailable.
 */
export async function runCode(sourceCode: string, stdin: string, mockHint?: MockHint): Promise<RunResult> {
  if (EXEC_CONFIG.mode !== 'mock' && !apiDown) {
    try {
      return await runJudge0(sourceCode, stdin)
    } catch {
      if (EXEC_CONFIG.mode === 'auto') apiDown = true
      else throw new Error('Execution service unreachable')
    }
  }
  await new Promise((r) => setTimeout(r, 350))
  return mockRun(sourceCode, stdin, mockHint)
}

export function retryExecutionService() {
  apiDown = false
}
