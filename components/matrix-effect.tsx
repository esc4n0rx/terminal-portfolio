"use client"

import { useEffect, useRef, useState } from "react"

interface MatrixEffectProps {
  onExit: () => void
}

export default function MatrixEffect({ onExit }: MatrixEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ajustar o canvas para o tamanho da tela
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Caracteres japoneses para o efeito Matrix
    const matrixChars = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    
    const fontSize = 16
    const columns = Math.floor(canvas.width / fontSize)
    
    // Array para armazenar a posição Y de cada coluna
    const drops: number[] = []
    
    // Inicializar as gotas
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * canvas.height / fontSize
    }

    const drawMatrix = () => {
      // Fundo preto semi-transparente para criar o efeito de rastro
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Texto verde brilhante
      ctx.fillStyle = "#0F0"
      ctx.font = `${fontSize}px monospace`
      
      // Loop através das colunas
      for (let i = 0; i < drops.length; i++) {
        // Escolher um caractere aleatório
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)]
        
        // Desenhar o caractere
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        
        // Resetar a gota ao final da tela com uma chance aleatória
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        
        // Mover a gota para baixo
        drops[i]++
      }
    }

    const animate = () => {
      drawMatrix()
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Controle de teclado para sair com Ctrl+C
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "c") {
        event.preventDefault()
        setIsVisible(false)
        setTimeout(() => {
          onExit()
        }, 500)
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", resizeCanvas)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onExit])

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      <div className="absolute top-4 left-4 text-green-400 text-sm z-10">
        <p>Matrix Mode Ativo</p>
        <p className="text-xs text-green-600">Pressione Ctrl+C para sair</p>
      </div>
    </div>
  )
}