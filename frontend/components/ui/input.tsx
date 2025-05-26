"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAgentRunCtx } from "@/app/providers/agent-run-provider";
import { useRouter } from "next/navigation";

// Define the common props and specific props for input and textarea
interface BaseInputProps {
  cacheKey?: string;
  multiline?: boolean;
  className?: string;
  isLoading?: boolean;
}

// Combine base props with HTML input attributes, omitting onChange
type InputElementProps = BaseInputProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">;

// Define the overall component props - a union of both types plus custom onChange handling
interface InputProps extends Omit<InputElementProps, "className"> {
  className?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onKeyDown?: React.KeyboardEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  defaultValue?: string;
  isLoading?: boolean;
}

interface CachedQuery {
  value: string;
  expiresAt: number;
}

function Input({
  className,
  type,
  cacheKey = "cachedSearchQuery",
  defaultValue,
  value: propValue,
  onChange: propOnChange,
  onKeyDown: propOnKeyDown,
  multiline = false,
  isLoading = false,
  ...props
}: InputProps) {
  // Initialize state with defaultValue or empty string for uncontrolled
  // For controlled, parent's value (propValue) is the source of truth
  const [internalValue, setInternalValue] = React.useState(
    defaultValue || "",
  );
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const router = useRouter();
  const [localLoading, setLocalLoading] = React.useState(false);

  const {
    threadId,
    isLoading: agentIsLoading,
    send: sendToAgent,
  } = useAgentRunCtx();

  React.useEffect(() => {
    if (threadId) {
      router.push(`/${threadId}`);
    }
  }, [threadId, router]);


  const isControlled = propValue !== undefined;
  const displayValue = isControlled ? propValue : internalValue;
  const loading = isLoading || agentIsLoading || localLoading;

  // Effect to load from localStorage on initial mount (for uncontrolled mode)
  React.useEffect(() => {
    if (!isControlled && typeof window !== "undefined" && cacheKey) {
      const cachedItem = localStorage.getItem(cacheKey);
      if (cachedItem) {
        try {
          const parsedItem: CachedQuery = JSON.parse(cachedItem);
          if (parsedItem.expiresAt > Date.now()) {
            setInternalValue(parsedItem.value);
          } else {
            localStorage.removeItem(cacheKey); // Remove expired item
          }
        } catch {
          // Remove stale cached value
          localStorage.removeItem(cacheKey);
        }
      }
    }
  }, [cacheKey, isControlled]);

  // Auto-resize textarea height when content changes
  React.useEffect(() => {
    if (multiline && textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = "auto";
      // Set to scrollHeight to expand the textarea
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.max(scrollHeight, 48)}px`;
    }
  }, [displayValue, multiline]); // Depends on the actual displayed value

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
      if (typeof window !== "undefined" && cacheKey) {
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes in milliseconds
        const itemToCache: CachedQuery = { value: newValue, expiresAt };
        localStorage.setItem(cacheKey, JSON.stringify(itemToCache));
      }
    }
    if (propOnChange) {
      propOnChange(e); // Always call propOnChange if provided
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    if (multiline && e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      buttonRef.current?.click();
    }
    if (propOnKeyDown) {
      propOnKeyDown(e);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = displayValue;
    if (!query || !query.trim()) {
      return;
    }
    if (loading) {
      return;
    }
    setLocalLoading(true);
    sendToAgent(query);
    if (!isControlled) {
      setInternalValue("");
      if (typeof window !== "undefined" && cacheKey) {
        localStorage.removeItem(cacheKey);
      }
    }
  };

  const sharedClassName = cn(
    "relative z-1 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground bg-white dark:bg-neutral-950 border-input min-w-0 rounded-md border px-3 py-1 pr-10 text-md shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    "flex items-center",
    className,
  );

  return (
    <form onSubmit={handleSubmit} className="rainbow-input relative flex items-center w-full">
      {multiline ? (
        <textarea
          ref={textareaRef}
          value={displayValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={cn(
            sharedClassName,
            "w-full resize-none overflow-hidden whitespace-pre-wrap break-words py-[11px]",
            "!flex-col !items-start",
          )}
          rows={1}
          style={{
            minHeight: "48px",
          }}
          disabled={loading || props.disabled}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          type={type}
          value={displayValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={cn(sharedClassName, "h-9 w-full")}
          disabled={loading || props.disabled}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      <button
        ref={buttonRef}
        type="submit"
        className="absolute inset-y-0 right-0 z-10 flex items-center justify-center w-10 text-muted-foreground hover:text-foreground"
        aria-label="Submit"
        disabled={loading || props.disabled}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "→"}
      </button>
    </form>
  );
}

export { Input };
