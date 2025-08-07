import { useEffect, useRef, useCallback } from 'react'

interface UseKeyboardNavigationOptions {
  onEscape?: () => void
  onEnter?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  enabled?: boolean
}

export function useKeyboardNavigation(options: UseKeyboardNavigationOptions = {}) {
  const {
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    enabled = true
  } = options

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return

    switch (e.key) {
      case 'Escape':
        onEscape?.()
        break
      case 'Enter':
        onEnter?.()
        break
      case 'ArrowUp':
        onArrowUp?.()
        e.preventDefault()
        break
      case 'ArrowDown':
        onArrowDown?.()
        e.preventDefault()
        break
      case 'ArrowLeft':
        onArrowLeft?.()
        break
      case 'ArrowRight':
        onArrowRight?.()
        break
    }
  }, [enabled, onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight])

  useEffect(() => {
    if (!enabled) return

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown, enabled])
}

// Hook for list navigation
export function useListKeyboardNavigation<T extends HTMLElement = HTMLElement>(
  itemCount: number,
  options: {
    onSelect?: (index: number) => void
    loop?: boolean
    orientation?: 'vertical' | 'horizontal'
    enabled?: boolean
  } = {}
) {
  const { onSelect, loop = true, orientation = 'vertical', enabled = true } = options
  const selectedIndex = useRef(0)
  const itemRefs = useRef<(T | null)[]>([])

  const focusItem = useCallback((index: number) => {
    const item = itemRefs.current[index]
    if (item) {
      item.focus()
      selectedIndex.current = index
    }
  }, [])

  const handleNext = useCallback(() => {
    let nextIndex = selectedIndex.current + 1
    if (nextIndex >= itemCount) {
      nextIndex = loop ? 0 : itemCount - 1
    }
    focusItem(nextIndex)
  }, [itemCount, loop, focusItem])

  const handlePrevious = useCallback(() => {
    let prevIndex = selectedIndex.current - 1
    if (prevIndex < 0) {
      prevIndex = loop ? itemCount - 1 : 0
    }
    focusItem(prevIndex)
  }, [itemCount, loop, focusItem])

  useKeyboardNavigation({
    enabled,
    onArrowDown: orientation === 'vertical' ? handleNext : undefined,
    onArrowUp: orientation === 'vertical' ? handlePrevious : undefined,
    onArrowRight: orientation === 'horizontal' ? handleNext : undefined,
    onArrowLeft: orientation === 'horizontal' ? handlePrevious : undefined,
    onEnter: () => onSelect?.(selectedIndex.current)
  })

  const setItemRef = useCallback((index: number) => (ref: T | null) => {
    itemRefs.current[index] = ref
  }, [])

  return { setItemRef, focusItem, selectedIndex: selectedIndex.current }
}