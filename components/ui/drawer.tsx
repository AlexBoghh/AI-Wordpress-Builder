"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { X } from "lucide-react"
import { useFocusTrap } from "@/hooks/use-focus-trap"

interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  onOpenChange: (open: boolean) => void
  side?: "left" | "right"
  size?: "sm" | "md" | "lg" | "full"
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  full: "max-w-full"
}

export function Drawer({
  open,
  onOpenChange,
  side = "left",
  size = "md",
  className,
  children,
  ...props
}: DrawerProps) {
  const focusTrapRef = useFocusTrap<HTMLDivElement>({ enabled: open })
  
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div
        ref={focusTrapRef}
        className={cn(
          "fixed inset-y-0 z-50 flex w-full flex-col bg-background shadow-xl",
          "transition-transform duration-300 ease-in-out",
          sizeClasses[size],
          side === "left" ? "left-0" : "right-0",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="text-lg font-semibold">Menu</div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  )
}

type DrawerContentProps = React.HTMLAttributes<HTMLDivElement>

export function DrawerContent({ className, ...props }: DrawerContentProps) {
  return (
    <div className={cn("p-4", className)} {...props} />
  )
}