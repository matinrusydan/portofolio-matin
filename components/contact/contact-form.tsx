"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const Schema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Tell me a bit more"),
})

type Values = z.infer<typeof Schema>

type ContactFormProps = {
  className?: string
  title?: string
  subtitle?: string
}

export function ContactForm({
  className,
  title = "Establish Connection",
  subtitle = "Plug into the network — I’ll respond soon.",
}: ContactFormProps) {
  const form = useForm<Values>({
    resolver: zodResolver(Schema),
    defaultValues: { name: "", email: "", message: "" },
    mode: "onTouched",
  })

  const [loading, setLoading] = React.useState(false)

  async function onSubmit(values: Values) {
    setLoading(true)
    // Simulate async send. Replace with your API/Action as needed.
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    toast.success("Connection Established. I will get back to you soon.")
    form.reset()
  }

  return (
    <section
      className={cn(
        "relative w-full bg-background text-foreground py-20",
        className,
      )}
    >
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
            <h2 className="text-pretty text-2xl font-semibold md:text-4xl bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              {title}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{subtitle}</p>
          </motion.div>

          {/* Kolom Form */}
          <motion.div
            className="flex-1 max-w-2xl"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6 rounded-lg border border-border bg-secondary/10 p-8 backdrop-blur-sm hover:border-primary/30 transition-colors duration-300"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your name"
                            autoComplete="name"
                            className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="you@example.com"
                            type="email"
                            autoComplete="email"
                            className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell me about the project or idea..."
                            rows={6}
                            className="bg-background/50 border-border/50 focus:border-primary transition-colors resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <EnergySubmit disabled={loading}>
                      {loading ? "Transmitting..." : "Submit"}
                    </EnergySubmit>
                  </motion.div>
                </form>
              </Form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function EnergySubmit({ className, children, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <div className="relative inline-block">
      {/* Glow ring */}
      <span
        className="pointer-events-none absolute -inset-[2px] rounded-[calc(var(--radius-md)+2px)]
        bg-[conic-gradient(from_0deg,oklch(var(--color-ring))_0%,transparent_20%,oklch(var(--color-accent))_50%,transparent_80%)]
        animate-[spin_5s_linear_infinite]"
        aria-hidden="true"
        style={{ filter: "blur(6px)", opacity: 0.6 }}
      />
      <Button
        type="submit"
        className={cn(
          "relative rounded-[var(--radius-md)] border border-border bg-secondary/15",
          "px-6 py-2 text-foreground transition-colors hover:bg-secondary/25",
          className,
        )}
        {...props}
      >
        {children}
      </Button>
    </div>
  )
}
