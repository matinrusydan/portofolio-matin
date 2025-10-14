"use client"
/* eslint-disable @next/next/no-img-element */
import * as React from "react"
import { motion } from "framer-motion"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Certificate } from "./certificate-data"

type CertificatesShowcaseProps = {
  items: Certificate[]
  className?: string
  BackgroundComponent?: React.ComponentType // Optional: ParticlesBackground in Dialog
}

export function CertificatesShowcase({ items, className, BackgroundComponent }: CertificatesShowcaseProps) {
  return (
    <section className={cn("relative w-full py-20", "bg-background text-foreground", className)}>
      <div className="container mx-auto px-20">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
          {/* Kolom Teks */}
          <motion.div
            className="flex-1 text-center lg:text-left max-w-2xl"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold md:text-4xl bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Certificates
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Proof of learning and continuous growth through recognized certifications and achievements.
            </p>
          </motion.div>

          {/* Kolom Carousel */}
          <motion.div
            className="flex-1 max-w-4xl"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {items.map((cert, index) => (
                  <CarouselItem key={cert.id} className="basis-[85%] pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05 }}
                      className="h-full"
                    >
                      <TiltCard>
                        <CardDialog cert={cert} BackgroundComponent={BackgroundComponent} />
                      </TiltCard>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="hidden md:flex hover:bg-primary/20 transition-colors" />
              <CarouselNext className="hidden md:flex hover:bg-primary/20 transition-colors" />
            </Carousel>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function CardDialog({
  cert,
  BackgroundComponent,
}: {
  cert: Certificate
  BackgroundComponent?: React.ComponentType
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            "group block w-full overflow-hidden rounded-lg border border-border bg-secondary/10",
            "transition-transform duration-200 hover:scale-[1.01]",
          )}
          aria-label={`Open certificate ${cert.title}`}
        >
          <div className="aspect-[4/3] w-full overflow-hidden">
            <img src={cert.image || "/placeholder.svg"} alt={cert.title} className="h-full w-full object-cover" />
          </div>
          <div className="flex items-center justify-between p-3 text-left">
            <div>
              <h3 className="text-sm font-semibold">{cert.title}</h3>
              <p className="text-xs text-muted-foreground">{cert.issuer}</p>
            </div>
            <span
              className="inline-flex h-8 items-center justify-center rounded-md border border-border px-3 text-xs"
              aria-hidden="true"
            >
              View
            </span>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{cert.title}</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-30">
            {BackgroundComponent ? <BackgroundComponent /> : null}
          </div>
          <img
            src={cert.image || "/placeholder.svg"}
            alt={cert.title}
            className="h-auto w-full rounded-md border border-border"
          />
          {cert.url ? (
            <div className="mt-4">
              <Button asChild>
                <a href={cert.url} target="_blank" rel="noopener noreferrer">
                  Verify
                </a>
              </Button>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    function onMove(e: MouseEvent) {
      const r = el!.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      const rx = (py - 0.5) * -12
      const ry = (px - 0.5) * 12
      el!.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`
    }
    function onLeave() {
      el!.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)"
    }
    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", onLeave)
    return () => {
      el.removeEventListener("mousemove", onMove)
      el.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="will-change-transform transition-transform duration-150"
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  )
}
