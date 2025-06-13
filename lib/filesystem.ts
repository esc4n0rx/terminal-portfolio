// lib/filesystem.ts
export interface FileItem {
  name: string
  type: 'file' | 'directory'
  size?: number
  extension?: string
  downloadUrl?: string
  content?: string
}

export const publicFiles: Record<string, FileItem[]> = {
  cv: [
    {
      name: 'Paulo_Oliveira_CV_2025.pdf',
      type: 'file',
      size: 245760, // 240KB
      extension: 'pdf',
      downloadUrl: '/cv/Paulo_Oliveira_CV_2024.pdf'
    },
    {
      name: 'Paulo_Oliveira_CV_2025.docx',
      type: 'file',
      size: 1048576, // 1MB
      extension: 'docx',
      downloadUrl: '/cv/Paulo_Oliveira_CV_2025.docx'
    }
  ],
  documents: [
    {
      name: 'README.md',
      type: 'file',
      size: 2048,
      extension: 'md',
      content: '# Documentos do Paulo\n\nEste é um exemplo de arquivo markdown.'
    },
    {
      name: 'notas.txt',
      type: 'file',
      size: 512,
      extension: 'txt',
      content: 'Algumas anotações importantes:\n\n- Estudar React Query\n- Implementar testes unitários\n- Revisar arquitetura do projeto'
    }
  ]
}

export const formatFileSize = (bytes: number): string => {
  const sizes = ['B', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 B'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

export const getFileIcon = (extension: string): string => {
  const icons: Record<string, string> = {
    pdf: '📄',
    txt: '📝',
    md: '📋',
    js: '⚡',
    ts: '🔷',
    json: '⚙️',
    css: '🎨',
    html: '🌐',
    default: '📄'
  }
  return icons[extension] || icons.default
}