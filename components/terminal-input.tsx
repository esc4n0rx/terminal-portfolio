"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface TerminalInputProps {
  onCommand: (command: string) => void
}

export default function TerminalInput({ onCommand }: TerminalInputProps) {
  const [input, setInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focar no input quando o componente montar
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onCommand(input)
      setCommandHistory([...commandHistory, input])
      setHistoryIndex(-1)
      setInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Navegação no histórico de comandos
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    }
  }

  // Garantir que o input sempre tenha foco quando clicar em qualquer lugar do terminal
  useEffect(() => {
    const handleWindowClick = () => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }

    window.addEventListener("click", handleWindowClick)
    return () => {
      window.removeEventListener("click", handleWindowClick)
    }
  }, [])

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <span className="mr-2 whitespace-nowrap">C:\Users\paulo.cunha&gt;</span>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent outline-none border-none caret-white"
        autoFocus
        autoComplete="off"
        spellCheck="false"
      />
    </form>
  )
}
