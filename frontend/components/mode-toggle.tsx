"use client"

import * as React from "react"
import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  // We need to wait for the component to mount to know the resolvedTheme
  // to avoid hydration mismatches, as the server doesn't know the theme.
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  if (!mounted) {
    // Render a placeholder or null on the server and during initial client render
    // to prevent hydration mismatch, then render the actual button once mounted.
    // Using a button with a placeholder style to maintain layout.
    return <Button variant="secondary" size="icon" disabled />
  }

  return (
    <Button variant="secondary" size="icon" onClick={toggleTheme}>
      {theme === "system" ? (
        <Laptop className="h-[1.2rem] w-[1.2rem]" />
      ) : resolvedTheme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
} 