import * as React from "react"
import { cn } from "./utils"
import { Link } from "react-router-dom"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "cta"
  size?: "default" | "sm" | "lg" | "icon"
  href?: string
  asLink?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", href, asLink, ...props }, ref) => {
    const buttonClasses = cn(
      "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
      {
        // Default variant (matches primary)
        "rounded-lg bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
        // Outline variant
        "rounded-lg border border-border bg-transparent hover:bg-accent hover:text-accent-foreground": variant === "outline",
        // Ghost variant
        "rounded-lg hover:bg-accent hover:text-accent-foreground": variant === "ghost",
        // Link variant
        "underline-offset-4 hover:underline": variant === "link",
        // CTA variant - matches current Hero/ClosingCTA styling exactly
        "rounded-[10px] bg-button-green text-text-dark transition-transform scale-[1.50] hover:scale-[1.55] active:scale-[1.05] hover:bg-button-green/90 hover:shadow-lg whitespace-nowrap font-bold font-['Fraunces']": variant === "cta",
        // Sizes
        "h-10 px-4 py-2": size === "default" && variant !== "cta",
        "h-9 px-3": size === "sm" && variant !== "cta",
        "h-11 px-8": size === "lg" && variant !== "cta",
        "h-10 w-10": size === "icon" && variant !== "cta",
      },
      className
    )

    // If href is provided, render as Link
    if (href || asLink) {
      return (
        <Link to={href || "#"} className={buttonClasses}>
          {props.children}
        </Link>
      )
    }

    return (
      <button
        className={buttonClasses}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

