'use client';

import * as React from "react"

import { cn } from "@/lib/utils"

// Define a type for the props to make it clear, extending standard input attributes
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  cacheKey?: string; // Allow an optional cacheKey prop
}

function Input({
  className,
  type,
  cacheKey = "cachedSearchQuery", // Default key for localStorage
  defaultValue,
  onChange: propOnChange, // Renamed to avoid conflict with internal handler
  ...props
}: InputProps) {
  // Initialize state with defaultValue or empty string
  const [inputValue, setInputValue] = React.useState(defaultValue || "");

  // Effect to load from localStorage on initial mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const cachedValue = localStorage.getItem(cacheKey);
      if (cachedValue !== null) {
        setInputValue(cachedValue);
      }
    }
  }, [cacheKey]); // Runs once on mount (if cacheKey doesn't change)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (typeof window !== "undefined") {
      localStorage.setItem(cacheKey, newValue);
    }
    if (propOnChange) {
      propOnChange(e); // Call original onChange if it exists
    }
  };

  return (
    <div className="relative flex items-center w-full">
      <input
        type={type}
        value={inputValue} // Use the internal state for value
        onChange={handleChange} // Use the new handleChange
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pr-10 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props} // Spread other props like placeholder, etc.
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-muted-foreground hover:text-foreground"
        aria-label="Submit"
      >
        →
      </button>
    </div>
  )
}

export { Input }
