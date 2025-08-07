import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = (event: MediaQueryListEvent) => setMatches(event.matches)
    
    // Modern browsers
    if (media.addEventListener) {
      media.addEventListener('change', listener)
      return () => media.removeEventListener('change', listener)
    } else {
      // Fallback for older browsers
      media.addListener(listener)
      return () => media.removeListener(listener)
    }
  }, [matches, query])

  return matches
}

// Preset breakpoints matching Tailwind defaults
export const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
} as const

// Convenience hooks
export function useIsMobile() {
  return !useMediaQuery(breakpoints.md)
}

export function useIsTablet() {
  const isAboveMobile = useMediaQuery(breakpoints.md)
  const isAboveTablet = useMediaQuery(breakpoints.lg)
  return isAboveMobile && !isAboveTablet
}

export function useIsDesktop() {
  return useMediaQuery(breakpoints.lg)
}

// Hook to get current breakpoint
export function useBreakpoint() {
  const is2xl = useMediaQuery(breakpoints['2xl'])
  const isXl = useMediaQuery(breakpoints.xl)
  const isLg = useMediaQuery(breakpoints.lg)
  const isMd = useMediaQuery(breakpoints.md)
  const isSm = useMediaQuery(breakpoints.sm)

  if (is2xl) return '2xl'
  if (isXl) return 'xl'
  if (isLg) return 'lg'
  if (isMd) return 'md'
  if (isSm) return 'sm'
  return 'xs'
}