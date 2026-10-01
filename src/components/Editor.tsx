import CodeMirror from '@uiw/react-codemirror'
import { cpp } from '@codemirror/lang-cpp'
import { EditorView } from '@codemirror/view'
import { Prec } from '@codemirror/state'
import { useMemo } from 'react'
import { useProgress } from '../lib/store'

export default function Editor({
  value,
  onChange,
  fontSize,
  onRun,
}: {
  value: string
  onChange: (v: string) => void
  fontSize: number
  onRun?: () => void
}) {
  const { p } = useProgress()
  const ext = useMemo(
    () => [
      cpp(),
      EditorView.theme({
        '&': { fontSize: `${fontSize}px` },
        '.cm-content': { padding: '12px 0' },
      }),
      Prec.highest(
        EditorView.domEventHandlers({
          keydown: (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault()
              onRun?.()
              return true
            }
            return false
          },
        }),
      ),
    ],
    [fontSize, onRun],
  )
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      theme={p.theme}
      extensions={ext}
      height="100%"
      className="h-full"
      basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: true, autocompletion: false, indentOnInput: true }}
      aria-label="C code editor"
    />
  )
}
