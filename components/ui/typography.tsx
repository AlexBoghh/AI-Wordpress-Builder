import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const headingVariants = cva(
  "font-semibold tracking-tight text-foreground",
  {
    variants: {
      level: {
        h1: "text-4xl lg:text-5xl leading-tight",
        h2: "text-3xl lg:text-4xl leading-tight", 
        h3: "text-2xl lg:text-3xl leading-snug",
        h4: "text-xl lg:text-2xl leading-snug",
        h5: "text-lg lg:text-xl leading-snug",
        h6: "text-base lg:text-lg leading-snug",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      }
    },
    defaultVariants: {
      level: "h2",
      weight: "semibold",
    },
  }
)

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level, weight, as, ...props }, ref) => {
    const Comp = as || level || "h2"
    return (
      <Comp
        ref={ref}
        className={cn(headingVariants({ level: level || as, weight, className }))}
        {...props}
      />
    )
  }
)
Heading.displayName = "Heading"

const textVariants = cva(
  "text-foreground",
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
      color: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        primary: "text-primary",
        destructive: "text-destructive",
      },
      leading: {
        none: "leading-none",
        tight: "leading-tight",
        snug: "leading-snug",
        normal: "leading-normal",
        relaxed: "leading-relaxed",
        loose: "leading-loose",
      }
    },
    defaultVariants: {
      size: "base",
      weight: "normal",
      color: "default",
      leading: "normal",
    },
  }
)

interface TextProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'color'>,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div"
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size, weight, color, leading, as: Component = "p", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(textVariants({ size, weight, color, leading, className }))}
        {...props}
      />
    )
  }
)
Text.displayName = "Text"