'use client';

import * as React from "react"

import { cn } from "@/lib/utils"

// Define the common props and specific props for input and textarea
interface BaseInputProps {
  cacheKey?: string;
  multiline?: boolean;
  className?: string;
}

// Combine base props with HTML input attributes, omitting onChange
type InputElementProps = BaseInputProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>;
type TextareaElementProps = BaseInputProps & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'onKeyDown'>;

// Define the overall component props - a union of both types plus custom onChange handling
interface InputProps extends Omit<InputElementProps, 'className'> {
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

function Input({
  className,
  type,
  cacheKey = "cachedSearchQuery",
  defaultValue,
  onChange: propOnChange,
  onKeyDown: propOnKeyDown,
  multiline = false,
  ...props
}: InputProps) {
  // Initialize state with defaultValue or empty string
  const [inputValue, setInputValue] = React.useState(defaultValue || "");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Effect to load from localStorage on initial mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const cachedValue = localStorage.getItem(cacheKey);
      if (cachedValue !== null) {
        setInputValue(cachedValue);
      }
    }
  }, [cacheKey]);

  // Auto-resize textarea height when content changes
  React.useEffect(() => {
    if (multiline && textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set to scrollHeight to expand the textarea
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.max(scrollHeight, 48)}px`;
    }
  }, [inputValue, multiline]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (typeof window !== "undefined") {
      localStorage.setItem(cacheKey, newValue);
    }
    if (propOnChange) {
      propOnChange(e as any);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (multiline && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      buttonRef.current?.click();
    }
    if (propOnKeyDown) {
      propOnKeyDown(e);
    }
  };

  const sharedClassName = cn(
    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input min-w-0 rounded-md border bg-transparent px-3 py-1 pr-10 text-md shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    className
  );

  return (
    <div className="relative flex items-center w-full">
      {multiline ? (
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={cn(
            sharedClassName,
            "w-full resize-none overflow-hidden whitespace-pre-wrap break-words py-3"
          )}
          rows={1}
          style={{ 
            minHeight: "48px"
          }}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          type={type}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={cn(
            sharedClassName,
            "flex h-9 w-full"
          )}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      <button
        ref={buttonRef}
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
