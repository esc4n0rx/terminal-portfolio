"use client"
import { JetBrains_Mono } from "next/font/google"
import Terminal from "@/components/terminal"

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export default function Home() {
  return (
    <main className={`${jetbrainsMono.className} min-h-screen bg-black text-white p-0 m-0 overflow-hidden`}>
      <Terminal />
    </main>
  )
}
