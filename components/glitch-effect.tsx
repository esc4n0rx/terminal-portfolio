"use client"

import { useEffect, useState } from "react"

interface GlitchEffectProps {
  onComplete: () => void
}

export default function GlitchEffect({ onComplete }: GlitchEffectProps) {
  const [glitchIntensity, setGlitchIntensity] = useState(0)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const duration = 3000 // 3 segundos
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Calcular a intensidade do glitch baseado no progresso
      let intensity = 0
      if (progress < 0.3) {
        // Crescer rapidamente
        intensity = progress / 0.3
      } else if (progress < 0.7) {
        // Manter intensidade alta
        intensity = 1
      } else {
        // Diminuir gradualmente
        intensity = (1 - progress) / 0.3
      }

      setGlitchIntensity(intensity)
      setPhase(elapsed / 100) // Para animar as distorções

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        onComplete()
      }
    }

    animate()
  }, [onComplete])

  // Gerar valores aleatórios para os glitches baseado na intensidade
  const glitchValues = {
    hue: Math.sin(phase) * glitchIntensity * 180,
    translateX: Math.sin(phase * 2) * glitchIntensity * 10,
    translateY: Math.cos(phase * 3) * glitchIntensity * 5,
    scaleX: 1 + Math.sin(phase * 4) * glitchIntensity * 0.1,
    scaleY: 1 + Math.cos(phase * 5) * glitchIntensity * 0.1,
    skewX: Math.sin(phase * 6) * glitchIntensity * 5,
  }

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {/* Overlay principal com distorções */}
      <div
        className="absolute inset-0 mix-blend-difference"
        style={{
          background: `linear-gradient(45deg, 
            rgba(255, 0, 0, ${glitchIntensity * 0.3}), 
            rgba(0, 255, 0, ${glitchIntensity * 0.2}), 
            rgba(0, 0, 255, ${glitchIntensity * 0.3}))`,
          filter: `hue-rotate(${glitchValues.hue}deg)`,
          transform: `
            translateX(${glitchValues.translateX}px) 
            translateY(${glitchValues.translateY}px)
            scaleX(${glitchValues.scaleX})
            scaleY(${glitchValues.scaleY})
            skewX(${glitchValues.skewX}deg)
          `,
        }}
      />

      {/* Linhas de interferência */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="absolute left-0 right-0 bg-white mix-blend-difference"
          style={{
            height: Math.random() * 3 + 1,
            top: `${Math.random() * 100}%`,
            opacity: glitchIntensity * (Math.random() * 0.8 + 0.2),
            transform: `translateX(${Math.sin(phase + i) * glitchIntensity * 50}px)`,
          }}
        />
      ))}

      {/* Blocos de ruído */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={`noise-${i}`}
          className="absolute bg-white mix-blend-overlay"
          style={{
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 90}%`,
            width: Math.random() * 100 + 50,
            height: Math.random() * 50 + 20,
            opacity: glitchIntensity * Math.random() * 0.5,
            transform: `rotate(${Math.sin(phase + i) * 180}deg)`,
            filter: `hue-rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}

      {/* Efeito de scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, ${glitchIntensity * 0.1}) 2px,
            rgba(255, 255, 255, ${glitchIntensity * 0.1}) 4px
          )`,
        }}
      />
    </div>
  )
}