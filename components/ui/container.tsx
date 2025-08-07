import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const containerVariants = cva(
  "mx-auto w-full",
  {
    variants: {
      size: {
        sm: "max-w-2xl",
        md: "max-w-4xl",
        lg: "max-w-6xl",
        xl: "max-w-7xl",
        full: "max-w-full",
      },
      padding: {
        none: "",
        sm: "px-3 sm:px-4",   // 24px / 32px
        md: "px-4 sm:px-5",   // 32px / 40px
        lg: "px-5 sm:px-6",   // 40px / 48px
        xl: "px-6 sm:px-8",   // 48px / 64px
      }
    },
    defaultVariants: {
      size: "lg",
      padding: "md",
    },
  }
)

interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  as?: React.ElementType
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(containerVariants({ size, padding, className }))}
        {...props}
      />
    )
  }
)
Container.displayName = "Container"

// Section component for consistent page sections
const sectionVariants = cva(
  "",
  {
    variants: {
      spacing: {
        none: "",
        sm: "py-6 md:py-8",     // 48px / 64px
        md: "py-8 md:py-10",    // 64px / 80px
        lg: "py-10 md:py-12",   // 80px / 96px
        xl: "py-12 md:py-16",   // 96px / 128px
      }
    },
    defaultVariants: {
      spacing: "md",
    },
  }
)

interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  container?: boolean
  containerSize?: VariantProps<typeof containerVariants>["size"]
  containerPadding?: VariantProps<typeof containerVariants>["padding"]
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing, container = true, containerSize, containerPadding, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(sectionVariants({ spacing, className }))}
        {...props}
      >
        {container ? (
          <Container size={containerSize} padding={containerPadding}>
            {children}
          </Container>
        ) : (
          children
        )}
      </section>
    )
  }
)
Section.displayName = "Section"