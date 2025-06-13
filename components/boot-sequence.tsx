"use client"

import { useState, useEffect } from "react"

interface BootSequenceProps {
  onComplete: () => void
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [text, setText] = useState("")
  const [currentLine, setCurrentLine] = useState(0)

  const bootLines = [
    "Microsoft Windows [versão 10.0.19045.5854]",
    "(c) Microsoft Corporation. Todos os direitos reservados.",
    "",
    "Paulo Oliveira DevOS v1.0.0 - Terminal Interativo Personalizado",
    "Booting system...",
    "Carregando módulos do desenvolvedor...",
    "Inicializando interface do terminal...",
    "Carregando projetos...",
    "Configurando ambiente...",
    "✔️ Ambiente carregado com sucesso!",
    "Usuário: paulooliveira",
    "Status do sistema: ✅ Online",
    'Digite "help" para ver os comandos disponíveis.',
  ]

  useEffect(() => {
    if (currentLine < bootLines.length) {
      const timer = setTimeout(
        () => {
          setText((prev) => prev + bootLines[currentLine] + "\n")
          setCurrentLine((prev) => prev + 1)
        },
        currentLine === 0 ? 500 : Math.random() * 300 + 100,
      )

      return () => clearTimeout(timer)
    } else {
      // Sequência de boot completa
      const timer = setTimeout(() => {
        onComplete()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [currentLine, bootLines, onComplete])

  return (
    <pre className="whitespace-pre-line">
      {text}
      {currentLine < bootLines.length && <span className="animate-pulse">▋</span>}
    </pre>
  )
}
