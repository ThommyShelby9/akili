import { useEffect, useRef, useState } from 'react'

/**
 * Terminal animé qui tape progressivement les commandes simulées.
 * Props:
 *   - commands: [{ type, text }]
 *   - durationMs: durée totale cible (synchro avec l'API)
 *   - title: titre de la fenêtre
 *   - onDone: callback à la fin de l'animation
 */
export default function ScriptTerminal({ commands, durationMs = 2000, title = 'akili — bash', onDone }) {
  const [lines, setLines] = useState([])
  const [typing, setTyping] = useState('')
  const [done, setDone] = useState(false)
  const bodyRef = useRef(null)

  useEffect(() => {
    if (!commands || commands.length === 0) return

    let cancelled = false
    const totalChars = commands.reduce((s, c) => s + c.text.length, 0)
    // Vitesse de frappe (ms/char) — légère randomisation
    const baseSpeed = Math.max(8, Math.min(35, durationMs / Math.max(totalChars, 1)))

    async function play() {
      for (let i = 0; i < commands.length; i++) {
        if (cancelled) return
        const cmd = commands[i]

        // Typewriter pour les lignes de commande
        if (cmd.type === 'cmd') {
          for (let j = 0; j <= cmd.text.length; j++) {
            if (cancelled) return
            setTyping(cmd.text.slice(0, j))
            await sleep(baseSpeed + Math.random() * 10)
          }
          setLines(prev => [...prev, cmd])
          setTyping('')
          await sleep(120)
        } else {
          // Output: apparaît d'un coup avec un petit délai
          await sleep(180 + Math.random() * 220)
          if (cancelled) return
          setLines(prev => [...prev, cmd])
        }
      }
      setDone(true)
      onDone?.()
    }

    play()
    return () => { cancelled = true }
  }, [commands])

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [lines, typing])

  return (
    <div className="script-terminal">
      <div className="script-terminal-titlebar">
        <span className="script-terminal-dot red" />
        <span className="script-terminal-dot yellow" />
        <span className="script-terminal-dot green" />
        <span className="script-terminal-title">{title}</span>
      </div>
      <div className="script-terminal-body" ref={bodyRef}>
        {lines.map((line, idx) => (
          <Line key={idx} line={line} />
        ))}
        {typing && (
          <div className="script-terminal-line cmd">
            <span className="script-terminal-prompt">$</span>
            <span className="script-terminal-text">
              {typing}
              <span className="script-terminal-caret">▋</span>
            </span>
          </div>
        )}
        {done && (
          <div className="script-terminal-line cmd">
            <span className="script-terminal-prompt">$</span>
            <span className="script-terminal-caret blink">▋</span>
          </div>
        )}
      </div>
    </div>
  )
}

function Line({ line }) {
  if (line.type === 'cmd') {
    return (
      <div className="script-terminal-line cmd">
        <span className="script-terminal-prompt">$</span>
        <span className="script-terminal-text">{line.text}</span>
      </div>
    )
  }
  return (
    <div className={`script-terminal-line ${line.type}`}>
      <span className="script-terminal-text">{line.text}</span>
    </div>
  )
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms))
}
