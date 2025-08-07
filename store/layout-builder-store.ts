import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { 
  Layout, 
  Section, 
  LayoutBuilderState, 
  LayoutSettings,
  LayoutHistory 
} from '@/types/layout-builder'

interface LayoutBuilderStore extends LayoutBuilderState {
  // Actions
  setLayout: (layout: Layout) => void
  addSection: (section: Section) => void
  updateSection: (id: string, updates: Partial<Section>) => void
  deleteSection: (id: string) => void
  reorderSections: (fromIndex: number, toIndex: number) => void
  selectSection: (id: string | null) => void
  selectBlock: (id: string | null) => void
  updateSettings: (settings: Partial<LayoutSettings>) => void
  undo: () => void
  redo: () => void
  setPreviewMode: (mode: 'edit' | 'preview') => void
  setDeviceView: (device: 'mobile' | 'tablet' | 'desktop') => void
  markDirty: (isDirty: boolean) => void
  setSaving: (isSaving: boolean) => void
  
  // Helper methods
  pushToHistory: (layout: Layout) => void
  canUndo: () => boolean
  canRedo: () => boolean
}

const MAX_HISTORY_SIZE = 20

const initialState: LayoutBuilderState = {
  layout: null,
  selectedSectionId: null,
  selectedBlockId: null,
  isDirty: false,
  isSaving: false,
  history: {
    past: [],
    present: null as any,
    future: []
  },
  previewMode: 'edit',
  deviceView: 'desktop'
}

export const useLayoutBuilderStore = create<LayoutBuilderStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        setLayout: (layout) => set((state) => {
          state.layout = layout
          state.history.present = layout
          state.history.past = []
          state.history.future = []
          state.isDirty = false
        }),

        addSection: (section) => set((state) => {
          if (!state.layout) return
          
          state.layout.sections.push(section)
          state.layout.updatedAt = new Date()
          state.pushToHistory(state.layout)
          state.isDirty = true
        }),

        updateSection: (id, updates) => set((state) => {
          if (!state.layout) return
          
          const sectionIndex = state.layout.sections.findIndex(s => s.id === id)
          if (sectionIndex === -1) return
          
          state.layout.sections[sectionIndex] = {
            ...state.layout.sections[sectionIndex],
            ...updates
          }
          state.layout.updatedAt = new Date()
          state.pushToHistory(state.layout)
          state.isDirty = true
        }),

        deleteSection: (id) => set((state) => {
          if (!state.layout) return
          
          state.layout.sections = state.layout.sections.filter(s => s.id !== id)
          state.layout.updatedAt = new Date()
          state.pushToHistory(state.layout)
          state.isDirty = true
          
          // Clear selection if deleted section was selected
          if (state.selectedSectionId === id) {
            state.selectedSectionId = null
          }
        }),

        reorderSections: (fromIndex, toIndex) => set((state) => {
          if (!state.layout) return
          
          const sections = [...state.layout.sections]
          const [removed] = sections.splice(fromIndex, 1)
          sections.splice(toIndex, 0, removed)
          
          // Update order values
          sections.forEach((section, index) => {
            section.order = index
          })
          
          state.layout.sections = sections
          state.layout.updatedAt = new Date()
          state.pushToHistory(state.layout)
          state.isDirty = true
        }),

        selectSection: (id) => set((state) => {
          state.selectedSectionId = id
          state.selectedBlockId = null // Clear block selection
        }),

        selectBlock: (id) => set((state) => {
          state.selectedBlockId = id
        }),

        updateSettings: (settings) => set((state) => {
          if (!state.layout) return
          
          state.layout.settings = {
            ...state.layout.settings,
            ...settings
          }
          state.layout.updatedAt = new Date()
          state.pushToHistory(state.layout)
          state.isDirty = true
        }),

        undo: () => set((state) => {
          if (state.history.past.length === 0) return
          
          const previous = state.history.past[state.history.past.length - 1]
          const newPast = state.history.past.slice(0, -1)
          
          state.history = {
            past: newPast,
            present: previous,
            future: [state.history.present, ...state.history.future]
          }
          state.layout = previous
          state.isDirty = true
        }),

        redo: () => set((state) => {
          if (state.history.future.length === 0) return
          
          const next = state.history.future[0]
          const newFuture = state.history.future.slice(1)
          
          state.history = {
            past: [...state.history.past, state.history.present],
            present: next,
            future: newFuture
          }
          state.layout = next
          state.isDirty = true
        }),

        setPreviewMode: (mode) => set((state) => {
          state.previewMode = mode
        }),

        setDeviceView: (device) => set((state) => {
          state.deviceView = device
        }),

        markDirty: (isDirty) => set((state) => {
          state.isDirty = isDirty
        }),

        setSaving: (isSaving) => set((state) => {
          state.isSaving = isSaving
        }),

        pushToHistory: (layout) => {
          const state = get()
          const newPast = [...state.history.past, state.history.present].slice(-MAX_HISTORY_SIZE)
          
          set((state) => {
            state.history = {
              past: newPast,
              present: JSON.parse(JSON.stringify(layout)), // Deep clone
              future: []
            }
          })
        },

        canUndo: () => {
          const state = get()
          return state.history.past.length > 0
        },

        canRedo: () => {
          const state = get()
          return state.history.future.length > 0
        }
      })),
      {
        name: 'layout-builder-storage',
        partialize: (state) => ({
          layout: state.layout,
          deviceView: state.deviceView
        })
      }
    )
  )
)