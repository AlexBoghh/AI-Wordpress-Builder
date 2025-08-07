import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { LucideIcon } from "lucide-react"

const emptyStateVariants = cva(
  "flex flex-col items-center justify-center text-center",
  {
    variants: {
      size: {
        sm: "py-6 px-4",
        md: "py-10 px-6",
        lg: "py-16 px-8",
      }
    },
    defaultVariants: {
      size: "md",
    },
  }
)

interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "secondary"
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ 
    className, 
    size, 
    icon: Icon, 
    title, 
    description, 
    action, 
    secondaryAction,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(emptyStateVariants({ size, className }))}
        {...props}
      >
        {Icon && (
          <div className="mb-4 rounded-full bg-muted p-3">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        
        {description && (
          <p className="mb-6 max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        )}
        
        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-3">
            {action && (
              <Button
                onClick={action.onClick}
                variant={action.variant || "default"}
              >
                {action.label}
              </Button>
            )}
            
            {secondaryAction && (
              <Button
                onClick={secondaryAction.onClick}
                variant="ghost"
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }
)
EmptyState.displayName = "EmptyState"