// components/vim-editor.tsx
"use client"

import { useState, useEffect, useRef } from 'react'

interface VimEditorProps {
  filename: string
  initialContent?: string
  onSave: (filename: string, content: string) => void
  onExit: () => void
}

export default function VimEditor({ filename, initialContent = '', onSave, onExit }: VimEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [statusMessage, setStatusMessage] = useState(`Editando: ${filename}`)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showHelp, setShowHelp] = useState(true)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Focar no textarea quando o componente montar
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
    
    // Esconder help após 5 segundos
    const timer = setTimeout(() => {
      setShowHelp(false)
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [])

  // Detectar mudanças no conteúdo
  useEffect(() => {
    setHasUnsavedChanges(content !== initialContent)
  }, [content, initialContent])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl + S - Salvar
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault()
      onSave(filename, content)
      setStatusMessage(`✅ "${filename}" salvo com sucesso!`)
      setHasUnsavedChanges(false)
      setTimeout(() => {
        setStatusMessage(`Editando: ${filename}`)
      }, 2000)
    }
    
    // Ctrl + X - Sair
    else if (e.ctrlKey && e.key === 'x') {
      e.preventDefault()
      if (hasUnsavedChanges) {
        const confirmExit = window.confirm(
          'Você tem alterações não salvas. Deseja sair mesmo assim?'
        )
        if (confirmExit) {
          onExit()
        }
      } else {
        onExit()
      }
    }
    
    // Ctrl + O - Salvar e continuar editando
    else if (e.ctrlKey && e.key === 'o') {
      e.preventDefault()
      onSave(filename, content)
      setStatusMessage(`✅ "${filename}" salvo! Continuando edição...`)
      setHasUnsavedChanges(false)
      setTimeout(() => {
        setStatusMessage(`Editando: ${filename}`)
      }, 2000)
    }
    
    // Ctrl + Q - Sair sem salvar
    else if (e.ctrlKey && e.key === 'q') {
      e.preventDefault()
      const confirmExit = window.confirm(
        'Tem certeza que deseja sair sem salvar as alterações?'
      )
      if (confirmExit) {
        onExit()
      }
    }
    
    // Ctrl + H - Toggle help
    else if (e.ctrlKey && e.key === 'h') {
      e.preventDefault()
      setShowHelp(!showHelp)
    }
    
    // Ctrl + A - Selecionar tudo
    else if (e.ctrlKey && e.key === 'a') {
      e.preventDefault()
      if (textareaRef.current) {
        textareaRef.current.select()
      }
    }
    
    // Ctrl + Z - Undo (deixar comportamento padrão)
    else if (e.ctrlKey && e.key === 'z') {
      // Não prevenir - deixar o undo nativo funcionar
    }
    
    // Ctrl + Y - Redo (deixar comportamento padrão)
    else if (e.ctrlKey && e.key === 'y') {
      // Não prevenir - deixar o redo nativo funcionar
    }
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  const getLineCount = () => {
    return content.split('\n').length
  }

  const getCharCount = () => {
    return content.length
  }

  return (
    <div className="fixed inset-0 bg-black text-green-400 font-mono z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="font-bold">📝 VIM Editor</span>
          <span className="text-gray-300">{filename}</span>
          {hasUnsavedChanges && (
            <span className="text-yellow-400 text-sm">● Não salvo</span>
          )}
        </div>
        <button 
          onClick={() => setShowHelp(!showHelp)}
          className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
        >
          {showHelp ? 'Ocultar' : 'Mostrar'} Ajuda
        </button>
      </div>

      {/* Help Panel */}
      {showHelp && (
        <div className="bg-gray-800 text-white p-3 text-sm border-b border-gray-600">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="font-bold text-green-400">Salvar:</span>
              <div>Ctrl + S → Salvar</div>
              <div>Ctrl + O → Salvar e continuar</div>
            </div>
            <div>
              <span className="font-bold text-red-400">Sair:</span>
              <div>Ctrl + X → Sair</div>
              <div>Ctrl + Q → Sair sem salvar</div>
            </div>
            <div>
              <span className="font-bold text-blue-400">Edição:</span>
              <div>Ctrl + A → Selecionar tudo</div>
              <div>Ctrl + Z → Desfazer</div>
            </div>
            <div>
              <span className="font-bold text-purple-400">Outros:</span>
              <div>Ctrl + H → Toggle ajuda</div>
              <div>Ctrl + Y → Refazer</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex">
        {/* Line Numbers */}
        <div className="bg-gray-900 text-gray-500 text-right p-2 select-none min-w-[60px] border-r border-gray-700">
          {content.split('\n').map((_, index) => (
            <div key={index} className="leading-6 text-sm">
              {index + 1}
            </div>
          ))}
        </div>

        {/* Editor */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            placeholder={`Digite o conteúdo do arquivo ${filename}...`}
            className="w-full h-full bg-black text-green-400 font-mono resize-none outline-none border-none p-4 leading-6 text-sm"
            style={{ 
              minHeight: '100%',
              fontFamily: '"Courier New", "Consolas", monospace'
            }}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-800 text-white p-2 text-sm flex justify-between items-center border-t border-gray-600">
        <div className="flex items-center space-x-4">
          <span>{statusMessage}</span>
          {hasUnsavedChanges && (
            <span className="text-yellow-400">● Alterações não salvas</span>
          )}
        </div>
        <div className="flex items-center space-x-4 text-gray-400">
          <span>Linhas: {getLineCount()}</span>
          <span>Caracteres: {getCharCount()}</span>
          <span className="text-green-400">
            {filename.split('.').pop()?.toUpperCase() || 'TXT'}
          </span>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-gray-900 p-2 flex justify-center space-x-2 border-t border-gray-700">
        <button
          onClick={() => {
            onSave(filename, content)
            setStatusMessage(`✅ "${filename}" salvo!`)
            setHasUnsavedChanges(false)
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium"
        >
          💾 Salvar (Ctrl+S)
        </button>
        <button
          onClick={() => {
            onSave(filename, content)
            onExit()
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium"
        >
          💾➡️ Salvar e Sair (Ctrl+O → Ctrl+X)
        </button>
        <button
          onClick={() => {
            if (hasUnsavedChanges) {
              const confirmExit = window.confirm('Sair sem salvar?')
              if (confirmExit) onExit()
            } else {
              onExit()
            }
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium"
        >
          🚪 Sair (Ctrl+X)
        </button>
      </div>
    </div>
  )
}