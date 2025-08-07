import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const stackVariants = cva(
  "flex",
  {
    variants: {
      direction: {
        row: "flex-row",
        column: "flex-col",
        "row-reverse": "flex-row-reverse",
        "column-reverse": "flex-col-reverse",
      },
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        baseline: "items-baseline",
        stretch: "items-stretch",
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
      },
      wrap: {
        wrap: "flex-wrap",
        nowrap: "flex-nowrap",
        "wrap-reverse": "flex-wrap-reverse",
      },
      gap: {
        0: "gap-0",
        1: "gap-1",   // 8px
        2: "gap-2",   // 16px
        3: "gap-3",   // 24px
        4: "gap-4",   // 32px
        5: "gap-5",   // 40px
        6: "gap-6",   // 48px
        8: "gap-8",   // 64px
        10: "gap-10", // 80px
        12: "gap-12", // 96px
      }
    },
    defaultVariants: {
      direction: "row",
      align: "stretch",
      justify: "start",
      wrap: "nowrap",
      gap: 0,
    },
  }
)

interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {
  as?: React.ElementType
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, direction, align, justify, wrap, gap, as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(stackVariants({ direction, align, justify, wrap, gap, className }))}
        {...props}
      />
    )
  }
)
Stack.displayName = "Stack"

// Convenience components
export const HStack = React.forwardRef<HTMLDivElement, Omit<StackProps, "direction">>(
  (props, ref) => <Stack ref={ref} direction="row" {...props} />
)
HStack.displayName = "HStack"

export const VStack = React.forwardRef<HTMLDivElement, Omit<StackProps, "direction">>(
  (props, ref) => <Stack ref={ref} direction="column" {...props} />
)
VStack.displayName = "VStack"