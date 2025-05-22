"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react"; // Laptop icon removed
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    // Toggle between "light" and "dark" modes only.
    // If current resolved theme is dark, switch to light. Otherwise, switch to dark.
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  // Wait for mount to know the final theme and avoid hydration issues
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Show a placeholder button until mounted to avoid hydration mismatch
    // and to prevent interaction before the theme is known.
    return <Button variant="secondary" size="icon" disabled />;
  }

  return (
    <Button variant="secondary" size="icon" onClick={toggleTheme}>
      {resolvedTheme === "dark" ? (
        // If current theme is dark, show Sun icon (to switch to light)
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        // If current theme is light, show Moon icon (to switch to dark)
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
