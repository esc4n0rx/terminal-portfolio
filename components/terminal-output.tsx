import type { CommandType } from "./terminal"

interface TerminalOutputProps {
  history: CommandType[]
}

export default function TerminalOutput({ history }: TerminalOutputProps) {
  return (
    <div className="mb-4">
      {history.map((item, index) => (
        <div key={`${item.timestamp}-${index}`} className="mb-2">
          <div className="flex">
            <span className="mr-2">C:\Users\paulo.oliveira&gt;</span>
            <span>{item.command}</span>
          </div>
          <div className="ml-0">{item.output}</div>
        </div>
      ))}
    </div>
  )
}
