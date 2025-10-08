import { Header } from "@/components/header"
import { Hero } from "@/components/hero"

export default function Page() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <Header />
      <Hero />
    </main>
  )
}
