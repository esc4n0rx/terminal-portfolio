"use client"

import { useEffect, useRef } from "react"

interface ThanosEffectProps {
  onComplete: () => void
}

export default function ThanosEffect({ onComplete }: ThanosEffectProps) {
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const terminalElement = document.querySelector(".terminal-content") as HTMLElement
    if (!terminalElement) {
      onComplete()
      return
    }

    const particles: Array<{
      element: HTMLElement
      originalRect: DOMRect
      vx: number
      vy: number
      rotation: number
      rotationSpeed: number
      scale: number
      fadeSpeed: number
      delay: number
    }> = []

    const createParticlesFromText = () => {
      // Pegar todos os elementos de texto de forma mais eficiente
      const walker = document.createTreeWalker(
        terminalElement,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const text = node.textContent?.trim()
            return text && text.length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
          }
        }
      )

      const textNodes: Node[] = []
      let node
      while (node = walker.nextNode()) {
        textNodes.push(node)
      }

      // Agrupar texto em pedaços maiores (por linha/elemento pai)
      const textGroups = new Map<Element, string>()
      
      textNodes.forEach(textNode => {
        const parent = textNode.parentElement
        if (!parent) return
        
        const existingText = textGroups.get(parent) || ''
        textGroups.set(parent, existingText + textNode.textContent)
      })

      // Criar partículas apenas para grupos de texto
      let delayCounter = 0
      
      textGroups.forEach((text, parentElement) => {
        const rect = parentElement.getBoundingClientRect()
        const style = window.getComputedStyle(parentElement)
        
        // Pular elementos muito pequenos ou invisíveis
        if (rect.width < 5 || rect.height < 5) return
        
        // Dividir o texto em pedaços menores (palavras ou grupos de palavras)
        const chunks = text.split(/\s+/).filter(chunk => chunk.length > 0)
        const maxChunksPerElement = Math.min(chunks.length, 8) // Limite máximo
        
        for (let i = 0; i < maxChunksPerElement; i++) {
          const chunk = chunks[i] || chunks[chunks.length - 1]
          
          // Criar elemento da partícula
          const particle = document.createElement('div')
          particle.textContent = chunk
          particle.style.cssText = `
            position: fixed;
            left: ${rect.left + (i / maxChunksPerElement) * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
            font-size: ${style.fontSize};
            color: ${style.color};
            font-family: ${style.fontFamily};
            font-weight: ${style.fontWeight};
            pointer-events: none;
            z-index: 9999;
            white-space: nowrap;
            user-select: none;
            opacity: 1;
            transform-origin: center;
          `
          
          document.body.appendChild(particle)
          
          particles.push({
            element: particle,
            originalRect: rect,
            vx: (Math.random() - 0.5) * 3,
            vy: Math.random() * 2 + 0.5,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 2,
            scale: 1,
            fadeSpeed: 0.008 + Math.random() * 0.004,
            delay: delayCounter * 100
          })
          
          delayCounter++
        }
      })

      console.log(`Criadas ${particles.length} partículas`) // Debug
    }

    const animate = () => {
      const now = Date.now()
      let allGone = true

      particles.forEach((particle, index) => {
        // Verificar delay
        if (now < particle.delay) {
          allGone = false
          return
        }

        const element = particle.element
        if (!element.parentNode) return

        const currentOpacity = parseFloat(element.style.opacity || '1')
        if (currentOpacity <= 0) {
          element.remove()
          return
        }

        allGone = false

        // Atualizar física
        const currentLeft = parseFloat(element.style.left)
        const currentTop = parseFloat(element.style.top)
        
        particle.vy += 0.03 // gravidade
        particle.rotation += particle.rotationSpeed
        particle.scale -= 0.002
        particle.scale = Math.max(0, particle.scale)

        const newLeft = currentLeft + particle.vx
        const newTop = currentTop + particle.vy
        const newOpacity = Math.max(0, currentOpacity - particle.fadeSpeed)

        // Aplicar transformações
        element.style.left = `${newLeft}px`
        element.style.top = `${newTop}px`
        element.style.opacity = newOpacity.toString()
        element.style.transform = `rotate(${particle.rotation}deg) scale(${particle.scale})`
      })

      if (allGone) {
        // Limpar partículas restantes
        particles.forEach(particle => {
          if (particle.element.parentNode) {
            particle.element.remove()
          }
        })
        setTimeout(onComplete, 500)
      } else {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    const startDisintegration = () => {
      // Criar partículas otimizadas
      createParticlesFromText()
      
      // Ocultar conteúdo original após pequeno delay
      setTimeout(() => {
        terminalElement.style.visibility = 'hidden'
        animate()
      }, 200)
    }

    startDisintegration()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      // Limpar partículas
      particles.forEach(particle => {
        if (particle.element.parentNode) {
          particle.element.remove()
        }
      })
    }
  }, [onComplete])

  return <div className="fixed inset-0 z-50 pointer-events-none" />
}