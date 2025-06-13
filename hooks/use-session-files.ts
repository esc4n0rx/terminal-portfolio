// hooks/use-session-files.ts
"use client"

import { useState, useCallback, useEffect } from 'react'
import { FileItem } from '@/lib/filesystem'

export const useSessionFiles = () => {
  const [sessionFiles, setSessionFiles] = useState<Record<string, FileItem>>({})

  // Carregar arquivos salvos do localStorage quando o componente montar
  useEffect(() => {
    try {
      const savedFiles = localStorage.getItem('vim-session-files')
      if (savedFiles) {
        setSessionFiles(JSON.parse(savedFiles))
      }
    } catch (error) {
      console.error('Erro ao carregar arquivos da sessão:', error)
    }
  }, [])

  // Salvar no localStorage sempre que sessionFiles mudar
  useEffect(() => {
    try {
      localStorage.setItem('vim-session-files', JSON.stringify(sessionFiles))
    } catch (error) {
      console.error('Erro ao salvar arquivos da sessão:', error)
    }
  }, [sessionFiles])

  const saveFile = useCallback((filename: string, content: string) => {
    const extension = filename.split('.').pop() || 'txt'
    const file: FileItem = {
      name: filename,
      type: 'file',
      size: new Blob([content]).size, // Tamanho mais preciso
      extension,
      content,
    }
    
    setSessionFiles(prev => ({
      ...prev,
      [filename]: file
    }))
    
    return file
  }, [])

  const getFile = useCallback((filename: string): FileItem | null => {
    return sessionFiles[filename] || null
  }, [sessionFiles])

  const deleteFile = useCallback((filename: string) => {
    setSessionFiles(prev => {
      const newFiles = { ...prev }
      delete newFiles[filename]
      return newFiles
    })
  }, [])

  const listSessionFiles = useCallback((): FileItem[] => {
    return Object.values(sessionFiles)
  }, [sessionFiles])

  const clearAllFiles = useCallback(() => {
    setSessionFiles({})
    localStorage.removeItem('vim-session-files')
  }, [])

  return {
    saveFile,
    getFile,
    deleteFile,
    listSessionFiles,
    clearAllFiles,
    sessionFiles
  }
}