"use client"

import * as React from "react"
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
        "relative w-full bg-background text-foreground",
        "px-6 py-10 md:px-10 md:py-16 lg:px-16",
        className,
      )}
    >
      <header className="max-w-2xl">
        <h2 className="text-pretty text-2xl font-semibold md:text-4xl">{title}</h2>
        <p className="mt-2 text-muted-foreground">{subtitle}</p>
      </header>

      <div className="mt-8 max-w-2xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 rounded-lg border border-border bg-secondary/10 p-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" autoComplete="name" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" type="email" autoComplete="email" {...field} />
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
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell me about the project or idea..." rows={6} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <EnergySubmit disabled={loading}>{loading ? "Transmitting..." : "Submit"}</EnergySubmit>
          </form>
        </Form>
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
