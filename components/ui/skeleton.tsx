import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// Specific skeleton components for common patterns
function SkeletonText({
  lines = 1,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { lines?: number }) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4 bg-muted",
            i === lines - 1 && lines > 1 && "w-3/4"
          )}
        />
      ))}
    </div>
  )
}

function SkeletonCard({
  className,
  showImage = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { showImage?: boolean }) {
  return (
    <div
      className={cn("rounded-lg border bg-card p-4 space-y-3", className)}
      {...props}
    >
      {showImage && <Skeleton className="h-48 w-full rounded-md" />}
      <Skeleton className="h-6 w-2/3" />
      <SkeletonText lines={2} />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  )
}

function SkeletonButton({
  className,
  size = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  size?: "default" | "sm" | "lg" | "icon"
}) {
  const sizeClasses = {
    default: "h-10 w-24",
    sm: "h-9 w-20",
    lg: "h-11 w-28",
    icon: "h-10 w-10",
  }

  return (
    <Skeleton
      className={cn(sizeClasses[size], "rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton, SkeletonText, SkeletonCard, SkeletonButton }