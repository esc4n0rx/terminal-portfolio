"use client"

import { useEffect, useRef } from "react"

interface ThanosEffectProps {
  onComplete: () => void
}

export default function ThanosEffect({ onComplete }: ThanosEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Configurar o canvas para ocupar toda a tela
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Obter o conteúdo do terminal
    const terminalContent = document.querySelector(".terminal-content") as HTMLElement
    if (!terminalContent) {
      onComplete()
      return
    }

    // Criar partículas baseadas no texto e elementos do terminal
    const particles: {
      x: number
      y: number
      size: number
      color: string
      vx: number
      vy: number
      alpha: number
      delay: number
    }[] = []

    // Função para criar partículas a partir de um elemento
    const createParticlesFromElement = (element: Node, depth = 0) => {
      // Verificar se é um nó de texto
      if (element.nodeType === Node.TEXT_NODE) {
        if (element.textContent && element.textContent.trim().length > 0 && element.parentElement) {
          const text = element.textContent.trim()
          const parentElement = element.parentElement
          const parentStyle = window.getComputedStyle(parentElement)
          const fontSize = Number.parseInt(parentStyle.fontSize) || 16
          const color = parentStyle.color || "#ffffff"
          const rect = parentElement.getBoundingClientRect()

          // Estimar a largura de cada caractere (aproximação)
          const charWidth = fontSize * 0.6

          for (let i = 0; i < text.length; i++) {
            if (text[i] === " ") continue

            // Posição estimada de cada caractere
            const x = rect.left + i * charWidth
            const y = rect.top

            // Criar várias partículas para cada caractere
            const particleCount = Math.max(3, Math.floor(fontSize / 4))
            for (let j = 0; j < particleCount; j++) {
              particles.push({
                x: x + Math.random() * charWidth,
                y: y + Math.random() * fontSize,
                size: Math.random() * 3 + 1,
                color,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3 - Math.random() * 2, // Tendência a subir
                alpha: 1,
                delay: Math.random() * 2000 + depth * 100, // Delay baseado na profundidade do elemento
              })
            }
          }
        }
      }
      // Verificar se é um elemento DOM
      else if (element.nodeType === Node.ELEMENT_NODE) {
        const elementNode = element as HTMLElement

        // Verificar se o elemento está visível
        const style = window.getComputedStyle(elementNode)
        if (style.display === "none" || style.visibility === "hidden") return

        const rect = elementNode.getBoundingClientRect()
        const bgColor = style.backgroundColor
        const borderColor = style.borderColor
        const color =
          bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent"
            ? bgColor
            : borderColor !== "rgba(0, 0, 0, 0)" && borderColor !== "transparent"
              ? borderColor
              : "#333"

        // Criar partículas apenas para elementos visíveis com cor
        if (color !== "rgba(0, 0, 0, 0)" && color !== "transparent") {
          const particleCount = Math.max(5, Math.floor((rect.width * rect.height) / 300))
          for (let i = 0; i < particleCount; i++) {
            particles.push({
              x: rect.left + Math.random() * rect.width,
              y: rect.top + Math.random() * rect.height,
              size: Math.random() * 4 + 2,
              color,
              vx: (Math.random() - 0.5) * 3,
              vy: (Math.random() - 0.5) * 3 - Math.random() * 2,
              alpha: 1,
              delay: Math.random() * 2000 + depth * 100,
            })
          }
        }

        // Processar filhos recursivamente
        Array.from(element.childNodes).forEach((child) => {
          createParticlesFromElement(child, depth + 1)
        })
      }
    }

    // Criar partículas a partir de todos os elementos do terminal
    Array.from(terminalContent.childNodes).forEach((child) => {
      createParticlesFromElement(child)
    })

    // Adicionar partículas extras para garantir um efeito visual rico
    const extraParticles = 500
    for (let i = 0; i < extraParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        color: "#ffffff",
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3 - Math.random() * 2,
        alpha: 1,
        delay: Math.random() * 3000,
      })
    }

    // Ocultar o conteúdo original
    terminalContent.style.visibility = "hidden"

    // Tempo de início da animação
    const startTime = Date.now()

    // Função de animação
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const now = Date.now()
      let allGone = true

      // Desenhar e atualizar cada partícula
      for (const particle of particles) {
        // Verificar se a partícula deve começar a se mover
        if (now - startTime < particle.delay) {
          // Desenhar partícula estática antes do delay
          ctx.fillStyle = particle.color
          ctx.globalAlpha = particle.alpha
          ctx.fillRect(particle.x, particle.y, particle.size, particle.size)
          allGone = false
          continue
        }

        // Atualizar posição
        particle.x += particle.vx
        particle.y += particle.vy

        // Reduzir opacidade
        particle.alpha -= 0.01
        if (particle.alpha > 0) {
          allGone = false
          ctx.fillStyle = particle.color
          ctx.globalAlpha = particle.alpha
          ctx.fillRect(particle.x, particle.y, particle.size, particle.size)
        }
      }

      // Se todas as partículas desapareceram, encerrar a animação
      if (allGone) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
        onComplete()
        return
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    // Iniciar a animação
    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [onComplete])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-50" />
}
