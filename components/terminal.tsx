"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import TerminalInput from "./terminal-input"
import TerminalOutput from "./terminal-output"
import BootSequence from "./boot-sequence"
import WindowControls from "./window-controls"
import ThanosEffect from "./thanos-effect"
import NotFound from "./not-found"

// Tipagem pra gente saber o que cada comando guarda
export type CommandType = {
  command: string
  output: React.ReactNode
  timestamp: number
}

export default function Terminal() {
  // Histórico de comandos pra gente não se perder
  const [history, setHistory] = useState<CommandType[]>([])
  // Flag pra saber se o terminal já "bootou"
  const [booted, setBooted] = useState(false)
  // State pra controlar o tema de cores
  const [theme, setTheme] = useState<"default" | "green" | "blue" | "amber">("default")
  // Ref pra conseguir scrollar o terminal pra baixo automaticamente
  const terminalRef = useRef<HTMLDivElement>(null)
  // States pra controlar as animações malucas
  const [showThanosEffect, setShowThanosEffect] = useState(false)
  const [showNotFound, setShowNotFound] = useState(false)

  // Nossos temas de cores. Simples e direto.
  const themes = {
    default: "text-white",
    green: "text-green-400",
    blue: "text-blue-400",
    amber: "text-amber-400",
  }

  // Efeito pra rolar o terminal pra baixo sempre que um comando novo aparece
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // A função principal que processa os comandos que o usuário digita
  const handleCommand = (cmd: string) => {
    const commandLower = cmd.trim().toLowerCase()
    let output: React.ReactNode

    // Aqui a mágica acontece. Um `if` gigante pra cada comando.
    if (commandLower === "help") {
      output = (
        <div className="py-2">
          <p className="font-bold">Saca só o que você pode fazer:</p>
          <p>
            <span className="font-bold">help</span> → É isso aqui, né? A lista de truques.
          </p>
          <p>
            <span className="font-bold">whoami</span> → Quer saber quem sou eu? Manda esse.
          </p>
          <p>
            <span className="font-bold">ls projects</span> → Pra ver as paradas que eu já codei.
          </p>
          <p>
            <span className="font-bold">open [nome-do-projeto]</span> → Vê os detalhes de um projeto específico.
          </p>
          <p>
            <span className="font-bold">contact</span> → Minhas redes e contatos pra gente trocar uma ideia.
          </p>
          <p>
            <span className="font-bold">clear</span> → Dá um limpa na tela.
          </p>
          <p>
            <span className="font-bold">color [tema]</span> → Muda as cores (default, green, blue, amber).
          </p>
          <p>
            <span className="font-bold">sudo hire-me</span> → Um comando especial pra quem tá recrutando.
          </p>
          <p className="mt-4 text-xs text-gray-500">
            PS: Fiquei sabendo que tem um comando que... bom, digamos que ele quebra a realidade. Use com sabedoria.
          </p>
        </div>
      )
    } else if (commandLower === "whoami") {
      output = (
        <div className="py-2">
          <p className="font-bold text-xl mb-2">E aí, sou o Paulo Oliveira!</p>
          <p className="mb-2">Desenvolvedor Full Stack, viciado em energetico e em criar coisas pra web há mais de 3 anos.</p>
          <p className="mb-1">Minha stack do dia a dia:</p>
          <ul className="list-disc pl-5 mb-2">
            <li>Frontend: React, Next.js, TypeScript (o trio de respeito)</li>
            <li>Backend: Node.js (Express, NestJS) e Python pra brincar com IA</li>
            <li>Banco de Dados: PostgreSQL e MySQL, sem mistério.</li>
            <li>DevOps: Docker, AWS, CI/CD, Azure - pra fazer a mágica acontecer.</li>
          </ul>
          <p className="mb-1">Onde eu estudei?</p>
          <p className="mb-2">Fiz Análise e Desenvolvimento de Sistemas na Anhanguera.</p>
          <p>
            Manda um <span className="font-bold">'ls projects'</span> pra ver meus roles ou <span className="font-bold">'contact'</span> pra gente se conectar.
          </p>
        </div>
      )
    } else if (commandLower === "ls projects") {
      output = (
        <div className="py-2">
          <p className="font-bold mb-2">Dá uma olhada nos meus roles:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="p-2 border border-gray-700 rounded">
              <p className="font-bold">Routina</p>
              <p className="text-sm">Um PWA pra te ajudar a não procrastinar, com um toque de game.</p>
            </div>
            <div className="p-2 border border-gray-700 rounded">
              <p className="font-bold">MobView</p>
              <p className="text-sm">Cansado de abrir o DevTools? Um emulador visual pra facilitar a vida.</p>
            </div>
            <div className="p-2 border border-gray-700 rounded">
              <p className="font-bold">Wally</p>
              <p className="text-sm">PWA pra baixar wallpapers em alta e sem anúncio chato.</p>
            </div>
            <div className="p-2 border border-gray-700 rounded">
              <p className="font-bold">COBOLify</p>
              <p className="text-sm">Sim, eu mexi com COBOL. Uma CLI que usa IA pra gerar código legado. Loucura, né?</p>
            </div>
          </div>
          <p className="mt-2">
            Curtiu algum? Digita <span className="font-bold">'open [nome-do-projeto]'</span> (ex: 'open routina').
          </p>
        </div>
      )
    } else if (commandLower.startsWith("open ")) {
      // Normaliza o nome do projeto pra busca funcionar direito
      const projectName = commandLower.replace("open ", "").trim()
      const projects: Record<string, React.ReactNode> = {
        routina: (
          <div className="py-2">
            <p className="font-bold text-xl mb-2">Routina</p>
            <p className="mb-2">
              O Routina é minha tentativa de deixar o gerenciamento de tarefas menos chato. A ideia é usar gamificação,
              então você ganha XP, sobe de nível e desbloqueia conquistas só por fazer suas coisas.
            </p>
            <p className="mb-1">Tecnologias usadas:</p>
            <ul className="list-disc pl-5 mb-2">
              <li>Next.js, TypeScript, Tailwind CSS</li>
              <li>Node.js, Express, PostgreSQL</li>
            </ul>
            <p>
              Código no GitHub: <a href="https://github.com/esc4n0rx/Routina" target="_blank" rel="noopener noreferrer" className="underline">esc4n0rx/Routina</a>
            </p>
          </div>
        ),
        mobview: (
          <div className="py-2">
            <p className="font-bold text-xl mb-2">MobView</p>
            <p className="mb-2">
              Criei o MobView pra agilizar o trampo de testar layout em diferentes telas. É um emulador visual simples,
              feito com Node.js e Electron, pra dar aquela espiada rápida sem complicação.
            </p>
            <p className="mb-1">Tecnologias usadas:</p>
            <ul className="list-disc pl-5 mb-2">
              <li>Node.js e Electron</li>
            </ul>
            <p>
              Código no GitHub: <a href="https://github.com/esc4n0rx/mobview" target="_blank" rel="noopener noreferrer" className="underline">esc4n0rx/mobview</a>
            </p>
          </div>
        ),
        wally: (
          <div className="py-2">
            <p className="font-bold text-xl mb-2">Wally</p>
            <p className="mb-2">
              Um PWA bem simples pra quem curte wallpapers de qualidade e sem propaganda. A ideia era ser rápido e
              direto ao ponto, usando a API do Wallhaven.
            </p>
            <p className="mb-1">Tecnologias usadas:</p>
            <ul className="list-disc pl-5 mb-2">
              <li>Next.js, Redux, TypeScript</li>
              <li>API do Wallhaven</li>
            </ul>
            <p className="mb-1">Links:</p>
            <p>
              Demo: <a href="https://wally-jade.vercel.app/" target="_blank" rel="noopener noreferrer" className="underline">wally-jade.vercel.app</a>
            </p>
            <p>
              Código no GitHub: <a href="https://github.com/esc4n0rx/wally-pwa" target="_blank" rel="noopener noreferrer" className="underline">esc4n0rx/wally-pwa</a>
            </p>
          </div>
        ),
        cobolify: (
          <div className="py-2">
            <p className="font-bold text-xl mb-2">COBOLify</p>
            <p className="mb-2">
              Esse aqui foi um projeto mais "diferentão". Uma CLI que usa IA (OpenAI, Claude, etc.) para traduzir
              linguagem natural pra COBOL. Uma ponte entre o novo e o legado.
            </p>
            <p className="mb-1">Tecnologias usadas:</p>
            <ul className="list-disc pl-5 mb-2">
              <li>Python</li>
              <li>APIs de IA: OpenAI, Anthropic Claude, Groq, Arcee</li>
            </ul>
            <p>
              Código no GitHub: <a href="https://github.com/esc4n0rx/cobolify" target="_blank" rel="noopener noreferrer" className="underline">esc4n0rx/cobolify</a>
            </p>
          </div>
        ),
      }

      output = projects[projectName] || (
        <p className="text-red-400">
          Opa, esse projeto não existe. Tenta 'ls projects' pra ver a lista.
        </p>
      )
    } else if (commandLower === "contact") {
      output = (
        <div className="py-2">
          <p className="font-bold text-xl mb-2">Bora trocar uma ideia?</p>
          <p>
            E-mail: <a href="mailto:contato.paulooliver9@gmail.com" className="underline">contato.paulooliver9@gmail.com</a>
          </p>
          <p>
            LinkedIn: <a href="https://www.linkedin.com/in/ppaulocunha/" target="_blank" rel="noopener noreferrer" className="underline">ppaulocunha (vamos nos conectar!)</a>
          </p>
          <p>
            GitHub: <a href="https://github.com/esc4n0rx" target="_blank" rel="noopener noreferrer" className="underline">esc4n0rx (onde a mágica acontece)</a>
          </p>
          <p>
            Twitter: <a href="https://twitter.com/paulooliveira_dev" target="_blank" rel="noopener noreferrer" className="underline">@paulooliveira_dev</a>
          </p>
          <p className="mt-2">Tô sempre aberto pra novos projetos e oportunidades. Me chama aí!</p>
        </div>
      )
    } else if (commandLower === "clear") {
      setHistory([])
      return // Retorna aqui pra não adicionar o 'clear' no histórico
    } else if (commandLower === "sudo hire-me") {
      output = (
        <div className="py-2">
          <p className="text-xl font-bold mb-2">Opa, mandou bem no comando!</p>
          <p className="mb-2">Gostei de ver! Se você chegou até aqui, é porque o interesse é real.</p>
          <p className="mt-2">
            Manda um e-mail pra <a href="mailto:contato.paulooliver9@gmail.com?subject=SUDO HIRE-ME" className="underline font-bold">contato.paulooliver9@gmail.com</a> com o assunto
            "SUDO HIRE-ME" que eu passo na frente da fila!
          </p>
          <div className="mt-4 p-3 border border-green-500 rounded-md bg-green-900/20">
            <p className="font-bold">Por que me ter no time?</p>
            <ul className="list-disc pl-5 mt-1">
              <li>Já me virei com uns projetos punk.</li>
              <li>Falo a língua do time sem `git blame`.</li>
              <li>Entrego no prazo e com código limpo.</li>
              <li>Tô sempre aprendendo coisa nova.</li>
            </ul>
          </div>
        </div>
      )
    } else if (commandLower.startsWith("color ")) {
      const newTheme = commandLower.replace("color ", "").trim()
      if (newTheme === "default" || newTheme === "green" || newTheme === "blue" || newTheme === "amber") {
        setTheme(newTheme)
        output = <p>Feito! Tema agora é: {newTheme}</p>
      } else {
        output = <p className="text-red-400">Eita, esse tema não rola. Tenta um desses: default, green, blue, amber</p>
      }
    } else if (commandLower === "clearall") {
      output = (
        <div className="py-2">
          <p className="text-gray-400">Iniciando protocolo de limpeza avançada...</p>
          <p className="text-gray-500 text-sm mt-1">Processando desintegração molecular...</p>
        </div>
      )
      setTimeout(() => {
        setShowThanosEffect(true)
      }, 2000)
    } else {
      output = (
        <p className="text-red-400">
          '{cmd}'? Que comando é esse? Não conheço. Manda um 'help' aí pra ver as opções.
        </p>
      )
    }

    // Atualiza o histórico com o comando que foi digitado e a sua saída
    setHistory([...history, { command: cmd, output, timestamp: Date.now() }])
  }

  // A renderização do componente.
  return (
    <div className={`w-full h-screen flex flex-col ${themes[theme]}`}>
      {showNotFound ? (
        <NotFound />
      ) : (
        <>
          <WindowControls />
          <div className="flex-1 overflow-auto p-4 bg-black terminal-content" ref={terminalRef}>
            {!booted ? (
              <BootSequence onComplete={() => setBooted(true)} />
            ) : (
              <>
                <TerminalOutput history={history} />
                <TerminalInput onCommand={handleCommand} />
              </>
            )}
          </div>
          {showThanosEffect && (
            <ThanosEffect
              onComplete={() => {
                setShowThanosEffect(false)
                setShowNotFound(true)
              }}
            />
          )}
        </>
      )}
    </div>
  )
}